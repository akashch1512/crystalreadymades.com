import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import AccountSidebar from '../components/account/AccountSidebar';
import ProfileForm from '../components/account/ProfileForm';
import AddressForm from '../components/account/AddressForm';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import { toast } from 'react-toastify';
import {
  MapPin, Plus, Star, Home, Briefcase, Trash2, CheckCircle,
  Edit2, ShoppingBag, Package, ChevronRight, Lock, Bell, AlertTriangle,
} from 'lucide-react';
import { Order } from '../types';

// ─────────────────────────────────────────
// AddressList
// ─────────────────────────────────────────
const AddressList: React.FC = () => {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, []);

  const addresses = user?.addresses || [];

  const handleSetDefault = async (addressId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/api/addresses/${addressId}/set-default`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshUser();
      toast.success('Default address updated');
    } catch {
      toast.error('Failed to update default address');
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      await fetch(`${apiUrl}/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshUser();
      toast.success('Address deleted');
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const typeIcon = (type?: string) => {
    if (type?.toLowerCase() === 'work') return <Briefcase size={14} className="text-brand" />;
    return <Home size={14} className="text-brand" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="caption text-brand font-semibold mb-1">Saved Locations</p>
          <h2 className="h3">My Addresses</h2>
        </div>
        <Link to="/account/addresses/new" className="btn btn-primary text-sm">
          <Plus size={15} className="mr-1.5" />
          Add Address
        </Link>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(address => (
            <div
              key={address.id}
              className={`card p-5 relative transition-shadow hover:shadow-soft ${
                address.isDefault ? 'border-brand/30 bg-brand/[0.03]' : ''
              }`}
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-semibold text-brand bg-brand/10 rounded-full px-2.5 py-1">
                  <CheckCircle size={11} />
                  Default
                </span>
              )}

              {/* Type badge */}
              <div className="flex items-center gap-1.5 text-xs text-muted mb-3">
                {typeIcon(address.addressType)}
                <span className="font-medium uppercase tracking-wide">{address.addressType || 'Home'}</span>
              </div>

              <h3 className="font-semibold text-text mb-1">{address.name}</h3>
              {address.contactNo && (
                <p className="text-sm text-muted mb-1">{address.contactNo}</p>
              )}
              <address className="not-italic text-sm text-muted leading-relaxed">
                {address.line1}{address.line2 ? `, ${address.line2}` : ''}
                {address.locality ? `, ${address.locality}` : ''}
                <br />
                {address.city}, {address.state} – {address.postalCode}
                <br />
                {address.country}
              </address>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-line">
                <Link
                  to={`/account/addresses/edit/${address.id}`}
                  className="flex items-center gap-1 text-sm text-brand hover:text-brand-strong font-medium"
                >
                  <Edit2 size={13} />
                  Edit
                </Link>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex items-center gap-1 text-sm text-muted hover:text-text"
                  >
                    <CheckCircle size={13} />
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 ml-auto"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
            <MapPin size={26} className="text-brand" />
          </div>
          <h3 className="h3 mb-2">No addresses saved</h3>
          <p className="text-muted mb-6">Add a delivery address to speed up checkout.</p>
          <Link to="/account/addresses/new" className="btn btn-primary">
            <Plus size={15} className="mr-1.5" />
            Add New Address
          </Link>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// RecentOrders — embedded inside account overview
// ─────────────────────────────────────────
const RecentOrders: React.FC = () => {
  const { getOrdersByUser } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userOrders = getOrdersByUser();
    setOrders(userOrders.slice(0, 3));
    setLoading(false);
  }, []);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-50 text-red-600',
  };

  if (loading) return <div className="card p-6 animate-pulse h-24 bg-surface-muted" />;

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-5 border-b border-line flex items-center justify-between">
        <div>
          <p className="caption text-brand font-semibold mb-0.5">Recent Activity</p>
          <h2 className="h3">My Orders</h2>
        </div>
        <Link to="/orders" className="flex items-center text-sm text-brand hover:text-brand-strong font-medium">
          View All <ChevronRight size={15} className="ml-0.5" />
        </Link>
      </div>

      {orders.length > 0 ? (
        <ul className="divide-y divide-line">
          {orders.map(order => (
            <li key={order.id} className="px-6 py-4 flex items-center gap-4 hover:bg-surface-muted/40 transition-colors">
              {/* Order image */}
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-line shrink-0 bg-surface-muted">
                {order.items[0]?.image ? (
                  <img src={order.items[0].image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={20} className="text-muted" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text truncate">
                  Order #{String(order.id).slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ₹{order.total.toFixed(0)}
                </p>
              </div>

              <span className={`badge text-xs font-medium shrink-0 ${statusColors[order.status] || 'bg-surface-muted text-muted'}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>

              <Link to={`/orders/${order.id}`} className="text-muted hover:text-brand shrink-0">
                <ChevronRight size={18} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-12 text-center">
          <ShoppingBag size={36} className="text-muted mx-auto mb-3" />
          <p className="text-muted text-sm">No orders yet.</p>
          <Link to="/products" className="mt-4 inline-block btn btn-primary text-sm">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// AccountSettings
// ─────────────────────────────────────────
const AccountSettings: React.FC = () => {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setSaving(true);
    // Placeholder: hook up to a change-password API when ready
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setPwdMsg({ type: 'success', text: 'Password updated successfully!' });
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="caption text-brand font-semibold mb-1">Preferences</p>
        <h2 className="h3">Account Settings</h2>
      </div>

      {/* Password */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center">
            <Lock size={17} className="text-brand" />
          </div>
          <h3 className="h3">Change Password</h3>
        </div>

        {pwdMsg && (
          <div className={`alert mb-5 ${pwdMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {pwdMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="label mb-1.5">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPwd}
              onChange={e => setCurrentPwd(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="label mb-1.5">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="label mb-1.5">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              className="input"
              required
            />
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center">
            <Bell size={17} className="text-brand" />
          </div>
          <h3 className="h3">Notification Preferences</h3>
        </div>

        <div className="space-y-4 max-w-md">
          {[
            { id: 'emailNotif', label: 'Order & shipping email updates', defaultChecked: true },
            { id: 'smsNotif', label: 'SMS notifications for orders', defaultChecked: true },
            { id: 'marketingEmails', label: 'Promotional emails & offers', defaultChecked: false },
          ].map(({ id, label, defaultChecked }) => (
            <label key={id} htmlFor={id} className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-text group-hover:text-text/80">{label}</span>
              <input
                id={id}
                type="checkbox"
                defaultChecked={defaultChecked}
                className="w-4 h-4 rounded border-line text-brand focus:ring-brand accent-brand"
              />
            </label>
          ))}
        </div>

        <button type="button" className="btn btn-primary mt-6">
          Save Preferences
        </button>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 sm:p-8 border-red-200 bg-red-50/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertTriangle size={17} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
        </div>
        <p className="text-sm text-muted mb-4">
          Permanently deleting your account removes all your data. This cannot be undone.
        </p>
        <button
          type="button"
          className="btn btn-secondary border-red-400 text-red-600 hover:bg-red-50"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// AccountPage — root
// ─────────────────────────────────────────
const AccountPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'My Account | CrystalReadymade';
  }, []);

  const handleAddressSubmit = (address: any) => {
    console.log('Submitting address:', address);
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page">
      <div className="section">
        <div className="container mx-auto">

          {/* Page title — mobile */}
          <h1 className="h2 mb-6 md:hidden">My Account</h1>

          <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* ── Sidebar ── */}
            <div className="w-full md:w-64 lg:w-72 shrink-0">
              <AccountSidebar />
            </div>

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0">
              <Routes>
                <Route
                  path="/"
                  element={
                    <div className="space-y-6">
                      <ProfileForm />
                      <RecentOrders />
                    </div>
                  }
                />
                <Route path="/addresses" element={<AddressList />} />
                <Route
                  path="/addresses/new"
                  element={<AddressForm onSubmit={handleAddressSubmit} />}
                />
                <Route
                  path="/addresses/edit/:addressId"
                  element={<AddressForm onSubmit={handleAddressSubmit} />}
                />
                <Route path="/settings" element={<AccountSettings />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
