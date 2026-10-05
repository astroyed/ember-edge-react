'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
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
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-[#5f5f5d]">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="bg-[#f7f4ed] border border-[#eceae4] p-8 sm:p-12 text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-[#e58a2b] mx-auto" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#e58a2b]">ORDER CONFIRMED</span>
        <h1 className="text-3xl font-black uppercase text-[#1c1c1c] font-serif">Thank You For Your Order</h1>
        <p className="text-xs text-[#5f5f5d] max-w-md mx-auto">
          We have received your order. An confirmation email with your order summary has been dispatched.
        </p>

        {order && (
          <div className="bg-[#5f5f5d]/5 border border-[#eceae4] p-4 inline-block text-left text-xs space-y-1 font-mono">
            <p className="text-[#5f5f5d]">Order Reference: <strong className="text-[#e58a2b]">{order.order_number}</strong></p>
            <p className="text-[#5f5f5d]">Tracking Code: <strong className="text-[#1c1c1c]">{order.tracking_number}</strong></p>
            <p className="text-[#5f5f5d]">Payment Gateway: <strong className="text-[#1c1c1c] uppercase">{order.payment_method}</strong></p>
          </div>
        )}
      </div>

      {order && (
        <div className="bg-[#f7f4ed] border border-[#eceae4] p-6 sm:p-8 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1c] border-b border-[#eceae4] pb-3 flex items-center justify-between">
            <span>Purchased Items</span>
            <span className="text-[#e58a2b] font-mono">Rs. {numberFormat(order.total_amount)}</span>
          </h2>

          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs pb-3 border-b border-[#eceae4]">
                <div>
                  <h4 className="font-bold text-[#1c1c1c] uppercase">{item.product_name}</h4>
                  <p className="text-[11px] text-[#5f5f5d]">
                    SKU: {item.variant_sku} ({item.color} / {item.size}) × {item.quantity}
                  </p>
                </div>
                <span className="font-mono text-[#e58a2b]">Rs. {numberFormat(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap gap-4 justify-between items-center">
            <Link
              href={`/track-order?tracking=${order.tracking_number}`}
              className="bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] px-6 py-3 text-xs font-black uppercase tracking-wider inset-shadow-btn hover:brightness-90 transition-all glow-focus flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Track Order Progress</span>
            </Link>

            <Link href="/shop" className="text-xs text-[#5f5f5d] hover:text-[#1c1c1c] uppercase font-semibold">
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
