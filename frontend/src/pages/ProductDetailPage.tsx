import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductReview from '../components/products/ProductReview';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getProductBySlug } = useProducts();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  useEffect(() => {
    if (slug) {
      // Simulate API loading
      setLoading(true);
      setTimeout(() => {
        const foundProduct = getProductBySlug(slug);
        
        if (foundProduct) {
          setProduct(foundProduct);
          document.title = `${foundProduct.name} | CrystalReadymade`;
        } else {
          navigate('/products', { replace: true });
        }
        
        setLoading(false);
      }, 800);
    }
  }, [slug, getProductBySlug, navigate]);
  
  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.quantity) return;
    setQuantity(value);
  };
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // Show add to cart notification (could be added)
    }
  };
  
  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };
  
  const handlePrevImage = () => {
    setActiveImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    setActiveImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-gray-300 rounded-lg h-96"></div>
              <div className="flex mt-4 space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-20 h-20 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
              <div className="h-12 bg-gray-300 rounded w-full mb-4"></div>
              <div className="h-12 bg-gray-300 rounded w-full"></div>
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
  const avgRating = product.reviews.length > 0
    ? (product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-pink-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/products" className="hover:text-pink-600">Products</a>
        <span className="mx-2">/</span>
        <a href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-pink-600">
          {product.category}
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Product Images */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <div className="relative">
            <div className="rounded-lg overflow-hidden bg-gray-100 h-96 flex items-center justify-center">
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
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
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
                  className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                    activeImage === index
                      ? 'ring-2 ring-pink-500'
                      : 'ring-1 ring-gray-200'
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={18}
                  className={`${
                    star <= Math.round(product.ratings)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600">{avgRating} ({product.reviews.length} reviews)</span>
            </div>
          </div>
          
          <div className="mb-6">
            {product.salePrice ? (
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">${product.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
                <span className="ml-2 text-sm bg-pink-100 text-red-700 px-2 py-0.5 rounded">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="mb-6 text-gray-700">
            <p>{product.description}</p>
          </div>
          
          {/* Product Meta */}
          <div className="mb-6 space-y-2 text-sm">
            <div className="flex">
              <span className="text-gray-500 w-24">Category:</span>
              <a 
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-pink-600 hover:underline"
              >
                {product.category}
              </a>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">Brand:</span>
              <a 
                href={`/products?brand=${encodeURIComponent(product.brand)}`}
                className="text-pink-600 hover:underline"
              >
                {product.brand}
              </a>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">Tags:</span>
              <div className="flex flex-wrap">
                {product.tags.map((tag: string) => (
                  <a 
                    key={tag}
                    href={`/products?tags=${encodeURIComponent(tag)}`}
                    className="text-pink-600 hover:underline mr-2"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">Availability:</span>
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
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-100"
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
                  className="w-16 h-10 border-t border-b border-gray-300 text-center"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-100"
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
                className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 transition-colors flex items-center justify-center"
              >
                <ShoppingBag size={18} className="mr-2" />
                Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-md cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
            
            <div className="flex space-x-4">
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 py-3 px-4 rounded-md border ${
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-pink-50 hover:bg-pink-100'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors flex items-center justify-center`}
              >
                <Heart size={18} className={`mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>
              
              <button
                className="flex-shrink-0 py-3 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
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
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/4">
                      {key}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {value as string}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Customer Reviews */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        
        {product.reviews.length > 0 ? (
          <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 mr-2">{avgRating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= Math.round(product.ratings)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="ml-4 text-gray-600">
                Based on {product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            
            <div className="space-y-2">
              {product.reviews.map((review: any) => (
                <ProductReview key={review.id} review={review} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">This product has no reviews yet. Be the first to review it!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;