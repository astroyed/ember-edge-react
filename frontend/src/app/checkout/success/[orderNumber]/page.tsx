'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import { Order } from '@/types';
import { api } from '@/lib/api';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;
    api.getOrder(orderNumber)
      .then((res) => {
        if (res.success) setOrder(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-zinc-400">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="bg-zinc-950 border border-zinc-850 p-8 sm:p-12 text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-amber-500 mx-auto" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">ORDER CONFIRMED</span>
        <h1 className="text-3xl font-black uppercase text-white font-serif">Thank You For Your Order</h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          We have received your order. An confirmation email with your order summary has been dispatched.
        </p>

        {order && (
          <div className="bg-zinc-900 border border-zinc-800 p-4 inline-block text-left text-xs space-y-1 font-mono">
            <p className="text-zinc-300">Order Reference: <strong className="text-amber-400">{order.order_number}</strong></p>
            <p className="text-zinc-300">Tracking Code: <strong className="text-white">{order.tracking_number}</strong></p>
            <p className="text-zinc-300">Payment Gateway: <strong className="text-white uppercase">{order.payment_method}</strong></p>
          </div>
        )}
      </div>

      {order && (
        <div className="bg-zinc-950 border border-zinc-850 p-6 sm:p-8 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center justify-between">
            <span>Purchased Items</span>
            <span className="text-amber-400 font-mono">Rs. {numberFormat(order.total_amount)}</span>
          </h2>

          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs pb-3 border-b border-zinc-900">
                <div>
                  <h4 className="font-bold text-white uppercase">{item.product_name}</h4>
                  <p className="text-[11px] text-zinc-400">
                    SKU: {item.variant_sku} ({item.color} / {item.size}) × {item.quantity}
                  </p>
                </div>
                <span className="font-mono text-zinc-200">Rs. {numberFormat(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap gap-4 justify-between items-center">
            <Link
              href={`/track-order?tracking=${order.tracking_number}`}
              className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all glow-ember"
            >
              <Package className="w-4 h-4" />
              <span>Track Order Progress</span>
            </Link>

            <Link href="/shop" className="text-xs text-zinc-400 hover:text-white uppercase font-semibold">
              Continue Shopping →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function numberFormat(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num);
}
