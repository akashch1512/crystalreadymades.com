from rest_framework import serializers
from .models import *

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'name', 'line1', 'line2', 'city', 'state', 'postal_code', 'country', 'is_default']

class UserSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'phone', 'email', 'role', 'addresses']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'description']

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
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'sale_price', 
            'images', 'category_id', 'brand_id', 'tags', 'in_stock', 
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
        fields = ['id', 'title', 'subtitle', 'description', 'buttonText', 'buttonLink', 'image']