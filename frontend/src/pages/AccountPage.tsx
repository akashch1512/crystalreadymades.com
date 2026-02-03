import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AccountSidebar from '../components/account/AccountSidebar';
import ProfileForm from '../components/account/ProfileForm';
import AddressForm from '../components/account/AddressForm';
import { useAuth } from '../contexts/AuthContext';
import {  toast } from 'react-toastify'

const AddressList: React.FC = () => {
  const { user, refreshUser } = useAuth();
  
  const addresses = user?.addresses || [];
  
  //  function to update addresses
  const handleSetDefault = async (addressId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await fetch(`${apiUrl}/api/addresses/${addressId}/set-default`, { method: 'PATCH' });
      await refreshUser();
      toast.success('Default address updated'); // if using a toast library
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };
  
  //  function to delete an address
  const handleDelete = async (addressId: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await fetch(`${apiUrl}/api/addresses/${addressId}`, { method: 'DELETE' });
      await refreshUser();
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="h3">My Addresses</h2>
        <a
          href="/account/addresses/new"
          className="text-brand hover:text-brand-strong text-sm font-medium"
        >
          + Add New Address
        </a>
      </div>
      
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(address => (
            <div
              key={address.id}
              className={`card p-4 ${
                address.isDefault ? 'border-brand/40 bg-brand/10' : ''
              }`}
            >
              {address.isDefault && (
                <div className="mb-2 inline-block px-2 py-1 bg-brand/10 text-brand-strong text-xs font-medium rounded-full">
                  Default Address
                </div>
              )} 
              
              <h3 className="font-medium">{address.name}</h3>
              <address className="not-italic text-muted my-2">
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
              </address>
              
              <div className="flex mt-4 space-x-4">
                <a
                  href={`/account/addresses/edit/${address.id}`}
                  className="text-brand hover:text-brand-strong text-sm"
                >
                  Edit
                </a>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-brand hover:text-brand-strong text-sm"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-surface-muted rounded-2xl border border-line">
          <p className="text-muted">You don't have any saved addresses.</p>
          <a
            href="/account/addresses/new"
            className="mt-4 inline-block text-brand hover:text-brand-strong font-medium"
          >
            + Add a new address
          </a>
        </div>
      )}
    </div>
  );
};

const AccountSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-text">Account Settings</h2>
      
      <div className="card p-6">
        <h3 className="h3 mb-4">Password</h3>
        <form className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="label mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="label mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="label mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Update Password
          </button>
        </form>
      </div>
      
      <div className="card p-6">
        <h3 className="h3 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="emailNotifications"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
            />
            <label htmlFor="emailNotifications" className="ml-2 block text-sm text-muted">
              Email notifications for orders and updates
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="smsNotifications"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
            />
            <label htmlFor="smsNotifications" className="ml-2 block text-sm text-muted">
              SMS notifications for orders and updates
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="marketingEmails"
              type="checkbox"
              className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
            />
            <label htmlFor="marketingEmails" className="ml-2 block text-sm text-muted">
              Marketing emails about promotions and new products
            </label>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary mt-4"
        >
          Save Preferences
        </button>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
        <p className="text-muted mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          type="button"
          className="btn btn-secondary border-red-500 text-red-600 hover:bg-red-50"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

const AccountPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  React.useEffect(() => {
    document.title = 'My Account | CrystalReadymade';
  }, []);
  
  // Mock function to handle address form submission
  const handleAddressSubmit = (address: any) => {
    console.log('Submitting address:', address);
    // In a real app, this would make an API call to save the address
  };
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page">
      <div className="section">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <AccountSidebar />
            </div>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              <Routes>
                <Route path="/" element={<ProfileForm />} />
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

