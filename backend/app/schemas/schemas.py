from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

# Base Config to auto-convert snake_case (DB) to camelCase (Frontend)
class BaseSchema(BaseModel):
    model_config = ConfigDict(
        from_attributes=True, 
        populate_by_name=True, 
        alias_generator=to_camel
    )

# --- Category Schemas ---
class CategoryOut(BaseSchema):
    id: int
    name: str
    slug: str
    image: Optional[str] = None
    description: Optional[str] = None

# --- Brand Schemas ---
class BrandOut(BaseSchema):
    id: int
    name: str
    slug: str
    logo: Optional[str] = None
    description: Optional[str] = None

# --- Review Schemas ---
class ReviewOut(BaseSchema):
    id: int
    user_id: int
    user_name: str
    rating: float
    comment: Optional[str] = None
    created_at: datetime

# --- Product Schemas ---
class ProductOut(BaseSchema):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    sale_price: Optional[float] = None
    images: List[str] = []
    category_id: int
    brand_id: int
    tags: List[str] = []
    in_stock: bool
    quantity: int
    rating_average: float
    specifications: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Nested relationships
    reviews: List[ReviewOut] = []
    # Note: We return IDs for category/brand usually, but you can nest objects if needed

# --- User & Address Schemas ---
class AddressOut(BaseSchema):
    id: int
    name: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str
    is_default: bool

class UserOut(BaseSchema):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    addresses: List[AddressOut] = []

# --- Order Schemas ---
class OrderItemOut(BaseSchema):
    id: int
    product_id: int
    name: str
    price: float
    quantity: int
    image: Optional[str] = None

class OrderOut(BaseSchema):
    id: int
    user_id: int
    items: List[OrderItemOut]
    status: str
    shipping_address_snapshot: Dict[str, Any] # Returns the JSON object directly
    payment_method: str
    payment_status: str
    subtotal: float
    tax: float
    shipping_cost: float
    discount: float
    total: float
    tracking_number: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

# --- Notification Schemas ---
class NotificationOut(BaseSchema):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime