import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // --- Parse URL params ---
  const params = new URLSearchParams(location.search);
  const categoryParam = params.get('category');
  const searchParam = params.get('search');

  // Apply filters from URL whenever search string changes
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const newFilters: any = {};
    const cat = p.get('category');
    const brand = p.get('brand');
    const minPrice = p.get('minPrice');
    const maxPrice = p.get('maxPrice');
    const rating = p.get('rating');
    const search = p.get('search');
    const sortBy = p.get('sortBy');

    if (cat) newFilters.category = cat;
    if (brand) newFilters.brand = brand;
    if (minPrice) newFilters.minPrice = parseFloat(minPrice);
    if (maxPrice) newFilters.maxPrice = parseFloat(maxPrice);
    if (rating) newFilters.rating = parseFloat(rating);
    if (search) newFilters.search = search;
    if (sortBy) newFilters.sortBy = sortBy;

    setFilterOptions(newFilters);

    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [location.search, setFilterOptions]);

  // --- Dynamic heading & description ---
  const activeCategory = categoryParam
    ? categories.find(
        (c) =>
          c.slug === categoryParam ||
          c.name.toLowerCase() === categoryParam.toLowerCase()
      )
    : null;

  let pageTitle = 'All Products';
  let pageDesc = 'Browse our full collection of products.';

  if (searchParam?.trim()) {
    pageTitle = `Results for "${searchParam.trim()}"`;
    pageDesc = '';
  } else if (activeCategory) {
    pageTitle = activeCategory.name;
    pageDesc = activeCategory.description || '';
  } else if (categoryParam) {
    pageTitle = categoryParam.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    pageDesc = '';
  }

  useEffect(() => {
    document.title = `${pageTitle} | CrystalReadymade`;
  }, [pageTitle]);

  // Breadcrumb parent for child categories
  const parentCategory = activeCategory?.parentId
    ? categories.find((c) => c.id === activeCategory.parentId)
    : null;

  // Active filter count (excluding sort)
  const activeFilterCount = [
    filterOptions.category,
    filterOptions.brand,
    filterOptions.minPrice,
    filterOptions.maxPrice,
    filterOptions.rating,
    filterOptions.search,
  ].filter(Boolean).length;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterOptions({
      ...filterOptions,
      sortBy: value === '' ? undefined : (value as any),
    });
  };

  return (
    <div className="page">
      <div className="section">
        <div className="container mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted mb-4">
            <Link to="/" className="hover:text-brand transition-colors">Home</Link>
            <span>/</span>
            {parentCategory && (
              <>
                <Link
                  to={`/category/${parentCategory.slug}`}
                  className="hover:text-brand transition-colors"
                >
                  {parentCategory.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-text font-medium">{pageTitle}</span>
          </nav>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="h1 mb-1">{pageTitle}</h1>
            {pageDesc && <p className="text-muted">{pageDesc}</p>}
          </div>

          {/* Top bar: result count + sort + mobile filter trigger */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-line">
            <p className="text-sm text-muted">
              {loading ? (
                <span className="inline-block w-24 h-4 bg-surface-muted rounded animate-pulse" />
              ) : (
                <>
                  <span className="font-semibold text-text">{filteredProducts.length}</span>
                  {' '}product{filteredProducts.length !== 1 ? 's' : ''} found
                </>
              )}
            </p>

            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <button
                className="md:hidden btn btn-secondary py-2 px-4 text-sm flex items-center gap-1.5"
                onClick={() => setShowMobileSidebar(true)}
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-brand text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort select */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-muted whitespace-nowrap">Sort by</span>
                <div className="relative">
                  <select
                    value={filterOptions.sortBy || ''}
                    onChange={handleSortChange}
                    className="select text-sm pr-8 py-2 appearance-none cursor-pointer"
                  >
                    <option value="">Featured</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                </div>
              </div>

              {/* Clear filters chip (desktop) */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="hidden md:flex items-center gap-1 text-sm text-brand hover:text-brand-strong transition-colors"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Layout: sidebar + grid */}
          <div className="flex gap-8">

            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <ProductFilter
                categories={categories}
                brands={brands}
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                clearFilters={clearFilters}
              />
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              <ProductGrid
                products={filteredProducts}
                loading={loading}
                emptyMessage="No products match your filters. Try adjusting or clearing your filters."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowMobileSidebar(false)}
          />
          {/* Drawer */}
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-surface shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-line">
              <h2 className="font-semibold text-text">Filters</h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-1 rounded-lg text-muted hover:text-text hover:bg-surface-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <ProductFilter
                categories={categories}
                brands={brands}
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                clearFilters={clearFilters}
              />
            </div>
            <div className="p-4 border-t border-line flex gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { clearFilters(); setShowMobileSidebar(false); }}
                  className="btn btn-secondary flex-1"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="btn btn-primary flex-1"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
