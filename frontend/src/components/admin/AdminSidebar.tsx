import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Ticket,
  BarChart 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-full md:w-64 bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg">
      {/* Admin Header */}
      <div className="p-6 bg-gray-900">
        <h2 className="text-xl font-bold tracking-wide">Admin Panel</h2>
        <p className="text-gray-400 text-sm mt-1">Crystaleadymade</p>
      </div>
      
      {/* Navigation Links */}
      <nav className="p-4">
        <div className="mb-2 text-xs uppercase tracking-wider text-gray-500 font-semibold pl-4">
          Main
        </div>
        <ul className="space-y-1 mb-6">
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-600 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <LayoutDashboard size={18} className="mr-3" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-600 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <BarChart size={18} className="mr-3" />
              Analytics
            </NavLink>
          </li>
        </ul>
        
        <div className="mb-2 text-xs uppercase tracking-wider text-gray-500 font-semibold pl-4">
          Management
        </div>
        <ul className="space-y-1 mb-6">
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-600 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <Package size={18} className="mr-3" />
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-600 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <ShoppingBag size={18} className="mr-3" />
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/customers"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-600 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <Users size={18} className="mr-3" />
              Customers
            </NavLink>
          </li>
        </ul>
        
        <div className="mb-2 text-xs uppercase tracking-wider text-gray-500 font-semibold pl-4">
          Customer Support
        </div>
        <ul className="space-y-1 mb-6">
          <li>
            <NavLink
              to="/admin/support-tickets"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-600 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <Ticket size={18} className="mr-3" />
              Support Tickets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-600 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <MessageSquare size={18} className="mr-3" />
              Reviews
            </NavLink>
          </li>
        </ul>
        
        <div className="mb-2 text-xs uppercase tracking-wider text-gray-500 font-semibold pl-4">
          Settings
        </div>
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-600 text-white font-medium'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <Settings size={18} className="mr-3" />
              Store Settings
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;