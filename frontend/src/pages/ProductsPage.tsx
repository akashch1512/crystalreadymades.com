import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilter from '../components/products/ProductFilter';
import { useProducts } from '../contexts/ProductContext';

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const { 
    filteredProducts, 
    categories,
    brands,
    filterOptions, 
    setFilterOptions,
    clearFilters
  } = useProducts();
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'Shop | CrystalReadymade';
    
    // Get filters from URL parameters
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const brandParam = params.get('brand');
    const minPriceParam = params.get('minPrice');
    const maxPriceParam = params.get('maxPrice');
    const ratingParam = params.get('rating');
    const sortByParam = params.get('sortBy');
    
    // Apply filters from URL
    const newFilters: any = {};
    
    if (categoryParam) newFilters.category = categoryParam;
    if (brandParam) newFilters.brand = brandParam;
    if (minPriceParam) newFilters.minPrice = parseFloat(minPriceParam);
    if (maxPriceParam) newFilters.maxPrice = parseFloat(maxPriceParam);
    if (ratingParam) newFilters.rating = parseFloat(ratingParam);
    if (sortByParam) newFilters.sortBy = sortByParam;
    
    setFilterOptions(newFilters);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [location.search, setFilterOptions]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Shop Our Products</h1>
      <p className="text-gray-600 mb-8">
        Browse our collection of crystal-enhanced products
      </p>
      
      <div className="flex flex-col md:flex-row">
        {/* Filters - Desktop sidebar */}
        <div className="hidden md:block md:w-1/4 lg:w-1/5 pr-8">
          <ProductFilter
            categories={categories}
            brands={brands}
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
            clearFilters={clearFilters}
          />
        </div>
        
        {/* Mobile Filters */}
        <div className="md:hidden mb-6">
          <ProductFilter
            categories={categories}
            brands={brands}
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
            clearFilters={clearFilters}
          />
        </div>
        
        {/* Product Grid */}
        <div className="md:w-3/4 lg:w-4/5">
          <ProductGrid 
            products={filteredProducts} 
            loading={loading} 
            emptyMessage="No products match your filters. Try adjusting your criteria or clear the filters to see all products."
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;