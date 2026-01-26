import { 
  Product, 
  Category, 
  Brand, 
  User, 
  Order, 
  Notification 
} from '../types';

// Detect environment to select the correct URL
const BASE_URL = import.meta.env.VITE_API_URL;

// --- API Helper ---
const fetchJson = async <T>(endpoint: string): Promise<T[]> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return []; // Return empty array on failure to prevent app crash
  }
};

// --- Data Fetching Functions ---

// 1. Categories
export const getCategories = async (): Promise<Category[]> => {
  return await fetchJson<Category>('/api/products/categories');
};

// 2. Brands
export const getBrands = async (): Promise<Brand[]> => {
  return await fetchJson<Brand>('/api/products/brands');
};

// 3. Products
export const getProducts = async (): Promise<Product[]> => {
  return await fetchJson<Product>('/api/products');
};

// 4. Users (Admin/Auth use mostly)
export const getUsers = async (): Promise<User[]> => {
  return await fetchJson<User>('/api/users');
};

// 5. Orders
export const getOrders = async (): Promise<Order[]> => {
  return await fetchJson<Order>('/api/orders');
};

// 6. Notifications (Specific to a user, example user 1)
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/notifications/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch notifications");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// --- Client-Side Defaults (Keep these local) ---

// Mock cart data (to be stored in localStorage)
export const defaultCart = {
  id: 'cart1',
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 9.99,
  discount: 0,
  total: 0
};

// Mock wishlist (to be stored in localStorage)
export const defaultWishlist = {
  id: 'wishlist1',
  items: []
};