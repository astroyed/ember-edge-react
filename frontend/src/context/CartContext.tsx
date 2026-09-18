'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, CartItem } from '@/types';
import { api } from '@/lib/api';

interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  loading: boolean;
  addToCart: (variantId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  isOpen: false,
  setIsOpen: () => {},
  loading: false,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    try {
      const res = await api.getCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (variantId: number, quantity: number = 1) => {
    setLoading(true);
    try {
      const res = await api.addToCart(variantId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
        setIsOpen(true); // Auto-open cart drawer on item add
      }
    } catch (e: any) {
      alert(e.message || 'Failed to add item to cart.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    setLoading(true);
    try {
      const res = await api.updateCartItem(itemId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to update item quantity.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    setLoading(true);
    try {
      const res = await api.removeCartItem(itemId);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (e: any) {
      alert(e.message || 'Failed to remove item.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await api.clearCart();
      setCart({ cart_id: 0, items: [], subtotal: 0, item_count: 0 });
    } catch (e: any) {
      console.error('Failed to clear cart', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
