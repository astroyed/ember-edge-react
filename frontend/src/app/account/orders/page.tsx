'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ArrowRight, Truck } from 'lucide-react';
import { Order } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getMyOrders()
      .then((res) => {
        if (res.success) setOrders(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold uppercase text-white">Sign In Required</h1>
        <Link href="/login" className="inline-block bg-amber-500 text-black px-6 py-2.5 text-xs font-bold uppercase">
          Login to View Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-zinc-800 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">CLIENT PORTAL</span>
          <h1 className="text-3xl font-black uppercase text-white font-serif">Order History</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-2 bg-zinc-950 border border-zinc-850 p-4 h-fit">
          <Link href="/account" className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:bg-zinc-900">
            Profile & Settings
          </Link>
          <Link href="/account/orders" className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-amber-500 text-black">
            Order History
          </Link>
          <Link href="/track-order" className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:bg-zinc-900">
            Order Tracking
          </Link>
        </aside>

        <div className="md:col-span-3 space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-400">Loading order records...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-zinc-950 border border-zinc-850 space-y-3">
              <Package className="w-12 h-12 text-zinc-600 mx-auto" />
              <p className="text-sm text-zinc-400">You have no previous orders.</p>
              <Link href="/shop" className="inline-block bg-amber-500 text-black px-6 py-2.5 text-xs font-bold uppercase">
                Browse Shop Catalog
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-zinc-950 border border-zinc-850 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between border-b border-zinc-850 pb-3 gap-2 text-xs">
                  <div>
                    <span className="text-zinc-400">Order: </span>
                    <strong className="text-amber-400 font-mono">{order.order_number}</strong>
                    <span className="text-zinc-500 ml-3">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase ${
                      order.status === 'delivered' ? 'bg-green-900/40 text-green-400 border border-green-700' :
                      order.status === 'shipped' ? 'bg-blue-900/40 text-blue-400 border border-blue-700' :
                      order.status === 'processing' ? 'bg-amber-900/40 text-amber-400 border border-amber-700' :
                      'bg-zinc-800 text-zinc-300'
                    }`}>
                      {order.status}
                    </span>
                    <span className="font-mono font-bold text-white">Rs. {numberFormat(order.total_amount)}</span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-zinc-300">
                        {item.product_name} <span className="text-zinc-500">({item.color} / {item.size}) × {item.quantity}</span>
                      </span>
                      <span className="text-zinc-400 font-mono">Rs. {numberFormat(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center text-xs border-t border-zinc-900">
                  <span className="text-zinc-500 font-mono">Tracking: {order.tracking_number}</span>
                  <Link
                    href={`/track-order?tracking=${order.tracking_number}`}
                    className="text-amber-400 font-bold uppercase hover:underline flex items-center space-x-1"
                  >
                    <span>Track Shipment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function numberFormat(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num);
}
