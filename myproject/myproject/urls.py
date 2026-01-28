from django.contrib import admin
from django.urls import path
from store import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Root
    path('', lambda request: JsonResponse({"status": "API is running"})),

    # Auth
    path('api/auth/login', views.LoginView.as_view()),
    path('api/auth/register', views.RegisterView.as_view()),
    path('api/user/me', views.UserMeView.as_view()),
    path('api/user/update', views.UserUpdateView.as_view()),

    # Categories
    path('api/products/categories', views.CategoryListView.as_view()),
    path('api/products/categories/<int:id>', views.CategoryDetailView.as_view()),

    # Brands
    path('api/products/brands', views.BrandListView.as_view()),

    # Products
    path('api/products', views.ProductListView.as_view()), # Handles ?skip=0&limit=100
    path('api/products/<str:slug>', views.ProductDetailView.as_view()),

    # Users
    path('api/users', views.UserListView.as_view()),
    path('api/users/<int:id>', views.UserDetailView.as_view()),

    # Orders
    path('api/orders', views.OrderListView.as_view()),
    path('api/orders/user/<int:user_id>', views.UserOrderListView.as_view()),

    # Notifications
    path('api/notifications/<int:user_id>', views.NotificationListView.as_view()),

    # Addresses
    path('api/addresses', views.AddressListCreateView.as_view()),
    path('api/addresses/<int:address_id>', views.AddressDetailView.as_view()),
    
    # Hero Slides
    path('api/hero-slides', views.HeroSlideListView.as_view()),

]

# Helper for root
from django.http import JsonResponse