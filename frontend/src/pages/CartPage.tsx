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
    <div className="page">
      <div className="section px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
      <h1 className="h1 mb-6">Shopping Cart</h1>
      
      {items.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {/* Cart Headers - Desktop */}
            <div className="hidden sm:flex py-4 border-b border-line text-sm font-medium text-muted">
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
                className="flex items-center text-brand hover:text-brand-strong"
              >
                <ArrowLeft size={16} className="mr-1" />
                Continue Shopping
              </Link>
              
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700"
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
        <div className="text-center py-16 bg-surface-muted rounded-2xl border border-line">
          <div className="flex justify-center mb-4">
            <Package size={48} className="text-muted" />
          </div>
          <h2 className="h3 mb-2">Your cart is empty</h2>
          <p className="text-muted mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link
            to="/products"
            className="btn btn-primary"
          >
            Start Shopping
          </Link>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
