import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, AlertCircle } from 'lucide-react';

/**
 * CrystalReadymade - Terms & Conditions
 * Comprehensive Terms of Service adapted from AttireBae template
 * Effective Date: February 2026
 */
export const TermsAndPolicies = () => {
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
          <div>
            <p className="caption text-brand mb-4">
              Legal & Compliance
            </p>
            <h1 className="h1 mb-6">
              Terms of <span className="text-brand">Service</span>
            </h1>
            <p className="text-muted text-lg max-w-3xl">
              Please read these Terms of Service carefully as they include important information about your legal rights, warranty disclaimers, and limitations of liability. By using our Services, you agree to be bound by these terms.
            </p>
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
            <h2 className="h2 mb-6 text-text">Overview</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                Welcome to CrystalReadymade! The terms "we", "us" and "our" refer to CrystalReadymade. CrystalReadymade operates this store and website, including all related information, content, features, tools, products and services in order to provide you, the customer, with a curated shopping experience (the "Services").
              </p>
              <p className="text-lg leading-relaxed">
                The below terms and conditions, together with any policies referenced herein (these "Terms of Service" or "Terms") describe your rights and responsibilities when you use the Services.
              </p>
              <p className="text-lg leading-relaxed">
                <span className="font-semibold text-text">Please read these Terms of Service carefully, as they include important information about your legal rights and cover areas such as warranty disclaimers and limitations of liability.</span>
              </p>
              <p className="text-lg leading-relaxed">
                By visiting, interacting with or using our Services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these Terms of Service or Privacy Policy, you should not use or access our Services.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <div id="access" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 1 - Access and Account</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, and you have given us your consent to allow any of your minor dependents to use the Services on devices you own, purchase or manage.
              </p>
              <p className="text-lg leading-relaxed">
                To use the Services, including accessing or browsing our online stores or purchasing any of the products or services we offer, you may be asked to provide certain information, such as your email address, billing, payment, and shipping information. You represent and warrant that all the information you provide in our stores is correct, current and complete and that you have all rights necessary to provide this information.
              </p>
              <p className="text-lg leading-relaxed">
                You are solely responsible for maintaining the security of your account credentials and for all of your account activity. You may not transfer, sell, assign, or license your account to any other person.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div id="products" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 2 - Our Products</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                We have made every effort to provide an accurate representation of our products and services in our online stores. However, please note that colors or product appearance may differ from how they may appear on your screen due to the type of device you use to access the store and your device settings and configuration.
              </p>
              <p className="text-lg leading-relaxed">
                We do not warrant that the appearance or quality of any products or services purchased by you will meet your expectations or be the same as depicted or rendered in our online stores.
              </p>
              <p className="text-lg leading-relaxed">
                All descriptions of products are subject to change at any time without notice at our sole discretion. We reserve the right to discontinue any product at any time and may limit the quantities of any products that we offer to any person, geographic region or jurisdiction, on a case-by-case basis.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div id="orders" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 3 - Orders</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                When you place an order, you are making an offer to purchase. CrystalReadymade reserves the right to accept or decline your order for any reason at its discretion. Your order is not accepted until CrystalReadymade confirms acceptance. We must receive and process your payment before your order is accepted.
              </p>
              <p className="text-lg leading-relaxed">
                Please review your order carefully before submitting, as CrystalReadymade may be unable to accommodate cancellation requests after an order is accepted. In the event that we do not accept, make a change to, or cancel an order, we will attempt to notify you by contacting the e‑mail, billing address, and/or phone number provided at the time the order was made.
              </p>
              <p className="text-lg leading-relaxed">
                Your purchases are subject to return or exchange solely in accordance with our Refund Policy.
              </p>
              <p className="text-lg leading-relaxed">
                You represent and warrant that your purchases are for your own personal or household use and not for commercial resale or export.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div id="pricing" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 4 - Prices and Billing</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                Prices, discounts and promotions are subject to change without notice. The price charged for a product or service will be the price in effect at the time the order is placed and will be set out in your order confirmation email. Unless otherwise expressly stated, posted prices do not include taxes, shipping, handling, customs or import charges.
              </p>
              <p className="text-lg leading-relaxed">
                Prices posted in our online stores may be different from prices offered in physical stores or in online or other stores operated by third parties. We may offer, from time to time, promotions on the Services that may affect pricing and that are governed by terms and conditions separate from these Terms. If there is a conflict between the terms for a promotion and these Terms, the promotion terms will govern.
              </p>
              <p className="text-lg leading-relaxed">
                You agree to provide current, complete and accurate purchase, payment and account information for all purchases made at our stores. You agree to promptly update your account and other information, including your email address, credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.
              </p>
              <p className="text-lg leading-relaxed">
                You represent and warrant that (i) the credit card information you provide is true, correct, and complete, (ii) you are duly authorized to use such credit card for the purchase, (iii) charges incurred by you will be honored by your credit card company, and (iv) you will pay charges incurred by you at the posted prices, including shipping and handling charges and all applicable taxes, if any.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div id="shipping" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 5 - Shipping and Delivery</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                We are not liable for shipping and delivery delays. All delivery times are estimates only and are not guaranteed. We are not responsible for delays caused by shipping carriers, customs processing, or events outside our control. Once we transfer products to the carrier, title and risk of loss passes to you.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div id="intellectual" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 6 - Intellectual Property</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                Our Services, including but not limited to all trademarks, brands, text, displays, images, graphics, product reviews, video, and audio, and the design, selection, and arrangement thereof, are owned by CrystalReadymade, its affiliates or licensors and are protected by U.S. and foreign patent, copyright and other intellectual property laws.
              </p>
              <p className="text-lg leading-relaxed">
                These Terms permit you to use the Services for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on the Services without our prior written consent. Except as expressly provided herein, nothing in these Terms grants or shall be construed as granting a license or other rights to you under any patent, trademark, copyright, or other intellectual property of CrystalReadymade or any third party. Unauthorized use of the Services may be a violation of federal and state intellectual property laws. All rights not expressly granted herein are reserved by CrystalReadymade.
              </p>
              <p className="text-lg leading-relaxed">
                CrystalReadymade's names, logos, product and service names, designs, and slogans are trademarks of CrystalReadymade or its affiliates or licensors. You must not use such trademarks without the prior written permission of CrystalReadymade. All other names, logos, product and service names, designs, and slogans on the Services are the trademarks of their respective owners.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div id="optional" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 7 - Optional Tools</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                You may be provided with access to customer tools offered by third parties as part of the Services, which we neither monitor nor have any control nor input. You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.
              </p>
              <p className="text-lg leading-relaxed">
                Any use by you of the optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).
              </p>
              <p className="text-lg leading-relaxed">
                We may also, in the future, offer new features through the Services (including the release of new tools and resources). Such new features shall also be deemed part of the Services and are subject to these Terms of Service.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div id="thirdparty" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 8 - Third-Party Links</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                The Services may contain materials and hyperlinks to websites provided or operated by third parties (including any embedded third party functionality). We are not responsible for examining or evaluating the content or accuracy of any third-party materials or websites you choose to access. If you decide to leave the Services to access these materials or third party sites, you do so at your own risk.
              </p>
              <p className="text-lg leading-relaxed">
                We are not liable for any harm or damages related to your access of any third-party websites, or your purchase or use of any products, services, resources, or content on any third-party websites. Please review carefully the third-party's policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products and services should be directed to the third-party.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div id="relationship" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 9 - Relationship with Service Providers</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                CrystalReadymade is powered by various service providers that enable us to provide the Services to you. However, any sales and purchases you make in our Store are made directly with CrystalReadymade. By using the Services, you acknowledge and agree that service providers are not responsible for any aspect of any sales between you and CrystalReadymade, including any injury, damage, or loss resulting from purchased products and services. You hereby expressly release all service providers and their affiliates from all claims, damages, and liabilities arising from or related to your purchases and transactions with CrystalReadymade.
              </p>
            </div>
          </div>

          {/* Section 10 */}
          <div id="privacy" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 10 - Privacy Policy</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                All personal information we collect through the Services is subject to our Privacy Policy. By using the Services, you acknowledge that you have read our privacy policy and agree to be bound by it. Your personal information may be transmitted to and shared with service providers and third parties that may be located in other countries than where you reside, in order to provide services to you.
              </p>
            </div>
          </div>

          {/* Section 11 */}
          <div id="feedback" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 11 - Feedback</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                If you submit, upload, post, email, or otherwise transmit any ideas, suggestions, feedback, reviews, proposals, plans, or other content (collectively, "Feedback"), you grant us a perpetual, worldwide, sublicensable, royalty-free license to use, reproduce, modify, publish, distribute and display such Feedback in any medium for any purpose, including for commercial use. We may, for example, use our rights under this license to operate, provide, evaluate, enhance, improve and promote the Services and to perform our obligations and exercise our rights under the Terms of Service.
              </p>
              <p className="text-lg leading-relaxed">
                You also represent and warrant that: (i) you own or have all necessary rights to all Feedback; (ii) you have disclosed any compensation or incentives received in connection with your submission of Feedback; and (iii) your Feedback will comply with these Terms. We are and shall be under no obligation (1) to maintain your Feedback in confidence; (2) to pay compensation for your Feedback; or (3) to respond to your Feedback.
              </p>
              <p className="text-lg leading-relaxed">
                We may, but have no obligation to, monitor, edit or remove Feedback that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.
              </p>
            </div>
          </div>

          {/* Section 12 */}
          <div id="errors" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 12 - Errors, Inaccuracies and Omissions</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                Occasionally there may be information on or in the Services that contain typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information is inaccurate at any time without prior notice (including after you have submitted your order).
              </p>
            </div>
          </div>

          {/* Section 13 */}
          <div id="prohibited" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 13 - Prohibited Uses</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                You may access and use the Services for lawful purposes only. You may not access or use the Services, directly or indirectly: (a) for any unlawful or malicious purpose; (b) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (c) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (d) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or harm any of our employees or any other person; (e) to transmit false or misleading information; (f) to send, knowingly receive, upload, download, use, or re-use any material that does not comply with the these Terms; (g) to transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation; (h) to impersonate or attempt to impersonate any other person or entity; or (i) to engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which, as determined by us, may harm CrystalReadymade or users of the Services, or expose them to liability.
              </p>
              <p className="text-lg leading-relaxed">
                In addition, you agree not to: (a) upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Services; (b) reproduce, duplicate, copy, sell, resell or exploit any portion of the Services; (c) collect or track the personal information of others; (d) spam, phish, pharm, pretext, spider, crawl, or scrape; or (e) interfere with or circumvent the security features of the Services or any related website, other websites, or the Internet. We reserve the right to suspend, disable, or terminate your account at any time, without notice, if we determine that you have violated any part of these Terms.
              </p>
            </div>
          </div>

          {/* Section 14 */}
          <div id="termination" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 14 - Termination</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                We may terminate this agreement or your access to the Services (or any part thereof) in our sole discretion at any time without notice, and you will remain liable for all amounts due up to and including the date of termination.
              </p>
              <p className="text-lg leading-relaxed">
                The following sections will continue to apply following any termination: Intellectual Property, Feedback, Termination, Disclaimer of Warranties, Limitation of Liability, Indemnification, Severability, Waiver; Entire Agreement, Assignment, Governing Law, Privacy Policy, and any other provisions that by their nature should survive termination.
              </p>
            </div>
          </div>

          {/* Section 15 */}
          <div id="disclaimer" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl border-l-4 border-l-brand">
            <h2 className="h2 mb-6 text-text">Section 15 - Disclaimer of Warranties</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                The information presented on or through the Services is made available solely for general information purposes. We do not warrant the accuracy, completeness, or usefulness of this information. Any reliance you place on such information is strictly at your own risk. We disclaim all liability and responsibility arising from any reliance placed on such materials by you or any other visitor to the Services, or by anyone who may be informed of any of its contents.
              </p>
              <div className="bg-surface rounded-lg p-6 border border-line mt-6">
                <p className="text-text font-semibold mb-4 flex items-start gap-2">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  EXCEPT AS EXPRESSLY STATED BY CRYSTALREADYMADE
                </p>
                <p className="text-muted text-sm">
                  The Services and all products offered through the Services are provided 'AS IS' and 'AS AVAILABLE' for your use, without any representation, warranties or conditions of any kind, either express or implied, including all implied warranties or conditions of MERCHANTABILITY, MERCHANTABLE QUALITY, FITNESS FOR A PARTICULAR PURPOSE, DURABILITY, TITLE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE, REPRESENT OR WARRANT THAT YOUR USE OF THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE. SOME JURISDICTIONS LIMIT OR DO NOT ALLOW THE DISCLAIMER OF IMPLIED OR OTHER WARRANTIES SO THE ABOVE DISCLAIMER MAY NOT APPLY TO YOU.
                </p>
              </div>
            </div>
          </div>

          {/* Section 16 */}
          <div id="limitation" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 16 - Limitation of Liability</h2>
            <div className="bg-brand/10 border border-brand/20 rounded-lg p-6">
              <p className="text-text font-semibold mb-4">TO THE FULLEST EXTENT PROVIDED BY LAW:</p>
              <p className="text-muted text-sm leading-relaxed">
                IN NO CASE SHALL CRYSTALREADYMADE, OUR PARTNERS, DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, CONTRACTORS, SERVICE PROVIDERS OR LICENSORS BE LIABLE FOR ANY INJURY, LOSS, CLAIM, OR ANY DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, SPECIAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND, INCLUDING, WITHOUT LIMITATION, LOST PROFITS, LOST REVENUE, LOST SAVINGS, LOSS OF DATA, REPLACEMENT COSTS, OR ANY SIMILAR DAMAGES, WHETHER BASED IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE, ARISING FROM YOUR USE OF ANY OF THE SERVICES OR ANY PRODUCTS PROCURED USING THE SERVICES, OR FOR ANY OTHER CLAIM RELATED IN ANY WAY TO YOUR USE OF THE SERVICES OR ANY PRODUCT, INCLUDING, BUT NOT LIMITED TO, ANY ERRORS OR OMISSIONS IN ANY CONTENT, OR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SERVICES OR ANY CONTENT (OR PRODUCT) POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES, EVEN IF ADVISED OF THEIR POSSIBILITY.
              </p>
            </div>
          </div>

          {/* Section 17 */}
          <div id="indemnification" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 17 - Indemnification</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                You agree to indemnify, defend and hold harmless CrystalReadymade, and our affiliates, partners, officers, directors, employees, agents, contractors, licensors, and service providers from any losses, damages, liabilities or claims, including reasonable attorneys' fees, payable to any third party due to or arising out of (1) your breach of these Terms of Service or the documents they incorporate by reference, (2) your violation of any law or the rights of a third party, or (3) your access to and use of the Services.
              </p>
              <p className="text-lg leading-relaxed">
                We will notify you of any indemnifiable claim, provided that a failure to promptly notify will not relieve you of your obligations unless you are materially prejudiced. We may control the defense and settlement of such claim at your expense, including choice of counsel, but will not settle any claim requiring non-monetary obligations from you without your consent (not to be unreasonably withheld). You will cooperate in the defense of indemnified claims, including by providing relevant documents.
              </p>
            </div>
          </div>

          {/* Section 18 */}
          <div id="severability" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 18 - Severability</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.
              </p>
            </div>
          </div>

          {/* Section 19 */}
          <div id="waiver" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 19 - Waiver; Entire Agreement</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.
              </p>
              <p className="text-lg leading-relaxed">
                These Terms of Service and any policies or operating rules posted by us on this site or in respect to the Service constitutes the entire agreement and understanding between you and us and governs your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).
              </p>
              <p className="text-lg leading-relaxed">
                Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.
              </p>
            </div>
          </div>

          {/* Section 20 */}
          <div id="assignment" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 20 - Assignment</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                You may not delegate, transfer or assign this Agreement or any of your rights or obligations under these Terms without our prior written consent, and any such attempt will be null and void. We may transfer, assign, or delegate these Terms and our rights and obligations without consent or notice to you.
              </p>
            </div>
          </div>

          {/* Section 21 */}
          <div id="governing" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 21 - Governing Law</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws applicable in India. You and CrystalReadymade consent to venue and personal jurisdiction in the courts in India.
              </p>
            </div>
          </div>

          {/* Section 22 */}
          <div id="headings" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 22 - Headings</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.
              </p>
            </div>
          </div>

          {/* Section 23 */}
          <div id="changes" className="bg-brand/5 border border-brand/20 p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Section 23 - Changes to Terms of Service</h2>
            <div className="space-y-4 text-muted">
              <p className="text-lg leading-relaxed">
                You can review the most current version of the Terms of Service at any time on this page.
              </p>
              <p className="text-lg leading-relaxed">
                We reserve the right, in our sole discretion, to update, change, or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. We will notify you of any material changes to these Terms in accordance with applicable law, and such changes will be effective on the date specified in the notice. Your continued use of or access to the Services following the posting of any changes to these Terms of Service constitutes acceptance of those changes.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="bg-surface border border-line p-8 rounded-2xl">
            <h2 className="h2 mb-6 text-text">Contact Information</h2>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Questions about the Terms of Service should be sent to us at the following address:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-surface-muted p-6 rounded-lg border border-line">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="text-brand" size={20} />
                  <h3 className="h4 text-text">Email</h3>
                </div>
                <a href="mailto:support@crystalreadymade.com" className="text-brand hover:text-brand-dark transition-colors font-medium break-all">
                  support@crystalreadymade.com
                </a>
              </div>

              <div className="bg-surface-muted p-6 rounded-lg border border-line">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="text-brand" size={20} />
                  <h3 className="h4 text-text">Phone</h3>
                </div>
                <a href="tel:+919876543210" className="text-brand hover:text-brand-dark transition-colors font-medium">
                  +91 9876543210
                </a>
              </div>

              <div className="bg-surface-muted p-6 rounded-lg border border-line">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="text-brand" size={20} />
                  <h3 className="h4 text-text">Location</h3>
                </div>
                <p className="text-muted text-sm">
                  CrystalReadymade<br />
                  India
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center text-sm text-muted border-t border-line pt-8">
            <p><span className="font-semibold text-text">Last Updated:</span> February 2026</p>
            <p className="mt-2">These Terms of Service apply to CrystalReadymade and all its Services</p>
          </div>
        </div>
      </section>
    </div>
  );
};
