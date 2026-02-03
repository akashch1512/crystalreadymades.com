import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Truck, Clock, MapPin } from 'lucide-react';

export const ShippingPolicy = () => {
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
            <Truck className="text-brand flex-shrink-0 mt-1" size={32} />
            <div>
              <p className="caption text-brand mb-4">Shipping & Delivery</p>
              <h1 className="h1 mb-6">
                Shipping <span className="text-brand">Policy</span>
              </h1>
              <p className="text-muted text-lg max-w-3xl">
                We ensure fast, safe, and reliable delivery of your orders across India with real-time tracking and trusted courier partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section">
        <div className="container mx-auto max-w-4xl space-y-8">
          
          {/* Processing Time */}
          <div id="processing" className="bg-surface-muted p-8 rounded-2xl border border-line">
            <div className="flex items-start gap-4 mb-4">
              <Clock className="text-brand flex-shrink-0 mt-1" size={28} />
              <div className="flex-1">
                <h2 className="h2 text-text mb-4">Processing Time</h2>
                <p className="text-muted text-lg leading-relaxed">
                  Since we print every design fresh, <span className="font-semibold text-text">please allow 2-3 business days</span> for your order to be printed and quality checked.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Time */}
          <div id="delivery" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Delivery Time</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 bg-surface p-6 rounded-lg border border-line">
                <MapPin className="text-brand flex-shrink-0 mt-1" size={24} />
                <div className="flex-1">
                  <h3 className="h3 text-text mb-2">Metros</h3>
                  <p className="text-muted text-lg">
                    <span className="font-semibold text-text">3-5 business days</span> after processing
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-surface p-6 rounded-lg border border-line">
                <MapPin className="text-brand flex-shrink-0 mt-1" size={24} />
                <div className="flex-1">
                  <h3 className="h3 text-text mb-2">Rest of India</h3>
                  <p className="text-muted text-lg">
                    <span className="font-semibold text-text">5-7 business days</span> after processing
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface border-l-4 border-brand p-6 rounded-lg">
              <p className="text-muted text-lg mb-2"><span className="font-semibold text-text">Total Estimated Time to Your Doorstep:</span> <span className="font-bold text-text">7-10 business days</span></p>
              <p className="text-muted"><span className="font-semibold text-text">Note:</span> Most of the products will be delivered within 3-10 business days.</p>
            </div>
          </div>

          {/* Tracking */}
          <div id="tracking" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Order Tracking</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              <span className="font-semibold text-text">You will receive a tracking link via Email/SMS as soon as your order is shipped from our warehouse.</span> This allows you to monitor your package in real-time throughout its journey.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-surface-muted p-6 rounded-lg border border-line text-center">
                <div className="text-brand font-bold text-2xl mb-2">1</div>
                <p className="text-sm text-muted mb-1">Order Confirmed</p>
                <p className="font-semibold text-text text-sm">Email Notification</p>
              </div>
              <div className="bg-surface-muted p-6 rounded-lg border border-line text-center">
                <div className="text-brand font-bold text-2xl mb-2">2</div>
                <p className="text-sm text-muted mb-1">In Production</p>
                <p className="font-semibold text-text text-sm">2-3 Business Days</p>
              </div>
              <div className="bg-surface-muted p-6 rounded-lg border border-line text-center">
                <div className="text-brand font-bold text-2xl mb-2">3</div>
                <p className="text-sm text-muted mb-1">Ready to Ship</p>
                <p className="font-semibold text-text text-sm">Tracking Link Sent</p>
              </div>
            </div>
          </div>

          {/* Courier Partners */}
          <div id="partners" className="bg-surface-muted border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Courier Partners</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              <span className="font-semibold text-text">We use reliable partners to ensure safe delivery:</span>
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center p-8 bg-surface border border-line rounded-xl hover:border-brand/40 transition-colors">
                <span className="font-semibold text-text text-lg">BlueDart</span>
              </div>
              <div className="flex items-center justify-center p-8 bg-surface border border-line rounded-xl hover:border-brand/40 transition-colors">
                <span className="font-semibold text-text text-lg">Delhivery</span>
              </div>
              <div className="flex items-center justify-center p-8 bg-surface border border-line rounded-xl hover:border-brand/40 transition-colors">
                <span className="font-semibold text-text text-lg">Xpressbees</span>
              </div>
            </div>

            <p className="text-muted text-sm mt-6 text-center">All partners are professionally managed and ensure safe, timely delivery of your orders.</p>
          </div>

          {/* Important Notes */}
          <div id="notes" className="bg-surface border-l-4 border-brand p-8 rounded-lg">
            <h3 className="h3 text-text mb-4">Important Notes</h3>
            <ul className="space-y-3 text-muted">
              <li className="flex items-start gap-3">
                <span className="text-brand font-bold mt-1">•</span>
                <span>Delivery times are estimates and may vary due to unforeseen circumstances beyond our control.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand font-bold mt-1">•</span>
                <span>We are not responsible for delays caused by shipping carriers or customs processing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand font-bold mt-1">•</span>
                <span>Business days exclude weekends and public holidays.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand font-bold mt-1">•</span>
                <span>Once transferred to the courier partner, the risk of loss passes to you.</span>
              </li>
            </ul>
          </div>

          {/* Last Updated */}
          <div className="text-center text-sm text-muted border-t border-line pt-8">
            <p><span className="font-semibold text-text">Last Updated:</span> February 2026</p>
            <p className="mt-2">This policy applies to all shipments from CrystalReadymade</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;
