import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { defaultCart } from '../data/mockData';
import { useProducts } from './ProductContext';

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

// Helper: read saved cart from localStorage synchronously
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('cart');
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products } = useProducts();
  // Lazy initializers read localStorage BEFORE the first render,
  // so there is no race condition with the save effect.
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = loadCartFromStorage();
    return saved?.items || [];
  });
  const [shipping, setShipping] = useState<number>(() => {
    const saved = loadCartFromStorage();
    return saved?.shipping ?? defaultCart.shipping;
  });
  const [discount, setDiscount] = useState<number>(() => {
    const saved = loadCartFromStorage();
    return saved?.discount || 0;
  });

  // Derived values — computed fresh every render
  const subtotal = items.reduce((sum, item) => {
    return sum + ((item.salePrice || item.price) * item.quantity);
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax + shipping - discount;

  // Save to localStorage whenever cart changes (NO race — initial state is already correct)
  useEffect(() => {
    const cartData = { items, subtotal, tax, shipping, discount, total };
    localStorage.setItem('cart', JSON.stringify(cartData));
  }, [items, shipping, discount]);

  useEffect(() => {
    if (products.length === 0 || items.length === 0) return;

    setItems(prevItems =>
      prevItems
        .map(item => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return item;

          const availableQuantity = Math.max(0, product.quantity ?? product.stock ?? 0);
          return {
            ...item,
            price: product.price,
            salePrice: product.salePrice,
            availableQuantity,
            quantity: Math.min(item.quantity, availableQuantity),
          };
        })
        .filter(item => item.quantity > 0)
    );
  }, [products]);

  const addItem = (product: Product, quantity: number) => {
    const availableQuantity = Math.max(0, product.quantity ?? product.stock ?? 0);
    if (availableQuantity <= 0) return;
    const requestedQuantity = Math.max(1, quantity);

    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.productId === product.id
      );
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        const currentQuantity = updatedItems[existingItemIndex].quantity;
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          price: product.price,
          salePrice: product.salePrice,
          availableQuantity,
          quantity: Math.min(currentQuantity + requestedQuantity, availableQuantity)
        };
        return updatedItems;
      } else {
        const cartQuantity = Math.min(requestedQuantity, availableQuantity);
        return [
          ...prevItems,
          {
            id: `cart-item-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            image: product.images?.[0] ?? 'https://via.placeholder.com/300',
            quantity: cartQuantity,
            availableQuantity
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
          ? { ...item, quantity: Math.min(quantity, item.availableQuantity ?? quantity) }
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
