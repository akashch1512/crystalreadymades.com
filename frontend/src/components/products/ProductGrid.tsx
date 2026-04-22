import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../types';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  emptyMessage = 'No products found',
}) => {
  // Loading skeleton — horizontal card shape
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex bg-surface border border-line rounded-2xl overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[220px] bg-surface-muted" style={{ minHeight: 200 }} />
            {/* Text skeleton */}
            <div className="flex-1 p-5 space-y-3">
              <div className="h-3 bg-surface-muted rounded w-1/4" />
              <div className="h-5 bg-surface-muted rounded w-3/4" />
              <div className="h-3 bg-surface-muted rounded w-1/2" />
              <div className="h-3 bg-surface-muted rounded w-2/3" />
              <div className="mt-auto pt-4 flex gap-3">
                <div className="h-8 bg-surface-muted rounded-full w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-surface-muted rounded-2xl border border-line text-center">
        <PackageSearch size={48} className="text-muted mb-4" />
        <h3 className="text-lg font-semibold text-text mb-1">No products found</h3>
        <p className="text-muted text-sm max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} layout="list" />
      ))}
    </div>
  );
};

export default ProductGrid;
