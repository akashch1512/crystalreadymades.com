import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface RazorpayOrderResponse {
  order: {
    id: string;
    amount: number;
    currency: string;
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
  modal?: {
    ondismiss?: () => void;
  };
}

/**
 * Creates a Razorpay order on the backend.
 * Backend now derives the amount from the DB Order — we pass our order_id.
 * Returns { razorpayOrderId, amount } so the checkout knows what to pass to Razorpay SDK.
 */
export const createRazorpayOrder = async (
  dbOrderId: string
): Promise<{ razorpayOrderId: string; amount: number }> => {
  try {
    const response = await axios.post<RazorpayOrderResponse>(
      `${API_BASE_URL}/api/payment/create-order`,
      { order_id: dbOrderId },
      { headers: getAuthHeaders() }
    );

    const razorpayOrderId = response.data?.order?.id;
    const amount = response.data?.order?.amount; // amount in paise from Razorpay

    if (!razorpayOrderId) {
      console.error('Invalid Razorpay order response:', response.data);
      throw new Error('Invalid Razorpay order response');
    }

    return { razorpayOrderId, amount };
  } catch (error) {
    console.error('Failed to create Razorpay order:', error);
    throw new Error('Could not create Razorpay order');
  }
};

/**
 * Verifies the Razorpay payment signature on the backend.
 * Also passes our DB order_id so backend can mark it as paid.
 */
export const verifyPayment = async (
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string,
  dbOrderId: string
): Promise<boolean> => {
  try {
    const response = await axios.post<{ success: boolean }>(
      `${API_BASE_URL}/api/payment/verify-payment`,
      {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        order_id: dbOrderId,
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
