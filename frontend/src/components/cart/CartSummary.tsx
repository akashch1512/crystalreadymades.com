import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const CartSummary: React.FC = () => {
  const { subtotal, tax, shipping, discount, total, applyDiscount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');
  
  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }
    
    const success = applyDiscount(discountCode);
    if (success) {
      setDiscountSuccess(`Discount code "${discountCode}" applied successfully!`);
      setDiscountError('');
      setDiscountCode('');
    } else {
      setDiscountError('Invalid discount code');
      setDiscountSuccess('');
    }
  };
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  return (
    <div className="card p-6 sticky top-24">
      <h2 className="text-lg font-medium text-text mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="divider pt-3 mt-3 flex justify-between font-medium text-text">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Discount Code Form */}
      <form onSubmit={handleApplyDiscount} className="mb-6">
        <label htmlFor="discount-code" className="label mb-2">
          Discount Code
        </label>
        <div className="flex">
          <input
            type="text"
            id="discount-code"
            name="discount-code"
            className="input rounded-l-xl rounded-r-none"
            placeholder="Enter code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-secondary rounded-l-none rounded-r-xl px-4 py-2"
          >
            Apply
          </button>
        </div>
        {discountError && (
          <p className="mt-1 text-red-600 text-sm">{discountError}</p>
        )}
        {discountSuccess && (
          <p className="mt-1 text-green-600 text-sm">{discountSuccess}</p>
        )}
      </form>
      
      <button
        onClick={handleCheckout}
        className="btn btn-primary w-full"
      >
        Proceed to Checkout
      </button>
      
      <div className="mt-4 text-center text-sm text-muted">
        <p>Secure checkout powered by Razorpay</p>
      </div>
    </div>
  );
};

export default CartSummary;
