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
      <section className="section section-muted">
        <div className="container mx-auto text-center">
          <p className="text-muted">Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section section-muted">
      <div className="container mx-auto">
        <h2 className="h2 text-center mb-2">Shop by Category</h2>
        <p className="text-muted text-center mb-8">Explore our range of crystal-enhanced products</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-6">
          {categories
            .filter((category) => !category.parentId)
            .map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group relative block h-70 rounded-2xl overflow-hidden card card-hover flex-grow basis-full sm:basis-[calc(50%-1.5rem)] lg:basis-[calc(25%-1.5rem)] min-w-[280px]"
              >
              <div className="absolute inset-0 bg-gradient-to-t from-text/70 via-text/30 to-transparent z-10 transition-all duration-300 group-hover:from-text/80"></div>
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                <h3 className="text-white text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-white/80 text-sm mb-3 line-clamp-2">{category.description}</p>
                <span className="btn btn-primary w-fit text-xs md:text-sm px-4 py-2 md:px-6 md:py-3">
                  Shop Now
                </span>
                
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
