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
    <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200">
      {/* Image and Product Info */}
      <div className="flex flex-grow sm:w-3/4">
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
        
        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between">
              <Link to={`/product/${productSlug}`} className="text-lg font-medium text-gray-900 hover:text-pink-600">
                {item.name}
              </Link>
              <button
                onClick={handleRemove}
                type="button"
                className="text-gray-400 hover:text-gray-500 sm:hidden"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-1 flex text-sm">
              <p className="text-gray-500">Quantity: {item.quantity}</p>
            </div>
          </div>
          
          <div className="flex flex-1 items-end justify-between">
            <div className="flex items-center mt-2">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded-l p-1"
                disabled={item.quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center border-t border-b border-gray-300 py-1">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded-r p-1"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex items-center">
              <p className="text-lg font-medium text-gray-900">
                ${totalPrice.toFixed(2)}
              </p>
              {item.salePrice && (
                <p className="ml-2 text-sm text-gray-500 line-through">
                  ${(item.price * item.quantity).toFixed(2)}
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
          className="text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;