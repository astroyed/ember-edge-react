'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';

export const CartDrawer = () => {
  const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponError('');
    try {
      const res = await api.validateCoupon(couponCode, cart?.subtotal || 0);
      if (res.success && res.data) {
        setDiscountAmount(res.data.discount_amount);
        setCouponApplied(true);
      }
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon');
    }
  };

  const finalSubtotal = cart?.subtotal || 0;
  const shippingFee = finalSubtotal > 5000 || finalSubtotal === 0 ? 0 : 250;
  const totalAmount = Math.max(0, finalSubtotal - discountAmount + shippingFee);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-white flex flex-col justify-between shadow-2xl animate-slideLeft">

          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Your Shopping Bag</h2>
              <span className="text-xs bg-zinc-800 text-amber-400 px-2 py-0.5 font-mono font-bold">
                {cart?.item_count || 0} ITEMS
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!cart?.items || cart.items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
                <p className="text-sm text-zinc-400">Your shopping bag is currently empty.</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-block bg-amber-500 text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="flex space-x-4 pb-4 border-b border-zinc-850">
                  <div className="w-20 h-24 bg-zinc-900 relative overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=300'}
                      alt={item.product?.name || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-white truncate">{item.product?.name}</h4>
                      <div className="text-[11px] text-zinc-400 mt-1 flex space-x-2">
                        <span>Color: <strong className="text-zinc-200">{item.variant?.color}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-zinc-200">{item.variant?.size}</strong></span>
                      </div>
                      <p className="text-xs font-semibold text-amber-400 mt-1">
                        Rs. {numberFormat(item.unit_price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-zinc-800 bg-zinc-900">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-red-400 text-xs flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart?.items && cart.items.length > 0 && (
            <div className="p-6 border-t border-zinc-800 bg-zinc-950 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. EMBER10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-xs px-3 py-2 text-white focus:outline-none focus:border-amber-500 uppercase"
                />
                <button
                  type="submit"
                  className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs px-3 py-2 uppercase font-bold tracking-wider"
                >
                  Apply
                </button>
              </form>

              {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
              {couponApplied && (
                <p className="text-[11px] text-green-400 flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <span>Coupon applied! Discount: Rs. {numberFormat(discountAmount)}</span>
                </p>
              )}

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-900">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">Rs. {numberFormat(finalSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>- Rs. {numberFormat(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white">
                    {shippingFee === 0 ? <strong className="text-amber-400">FREE</strong> : `Rs. ${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Estimated Total</span>
                  <span className="text-amber-400 font-mono">Rs. {numberFormat(totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center border border-zinc-700 hover:border-zinc-500 text-zinc-200 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-amber-500 hover:bg-amber-400 text-black py-3 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-1 transition-all glow-ember"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function numberFormat(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num);
}
