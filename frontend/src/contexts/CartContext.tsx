import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { defaultCart } from '../data/mockData';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  applyDiscount: (code: string) => boolean;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  applyDiscount: () => false,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(defaultCart.shipping);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Load cart from localStorage on initial load
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setItems(parsedCart.items || []);
      setSubtotal(parsedCart.subtotal || 0);
      setTax(parsedCart.tax || 0);
      setShipping(parsedCart.shipping || defaultCart.shipping);
      setDiscount(parsedCart.discount || 0);
      setTotal(parsedCart.total || 0);
    }
  }, []);

  useEffect(() => {
    // Calculate totals whenever cart items change
    const newSubtotal = items.reduce((sum, item) => {
      const itemPrice = item.salePrice || item.price;
      return sum + (itemPrice * item.quantity);
    }, 0);
    
    const newTax = newSubtotal * 0.08; // 8% tax rate
    const newTotal = newSubtotal + newTax + shipping - discount;
    
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
    
    // Save to localStorage
    const cartData = {
      items,
      subtotal: newSubtotal,
      tax: newTax,
      shipping,
      discount,
      total: newTotal
    };
    localStorage.setItem('cart', JSON.stringify(cartData));
  }, [items, shipping, discount]);

  const addItem = (product: Product, quantity: number) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.productId === product.id
      );
  
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            id: `cart-item-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            image: product.images?.[0] ?? 'https://via.placeholder.com/300',
            quantity
          }
        ];
      }
    });
  };
  

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setDiscount(0);
  };

  const applyDiscount = (code: string): boolean => {
    // Mock discount codes
    const validCodes = {
      'CRYSTAL10': 10,
      'CRYSTAL20': 20,
      'WELCOME15': 15
    };
    
    const discountCode = code.toUpperCase();
    if (discountCode in validCodes) {
      const discountAmount = (subtotal * validCodes[discountCode as keyof typeof validCodes]) / 100;
      setDiscount(discountAmount);
      return true;
    }
    return false;
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      applyDiscount
    }}>
      {children}
    </CartContext.Provider>
  );
};