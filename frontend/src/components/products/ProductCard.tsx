import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useToast } from '../../contexts/ToastContext';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

/** Renders filled + half + empty stars matching Amazon's style */
const StarRating: React.FC<{ rating: number; count?: number }> = ({ rating, count }) => {
  const filled = Math.floor(rating);
  const half = rating - filled >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(filled)].map((_, i) => (
          <Star key={`f${i}`} size={13} className="fill-yellow-400 text-yellow-400" />
        ))}
        {half && (
          <span className="relative inline-block" style={{ width: 13, height: 13 }}>
            <Star size={13} className="text-gray-300 fill-gray-200 absolute inset-0" />
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={13} className="fill-yellow-400 text-yellow-400" />
            </span>
          </span>
        )}
        {[...Array(empty)].map((_, i) => (
          <Star key={`e${i}`} size={13} className="text-gray-300 fill-gray-200" />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted hover:underline cursor-pointer">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { success, info } = useToast();

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.quantity <= 0;

  const discountPct = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const displayPrice = product.salePrice ?? product.price;
  const rating = product.ratingAverage ?? product.ratings ?? 0;
  const reviewCount = product.reviewCount ?? product.reviews?.length ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product, 1);
      success(`${product.name} added to cart`);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      info(`Removed from wishlist`);
    } else {
      addToWishlist(product.id);
      success(`Added to wishlist`);
    }
  };

  // ============================================================================
  // GRID LAYOUT (Home page, featured products, minimal vertical card)
  // ============================================================================
  if (layout === 'grid') {
    return (
      <Link
        to={`/product/${product.slug}`}
        className="group relative card card-hover overflow-hidden flex flex-col h-full"
      >
        {/* Product Image */}
        <div className="relative pt-[100%]">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Discount Badge */}
          {discountPct > 0 && (
            <span className="absolute top-2 left-2 bg-brand text-white text-xs font-semibold px-2 py-1 rounded-full text-center min-w-[36px]">
              -{discountPct}%
            </span>
          )}

          {/* MOBILE ONLY: Top-right actions (Cart + Wishlist) */}
          <div className="md:hidden absolute top-2 right-2 flex flex-col gap-2 z-10">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full shadow-sm transition-colors border border-line ${
                isWishlisted
                  ? 'bg-brand text-white border-brand hover:bg-brand-strong'
                  : 'bg-surface/90 text-text hover:text-brand hover:border-brand'
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full shadow-sm bg-surface/90 text-text hover:text-brand hover:border-brand transition-colors border border-line disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add to cart"
              disabled={isOutOfStock}
            >
              <ShoppingBag size={18} />
            </button>
          </div>

          {/* DESKTOP ONLY: Hover actions overlay (Cart + Wishlist) */}
          <div className="hidden md:flex absolute inset-0 bg-text/0 group-hover:bg-text/10 items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 pointer-events-none group-hover:pointer-events-auto">
            <div className="flex gap-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="bg-surface text-text p-2 rounded-full shadow-md hover:bg-brand hover:text-white transition-colors border border-line"
                aria-label="Add to cart"
                disabled={isOutOfStock}
              >
                <ShoppingBag size={20} />
              </button>
              <button
                onClick={handleWishlist}
                className={`p-2 rounded-full shadow-md transition-colors border border-line ${
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
          <p className="text-muted text-xs uppercase tracking-wider mb-1 line-clamp-1">{product.brand}</p>
          <h3 className="font-semibold text-text mb-2 line-clamp-2 leading-tight group-hover:text-brand transition-colors">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              {product.salePrice ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-lg font-bold text-text">₹{product.salePrice.toLocaleString()}</span>
                  <span className="text-xs text-muted line-through">₹{product.price.toLocaleString()}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-text">₹{product.price.toLocaleString()}</span>
              )}
            </div>

            {/* Rating */}
            <StarRating rating={rating} count={reviewCount} />
          </div>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-surface/80 flex items-center justify-center pointer-events-none z-10">
            <span className="bg-text text-white px-4 py-2 rounded-full text-sm font-medium shadow-md pointer-events-auto">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
    );
  }

  // ============================================================================
  // LIST LAYOUT (Products search page, Amazon horizontal style)
  // ============================================================================
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col sm:flex-row bg-surface border border-line rounded-2xl overflow-hidden hover:shadow-soft hover:border-accent transition-all duration-200"
    >
      {/* ── Left/Top: Product Image ── */}
      <div className="relative flex-shrink-0 w-full sm:w-[220px] lg:w-[260px] bg-surface-muted aspect-[4/3] sm:aspect-auto">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Discount badge */}
        {discountPct > 0 && (
          <span className="absolute top-3 left-3 bg-brand text-white text-[12px] font-bold px-2 py-1 rounded">
            Up to {discountPct}% off
          </span>
        )}
        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-1.5 rounded-full shadow transition-colors border border-line z-10
            ${isWishlisted
              ? 'bg-brand text-white border-brand hover:bg-brand-strong'
              : 'bg-surface/90 text-muted hover:text-brand hover:border-brand'}`}
        >
          <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </button>
      </div>

      {/* ── Right/Bottom: Product Info ── */}
      <div className="flex flex-col justify-between flex-1 p-4 sm:p-5 sm:pl-6 min-w-0">
        <div>
          {/* Brand */}
          <p className="text-xs text-brand hover:underline font-medium mb-1 truncate hidden sm:block">
            {product.brand || product.category}
          </p>

          {/* Product Name */}
          <h3 className="text-[16px] sm:text-[18px] font-medium text-[#0f1111] leading-snug mb-1 line-clamp-3 sm:line-clamp-2 group-hover:text-brand transition-colors">
            {product.name}
          </h3>

          {/* Star Rating & Review Count */}
          <div className="mb-2">
            <StarRating rating={rating} count={reviewCount} />
          </div>

          <p className="text-xs text-[#0f1111] mb-1 sm:hidden">
            Brand: <strong>{product.brand || product.category}</strong>
          </p>

          {/* Short description if available */}
          {product.description && (
            <p className="text-sm text-muted line-clamp-2 mb-3 leading-relaxed hidden md:block mt-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-2">
          {/* Price block */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[22px] sm:text-[28px] font-medium text-[#0f1111]">
              <span className="text-[12px] sm:text-[14px] align-top mr-0.5">₹</span>
              {displayPrice.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </span>
            {product.salePrice && (
              <span className="text-sm text-[#565959] line-through">
                M.R.P: ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>
            )}
          </div>

          {/* Prime / Delivery info simulation */}
          <div className="mb-4">
            {/* <p className="text-sm text-[#0f1111]">
              <span className="text-[#007185] font-semibold">FREE Delivery</span> by Crystal Readymades
            </p> */}
          </div>

          {/* Add to cart / Stock status */}
          {isOutOfStock ? (
            <p className="text-sm font-semibold text-[#B12704] mb-3">Currently unavailable.</p>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-brand hover:bg-brand-strong text-white border border-brand shadow-sm rounded-full px-5 py-2 text-sm font-semibold transition-colors w-full sm:w-auto"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
