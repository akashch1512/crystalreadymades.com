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

  const isOutOfStock = product.quantity <= 0;

  return (
    <Link 
      to={`/product/${product.slug}`} 
      className="group relative card card-hover overflow-hidden flex flex-col"
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
          <span className="absolute top-2 left-2 bg-brand text-white text-xs font-semibold px-2 py-1 rounded-full">
            {discountPercentage}% OFF
          </span>
        )}
        
        {/* Actions Overlay */}
        <div className="absolute inset-0 bg-text/0 group-hover:bg-text/10 transition-all duration-300 flex items-center justify-center">
          <div className="flex gap-2 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="bg-surface text-text p-2 rounded-full shadow-sm hover:bg-brand hover:text-white transition-colors border border-line"
              aria-label="Add to cart"
              disabled={isOutOfStock}
            >
              <ShoppingBag size={20} />
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full shadow-sm transition-colors border border-line ${
                isWishlisted
                  ? 'bg-brand text-white hover:bg-brand-strong'
                  : 'bg-surface text-text hover:bg-brand hover:text-white'
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
        <h3 className="font-medium text-text mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-muted text-sm mb-2 line-clamp-1">{product.brand}</p>
        
        <div className="mt-auto flex items-center">
          {product.salePrice ? (
            <>
              <span className="text-lg font-semibold text-text">${product.salePrice.toFixed(2)}</span>
              <span className="ml-2 text-sm text-muted line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-semibold text-text">${product.price.toFixed(2)}</span>
          )}
          
          {/* Rating */}
          <div className="ml-auto flex items-center">
            <div className="text-sm text-muted">{product.ratings?.toFixed(1) ?? '0.0'}</div>
            <div className="ml-1 text-yellow-400">★</div>
          </div>
        </div>
      </div>
      
      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
          <span className="bg-text text-white px-4 py-2 rounded-full text-sm">Out of Stock</span>
        </div>
      )}
    </Link>
  );
};

export default ProductCard;
