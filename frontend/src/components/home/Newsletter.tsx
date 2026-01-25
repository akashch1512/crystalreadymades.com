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
    <section className="py-12 bg-pink-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Subscribe to Our Newsletter</h2>
          <p className="text-purple-100 mb-6">
            Stay updated with our latest products, exclusive offers, and styling tips.
          </p>
          
          {subscribed ? (
            <div className="bg-purple-800 rounded-lg p-4 mb-4 text-center animate-fade-in">
              <p className="text-white font-medium">
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
                  className="w-full px-4 py-3 rounded-md bg-white/10 border border-purple-400 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                {error && <p className="text-red-300 text-sm mt-1 text-left">{error}</p>}
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-white text-purple-700 font-medium rounded-md hover:bg-purple-100 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          )}
          
          <p className="text-purple-200 text-sm mt-4">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;