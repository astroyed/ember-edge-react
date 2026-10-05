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
        <h1 className="text-2xl font-bold uppercase text-[#1c1c1c]">Sign In Required</h1>
        <Link href="/login" className="inline-block bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] px-6 py-2.5 text-xs font-bold uppercase rounded-md inset-shadow-btn transition-all glow-focus">
          Login to View Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-[#eceae4] pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">CLIENT PORTAL</span>
          <h1 className="text-3xl font-black uppercase text-[#1c1c1c] font-serif">Order History</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-1 bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-4 h-fit">
          <Link href="/account" className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#5f5f5d] hover:bg-[#5f5f5d]/10 hover:text-[#1c1c1c] rounded-md transition-colors">
            Profile & Settings
          </Link>
          <Link href="/account/orders" className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#1c1c1c] text-[#fcfbf8] rounded-md">
            Order History
          </Link>
          <Link href="/track-order" className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#5f5f5d] hover:bg-[#5f5f5d]/10 hover:text-[#1c1c1c] rounded-md transition-colors">
            Order Tracking
          </Link>
        </aside>

        <div className="md:col-span-3 space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#5f5f5d]">Loading order records...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-[#f7f4ed] border border-[#eceae4] rounded-xl space-y-3">
              <Package className="w-12 h-12 text-[#5f5f5d]/40 mx-auto" />
              <p className="text-sm text-[#5f5f5d]">You have no previous orders.</p>
              <Link href="/shop" className="inline-block bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] px-6 py-2.5 text-xs font-bold uppercase rounded-md inset-shadow-btn transition-all glow-focus">
                Browse Shop Catalog
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between border-b border-[#eceae4] pb-3 gap-2 text-xs">
                  <div>
                    <span className="text-[#5f5f5d]">Order: </span>
                    <strong className="text-[#e58a2b] font-mono">{order.order_number}</strong>
                    <span className="text-[#5f5f5d] ml-3">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                      order.status === 'delivered' ? 'bg-[#5f5f5d]/10 text-[#1c1c1c] border border-[#eceae4]' :
                      order.status === 'shipped' ? 'bg-[#e58a2b]/10 text-[#e58a2b] border border-[#e58a2b]/30' :
                      order.status === 'processing' ? 'bg-[#e58a2b]/10 text-[#e58a2b] border border-[#e58a2b]/30' :
                      'bg-[#5f5f5d]/10 text-[#5f5f5d]'
                    }`}>
                      {order.status}
                    </span>
                    <span className="font-mono font-bold text-[#1c1c1c]">Rs. {numberFormat(order.total_amount)}</span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-[#1c1c1c]">
                        {item.product_name} <span className="text-[#5f5f5d]">({item.color} / {item.size}) × {item.quantity}</span>
                      </span>
                      <span className="text-[#5f5f5d] font-mono">Rs. {numberFormat(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center text-xs border-t border-[#eceae4]">
                  <span className="text-[#5f5f5d] font-mono">Tracking: {order.tracking_number}</span>
                  <Link
                    href={`/track-order?tracking=${order.tracking_number}`}
                    className="text-[#e58a2b] font-bold uppercase hover:underline flex items-center space-x-1"
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
