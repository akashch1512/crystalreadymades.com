import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RefreshCcw, Phone, Mail } from 'lucide-react';

export const RefundPolicy = () => {
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
      
      {/* Hero Section */}
      <section className="section-hero section-muted border-b border-line">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-start gap-4">
            <RefreshCcw className="text-brand flex-shrink-0 mt-1" size={32} />
            <div>
              <p className="caption text-brand mb-4">Refund & Replacement Policy</p>
              <h1 className="h1 mb-6">
                Refund &amp; <span className="text-brand">Replacement Policy for CrystalReadymade</span>
              </h1>
              <p className="text-muted text-lg max-w-3xl">
                We stand by the quality of our products and are committed to customer satisfaction through our transparent and fair refund and replacement policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section">
        <div className="container mx-auto max-w-4xl space-y-8">
          
          {/* All Sales Final */}
          <div id="sales-final" className="bg-surface-muted p-8 rounded-2xl border border-line">
            <h2 className="h2 mb-4 text-text">All Sales Are Final</h2>
            <p className="text-muted text-lg leading-relaxed">
              Because every product is printed specifically for you when you order (Print-on-Demand), we cannot accept returns or exchanges for issues related to sizing, color preference, or "change of mind." <span className="font-semibold text-text">Please review the Size Chart carefully before placing your order.</span>
            </p>
          </div>

          {/* Defects & Damaged Items */}
          <div id="defects" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Defects &amp; Damaged Items</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed">
              We stand by the quality of our products. If you receive a defective, damaged, or incorrect item, we will provide a <span className="font-semibold text-text">Free Replacement</span>.
            </p>

            <h3 className="h3 mb-6 text-text">How to Claim a Replacement:</h3>
            <div className="space-y-4 mb-6">
              <div className="flex gap-4 items-start bg-surface p-4 rounded-lg">
                <div className="text-brand font-bold text-lg min-w-fit">Step 1:</div>
                <div>
                  <p className="text-text font-semibold mb-1">Contact Within 24 Hours</p>
                  <p className="text-muted">You must contact us within <span className="font-semibold">24 hours of delivery</span>.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-surface p-4 rounded-lg">
                <div className="text-brand font-bold text-lg min-w-fit">Step 2:</div>
                <div>
                  <p className="text-text font-semibold mb-1">Email Documentation</p>
                  <p className="text-muted">Email us at <a href="mailto:support@crystalreadymade.com" className="text-brand hover:underline">support@crystalreadymade.com</a> with:</p>
                  <ul className="list-disc list-inside text-muted mt-2 ml-2">
                    <li>Your Order ID</li>
                    <li>Clear photos/videos showing the defect or damage</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-surface p-4 rounded-lg">
                <div className="text-brand font-bold text-lg min-w-fit">Step 3:</div>
                <div>
                  <p className="text-text font-semibold mb-1">Immediate Replacement</p>
                  <p className="text-muted">Once verified, we will dispatch a brand-new replacement to you immediately. <span className="font-semibold">No need to ship the damaged item back.</span></p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-surface p-4 rounded-lg">
                <div className="text-brand font-bold text-lg min-w-fit">Step 4:</div>
                <div>
                  <p className="text-text font-semibold mb-1">Fast Delivery</p>
                  <p className="text-muted">All approved exchanges and replacements of damaged products will be delivered within <span className="font-semibold">7 business days.</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellations */}
          <div id="cancellations" className="bg-surface border-l-4 border-brand p-8 rounded-lg">
            <h2 className="h2 mb-4 text-text">Order Cancellations</h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              <span className="font-semibold text-text">Orders can only be cancelled within 4 hours of placement.</span> After that, the order moves to production and cannot be stopped. <span className="font-semibold text-text">There is no return, no refund</span> once production has begun.
            </p>
            <div className="bg-surface-muted p-4 rounded-lg border border-line">
              <p className="text-muted text-sm"><span className="font-semibold text-text">Important:</span> Once your order enters the production phase, cancellation requests cannot be honored as the manufacturing process has already commenced.</p>
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="bg-brand/10 border border-brand/30 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Questions or Concerns?</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              For any questions or to initiate a replacement claim, please contact us using the information below:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface p-6 rounded-lg border border-line">
                <Mail className="text-brand mb-3" size={28} />
                <h3 className="h4 text-text mb-2">Email</h3>
                <a href="mailto:support@crystalreadymade.com" className="text-brand hover:text-brand-dark transition-colors font-medium break-all">
                  support@crystalreadymade.com
                </a>
              </div>
              <div className="bg-surface p-6 rounded-lg border border-line">
                <Phone className="text-brand mb-3" size={28} />
                <h3 className="h4 text-text mb-2">Phone</h3>
                <a href="tel:+919876543210" className="text-brand hover:text-brand-dark transition-colors font-medium">
                  +91 9876543210
                </a>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center text-sm text-muted border-t border-line pt-8">
            <p><span className="font-semibold text-text">Last Updated:</span> February 2026</p>
            <p className="mt-2">This policy is in effect for all orders placed on CrystalReadymade</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
