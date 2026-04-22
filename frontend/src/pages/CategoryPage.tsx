import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { ArrowLeft, ShoppingBag, Tag } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { categories } = useProducts();

  // Find the parent category that matches the slug
  const parentCategory = categories.find((c) => c.slug === slug);

  // If categories have loaded but slug doesn't match any parent, redirect home
  if (categories.length > 0 && !parentCategory) {
    return <Navigate to="/" replace />;
  }

  // Get children of this parent
  const childCategories = parentCategory
    ? categories.filter((c) => c.parentId === parentCategory.id)
    : [];

  // Loading state — categories not yet fetched
  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-muted animate-pulse">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Banner */}
      <div className="relative w-full h-[220px] sm:h-[280px] overflow-hidden">
        {parentCategory?.image ? (
          <>
            <img
              src={parentCategory.mobileImage || parentCategory.image}
              alt={parentCategory.name}
              className="w-full h-full object-cover md:hidden object-center"
            />
            <img
              src={parentCategory.image}
              alt={parentCategory.name}
              className="w-full h-full object-cover hidden md:block object-center"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand/20 via-accent/30 to-surface-muted" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back link */}
        <div className="absolute top-5 left-5 z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-colors"
          >
            <ArrowLeft size={15} />
            Home
          </Link>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10">
          <p className="caption text-white/70 mb-1">Category</p>
          <h1 className="h1 text-white">{parentCategory?.name}</h1>
          {parentCategory?.description && (
            <p className="text-white/80 text-sm sm:text-base mt-1 max-w-xl">
              {parentCategory.description}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 sm:py-14">

        {childCategories.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="h2 text-text mb-1">Browse {parentCategory?.name}</h2>
              <p className="text-muted text-sm sm:text-base">
                Choose a category below to explore products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {childCategories.map((child) => (
                <Link
                  key={child.id}
                  to={`/products?category=${encodeURIComponent(child.slug)}`}
                  className="group relative block h-[200px] sm:h-[240px] rounded-2xl overflow-hidden shadow-sm hover:shadow-soft transition-all duration-300 border border-line"
                >
                  {/* Background */}
                  {child.image ? (
                    <img
                      src={child.image}
                      alt={child.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand/10 via-accent/20 to-surface-muted flex items-center justify-center">
                      <Tag size={48} className="text-brand/30" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent transition-opacity duration-300 group-hover:from-black/75" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                    <h3 className="text-white text-xl font-semibold leading-tight mb-1">
                      {child.name}
                    </h3>
                    {child.description && (
                      <p className="text-white/70 text-xs sm:text-sm leading-5 line-clamp-2 mb-3">
                        {child.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-brand px-4 py-1.5 rounded-full w-fit shadow transition-transform duration-200 group-hover:scale-105">
                      <ShoppingBag size={13} />
                      Shop Now
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* View all link */}
            <div className="mt-10 text-center">
              <Link
                to={`/products?category=${encodeURIComponent(parentCategory?.slug || '')}`}
                className="btn btn-secondary"
              >
                View All {parentCategory?.name} Products
              </Link>
            </div>
          </>
        ) : (
          /* No children — go directly to products */
          <div className="text-center py-16">
            <ShoppingBag size={48} className="mx-auto text-brand mb-4" />
            <h2 className="h2 text-text mb-2">No sub-categories found</h2>
            <p className="text-muted mb-6">Browse all products in this category</p>
            <Link
              to={`/products?category=${encodeURIComponent(parentCategory?.slug || '')}`}
              className="btn btn-primary"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
