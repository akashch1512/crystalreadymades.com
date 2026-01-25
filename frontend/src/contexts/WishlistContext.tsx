import React, { createContext, useState, useContext, useEffect } from 'react';
import { WishlistItem } from '../types';

interface WishlistContextValue {
  items: WishlistItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextValue>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
  itemCount: 0
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setItems(parsedWishlist);
        } else {
          console.warn('Invalid wishlist data in localStorage. Resetting.');
          setItems([]);
        }
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addItem = (productId: string) => {
    if (!isInWishlist(productId)) {
      setItems(prev => [...prev, { 
        id: `wishlist-item-${Date.now()}`, 
        productId 
      }]);
    }
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.productId === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const itemCount = items.length;

  return (
    <WishlistContext.Provider value={{
      items,
      addItem,
      removeItem,
      isInWishlist,
      clearWishlist,
      itemCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
