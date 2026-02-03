import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RefreshCcw, Phone, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

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
              <p className="caption text-brand mb-4">Refund & Returns Policy</p>
              <h1 className="h1 mb-6">
                Refund &amp; <span className="text-brand">Returns Policy</span>
              </h1>
              <p className="text-muted text-lg max-w-3xl">
                At CrystalReadymade, we strive to ensure your complete satisfaction with every purchase. We offer a hassle-free return process under clear and transparent conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section">
        <div className="container mx-auto max-w-4xl space-y-8">
          
          {/* Last Updated */}
          <div className="p-4 bg-surface-muted rounded-lg border border-line">
            <p className="text-muted text-sm">
              <span className="font-semibold text-text">Last Updated:</span> February 2026
            </p>
          </div>

          {/* Overview */}
          <div id="overview" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-4 text-text">Overview</h2>
            <p className="text-muted text-lg leading-relaxed">
              We strive to ensure your complete satisfaction with every purchase. However, if you are not entirely happy with your order, we offer a hassle-free return process under the following conditions:
            </p>
          </div>

          {/* Section 1: Return Eligibility */}
          <div id="eligibility" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">1. Return Eligibility</h2>
            <div className="space-y-4">
              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-brand" />
                  Timeframe
                </h3>
                <p className="text-muted">Returns are accepted within <span className="font-semibold">7 days from the date of delivery.</span></p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-brand" />
                  Condition
                </h3>
                <p className="text-muted">Items must be <span className="font-semibold">unworn, unwashed, and in their original condition with all tags and packaging intact.</span></p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-brand" />
                  Proof of Purchase
                </h3>
                <p className="text-muted">A <span className="font-semibold">valid order number or receipt</span> is required for all returns.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Quality-Related Returns */}
          <div id="quality" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">2. Quality-Related Returns</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed">
              If you receive a defective, damaged, or incorrect item, you must:
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start p-4 bg-surface-muted rounded-lg">
                <div className="text-brand font-bold text-lg min-w-fit">•</div>
                <div>
                  <p className="text-text font-semibold mb-1">Submit Unboxing Video</p>
                  <p className="text-muted">Submit an <span className="font-semibold">uncut, unboxing video of the product within 48 hours of delivery.</span></p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-surface-muted rounded-lg">
                <div className="text-brand font-bold text-lg min-w-fit">•</div>
                <div>
                  <p className="text-text font-semibold mb-1">Video Requirements</p>
                  <p className="text-muted">The video should <span className="font-semibold">clearly show the product's condition, packaging, and any defects.</span></p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-brand/10 rounded-lg border border-brand/20">
                <AlertCircle className="text-brand flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-text font-semibold mb-1">Important Note</p>
                  <p className="text-muted">Failure to provide this video may result in the return request being <span className="font-semibold">denied.</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Non-Returnable Items */}
          <div id="non-returnable" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">3. Non-Returnable Items</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed">
              The following items <span className="font-semibold">cannot be returned:</span>
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-surface rounded-lg">
                <span className="text-brand font-bold mt-1">✗</span>
                <span className="text-muted">Innerwear, lingerie, or swimwear (for hygiene reasons)</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-surface rounded-lg">
                <span className="text-brand font-bold mt-1">✗</span>
                <span className="text-muted">Accessories or items marked as "Final Sale"</span>
              </div>
            </div>
          </div>

          {/* Section 4: Return Process */}
          <div id="process" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">4. Return Process</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start p-4 bg-surface-muted rounded-lg">
                <div className="text-brand font-bold text-xl min-w-fit w-8 h-8 flex items-center justify-center rounded-full bg-brand/10">1</div>
                <div>
                  <p className="text-text font-semibold mb-1">Contact Support</p>
                  <p className="text-muted">Contact our customer support at <a href="mailto:support@crystalreadymade.com" className="text-brand hover:underline font-medium">support@crystalreadymade.com</a> <span className="font-semibold">within 7 days of delivery.</span></p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-surface-muted rounded-lg">
                <div className="text-brand font-bold text-xl min-w-fit w-8 h-8 flex items-center justify-center rounded-full bg-brand/10">2</div>
                <div>
                  <p className="text-text font-semibold mb-1">Provide Details</p>
                  <p className="text-muted">Provide your <span className="font-semibold">order details, reason for return,</span> and (if applicable) the <span className="font-semibold">unboxing video.</span></p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-surface-muted rounded-lg">
                <div className="text-brand font-bold text-xl min-w-fit w-8 h-8 flex items-center justify-center rounded-full bg-brand/10">3</div>
                <div>
                  <p className="text-text font-semibold mb-1">Receive Approval</p>
                  <p className="text-muted">Once approved, you will receive <span className="font-semibold">return instructions</span> from our team.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-surface-muted rounded-lg">
                <div className="text-brand font-bold text-xl min-w-fit w-8 h-8 flex items-center justify-center rounded-full bg-brand/10">4</div>
                <div>
                  <p className="text-text font-semibold mb-1">Ship Item Back</p>
                  <p className="text-muted">Pack the item securely and <span className="font-semibold">ship it back to the provided address.</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Refund Process */}
          <div id="refund-process" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">5. Refund Process</h2>
            <div className="space-y-4">
              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Timeline</h3>
                <p className="text-muted">Refunds will be credited <span className="font-semibold">within 5-7 business days</span> after we receive and inspect the returned item.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Payment Method</h3>
                <p className="text-muted">The refund will be <span className="font-semibold">issued to the original payment method.</span></p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Shipping Charges</h3>
                <p className="text-muted">Shipping charges are <span className="font-semibold">non-refundable,</span> except in cases of <span className="font-semibold">defective or wrong items.</span></p>
              </div>
            </div>
          </div>

          {/* Section 6: Exchanges */}
          <div id="exchanges" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">6. Exchanges</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                Exchanges are <span className="font-semibold">subject to product availability.</span> If the desired item is unavailable, a refund will be issued instead.
              </p>
              <p className="text-lg leading-relaxed">
                All <span className="font-semibold">approved exchange and replacement</span> requests will be <span className="font-semibold">completed within 7 business days.</span>
              </p>
            </div>
          </div>

          {/* Section 7: Return Shipping */}
          <div id="shipping" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">7. Return Shipping</h2>
            <div className="space-y-4">
              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Standard Returns</h3>
                <p className="text-muted"><span className="font-semibold">Customers are responsible for return shipping costs</span> for non-quality-related returns.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Quality Issues</h3>
                <p className="text-muted">Return shipping is <span className="font-semibold">free for quality-related returns</span> (defective or wrong items).</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Need Help?</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              For any questions about returns, refunds, or exchanges, please contact us:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface-muted p-6 rounded-lg border border-line">
                <Mail className="text-brand mb-3" size={28} />
                <h3 className="h4 text-text mb-2">Email</h3>
                <a href="mailto:support@crystalreadymade.com" className="text-brand hover:text-brand-dark transition-colors font-medium break-all">
                  support@crystalreadymade.com
                </a>
              </div>
              <div className="bg-surface-muted p-6 rounded-lg border border-line">
                <Phone className="text-brand mb-3" size={28} />
                <h3 className="h4 text-text mb-2">Phone</h3>
                <a href="tel:+919876543210" className="text-brand hover:text-brand-dark transition-colors font-medium">
                  +91 9876543210
                </a>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-brand/10 border border-brand/30 p-8 rounded-2xl">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-brand flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="h3 text-text mb-2">Important Notice</h3>
                <p className="text-muted text-lg leading-relaxed">
                  CrystalReadymade reserves the right to <span className="font-semibold">reject returns that do not meet the above conditions.</span> All decisions regarding return eligibility and refund processing are final and subject to our verification process.
                </p>
              </div>
            </div>
          </div>

          {/* Closing */}
          <div className="text-center py-8">
            <p className="text-muted text-lg">Thank you for shopping with us! ❤️</p>
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
