import React, { useMemo } from 'react';
import {
  ShoppingBag,
  Users,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';
import { useProducts } from '../../contexts/ProductContext';

const DashboardStats: React.FC = () => {
  const { orders } = useOrders();
  const { products } = useProducts();

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map(o => o.userId)).size;

    return [
      {
        id: 1,
        title: 'Total Revenue',
        value: `Rs. ${totalRevenue.toFixed(2)}`,
        change: 12.5,
        increased: true,
        icon: <DollarSign size={24} className="text-green-500" />,
        bgColor: 'bg-green-50',
      },
      {
        id: 2,
        title: 'Total Orders',
        value: totalOrders.toString(),
        change: 8.2,
        increased: true,
        icon: <ShoppingBag size={24} className="text-brand" />,
        bgColor: 'bg-pink-50',
      },
      {
        id: 3,
        title: 'Total Customers',
        value: uniqueCustomers.toString(),
        change: 2.7,
        increased: true,
        icon: <Users size={24} className="text-purple-500" />,
        bgColor: 'bg-purple-50',
      },
      {
        id: 4,
        title: 'Total Products',
        value: products.length.toString(),
        change: 5.1,
        increased: true,
        icon: <ShoppingCart size={24} className="text-orange-500" />,
        bgColor: 'bg-orange-50',
      },
    ];
  }, [orders, products]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map(stat => (
        <div key={stat.id} className="card card-hover p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-medium text-muted">{stat.title}</div>
            <div className={`rounded-full p-2.5 ${stat.bgColor}`}>{stat.icon}</div>
          </div>

          <div className="mb-2 text-2xl font-semibold tracking-tight text-text">{stat.value}</div>

          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
            {stat.increased ? (
              <>
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="font-medium text-green-600">{stat.change}% increase</span>
              </>
            ) : (
              <>
                <ArrowDownRight size={16} className="text-red-600" />
                <span className="font-medium text-red-600">{stat.change}% decrease</span>
              </>
            )}
            <span className="text-muted">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
