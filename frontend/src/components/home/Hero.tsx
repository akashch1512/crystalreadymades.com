import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch hero slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/hero-slides');
        const data = await response.json();
        setSlides(data);
      } catch (error) {
        console.error('Failed to fetch hero slides:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSlides();
  }, []);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);
  
  if (loading || slides.length === 0) {
    return <section className="relative h-[70vh] min-h-[500px] bg-gray-900"></section>;
  }
  
  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4 md:px-10">
              <div className="max-w-lg">
                <p className="text-pink-400 text-sm md:text-base uppercase tracking-wider mb-2 transform translate-y-4 opacity-0 animate-fade-in"
                   style={{ animationDelay: '0.2s' }}>
                  {slide.subtitle}
                </p>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 transform translate-y-4 opacity-0 animate-fade-in"
                   style={{ animationDelay: '0.4s' }}>
                  {slide.title}
                </h1>
                <p className="text-white/80 mb-6 transform translate-y-4 opacity-0 animate-fade-in"
                   style={{ animationDelay: '0.6s' }}>
                  {slide.description}
                </p>
                <Link
                  to={slide.buttonLink}
                  className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-md transition-colors transform translate-y-4 opacity-0 animate-fade-in"
                  style={{ animationDelay: '0.8s' }}
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="text-white" />
      </button>
      
      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-110' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;