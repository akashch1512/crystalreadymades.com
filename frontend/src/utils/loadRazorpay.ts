export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const scriptExists = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (scriptExists) return resolve(true);
  
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  