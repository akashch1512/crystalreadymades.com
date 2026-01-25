import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };
  
  const isWishlisted = isInWishlist(product.id);

  const discountPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

    const isOutOfStock = typeof product.stock !== 'number' || product.stock <= 0;

  return (
    <Link 
      to={`/product/${product.slug}`} 
      className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Product Image */}
      <div className="relative pt-[100%]">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </span>
        )}
        
        {/* Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <div className="flex gap-2 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-pink-500 hover:text-white transition-colors"
              aria-label="Add to cart"
              disabled={isOutOfStock}
            >
              <ShoppingBag size={20} />
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full shadow-md transition-colors ${
                isWishlisted
                  ? 'bg-pink-500 text-white hover:bg-pink-600'
                  : 'bg-white text-gray-800 hover:bg-pink-500 hover:text-white'
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2 line-clamp-1">{product.brand}</p>
        
        <div className="mt-auto flex items-center">
          {product.salePrice ? (
            <>
              <span className="text-lg font-semibold text-gray-900">${product.salePrice.toFixed(2)}</span>
              <span className="ml-2 text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</span>
          )}
          
          {/* Rating */}
          <div className="ml-auto flex items-center">
            <div className="text-sm text-gray-600">{product.ratings?.toFixed(1) ?? '0.0'}</div>
            <div className="ml-1 text-yellow-400">★</div>
          </div>
        </div>
      </div>
      
      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <span className="bg-gray-800 text-white px-4 py-2 rounded-md">Out of Stock</span>
        </div>
      )}
    </Link>
  );
};

export default ProductCard;
