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
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Loading featured products...</p>
        </div>
      </section>
    );
  }

  // Get products with the highest ratings
  const featuredProducts = [...products]
    .sort((a, b) => b.ratings - a.ratings)
    .slice(0, 4);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-gray-600">Our most popular products based on sales</p>
          </div>
          <Link
            to="/products"
            className="flex items-center text-pink-600 hover:text-pink-800 transition-colors mt-4 md:mt-0"
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