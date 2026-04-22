import base64
import hashlib
import hmac
import json
import urllib.error
import urllib.request

from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import JSONParser
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from datetime import datetime, timedelta
import jwt
from django.conf import settings

from .models import *
from .serializers import *
from . import email_service

# --- Auth Views (Matching Schema) ---

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
        # Manually constructing response to match: {user: {}, token: ""}
        return Response({
            "user": UserSerializer(user).data,
            "token": token
        })

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_email = request.data.get('email', '').strip()
        user_phone = request.data.get('phone', '').strip()

        if not user_email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=user_email).exists():
            existing = User.objects.get(email=user_email)
            if existing.is_email_verified:
                return Response({"detail": "Email is already registered"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                existing.delete()

        if User.objects.filter(phone=user_phone).exists():
            existing = User.objects.get(phone=user_phone)
            if existing.is_email_verified:
                return Response({"detail": "Phone number already registered"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                existing.delete()
        
        user = User.objects.create_user(
            username=user_phone, # Django needs username, using phone
            phone=request.data.get('phone'),
            password=request.data.get('password'),
            name=request.data.get('name'),
            email=user_email,
            role="user"
        )
        
        # Send email verification OTP
        otp_code = email_service.generate_otp()
        EmailVerificationOTP.objects.create(user=user, otp=otp_code)
        email_service.send_verification_otp(
            user_name=user.name,
            to_email=user_email,
            otp=otp_code,
        )
        
        return Response({
            "message": "OTP sent successfully",
            "email_verification_required": True,
        })

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        
        # Update fields if provided
        if 'name' in request.data:
            user.name = request.data['name']
        if 'email' in request.data:
            new_email = request.data['email'].strip()
            if new_email != user.email and User.objects.filter(email=new_email).exists():
                return Response({"detail": "Email address already in use"}, status=status.HTTP_400_BAD_REQUEST)
            user.email = new_email
        if 'phone' in request.data:
            # Check if new phone is already in use by another user
            if request.data['phone'] != user.phone and User.objects.filter(phone=request.data['phone']).exists():
                return Response({"detail": "Phone number already in use"}, status=status.HTTP_400_BAD_REQUEST)
            user.phone = request.data['phone']
        
        user.save()
        return Response(UserSerializer(user).data)


class VerifyEmailView(APIView):
    """POST /api/auth/verify-email  — Validate the OTP sent during registration."""
    permission_classes = [AllowAny]

    def post(self, request):
        email_addr = str(request.data.get('email', '')).strip()
        otp_input = str(request.data.get('otp', '')).strip()
        
        if not email_addr or not otp_input:
            return Response({"detail": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email_addr)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.is_email_verified:
            return Response({"detail": "Email is already verified"})

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

        if otp_obj.otp != otp_input:
            return Response({"detail": "Invalid OTP. Please try again."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP as used and user as verified
        otp_obj.used = True
        otp_obj.save()
        user.is_email_verified = True
        user.save()

        # Send welcome email
        email_service.send_welcome_email(
            user_name=user.name,
            to_email=user.email or '',
        )

        token = create_access_token(user.id)
        return Response({"detail": "Email verified successfully!", "user": UserSerializer(user).data, "token": token})


class ResendOTPView(APIView):
    """POST /api/auth/resend-otp  — Resend a new OTP to the authenticated user."""
    permission_classes = [AllowAny]

    def post(self, request):
        email_addr = str(request.data.get('email', '')).strip()
        if not email_addr:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email_addr)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        if user.is_email_verified:
            return Response({"detail": "Email is already verified"})
        if not user.email:
            return Response({"detail": "No email address on file."}, status=status.HTTP_400_BAD_REQUEST)

        # Invalidate old OTPs
        EmailVerificationOTP.objects.filter(user=user, used=False).update(used=True)

        otp_code = email_service.generate_otp()
        EmailVerificationOTP.objects.create(user=user, otp=otp_code)
        email_service.send_verification_otp(
            user_name=user.name,
            to_email=user.email,
            otp=otp_code,
        )
        return Response({"detail": "A new OTP has been sent to your email."})

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
    pagination_class = None  # <--- ADD THIS

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    # KEEP PAGINATION HERE (FastAPI used skip/limit on products)
    # It will use the SkipLimitPagination we fixed in step 1.

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

# --- User & Order Views ---

# ... User views ...

class OrderListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        address = get_object_or_404(Address, id=request.data.get('address_id'), user=request.user)
        items = request.data.get('items', [])
        if not isinstance(items, list) or len(items) == 0:
            return Response({"detail": "Order items are required"}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=request.user,
            payment_method=request.data.get('payment_method', 'online'),
            payment_status=request.data.get('payment_status', 'pending'),
            subtotal=request.data.get('subtotal', 0.0),
            tax=request.data.get('tax', 0.0),
            shipping_cost=request.data.get('shipping_cost', 0.0),
            discount=request.data.get('discount', 0.0),
            total=request.data.get('total', 0.0),
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

        for item in items:
            if not isinstance(item, dict):
                continue

            product_id = item.get('productId') or item.get('product_id')
            product = Product.objects.filter(id=product_id).first() if product_id else None
            OrderItem.objects.create(
                order=order,
                product=product,
                name=item.get('name', ''),
                price=item.get('price', 0.0),
                quantity=item.get('quantity', 1),
                image=item.get('image', ''),
            )

        serializer = OrderSerializer(order)

        # Send order placed confirmation email
        user = request.user
        if user.email:
            email_service.send_order_placed(
                user_name=user.name,
                to_email=user.email,
                order=order,
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderStatusUpdateView(APIView):
    """PATCH /api/orders/<id>/status  — Admin updates order status + notifies user by email."""
    permission_classes = [IsAuthenticated]

    def patch(self, request, order_id):
        if request.user.role != 'admin':
            return Response({"detail": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

        order = get_object_or_404(Order, id=order_id)
        new_status = request.data.get('status')
        tracking_number = request.data.get('tracking_number')

        valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
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

class PaymentCreateOrderView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def post(self, request):
        amount = request.data.get('amount')
        if amount is None:
            return Response({"detail": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = int(amount)
        except (TypeError, ValueError):
            return Response({"detail": "Amount must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            return Response({"detail": "Razorpay keys are not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        payload = json.dumps({
            'amount': amount,
            'currency': 'INR',
            'payment_capture': 1,
            'receipt': f'receipt_{int(datetime.utcnow().timestamp() * 1000)}',
            'notes': {
                'source': 'checkout',
            },
        }).encode('utf-8')

        auth_value = base64.b64encode(f"{settings.RAZORPAY_KEY_ID}:{settings.RAZORPAY_KEY_SECRET}".encode('utf-8')).decode('utf-8')
        req = urllib.request.Request(
            'https://api.razorpay.com/v1/orders',
            data=payload,
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Basic {auth_value}',
            }
        )

        try:
            with urllib.request.urlopen(req) as response:
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
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def post(self, request):
        payment_id = request.data.get('razorpay_payment_id')
        order_id = request.data.get('razorpay_order_id')
        signature = request.data.get('razorpay_signature')

        if not payment_id or not order_id or not signature:
            return Response({"detail": "Missing payment verification fields"}, status=status.HTTP_400_BAD_REQUEST)

        if not settings.RAZORPAY_KEY_SECRET:
            return Response({"detail": "Razorpay key secret is not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        expected_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode('utf-8'),
            f"{order_id}|{payment_id}".encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        return Response({'success': expected_signature == signature})

class UserOrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    pagination_class = None  # <--- ADD THIS
    
    def get_queryset(self):
        return Order.objects.filter(user_id=self.kwargs['user_id'])

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    pagination_class = None  # <--- ADD THIS (Fixes userNotifications.filter error)
    
    def get_queryset(self):
        return Notification.objects.filter(user_id=self.kwargs['user_id'])
    
    # Add this inside store/views.py (under the User & Order Views section)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = None  # Disable pagination for users too (just in case)

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'
    
# --- Address CRUD ---

class AddressListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get(self, request):
        # Return the full user object which includes addresses[] nested
        return Response(UserSerializer(request.user).data)

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            # Return Updated User object so frontend can update state
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
        # The model's save() method will automatically unset other defaults
        address.is_default = True
        address.save()
        return Response(UserSerializer(request.user).data)

class HeroSlideListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        slides = HeroSlide.objects.all()
        serializer = HeroSlideSerializer(slides, many=True)
        return Response(serializer.data)
