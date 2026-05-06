import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Order, OrderStatus } from '../types';
import { getOrders } from '../data/mockData';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useNotifications } from './NotificationContext';

interface OrderContextValue {
  orders: Order[];
  createOrder: (
    paymentMethod: string,
    addressId: string,
    paymentDetails?: {
      paymentStatus?: string;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
    }
  ) => Promise<{ success: boolean; orderId?: string }>;
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

const normalizeOrder = (order: any): Order => ({
  id: String(order.id),
  userId: String(order.user_id ?? order.userId ?? ''),
  items: (order.items ?? []).map((item: any) => ({
    ...item,
    price: Number(item.price ?? 0),
    quantity: Number(item.quantity ?? 1)
  })),
  status: order.status ?? 'pending',
  shippingAddress: order.shipping_address_snapshot ?? order.shippingAddress ?? null,
  paymentMethod: order.payment_method ?? order.paymentMethod ?? 'cod',
  paymentStatus: order.payment_status ?? order.paymentStatus ?? 'pending',
  subtotal: Number(order.subtotal ?? 0),
  tax: Number(order.tax ?? 0),
  shipping: Number(order.shipping_cost ?? order.shipping ?? 0),
  discount: Number(order.discount ?? 0),
  total: Number(order.total ?? 0),
  trackingNumber: order.tracking_number ?? order.trackingNumber,
  createdAt: order.created_at ?? order.createdAt ?? new Date().toISOString(),
  updatedAt: order.updated_at ?? order.updatedAt ?? new Date().toISOString(),
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
        setAllOrders(fetchedOrders.map(normalizeOrder));
      } catch (error) {
        console.error('Failed to load orders:', error);
        setAllOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const createOrder = async (
    paymentMethod: string,
    addressId: string,
    paymentDetails?: {
      paymentStatus?: string;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
    }
  ): Promise<{ success: boolean; orderId?: string }> => {
    if (!user || items.length === 0) {
      return { success: false };
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/api/orders`,
        {
          payment_method: paymentMethod,
          address_id: addressId,
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.salePrice || item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          subtotal,
          tax,
          shipping_cost: shipping,
          discount,
          total,
          payment_status: paymentDetails?.paymentStatus || (paymentMethod === 'cod' ? 'pending' : 'paid'),
          razorpay_order_id: paymentDetails?.razorpayOrderId,
          razorpay_payment_id: paymentDetails?.razorpayPaymentId,
          razorpay_signature: paymentDetails?.razorpaySignature,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const createdOrder: Order = normalizeOrder(response.data);
      setAllOrders(prev => [createdOrder, ...prev]);
      addNotification({
        title: 'Order Placed',
        message: `Your order #${createdOrder.id} has been placed and is being processed.`,
        type: 'order',
        read: false,
      });

      return { success: true, orderId: createdOrder.id };
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
      if (String(orderToCancel.userId) !== String(user?.id) && !isAdmin) {
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
    const normalizedOrderId = String(orderId);

    // For admin, return any order. For users, only return their own orders
    if (isAdmin) {
      return allOrders.find(order => String(order.id) === normalizedOrderId);
    }

    return allOrders.find(
      order => String(order.id) === normalizedOrderId && String(order.userId) === String(user?.id)
    );
  };

  const getOrdersByUser = (): Order[] => {
    if (!user) return [];

    // For admin, return all orders. For users, only return their own orders
    if (isAdmin) {
      return allOrders;
    }

    return allOrders.filter(order => String(order.userId) === String(user.id));
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
