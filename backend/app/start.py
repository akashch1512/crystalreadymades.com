from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
from pydantic import BaseModel

# Import your database setup (assuming file is named database.py)
from .database.tables import SessionLocal, engine, Base
# Import all models to ensure they are registered
from .database.tables import Category, Brand, Product, User, Order, Notification, Address
# Import schemas
from .schemas.schemas import (
    CategoryOut, BrandOut, ProductOut, UserOut, OrderOut, NotificationOut, AddressIn, AddressOut
)

# Create tables automatically (for simplicity in development)
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===== Authentication Setup =====
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Pydantic models for auth
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginResponse(BaseModel):
    user: UserOut
    token: str

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(authorization: Optional[str] = Header(None, alias="Authorization"), db: Session = Depends(get_db)):
    print(f"DEBUG: Authorization header received: {authorization}")
    
    if not authorization:
        print("DEBUG: No authorization header found")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing")
    
    # Extract token from "Bearer <token>"
    try:
        parts = authorization.split()
        if len(parts) != 2:
            print(f"DEBUG: Invalid authorization format, parts: {len(parts)}")
            raise ValueError("Invalid format")
        scheme, token = parts
        if scheme.lower() != "bearer":
            print(f"DEBUG: Invalid scheme: {scheme}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth scheme")
    except ValueError as e:
        print(f"DEBUG: Error parsing authorization header: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            print("DEBUG: No user_id in token payload")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        user_id = int(user_id_str)
    except (JWTError, ValueError) as e:
        print(f"DEBUG: JWT decode error: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        print(f"DEBUG: User not found for id: {user_id}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    print(f"DEBUG: User authenticated: {user.email}")
    return user

app = FastAPI(
    title="Crystal E-Commerce API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():
    return {"status": "API is running"}

# --- Categories ---
@app.get("/api/products/categories", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories

@app.get("/api/products/categories/{id}", response_model=CategoryOut)
def get_category(id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# --- Brands ---
@app.get("/api/products/brands", response_model=List[BrandOut])
def get_brands(db: Session = Depends(get_db)):
    brands = db.query(Brand).all()
    return brands

# --- Products ---
@app.get("/api/products", response_model=List[ProductOut])
def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Returns products with nested reviews included (eager loading is handled by relationship default)
    return db.query(Product).offset(skip).limit(limit).all()

@app.get("/api/products/{slug}", response_model=ProductOut)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# --- Users ---
@app.get("/users", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/users/{id}", response_model=UserOut)
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- Orders ---
@app.get("/orders", response_model=List[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()

@app.get("/orders/user/{user_id}", response_model=List[OrderOut])
def get_user_orders(user_id: int, db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.user_id == user_id).all()

# --- Notifications ---
@app.get("/notifications/{user_id}", response_model=List[NotificationOut])
def get_notifications(user_id: int, db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == user_id).all()

# --- Addresses ---
@app.post("/api/addresses", response_model=UserOut)
def create_address(address_data: AddressIn, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a new address for the current user"""
    new_address = Address(
        user_id=current_user.id,
        name=address_data.name,
        line1=address_data.line1,
        line2=address_data.line2,
        city=address_data.city,
        state=address_data.state,
        postal_code=address_data.postal_code,
        country=address_data.country,
        is_default=address_data.is_default
    )
    
    db.add(new_address)
    db.commit()
    db.refresh(current_user)
    return current_user

@app.put("/api/addresses/{address_id}", response_model=UserOut)
def update_address(address_id: int, address_data: AddressIn, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update an existing address"""
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    address.name = address_data.name
    address.line1 = address_data.line1
    address.line2 = address_data.line2
    address.city = address_data.city
    address.state = address_data.state
    address.postal_code = address_data.postal_code
    address.country = address_data.country
    address.is_default = address_data.is_default
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.delete("/api/addresses/{address_id}", response_model=UserOut)
def delete_address(address_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete an address"""
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    db.delete(address)
    db.commit()
    db.refresh(current_user)
    return current_user

# ===== Authentication Endpoints =====
@app.post("/api/auth/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login endpoint - returns user and JWT token"""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
    
    return LoginResponse(user=UserOut.from_orm(user), token=access_token)

@app.post("/api/auth/register", response_model=LoginResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register endpoint - creates new user and returns JWT token"""
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(request.password)
    new_user = User(
        name=request.name,
        email=request.email,
        password=hashed_password,
        role="user"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": str(new_user.id)}, expires_delta=access_token_expires)
    
    return LoginResponse(user=UserOut.from_orm(new_user), token=access_token)

@app.get("/api/user/me", response_model=UserOut)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current logged-in user info"""
    return current_user