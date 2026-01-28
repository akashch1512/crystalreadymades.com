import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../data/mockData';
import { Category } from '../../types';

const FeaturedCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    };
    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Shop by Category</h2>
        <p className="text-gray-600 text-center mb-8">Explore our range of crystal-enhanced products</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group relative block h-70 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg flex-grow basis-full sm:basis-[calc(50%-1.5rem)] lg:basis-[calc(25%-1.5rem)] min-w-[280px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10 transition-all duration-300 group-hover:from-black/80"></div>
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                <h3 className="text-white text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-white/80 text-sm mb-3 line-clamp-2">{category.description}</p>
                
                {/* ----- BUTTON CHANGES HERE ----- */}
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  // Changed:
                  // 1. Added 'text-sm' for mobile, 'md:text-base' for desktop
                  // 2. Reduced mobile padding to 'px-4 py-2'
                  // 3. Moved original padding 'px-6 py-3' behind an 'md:' breakpoint
                  className="inline-block bg-pink-600 text-white text-sm px-4 py-2 md:text-base md:px-6 md:py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                >
                  Shop Now
                </Link>
                {/* ------------------------------- */}
                
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;