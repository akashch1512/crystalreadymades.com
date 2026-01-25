import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Bell, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useProducts } from '../../contexts/ProductContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount: cartItemCount } = useCart();
  const { itemCount: wishlistItemCount } = useWishlist();
  const { unreadCount: notificationCount } = useNotifications();
  const { searchProducts } = useProducts();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 2) {
      const results = searchProducts(query);
      setSearchResults((results || []).slice(0, 5));// Limit to 5 results
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (slug: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(`/product/${slug}`);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/Logo/Hero_Logo.gif"
              alt="Crystal Readymade Logo"
              className="h-12 w-auto"
            />
          </Link>


          {/* Search Bar - Desktop */}
          <div className="hidden md:block relative flex-grow max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-pink-500"
              >
                <Search size={20} />
              </button>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleSearchResultClick(product.slug)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded mr-2"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          ${product.salePrice || product.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-pink-600 transition-colors">
              Shop
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-pink-600 transition-colors">
              Categories
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-pink-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-pink-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="relative text-gray-700 hover:text-pink-600">
                  <Heart size={22} />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistItemCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative text-gray-700 hover:text-pink-600">
                  <ShoppingCart size={22} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link to="/notifications" className="relative text-gray-700 hover:text-pink-600">
                  <Bell size={22} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-pink-600">
                    <User size={22} />
                    <span className="ml-1">{user?.name ? user.name.split(' ')[0] : 'Guest'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                    <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Account
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link> 
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-gray-700 hover:text-pink-600"
              >
                <User size={22} />
                <span className="ml-1">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <Link to="/cart" className="relative mr-4 text-gray-700">
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 focus:outline-none"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-pink-500"
            >
              <Search size={20} />
            </button>

            {/* Mobile Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {searchResults.map(product => (
                  <div
                    key={product.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleSearchResultClick(product.slug)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded mr-2"
                    />
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        ${product.salePrice || product.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
          <nav className="flex flex-col px-4 py-2">
            <Link
              to="/products"
              className="py-3 text-gray-700 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Shop
            </Link>
            <Link
              to="/categories"
              className="py-3 text-gray-700 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="py-3 text-gray-700 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="py-3 text-gray-700 border-b border-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="py-3 text-gray-700 border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  My Account
                </Link>
                <Link
                  to="/orders"
                  className="py-3 text-gray-700 border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="py-3 text-gray-700 border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Wishlist
                </Link>
                <Link
                  to="/notifications"
                  className="py-3 text-gray-700 border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Notifications
                  {notificationCount > 0 && (
                    <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-1">
                      {notificationCount}
                    </span>
                  )}
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="py-3 text-gray-700 border-b border-gray-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center py-3 text-gray-700"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="py-3 text-gray-700 flex items-center"
                onClick={() => setShowMobileMenu(false)}
              >
                <User size={18} className="mr-2" />
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;