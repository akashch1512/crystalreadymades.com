import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, MapPin, LogOut, Settings, Shield, ShoppingBag, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AccountSidebar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  // Generate initials for avatar fallback
  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const navItems = [
    { to: '/account', label: 'Profile', icon: User, end: true },
    { to: '/account/addresses', label: 'My Addresses', icon: MapPin, end: false },
    { to: '/orders', label: 'My Orders', icon: ShoppingBag, end: false },
    { to: '/account/settings', label: 'Settings', icon: Settings, end: false },
  ];

  return (
    <div className="card overflow-hidden w-full">
      {/* ── Profile header ── */}
      <div className="relative p-6" style={{ background: 'var(--brand)' }}>
        {/* Decorative blob */}
        <div
          className="pointer-events-none absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'white', transform: 'translate(30%, -30%)' }}
          aria-hidden="true"
        />

        <div className="flex items-center gap-4 relative">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-lg font-bold">{initials}</span>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-white font-semibold text-base leading-tight truncate">{user.name}</h2>
            {user.email && (
              <p className="text-white/70 text-xs mt-0.5 truncate">{user.email}</p>
            )}
            {user.phone && (
              <p className="text-white/60 text-xs mt-0.5">{user.phone}</p>
            )}
          </div>
        </div>

        {/* Member badge */}
        {user.isEmailVerified && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
            Verified Account
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="p-3">
        <ul className="space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand/10 text-brand'
                      : 'text-muted hover:bg-surface-muted hover:text-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} className={isActive ? 'text-brand' : 'text-muted'} />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}

          {isAdmin && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand/10 text-brand'
                      : 'text-muted hover:bg-surface-muted hover:text-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Shield size={17} className={isActive ? 'text-brand' : 'text-muted'} />
                    Admin Dashboard
                  </>
                )}
              </NavLink>
            </li>
          )}

          <li className="pt-3 mt-2 border-t border-line">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={17} />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AccountSidebar;
