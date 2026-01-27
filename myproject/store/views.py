from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from datetime import datetime, timedelta
import jwt
from django.conf import settings

from .models import *
from .serializers import *

# --- Auth Views (Matching Schema) ---

def create_access_token(user_id):
    expire = datetime.utcnow() + timedelta(minutes=30)
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
            
        token = create_access_token(user.id)
        # Manually constructing response to match: {user: {}, token: ""}
        return Response({
            "user": UserSerializer(user).data,
            "token": token
        })

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if User.objects.filter(phone=request.data.get('phone')).exists():
            return Response({"detail": "Phone number already registered"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=request.data.get('phone'), # Django needs username, using phone
            phone=request.data.get('phone'),
            password=request.data.get('password'),
            name=request.data.get('name'),
            email=request.data.get('email', ''),
            role="user"
        )
        
        token = create_access_token(user.id)
        return Response({
            "user": UserSerializer(user).data,
            "token": token
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
            user.email = request.data['email']
        if 'phone' in request.data:
            # Check if new phone is already in use by another user
            if request.data['phone'] != user.phone and User.objects.filter(phone=request.data['phone']).exists():
                return Response({"detail": "Phone number already in use"}, status=status.HTTP_400_BAD_REQUEST)
            user.phone = request.data['phone']
        
        user.save()
        return Response(UserSerializer(user).data)

# --- Product Catalog Views ---

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None  # <--- ADD THIS (FastAPI returned .all())

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

class OrderListView(generics.ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    pagination_class = None  # <--- ADD THIS

class UserOrderListView(generics.ListAPIView):
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

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            # Return Updated User object as per FastAPI code
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddressDetailView(APIView):
    permission_classes = [IsAuthenticated]

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