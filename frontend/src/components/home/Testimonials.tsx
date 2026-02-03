import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Emily Johnson',
    role: 'Fashion Blogger',
    content: 'CrystalReadymade\'s jewelry collection is absolutely stunning. The quality and craftsmanship of each piece is evident. I\'ve received countless compliments on my crystal pendant necklace!',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 2,
    name: 'Michael Roberts',
    role: 'Interior Designer',
    content: 'As an interior designer, I\'m always looking for unique pieces to elevate my clients\' homes. The crystal chandelier I purchased is not only a functional light fixture but also a stunning piece of art that transforms the space.',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 3,
    name: 'Sophia Martinez',
    role: 'Event Planner',
    content: 'I wore the crystal embellished evening dress to a gala I was hosting, and it was perfect. The fit was impeccable, and the crystal details caught the light beautifully. I felt absolutely elegant and received many compliments throughout the night.',
    image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="section section-muted">
      <div className="container mx-auto">
        <h2 className="h2 text-center mb-2">What Our Customers Say</h2>
        <p className="text-muted text-center mb-12">Hear from our satisfied customers</p>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="card p-8 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/3 mb-6 md:mb-0 md:mr-8">
                      <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-brand/20">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3 text-center md:text-left">
                      <div className="text-brand text-4xl font-serif leading-tight mb-4">"</div>
                      <p className="text-muted mb-6">{testimonial.content}</p>
                      <div>
                        <h3 className="font-semibold text-text">{testimonial.name}</h3>
                        <p className="text-muted">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 bg-surface rounded-full shadow-soft p-2 hover:bg-surface-muted transition-colors border border-line"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} className="text-muted" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 bg-surface rounded-full shadow-soft p-2 hover:bg-surface-muted transition-colors border border-line"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} className="text-muted" />
          </button>
          
          {/* Dots */}
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 mx-1 rounded-full transition-all ${
                  index === activeIndex 
                    ? 'bg-brand scale-110' 
                    : 'bg-line hover:bg-accent'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
