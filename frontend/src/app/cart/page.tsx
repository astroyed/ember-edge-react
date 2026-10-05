'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';

export default function DedicatedCartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

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

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-[#5f5f5d]/40 mx-auto" />
        <h1 className="text-2xl font-bold uppercase text-[#1c1c1c] font-serif">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-[#5f5f5d]">Explore our luxury drops and add items to your cart.</p>
        <Link href="/shop" className="inline-block bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] px-8 py-3 text-xs font-bold uppercase tracking-wider rounded-md inset-shadow-btn transition-all glow-focus">
          Shop Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-[#eceae4] pb-6 flex justify-between items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">YOUR ATELIER BAG</span>
          <h1 className="text-3xl font-black uppercase text-[#1c1c1c] font-serif">Shopping Cart ({cart.item_count})</h1>
        </div>
        <button onClick={clearCart} className="text-xs text-[#5f5f5d] hover:text-red-500 uppercase font-semibold">
          Clear Entire Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="w-20 h-24 bg-[#5f5f5d]/10 rounded-lg flex-shrink-0 relative overflow-hidden">
                  <img
                    src={item.product?.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=300'}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase text-[#1c1c1c]">{item.product?.name}</h3>
                  <div className="text-xs text-[#5f5f5d] mt-1 flex space-x-3">
                    <span>Color: <strong className="text-[#1c1c1c]">{item.variant?.color}</strong></span>
                    <span>Size: <strong className="text-[#1c1c1c]">{item.variant?.size}</strong></span>
                  </div>
                  <p className="text-xs font-mono font-bold text-[#e58a2b] mt-2">
                    Rs. {numberFormat(item.unit_price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                {/* Quantity Controls */}
                <div className="flex items-center border border-[#eceae4] bg-[#f7f4ed] rounded-md">
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-3 py-1 text-[#5f5f5d] hover:text-[#1c1c1c]">-</button>
                  <span className="px-3 text-xs font-mono text-[#1c1c1c]">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-[#5f5f5d] hover:text-[#1c1c1c]">+</button>
                </div>

                <span className="text-sm font-bold font-mono text-[#1c1c1c]">
                  Rs. {numberFormat(item.subtotal)}
                </span>

                <button onClick={() => removeFromCart(item.id)} className="text-[#5f5f5d] hover:text-red-500 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 space-y-6 h-fit sticky top-28">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1c] border-b border-[#eceae4] pb-3">
            Order Summary
          </h2>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-[#f7f4ed]/50 border border-[#eceae4] text-xs px-3 py-2 text-[#1c1c1c] rounded-md focus:outline-none focus:border-[#e58a2b] uppercase"
              />
              <button type="submit" className="bg-[#1c1c1c] hover:bg-[#1c1c1c]/90 text-[#fcfbf8] text-xs px-3 py-2 font-bold uppercase rounded-md inset-shadow-btn">
                Apply
              </button>
            </div>
            {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
            {couponApplied && (
              <p className="text-[11px] text-[#e58a2b] flex items-center space-x-1 font-medium">
                <Tag className="w-3 h-3" />
                <span>Coupon Applied (-Rs. {numberFormat(discountAmount)})</span>
              </p>
            )}
          </form>

          {/* Breakdown */}
          <div className="space-y-2 text-xs text-[#5f5f5d] border-t border-[#eceae4] pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#1c1c1c] font-mono">Rs. {numberFormat(finalSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#e58a2b]">
                <span>Discount</span>
                <span className="font-mono">- Rs. {numberFormat(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Charge</span>
              <span className="text-[#1c1c1c] font-mono">
                {shippingFee === 0 ? <strong className="text-[#e58a2b] font-sans">FREE</strong> : `Rs. ${shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#1c1c1c] pt-3 border-t border-[#eceae4]">
              <span>Total Payable</span>
              <span className="text-[#e58a2b] font-mono">Rs. {numberFormat(totalAmount)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2 rounded-md inset-shadow-btn transition-all glow-focus"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function numberFormat(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num);
}
