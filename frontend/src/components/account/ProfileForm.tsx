import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, CheckCircle, Edit2, Save, X } from 'lucide-react';
import axios from 'axios';

const ProfileForm: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      await axios.put(
        `${apiUrl}/api/user/update`,
        { name: formData.name, email: formData.email, phone: formData.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshUser();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.response?.data?.detail || 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage(null);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  };

  // Generate initials
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <div className="space-y-6">
      {/* ── Profile header card ── */}
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-brand/10 border-2 border-brand/20 flex items-center justify-center shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-brand text-2xl font-bold">{initials}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="h2 mb-1">{user?.name}</h1>
            <div className="flex flex-wrap gap-3 mt-2">
              {user?.email && (
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <Mail size={14} className="text-brand" />
                  {user.email}
                </span>
              )}
              {user?.phone && (
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <Phone size={14} className="text-brand" />
                  {user.phone}
                </span>
              )}
            </div>
            {user?.isEmailVerified && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                <CheckCircle size={12} />
                Email Verified
              </div>
            )}
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary text-brand border-brand hover:bg-brand/5 self-start sm:self-center shrink-0"
            >
              <Edit2 size={15} className="mr-1.5" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ── Profile form card ── */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="caption text-brand font-semibold mb-1">Personal Details</p>
            <h2 className="h3">Profile Information</h2>
          </div>
        </div>

        {message && (
          <div className={`alert mb-6 ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="label mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-muted" />
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input ${!isEditing ? 'opacity-70 cursor-default' : ''}`}
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="label mb-1.5 flex items-center gap-1.5">
              <Mail size={14} className="text-muted" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input ${!isEditing ? 'opacity-70 cursor-default' : ''}`}
              placeholder="your@email.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="label mb-1.5 flex items-center gap-1.5">
              <Phone size={14} className="text-muted" />
              Phone Number
              <span className="text-xs text-muted font-normal">(used to login)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input ${!isEditing ? 'opacity-70 cursor-default' : ''}`}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          {isEditing && (
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save size={15} className="mr-1.5" />
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                <X size={15} className="mr-1.5" />
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
