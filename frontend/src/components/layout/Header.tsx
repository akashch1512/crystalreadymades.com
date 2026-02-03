import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ShoppingBag, Heart, Bell, User, Menu, X, LogOut, Shield, ChevronDown } from 'lucide-react';
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
  const [mobileClothingsOpen, setMobileClothingsOpen] = useState(false);
  const [mobileUniformsOpen, setMobileUniformsOpen] = useState(false);

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
    <header className="sticky top-0 bg-surface/90 backdrop-blur border-b border-line z-50 transition-all duration-300">
      <div className="container mx-auto">
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
                className="input rounded-full pr-10"
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-2.5 mr-4 text-muted hover:text-brand"
              >
                <Search size={20} />
              </button>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-surface border border-line rounded-2xl shadow-soft overflow-hidden">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      className="px-4 py-3 hover:bg-surface-muted cursor-pointer flex items-center"
                      onClick={() => handleSearchResultClick(product.slug)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg mr-3"
                      />
                      <div>
                        <div className="font-medium text-text">{product.name}</div>
                        <div className="text-sm text-muted">
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
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {/* Clothings Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center text-muted hover:text-brand transition-colors">
                Clothings
                <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-surface rounded-lg shadow-soft py-2 z-50 
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                              transition-all duration-200 border border-line shadow-soft bg-surface">
                <Link to="/products?category=mens-wear" className="block px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand" onClick={() => { }}>
                  Men's Wear
                </Link>
                <Link to="/products?category=womens-wear" className="block px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand">
                  Women's Wear
                </Link>
                <Link to="/products?category=kids-wear" className="block px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand">
                  Kids Wear
                </Link>
                <Link to="/products?category=ethnic-wear" className="block px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand">
                  Ethnic Wear
                </Link>
                <hr className="my-1 border-line" />
                <Link to="/products" className="block px-4 py-2.5 text-sm font-medium text-brand hover:bg-surface-muted">
                  View All Clothings
                </Link>
              </div>
            </div>

            {/* Uniforms Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center text-muted hover:text-brand transition-colors">
                Uniforms
                <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-surface rounded-lg shadow-soft py-2 z-50 
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                              transition-all duration-200 border border-line shadow-soft bg-surface">
                <Link to="/categories/school-uniforms" className="block px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand">
                  School Uniforms
                </Link>
                <Link to="/categories/college-uniforms" className="block px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand">
                  College Uniforms
                </Link>
                <Link to="/categories/corporate-uniforms" className="block px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand">
                  Corporate Uniforms
                </Link>
                <Link to="/categories/hospital-uniforms" className="block px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand">
                  Hospital & Medical
                </Link>
                <Link to="/categories/hotel-uniforms" className="block px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand">
                  Hotel & Hospitality
                </Link>
                <hr className="my-1 border-line" />
                <Link to="/categories" className="block px-4 py-2.5 text-sm font-medium text-brand hover:bg-surface-muted">
                  View All Uniforms
                </Link>
              </div>
            </div>

            <Link to="/aboutus" className="text-muted hover:text-brand transition-colors">
              About
            </Link>
          </nav>

          {/* Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="relative text-muted hover:text-brand">
                  <Heart size={22} />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistItemCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative text-muted hover:text-brand">
                  <ShoppingCart size={22} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link to="/notifications" className="relative text-muted hover:text-brand">
                  <Bell size={22} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </Link>
                <div className="relative group py-2"> {/* Added padding to bridge the gap for hover */}
                  <button className="flex items-center text-muted hover:text-brand transition-all duration-200">
                    <User size={22} />
                    <span className="ml-1 font-medium text-sm">{user?.name ? user.name.split(' ')[0] : 'Guest'}</span>
                  </button>

                  {/* Dropdown Menu with improved hover behavior */}
                  <div className="absolute right-0 mt-0 w-48 bg-surface rounded-lg shadow-soft py-2 z-50 
                                  opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                  transition-all duration-200 border border-line shadow-soft bg-surface">
                    <Link to="/account" className="flex items-center px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand">
                      <User size={16} className="mr-2" /> My Account
                    </Link>
                    <Link to="/orders" className="flex items-center px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand">
                      <ShoppingBag size={16} className="mr-2" /> My Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center px-4 py-2.5 text-sm text-muted hover:bg-surface-muted hover:text-brand">
                        <Shield size={16} className="mr-2" /> Admin Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-muted hover:text-brand"
              >
                <User size={22} />
                <span className="ml-1 text-sm">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <Link to="/cart" className="relative mr-4 text-muted">
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-muted focus:outline-none"
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
              className="input rounded-full pr-10"
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 mt-2.5 mr-4 text-muted hover:text-brand"
            >
              <Search size={20} />
            </button>

            {/* Mobile Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-surface border border-line rounded-2xl shadow-soft overflow-hidden">
                {searchResults.map(product => (
                  <div
                    key={product.id}
                    className="px-4 py-3 hover:bg-surface-muted cursor-pointer flex items-center"
                    onClick={() => handleSearchResultClick(product.slug)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg mr-3"
                    />
                    <div>
                      <div className="font-medium text-text">{product.name}</div>
                      <div className="text-sm text-muted">
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
        <div className="md:hidden bg-surface border-t border-line shadow-soft">
          <nav className="flex flex-col px-4 py-2">
            {/* Clothings Accordion */}
            <div className="border-b border-line">
              <button
                onClick={() => setMobileClothingsOpen(!mobileClothingsOpen)}
                className="flex items-center justify-between w-full py-3 text-muted"
              >
                Clothings
                <ChevronDown size={16} className={`transition-transform ${mobileClothingsOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileClothingsOpen && (
                <div className="pl-4 pb-2 space-y-1">
                  <Link to="/products?category=mens-wear" className="block py-2 text-sm text-muted hover:text-brand" onClick={() => setShowMobileMenu(false)}>Men's Wear</Link>
                  <Link to="/products?category=womens-wear" className="block py-2 text-sm text-muted hover:text-brand" onClick={() => setShowMobileMenu(false)}>Women's Wear</Link>
                  <Link to="/products?category=kids-wear" className="block py-2 text-sm text-muted hover:text-brand" onClick={() => setShowMobileMenu(false)}>Kids Wear</Link>
                  <Link to="/products?category=ethnic-wear" className="block py-2 text-sm text-muted hover:text-brand" onClick={() => setShowMobileMenu(false)}>Ethnic Wear</Link>
                  <Link to="/products" className="block py-2 text-sm font-medium text-brand" onClick={() => setShowMobileMenu(false)}>View All Clothings</Link>
                </div>
              )}
            </div>

            {/* Uniforms Accordion */}
            <div className="border-b border-line">
              <button
                onClick={() => setMobileUniformsOpen(!mobileUniformsOpen)}
                className="flex items-center justify-between w-full py-3 text-muted"
              >
                Uniforms
                <ChevronDown size={16} className={`transition-transform ${mobileUniformsOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileUniformsOpen && (
                <div className="pl-4 pb-2 space-y-1">
                  <Link to="/categories/school-uniforms" className="block py-2 text-sm text-muted hover:text-brand" onClick={() => setShowMobileMenu(false)}>School Uniforms</Link>
                  <Link to="/categories/college-uniforms" className="block py-2 text-sm text-muted hover:text-brand" onClick={() => setShowMobileMenu(false)}>College Uniforms</Link>
                  <Link to="/categories/corporate-uniforms" className="block py-2 text-sm text-muted hover:text-brand" onClick={() => setShowMobileMenu(false)}>Corporate Uniforms</Link>
                  <Link to="/categories/hospital-uniforms" className="block py-2 text-sm text-muted hover:text-brand" onClick={() => setShowMobileMenu(false)}>Hospital & Medical</Link>
                  <Link to="/categories/hotel-uniforms" className="block py-2 text-sm text-muted hover:text-brand" onClick={() => setShowMobileMenu(false)}>Hotel & Hospitality</Link>
                  <Link to="/categories" className="block py-2 text-sm font-medium text-brand" onClick={() => setShowMobileMenu(false)}>View All Uniforms</Link>
                </div>
              )}
            </div>
            <Link
              to="/aboutus"
              className="py-3 text-muted border-b border-line"
              onClick={() => setShowMobileMenu(false)}
            >
              About
            </Link>

            {isAuthenticated ? (
              <>
              <Link
                to="/account"
                className="py-3 text-muted border-b border-line"
                onClick={() => setShowMobileMenu(false)}
              >
                My Account
              </Link>
              <Link
                to="/orders"
                className="py-3 text-muted border-b border-line"
                onClick={() => setShowMobileMenu(false)}
              >
                My Orders
              </Link>
              <Link
                to="/wishlist"
                className="py-3 text-muted border-b border-line"
                onClick={() => setShowMobileMenu(false)}
              >
                Wishlist
              </Link>
              <Link
                to="/notifications"
                className="py-3 text-muted border-b border-line"
                onClick={() => setShowMobileMenu(false)}
              >
                Notifications
                {notificationCount > 0 && (
                    <span className="ml-2 bg-brand text-white text-xs rounded-full px-2 py-1">
                      {notificationCount}
                    </span>
                  )}
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="py-3 text-muted border-b border-line"
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
                className="flex items-center py-3 text-muted"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="py-3 text-muted flex items-center"
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
