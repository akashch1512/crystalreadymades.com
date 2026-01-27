import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, MapPin, LogOut, Settings, Shield, Phone } from 'lucide-react';
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
        <div className="flex items-center gap-3">
          {/* Profile Photo */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center border-2 border-white/30">
              <User size={24} className="text-white" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-pink-100 mt-0.5 flex items-center text-sm">
              <Phone size={14} className="mr-1" />
              {user.phone || 'No phone added'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/account"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${isActive
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
              to="/account/addresses"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${isActive
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
              to="/account/settings"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md ${isActive
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
                  `flex items-center px-4 py-2 rounded-md ${isActive
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