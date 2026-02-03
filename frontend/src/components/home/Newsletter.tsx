import React, { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Mock successful subscription
    setError('');
    setSubscribed(true);
    
    // Reset form after some time
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 5000);
  };

  return (
    <section className="section section-muted">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center card p-8">
          <h2 className="h2 mb-3">Subscribe to Our Newsletter</h2>
          <p className="text-muted mb-6">
            Stay updated with our latest products, exclusive offers, and styling tips.
          </p>
          
          {subscribed ? (
            <div className="alert alert-success mb-4 text-center animate-fade-in">
              <p className="font-medium">
                Thank you for subscribing! Please check your email for confirmation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-grow">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="input"
                  required
                />
                {error && <p className="text-red-600 text-sm mt-1 text-left">{error}</p>}
              </div>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Subscribe
              </button>
            </form>
          )}
          
          <p className="text-muted text-sm mt-4">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
