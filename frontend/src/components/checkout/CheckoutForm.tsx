import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrderContext';
import { createRazorpayOrder, verifyPayment } from '../../services/razorpay';
import { loadRazorpayScript } from '../../utils/loadRazorpay';

interface CheckoutFormProps {
  onSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.addresses?.length) {
      return;
    }

    const defaultAddress = user.addresses.find((addr) => addr.isDefault);
    const fallbackAddress = user.addresses[0];

    if (!selectedAddress || !user.addresses.some((address) => String(address.id) === String(selectedAddress))) {
      setSelectedAddress(String(defaultAddress?.id || fallbackAddress.id));
    }
  }, [selectedAddress, user?.addresses]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(e.target.value);
  };

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

    const invalidItem = items.find(
      item => typeof item.availableQuantity === 'number' && item.quantity > item.availableQuantity
    );

    if (invalidItem) {
      setError(`${invalidItem.name} has only ${invalidItem.availableQuantity} available. Please update your cart.`);
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (paymentMethod === 'cod') {
        const { success, orderId } = await createOrder('cod', selectedAddress, {
          paymentStatus: 'pending',
        });

        if (success && orderId) {
          clearCart();
          onSuccess(orderId);
        } else {
          setError('Failed to create order. Please try again.');
        }

        return;
      }

      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded || !(window as any).Razorpay) {
        setError('Failed to load Razorpay. Please try again later.');
        return;
      }

      const razorpayValue = Math.round(total * 100);
      const razorpayOrderId = await createRazorpayOrder(razorpayValue);

      const prefill: any = {};
      if (user?.name) prefill.name = user.name;
      if (user?.email) prefill.email = user.email;
      if (user?.phone) {
        let contact = String(user.phone).replace(/\D/g, '');
        if (contact.length > 10 && contact.endsWith(contact.slice(-10))) {
          contact = contact.slice(-10);
        }
        if (contact.length === 10) {
          prefill.contact = contact;
        }
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay key is not configured.');
      }

      const options = {
        key: razorpayKey,
        amount: razorpayValue,
        currency: 'INR',
        name: 'CrystalReadymade',
        description: 'Payment for your order',
        order_id: razorpayOrderId,
        prefill,
        notes: {
          address_id: selectedAddress,
        },
        theme: {
          color: '#ec4899',
        },
        handler: async (response: any) => {
          const verified = await verifyPayment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );

          if (!verified) {
            setError('Payment verification failed. Please contact support.');
            return;
          }

          const { success, orderId } = await createOrder('online', selectedAddress, {
            paymentStatus: 'paid',
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (success && orderId) {
            clearCart();
            onSuccess(orderId);
          } else {
            setError('Failed to create order. Please try again.');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="alert alert-error">{error}</div>}

      <div>
        <h3 className="h3 mb-4">Shipping Address</h3>

        {user?.addresses && user.addresses.length > 0 ? (
          <div>
            <select
              id="address"
              name="address"
              value={selectedAddress}
              onChange={handleAddressChange}
              className="select"
            >
              <option value="">Select an address</option>
              {user.addresses.map((address: any) => (
                <option key={address.id} value={String(address.id)}>
                  {address.address_type || 'Address'} ({address.name}): {address.line1}, {address.city},{' '}
                  {address.state} {address.postalCode}
                </option>
              ))}
            </select>

            <div className="mt-2">
              <button
                type="button"
                onClick={() => navigate('/account/addresses/new?redirect=checkout')}
                className="text-brand hover:text-brand-strong text-sm font-medium"
              >
                + Add a new address
              </button>
            </div>
          </div>
        ) : (
          <div className="alert border-yellow-200 bg-yellow-50 text-yellow-700 mb-4">
            <p>You don't have any saved addresses.</p>
            <button
              type="button"
              onClick={() => navigate('/account/addresses/new?redirect=checkout')}
              className="mt-2 text-brand hover:text-brand-strong font-medium"
            >
              + Add a new address
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="h3 mb-4">Payment Method</h3>

        <div className="space-y-4">
          <label className="flex items-center p-4 border border-line rounded-2xl cursor-pointer hover:bg-surface-muted">
            <input
              type="radio"
              name="payment-method"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={handlePaymentMethodChange}
              className="h-4 w-4 text-brand focus:ring-brand"
            />
            <div className="ml-3">
              <span className="block text-sm font-medium text-text">Online Payment</span>
              <span className="block text-sm text-muted">
                Pay securely with Razorpay using card, UPI, wallet, or net banking
              </span>
            </div>
          </label>

          <label className="flex items-center p-4 border border-line rounded-2xl cursor-pointer hover:bg-surface-muted">
            <input
              type="radio"
              name="payment-method"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={handlePaymentMethodChange}
              className="h-4 w-4 text-brand focus:ring-brand"
            />
            <div className="ml-3">
              <span className="block text-sm font-medium text-text">Cash on Delivery</span>
              <span className="block text-sm text-muted">Pay when you receive your order</span>
            </div>
          </label>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading || !selectedAddress || items.length === 0}
          className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : `Pay Rs. ${total.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
