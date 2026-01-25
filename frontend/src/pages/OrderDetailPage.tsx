import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Truck, Check, X } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { Order, OrderStatus } from '../types';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, cancelOrder } = useOrders();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  
  useEffect(() => {
    if (orderId) {
      // Simulate API loading
      setLoading(true);
      setTimeout(() => {
        const foundOrder = getOrderById(orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
          document.title = `Order #${foundOrder.id.slice(-8)} | CrystalReadymade`;
        } else {
          navigate('/orders', { replace: true });
        }
        
        setLoading(false);
      }, 800);
    }
  }, [orderId, getOrderById, navigate]);
  
  const handleCancelOrder = async () => {
    if (!order) return;
    
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setCancelling(true);
      
      try {
        const success = await cancelOrder(order.id);
        
        if (success) {
          // Update the local order state
          setOrder(prev => prev ? { ...prev, status: 'cancelled' as OrderStatus } : null);
        } else {
          alert('Failed to cancel order. It may be too late to cancel.');
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('An error occurred while trying to cancel the order.');
      } finally {
        setCancelling(false);
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getOrderStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h1>
        <div className="animate-pulse space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-1/3 h-7 bg-gray-300 rounded mb-4"></div>
            <div className="w-1/2 h-5 bg-gray-300 rounded mb-6"></div>
            <div className="h-20 bg-gray-300 rounded mb-6"></div>
            <div className="h-40 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return null;
  }
  
  const orderStep = getOrderStatusStep(order.status);
  const canCancel = ['pending', 'processing'].includes(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center text-pink-600 hover:text-pink-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Orders
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order #{order.id.slice(-8)}
          </h1>
          <p className="text-gray-600">
            Placed on {formatDate(order.createdAt)}
          </p>
          
          {/* Order Status */}
          {order.status !== 'cancelled' ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Order Status</h2>
              <div className="relative">
                <div className="absolute top-4 left-5 w-[calc(100%-2.5rem)] h-0.5 bg-gray-200"></div>
                <div 
                  className="absolute top-4 left-5 h-0.5 bg-pink-500 transition-all duration-500"
                  style={{ width: `calc(${(orderStep - 1) * 33.3}%)` }}
                ></div>
                
                <div className="flex justify-between relative z-10">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        orderStep >= 1 
                          ? 'border-pink-500 bg-pink-500 text-white' 
                          : 'border-gray-300 bg-white text-gray-500'
                      }`}
                    >
                      <ShoppingBag size={18} />
                    </div>
                    <p className={`mt-2 text-sm ${orderStep >= 1 ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>
                      Order Placed
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        orderStep >= 2 
                          ? 'border-pink-500 bg-pink-500 text-white' 
                          : 'border-gray-300 bg-white text-gray-500'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {orderStep >= 2 ? '✓' : '2'}
                      </span>
                    </div>
                    <p className={`mt-2 text-sm ${orderStep >= 2 ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>
                      Processing
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        orderStep >= 3 
                          ? 'border-pink-500 bg-pink-500 text-white' 
                          : 'border-gray-300 bg-white text-gray-500'
                      }`}
                    >
                      <Truck size={18} />
                    </div>
                    <p className={`mt-2 text-sm ${orderStep >= 3 ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>
                      Shipped
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        orderStep >= 4 
                          ? 'border-pink-500 bg-pink-500 text-white' 
                          : 'border-gray-300 bg-white text-gray-500'
                      }`}
                    >
                      <Check size={18} />
                    </div>
                    <p className={`mt-2 text-sm ${orderStep >= 4 ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>
                      Delivered
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Tracking Info */}
              {order.status === 'shipped' && order.trackingNumber && (
                <div className="mt-8 p-4 bg-pink-50 border border-pink-100 rounded-md">
                  <h3 className="font-medium text-pink-800 mb-2">Tracking Information</h3>
                  <p className="text-pink-600">
                    Tracking Number: <span className="font-medium">{order.trackingNumber}</span>
                  </p>
                </div>
              )}
              
              {/* Cancel Button */}
              {canCancel && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="flex items-center text-red-600 hover:text-red-800"
                  >
                    <X size={16} className="mr-1" />
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 p-4 bg-pink-50 border border-red-100 rounded-md">
              <h3 className="font-medium text-red-800 mb-2 flex items-center">
                <X size={16} className="mr-1" />
                Order Cancelled
              </h3>
              <p className="text-red-600">
                This order has been cancelled and will not be processed.
              </p>
            </div>
          )}
        </div>
        
        {/* Order Details */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          
          <div className="divide-y divide-gray-200">
            {order.items.map(item => (
              <div key={item.id} className="py-4 flex">
                <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">
                {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">${order.tax.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200 mt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Shipping & Payment Info */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <address className="not-italic text-gray-600">
              <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </address>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <div className="text-gray-600">
              <p className="mb-2">
                <span className="font-medium text-gray-900">Payment Method:</span>{' '}
                {order.paymentMethod === 'card'
                  ? 'Credit/Debit Card'
                  : order.paymentMethod === 'upi'
                  ? 'UPI'
                  : order.paymentMethod === 'wallet'
                  ? 'Mobile Wallet'
                  : order.paymentMethod === 'netbanking'
                  ? 'Net Banking'
                  : 'Cash on Delivery'}
              </p>
              <p className="mb-2">
                <span className="font-medium text-gray-900">Payment Status:</span>{' '}
                <span className={`${
                  order.paymentStatus === 'paid'
                    ? 'text-green-600'
                    : order.paymentStatus === 'pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;