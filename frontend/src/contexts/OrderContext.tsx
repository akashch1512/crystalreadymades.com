import React, { createContext, useState, useContext, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { getOrders } from '../data/mockData';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useNotifications } from './NotificationContext';

interface OrderContextValue {
  orders: Order[];
  createOrder: (paymentMethod: string) => Promise<{ success: boolean; orderId?: string }>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByUser: () => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

const OrderContext = createContext<OrderContextValue>({
  orders: [],
  createOrder: async () => ({ success: false }),
  cancelOrder: async () => false,
  getOrderById: () => undefined,
  getOrdersByUser: () => [],
  updateOrderStatus: async () => false,
});

export const useOrders = () => useContext(OrderContext);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { items, subtotal, tax, shipping, discount, total, clearCart } = useCart();
  const { addNotification } = useNotifications();

  // Load orders from API on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await getOrders();
        setAllOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to load orders:', error);
        setAllOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Simulates creating a new order
  const createOrder = async (paymentMethod: string): Promise<{ success: boolean; orderId?: string }> => {
    if (!user || items.length === 0) {
      return { success: false };
    }

    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the user's default address (in a real app, this would be selected during checkout)
      const shippingAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
      
      if (!shippingAddress) {
        return { success: false };
      }

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        userId: user.id,
        items: items.map(item => ({
          id: `order-item-${Date.now()}-${item.productId}`,
          productId: item.productId,
          name: item.name,
          price: item.salePrice || item.price,
          quantity: item.quantity,
          image: item.image
        })),
        status: 'pending',
        shippingAddress,
        paymentMethod: paymentMethod as any,
        paymentStatus: 'paid', // Mock - assuming payment is successful
        subtotal,
        tax,
        shipping,
        discount,
        total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setAllOrders(prev => [newOrder, ...prev]);
      
      // Clear the cart after successful order
      clearCart();
      
      // Add a notification
      addNotification({
        title: 'Order Placed',
        message: `Your order #${newOrder.id} has been placed and is being processed.`,
        type: 'order',
        read: false,
      });

      return { success: true, orderId: newOrder.id };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false };
    }
  };

  // Simulates cancelling an order
  const cancelOrder = async (orderId: string): Promise<boolean> => {
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));

      const orderToCancel = allOrders.find(order => order.id === orderId);
      
      if (!orderToCancel) {
        return false;
      }

      // Only allow cancellation if order is pending or processing
      if (!['pending', 'processing'].includes(orderToCancel.status)) {
        return false;
      }

      // Check if user is authorized to cancel (user's own order or admin)
      if (orderToCancel.userId !== user?.id && !isAdmin) {
        return false;
      }

      setAllOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: 'cancelled',
                updatedAt: new Date().toISOString()
              } 
            : order
        )
      );
      
      // Add a notification
      addNotification({
        title: 'Order Cancelled',
        message: `Your order #${orderId} has been cancelled.`,
        type: 'order',
        read: false,
      });

      return true;
    } catch (error) {
      console.error('Error cancelling order:', error);
      return false;
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    // For admin, return any order. For users, only return their own orders
    if (isAdmin) {
      return allOrders.find(order => order.id === orderId);
    }
    
    return allOrders.find(order => order.id === orderId && order.userId === user?.id);
  };

  const getOrdersByUser = (): Order[] => {
    if (!user) return [];
    
    // For admin, return all orders. For users, only return their own orders
    if (isAdmin) {
      return allOrders;
    }
    
    return allOrders.filter(order => order.userId === user.id);
  };

  // Admin function to update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    if (!isAdmin) {
      return false;
    }

    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAllOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status,
                updatedAt: new Date().toISOString(),
                ...(status === 'shipped' ? { 
                  trackingNumber: `TRK${Math.floor(Math.random() * 90000000) + 10000000}` 
                } : {})
              } 
            : order
        )
      );

      // Find the order to get the user ID
      const updatedOrder = allOrders.find(order => order.id === orderId);
      
      if (updatedOrder) {
        // Add a notification for the user
        const statusMessages = {
          processing: 'is now being processed',
          shipped: 'has been shipped',
          delivered: 'has been delivered',
          cancelled: 'has been cancelled'
        };
        
        const message = statusMessages[status] || 'status has been updated';
        
        addNotification({
          userId: updatedOrder.userId,
          title: 'Order Update',
          message: `Your order #${orderId} ${message}.`,
          type: 'order',
          read: false,
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

  return (
    <OrderContext.Provider value={{
      orders: allOrders,
      createOrder,
      cancelOrder,
      getOrderById,
      getOrdersByUser,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};