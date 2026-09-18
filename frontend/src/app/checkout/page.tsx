'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, CreditCard, Truck, Lock, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Address Form State
  const [formData, setFormData] = useState({
    first_name: user?.name ? user.name.split(' ')[0] : '',
    last_name: user?.name ? user.name.split(' ').slice(1).join(' ') : '',
    email: user?.email || '',
    phone: user?.phone || '',
    address_line_1: '',
    address_line_2: '',
    city: 'Karachi',
    state: 'Sindh',
    postal_code: '75500',
    country: 'Pakistan',
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe' | 'jazzcash' | 'easypaisa' | 'bank_transfer'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [notes, setNotes] = useState('');

  const finalSubtotal = cart?.subtotal || 0;
  const shippingFee = finalSubtotal > 5000 || finalSubtotal === 0 ? 0 : 250;
  const totalAmount = Math.max(0, finalSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const res = await api.validateCoupon(couponCode, finalSubtotal);
      if (res.success && res.data) {
        setDiscountAmount(res.data.discount_amount);
        setCouponApplied(true);
      }
    } catch (err: any) {
      alert(err.message || 'Invalid coupon code');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart?.items || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const checkoutPayload = {
        items: cart.items.map((item) => ({
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
        })),
        shipping_address: formData,
        billing_address: sameAsBilling ? formData : formData,
        payment_method: paymentMethod,
        coupon_code: couponApplied ? couponCode : null,
        notes: notes,
      };

      const res = await api.processCheckout(checkoutPayload);

      if (res.success && res.data?.order) {
        const orderNumber = res.data.order.order_number;
        await clearCart();
        router.push(`/checkout/success/${orderNumber}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold uppercase text-white">Your Cart is Empty</h1>
        <p className="text-xs text-zinc-400">Add products to your shopping bag before proceeding to checkout.</p>
        <Link href="/shop" className="inline-block bg-amber-500 text-black px-6 py-2.5 text-xs font-bold uppercase">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">SECURE CHECKOUT</span>
          <h1 className="text-3xl font-black uppercase text-white font-serif">Complete Order</h1>
        </div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400">
          <Lock className="w-4 h-4 text-green-400" />
          <span>256-Bit SSL Encryption</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-900/30 border border-red-700 text-red-300 text-xs rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Shipping & Billing Form */}
        <div className="lg:col-span-2 space-y-8">

          {/* 1. Customer Info */}
          <div className="bg-zinc-950 border border-zinc-850 p-6 sm:p-8 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span>1. Shipping Address</span>
              {!user && (
                <span className="text-[11px] font-normal text-zinc-400">
                  Already have an account? <Link href="/login" className="text-amber-400 underline font-semibold">Log In</Link>
                </span>
              )}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Email Address (For Order Tracking) *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Phone Number (For Courier Contact) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-zinc-400 block mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="House / Flat No., Street Name, Area"
                  value={formData.address_line_1}
                  onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                  className="accent-amber-500"
                />
                <span>Billing address matches shipping address</span>
              </label>
            </div>
          </div>

          {/* 2. Payment Gateway Architecture Selection */}
          <div className="bg-zinc-950 border border-zinc-850 p-6 sm:p-8 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
              2. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label className={`block border p-4 cursor-pointer transition-all ${
                paymentMethod === 'cod' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-amber-500"
                    />
                    <div>
                      <span className="text-xs font-bold uppercase text-white block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-zinc-400">Pay cash upon parcel delivery at your doorstep across Pakistan.</span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-amber-400" />
                </div>
              </label>

              {/* JazzCash / EasyPaisa Local Pakistani Gateway */}
              <label className={`block border p-4 cursor-pointer transition-all ${
                paymentMethod === 'jazzcash' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="jazzcash"
                      checked={paymentMethod === 'jazzcash'}
                      onChange={() => setPaymentMethod('jazzcash')}
                      className="accent-amber-500"
                    />
                    <div>
                      <span className="text-xs font-bold uppercase text-white block">JazzCash / EasyPaisa Wallet</span>
                      <span className="text-[11px] text-zinc-400">Instant Mobile Wallet transfer (Pakistani Local Payment Gateway).</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">PK GATEWAY</span>
                </div>
              </label>

              {/* Stripe Credit/Debit Card */}
              <label className={`block border p-4 cursor-pointer transition-all ${
                paymentMethod === 'stripe' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="accent-amber-500"
                    />
                    <div>
                      <span className="text-xs font-bold uppercase text-white block">Credit / Debit Card (Stripe Gateway)</span>
                      <span className="text-[11px] text-zinc-400">Visa, MasterCard, American Express, UnionPay.</span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-amber-400" />
                </div>
              </label>

              {/* Direct Bank Transfer */}
              <label className={`block border p-4 cursor-pointer transition-all ${
                paymentMethod === 'bank_transfer' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="accent-amber-500"
                    />
                    <div>
                      <span className="text-xs font-bold uppercase text-white block">Direct Bank Deposit / Raast</span>
                      <span className="text-[11px] text-zinc-400">Meezan Bank / HBL Raast instant transfer.</span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Confirm */}
        <div className="bg-zinc-950 border border-zinc-850 p-6 space-y-6 h-fit sticky top-28">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
            Order Items ({cart.items.length})
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-white uppercase">{item.product?.name}</h4>
                  <p className="text-[11px] text-zinc-400">
                    {item.variant?.color} / {item.variant?.size} × {item.quantity}
                  </p>
                </div>
                <span className="font-mono text-amber-400">Rs. {numberFormat(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-900 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-mono">Rs. {numberFormat(finalSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span className="font-mono">- Rs. {numberFormat(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-white font-mono">
                {shippingFee === 0 ? <strong className="text-amber-400 font-sans">FREE</strong> : `Rs. ${shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-zinc-800">
              <span>Grand Total</span>
              <span className="text-amber-400 font-mono">Rs. {numberFormat(totalAmount)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-all glow-ember disabled:opacity-50"
          >
            {loading ? (
              <span>Processing Order...</span>
            ) : (
              <>
                <span>Place Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function numberFormat(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num);
}
