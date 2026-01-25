import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "../contexts/WishlistContext";
import { useProducts } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import { Product } from "../types";

const WishlistPage: React.FC = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { getProductById } = useProducts();
  const { addItem } = useCart();

  useEffect(() => {
    document.title = "My Wishlist | CrystalReadymade";
  }, []);

  const wishlistProducts = items
    .map((item) => getProductById(item.productId))
    .filter((product): product is Product => product !== undefined);

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  const handleClearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      clearWishlist();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Wishlist</h1>

      {wishlistProducts.length > 0 ? (
        <>
          <div className="flex justify-between mb-6">
            <p className="text-gray-600">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1 ? "item" : "items"}
            </p>
            <button
              onClick={handleClearWishlist}
              className="text-red-600 hover:text-red-800"
            >
              Clear Wishlist
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="relative pt-[60%]">
                  <img
                    src={product.images?.[0] || "/fallback.jpg"}
                    alt={product.name || "Product"}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-lg font-medium text-gray-900 hover:text-pink-600 mb-2 block"
                  >
                    {product.name}
                  </Link>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {product.salePrice != null ? (
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-gray-900">
                            ${product.salePrice.toFixed(2)}
                          </span>
                          {product.price != null && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      ) : product.price != null ? (
                        <span className="text-lg font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Price not available</span>
                      )}
                    </div>

                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm text-gray-600">
                        {product.ratings != null ? product.ratings.toFixed(1) : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.stock}
                      className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md ${
                        product.stock
                          ? "bg-pink-600 text-white hover:bg-pink-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } transition-colors`}
                    >
                      <ShoppingBag size={16} className="mr-2" />
                      {product.stock ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="p-2 rounded-md border border-red-500 text-red-500 hover:bg-pink-50"
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={16} className="fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="flex justify-center mb-4">
            <Heart size={48} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Items added to your wishlist will be saved here.
          </p>
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

export default WishlistPage;
