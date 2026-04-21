import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Clock,
  Heart,
  LifeBuoy,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

function useCounter(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function IconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="w-11 h-11 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
      {children}
    </div>
  );
}

function StatCard({
  icon,
  target,
  suffix,
  label,
  inView,
}: {
  icon: ReactNode;
  target: number;
  suffix: string;
  label: string;
  inView: boolean;
}) {
  const count = useCounter(target, 1600, inView);

  return (
    <div className="card card-hover p-5 sm:p-6 text-center">
      <div className="mx-auto mb-3 w-11 h-11 rounded-full bg-brand/10 text-brand flex items-center justify-center">
        {icon}
      </div>
      <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-text">
        {count}
        {suffix}
      </p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  );
}

export const OurStory = () => {
  const { hash } = useLocation();
  const { ref: statsRef, inView: statsInView } = useInView();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace('#', '');
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  const milestones = [
    {
      year: '1998',
      title: 'First Store',
      desc: 'Crystal opened in Aurangabad with a clear focus on dependable children wear.',
    },
    {
      year: '2005',
      title: 'Uniforms',
      desc: 'School uniforms became a core part of the store, serving families through every academic year.',
    },
    {
      year: '2015',
      title: 'More Choice',
      desc: 'The collection expanded across everyday wear, festive pieces, and teen styles.',
    },
    {
      year: '2024',
      title: 'Online Store',
      desc: 'Crystalreadymades.com brought the same trusted shopping experience online.',
    },
  ];

  const values = [
    {
      Icon: ShieldCheck,
      title: 'Reliable Quality',
      desc: 'Comfortable fabrics, careful finishing, and pieces made for regular use.',
    },
    {
      Icon: Heart,
      title: 'Family Trust',
      desc: 'Built through consistent service and honest recommendations over many years.',
    },
    {
      Icon: Sparkles,
      title: 'Everyday Style',
      desc: 'Simple, modern clothing that feels easy to wear and easy to choose.',
    },
    {
      Icon: Star,
      title: 'One Stop Store',
      desc: 'Everyday outfits, occasion wear, and school uniforms in one familiar place.',
    },
  ];

  return (
    <div className="page">
      <section className="section-hero section-muted border-b border-line overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <p className="caption text-brand mb-4">Our Story</p>
              <h1 className="h1 mb-6">
                Dressing Generations <span className="text-brand">Since 1998</span>
              </h1>
              <p className="text-muted text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
                From a trusted local store in Chhatrapati Sambhajinagar to an online destination for families, Crystal has grown with one simple promise: clothing that feels comfortable, lasts well, and looks timeless.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/products" className="btn btn-primary gap-2">
                  Shop Collection <ArrowRight size={16} />
                </Link>
                <a href="#contact" className="btn btn-secondary gap-2">
                  Visit Showroom <MapPin size={16} />
                </a>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=900"
                alt="Readymade garments arranged in a clothing store"
                className="w-full aspect-[4/3] object-cover rounded-2xl shadow-soft border border-line"
              />
              <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 card px-4 py-3">
                <p className="text-2xl font-semibold text-brand leading-none">25+</p>
                <p className="text-xs text-muted mt-1">Years of trust</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-b border-line" ref={statsRef}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard icon={<Clock size={21} />} target={26} suffix="+" label="Years of Legacy" inView={statsInView} />
            <StatCard icon={<Users size={21} />} target={50} suffix="K+" label="Happy Families" inView={statsInView} />
            <StatCard icon={<Award size={21} />} target={200} suffix="+" label="Styles & Designs" inView={statsInView} />
            <StatCard icon={<Heart size={21} />} target={98} suffix="%" label="Customer Satisfaction" inView={statsInView} />
          </div>
        </div>
      </section>

      <section className="section border-b border-line">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&q=80&w=900"
                alt="Clothing detail and tailoring"
                className="w-full aspect-[4/3] object-cover rounded-2xl shadow-soft border border-line"
              />
            </div>

            <div className="order-1 lg:order-2">
              <p className="caption text-brand mb-4">About Us</p>
              <h2 className="h2 mb-6">Where Every Stitch Tells a Story</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Crystal began with a practical idea: families should be able to find clothing that looks good, feels comfortable, and holds up through everyday life.
                </p>
                <p>
                  Over the years, our collections have grown across kids wear, teen fashion, festive outfits, and dependable school uniforms, always with a focus on fit, fabric, and finish.
                </p>
                <p>
                  The store has changed with time, but the heart of the work has stayed the same: honest quality, thoughtful selection, and clothing made to be lived in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted border-b border-line">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10 sm:mb-12">
            <p className="caption text-brand mb-3">Our Journey</p>
            <h2 className="h2 mb-3">Milestones That Shaped Us</h2>
            <p className="text-muted max-w-2xl mx-auto">
              A steady journey from a local readymade shop to a trusted clothing destination for families.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {milestones.map((item) => (
              <div key={item.year} className="card card-hover p-6">
                <div className="flex items-center gap-3 mb-5">
                  <IconBadge>
                    <Star size={18} />
                  </IconBadge>
                  <p className="text-xl font-semibold text-brand">{item.year}</p>
                </div>
                <h3 className="h3 mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-b border-line">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10 sm:mb-12">
            <p className="caption text-brand mb-3">What We Stand For</p>
            <h2 className="h2 mb-3">Our Core Values</h2>
            <p className="text-muted max-w-2xl mx-auto">
              The same qualities customers expect from the shop are reflected in every online order too.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ Icon, title, desc }) => (
              <div key={title} className="card card-hover p-6">
                <IconBadge>
                  <Icon size={21} />
                </IconBadge>
                <h3 className="h3 mt-5 mb-2 text-lg">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted border-b border-line">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="caption text-brand mb-4">Crystal Promise</p>
          <h2 className="h2 mb-4">Trusted. Thoughtful. Timeless.</h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Clothing designed for comfort, selected with care, and made to support every school day, celebration, and everyday moment.
          </p>
        </div>
      </section>

      <section id="contact" className="section scroll-mt-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10 sm:mb-12">
            <p className="caption text-brand mb-3">We Are Here For You</p>
            <h2 className="h2 mb-3">Need Assistance?</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Visit our Chhatrapati Sambhajinagar outlet or contact the online support team for order help.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card card-hover p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <IconBadge>
                  <MapPin size={20} />
                </IconBadge>
                <h3 className="h3">Visit Showroom</h3>
              </div>

              <p className="text-muted mb-6">
                Experience the collections in person at our flagship garment district location.
              </p>

              <div className="space-y-3 text-sm text-muted mb-8">
                <div className="flex gap-3 p-4 rounded-2xl bg-surface-muted border border-line">
                  <MapPin size={16} className="shrink-0 mt-1 text-brand" />
                  <span>Aurangapura Rd, Gulmandi, Chhatrapati Sambhajinagar</span>
                </div>
                <div className="flex gap-3 p-4 rounded-2xl bg-surface-muted border border-line">
                  <Clock size={16} className="shrink-0 mt-1 text-brand" />
                  <span>11:00 AM to 09:00 PM, Daily</span>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/Ah2a5u4x49SEpT5v6"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary gap-2 w-full sm:w-auto"
              >
                <MapPin size={16} />
                Get Directions
              </a>
            </div>

            <div className="card card-hover p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <IconBadge>
                  <LifeBuoy size={20} />
                </IconBadge>
                <h3 className="h3">Online Support</h3>
              </div>

              <p className="text-muted mb-6">
                Having trouble with an online order or payment? Our support team can help.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-muted border border-line">
                  <Mail size={17} className="text-brand shrink-0" />
                  <div>
                    <p className="caption text-muted">Email Support</p>
                    <p className="text-sm font-semibold text-text break-all">support@crystalreadymade.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-muted border border-line">
                  <MessageCircle size={17} className="text-brand shrink-0" />
                  <div>
                    <p className="caption text-muted">Chat With Us</p>
                    <p className="text-sm font-semibold text-text">Available on WhatsApp & Web</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-primary gap-2 w-full sm:w-auto"
              >
                Contact Support
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
