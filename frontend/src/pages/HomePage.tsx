import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCategories from '../components/home/FeaturedCategories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BrandStory from '../components/home/BrandStory';
// import Testimonials from '../components/home/Testimonials';
// import Newsletter from '../components/home/Newsletter';

const SectionDivider: React.FC = () => (
  <div className="w-full overflow-hidden leading-none bg-bg -mb-px">
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="block w-full h-[60px] md:h-[100px] text-surface-muted fill-current"
    >
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,152.47,130,222.14,108.7,258.92,97.5,294.61,76.9,321.39,56.44Z"></path>
    </svg>
  </div>
);

const HomePage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'CrystalReadymade - Luxury Crystal Products';
  }, []);

  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <SectionDivider />
      <BrandStory />
      {/* <Testimonials /> */}
      {/* <Newsletter /> */}
    </div>
  );
};

export default HomePage;