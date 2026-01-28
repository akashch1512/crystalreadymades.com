import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Award, Sparkles, MapPin, Truck, Heart, ArrowRight, LifeBuoy, Mail, MessageCircle } from 'lucide-react';

/**
 * CrystalReadymade - About Us Page
 * Refined Split Section: Showroom Presence & E-commerce Support
 */
export const AboutUs = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-50 to-white py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-pink-600 font-semibold uppercase tracking-wider text-sm mb-4">
                About CrystalReadymade
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Quality Garments You Can <span className="text-pink-600">Trust</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                From the heart of Chhatrapati Sambhajinagar, we bring you premium quality uniforms and ready-made garments crafted with precision and care.
              </p>
              <button className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center gap-2">
                Explore Our Story <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=500" 
                alt="Quality garments" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 border-b border-gray-100">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=500" 
                alt="Our team" 
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Crafting Excellence Since 2008</h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  CrystalReadymade isn't just a store—it's a commitment to quality. Based in Aurangapura, Chhatrapati Sambhajinagar, we've spent years perfecting the art of precision tailoring and ready-made excellence.
                </p>
                <p>
                  Our expertise spans two worlds: precision-engineered uniforms for schools and corporate institutions, and curated luxury ready-made garments for life's special moments.
                </p>
                <p>
                  Every piece is designed to last, crafted with attention to detail that reflects our dedication to customer satisfaction.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-10">
                <div className="bg-pink-50 p-6 rounded-lg">
                  <p className="text-3xl font-bold text-pink-600">15+</p>
                  <p className="text-gray-600 font-medium mt-2">Years of Experience</p>
                </div>
                <div className="bg-pink-50 p-6 rounded-lg">
                  <p className="text-3xl font-bold text-pink-600">10k+</p>
                  <p className="text-gray-600 font-medium mt-2">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Every decision we make is guided by our commitment to quality, integrity, and customer satisfaction.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-12 h-12" />,
                title: "Premium Quality",
                desc: "Superior fabrics and precision stitching ensure durability and comfort in every garment."
              },
              {
                icon: <Sparkles className="w-12 h-12" />,
                title: "Modern Designs",
                desc: "Contemporary styles that blend traditional excellence with modern fashion trends."
              },
              {
                icon: <Truck className="w-12 h-12" />,
                title: "Fast Delivery",
                desc: "Quick and reliable service to get your perfect outfit to you on time."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="text-pink-600 mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showroom & Support Section */}
      <section id="contact" className="py-20 px-4 scroll-mt-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Need Assistance?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Visit us in person at our Chhatrapati Sambhajinagar outlet or reach out to our online support team for e-commerce help.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Showroom Half */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-block p-3 bg-pink-100 rounded-full mb-6 text-pink-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight italic uppercase">Visit Showroom</h3>
              <p className="text-gray-600 mb-6">Experience our collections in person at our flagship garment district location.</p>
              
              <div className="space-y-4 mb-8 text-gray-700">
                <p className="flex gap-3">
                  <span className="font-bold shrink-0">Address:</span> 
                  Aurangapura Rd, Gulmandi, Chhatrapati Sambhajinagar
                </p>
                <p className="flex gap-3">
                  <span className="font-bold shrink-0">Hours:</span> 
                  10:00 AM - 9:00 PM, Daily
                </p>
              </div>
              
              <a 
                href="https://maps.google.com" 
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-lg font-bold hover:bg-pink-50 transition-colors gap-2"
              >
                <MapPin size={18} /> Get Directions
              </a>
            </div>

            {/* Support Half */}
            <div className="bg-pink-600 p-8 md:p-10 rounded-2xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
              <div className="inline-block p-3 bg-white/20 rounded-full mb-6">
                <LifeBuoy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight italic uppercase">Online Support</h3>
              <p className="text-pink-50 mb-8">Having trouble with an online order or payment? Our support team is here to help you 24/7.</p>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-lg"><Mail size={20} /></div>
                  <div className="text-sm">
                    <p className="uppercase tracking-widest text-pink-200 font-bold text-[10px]">Email Support</p>
                    <p className="font-semibold">support@crystalreadymade.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-lg"><MessageCircle size={20} /></div>
                  <div className="text-sm">
                    <p className="uppercase tracking-widest text-pink-200 font-bold text-[10px]">Chat with Us</p>
                    <p className="font-semibold">Available on WhatsApp & Web</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-white text-pink-600 px-8 py-3 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-pink-50 transition-all shadow-lg active:scale-95">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose CrystalReadymade?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Handpicked premium quality fabrics from trusted suppliers",
              "Expert tailoring for perfect fit and comfort",
              "Wide range of styles for every occasion",
              "Competitive pricing without compromising quality",
              "Dedicated customer support and after-sales service",
              "Fast turnaround time for custom orders"
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart size={16} className="text-white" />
                </div>
                <p className="text-gray-700 text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};