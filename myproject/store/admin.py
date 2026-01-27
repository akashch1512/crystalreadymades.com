from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Address, Category, Brand, Product, 
    Review, Order, OrderItem, Notification
)

# 1. Custom User Admin
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'name', 'role', 'is_staff', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'name')
    ordering = ('email',)

    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('name', 'phone', 'role')}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('name', 'email', 'phone', 'role')}),
    )

admin.site.register(User, CustomUserAdmin)


# 2. Category & Brand Admin
# FIX: Changed 'admin.site.ModelAdmin' to 'admin.ModelAdmin'
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug')
    prepopulated_fields = {'slug': ('name',)} 

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


# 3. Product Admin
class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0 
    readonly_fields = ('user_name', 'rating', 'comment')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'in_stock', 'quantity', 'category', 'brand')
    list_filter = ('in_stock', 'category', 'brand')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ReviewInline] 


# 4. Order Admin
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'name', 'price', 'quantity', 'image')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = ('user__email', 'tracking_number')
    inlines = [OrderItemInline] 


# 5. Other Simple Registrations
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'city', 'country', 'is_default')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'type', 'is_read', 'created_at')