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
    <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
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
          <span>
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t pt-3 mt-3 flex justify-between font-medium text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Discount Code Form */}
      <form onSubmit={handleApplyDiscount} className="mb-6">
        <label htmlFor="discount-code" className="block text-sm font-medium text-gray-700 mb-2">
          Discount Code
        </label>
        <div className="flex">
          <input
            type="text"
            id="discount-code"
            name="discount-code"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            placeholder="Enter code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-300 transition-colors"
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
        className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition-colors font-medium"
      >
        Proceed to Checkout
      </button>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Secure checkout powered by Razorpay</p>
      </div>
    </div>
  );
};

export default CartSummary;