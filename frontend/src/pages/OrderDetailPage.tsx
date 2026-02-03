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
      <div className="page">
        <div className="section">
          <div className="container mx-auto">
            <h1 className="h1 mb-6">Order Details</h1>
            <div className="animate-pulse space-y-8">
              <div className="card p-6">
                <div className="w-1/3 h-7 bg-surface-muted rounded mb-4"></div>
                <div className="w-1/2 h-5 bg-surface-muted rounded mb-6"></div>
                <div className="h-20 bg-surface-muted rounded mb-6"></div>
                <div className="h-40 bg-surface-muted rounded"></div>
              </div>
            </div>
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
    <div className="page">
      <div className="section">
        <div className="container mx-auto">
          <div className="mb-6">
            <Link
              to="/orders"
              className="inline-flex items-center text-brand hover:text-brand-strong"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Orders
            </Link>
          </div>
          
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-line">
              <h1 className="h1 mb-2">
                Order #{order.id.slice(-8)}
              </h1>
              <p className="text-muted">
                Placed on {formatDate(order.createdAt)}
              </p>
              
              {/* Order Status */}
              {order.status !== 'cancelled' ? (
                <div className="mt-8">
                  <h2 className="h3 mb-4">Order Status</h2>
                  <div className="relative">
                    <div className="absolute top-4 left-5 w-[calc(100%-2.5rem)] h-0.5 bg-line"></div>
                    <div 
                      className="absolute top-4 left-5 h-0.5 bg-brand transition-all duration-500"
                      style={{ width: `calc(${(orderStep - 1) * 33.3}%)` }}
                    ></div>
                    
                    <div className="flex justify-between relative z-10">
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                            orderStep >= 1 
                              ? 'border-brand bg-brand text-white' 
                              : 'border-line bg-surface text-muted'
                          }`}
                        >
                          <ShoppingBag size={18} />
                        </div>
                        <p className={`mt-2 text-sm ${orderStep >= 1 ? 'text-brand font-medium' : 'text-muted'}`}>
                          Order Placed
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                            orderStep >= 2 
                              ? 'border-brand bg-brand text-white' 
                              : 'border-line bg-surface text-muted'
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {orderStep >= 2 ? '✓' : '2'}
                          </span>
                        </div>
                        <p className={`mt-2 text-sm ${orderStep >= 2 ? 'text-brand font-medium' : 'text-muted'}`}>
                          Processing
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                            orderStep >= 3 
                              ? 'border-brand bg-brand text-white' 
                              : 'border-line bg-surface text-muted'
                          }`}
                        >
                          <Truck size={18} />
                        </div>
                        <p className={`mt-2 text-sm ${orderStep >= 3 ? 'text-brand font-medium' : 'text-muted'}`}>
                          Shipped
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                            orderStep >= 4 
                              ? 'border-brand bg-brand text-white' 
                              : 'border-line bg-surface text-muted'
                          }`}
                        >
                          <Check size={18} />
                        </div>
                        <p className={`mt-2 text-sm ${orderStep >= 4 ? 'text-brand font-medium' : 'text-muted'}`}>
                          Delivered
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tracking Info */}
                  {order.status === 'shipped' && order.trackingNumber && (
                    <div className="mt-8 p-4 bg-brand border border-brand rounded-2xl bg-opacity-10 border-opacity-20">
                      <h3 className="font-medium text-brand-strong mb-2">Tracking Information</h3>
                      <p className="text-brand">
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
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-2xl">
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
            <div className="p-6 border-b border-line">
              <h2 className="h3 mb-4">Order Items</h2>
              
              <div className="divide-y divide-line">
                {order.items.map(item => (
                  <div key={item.id} className="py-4 flex">
                    <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-line">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-text">{item.name}</h3>
                      <p className="text-sm text-muted">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-text">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="p-6 border-b border-line">
              <h2 className="h3 mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-text">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="text-text">
                    {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Tax</span>
                  <span className="text-text">${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Discount</span>
                    <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium pt-2 border-t border-line mt-2">
                  <span className="text-text">Total</span>
                  <span className="text-text">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Shipping & Payment Info */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="h3 mb-4">Shipping Information</h2>
                <address className="not-italic text-muted">
                  <p className="font-medium text-text">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </address>
              </div>
              
              <div>
                <h2 className="h3 mb-4">Payment Information</h2>
                <div className="text-muted">
                  <p className="mb-2">
                    <span className="font-medium text-text">Payment Method:</span>{' '}
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
                    <span className="font-medium text-text">Payment Status:</span>{' '}
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
      </div>
    </div>
  );
};

export default OrderDetailPage;