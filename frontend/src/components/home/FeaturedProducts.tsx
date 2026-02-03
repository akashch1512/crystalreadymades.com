import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import { getProducts } from '../../data/mockData';
import { Product } from '../../types';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="container mx-auto text-center">
          <p className="text-muted">Loading featured products...</p>
        </div>
      </section>
    );
  }

  // Get products with the highest ratings
  const featuredProducts = [...products]
    .sort((a, b) => b.ratings - a.ratings)
    .slice(0, 4);

  return (
    <section className="section">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h2 className="h2 mb-2">Featured Products</h2>
            <p className="text-muted">Our most popular products based on sales</p>
          </div>
          <Link
            to="/products"
            className="flex items-center text-brand hover:text-brand-strong transition-colors mt-4 md:mt-0 text-sm font-medium"
          >
            View All Products
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
