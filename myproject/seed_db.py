import os
import django
import random
from datetime import datetime

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from store.models import *

def run():
    print("Seeding dummy data into the database...")

    # 1. Create a dummy User
    if not User.objects.filter(phone="9876543210").exists():
        user = User.objects.create_user(
            username="dummy_user",
            name="John Doe",
            phone="9876543210",
            email="johndoe@example.com",
            password="password123",
            role="user"
        )
        print("Created User.")
    else:
        user = User.objects.get(phone="9876543210")
        print("User already exists.")

    # 2. Add an Address for the User
    if not Address.objects.filter(user=user).exists():
        address = Address.objects.create(
            user=user,
            name="John Doe",
            email="johndoe@example.com",
            contact_no="9876543210",
            alt_contact_no="9123456789",
            line1="Flat No. 402, Sunshine Apartments",
            line2="Next to Central Park",
            locality="Downtown",
            city="Metropolis",
            state="New York",
            postal_code="10001",
            country="United States",
            address_type="Home",
            is_default=True
        )
        print("Created Address.")

    # 3. Create Categories
    category1, _ = Category.objects.get_or_create(
        slug="boys-wear",
        defaults={
            "name": "Boys Wear",
            "image": "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500",
            "description": "Premium clothing for boys."
        }
    )
    category2, _ = Category.objects.get_or_create(
        slug="girls-wear",
        defaults={
            "name": "Girls Wear",
            "image": "https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=500",
            "description": "Elegant and casual wear for girls."
        }
    )
    category3, _ = Category.objects.get_or_create(
        slug="womens-wear",
        defaults={
            "name": "Women\'s Wear",
            "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500",
            "description": "Everyday and party wear for women."
        }
    )

    uniforms_category, _ = Category.objects.get_or_create(
        slug="uniforms",
        defaults={
            "name": "Uniforms",
            "image": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500",
            "description": "School uniforms for top schools and everyday wear."
        }
    )

    school_categories = [
        {"slug": "nath-valley-school", "name": "Nath Valley School"},
        {"slug": "mgm-clover-dale-school", "name": "MGM Clover Dale School"},
        {"slug": "podar-international-school", "name": "Podar International School"},
        {"slug": "jito-delhi-public-school", "name": "JITO Delhi Public School"},
        {"slug": "orchids-the-international-school", "name": "Orchids The International School"},
        {"slug": "woodridge-high-school", "name": "Woodridge High School"},
        {"slug": "era-international-school", "name": "Era International School"},
        {"slug": "universal-high-school", "name": "Universal High School"},
        {"slug": "chate-school", "name": "Chate School"},
        {"slug": "billimoria-high-school", "name": "Billimoria High School"}
    ]

    for school in school_categories:
        Category.objects.get_or_create(
            slug=school["slug"],
            defaults={
                "name": school["name"],
                "image": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500",
                "description": "School uniform collection for the selected school.",
                "parent": uniforms_category,
            }
        )

    clothing_category, _ = Category.objects.get_or_create(
        slug="clothing",
        defaults={
            "name": "Clothing",
            "image": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500",
            "description": "Everyday apparel for women, boys, and girls."
        }
    )

    # Group existing product categories under Clothing
    category1.parent = clothing_category
    category1.save()
    category2.parent = clothing_category
    category2.save()
    category3.parent = clothing_category
    category3.save()

    print("Created Categories.")

    # 4. Create Brand
    brand, _ = Brand.objects.get_or_create(
        slug="crystal",
        defaults={
            "name": "Crystal Readymade",
            "logo": "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500",
            "description": "Our signature line of comfortable and durable clothing."
        }
    )
    print("Created Brand.")

    # 5. Create Products
    product1, _ = Product.objects.get_or_create(
        slug="boys-cotton-tshirt",
        defaults={
            "category": category1,
            "brand": brand,
            "name": "Boys Premium Cotton T-Shirt",
            "description": "A very comfortable cotton t-shirt for daily use.",
            "price": 499.0,
            "sale_price": 399.0,
            "images": [
                "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500",
                "https://images.unsplash.com/photo-1532667449560-72a95c8d381b?w=500"
            ],
            "tags": ["cotton", "summer", "boys", "casual"],
            "specifications": {"Material": "100% Cotton", "Fit": "Regular", "Wash Care": "Machine Wash"},
            "in_stock": True,
            "quantity": 50,
            "rating_average": 4.5
        }
    )

    product2, _ = Product.objects.get_or_create(
        slug="girls-floral-dress",
        defaults={
            "category": category2,
            "brand": brand,
            "name": "Girls Floral Print Summer Dress",
            "description": "Beautiful floral dress perfect for summer outings.",
            "price": 899.0,
            "sale_price": None,
            "images": [
                "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500"
            ],
            "tags": ["floral", "dress", "summer", "girls"],
            "specifications": {"Material": "Cotton Blend", "Fit": "A-Line", "Occasion": "Casual"},
            "in_stock": True,
            "quantity": 30,
            "rating_average": 4.8
        }
    )

    product3, _ = Product.objects.get_or_create(
        slug="womens-casual-top",
        defaults={
            "category": category3,
            "brand": brand,
            "name": "Women\'s Casual Top",
            "description": "Soft and stylish casual top for everyday wear.",
            "price": 799.0,
            "sale_price": 649.0,
            "images": [
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500"
            ],
            "tags": ["casual", "women", "top", "comfortable"],
            "specifications": {"Material": "Viscose Blend", "Fit": "Relaxed", "Wash Care": "Hand Wash"},
            "in_stock": True,
            "quantity": 40,
            "rating_average": 4.7
        }
    )
    print("Created Products.")

    # 6. Create Review
    if not Review.objects.filter(product=product1, user=user).exists():
        Review.objects.create(
            user=user,
            product=product1,
            user_name="John Doe",
            rating=5.0,
            comment="Amazing quality! The cotton is so soft and stays intact after washes."
        )
        print("Created Review.")

    # 7. Create Order & OrderItem
    if not Order.objects.filter(user=user).exists():
        order = Order.objects.create(
            user=user,
            status="delivered",
            payment_method="card",
            payment_status="paid",
            tracking_number="TRK1234567890",
            subtotal=399.0,
            tax=20.0,
            shipping_cost=50.0,
            discount=0.0,
            total=469.0,
            shipping_address_snapshot={
                "name": "John Doe",
                "phone": "9876543210",
                "line1": "Flat No. 402, Sunshine Apartments",
                "city": "Metropolis",
                "postal_code": "10001",
                "state": "New York",
                "country": "United States"
            }
        )

        OrderItem.objects.create(
            order=order,
            product=product1,
            name=product1.name,
            price=399.0,
            quantity=1,
            image=product1.images[0]
        )
        print("Created Order.")

    # 8. Create Notification
    if not Notification.objects.filter(user=user).exists():
        Notification.objects.create(
            user=user,
            title="Order Delivered Successfully",
            message="Your order TRK1234567890 has been successfully delivered. Thank you for shopping with Crystal!",
            type="order",
            is_read=False
        )
        print("Created Notification.")

    # 9. Create HeroSlide
    slide_id = 1
    if not HeroSlide.objects.filter(id=slide_id).exists():
        HeroSlide.objects.create(
            id=slide_id,
            title="Summer Collection 2026",
            subtitle="Explore our fresh styles",
            description="Premium quality ready-made clothing styled for maximum comfort.",
            buttonText="Shop Now",
            buttonLink="/products",
            image="https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1200"
        )
        print("Created HeroSlide.")

    # 10. Create Terms
    if not Terms.objects.exists():
        Terms.objects.create(
            content="# Terms and Conditions\n\nWelcome to Crystal Readymade.\n1. All products are sourced with premium quality materials.\n2. Delivery usually takes 3-5 business days."
        )
        print("Created Terms.")

    print("\nDatabase seeding completed successfully!!")

if __name__ == "__main__":
    run()
