import axios from 'axios';

interface RazorpayOrderResponse {
  order: {
    id: string;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
}

export const createRazorpayOrder = async (amount: number): Promise<string> => {
  try {
    const response = await axios.post<RazorpayOrderResponse>(`${import.meta.env.VITE_API_BASE_URL}/api/payment/create-order`, { amount });
    return response.data.order.id;
  } catch (error) {
    console.error('Failed to create Razorpay order:', error);
    throw new Error('Could not create Razorpay order');
  }
};

export const initRazorpay = (options: RazorpayOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) {
      const razorpay = new (window as any).Razorpay(options);
      return resolve(razorpay);
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      if ((window as any).Razorpay) {
        const razorpay = new (window as any).Razorpay(options);
        resolve(razorpay);
      } else {
        reject(new Error('Razorpay SDK not loaded properly'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
};
