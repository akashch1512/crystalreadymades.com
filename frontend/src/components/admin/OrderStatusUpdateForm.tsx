import React, { useState } from 'react';
import { OrderStatus } from '../../types';

interface OrderStatusUpdateFormProps {
  orderId: string;
  currentStatus: OrderStatus;
  onUpdate: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

const OrderStatusUpdateForm: React.FC<OrderStatusUpdateFormProps> = ({
  orderId,
  currentStatus,
  onUpdate
}) => {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as OrderStatus);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === currentStatus) {
      setMessage({ type: 'info', text: 'Order status is already set to this value.' });
      return;
    }
    
    try {
      setUpdating(true);
      setMessage({ type: '', text: '' });
      
      const success = await onUpdate(orderId, status);
      
      if (success) {
        setMessage({ type: 'success', text: 'Order status updated successfully.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update order status. Please try again.' });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message.text && (
        <div
          className={`p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : message.type === 'error'
              ? 'bg-pink-50 text-red-700'
              : 'bg-pink-50 text-pink-700'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Order Status
        </label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={handleStatusChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      <button
        type="submit"
        disabled={updating || status === currentStatus}
        className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
      >
        {updating ? 'Updating...' : 'Update Status'}
      </button>
    </form>
  );
};

export default OrderStatusUpdateForm;