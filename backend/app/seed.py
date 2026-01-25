import sys
from datetime import datetime
from passlib.context import CryptContext

# Import your database setup and models
from database.tables import SessionLocal, engine, Base, Category, Brand, Product, User, Address, Review, Order, OrderItem, Notification

# Password hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Initialize the database tables
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Check if data exists to avoid duplicates
    if db.query(Category).first():
        print("Data already exists! Skipping seed.")
        return

    print("🌱 Seeding data...")

    # --- 1. Categories ---
    categories = [
        Category(
            name='Clothing',
            slug='clothing',
            image='https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description='Trendy clothes for all occasions'
        ),
        Category(
            name='Jewelry',
            slug='jewelry',
            image='https://images.pexels.com/photos/371285/pexels-photo-371285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description='Beautiful jewelry pieces for all occasions'
        ),
        Category(
            name='Home Decor',
            slug='home-decor',
            image='https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description='Stylish decor to enhance your home'
        ),
        Category(
            name='Accessories',
            slug='accessories',
            image='https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description='Must-have accessories to complete your look'
        )
    ]
    db.add_all(categories)
    db.commit() # Commit to get IDs
    print("✅ Categories added")

    # --- 2. Brands ---
    brands = [
        Brand(
            name='Crystal Elegance',
            slug='crystal-elegance',
            logo='https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description='Elegant designs for the modern woman'
        ),
        Brand(
            name='Urban Crystal',
            slug='urban-crystal',
            logo='https://images.pexels.com/photos/2449600/pexels-photo-2449600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description='Urban styles with a crystal twist'
        ),
        Brand(
            name='Crystal Home',
            slug='crystal-home',
            logo='https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description='Luxury home decor with crystal accents'
        )
    ]
    db.add_all(brands)
    db.commit()
    print("✅ Brands added")

    # Fetch IDs for relationships
    cat_jewelry = db.query(Category).filter_by(slug='jewelry').first()
    cat_clothing = db.query(Category).filter_by(slug='clothing').first()
    cat_home = db.query(Category).filter_by(slug='home-decor').first()
    cat_acc = db.query(Category).filter_by(slug='accessories').first()

    brand_elegance = db.query(Brand).filter_by(slug='crystal-elegance').first()
    brand_urban = db.query(Brand).filter_by(slug='urban-crystal').first()
    brand_home = db.query(Brand).filter_by(slug='crystal-home').first()

    # --- 3. Users & Addresses ---
    users = [
        User(
            name='John Doe', 
            email='john@example.com', 
            password=pwd_context.hash('password123'),
            phone='555-123-4567', 
            role='user',
            addresses=[
                Address(name='Home', line1='123 Main St', line2='Apt 4B', city='New York', state='NY', postal_code='10001', country='United States', is_default=True)
            ]
        ),
        User(
            name='Jane Smith', 
            email='jane@example.com', 
            password=pwd_context.hash('password123'),
            phone='555-987-6543', 
            role='user',
            addresses=[
                Address(name='Home', line1='456 Oak Ave', city='Los Angeles', state='CA', postal_code='90001', country='United States', is_default=True),
                Address(name='Work', line1='789 Corporate Blvd', city='Los Angeles', state='CA', postal_code='90015', country='United States', is_default=False)
            ]
        ),
        User(
            name='Admin User', 
            email='admin@crystalreadymade.com', 
            password=pwd_context.hash('admin123'),
            phone='555-555-5555', 
            role='admin',
            addresses=[
                Address(name='Office', line1='100 Commerce St', city='Chicago', state='IL', postal_code='60601', country='United States', is_default=True)
            ]
        )
    ]
    db.add_all(users)
    db.commit()
    print("✅ Users added")

    # Fetch Users for relationships
    user1 = db.query(User).filter_by(email='john@example.com').first()
    user2 = db.query(User).filter_by(email='jane@example.com').first()
    user3 = db.query(User).filter_by(email='admin@crystalreadymade.com').first()

    # --- 4. Products & Reviews ---
    products = [
        Product(
            name='Crystal Pendant Necklace',
            slug='crystal-pendant-necklace',
            description='Beautiful crystal pendant necklace that shines in any light.',
            price=129.99,
            sale_price=99.99,
            images=['https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg', 'https://images.pexels.com/photos/689428/pexels-photo-689428.jpeg'],
            category_id=cat_jewelry.id,
            brand_id=brand_elegance.id,
            tags=['necklace', 'pendant', 'crystal', 'jewelry'],
            in_stock=True,
            quantity=25,
            rating_average=4.8,
            specifications={'Material': 'Sterling Silver', 'Weight': '10g'},
            created_at=datetime(2024, 12, 1),
            reviews=[
                Review(user_id=user1.id, user_name='Emily Smith', rating=5, comment='Absolutely gorgeous necklace!'),
                Review(user_id=user2.id, user_name='Jessica Williams', rating=4.5, comment='Beautiful quality.')
            ]
        ),
        Product(
            name='Crystal Embellished Evening Dress',
            slug='crystal-embellished-evening-dress',
            description='Stunning evening dress with crystal embellishments.',
            price=299.99,
            images=['https://images.pexels.com/photos/291759/pexels-photo-291759.jpeg', 'https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg'],
            category_id=cat_clothing.id,
            brand_id=brand_elegance.id,
            tags=['dress', 'evening wear', 'crystal'],
            in_stock=True,
            quantity=10,
            rating_average=4.9,
            specifications={'Material': 'Silk', 'Size': 'M'},
            created_at=datetime(2024, 12, 5),
            reviews=[
                Review(user_id=user3.id, user_name='Olivia Johnson', rating=5, comment='Breathtaking dress!')
            ]
        ),
        Product(
            name='Crystal Table Lamp',
            slug='crystal-table-lamp',
            description='Elegant crystal table lamp that adds luxury to any room.',
            price=189.99,
            sale_price=149.99,
            images=['https://images.pexels.com/photos/1125137/pexels-photo-1125137.jpeg'],
            category_id=cat_home.id,
            brand_id=brand_home.id,
            tags=['lamp', 'lighting', 'crystal'],
            in_stock=True,
            quantity=15,
            rating_average=4.7,
            specifications={'Material': 'Crystal', 'Wattage': '40W'},
            created_at=datetime(2024, 12, 10),
            reviews=[
                Review(user_id=user1.id, user_name='Michael Brown', rating=5, comment='Beautiful lamp!')
            ]
        ),
        Product(
            name='Crystal Embellished Clutch',
            slug='crystal-embellished-clutch',
            description='Stylish clutch with crystal embellishments.',
            price=89.99,
            images=['https://images.pexels.com/photos/5707180/pexels-photo-5707180.jpeg'],
            category_id=cat_acc.id,
            brand_id=brand_urban.id,
            tags=['clutch', 'bag', 'crystal'],
            in_stock=True,
            quantity=20,
            rating_average=4.6,
            specifications={'Material': 'Satin', 'Dimensions': '10x5'},
            created_at=datetime(2024, 12, 15),
            reviews=[
                Review(user_id=user2.id, user_name='Lauren Roberts', rating=5, comment='Gorgeous clutch!')
            ]
        ),
        Product(
            name='Crystal Chandelier',
            slug='crystal-chandelier',
            description='Luxurious crystal chandelier that transforms any space.',
            price=599.99,
            sale_price=499.99,
            images=['https://images.pexels.com/photos/6508362/pexels-photo-6508362.jpeg'],
            category_id=cat_home.id,
            brand_id=brand_home.id,
            tags=['chandelier', 'lighting', 'luxury'],
            in_stock=True,
            quantity=5,
            rating_average=4.9,
            specifications={'Diameter': '24 inches', 'Bulbs': '8'},
            created_at=datetime(2024, 12, 20),
            reviews=[
                Review(user_id=user3.id, user_name='Jennifer Adams', rating=5, comment='Stunning!')
            ]
        ),
        Product(
            name='Crystal Bracelet Set',
            slug='crystal-bracelet-set',
            description='Set of three matching crystal bracelets.',
            price=79.99,
            images=['https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg'],
            category_id=cat_jewelry.id,
            brand_id=brand_elegance.id,
            tags=['bracelet', 'jewelry', 'set'],
            in_stock=True,
            quantity=30,
            rating_average=4.7,
            specifications={'Material': 'Sterling Silver', 'Size': 'Adjustable'},
            created_at=datetime(2024, 12, 22),
            reviews=[
                Review(user_id=user1.id, user_name='Emma White', rating=5, comment='I get compliments every time.')
            ]
        )
    ]
    db.add_all(products)
    db.commit()
    print("✅ Products & Reviews added")

    # Fetch Products for Order Items
    p_necklace = db.query(Product).filter_by(slug='crystal-pendant-necklace').first()
    p_lamp = db.query(Product).filter_by(slug='crystal-table-lamp').first()
    p_dress = db.query(Product).filter_by(slug='crystal-embellished-evening-dress').first()
    p_bracelet = db.query(Product).filter_by(slug='crystal-bracelet-set').first()

    # --- 5. Orders ---
    orders = [
        Order(
            user_id=user1.id,
            status='delivered',
            payment_method='card',
            payment_status='paid',
            subtotal=179.98, tax=14.40, shipping_cost=9.99, total=204.37,
            tracking_number='TRK12345678',
            shipping_address_snapshot={
                'line1': '123 Main St', 'city': 'New York', 'state': 'NY', 'zip': '10001'
            },
            created_at=datetime(2025, 1, 10),
            items=[
                OrderItem(product_id=p_necklace.id, name=p_necklace.name, price=99.99, quantity=1, image=p_necklace.images[0]),
                OrderItem(product_id=p_bracelet.id, name=p_bracelet.name, price=79.99, quantity=1, image=p_bracelet.images[0])
            ]
        ),
        Order(
            user_id=user2.id,
            status='shipped',
            payment_method='upi',
            payment_status='paid',
            subtotal=299.98, tax=24.00, shipping_cost=0, discount=30.00, total=293.98,
            tracking_number='TRK87654321',
            shipping_address_snapshot={
                'line1': '456 Oak Ave', 'city': 'Los Angeles', 'state': 'CA', 'zip': '90001'
            },
            created_at=datetime(2025, 1, 18),
            items=[
                OrderItem(product_id=p_lamp.id, name=p_lamp.name, price=149.99, quantity=2, image=p_lamp.images[0])
            ]
        ),
        Order(
            user_id=user1.id,
            status='processing',
            payment_method='card',
            payment_status='paid',
            subtotal=299.99, tax=24.00, shipping_cost=12.99, total=336.98,
            shipping_address_snapshot={
                'line1': '123 Main St', 'city': 'New York', 'state': 'NY', 'zip': '10001'
            },
            created_at=datetime(2025, 1, 22),
            items=[
                OrderItem(product_id=p_dress.id, name=p_dress.name, price=299.99, quantity=1, image=p_dress.images[0])
            ]
        )
    ]
    db.add_all(orders)
    db.commit()
    print("✅ Orders added")

    # --- 6. Notifications ---
    notifications = [
        Notification(user_id=user1.id, title='Order Delivered', message='Your order #1001 has been delivered.', type='order', is_read=False, created_at=datetime(2025, 1, 15)),
        Notification(user_id=user2.id, title='Order Shipped', message='Your order #1002 has been shipped.', type='order', is_read=True, created_at=datetime(2025, 1, 20)),
        Notification(user_id=user1.id, title='Special Offer', message='Enjoy 20% off on all jewelry this weekend.', type='promotion', is_read=False, created_at=datetime(2025, 1, 24))
    ]
    db.add_all(notifications)
    db.commit()
    print("✅ Notifications added")

    db.close()
    print("🎉 Database successfully populated!")

if __name__ == "__main__":
    seed_data()