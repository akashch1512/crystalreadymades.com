import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCategories from '../components/home/FeaturedCategories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BrandStory from '../components/home/BrandStory';
// import Testimonials from '../components/home/Testimonials';
// import Newsletter from '../components/home/Newsletter';

const SectionDivider: React.FC = () => (
  <div className="relative -mb-px overflow-hidden leading-none" style={{ background: 'var(--bg)' }}>
    <svg
      viewBox="0 0 1440 64"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="block w-full"
      style={{ height: '56px' }}
    >
      <path
        d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z"
        fill="var(--surface-muted)"
      />
      <path
        d="M0,40 C240,72 480,8 720,40 C960,72 1200,8 1440,40 L1440,64 L0,64 Z"
        fill="var(--surface-muted)"
        opacity="0.5"
      />
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