import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';

const RegisterPage: React.FC = () => {
  const { register, isAuthenticated, refreshUser } = useAuth();
  const { success, error: toastError, info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // OTP Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  
  // Get the redirect parameter from URL
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get('redirect') || '/';
  
  useEffect(() => {
    document.title = 'Register | CrystalReadymade';
    
    // Redirect if already authenticated BUT not in the middle of verifying OTP
    if (isAuthenticated && !isVerifying) {
      navigate(redirectTo === 'checkout' ? '/checkout' : redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo, isVerifying]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isVerifying && name === 'otp') {
      setOtp(value);
      if (otpError) setOtpError('');
      return;
    }

    setFormData({ ...formData, [name]: value });
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (registerError) {
      setRegisterError('');
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setRegisterError('');
    
    try {
      // register() from AuthContext sets the user and token in localStorage.
      const success = await register(formData.name, formData.phone, formData.password, formData.email);
      
      if (success) {
        // Stop redirect and switch to OTP verification view
        setIsVerifying(true);
      } else {
        setRegisterError('Phone number or email already exists');
      }
    } catch (error) {
      setRegisterError('An error occurred during registration');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setOtpError('Please enter the OTP sent to your email');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.post(`${apiUrl}/api/auth/verify-email`, { otp });
      // Reload user data to get updated is_email_verified flag
      await refreshUser();
      success('Email verified! Welcome to CrystalReadymade');
      navigate(redirectTo === 'checkout' ? '/checkout' : redirectTo);
    } catch (error: any) {
      setOtpError(error.response?.data?.detail || 'Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.post(`${apiUrl}/api/auth/resend-otp`, { email: formData.email });
      info('A new OTP has been sent to your email');
    } catch (error: any) {
      toastError(error.response?.data?.detail || 'Failed to resend OTP. Please try again later.');
    }
  };
  
  return (
    <div className="page border-t border-line">
      <div className="section min-h-[70vh] flex items-center justify-center">
        <div className="container mx-auto">
          <div className="max-w-md w-full mx-auto card p-8 sm:p-10 shadow-lg border border-line">
            
            {/* --- OTP VERIFICATION PHASE --- */}
            {isVerifying ? (
              <div>
                <div className="text-center mb-6">
                  <h1 className="h2 mb-2">Verify your email</h1>
                  <p className="text-muted text-sm px-2">
                    We just sent a One-Time Password (OTP) to <br/>
                    <strong className="text-text">{formData.email}</strong>. 
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label htmlFor="otp" className="label text-center block mb-2">
                      Enter OTP Code
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={handleChange}
                      className={`input text-center text-xl tracking-widest ${otpError ? 'border-red-500' : ''}`}
                      placeholder="• • • • • •"
                      autoComplete="off"
                    />
                    {otpError && <p className="mt-2 text-sm text-red-600 text-center">{otpError}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading || otp.length < 4}
                    className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {otpLoading ? 'Verifying...' : 'Validate and Continue'}
                  </button>
                  
                  <div className="text-center pt-2">
                    <p className="text-sm text-muted">
                      Didn't receive the email?{' '}
                      <button 
                        type="button" 
                        onClick={handleResendOtp}
                        className="text-brand hover:text-brand-strong font-medium underline-offset-2 hover:underline"
                      >
                        Resend OTP
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
            
            /* --- REGISTRATION PHASE --- */
            <div>
              <div className="text-center mb-6">
                <h1 className="h2 mb-2">Create an Account</h1>
                <p className="text-muted mb-4">Join CrystalReadymade to start shopping</p>
              </div>
              
              {registerError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                  {registerError}
                </div>
              )}
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="label mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="E.g. Akash Chaudhari"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="label mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="label mb-1">
                    Email Address <span className="text-brand">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="Verify for order updates"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="password" className="label mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="Minimum 6 characters"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="label mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="Re-enter password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed text-base font-medium"
                  >
                    {isSubmitting ? 'Verifying details...' : 'Create Account'}
                  </button>
                </div>
                
                <div className="text-center mt-6 pt-6 border-t border-line">
                  <p className="text-sm text-muted">
                    Already have an account?{' '}
                    <Link
                      to={`/login${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`}
                      className="text-brand hover:text-brand-strong font-medium underline-offset-2 hover:underline"
                    >
                      Sign in directly
                    </Link>
                  </p>
                </div>
              </form>
            </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
