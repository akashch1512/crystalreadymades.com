from django.db import models
from django.contrib.auth.models import AbstractUser
# from django.contrib.postgres.fields import ArrayField

class User(AbstractUser):
    # We set phone as the unique identifier
    email = models.EmailField(unique=False, null=True, blank=True)
    
    # FIX: 'name' is now a real database field
    name = models.CharField(max_length=255) 
    
    phone = models.CharField(max_length=50, unique=True)
    role = models.CharField(max_length=20, default="user")
    
    # Login with phone instead of email
    USERNAME_FIELD = 'phone'
    
    # Fields to ask for when running createsuperuser
    # (username is required by AbstractUser logic, name is our custom requirement)
    REQUIRED_FIELDS = ['username', 'name'] 

    def __str__(self):
        return self.email
    

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    name = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)
    contact_no = models.CharField(max_length=50, null=True, blank=True)
    alt_contact_no = models.CharField(max_length=50, null=True, blank=True)
    line1 = models.CharField(max_length=255)
    line2 = models.CharField(max_length=255, null=True, blank=True)
    locality = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    address_type = models.CharField(max_length=50, default='Home')
    is_default = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.is_default:
            # Unset other default addresses for this user
            Address.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    image = models.CharField(max_length=500, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='children'
    )

class Brand(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    logo = models.CharField(max_length=500, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(null=True, blank=True)
    price = models.FloatField()
    sale_price = models.FloatField(null=True, blank=True)
    
    # Postgres specific fields
    images = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    specifications = models.JSONField(null=True, blank=True)
    
    in_stock = models.BooleanField(default=True)
    quantity = models.IntegerField(default=0)
    rating_average = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user_name = models.CharField(max_length=255)
    rating = models.FloatField()
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=50, default="processing")
    payment_method = models.CharField(max_length=50)
    payment_status = models.CharField(max_length=50, default="pending")
    tracking_number = models.CharField(max_length=100, null=True, blank=True)
    subtotal = models.FloatField(default=0.0)
    tax = models.FloatField(default=0.0)
    shipping_cost = models.FloatField(default=0.0)
    discount = models.FloatField(default=0.0)
    total = models.FloatField(default=0.0)
    shipping_address_snapshot = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name='order_items')
    name = models.CharField(max_length=255)
    price = models.FloatField()
    quantity = models.IntegerField(default=1)
    image = models.CharField(max_length=500, null=True, blank=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class HeroSlide(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255)
    description = models.TextField()
    buttonText = models.CharField(max_length=255)
    buttonLink = models.CharField(max_length=500)
    image = models.CharField(max_length=1000)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return self.title

class Terms(models.Model):
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)