import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AccountPage from './pages/AccountPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  element: React.ReactNode, 
  requiresAuth?: boolean,
  requiresAdmin?: boolean
}> = ({ element, requiresAuth = true, requiresAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    // Show loading indicator while checking authentication
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (requiresAuth && !isAuthenticated) {
    // Redirect to login page if authentication is required but user is not authenticated
    return <Navigate to="/login" replace />;
  }
  
  if (requiresAdmin && !isAdmin) {
    // Redirect to home page if admin role is required but user is not an admin
    return <Navigate to="/" replace />;
  }
  
  // Render the protected component
  return <>{element}</>;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route path="checkout" element={<ProtectedRoute element={<CheckoutPage />} />} />
        <Route path="wishlist" element={<ProtectedRoute element={<WishlistPage />} />} />
        <Route path="orders" element={<ProtectedRoute element={<OrdersPage />} />} />
        <Route path="orders/:orderId" element={<ProtectedRoute element={<OrderDetailPage />} />} />
        <Route path="account/*" element={<ProtectedRoute element={<AccountPage />} />} />
        <Route path="notifications" element={<ProtectedRoute element={<NotificationsPage />} />} />
        
        {/* Admin Routes */}
        <Route path="admin/*" element={<ProtectedRoute element={<AdminDashboardPage />} requiresAdmin={true} />} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;