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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors xl:gap-3 xl:px-4 ${
      isActive
        ? 'bg-brand text-white shadow-soft'
        : 'text-text hover:bg-surface-muted hover:text-brand'
    }`;

  return (
    <aside className="card w-full overflow-hidden md:sticky md:top-24">
      <div className="border-b border-line bg-surface-muted px-4 py-5 xl:px-5">
        <p className="caption">CrystalReadymade</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-text">Admin Panel</h2>
      </div>
      
      <nav className="max-h-[calc(100vh-8rem)] overflow-y-auto p-3">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted">
          Main
        </div>
        <ul className="mb-6 space-y-1">
          <li>
            <NavLink
              to="/admin"
              end
              className={navLinkClass}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/analytics"
              className={navLinkClass}
            >
              <BarChart size={18} />
              Analytics
            </NavLink>
          </li>
        </ul>
        
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted">
          Management
        </div>
        <ul className="mb-6 space-y-1">
          <li>
            <NavLink
              to="/admin/products"
              className={navLinkClass}
            >
              <Package size={18} />
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={navLinkClass}
            >
              <ShoppingBag size={18} />
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/returns"
              className={navLinkClass}
            >
              <Package size={18} />
              Return Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/customers"
              className={navLinkClass}
            >
              <Users size={18} />
              Customers
            </NavLink>
          </li>
        </ul>
        
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted">
          Customer Support
        </div>
        <ul className="mb-6 space-y-1">
          <li>
            <NavLink
              to="/admin/support-tickets"
              className={navLinkClass}
            >
              <Ticket size={18} />
              Support Tickets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reviews"
              className={navLinkClass}
            >
              <MessageSquare size={18} />
              Reviews
            </NavLink>
          </li>
        </ul>
        
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted">
          Settings
        </div>
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/admin/settings"
              className={navLinkClass}
            >
              <Settings size={18} />
              Store Settings
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-text"
            >
              <LogOut size={18} />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
