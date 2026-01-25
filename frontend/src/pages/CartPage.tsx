import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { useCart } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const { items, clearCart } = useCart();
  
  React.useEffect(() => {
    document.title = 'Shopping Cart | CrystalReadymade';
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart</h1>
      
      {items.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {/* Cart Headers - Desktop */}
            <div className="hidden sm:flex py-4 border-b border-gray-200 text-sm font-medium text-gray-500">
              <div className="sm:w-3/4">Product</div>
              <div className="text-right sm:w-1/4">Total</div>
            </div>
            
            {/* Cart Items */}
            <div>
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            {/* Cart Actions */}
            <div className="mt-6 flex justify-between">
              <Link
                to="/products"
                className="flex items-center text-pink-600 hover:text-pink-800"
              >
                <ArrowLeft size={16} className="mr-1" />
                Continue Shopping
              </Link>
              
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800"
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <CartSummary />
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="flex justify-center mb-4">
            <Package size={48} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link
            to="/products"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;