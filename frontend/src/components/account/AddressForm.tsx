import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Navigation } from 'lucide-react';

interface AddressFormProps {
  address?: {
    id: string;
    name: string;
    email?: string;
    contact_no?: string;
    alt_contact_no?: string;
    line1: string;
    line2?: string;
    locality?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    address_type?: string;
    isDefault: boolean;
  };
  onSubmit: (updatedUser: any) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address: addressProp, onSubmit }) => {
  const navigate = useNavigate();
  const { user, setUser, refreshUser } = useAuth();
  const { addressId } = useParams<{ addressId: string }>();

  // If no address prop is passed but we have an addressId from the URL, find it from user data
  const address = addressProp || (addressId
    ? user?.addresses?.find((a: any) => String(a.id) === String(addressId))
    : undefined);

  const [formData, setFormData] = useState({
    name: address?.name || '',
    email: address?.email || '',
    contact_no: address?.contactNo || address?.contact_no || '',
    alt_contact_no: address?.altContactNo || address?.alt_contact_no || '',
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    locality: address?.locality || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || (address as any)?.postal_code || '',
    country: address?.country || 'India',
    address_type: address?.addressType || address?.address_type || 'Home',
    isDefault: address?.isDefault || false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    // @ts-ignore
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Pincode is required';
    if (!formData.line1.trim()) newErrors.line1 = 'House no. is required';
    if (!formData.city.trim()) newErrors.city = 'City/District is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
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
      
      if (!token) {
        throw new Error('You must be logged in to save addresses. Please login and try again.');
      }

      const apiUrl = import.meta.env.VITE_API_URL;

      const endpoint = address ? `/api/addresses/${address.id}` : '/api/addresses';
      
      const payload = {
        name: user?.name || formData.name,
        email: user?.email || formData.email,
        contact_no: user?.phone || formData.contact_no,
        alt_contact_no: formData.alt_contact_no,
        line1: formData.line1,
        line2: formData.line2,
        locality: formData.locality,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country,
        address_type: formData.address_type,
        is_default: formData.isDefault
      };
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: address ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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

  const [locationLoading, setLocationLoading] = useState(false);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding using Nominatim (OpenStreetMap) - free, no API key needed
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          
          if (data && data.address) {
            setFormData(prev => ({
              ...prev,
              postalCode: data.address.postcode || prev.postalCode,
              city: data.address.city || data.address.town || data.address.state_district || prev.city,
              state: data.address.state || prev.state,
              locality: data.address.suburb || data.address.neighborhood || data.address.county || prev.locality,
              line2: data.address.road || data.display_name || prev.line2
            }));
            
            // Clear any validation errors for fields we just auto-filled
            setErrors(prev => ({
              ...prev,
              ...(data.address.postcode && { postalCode: undefined }),
              ...((data.address.city || data.address.town || data.address.state_district) && { city: undefined }),
              ...(data.address.state && { state: undefined }),
            }) as Record<string, string>);
          } else {
             alert("Could not find address details for your location.");
          }
        } catch (error) {
          console.error("Error fetching location data", error);
          alert("Failed to fetch address details. Please enter manually.");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Check your browser location permissions.");
        setLocationLoading(false);
      },
      { timeout: 10000 }
    );
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Personal Info Section */}
      <h3 className="h3 mb-2 pb-2 border-b border-line text-lg">Personal Details</h3>
      
      <div className="p-4 bg-surface rounded-xl border border-line mb-4">
        <p className="text-sm text-muted mb-3">
          Using details from your profile
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted uppercase tracking-wider font-semibold block mb-1">Name</label>
            <p className="font-medium text-text">{user?.name || formData.name}</p>
          </div>
          <div>
            <label className="text-xs text-muted uppercase tracking-wider font-semibold block mb-1">Email ID</label>
            <p className="font-medium text-text">{user?.email || formData.email || '—'}</p>
          </div>
          <div>
            <label className="text-xs text-muted uppercase tracking-wider font-semibold block mb-1">Contact No.</label>
            <p className="font-medium text-text">{user?.phone || formData.contact_no}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="alt_contact_no" className="label mb-1">Alt. contact no.</label>
          <input
            type="text"
            id="alt_contact_no"
            name="alt_contact_no"
            value={formData.alt_contact_no}
            onChange={handleChange}
            className="input"
            placeholder="Optional secondary number"
          />
        </div>
      </div>

      {/* Address Section */}
      <h3 className="h3 mt-8 mb-2 pb-2 border-b border-line text-lg">Address</h3>
      
      <div className="mb-4">
        <button 
          type="button" 
          onClick={handleCurrentLocation}
          disabled={locationLoading}
          className="btn bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 flex items-center justify-center gap-2 py-2 transition-all disabled:opacity-70 disabled:cursor-wait w-full sm:w-auto px-6"
        >
          <Navigation size={18} className={locationLoading ? "animate-pulse" : ""} /> 
          {locationLoading ? "Locating..." : "Use my current location"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="postalCode" className="label mb-1">Pincode</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={`input ${errors.postalCode ? 'border-red-500' : ''}`}
          />
          {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="line1" className="label mb-1">House no. <span className="text-muted font-normal text-xs">(to allow doorstep delivery)</span></label>
        <input
          type="text"
          id="line1"
          name="line1"
          value={formData.line1}
          onChange={handleChange}
          className={`input ${errors.line1 ? 'border-red-500' : ''}`}
        />
        {errors.line1 && <p className="mt-1 text-sm text-red-600">{errors.line1}</p>}
      </div>

      <div>
        <label htmlFor="line2" className="label mb-1">Address <span className="text-muted font-normal text-xs">(Building, locality, street details)</span></label>
        <input
          type="text"
          id="line2"
          name="line2"
          value={formData.line2}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="locality" className="label mb-1">Locality/Town</label>
        <input
          type="text"
          id="locality"
          name="locality"
          value={formData.locality}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="label mb-1">City/District</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`input ${errors.city ? 'border-red-500' : ''}`}
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="state" className="label mb-1">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`input ${errors.state ? 'border-red-500' : ''}`}
          />
          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
        </div>
      </div>

      <div>
        <label className="label mb-2">Address type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer border border-line rounded p-3 flex-1 hover:bg-surface-muted transition-colors">
            <input 
              type="radio" 
              name="address_type" 
              value="Home" 
              checked={formData.address_type === 'Home'}
              onChange={handleChange}
              className="text-brand focus:ring-brand" 
            />
            <span className="font-medium text-sm">Home</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer border border-line rounded p-3 flex-1 hover:bg-surface-muted transition-colors">
            <input 
              type="radio" 
              name="address_type" 
              value="Office" 
              checked={formData.address_type === 'Office'}
              onChange={handleChange}
              className="text-brand focus:ring-brand" 
            />
            <span className="font-medium text-sm">Office</span>
          </label>
        </div>
      </div>

      {/* Default checkbox */}
      <div className="flex items-center py-2">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm font-medium text-text">
          Mark this as default address
        </label>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-line">
        <button
          type="button"
          onClick={() => navigate(new URLSearchParams(window.location.search).get('redirect') === 'checkout' ? '/checkout' : '/account/addresses')}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : address ? 'Update Address' : 'Save Address for Order'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
