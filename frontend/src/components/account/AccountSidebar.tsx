import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Heart, Bell, MapPin, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AccountSidebar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-md overflow-hidden">
      {/* User Info */}
      <div className="p-6 bg-pink-600 text-white">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-pink-100 mt-1">{user.email}</p>
      </div>
      
      {/* Navigation Links */}
      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/account"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-50 text-pink-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <User size={20} className="mr-3" />
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-50 text-pink-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <ShoppingBag size={20} className="mr-3" />
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-50 text-pink-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Heart size={20} className="mr-3" />
              Wishlist
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/account/addresses"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-50 text-pink-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <MapPin size={20} className="mr-3" />
              Addresses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-50 text-pink-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Bell size={20} className="mr-3" />
              Notifications
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/account/settings"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-pink-50 text-pink-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Settings size={20} className="mr-3" />
              Account Settings
            </NavLink>
          </li>
          
          {/* Admin Link */}
          {isAdmin && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md ${
                    isActive
                      ? 'bg-pink-50 text-pink-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <Shield size={20} className="mr-3" />
                Admin Dashboard
              </NavLink>
            </li>
          )}
          
          {/* Logout */}
          <li className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AccountSidebar;