'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { DashboardOrder } from './types';

interface OrdersTabProps {
  orders: DashboardOrder[];
  onRefresh: () => void;
}

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'];

export default function OrdersTab({ orders, onRefresh }: OrdersTabProps) {
  const [editingOrder, setEditingOrder] = useState<DashboardOrder | null>(null);
  const [status, setStatus] = useState('confirmed');
  const [trackingNumber, setTrackingNumber] = useState('');

  const openStatusEditor = (order: DashboardOrder) => {
    setEditingOrder(order);
    setStatus(order.status);
    setTrackingNumber(order.tracking_number || '');
  };

  const saveStatus = async () => {
    if (!editingOrder) return;

    try {
      await api.updateAdminOrderStatus(editingOrder.id, status, trackingNumber || undefined);
      setEditingOrder(null);
      onRefresh();
      alert(`Order status updated to ${status}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update order status');
    }
  };

  return (
    <>
      <section className="space-y-6 rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-6 animate-fadeIn">
        <h2 className="border-b border-[#eceae4] pb-3 text-xs font-bold uppercase tracking-wider text-[#1c1c1c]">
          Customer Orders &amp; Status Fulfillment
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1c1c1c]">
            <thead>
              <tr className="border-b border-[#eceae4] bg-[#eceae4]/60 font-mono uppercase">
                <th className="p-3">Order Ref</th><th className="p-3">Customer</th><th className="p-3">Status</th>
                <th className="p-3">Payment</th><th className="p-3">Total</th><th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceae4] font-mono">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#5f5f5d]/5">
                  <td className="p-3 font-bold text-[#e58a2b]">{order.order_number}</td>
                  <td className="p-3 font-sans">
                    {order.user?.name || order.shipping_address?.first_name || 'Guest'}
                    <span className="block text-[10px] text-[#5f5f5d]">{order.shipping_address?.email || order.guest_email}</span>
                  </td>
                  <td className="p-3">
                    <span className="rounded-full border border-[#e58a2b]/30 bg-[#e58a2b]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#e58a2b]">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 font-sans uppercase text-[#5f5f5d]">{order.payment_method} ({order.payment_status})</td>
                  <td className="p-3 font-bold text-[#1c1c1c]">Rs. {numberFormat(order.total_amount)}</td>
                  <td className="p-3">
                    <button onClick={() => openStatusEditor(order)} className="rounded-md bg-[#1c1c1c] px-3 py-1 font-sans text-[10px] font-bold uppercase text-[#fcfbf8] transition-colors hover:bg-[#1c1c1c]/80">
                      Change Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1c1c]/40 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="order-status-title" className="w-full max-w-md space-y-4 rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-6 shadow-lg">
            <h2 id="order-status-title" className="text-xs font-bold uppercase text-[#1c1c1c]">Update Order Status</h2>
            <label className="block text-xs text-[#5f5f5d]">
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed]/50 p-3 text-[#1c1c1c]">
                {ORDER_STATUSES.map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}
              </select>
            </label>
            <label className="block text-xs text-[#5f5f5d]">
              Tracking Number
              <input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} placeholder="TRK-98765432" className="mt-1 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed]/50 p-3 text-[#1c1c1c]" />
            </label>
            <div className="flex gap-2 pt-2">
              <button onClick={saveStatus} className="flex-1 rounded-md bg-[#1c1c1c] py-2.5 text-xs font-bold uppercase text-[#fcfbf8]">Save Status</button>
              <button onClick={() => setEditingOrder(null)} className="rounded-md border border-[#eceae4] px-4 text-xs font-bold uppercase text-[#1c1c1c]">Cancel</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function numberFormat(value: number): string {
  return new Intl.NumberFormat('en-PK').format(value);
}
