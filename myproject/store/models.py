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
    is_email_verified = models.BooleanField(default=False)
    
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

    def __str__(self):
        return f"{self.name} - {self.city}"

    def save(self, *args, **kwargs):
        if self.is_default:
            # Unset other default addresses for this user
            Address.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    image = models.CharField(max_length=500, null=True, blank=True)
    mobile_image = models.CharField(max_length=500, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='children'
    )

    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    logo = models.CharField(max_length=500, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Postgres specific fields
    images = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    specifications = models.JSONField(null=True, blank=True)
    
    in_stock = models.BooleanField(default=True)
    quantity = models.IntegerField(default=0)
    rating_average = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user_name = models.CharField(max_length=255)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name} on {self.product.name}"

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=50, default="processing")
    payment_method = models.CharField(max_length=50)
    payment_status = models.CharField(max_length=50, default="pending")
    tracking_number = models.CharField(max_length=100, null=True, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_address_snapshot = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.phone}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name='order_items')
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
    image = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f"{self.quantity} x {self.name}"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='support_tickets')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, null=True, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    source = models.CharField(max_length=50, default='website')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} - {self.email}"

class HeroSlide(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255)
    description = models.TextField()
    buttonText = models.CharField(max_length=255)
    buttonLink = models.CharField(max_length=500)
    image = models.CharField(max_length=1000)
    mobile_image = models.CharField(max_length=1000, null=True, blank=True)
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return self.title

class Terms(models.Model):
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)


class EmailVerificationOTP(models.Model):
    """Stores a SHA-256 hash of a 6-digit OTP for email verification. Expires in 10 minutes."""
    user = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='email_otps'
    )
    otp_hash = models.CharField(max_length=64)  # SHA-256 hex digest
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)

    def is_expired(self):
        from django.utils import timezone
        from datetime import timedelta
        return timezone.now() > self.created_at + timedelta(minutes=10)

    def check_otp(self, otp_input: str) -> bool:
        import hashlib
        return self.otp_hash == hashlib.sha256(otp_input.encode()).hexdigest()

    def __str__(self):
        return f"OTP for {self.user.phone} — {'used' if self.used else 'active'}"


class PendingRegistration(models.Model):
    """Temporary store for registration data until OTP is verified.
    The actual User account is only created after email verification."""
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    email = models.EmailField()
    password_hash = models.CharField(max_length=255)
    otp_hash = models.CharField(max_length=64)  # SHA-256 hex digest — NOT the raw OTP
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        from django.utils import timezone
        from datetime import timedelta
        return timezone.now() > self.created_at + timedelta(minutes=10)

    def check_otp(self, otp_input: str) -> bool:
        import hashlib
        return self.otp_hash == hashlib.sha256(otp_input.encode()).hexdigest()

    def __str__(self):
        return f"Pending: {self.phone} ({self.email})"
