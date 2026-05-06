from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from store import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Root
    path('', lambda request: JsonResponse({"status": "API is running"})),

    # Auth
    path('api/auth/login', views.LoginView.as_view()),
    path('api/auth/register', views.RegisterView.as_view()),
    path('api/auth/verify-email', views.VerifyEmailView.as_view()),
    path('api/auth/verify-email-change', views.VerifyEmailChangeView.as_view()),
    path('api/auth/resend-otp', views.ResendOTPView.as_view()),
    path('api/user/me', views.UserMeView.as_view()),
    path('api/user/update', views.UserUpdateView.as_view()),
    path('api/admin/reviews', views.AdminReviewListView.as_view()),
    path('api/admin/support-tickets', views.SupportTicketListCreateView.as_view()),
    path('api/admin/support-tickets/<int:id>', views.SupportTicketDetailView.as_view()),
    path('api/admin/store-settings', views.AdminStoreSettingsView.as_view()),
    path('api/support-tickets', views.SupportTicketListCreateView.as_view()),

    # Categories
    path('api/products/categories', views.CategoryListView.as_view()),
    path('api/products/categories/<int:id>', views.CategoryDetailView.as_view()),

    # Brands
    path('api/products/brands', views.BrandListView.as_view()),

    # Products
    path('api/products', views.ProductListView.as_view()),
    path('api/products/<int:id>', views.ProductAdminDetailView.as_view()),
    path('api/products/<str:slug>/reviews', views.ProductReviewCreateView.as_view()),
    path('api/products/<str:slug>', views.ProductDetailView.as_view()),

    # Users
    path('api/users', views.UserListView.as_view()),
    path('api/users/<int:id>', views.UserDetailView.as_view()),

    # Orders
    path('api/orders', views.OrderListCreateView.as_view()),
    path('api/orders/user/<int:user_id>', views.UserOrderListView.as_view()),
    path('api/orders/<int:order_id>/status', views.OrderStatusUpdateView.as_view()),

    # Payment
    path('api/payment/create-order', views.PaymentCreateOrderView.as_view()),
    path('api/payment/verify-payment', views.PaymentVerifyView.as_view()),

    # Notifications
    path('api/notifications/<int:user_id>', views.NotificationListView.as_view()),

    # Addresses
    path('api/addresses', views.AddressListCreateView.as_view()),
    path('api/addresses/<int:address_id>', views.AddressDetailView.as_view()),
    path('api/addresses/<int:address_id>/set-default', views.AddressSetDefaultView.as_view()),

    # Hero Slides
    path('api/hero-slides', views.HeroSlideListView.as_view()),
]
