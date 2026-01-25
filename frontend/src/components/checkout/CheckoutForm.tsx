  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useAuth } from '../../contexts/AuthContext';
  import { useCart } from '../../contexts/CartContext';
  import { useOrders } from '../../contexts/OrderContext';
  import { createRazorpayOrder } from '../../services/razorpay';
  import { loadRazorpayScript } from '../../utils/loadRazorpay';

  interface CheckoutFormProps {
    onSuccess: (orderId: string) => void;
  }

  const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
    const { user } = useAuth();
    const { items, subtotal, tax, shipping, discount, total, clearCart } = useCart();
    const { createOrder } = useOrders();
    const navigate = useNavigate();

    const [selectedAddress, setSelectedAddress] = useState('');

    
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Update the selected address if new address is added
    useEffect(() => {
      if (user?.addresses?.length) {
        const defaultAddress = user.addresses.find(addr => addr.isDefault);
        const fallback = user.addresses[0];
    
        // Update selectedAddress if:
        // - It's not set, OR
        // - The selected address no longer exists in the updated user.addresses
        if (!selectedAddress || !user.addresses.some(a => a.id === selectedAddress)) {
          setSelectedAddress(defaultAddress?.id || fallback.id);
        }
      }
    }, [user?.addresses]);  // this will re-run every time the address list updates
    
    
    const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedAddress(e.target.value);
      console.log('Selected address in handleAddressChange:', e.target.value);
    };
    
    // Check if addresses exist before rendering
    console.log('Rendering addresses:', user?.addresses); // Add this log
    
    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPaymentMethod(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedAddress) {
        setError('Please select a shipping address');
        return;
      }

      if (items.length === 0) {
        setError('Your cart is empty');
        return;
      }

      try {
        setLoading(true);
        setError('');

        if (paymentMethod !== 'cod') {
          const razorpayLoaded = await loadRazorpayScript();

          if (!razorpayLoaded || !(window as any).Razorpay) {
            setError('Failed to load Razorpay. Please try again later.');
            return;
          }

          const razorpayOrderId = await createRazorpayOrder(total * 100);

          const options = {
            key: 'rzp_live_bGTn7dpj6KD55L',
            amount: total * 100,
            currency: 'INR',
            name: 'CrystalReadymade',
            description: 'Payment for your order',
            order_id: razorpayOrderId,
            prefill: {
              name: user?.name || '',
              email: user?.email || '',
              contact: user?.phone || '',
            },
            notes: {
              address_id: selectedAddress,
            },
            theme: {
              color: '#3B82F6',
            },
            handler: async function (response: any) {
              const verified = await verifyPayment(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature
              );

              if (!verified) {
                setError('Payment verification failed. Please contact support.');
                return;
              }

              const { success, orderId } = await createOrder(paymentMethod);
              if (success && orderId) {
                clearCart();
                onSuccess(orderId);
              } else {
                setError('Failed to create order. Please try again.');
              }
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
                console.log('Payment popup closed');
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
      } catch (err) {
        console.error('Checkout error:', err);
        setError('An error occurred during checkout. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-pink-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Shipping Address */}
        <div>
    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>

    {user?.addresses && user.addresses.length > 0 ? (
      <div>
        <select
          id="address"
          name="address"
          value={selectedAddress}
          onChange={handleAddressChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="">Select an address</option>
          {user.addresses.map(address => (
            <option key={address.id} value={address.id}>
              {address.name}: {address.line1}, {address.city}, {address.state} {address.postalCode}
            </option>
          ))}
        </select>

        <div className="mt-2">
          <button
            type="button"
            onClick={() => navigate('/account/addresses/new?redirect=checkout')}
            className="text-pink-600 hover:text-pink-800 text-sm font-medium"
          >
            + Add a new address
          </button>
        </div>
      </div>
    ) : (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
        <p>You don't have any saved addresses.</p>
        <button
          type="button"
          onClick={() => navigate('/account/addresses/new?redirect=checkout')}
          className="mt-2 text-pink-600 hover:text-pink-800 font-medium"
        >
          + Add a new address
        </button>
      </div>
    )}
  </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>

          <div className="space-y-4">
            <label className="flex items-center p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment-method"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={handlePaymentMethodChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Credit/Debit Card</span>
                <span className="block text-sm text-gray-500">Pay securely with your card</span>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment-method"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={handlePaymentMethodChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">UPI</span>
                <span className="block text-sm text-gray-500">Pay using UPI ID or QR code</span>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment-method"
                value="wallet"
                checked={paymentMethod === 'wallet'}
                onChange={handlePaymentMethodChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Mobile Wallet</span>
                <span className="block text-sm text-gray-500">Pay using PhonePe, Paytm, etc.</span>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment-method"
                value="netbanking"
                checked={paymentMethod === 'netbanking'}
                onChange={handlePaymentMethodChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Net Banking</span>
                <span className="block text-sm text-gray-500">Pay through your bank account</span>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment-method"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={handlePaymentMethodChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Cash on Delivery</span>
                <span className="block text-sm text-gray-500">Pay when you receive your order</span>
              </div>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2 flex justify-between font-medium text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading || !selectedAddress || items.length === 0}
            className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 transition-colors font-medium disabled:bg-pink-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
        </div>
      </form>
    );
  };

  export default CheckoutForm;
