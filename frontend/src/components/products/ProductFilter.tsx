import React, { useState } from 'react';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterOptions, Category, Brand } from '../../types';

interface ProductFilterProps {
  categories: Category[];
  brands: Brand[];
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
  
  const handleCategoryChange = (categorySlug: string) => {
    setFilterOptions({
      ...filterOptions,
      category: filterOptions.category === categorySlug ? undefined : categorySlug
    });
  };
  
  const handleBrandChange = (brandSlug: string) => {
    setFilterOptions({
      ...filterOptions,
      brand: filterOptions.brand === brandSlug ? undefined : brandSlug
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
    const value = e.target.value;
    setFilterOptions({
      ...filterOptions,
      sortBy: value === "" ? undefined : (value as FilterOptions['sortBy'])
    });
  };
  
  // Count active filters
  const activeFilterCount = Object.values(filterOptions).filter(Boolean).length;

  return (
    <div className="mb-8">
      {/* Desktop Filters */}
      <div className="hidden md:block card p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-text">Filters</h2>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-brand hover:text-brand-strong"
            >
              Clear all filters
            </button>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="sidebar-search" className="block text-sm font-medium text-text mb-2">
              Search uniforms & wear
            </label>
            <input
              id="sidebar-search"
              type="text"
              value={filterOptions.search || ''}
              onChange={(e) => setFilterOptions({
                ...filterOptions,
                search: e.target.value || undefined,
              })}
              placeholder="Search by school, style, fabric..."
              className="input w-full rounded-2xl border-line"
            />
          </div>
          {/* Categories Section */}
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('categories')}
            >
              <h3 className="text-sm font-medium text-text">Categories</h3>
              {expandedSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {expandedSections.categories && (
              <div className="mt-2 space-y-4">
                {categories
                  .filter(category => !category.parentId)
                  .map(parent => {
                    const children = categories.filter(
                      category => category.parentId === parent.id
                    );

                    return (
                      <div key={parent.id}>
                        <div className="flex items-center">
                          <input
                            id={`category-parent-${parent.id}`}
                            name="category"
                            type="radio"
                            checked={filterOptions.category === parent.slug}
                            onChange={() => handleCategoryChange(parent.slug)}
                            className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                          />
                          <label
                            htmlFor={`category-parent-${parent.id}`}
                            className="ml-3 text-sm font-medium text-text"
                          >
                            {parent.name}
                          </label>
                        </div>
                        {children.length > 0 && (
                          <div className="mt-2 space-y-1 pl-6">
                            {children.map(category => (
                              <div key={category.id} className="flex items-center">
                                <input
                                  id={`category-${category.id}`}
                                  name="category"
                                  type="radio"
                                  checked={filterOptions.category === category.slug}
                                  onChange={() => handleCategoryChange(category.slug)}
                                  className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                                />
                                <label
                                  htmlFor={`category-${category.id}`}
                                  className="ml-3 text-sm text-muted"
                                >
                                  {category.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
          
          {/* Brands Section */}
          <div>
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('brands')}
            >
              <h3 className="text-sm font-medium text-text">Brands</h3>
              {expandedSections.brands ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {expandedSections.brands && (
              <div className="mt-2 space-y-1">
                {brands.map(brand => (
                  <div key={brand.id} className="flex items-center">
                    <input
                      id={`brand-${brand.id}`}
                      name="brand"
                      type="radio"
                      checked={filterOptions.brand === brand.slug}
                      onChange={() => handleBrandChange(brand.slug)}
                      className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className="ml-3 text-sm text-muted"
                    >
                      {brand.name}
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
              <h3 className="text-sm font-medium text-text">Price Range</h3>
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
                    className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                  />
                  <label
                    htmlFor="price-any"
                    className="ml-3 text-sm text-muted"
                  >
                    Any Price
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-under-50"
                    name="price"
                    type="radio"
                    checked={filterOptions.maxPrice === 500}
                    onChange={() => handlePriceChange(0, 500)}
                    className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                  />
                  <label
                    htmlFor="price-under-50"
                    className="ml-3 text-sm text-muted break-words"
                  >
                    Under ₹500
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-50-100"
                    name="price"
                    type="radio"
                    checked={filterOptions.minPrice === 500 && filterOptions.maxPrice === 1000}
                    onChange={() => handlePriceChange(500, 1000)}
                    className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                  />
                  <label
                    htmlFor="price-50-100"
                    className="ml-3 text-sm text-muted break-words"
                  >
                    ₹500 - ₹1000
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-100-200"
                    name="price"
                    type="radio"
                    checked={filterOptions.minPrice === 1000 && filterOptions.maxPrice === 2000}
                    onChange={() => handlePriceChange(1000, 2000)}
                    className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                  />
                  <label
                    htmlFor="price-100-200"
                    className="ml-3 text-sm text-muted break-words"
                  >
                    ₹1000 - ₹2000
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-over-200"
                    name="price"
                    type="radio"
                    checked={filterOptions.minPrice === 2000}
                    onChange={() => handlePriceChange(2000, undefined)}
                    className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                  />
                  <label
                    htmlFor="price-over-200"
                    className="ml-3 text-sm text-muted break-words"
                  >
                    ₹2000 and Above
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
              <h3 className="text-sm font-medium text-text">Rating</h3>
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
                      className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                    />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="ml-3 text-sm text-muted flex items-center"
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
          className="btn btn-secondary px-4 py-2"
        >
          <Filter size={18} className="mr-1" />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        
        <select
          value={filterOptions.sortBy || ""}
          onChange={handleSortChange}
          className="select text-sm"
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
          <span className="text-sm text-text mr-2">Sort By:</span>
          <select
            value={filterOptions.sortBy || ""}
            onChange={handleSortChange}
            className="select text-sm"
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
            className="absolute inset-0 bg-text/40"
            onClick={() => setShowMobileFilters(false)}
          ></div>
          
          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-surface shadow-xl flex flex-col">
            <div className="p-4 border-b border-line flex justify-between items-center">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {/* Categories Section */}
                <div>
                  <h3 className="text-sm font-medium text-text mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories
                      .filter(category => !category.parentId)
                      .map((parent) => {
                        const children = categories.filter(
                          category => category.parentId === parent.id
                        );

                        return (
                          <div key={parent.id} className="space-y-2">
                            <div className="flex items-center">
                              <input
                                id={`mobile-category-parent-${parent.id}`}
                                name="mobile-category"
                                type="radio"
                                checked={filterOptions.category === parent.slug}
                                onChange={() => handleCategoryChange(parent.slug)}
                                className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                              />
                              <label
                                htmlFor={`mobile-category-parent-${parent.id}`}
                                className="ml-3 text-sm font-medium text-text"
                              >
                                {parent.name}
                              </label>
                            </div>
                            {children.length > 0 && (
                              <div className="mt-2 space-y-1 pl-6">
                                {children.map(category => (
                                  <div key={category.id} className="flex items-center">
                                    <input
                                      id={`mobile-category-${category.id}`}
                                      name="mobile-category"
                                      type="radio"
                                      checked={filterOptions.category === category.slug}
                                      onChange={() => handleCategoryChange(category.slug)}
                                      className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                                    />
                                    <label
                                      htmlFor={`mobile-category-${category.id}`}
                                      className="ml-3 text-sm text-muted"
                                    >
                                      {category.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
                
                {/* Brands Section */}
                <div>
                  <h3 className="text-sm font-medium text-text mb-2">Brands</h3>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <div key={brand.id} className="flex items-center">
                        <input
                          id={`mobile-brand-${brand.id}`}
                          name="mobile-brand"
                          type="radio"
                          checked={filterOptions.brand === brand.slug}
                          onChange={() => handleBrandChange(brand.slug)}
                          className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                        />
                        <label
                          htmlFor={`mobile-brand-${brand.id}`}
                          className="ml-3 text-sm text-muted"
                        >
                          {brand.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Section */}
                <div>
                  <h3 className="text-sm font-medium text-text mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="mobile-price-any"
                        name="mobile-price"
                        type="radio"
                        checked={!filterOptions.minPrice && !filterOptions.maxPrice}
                        onChange={() => handlePriceChange(undefined, undefined)}
                        className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                      />
                      <label
                        htmlFor="mobile-price-any"
                        className="ml-3 text-sm text-muted"
                      >
                        Any Price
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="mobile-price-under-50"
                        name="mobile-price"
                        type="radio"
                        checked={filterOptions.maxPrice === 500}
                        onChange={() => handlePriceChange(0, 500)}
                        className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                      />
                      <label
                        htmlFor="mobile-price-under-50"
                        className="ml-3 text-sm text-muted"
                      >
                        Under ₹500
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="mobile-price-50-100"
                        name="mobile-price"
                        type="radio"
                        checked={filterOptions.minPrice === 500 && filterOptions.maxPrice === 1000}
                        onChange={() => handlePriceChange(500, 1000)}
                        className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                      />
                      <label
                        htmlFor="mobile-price-50-100"
                        className="ml-3 text-sm text-muted"
                      >
                        ₹500 - ₹1000
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="mobile-price-100-200"
                        name="mobile-price"
                        type="radio"
                        checked={filterOptions.minPrice === 1000 && filterOptions.maxPrice === 2000}
                        onChange={() => handlePriceChange(1000, 2000)}
                        className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                      />
                      <label
                        htmlFor="mobile-price-100-200"
                        className="ml-3 text-sm text-muted"
                      >
                        ₹1000 - ₹2000
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="mobile-price-over-200"
                        name="mobile-price"
                        type="radio"
                        checked={filterOptions.minPrice === 2000}
                        onChange={() => handlePriceChange(2000, undefined)}
                        className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                      />
                      <label
                        htmlFor="mobile-price-over-200"
                        className="ml-3 text-sm text-muted"
                      >
                        ₹2000 and Above
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Rating Section */}
                <div>
                  <h3 className="text-sm font-medium text-text mb-2">Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center">
                        <input
                          id={`mobile-rating-${rating}`}
                          name="mobile-rating"
                          type="radio"
                          checked={filterOptions.rating === rating}
                          onChange={() => handleRatingChange(rating)}
                          className="h-4 w-4 text-brand focus:ring-brand border-line rounded"
                        />
                        <label
                          htmlFor={`mobile-rating-${rating}`}
                          className="ml-3 text-sm text-muted flex items-center"
                        >
                          {rating}+ <span className="text-yellow-400 ml-1">★</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-line flex space-x-4">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary flex-1 px-4 py-2"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="btn btn-primary flex-1 px-4 py-2"
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


