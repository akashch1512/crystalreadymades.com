import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AddressFormProps {
  address?: {
    id: string;
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  };
  onSubmit: (updatedUser: any) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onSubmit }) => {
  const navigate = useNavigate();
  const { setUser, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: address?.name || '',
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'United States',
    isDefault: address?.isDefault || false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value, type } = target;
  
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (target as HTMLInputElement).checked : value
    }));
  
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Address name is required';
    if (!formData.line1.trim()) newErrors.line1 = 'Address line 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Token from localStorage:', token ? 'exists' : 'missing');
      console.log('Full token:', token);
      
      if (!token) {
        throw new Error('You must be logged in to save addresses. Please login and try again.');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

      const endpoint = address ? `/api/addresses/${address.id}` : '/api/addresses';
      console.log('Sending request to:', `${apiUrl}${endpoint}`);
      console.log('Auth header:', `Bearer ${token}`);
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: address ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save address');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      await refreshUser();
      onSubmit(updatedUser);

      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect');
      navigate(redirectTo === 'checkout' ? '/checkout' : '/account/addresses');
    } catch (error: any) {
      console.error('Error saving address:', error);
      alert(error.message || 'Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Address Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-pink-500 focus:border-pink-500`}
          placeholder="Home, Work, etc."
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Line 1 */}
      <div>
        <label htmlFor="line1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
        <input
          type="text"
          id="line1"
          name="line1"
          value={formData.line1}
          onChange={handleChange}
          className={`w-full p-2 border ${errors.line1 ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-pink-500 focus:border-pink-500`}
          placeholder="Street address, P.O. box, etc."
        />
        {errors.line1 && <p className="mt-1 text-sm text-red-600">{errors.line1}</p>}
      </div>

      {/* Line 2 */}
      <div>
        <label htmlFor="line2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
        <input
          type="text"
          id="line2"
          name="line2"
          value={formData.line2}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
      </div>

      {/* City & State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-pink-500 focus:border-pink-500`}
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-pink-500 focus:border-pink-500`}
          />
          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
        </div>
      </div>

      {/* Postal & Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-pink-500 focus:border-pink-500`}
          />
          {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">Select a country</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="India">India</option>
            {/* Add more countries as needed */}
          </select>
        </div>
      </div>

      {/* Default checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
          Make this my default address
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/account/addresses')}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-300"
        >
          {loading ? 'Saving...' : address ? 'Update Address' : 'Add Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
