import base64
import hashlib
import hmac
import json
import urllib.error
import urllib.request

from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, BasePermission
from rest_framework.parsers import JSONParser
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password, make_password
from django.db.models import Avg
from django.db import transaction
from datetime import datetime, timedelta
from decimal import Decimal
import jwt
from django.conf import settings

from .models import *
from .serializers import *
from . import email_service
from .authentication import JWTAuthenticationAllowUnverified

# --- Auth Views (Matching Schema) ---

class IsStoreAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_staff or user.is_superuser or getattr(user, 'role', '') == 'admin')
        )

def create_access_token(user_id):
    expire = datetime.utcnow() + timedelta(days=30)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get('phone')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            
        if not user.check_password(password):
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            
        if not user.is_email_verified:
            return Response({"detail": "Please verify your email before logging in"}, status=status.HTTP_403_FORBIDDEN)
            
        token = create_access_token(user.id)
        return Response({
            "user": UserSerializer(user).data,
            "token": token
        })


class RegisterView(APIView):
    """POST /api/auth/register — Store pending registration and send OTP.
    The actual User account is ONLY created after OTP verification."""
    permission_classes = [AllowAny]

    def post(self, request):
        user_email = request.data.get('email', '').strip()
        user_phone = request.data.get('phone', '').strip()
        user_name = request.data.get('name', '').strip()
        user_password = request.data.get('password', '')

        if not user_email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not user_phone:
            return Response({"detail": "Phone is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not user_password:
            return Response({"detail": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Block if email/phone already belongs to an existing user
        if User.objects.filter(email=user_email).exists():
            return Response({"detail": "Email is already registered"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(phone=user_phone).exists():
            return Response({"detail": "Phone number already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # Remove any stale pending registrations for this email/phone
        PendingRegistration.objects.filter(email=user_email).delete()
        PendingRegistration.objects.filter(phone=user_phone).delete()

        # Hash the password and store pending data — NO User created yet
        otp_code = email_service.generate_otp()
        import hashlib
        otp_hash = hashlib.sha256(otp_code.encode()).hexdigest()

        PendingRegistration.objects.create(
            name=user_name,
            phone=user_phone,
            email=user_email,
            password_hash=make_password(user_password),
            otp_hash=otp_hash,
        )

        email_service.send_verification_otp(
            user_name=user_name,
            to_email=user_email,
            otp=otp_code,
        )

        return Response({
            "message": "OTP sent successfully",
            "email_verification_required": True,
        })


class VerifyEmailView(APIView):
    """POST /api/auth/verify-email — Validate OTP and CREATE the user account."""
    permission_classes = [AllowAny]

    def post(self, request):
        email_addr = str(request.data.get('email', '')).strip()
        otp_input = str(request.data.get('otp', '')).strip()

        if not email_addr or not otp_input:
            return Response({"detail": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Find the pending registration
        pending = PendingRegistration.objects.filter(email=email_addr).order_by('-created_at').first()
        if not pending:
            return Response({"detail": "No pending registration found. Please register again."},
                            status=status.HTTP_404_NOT_FOUND)

        if pending.is_expired():
            pending.delete()
            return Response({"detail": "OTP has expired. Please register again."},
                            status=status.HTTP_400_BAD_REQUEST)

        if not pending.check_otp(otp_input):
            return Response({"detail": "Invalid OTP. Please try again."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Double-check email/phone not taken (race condition guard)
        if User.objects.filter(email=email_addr).exists():
            pending.delete()
            return Response({"detail": "Email is already registered"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(phone=pending.phone).exists():
            pending.delete()
            return Response({"detail": "Phone number already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # NOW create the real user account
        user = User(
            username=pending.phone,
            phone=pending.phone,
            name=pending.name,
            email=pending.email,
            password=pending.password_hash,   # already hashed by make_password
            is_email_verified=True,
            role='user',
        )
        user.save()

        # Clean up pending record
        PendingRegistration.objects.filter(email=email_addr).delete()

        # Send welcome email
        email_service.send_welcome_email(
            user_name=user.name,
            to_email=user.email or '',
        )

        token = create_access_token(user.id)
        return Response({
            "detail": "Email verified successfully!",
            "user": UserSerializer(user).data,
            "token": token,
        })


class ResendOTPView(APIView):
    """POST /api/auth/resend-otp — Resend a new OTP for a pending registration."""
    permission_classes = [AllowAny]

    def post(self, request):
        email_addr = str(request.data.get('email', '')).strip()
        if not email_addr:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        pending = PendingRegistration.objects.filter(email=email_addr).order_by('-created_at').first()
        if not pending:
            return Response({"detail": "No pending registration found. Please register again."},
                            status=status.HTTP_404_NOT_FOUND)

        # Generate new OTP and reset the timestamp
        otp_code = email_service.generate_otp()
        import hashlib
        from django.utils import timezone
        pending.otp_hash = hashlib.sha256(otp_code.encode()).hexdigest()
        pending.created_at = timezone.now()
        pending.save(update_fields=['otp_hash', 'created_at'])

        email_service.send_verification_otp(
            user_name=pending.name,
            to_email=pending.email,
            otp=otp_code,
        )
        return Response({"detail": "A new OTP has been sent to your email."})


# --- User Profile Views ---

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        email_changed = False
        new_email = None

        # Update name if provided
        if 'name' in request.data:
            user.name = request.data['name']

        # Update phone if provided
        if 'phone' in request.data:
            if request.data['phone'] != user.phone and User.objects.filter(phone=request.data['phone']).exists():
                return Response({"detail": "Phone number already in use"}, status=status.HTTP_400_BAD_REQUEST)
            user.phone = request.data['phone']

        # Handle email change — requires re-verification
        if 'email' in request.data:
            new_email = request.data['email'].strip()
            if new_email != user.email:
                if User.objects.filter(email=new_email).exclude(id=user.id).exists():
                    return Response({"detail": "Email address already in use"}, status=status.HTTP_400_BAD_REQUEST)
                user.email = new_email
                user.is_email_verified = False
                email_changed = True

        user.save()

        # If email changed, send verification OTP
        if email_changed and new_email:
            # Invalidate old OTPs
            EmailVerificationOTP.objects.filter(user=user, used=False).update(used=True)

            otp_code = email_service.generate_otp()
            import hashlib
            otp_hash = hashlib.sha256(otp_code.encode()).hexdigest()
            EmailVerificationOTP.objects.create(user=user, otp_hash=otp_hash)
            email_service.send_verification_otp(
                user_name=user.name,
                to_email=new_email,
                otp=otp_code,
            )
            return Response({
                "user": UserSerializer(user).data,
                "email_verification_required": True,
                "detail": "A verification OTP has been sent to your new email address.",
            })

        return Response(UserSerializer(user).data)


class VerifyEmailChangeView(APIView):
    """POST /api/auth/verify-email-change — Verify OTP after an email change. Requires authentication."""
    authentication_classes = [JWTAuthenticationAllowUnverified]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email_addr = str(request.data.get('email', '')).strip()
        otp_input = str(request.data.get('otp', '')).strip()

        if not email_addr or not otp_input:
            return Response({"detail": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email_addr)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Only allow the authenticated user to verify their own new email
        if user.id != request.user.id:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        # Get the latest unused OTP for this user
        otp_obj = (
            EmailVerificationOTP.objects
            .filter(user=user, used=False)
            .order_by('-created_at')
            .first()
        )

        if not otp_obj:
            return Response({"detail": "No pending OTP found. Please request a new one."},
                            status=status.HTTP_400_BAD_REQUEST)

        if otp_obj.is_expired():
            return Response({"detail": "OTP has expired. Please request a new one."},
                            status=status.HTTP_400_BAD_REQUEST)

        if not otp_obj.check_otp(otp_input):
            return Response({"detail": "Invalid OTP. Please try again."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP as used and user as verified
        otp_obj.used = True
        otp_obj.save()
        user.is_email_verified = True
        user.save()

        token = create_access_token(user.id)
        return Response({
            "detail": "Email verified successfully!",
            "user": UserSerializer(user).data,
            "token": token,
        })


# --- Product Catalog Views ---

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.select_related('parent').order_by('parent_id', 'name')
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None

class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]

class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]
    pagination_class = None

class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.select_related('category', 'brand').prefetch_related('reviews')
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [AllowAny()]

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.select_related('category', 'brand').prefetch_related('reviews')
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

class ProductAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related('category', 'brand').prefetch_related('reviews')
    serializer_class = ProductSerializer
    lookup_field = 'id'
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]

class ProductReviewCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request, slug):
        product = get_object_or_404(Product, slug=slug)
        rating = request.data.get('rating')
        comment = str(request.data.get('comment', '')).strip()

        try:
            rating = Decimal(str(rating))
        except (TypeError, ValueError, Exception):
            return Response({"detail": "Please choose a valid rating"}, status=status.HTTP_400_BAD_REQUEST)

        if rating < 1 or rating > 5:
            return Response({"detail": "Rating must be between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)

        if not comment:
            return Response({"detail": "Please write a short review"}, status=status.HTTP_400_BAD_REQUEST)

        review = Review.objects.create(
            user=request.user,
            product=product,
            user_name=request.user.name,
            rating=rating,
            comment=comment,
        )

        product.rating_average = float(
            Review.objects
            .filter(product=product)
            .aggregate(Avg('rating'))['rating__avg'] or 0
        )
        product.save(update_fields=['rating_average'])

        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


# --- Order Views ---

class OrderListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get(self, request):
        # Return only the authenticated user's orders (all for admin)
        if request.user.role == 'admin':
            orders = Order.objects.all().order_by('-created_at')
        else:
            orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        address = get_object_or_404(Address, id=request.data.get('address_id'), user=request.user)
        items_input = request.data.get('items', [])
        if not isinstance(items_input, list) or len(items_input) == 0:
            return Response({"detail": "Order items are required"}, status=status.HTTP_400_BAD_REQUEST)

        payment_method = request.data.get('payment_method', 'online')

        # --- Server-side total computation ---
        TAX_RATE = 0.08
        SHIPPING_COST = Decimal('9.99')
        computed_subtotal = Decimal('0')
        order_line_items = []  # (product, ordered_qty, unit_price)
        should_decrement_stock_now = payment_method == 'cod'

        with transaction.atomic():
            for item in items_input:
                if not isinstance(item, dict):
                    continue

                product_id = item.get('productId') or item.get('product_id')
                ordered_qty = int(item.get('quantity', 1))
                if ordered_qty < 1:
                    return Response({"detail": "Quantity must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)

                # Lock row to prevent race conditions
                try:
                    product = Product.objects.select_for_update().get(id=product_id)
                except Product.DoesNotExist:
                    return Response({"detail": f"Product {product_id} not found"}, status=status.HTTP_400_BAD_REQUEST)

                if ordered_qty > product.quantity:
                    return Response(
                        {"detail": f"Insufficient stock for '{product.name}' (available: {product.quantity})"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Use server price — never trust the client
                unit_price = Decimal(str(product.sale_price if product.sale_price else product.price))
                computed_subtotal += unit_price * ordered_qty
                order_line_items.append((product, ordered_qty, unit_price))

            computed_tax = (computed_subtotal * Decimal(str(TAX_RATE))).quantize(Decimal('0.01'))
            computed_total = computed_subtotal + computed_tax + SHIPPING_COST

            # payment_status is always 'pending' unless payment verification confirms it
            order = Order.objects.create(
                user=request.user,
                payment_method=payment_method,
                payment_status='pending',
                subtotal=computed_subtotal,
                tax=computed_tax,
                shipping_cost=SHIPPING_COST,
                discount=Decimal('0'),
                total=computed_total,
                shipping_address_snapshot={
                    'name': address.name,
                    'email': address.email,
                    'contact_no': address.contact_no,
                    'alt_contact_no': address.alt_contact_no,
                    'line1': address.line1,
                    'line2': address.line2,
                    'locality': address.locality,
                    'city': address.city,
                    'state': address.state,
                    'postal_code': address.postal_code,
                    'country': address.country,
                    'address_type': address.address_type,
                    'is_default': address.is_default,
                }
            )

            for product, ordered_qty, unit_price in order_line_items:
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    name=product.name,
                    price=unit_price,
                    quantity=ordered_qty,
                    image=product.images[0] if product.images else '',
                )
                if should_decrement_stock_now:
                    product.quantity = max(0, product.quantity - ordered_qty)
                    product.in_stock = product.quantity > 0
                    product.save(update_fields=['quantity', 'in_stock'])

        user = request.user
        if should_decrement_stock_now and user.email:
            email_service.send_order_placed(
                user_name=user.name,
                to_email=user.email,
                order=order,
            )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsStoreAdmin]
    pagination_class = None

    def get_queryset(self):
        return Order.objects.all().order_by('-created_at')


class OrderStatusUpdateView(APIView):
    """PATCH /api/orders/<id>/status  — Admin updates order status + notifies user by email."""
    permission_classes = [IsAuthenticated]

    def patch(self, request, order_id):
        if request.user.role != 'admin':
            return Response({"detail": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

        order = get_object_or_404(Order, id=order_id)
        new_status = request.data.get('status')
        tracking_number = request.data.get('tracking_number')

        valid_statuses = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned']
        if new_status not in valid_statuses:
            return Response(
                {"detail": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        if tracking_number:
            order.tracking_number = tracking_number
        order.save()

        # Send status update email
        user = order.user
        if user.email:
            email_service.send_order_status_update(
                user_name=user.name,
                to_email=user.email,
                order=order,
            )

        return Response(OrderSerializer(order).data)


# --- Payment Views ---

class PaymentCreateOrderView(APIView):
    """Creates a Razorpay order. Requires auth; derives amount from the server-side Order."""
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request):
        """Expects { order_id } — looks up our Order and derives the Razorpay amount server-side."""
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({"detail": "order_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Only allow the order owner
        order = get_object_or_404(Order, id=order_id, user=request.user)

        # Convert to paise (Razorpay uses smallest currency unit)
        amount_paise = int(order.total * 100)

        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            return Response({"detail": "Razorpay keys are not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        payload = json.dumps({
            'amount': amount_paise,
            'currency': 'INR',
            'payment_capture': 1,
            'receipt': f'order_{order.id}',
            'notes': {'order_id': str(order.id)},
        }).encode('utf-8')

        auth_value = base64.b64encode(
            f"{settings.RAZORPAY_KEY_ID}:{settings.RAZORPAY_KEY_SECRET}".encode('utf-8')
        ).decode('utf-8')
        req = urllib.request.Request(
            'https://api.razorpay.com/v1/orders',
            data=payload,
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Basic {auth_value}',
            }
        )

        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                response_data = json.loads(response.read().decode('utf-8'))
            return Response({'order': response_data}, status=status.HTTP_201_CREATED)
        except urllib.error.HTTPError as err:
            error_body = err.read().decode('utf-8')
            try:
                error_data = json.loads(error_body)
            except Exception:
                error_data = {'detail': error_body}
            return Response(error_data, status=err.code)
        except Exception as err:
            return Response({'detail': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PaymentVerifyView(APIView):
    """Verifies Razorpay payment signature and marks the Order as paid."""
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request):
        payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        signature = request.data.get('razorpay_signature')
        our_order_id = request.data.get('order_id')  # our DB order id

        if not payment_id or not razorpay_order_id or not signature:
            return Response({"detail": "Missing payment verification fields"}, status=status.HTTP_400_BAD_REQUEST)

        if not settings.RAZORPAY_KEY_SECRET:
            return Response({"detail": "Razorpay key secret is not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        expected_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode('utf-8'),
            f"{razorpay_order_id}|{payment_id}".encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        is_valid = expected_signature == signature

        # Only mark as paid and decrement stock after server-side signature verification.
        if is_valid and our_order_id:
            try:
                with transaction.atomic():
                    order = Order.objects.select_for_update().get(id=our_order_id, user=request.user)

                    if order.payment_status == 'paid':
                        return Response({'success': True})

                    order_items = list(OrderItem.objects.select_related('product').filter(order=order))
                    locked_products = {}

                    for item in order_items:
                        if not item.product_id:
                            continue
                        product = Product.objects.select_for_update().get(id=item.product_id)
                        locked_products[item.product_id] = product
                        if item.quantity > product.quantity:
                            return Response(
                                {
                                    'success': False,
                                    'detail': f"Insufficient stock for '{product.name}' (available: {product.quantity})",
                                },
                                status=status.HTTP_400_BAD_REQUEST,
                            )

                    for item in order_items:
                        product = locked_products.get(item.product_id)
                        if not product:
                            continue
                        product.quantity = max(0, product.quantity - item.quantity)
                        product.in_stock = product.quantity > 0
                        product.save(update_fields=['quantity', 'in_stock'])

                    order.payment_status = 'paid'
                    order.save(update_fields=['payment_status'])

                if order.user.email:
                    email_service.send_order_placed(
                        user_name=order.user.name,
                        to_email=order.user.email,
                        order=order,
                    )
            except Order.DoesNotExist:
                return Response({'success': False, 'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'success': is_valid})


# --- User & List Views ---

class UserOrderListView(generics.ListAPIView):
    """Returns orders scoped to the requesting user (admin can query any user_id)."""
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    pagination_class = None

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Order.objects.filter(user_id=self.kwargs['user_id']).order_by('-created_at')
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class NotificationListView(generics.ListAPIView):
    """Returns only the authenticated user's own notifications."""
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    pagination_class = None

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = None
    permission_classes = [IsAdminUser]

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminUser]


# --- Admin Sources ---

class AdminReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsStoreAdmin]
    pagination_class = None

    def get_queryset(self):
        return Review.objects.select_related('user', 'product').order_by('-created_at')


class SupportTicketListCreateView(generics.ListCreateAPIView):
    serializer_class = SupportTicketSerializer
    pagination_class = None

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsStoreAdmin()]

    def get_queryset(self):
        return SupportTicket.objects.select_related('user').order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user if self.request.user and self.request.user.is_authenticated else None
        serializer.save(user=user)


class SupportTicketDetailView(generics.RetrieveUpdateAPIView):
    queryset = SupportTicket.objects.select_related('user')
    serializer_class = SupportTicketSerializer
    lookup_field = 'id'
    permission_classes = [IsStoreAdmin]


class AdminStoreSettingsView(APIView):
    permission_classes = [IsStoreAdmin]

    def get(self, request):
        latest_terms = Terms.objects.order_by('-updated_at').first()
        support_counts = {
            'open': SupportTicket.objects.filter(status='open').count(),
            'in_progress': SupportTicket.objects.filter(status='in_progress').count(),
            'resolved': SupportTicket.objects.filter(status='resolved').count(),
            'closed': SupportTicket.objects.filter(status='closed').count(),
        }

        return Response({
            'store': {
                'name': 'CrystalReadymade',
                'site_url': getattr(settings, 'SITE_URL', ''),
                'support_email': getattr(settings, 'DEFAULT_FROM_EMAIL', 'support@crystalreadymade.com'),
                'location': 'Aurangapura Rd, Gulmandi, Chhatrapati Sambhajinagar',
                'phone': '+91 91300 94080',
                'currency': 'INR',
            },
            'payment': {
                'provider': 'Razorpay',
                'configured': bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET),
                'key_id_present': bool(settings.RAZORPAY_KEY_ID),
            },
            'email': {
                'provider': getattr(settings, 'EMAIL_HOST', ''),
                'configured': bool(getattr(settings, 'EMAIL_HOST_USER', None) and getattr(settings, 'EMAIL_HOST_PASSWORD', None)),
                'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL', ''),
            },
            'catalog': {
                'products': Product.objects.count(),
                'categories': Category.objects.count(),
                'brands': Brand.objects.count(),
                'hero_slides': HeroSlide.objects.count(),
            },
            'customers': {
                'total': User.objects.count(),
                'admins': User.objects.filter(role='admin').count(),
                'verified_email': User.objects.filter(is_email_verified=True).count(),
            },
            'orders': {
                'total': Order.objects.count(),
                'pending': Order.objects.filter(status='pending').count(),
                'processing': Order.objects.filter(status='processing').count(),
                'delivered': Order.objects.filter(status='delivered').count(),
                'cancelled': Order.objects.filter(status='cancelled').count(),
            },
            'support': {
                'total': SupportTicket.objects.count(),
                'by_status': support_counts,
            },
            'content': {
                'terms_updated_at': latest_terms.updated_at if latest_terms else None,
                'terms_preview': latest_terms.content[:240] if latest_terms else '',
                'hero_slides': HeroSlideSerializer(HeroSlide.objects.all(), many=True).data,
            },
        })
    
# --- Address CRUD ---

class AddressListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddressDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def put(self, request, address_id):
        address = get_object_or_404(Address, id=address_id, user=request.user)
        serializer = AddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, address_id):
        address = get_object_or_404(Address, id=address_id, user=request.user)
        address.delete()
        return Response(UserSerializer(request.user).data)

class AddressSetDefaultView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, address_id):
        address = get_object_or_404(Address, id=address_id, user=request.user)
        address.is_default = True
        address.save()
        return Response(UserSerializer(request.user).data)

class HeroSlideListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        slides = HeroSlide.objects.all()
        serializer = HeroSlideSerializer(slides, many=True)
        return Response(serializer.data)
