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

// Helper: read saved wishlist from localStorage synchronously
function loadWishlistFromStorage(): WishlistItem[] {
  try {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazy initializer reads localStorage BEFORE first render — no race condition
  const [items, setItems] = useState<WishlistItem[]>(() => loadWishlistFromStorage());

  // Save whenever items change (safe — initial state is already loaded)
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
