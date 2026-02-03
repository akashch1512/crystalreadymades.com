import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Lock, Eye } from 'lucide-react';

export const PrivacyPolicy = () => {
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
    <div className="page" style={{ minHeight: '100vh' }}>
      
      {/* Hero Section */}
      <section className="section-hero section-muted border-b border-line">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-start gap-4">
            <Shield className="text-brand flex-shrink-0 mt-1" size={32} />
            <div>
              <p className="caption text-brand mb-4">Data Protection & Privacy</p>
              <h1 className="h1 mb-6">
                Privacy <span className="text-brand">Policy</span>
              </h1>
              <p className="text-muted text-lg max-w-3xl">
                Your privacy and data security are paramount. This policy explains how we collect, use, and protect your personal information to keep payment gateway requirements secure.
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
              <span className="font-semibold text-text">Last Updated:</span> January 6, 2026
            </p>
          </div>

          {/* Introduction */}
          <div id="intro" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Privacy Policy Overview</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                CrystalReadymade operates this store and website, including all related information, content, features, tools, products and services, to provide you, the customer, with a curated shopping experience (the "Services").
              </p>
              <p className="text-lg leading-relaxed">
                This Privacy Policy describes how we collect, use, and disclose your personal information when you visit, use, or make a purchase or other transaction using the Services or otherwise communicate with us.
              </p>
              <p className="text-lg leading-relaxed">
                <span className="font-semibold text-text">If there is a conflict between our Terms of Service and this Privacy Policy, this Privacy Policy controls with respect to the collection, processing, and disclosure of your personal information.</span>
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div id="collect" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Personal Information We Collect or Process</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              When we use the term "personal information," we are referring to information that identifies or can reasonably be linked to you or another person. Personal information does not include information that is collected anonymously or that has been de-identified. We may collect or process the following categories of personal information:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Contact Details</h3>
                <p className="text-muted text-sm">Name, address, billing address, shipping address, phone number, and email address.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Financial Information</h3>
                <p className="text-muted text-sm">Credit card, debit card, financial account numbers, payment card information, and transaction details.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Account Information</h3>
                <p className="text-muted text-sm">Username, password, security questions, preferences and settings.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Transaction Information</h3>
                <p className="text-muted text-sm">Items you view, purchase, add to wishlist, or exchange, and past transaction history.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Communications</h3>
                <p className="text-muted text-sm">Information you include when communicating with us, including customer support inquiries.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Device Information</h3>
                <p className="text-muted text-sm">Device details, browser type, IP address, network connection, and unique identifiers.</p>
              </div>

              <div className="col-span-2 p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Usage Information</h3>
                <p className="text-muted text-sm">How and when you interact with or navigate the Services, including inferences drawn from this information.</p>
              </div>
            </div>
          </div>

          {/* Information Sources */}
          <div id="sources" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Personal Information Sources</h2>
            <p className="text-muted text-lg mb-6 leading-relaxed">
              We may collect personal information from the following sources:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-surface-muted rounded-lg">
                <span className="text-brand font-bold text-lg min-w-fit">•</span>
                <div>
                  <p className="text-text font-semibold mb-1">Directly from you</p>
                  <p className="text-muted">When you create an account, visit or use our Services, communicate with us, or provide your personal information.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-surface-muted rounded-lg">
                <span className="text-brand font-bold text-lg min-w-fit">•</span>
                <div>
                  <p className="text-text font-semibold mb-1">Automatically through the Services</p>
                  <p className="text-muted">From your device when you use our products or services, and through the use of cookies and similar technologies.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-surface-muted rounded-lg">
                <span className="text-brand font-bold text-lg min-w-fit">•</span>
                <div>
                  <p className="text-text font-semibold mb-1">From service providers</p>
                  <p className="text-muted">When we engage them to enable certain technology and when they collect or process your personal information on our behalf.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-surface-muted rounded-lg">
                <span className="text-brand font-bold text-lg min-w-fit">•</span>
                <div>
                  <p className="text-text font-semibold mb-1">From partners or other third parties</p>
                  <p className="text-muted">Information from other sources that may support our Services.</p>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div id="use" className="bg-surface-muted border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">How We Use Your Personal Information</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              We may use personal information for the following purposes:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Provide, Tailor, and Improve Services</h3>
                <p className="text-muted">To provide Services, perform our contract with you, process payments, fulfill orders, remember preferences, send account notifications, process purchases/returns/exchanges, create/maintain your account, arrange shipping, and create customized shopping experiences.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Marketing and Advertising</h3>
                <p className="text-muted">To send marketing, advertising and promotional communications by email, text message or postal mail, and to show you online advertisements based on items you previously purchased or viewed.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Security and Fraud Prevention</h3>
                <p className="text-muted">To authenticate your account, provide secure payment experience, detect and investigate fraudulent activity, protect public safety, and secure our services.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Communicating With You</h3>
                <p className="text-muted">To provide customer support, be responsive to you, provide effective services, and maintain our business relationship with you.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Legal Reasons</h3>
                <p className="text-muted">To comply with applicable law, respond to valid legal process from law enforcement or government, investigate or participate in litigation, and enforce or investigate potential violations of our terms.</p>
              </div>
            </div>
          </div>

          {/* How We Disclose Information */}
          <div id="disclose" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">How We Disclose Personal Information</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              In certain circumstances, we may disclose your personal information to third parties for legitimate purposes subject to this Privacy Policy:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-muted p-3 bg-surface rounded-lg">
                <span className="text-brand font-bold mt-1">•</span>
                <span>With vendors and service providers who perform services on our behalf (IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping).</span>
              </div>

              <div className="flex items-start gap-3 text-muted p-3 bg-surface rounded-lg">
                <span className="text-brand font-bold mt-1">•</span>
                <span>With business and marketing partners to provide marketing services and advertise to you. Partners will use your information in accordance with their own privacy notices.</span>
              </div>

              <div className="flex items-start gap-3 text-muted p-3 bg-surface rounded-lg">
                <span className="text-brand font-bold mt-1">•</span>
                <span>When you direct, request, or consent to our disclosure of information to third parties, such as to ship you products or through your use of social media widgets.</span>
              </div>

              <div className="flex items-start gap-3 text-muted p-3 bg-surface rounded-lg">
                <span className="text-brand font-bold mt-1">•</span>
                <span>With our affiliates or within our corporate group.</span>
              </div>

              <div className="flex items-start gap-3 text-muted p-3 bg-surface rounded-lg">
                <span className="text-brand font-bold mt-1">•</span>
                <span>In connection with business transactions such as a merger or bankruptcy, to comply with legal obligations, to enforce our terms, and to protect or defend our rights, Services, and users.</span>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div id="security" className="bg-surface border-l-4 border-brand p-8 rounded-lg">
            <div className="flex items-start gap-4">
              <Lock className="text-brand flex-shrink-0 mt-1" size={28} />
              <div>
                <h2 className="h2 text-text mb-4">Security and Retention of Your Information</h2>
                <p className="text-muted text-lg mb-4 leading-relaxed">
                  Please be aware that <span className="font-semibold">no security measures are perfect or impenetrable</span>, and we cannot guarantee "perfect security." Any information sent to us may not be secure while in transit.
                </p>
                <p className="text-muted text-lg mb-4 leading-relaxed">
                  <span className="font-semibold text-text">We recommend that you do not use unsecure channels to communicate sensitive or confidential information to us.</span>
                </p>
                <p className="text-muted text-lg leading-relaxed">
                  How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, provide you with Services, comply with legal obligations, resolve disputes or enforce other applicable contracts and policies.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div id="rights" className="bg-surface-muted border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Your Rights and Choices</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Right to Access / Know</h3>
                <p className="text-muted">You may have a right to request access to personal information that we hold about you.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Right to Delete</h3>
                <p className="text-muted">You may have a right to request that we delete personal information we maintain about you.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Right to Correct</h3>
                <p className="text-muted">You may have a right to request that we correct inaccurate personal information we maintain about you.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Right of Portability</h3>
                <p className="text-muted">You may have a right to receive a copy of the personal information we hold about you and to request that we transfer it to a third party, in certain circumstances and with certain exceptions.</p>
              </div>

              <div className="p-4 bg-surface rounded-lg border border-line">
                <h3 className="h4 text-text mb-2">Managing Communication Preferences</h3>
                <p className="text-muted">We may send you promotional emails. You may opt out of receiving these at any time by using the unsubscribe option displayed in our emails. If you opt out, we may still send you non-promotional emails about your account or orders.</p>
              </div>
            </div>

            <p className="text-muted text-lg mt-8 leading-relaxed">
              <span className="font-semibold text-text">You can exercise these rights by contacting us using the information provided below.</span> We will not discriminate against you for exercising any of these rights. We may need to verify your identity before processing your requests. In accordance with applicable laws, you may designate an authorized agent to make requests on your behalf.
            </p>
          </div>

          {/* Children's Data */}
          <div id="children" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Children's Data</h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              The Services are not intended to be used by children, and we do not knowingly collect any personal information about children under the age of majority in your jurisdiction. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details below to request that it be deleted.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              <span className="font-semibold text-text">As of the Effective Date of this Privacy Policy, we do not have actual knowledge that we "share" or "sell" (as those terms are defined in applicable law) personal information of individuals under 16 years of age.</span>
            </p>
          </div>

          {/* Changes to Policy */}
          <div id="changes" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Changes to This Privacy Policy</h2>
            <p className="text-muted text-lg leading-relaxed">
              We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on this website, update the "Last updated" date and provide notice as required by applicable law.
            </p>
          </div>

          {/* Contact Section */}
          <div id="contact" className="bg-brand/10 border border-brand/30 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Contact Us</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Should you have any questions about our privacy practices, this Privacy Policy, or if you would like to exercise any of your rights available to you, please contact us:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface p-6 rounded-lg border border-line">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="text-brand" size={20} />
                  <h3 className="h4 text-text">Email</h3>
                </div>
                <a href="mailto:support@crystalreadymade.com" className="text-brand hover:text-brand-dark transition-colors font-medium break-all">
                  support@crystalreadymade.com
                </a>
              </div>
              <div className="bg-surface p-6 rounded-lg border border-line">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="text-brand" size={20} />
                  <h3 className="h4 text-text">Phone</h3>
                </div>
                <a href="tel:+919876543210" className="text-brand hover:text-brand-dark transition-colors font-medium">
                  +91 9876543210
                </a>
              </div>
            </div>

            <p className="text-muted text-sm mt-6">We will respond to your request in a timely manner as required under applicable law.</p>
          </div>

          {/* Complaints */}
          <div className="bg-surface border border-line p-8 rounded-2xl">
            <h3 className="h3 text-text mb-4">Complaints</h3>
            <p className="text-muted text-lg leading-relaxed">
              If you have complaints about how we process your personal information, please contact us. Depending on where you live, you may have the right to lodge your complaint with your local data protection authority.
            </p>
          </div>

          {/* Last Updated */}
          <div className="text-center text-sm text-muted border-t border-line pt-8">
            <p><span className="font-semibold text-text">Last Updated:</span> February 2026</p>
            <p className="mt-2">This Privacy Policy applies to CrystalReadymade and all its Services</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
