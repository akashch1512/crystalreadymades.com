import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';
import { Order } from '../../types';

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'processing':
      return 'bg-pink-50 text-pink-700 border-pink-200';
    case 'shipped':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'delivered':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'cancelled':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-surface-muted text-muted border-line';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const RecentOrders: React.FC = () => {
  const { orders } = useOrders();

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <p className="caption">Operations</p>
          <h3 className="mt-1 text-lg font-semibold text-text">Recent Orders</h3>
        </div>
        <Link to="/admin/orders" className="btn btn-secondary px-4 py-2">
          View All
          <ArrowUpRight size={16} className="ml-2" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line">
          <thead className="bg-surface-muted">
            <tr>
              {['Order ID', 'Customer', 'Date', 'Status', 'Total', 'Actions'].map(heading => (
                <th
                  key={heading}
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-surface">
            {recentOrders.map(order => (
              <tr key={order.id} className="transition-colors hover:bg-surface-muted/60">
                <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-text">
                  #{String(order.id).slice(-8)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">{order.userId}</td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
                  {formatDate(order.createdAt)}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <span className={`badge border ${getStatusColor(order.status)}`}>
                    {order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-text">
                  Rs. {order.total.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm">
                  <Link to={`/admin/orders/${order.id}`} className="font-medium text-brand hover:text-brand-strong">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted">
                  No recent orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
