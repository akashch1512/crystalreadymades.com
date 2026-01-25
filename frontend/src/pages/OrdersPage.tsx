import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const { getOrdersByUser } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'My Orders | CrystalReadymade';
    
    // Simulate loading
    setTimeout(() => {
      const userOrders = getOrdersByUser();
      setOrders(userOrders);
      setLoading(false);
    }, 800);
  }, [getOrdersByUser]);
  
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-pink-100 text-pink-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-pink-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">My Orders</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
              </div>
              <div className="w-1/2 h-5 bg-gray-300 rounded mb-4"></div>
              <div className="w-1/4 h-5 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Orders</h1>
      
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(-8)}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 my-4">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                    <span>Total: ${order.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex overflow-x-auto py-2 space-x-4">
                    {order.items.slice(0, 4).map(item => (
                      <div key={item.id} className="flex-shrink-0 w-16 h-16 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded border border-gray-200"
                        />
                        {item.quantity > 1 && (
                          <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        +{order.items.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    {order.status === 'shipped' && order.trackingNumber && (
                      <p className="text-sm text-gray-600">
                        Tracking: <span className="font-medium">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                    >
                      View Order Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link
            to="/products"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;