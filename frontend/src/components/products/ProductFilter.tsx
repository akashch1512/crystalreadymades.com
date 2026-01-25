import React, { useState } from 'react';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterOptions } from '../../types';

interface ProductFilterProps {
  categories: string[];
  brands: string[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  clearFilters: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  brands,
  filterOptions,
  setFilterOptions,
  clearFilters
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    rating: true
  });
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleCategoryChange = (category: string) => {
    setFilterOptions({
      ...filterOptions,
      category: filterOptions.category === category ? undefined : category
    });
  };
  
  const handleBrandChange = (brand: string) => {
    setFilterOptions({
      ...filterOptions,
      brand: filterOptions.brand === brand ? undefined : brand
    });
  };
  
  const handlePriceChange = (min?: number, max?: number) => {
    setFilterOptions({
      ...filterOptions,
      minPrice: min,
      maxPrice: max
    });
  };
  
  const handleRatingChange = (rating: number) => {
    setFilterOptions({
      ...filterOptions,
      rating: filterOptions.rating === rating ? undefined : rating
    });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FilterOptions['sortBy'];
    setFilterOptions({
      ...filterOptions,
      sortBy: value === "" ? undefined : value
    });
  };
  
  // Count active filters
  const activeFilterCount = Object.values(filterOptions).filter(Boolean).length;

  return (
    <div className="mb-8">
      {/* Desktop Filters */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-pink-600 hover:text-pink-800"
            >
              Clear all filters
            </button>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Categories Section */}
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('categories')}
            >
              <h3 className="text-sm font-medium text-gray-900">Categories</h3>
              {expandedSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {expandedSections.categories && (
              <div className="mt-2 space-y-1">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      name="category"
                      type="radio"
                      checked={filterOptions.category === category}
                      onChange={() => handleCategoryChange(category)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Brands Section */}
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('brands')}
            >
              <h3 className="text-sm font-medium text-gray-900">Brands</h3>
              {expandedSections.brands ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {expandedSections.brands && (
              <div className="mt-2 space-y-1">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center">
                    <input
                      id={`brand-${brand}`}
                      name="brand"
                      type="radio"
                      checked={filterOptions.brand === brand}
                      onChange={() => handleBrandChange(brand)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`brand-${brand}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Price Range Section */}
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('price')}
            >
              <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
              {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {expandedSections.price && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="price-any"
                    name="price"
                    type="radio"
                    checked={!filterOptions.minPrice && !filterOptions.maxPrice}
                    onChange={() => handlePriceChange(undefined, undefined)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="price-any"
                    className="ml-3 text-sm text-gray-600"
                  >
                    Any Price
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-under-50"
                    name="price"
                    type="radio"
                    checked={filterOptions.maxPrice === 50}
                    onChange={() => handlePriceChange(0, 50)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="price-under-50"
                    className="ml-3 text-sm text-gray-600"
                  >
                    Under $50
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-50-100"
                    name="price"
                    type="radio"
                    checked={filterOptions.minPrice === 50 && filterOptions.maxPrice === 100}
                    onChange={() => handlePriceChange(50, 100)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="price-50-100"
                    className="ml-3 text-sm text-gray-600"
                  >
                    $50 - $100
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-100-200"
                    name="price"
                    type="radio"
                    checked={filterOptions.minPrice === 100 && filterOptions.maxPrice === 200}
                    onChange={() => handlePriceChange(100, 200)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="price-100-200"
                    className="ml-3 text-sm text-gray-600"
                  >
                    $100 - $200
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-over-200"
                    name="price"
                    type="radio"
                    checked={filterOptions.minPrice === 200}
                    onChange={() => handlePriceChange(200, undefined)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="price-over-200"
                    className="ml-3 text-sm text-gray-600"
                  >
                    $200 and Above
                  </label>
                </div>
              </div>
            )}
          </div>
          
          {/* Rating Section */}
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('rating')}
            >
              <h3 className="text-sm font-medium text-gray-900">Rating</h3>
              {expandedSections.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {expandedSections.rating && (
              <div className="mt-2 space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center">
                    <input
                      id={`rating-${rating}`}
                      name="rating"
                      type="radio"
                      checked={filterOptions.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="ml-3 text-sm text-gray-600 flex items-center"
                    >
                      {rating}+ <span className="text-yellow-400 ml-1">★</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Button & Sort */}
      <div className="flex justify-between items-center md:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center text-gray-700 bg-white border border-gray-300 rounded px-3 py-1"
        >
          <Filter size={18} className="mr-1" />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        
        <select
          value={filterOptions.sortBy || ""}
          onChange={handleSortChange}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
      
      {/* Desktop Sort */}
      <div className="hidden md:flex justify-end items-center mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Sort By:</span>
          <select
            value={filterOptions.sortBy || ""}
            onChange={handleSortChange}
            className="border border-gray-300 rounded px-3 py-1"
          >
            <option value="">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
      
      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilters(false)}
          ></div>
          
          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {/* Categories Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <input
                          id={`mobile-category-${category}`}
                          name="mobile-category"
                          type="radio"
                          checked={filterOptions.category === category}
                          onChange={() => handleCategoryChange(category)}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`mobile-category-${category}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Brands Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Brands</h3>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center">
                        <input
                          id={`mobile-brand-${brand}`}
                          name="mobile-brand"
                          type="radio"
                          checked={filterOptions.brand === brand}
                          onChange={() => handleBrandChange(brand)}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`mobile-brand-${brand}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="mobile-price-any"
                        name="mobile-price"
                        type="radio"
                        checked={!filterOptions.minPrice && !filterOptions.maxPrice}
                        onChange={() => handlePriceChange(undefined, undefined)}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="mobile-price-any"
                        className="ml-3 text-sm text-gray-600"
                      >
                        Any Price
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="mobile-price-under-50"
                        name="mobile-price"
                        type="radio"
                        checked={filterOptions.maxPrice === 50}
                        onChange={() => handlePriceChange(0, 50)}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="mobile-price-under-50"
                        className="ml-3 text-sm text-gray-600"
                      >
                        Under $50
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="mobile-price-50-100"
                        name="mobile-price"
                        type="radio"
                        checked={filterOptions.minPrice === 50 && filterOptions.maxPrice === 100}
                        onChange={() => handlePriceChange(50, 100)}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="mobile-price-50-100"
                        className="ml-3 text-sm text-gray-600"
                      >
                        $50 - $100
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="mobile-price-100-200"
                        name="mobile-price"
                        type="radio"
                        checked={filterOptions.minPrice === 100 && filterOptions.maxPrice === 200}
                        onChange={() => handlePriceChange(100, 200)}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="mobile-price-100-200"
                        className="ml-3 text-sm text-gray-600"
                      >
                        $100 - $200
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="mobile-price-over-200"
                        name="mobile-price"
                        type="radio"
                        checked={filterOptions.minPrice === 200}
                        onChange={() => handlePriceChange(200, undefined)}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="mobile-price-over-200"
                        className="ml-3 text-sm text-gray-600"
                      >
                        $200 and Above
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Rating Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center">
                        <input
                          id={`mobile-rating-${rating}`}
                          name="mobile-rating"
                          type="radio"
                          checked={filterOptions.rating === rating}
                          onChange={() => handleRatingChange(rating)}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`mobile-rating-${rating}`}
                          className="ml-3 text-sm text-gray-600 flex items-center"
                        >
                          {rating}+ <span className="text-yellow-400 ml-1">★</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex space-x-4">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;