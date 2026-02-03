import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HelpCircle, Truck, RefreshCcw, CreditCard, ChevronDown, Sparkles, MessageCircle } from 'lucide-react';

/**
 * CrystalReadymade - FAQ Page
 * 100% Aesthetic Match: White & Pink theme, Modern Retail Layout
 */
export const FAQ = () => {
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

  const faqCategories = [
    {
      id: "shipping",
      icon: <Truck size={24} />,
      title: "Shipping & Delivery",
      questions: [
        { q: "How long does delivery take in Chhatrapati Sambhajinagar?", a: "For local orders, we typically deliver within 24-48 hours. Professional uniforms may take longer depending on tailoring requirements." },
        { q: "Do you ship across India?", a: "Yes, we ship our luxury readymade collections pan-India via our trusted courier partners." }
      ]
    },
    {
      id: "orders",
      icon: <CreditCard size={24} />,
      title: "Payments & Orders",
      questions: [
        { q: "What payment methods do you accept?", a: "We accept all major Credit/Debit cards, UPI, and Net Banking. For in-store purchases at Aurangapura, we also accept cash." },
        { q: "Can I modify my order after placing it?", a: "Standard readymade orders can be modified within 2 hours. Custom-tailored uniforms cannot be modified once the cutting process begins." }
      ]
    },
    {
      id: "returns",
      icon: <RefreshCcw size={24} />,
      title: "Returns & Exchanges",
      questions: [
        { q: "What is your return policy for e-commerce orders?", a: "We offer a 3-day return window for readymade garments if the tags are intact. Refunds are processed as store credit." },
        { q: "Are custom uniforms returnable?", a: "Custom uniforms are non-returnable as they are made to your specific measurements, but we offer free alterations for 7 days." }
      ]
    }
  ];

  return (
    <div className="page">
      
      {/* Hero Section */}
      <section className="section-hero section-muted border-b border-line">
        <div className="container mx-auto max-w-7xl">
          <div>
            <p className="caption text-brand mb-4">
              Help & Support
            </p>
            <h1 className="h1 mb-6">
              Frequently Asked <span className="text-brand">Questions</span>
            </h1>
            <p className="text-muted text-lg max-w-3xl">
              Find answers to common questions about shipping, payments, returns, and more. Can't find what you're looking for? Our support team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="section">
        <div className="container mx-auto max-w-7xl">
        <div className="grid gap-16">
          {faqCategories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand/10 rounded-2xl text-brand">
                  {category.icon}
                </div>
                <h2 className="h2">
                  {category.title}
                </h2>
              </div>

              <div className="space-y-3">
                {category.questions.map((faq, idx) => (
                  <details key={idx} className="group card rounded-2xl hover:border-brand/40 hover:shadow-soft transition-all">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                      <h3 className="text-lg font-semibold text-text pr-4">{faq.q}</h3>
                      <div className="text-brand group-open:rotate-180 transition-transform shrink-0">
                        <ChevronDown size={20} />
                      </div>
                    </summary>
                    <div className="px-5 pb-5 text-muted leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-20 border-t border-line pt-16">
          <div className="bg-surface-muted rounded-2xl p-12 text-center border border-brand/20">
            <div className="flex justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-brand" />
            </div>
            
            <h3 className="h3 mb-4">Still have questions?</h3>
            <p className="text-muted mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Reach out to our support team. We're here to help!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/aboutus#contact" className="btn btn-primary text-center">
                Contact Support
              </Link>
              <a href="mailto:support@crystalreadymade.com" className="btn btn-secondary text-center">
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
