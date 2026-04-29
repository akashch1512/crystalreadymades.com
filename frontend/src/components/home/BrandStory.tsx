import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const BrandStory: React.FC = () => (
  <section className="section section-muted">
    <div className="container mx-auto">
      <div className="card overflow-hidden p-6 shadow-soft sm:p-8 lg:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <div className="max-w-3xl">
            <span className="caption mb-4 block font-semibold text-brand">
              Brand Story
            </span>
            <h2 className="h2 mb-4 max-w-2xl">
              A story of comfort, quality, and childhood memories.
            </h2>
            <p className="mb-4 text-sm leading-7 text-muted sm:text-base">
              Since 1998, Crystal has been part of everyday family life. Our journey began with a simple belief - that children deserve clothing that is comfortable, durable, and thoughtfully made.
            </p>
            <p className="mb-4 text-sm leading-7 text-muted sm:text-base">
              Over the years, we&apos;ve grown alongside generations of young learners and dreamers. From school uniforms worn with pride to outfits made for celebrations and everyday adventures, Crystal continues to design clothing that supports every stage of growing up.
            </p>
            <p className="mb-6 text-sm leading-7 text-muted sm:text-base">
              More than just garments, we create pieces that become part of childhood memories.
            </p>
            <Link
              to="/our-story"
              className="btn btn-secondary border-brand text-brand hover:border-brand hover:bg-brand/5"
            >
              Read Our Story
              <ChevronRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="card grid gap-5 bg-surface-muted/60 p-4 shadow-none sm:grid-cols-[0.9fr_1.1fr] sm:items-center sm:p-5 lg:grid-cols-1 lg:p-6 xl:grid-cols-[0.88fr_1.12fr]">
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
              <img
                src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&q=80&w=700"
                alt="Children's clothing neatly arranged"
                className="h-48 w-full object-cover sm:h-56 lg:h-64 xl:h-full"
              />
            </div>
            <div className="px-1 pb-1 sm:px-0 sm:py-2">
              <p className="caption mb-4 font-semibold text-brand">Discover the journey</p>
              <h3 className="h3 mb-4 max-w-md">
                Designed for growing kids and proud families.
              </h3>
              <p className="text-sm leading-7 text-muted sm:text-base">
                Crystal is built on the promise that every outfit should feel as good as it looks, while lasting through every playground, celebration, and school day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default BrandStory;
