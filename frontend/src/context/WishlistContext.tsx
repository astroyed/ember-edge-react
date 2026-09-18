'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types';
import { api } from '@/lib/api';

interface WishlistContextType {
  wishlist: Product[];
  wishlistIds: number[];
  loading: boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  wishlistIds: [],
  loading: false,
  toggleWishlist: async () => {},
  isInWishlist: () => false,
  refreshWishlist: async () => {},
});

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = async () => {
    try {
      const res = await api.getWishlist();
      if (res.success && res.data) {
        setWishlist(res.data);
      }
    } catch (e) {
      console.error('Failed to load wishlist', e);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  const toggleWishlist = async (product: Product) => {
    setLoading(true);
    try {
      const res = await api.toggleWishlist(product.id);
      if (res.success) {
        if (res.added) {
          setWishlist((prev) => [...prev, product]);
        } else {
          setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        }
      }
    } catch (e) {
      console.error('Failed to toggle wishlist', e);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds: wishlist.map((item) => item.id),
        loading,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
