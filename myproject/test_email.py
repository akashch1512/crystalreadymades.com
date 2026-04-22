import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from store.email_service import (
    send_verification_otp,
    send_welcome_email,
    send_order_status_update,
    send_order_placed
)
from store.models import Order, OrderItem

email = "akashchaudhari1012@gmail.com"
name = "Akash"

print("Sending Verification OTP...")
send_verification_otp(name, email, "827914")

print("Sending Welcome Email...")
send_welcome_email(name, email)

# Look for an existing order or use a dummy object
order = Order.objects.first()

if order:
    print("Sending Order Placed...")
    send_order_placed(name, email, order)

    print("Sending Order Shipped...")
    original_status = order.status
    order.status = 'shipped'
    order.tracking_number = 'CRYS-SHP-9028174'
    send_order_status_update(name, email, order)
    
    # Send Delivered status
    print("Sending Order Delivered...")
    order.status = 'delivered'
    order.tracking_number = 'CRYS-SHP-9028174'
    send_order_status_update(name, email, order)
    
else:
    print("Could not find any order in the DB to test order emails.")

print("✅ All demo emails sent successfully!")
