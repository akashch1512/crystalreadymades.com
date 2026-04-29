import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductReview from '../components/products/ProductReview';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Review } from '../types';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getProductBySlug } = useProducts();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { success, info, error: showError } = useToast();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  
  useEffect(() => {
    if (slug) {
      setLoading(true);
      setError(null);
      
      const fetchProduct = async () => {
        try {
          const API_BASE = import.meta.env.VITE_API_URL;
          const response = await fetch(`${API_BASE}/api/products/${slug}`);
          
          if (!response.ok) {
            throw new Error('Product not found');
          }
          
          const foundProduct = await response.json();
          const savedReviews = JSON.parse(
            localStorage.getItem(`crystal-product-reviews-${slug}`) || '[]'
          );
          foundProduct.reviews = [...savedReviews, ...(foundProduct.reviews || [])];
          setProduct(foundProduct);
          document.title = `${foundProduct.name} | CrystalReadymade`;
        } catch (err) {
          console.error('Error fetching product:', err);
          setError('Product not found');
          // Redirect to products page after a short delay
          setTimeout(() => {
            navigate('/products', { replace: true });
          }, 1000);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [slug, navigate]);

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.quantity) return;
    setQuantity(value);
  };
  
  const handleAddToCart = () => {
    if (product) {
      if (quantity > product.quantity) {
        showError(`${product.name} has only ${product.quantity} available`);
        return;
      }

      addItem(product, quantity);
      success(`${product.name} added to cart`);
    }
  };
  
  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      info('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      success('Added to wishlist');
    }
  };
  
  const handlePrevImage = () => {
    setActiveImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    setActiveImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleReviewSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!product || !slug) return;

    const trimmedComment = reviewComment.trim();

    if (!user) {
      showError('Please login to write a review');
      return;
    }

    if (!trimmedComment) {
      showError('Please write a short review');
      return;
    }

    const newReview: Review = {
      id: `local-review-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      comment: trimmedComment,
      createdAt: new Date().toISOString(),
    };

    const savedKey = `crystal-product-reviews-${slug}`;
    const savedReviews = JSON.parse(localStorage.getItem(savedKey) || '[]');
    localStorage.setItem(savedKey, JSON.stringify([newReview, ...savedReviews]));

    setProduct((current: any) => {
      const reviews = [newReview, ...(current.reviews || [])];
      const ratings = reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length;

      return {
        ...current,
        reviews,
        ratings,
      };
    });

    setReviewComment('');
    setReviewRating(5);
    success('Thanks! Your review has been added');
  };
  
  if (loading) {
    return (
      <div className="page">
        <div className="section">
          <div className="container mx-auto">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-surface-muted rounded-2xl h-96"></div>
              <div className="flex mt-4 space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-20 h-20 bg-surface-muted rounded-2xl"></div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="h-8 bg-surface-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-surface-muted rounded w-1/2 mb-6"></div>
              <div className="h-4 bg-surface-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-surface-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-surface-muted rounded w-3/4 mb-8"></div>
              <div className="h-8 bg-surface-muted rounded w-1/3 mb-6"></div>
              <div className="h-12 bg-surface-muted rounded w-full mb-4"></div>
              <div className="h-12 bg-surface-muted rounded w-full"></div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return null;
  }
  
  const isWishlisted = isInWishlist(product.id);
  
  // Calculate average rating
  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="page">
      <div className="section">
        <div className="container mx-auto">
      {/* Breadcrumbs */}
      <div className="flex text-sm text-muted mb-6">
        <a href="/" className="hover:text-brand">Home</a>
        <span className="mx-2">/</span>
        <a href="/products" className="hover:text-brand">Products</a>
        <span className="mx-2">/</span>
        <a href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-brand">
          {product.category}
        </a>
        <span className="mx-2">/</span>
        <span className="text-text">{product.name}</span>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Product Images */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden bg-surface-muted h-96 flex items-center justify-center">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Image navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-surface/80 rounded-full p-2 hover:bg-surface border border-line"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-surface/80 rounded-full p-2 hover:bg-surface border border-line"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail navigation */}
          {product.images.length > 1 && (
            <div className="flex mt-4 space-x-2 overflow-x-auto">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 ${
                    activeImage === index
                      ? 'ring-2 ring-brand'
                      : 'ring-1 ring-line'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="md:w-1/2 md:pl-8">
          <h1 className="h1 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={18}
                  className={`${
                    star <= Math.round(product.ratings)
                      ? 'text-yellow-400 fill-current'
                      : 'text-line'
                  }`}
                />
              ))}
              <span className="ml-2 text-muted">{avgRating} ({reviews.length} reviews)</span>
            </div>
          </div>
          
          <div className="mb-6">
            {product.salePrice ? (
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-text">₹{product.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-lg text-muted line-through">₹{product.price.toFixed(2)}</span>
                <span className="ml-2 text-sm bg-brand/10 text-brand-strong px-2 py-0.5 rounded-full">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-text">₹{product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="mb-6 text-muted">
            <p>{product.description}</p>
          </div>
          
          {/* Product Meta */}
          <div className="mb-6 space-y-2 text-sm">
            <div className="flex">
              <span className="text-muted w-24">Category:</span>
              <a 
                href={`/products?category=${encodeURIComponent(product.categorySlug || product.category)}`}
                className="text-brand hover:underline"
              >
                {product.category}
              </a>
            </div>
            <div className="flex">
              <span className="text-muted w-24">Brand:</span>
              <a 
                href={`/products?brand=${encodeURIComponent(product.brandSlug || product.brand)}`}
                className="text-brand hover:underline"
              >
                {product.brand}
              </a>
            </div>
            <div className="flex">
              <span className="text-muted w-24">Tags:</span>
              <div className="flex flex-wrap">
                {product.tags.map((tag: string) => (
                  <a 
                    key={tag}
                    href={`/products?tags=${encodeURIComponent(tag)}`}
                    className="text-brand hover:underline mr-2"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex">
              <span className="text-muted w-24">Availability:</span>
              {product.inStock ? (
                <span className="text-green-600">In Stock ({product.quantity} available)</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>
          
          {/* Quantity Selector */}
          {product.inStock && (
            <div className="mb-6">
              <label htmlFor="quantity" className="label mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="flex items-center justify-center w-10 h-10 border border-line rounded-l-xl text-muted hover:bg-surface-muted"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={product.quantity}
                  className="w-16 h-10 border-y border-line text-center bg-surface"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="flex items-center justify-center w-10 h-10 border border-line rounded-r-xl text-muted hover:bg-surface-muted"
                  disabled={quantity >= product.quantity}
                >
                  +
                </button>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-4">
            {product.inStock ? (
              <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full"
              >
                <ShoppingBag size={18} className="mr-2" />
                Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="btn btn-disabled w-full"
              >
                Out of Stock
              </button>
            )}
            
            <div className="flex space-x-4">
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 py-3 px-4 rounded-full border ${
                  isWishlisted
                    ? 'border-brand text-brand bg-brand/10 hover:bg-brand/15'
                    : 'border-line text-muted hover:bg-surface-muted'
                } transition-colors flex items-center justify-center`}
              >
                <Heart size={18} className={`mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>
              
              <button
                className="flex-shrink-0 py-3 px-4 rounded-full border border-line text-muted hover:bg-surface-muted transition-colors"
                aria-label="Share product"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-12">
          <h2 className="h3 mb-4">Specifications</h2>
          <div className="card overflow-hidden">
            <table className="min-w-full divide-y divide-line">
              <tbody className="divide-y divide-line">
                {Object.entries(product.specifications).map(([key, value]) => {
                  // Handle nested objects
                  let displayValue = '';
                  if (typeof value === 'object' && value !== null) {
                    displayValue = Object.values(value).join(', ');
                  } else {
                    displayValue = String(value);
                  }
                  
                  return (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text bg-surface-muted w-1/4">
                        {key}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {displayValue}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Customer Reviews */}
      <div className="mt-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="h3 mb-1">Customer Reviews</h2>
            <p className="text-sm text-muted">Share your experience with this product.</p>
          </div>
          {reviews.length > 0 && (
            <span className="text-sm text-muted">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          )}
        </div>

        {user ? (
          <form onSubmit={handleReviewSubmit} className="card mb-8 p-5 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="caption mb-2 text-brand">Write a review</p>
                <p className="text-sm text-muted">
                  Posting as <span className="font-medium text-text">{user.name}</span>
                </p>
              </div>
              <div className="flex items-center gap-2" role="radiogroup" aria-label="Review rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="rounded-full p-1 text-yellow-400 transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                    aria-label={`${star} star${star === 1 ? '' : 's'}`}
                    aria-pressed={reviewRating === star}
                  >
                    <Star
                      size={22}
                      className={star <= reviewRating ? 'fill-current' : 'text-line'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="label mb-2 block">Review</span>
              <textarea
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                className="textarea min-h-24 resize-y"
                placeholder="Tell other parents about the fit, fabric, and quality..."
              />
            </label>
            <button type="submit" className="btn btn-primary mt-4 w-full sm:w-fit">
              Submit Review
            </button>
          </form>
        ) : (
          <div className="card mb-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-medium text-text">Login to write a review</p>
              <p className="text-sm text-muted">Your review will be posted with your account name.</p>
            </div>
            <Link to="/login" className="btn btn-primary w-full sm:w-fit">
              Login
            </Link>
          </div>
        )}
        
        {reviews.length > 0 ? (
          <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-text mr-2">{avgRating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= Math.round(product.ratings)
                          ? 'text-yellow-400 fill-current'
                          : 'text-line'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="ml-4 text-muted">
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            
            <div className="space-y-2">
              {reviews.map((review: any) => (
                <ProductReview key={review.id} review={review} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-surface-muted rounded-2xl border border-line">
            <p className="text-muted">This product has no reviews yet. Be the first to review it!</p>
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

