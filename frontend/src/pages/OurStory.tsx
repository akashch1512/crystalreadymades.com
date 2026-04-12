import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, LifeBuoy, Mail, MessageCircle, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const OurStory = () => {
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
    <div className="page">
      {/* Brand Story (Homepage Section) */}
      <section className="section-hero section-muted overflow-hidden">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="h1 mb-6">Brand Story</h1>
          <p className="text-muted text-lg max-w-3xl mx-auto leading-relaxed">
            Since 1998, Crystal has been part of everyday family life. Our journey began with a simple belief — that children deserve clothing that is comfortable, durable, and thoughtfully made.
          </p>
          <p className="text-muted text-lg max-w-3xl mx-auto mt-4 leading-relaxed">
            Over the years, we’ve grown alongside generations of young learners and dreamers. From school uniforms worn with pride to outfits made for celebrations and everyday adventures, Crystal continues to design clothing that supports every stage of growing up.
          </p>
          <p className="text-muted text-lg max-w-3xl mx-auto mt-4 leading-relaxed">
            More than just garments, we create pieces that become part of childhood memories.
          </p>
        </div>
      </section>

      {/* About us */}
      <section className="section border-b border-line">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600"
                alt="About Crystal"
                className="rounded-2xl shadow-soft w-full object-cover"
              />
            </div>

            <div>
              <h2 className="h2 mb-6">About us -</h2>
              <div className="space-y-4 text-muted text-lg">
                <p>
                  Founded in 1998, Crystal has been shaping everyday style for the next generation. What began as a commitment to quality clothing has grown into a trusted destination for families seeking comfort, durability, and timeless design.
                </p>
                <p>
                  From kids’ everyday wear to teen fashion and dependable school uniforms, every Crystal piece is crafted with care, precision, and an understanding of how young lives move, learn, and grow.
                </p>
                <p>
                  For over two decades, Crystal has stood for reliability, quality, and effortless style — clothing designed not just to be worn, but to be lived in.
                </p>
                <p>
                  Crystal — dressing generations since 1998.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section section-muted border-b border-line">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="h2 mb-4">Core Values</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card card-hover p-8">
              <h3 className="h3 mb-3 text-xl"> Quality Assurance</h3>
              <p className="text-muted leading-relaxed">Every piece is made with attention to detail, ensuring long-lasting wear and dependable quality.</p>
            </div>
            <div className="card card-hover p-8">
              <h3 className="h3 mb-3 text-xl">Trust & Reliability</h3>
              <p className="text-muted leading-relaxed">Built over years, earned through consistency, and valued by every family we serve.</p>
            </div>
            <div className="card card-hover p-8">
              <h3 className="h3 mb-3 text-xl">Modern designs</h3>
              <p className="text-muted leading-relaxed">Thoughtfully designed with a contemporary touch, blending simplicity, functionality, and timeless appeal.</p>
            </div>
            <div className="card card-hover p-8">
              <h3 className="h3 mb-3 text-xl">All-in-One Destination</h3>
              <p className="text-muted leading-relaxed">From everyday wear to occasion outfits and school uniforms — everything in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Crystal Section */}
      <section className="section border-b border-line">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="h2 mb-8">Why Choose Crystal? Trusted. Thoughtful. Timeless.</h2>
          <div className="inline-block p-8 bg-surface-muted rounded-2xl max-w-2xl mx-auto border border-line shadow-sm">
            <p className="text-muted text-lg leading-relaxed">
              Clothing designed for comfort, crafted for durability, and made to grow with every generation.
            </p>
          </div>
        </div>
      </section>

      {/* Showroom & Support Section (Need Assistance) */}
      <section id="contact" className="section scroll-mt-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="h2 mb-4">Need Assistance?</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Visit us in person at our Chhatrapati Sambhajinagar outlet or reach out to our online support team for e-commerce help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Showroom Half */}
            <div className="card p-8 md:p-10">
              <div className="inline-block p-3 bg-brand/10 rounded-full mb-6 text-brand">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="h3 mb-4 tracking-tight">Visit Showroom</h3>
              <p className="text-muted mb-6">Experience our collections in person at our flagship garment district location.</p>

              <div className="space-y-4 mb-8 text-muted">
                <p className="flex gap-3">
                  <span className="font-bold shrink-0">Address:</span>
                  Aurangapura Rd, Gulmandi, Chhatrapati Sambhajinagar
                </p>
                <p className="flex gap-3">
                  <span className="font-bold shrink-0">Hours:</span>
                  11:00 AM to 09:00 PM, Daily
                </p>
              </div>

              {/* fix this thing  */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary w-full border-2 border-brand"
              >
                <MapPin size={18} /> Get Directions
              </a>
            </div>

            {/* Support Half */}
            <div className="bg-brand p-8 md:p-10 rounded-2xl shadow-soft text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-surface/10 rounded-full" />
              <div className="inline-block p-3 bg-surface/20 rounded-full mb-6">
                <LifeBuoy className="w-6 h-6 text-white" />
              </div>
              <h3 className="h3 mb-4 tracking-tight">Online Support</h3>
              <p className="text-white/80 mb-8">Having trouble with an online order or payment? Our support team is here to help you 24/7.</p>

              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-surface/10 rounded-lg"><Mail size={20} /></div>
                  <div className="text-sm">
                    <p className="uppercase tracking-widest text-white/70 font-bold text-[10px]">Email Support</p>
                    <p className="font-semibold">support@crystalreadymade.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-surface/10 rounded-lg"><MessageCircle size={20} /></div>
                  <div className="text-sm">
                    <p className="uppercase tracking-widest text-white/70 font-bold text-[10px]">Chat with Us</p>
                    <p className="font-semibold">Available on WhatsApp & Web</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn btn-secondary w-full bg-surface text-brand uppercase tracking-widest text-xs hover:bg-surface-muted"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
