import React from 'react';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const DashboardStats: React.FC = () => {
  // Mock data for demonstration
  const stats = [
    {
      id: 1,
      title: 'Total Revenue',
      value: '$12,426.78',
      change: 12.5,
      increased: true,
      icon: <DollarSign size={24} className="text-green-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 2,
      title: 'Total Orders',
      value: '142',
      change: 8.2,
      increased: true,
      icon: <ShoppingBag size={24} className="text-pink-500" />,
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 3,
      title: 'New Customers',
      value: '38',
      change: 2.7,
      increased: true,
      icon: <Users size={24} className="text-purple-500" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 4,
      title: 'Cart Abandonment',
      value: '24%',
      change: 5.1,
      increased: false,
      icon: <ShoppingCart size={24} className="text-orange-500" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(stat => (
        <div 
          key={stat.id} 
          className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="font-medium text-gray-500">{stat.title}</div>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>{stat.icon}</div>
          </div>
          
          <div className="text-2xl font-bold mb-2">{stat.value}</div>
          
          <div className="flex items-center">
            {stat.increased ? (
              <>
                <ArrowUpRight size={16} className="text-green-600 mr-1" />
                <span className="text-green-600 text-sm font-medium">
                  {stat.change}% increase
                </span>
              </>
            ) : (
              <>
                <ArrowDownRight size={16} className="text-red-600 mr-1" />
                <span className="text-red-600 text-sm font-medium">
                  {stat.change}% decrease
                </span>
              </>
            )}
            <span className="text-gray-500 text-sm ml-1">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;