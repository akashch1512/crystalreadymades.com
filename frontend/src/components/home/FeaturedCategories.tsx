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
      <div className="w-full px-4 md:px-12 mx-auto">
        <h2 className="h2 text-center mb-2">Shop by Category</h2>
        <p className="text-muted text-center mb-8">Explore our range of crystal-enhanced products</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {categories
            .filter((category) => !category.parentId)
            .map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group relative block h-[250px] sm:h-[300px] lg:h-[350px] rounded-2xl overflow-hidden card card-hover w-full"
              >

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 transition-all duration-300 group-hover:from-black/90"></div>
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                <h3 className="text-white text-xl md:text-2xl font-bold mb-2 drop-shadow-md">{category.name}</h3>
                <p className="text-white/90 text-sm md:text-base font-medium mb-4 line-clamp-2 drop-shadow">{category.description}</p>
                <span className="btn btn-primary text-white font-medium w-fit text-xs md:text-sm px-4 py-2 md:px-6 md:py-3 shadow-lg">
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
