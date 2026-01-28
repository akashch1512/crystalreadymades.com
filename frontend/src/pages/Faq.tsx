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
    <div className="bg-white text-gray-900 font-sans">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-50 to-white py-20 px-4 border-b border-gray-100">
        <div className="container mx-auto max-w-7xl">
          <div>
            <p className="text-pink-600 font-semibold uppercase tracking-wider text-sm mb-4">
              Help & Support
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Frequently Asked <span className="text-pink-600">Questions</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl">
              Find answers to common questions about shipping, payments, returns, and more. Can't find what you're looking for? Our support team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="container mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-16">
          {faqCategories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-pink-100 rounded-lg text-pink-600">
                  {category.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {category.title}
                </h2>
              </div>

              <div className="space-y-3">
                {category.questions.map((faq, idx) => (
                  <details key={idx} className="group border border-gray-100 rounded-lg bg-white hover:border-pink-200 hover:shadow-md transition-all">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                      <h3 className="text-lg font-semibold text-gray-800 pr-4">{faq.q}</h3>
                      <div className="text-pink-600 group-open:rotate-180 transition-transform shrink-0">
                        <ChevronDown size={20} />
                      </div>
                    </summary>
                    <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-20 border-t border-gray-100 pt-16">
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-12 text-center border border-pink-200">
            <div className="flex justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-pink-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Reach out to our support team. We're here to help!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/aboutus#contact" className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors text-center">
                Contact Support
              </Link>
              <a href="mailto:support@crystalreadymade.com" className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-colors text-center">
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};