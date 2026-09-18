'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { api } from '@/lib/api';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const trackingParam = searchParams.get('tracking') || '';

  const [trackingNumber, setTrackingNumber] = useState(trackingParam);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.trackOrder(code.trim());
      if (res.success && res.data) {
        setOrderData(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'No tracking information found.');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingParam) {
      fetchTracking(trackingParam);
    }
  }, [trackingParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(trackingNumber);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="bg-zinc-950 border border-zinc-850 p-8 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">LIVE SHIPMENT LOGISTICS</span>
        <h1 className="text-3xl font-black uppercase text-white font-serif">Track Your Order</h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Enter your Order Number (e.g., EE-ABC-123456) or Tracking Code to view real-time delivery status.
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-4 flex space-x-2">
          <input
            type="text"
            required
            placeholder="Enter Order # or Tracking Code..."
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 text-xs px-4 py-3 text-white focus:outline-none focus:border-amber-500 font-mono uppercase"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
          >
            <Search className="w-4 h-4" />
            <span>Track</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 text-red-300 text-xs text-center">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12 text-zinc-400 text-xs">
          Fetching live courier status...
        </div>
      )}

      {orderData && (
        <div className="bg-zinc-950 border border-zinc-850 p-6 sm:p-8 space-y-8 animate-fadeIn">
          {/* Order Header Summary */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-850 pb-4 gap-4">
            <div>
              <span className="text-[10px] text-zinc-500 font-mono uppercase">ORDER REF</span>
              <h2 className="text-lg font-mono font-bold text-amber-400">{orderData.order_number}</h2>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-mono uppercase">COURIER & TRACKING</span>
              <p className="text-xs font-semibold text-white">{orderData.courier_name} ({orderData.tracking_number})</p>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-mono uppercase">ESTIMATED DELIVERY</span>
              <p className="text-xs font-semibold text-amber-400">{orderData.estimated_delivery}</p>
            </div>
          </div>

          {/* Visual Milestone Timeline Stepper */}
          <div className="py-6">
            <div className="relative flex justify-between max-w-2xl mx-auto">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-850 -translate-y-1/2 z-0" />

              {orderData.timeline?.map((step: any, idx: number) => (
                <div key={idx} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    step.completed
                      ? 'bg-amber-500 border-amber-400 text-black font-bold shadow-lg shadow-amber-500/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}>
                    {step.completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider mt-3 ${
                    step.completed ? 'text-white' : 'text-zinc-600'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="border-t border-zinc-850 pt-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Shipment Package Contents</h3>
            <div className="space-y-2 text-xs">
              {orderData.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center bg-zinc-900 p-3 border border-zinc-850">
                  <span className="text-zinc-200 uppercase font-semibold">
                    {item.product_name} ({item.color} / {item.size}) × {item.quantity}
                  </span>
                  <span className="font-mono text-amber-400 font-bold">Rs. {numberFormat(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-zinc-400">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

function numberFormat(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num);
}
