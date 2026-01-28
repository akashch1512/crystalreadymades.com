import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, FileText, RefreshCcw, CheckCircle2 } from 'lucide-react';

/**
 * CrystalReadymade - Terms & Policies Page
 * Fixed: Added automatic scroll-to-location hook
 */
export const TermsAndPolicies = () => {
  const { hash } = useLocation();

  // This hook detects the #hash in the URL and scrolls the user to the right section
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
      <section className="relative bg-gradient-to-r from-pink-50 to-white py-20 px-4 border-b border-gray-100">
        <div className="container mx-auto max-w-7xl">
          <div>
            <p className="text-pink-600 font-semibold uppercase tracking-wider text-sm mb-4">
              Legal & Compliance
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Our <span className="text-pink-600">Policies</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl">
              At CrystalReadymade, we value your trust and transparency. These policies ensure a seamless and fair experience for all our customers.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Shortcuts */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4">
        <div className="container mx-auto max-w-7xl px-4 flex justify-center gap-6 md:gap-12 overflow-x-auto">
          {['Terms', 'Privacy', 'Refund'].map((tab) => (
            <a 
              key={tab}
              href={`#${tab.toLowerCase()}`}
              className="text-sm font-semibold text-gray-600 hover:text-pink-600 transition-colors whitespace-nowrap"
            >
              {tab}
            </a>
          ))}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-20">
        
        {/* --- SECTION 1: TERMS OF SERVICE --- */}
        <section id="terms" className="scroll-mt-24 mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-pink-100 rounded-lg text-pink-600">
              <FileText size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Terms of Service</h2>
          </div>
          
          <div className="space-y-6 text-gray-600">
            <p className="text-lg">
              Welcome to CrystalReadymade. By accessing our showroom or using our services, you agree to the following terms:
            </p>
            <ul className="space-y-4">
              {[
                "All custom uniform orders require a 50% advance payment to initiate production.",
                "Measurements provided by the customer for ready-made garments are the responsibility of the buyer.",
                "Quotations for bulk corporate orders are valid for 30 days from the date of issuance.",
                "CrystalReadymade reserves the right to adjust pricing based on fabric market fluctuations."
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-pink-200 transition-colors">
                  <CheckCircle2 size={20} className="text-pink-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --- SECTION 2: PRIVACY POLICY --- */}
        <section id="privacy" className="scroll-mt-24 mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-pink-100 rounded-lg text-pink-600">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Privacy Policy</h2>
          </div>
          
          <div className="space-y-6 text-gray-600">
            <p className="text-lg">
              Your data is as important to us as the quality of our products. We collect only what's necessary to serve you better:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-100 rounded-lg bg-gray-50 hover:border-pink-200 transition-colors">
                <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                  What we collect
                </h4>
                <p className="text-gray-600">Name, contact details, and sizing measurements for order fulfillment and tailoring accuracy.</p>
              </div>
              <div className="p-6 border border-gray-100 rounded-lg bg-gray-50 hover:border-pink-200 transition-colors">
                <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                  How we use it
                </h4>
                <p className="text-gray-600">To process orders, send delivery updates, and inform you about seasonal collections.</p>
              </div>
            </div>
            
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Your Privacy is Sacred:</span> We never share your personal information with third-party marketing agencies. All data is stored securely and locally.
              </p>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: REFUND POLICY --- */}
        <section id="refund" className="scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-pink-100 rounded-lg text-pink-600">
              <RefreshCcw size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Refund & Return Policy</h2>
          </div>
          
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-8">Our Commitment to Your Satisfaction</h3>
            <div className="space-y-6">
              <div className="flex gap-4 items-start bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center shrink-0 font-bold">1</div>
                <div>
                  <p className="font-semibold text-white mb-1">Custom Uniforms</p>
                  <p className="text-pink-50">As these are custom-tailored, we do not offer refunds once production starts. We provide free alterations for 7 days post-delivery.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center shrink-0 font-bold">2</div>
                <div>
                  <p className="font-semibold text-white mb-1">Ready-made Garments</p>
                  <p className="text-pink-50">Returns accepted within 3 days if tags are intact and garments are unworn. Refund will be processed as store credit.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center shrink-0 font-bold">3</div>
                <div>
                  <p className="font-semibold text-white mb-1">Manufacturing Defects</p>
                  <p className="text-pink-50">Any defect reported within 24 hours of purchase is eligible for immediate replacement or full refund.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-20 border-t border-gray-100 pt-16 text-center">
          <p className="text-gray-600 text-lg font-medium mb-6">Still have questions about our policies?</p>
          <button className="bg-pink-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};