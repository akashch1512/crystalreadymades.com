import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
    const response = await axios.post<RazorpayOrderResponse>(
      `${API_BASE_URL}/api/payment/create-order`,
      { amount: Math.round(amount) },
      { headers: getAuthHeaders() }
    );

    const razorpayOrderId = response.data?.order?.id;
    if (!razorpayOrderId) {
      console.error('Invalid Razorpay order response:', response.data);
      throw new Error('Invalid Razorpay order response');
    }

    return String(razorpayOrderId);
  } catch (error) {
    console.error('Failed to create Razorpay order:', error);
    throw new Error('Could not create Razorpay order');
  }
};

export const verifyPayment = async (
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string
): Promise<boolean> => {
  try {
    const response = await axios.post<{ success: boolean }>(
      `${API_BASE_URL}/api/payment/verify-payment`,
      {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      },
      { headers: getAuthHeaders() }
    );

    return response.data.success;
  } catch (error) {
    console.error('Failed to verify Razorpay payment:', error);
    return false;
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
