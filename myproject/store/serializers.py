from rest_framework import serializers
from .models import *

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'name', 'email', 'contact_no', 'alt_contact_no', 'line1', 'line2', 'locality', 'city', 'state', 'postal_code', 'country', 'address_type', 'is_default']

class UserSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'phone', 'email', 'role', 'is_email_verified', 'addresses']

class CategorySerializer(serializers.ModelSerializer):
    # parent_id is a real DB column Django auto-creates for ForeignKey(parent).
    # ModelSerializer discovers it automatically — no explicit field needed.
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'mobile_image', 'description', 'parent_id']

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'description']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user_id', 'user_name', 'rating', 'comment', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    category = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    brand = serializers.CharField(source='brand.name', read_only=True)
    brand_slug = serializers.CharField(source='brand.slug', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'sale_price', 
            'images', 'category_id', 'brand_id', 'category', 'category_slug', 'brand', 'brand_slug', 'tags', 'in_stock', 
            'quantity', 'rating_average', 'specifications', 'created_at', 
            'updated_at', 'reviews'
        ]

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'name', 'price', 'quantity', 'image']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user_id', 'items', 'status', 'shipping_address_snapshot',
            'payment_method', 'payment_status', 'subtotal', 'tax', 'shipping_cost',
            'discount', 'total', 'tracking_number', 'created_at', 'updated_at'
        ]

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'type', 'is_read', 'created_at']

class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = ['id', 'title', 'subtitle', 'description', 'buttonText', 'buttonLink', 'image', 'mobile_image']