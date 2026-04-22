import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  
  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };
  
  const handleRemove = () => {
    removeItem(item.id);
  };
  
  // Calculate the price (use sale price if available)
  const price = item.salePrice || item.price;
  const totalPrice = price * item.quantity;
  
  // Generate the product slug from the name
  const productSlug = item.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col sm:flex-row py-5 sm:py-6 border-b border-line gap-4 sm:gap-0">
      {/* Image and Product Info */}
      <div className="flex w-full sm:flex-grow sm:w-3/4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl border border-line">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
        
        <div className="ml-3 sm:ml-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <Link to={`/product/${productSlug}`} className="text-base sm:text-lg font-medium text-text hover:text-brand line-clamp-2 pr-2">
                {item.name}
              </Link>
              <button
                onClick={handleRemove}
                type="button"
                className="text-muted hover:text-red-500 sm:hidden flex-shrink-0 mt-1"
                aria-label="Remove item"
              >
                <X size={18} />
              </button>
            </div>
            {/* Using hidden on mobile for price row inside details instead we show it at bottom */}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-2 sm:mt-0 gap-2 sm:gap-0">
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="text-muted hover:text-text border border-line rounded-l-lg sm:rounded-l-xl p-1 sm:p-1.5"
                disabled={item.quantity <= 1}
              >
                <Minus size={14} className="sm:w-4 sm:h-4" />
              </button>
              <span className="w-8 sm:w-10 text-center border-y border-line py-1.5 text-sm sm:text-base">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="text-muted hover:text-text border border-line rounded-r-lg sm:rounded-r-xl p-1 sm:p-1.5"
              >
                <Plus size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
            
            <div className="flex items-baseline">
              <p className="text-base sm:text-lg font-medium text-text">
                ₹{totalPrice.toFixed(2)}
              </p>
              {item.salePrice && (
                <p className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-muted line-through">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Remove - Desktop */}
      <div className="hidden sm:flex items-center justify-center ml-4">
        <button
          onClick={handleRemove}
          type="button"
          className="text-muted hover:text-text"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
