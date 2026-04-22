import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderReview from '../components/checkout/OrderReview';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const CheckoutPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = 'Checkout | CrystalReadymade';
    
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    // Redirect if cart is empty
    if (items.length === 0 && !orderCompleted) {
      navigate('/cart');
    }
  }, [isAuthenticated, items, navigate, orderCompleted]);
  
  const handleOrderSuccess = (completedOrderId: string) => {
    setOrderId(completedOrderId);
    setOrderCompleted(true);
  };
  
  if (orderCompleted && orderId) {
    return (
      <div className="page">
        <div className="section px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center py-10 px-6 sm:py-12 sm:px-12 bg-green-50 rounded-2xl border border-green-200 shadow-sm mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="h2 mb-3">Order Placed Successfully!</h1>
              <p className="text-muted mb-4 sm:mb-6 text-sm sm:text-base">
                Thank you for your purchase. Your order has been confirmed.
              </p>
              <p className="text-muted mb-8 text-sm sm:text-base">
                Order ID: <span className="font-semibold text-text">{orderId}</span>
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Link
                  to={`/orders/${orderId}`}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  View Order Details
                </Link>
                <Link
                  to="/"
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="section">
        <div className="container mx-auto">
          <h1 className="h1 mb-2">Checkout</h1>
          <div className="mb-8">
            <Link to="/cart" className="inline-flex items-center text-brand hover:text-brand-strong">
              <ArrowLeft size={16} className="mr-1" />
              Back to Cart
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card p-6 mb-6">
                <h2 className="h3 mb-6">Shipping & Payment</h2>
                <CheckoutForm onSuccess={handleOrderSuccess} />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="card p-6 mb-6">
                <h2 className="h3 mb-4">Order Summary</h2>
                <OrderReview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
