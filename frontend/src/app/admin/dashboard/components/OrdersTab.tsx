'use client';

import { useState } from 'react';
import { Eye, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { DashboardOrder } from './types';

interface OrdersTabProps {
  orders: DashboardOrder[];
  onRefresh: () => void;
}

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'];

export default function OrdersTab({ orders, onRefresh }: OrdersTabProps) {
  const [viewingOrder, setViewingOrder] = useState<DashboardOrder | null>(null);
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
      <section className="space-y-6 animate-fadeIn">
        <header>
          <h2 className="font-serif text-2xl font-semibold tracking-[-0.5px] text-[#1c1c1c]">Customer orders</h2>
          <p className="mt-2 text-sm text-[#5f5f5d]">Review payments and keep fulfillment status up to date.</p>
        </header>
        <div className="overflow-hidden rounded-xl border border-[#eceae4] bg-[#f7f4ed]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1c1c1c]">
            <thead>
              <tr className="border-b border-[#eceae4] bg-[#1c1c1c]/[0.03] font-sans text-[11px] font-semibold uppercase tracking-wider text-[#5f5f5d]">
                <th className="p-3">Order Ref</th><th className="p-3">Customer</th><th className="p-3">Status</th>
                <th className="p-3">Payment</th><th className="p-3">Total</th><th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceae4] text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[#1c1c1c]/[0.025]">
                  <td className="whitespace-nowrap p-4 font-medium text-[#1c1c1c]">{order.order_number}</td>
                  <td className="p-3 font-sans">
                    {order.user?.name || order.shipping_address?.first_name || 'Guest'}
                    <span className="block text-[10px] text-[#5f5f5d]">{order.shipping_address?.email || order.guest_email}</span>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full border border-[#eceae4] bg-[#1c1c1c]/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase text-[#1c1c1c]">
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap p-4 text-[#5f5f5d]">{order.payment_method} ({order.payment_status})</td>
                  <td className="whitespace-nowrap p-4 font-medium text-[#1c1c1c]">Rs. {numberFormat(order.total_amount)}</td>
                  <td className="whitespace-nowrap p-4">
                    <div className="flex gap-2">
                      <button onClick={() => setViewingOrder(order)} className="inline-flex items-center gap-1.5 rounded-md border border-[#eceae4] px-3 py-2 text-xs font-medium text-[#1c1c1c] transition hover:bg-[#1c1c1c]/[0.04] focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/30">
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </button>
                      <button onClick={() => openStatusEditor(order)} className="rounded-md bg-[#1c1c1c] px-3 py-2 text-xs font-medium text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset] transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/30">
                        Change Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <p className="border-t border-[#eceae4] px-6 py-12 text-center text-sm text-[#5f5f5d]">No orders to display yet.</p>}
        </div>
      </section>

      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1c1c1c]/40 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="order-details-title" className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-6 shadow-[rgba(0,0,0,0.1)_0px_4px_12px]">
            <header className="flex items-start justify-between gap-4 border-b border-[#eceae4] pb-4">
              <div>
                <h2 id="order-details-title" className="font-serif text-2xl font-semibold text-[#1c1c1c]">Order {viewingOrder.order_number}</h2>
                <p className="mt-1 text-sm text-[#5f5f5d]">
                  Placed {viewingOrder.created_at ? new Date(viewingOrder.created_at).toLocaleDateString() : 'Date unavailable'}
                </p>
              </div>
              <button onClick={() => setViewingOrder(null)} aria-label="Close order details" className="rounded-md p-2 text-[#5f5f5d] transition hover:bg-[#1c1c1c]/[0.05] hover:text-[#1c1c1c] focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/30">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="grid gap-5 py-5 sm:grid-cols-2">
              <section className="space-y-2 text-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5f5f5d]">Customer</h3>
                <p className="font-medium text-[#1c1c1c]">{viewingOrder.user?.name || `${viewingOrder.shipping_address?.first_name || ''} ${viewingOrder.shipping_address?.last_name || ''}`.trim() || 'Guest'}</p>
                <p className="text-[#5f5f5d]">{viewingOrder.shipping_address?.email || viewingOrder.guest_email || 'No email provided'}</p>
                {viewingOrder.shipping_address?.phone && <p className="text-[#5f5f5d]">{viewingOrder.shipping_address.phone}</p>}
              </section>
              <section className="space-y-2 text-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5f5f5d]">Payment & fulfillment</h3>
                <p className="text-[#1c1c1c]">{viewingOrder.payment_method} · {viewingOrder.payment_status}</p>
                <p className="text-[#5f5f5d]">Status: {viewingOrder.status}</p>
                {viewingOrder.tracking_number && <p className="text-[#5f5f5d]">Tracking: {viewingOrder.tracking_number}</p>}
                {viewingOrder.courier_name && <p className="text-[#5f5f5d]">Courier: {viewingOrder.courier_name}</p>}
              </section>
              <section className="space-y-2 text-sm sm:col-span-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5f5f5d]">Shipping address</h3>
                {viewingOrder.shipping_address ? (
                  <address className="not-italic leading-relaxed text-[#1c1c1c]">
                    {viewingOrder.shipping_address.first_name} {viewingOrder.shipping_address.last_name}<br />
                    {viewingOrder.shipping_address.address_line_1}
                    {viewingOrder.shipping_address.address_line_2 && <><br />{viewingOrder.shipping_address.address_line_2}</>}
                    <br />
                    {[viewingOrder.shipping_address.city, viewingOrder.shipping_address.state, viewingOrder.shipping_address.postal_code].filter(Boolean).join(', ')}
                    <br />
                    {viewingOrder.shipping_address.country}
                  </address>
                ) : <p className="text-[#5f5f5d]">No shipping address provided.</p>}
              </section>
            </div>

            <section className="border-t border-[#eceae4] pt-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5f5f5d]">Items</h3>
              {viewingOrder.items?.length ? (
                <div className="divide-y divide-[#eceae4]">
                  {viewingOrder.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                      <div>
                        <p className="font-medium text-[#1c1c1c]">{item.product_name}</p>
                        <p className="text-xs text-[#5f5f5d]">
                          {[item.color, item.size].filter(Boolean).join(' / ') || 'No variant'} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="whitespace-nowrap font-medium text-[#1c1c1c]">Rs. {numberFormat(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="py-3 text-sm text-[#5f5f5d]">No item details available.</p>}

              <dl className="ml-auto mt-3 max-w-xs space-y-2 border-t border-[#eceae4] pt-3 text-sm">
                <div className="flex justify-between gap-4 text-[#5f5f5d]"><dt>Subtotal</dt><dd>Rs. {numberFormat(viewingOrder.subtotal)}</dd></div>
                <div className="flex justify-between gap-4 text-[#5f5f5d]"><dt>Discount</dt><dd>- Rs. {numberFormat(viewingOrder.discount_amount)}</dd></div>
                <div className="flex justify-between gap-4 text-[#5f5f5d]"><dt>Shipping</dt><dd>Rs. {numberFormat(viewingOrder.shipping_fee)}</dd></div>
                <div className="flex justify-between gap-4 text-[#5f5f5d]"><dt>Tax</dt><dd>Rs. {numberFormat(viewingOrder.tax_amount)}</dd></div>
                <div className="flex justify-between gap-4 border-t border-[#eceae4] pt-2 font-semibold text-[#1c1c1c]"><dt>Total</dt><dd>Rs. {numberFormat(viewingOrder.total_amount)}</dd></div>
              </dl>
            </section>
          </section>
        </div>
      )}

      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1c1c]/40 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="order-status-title" className="w-full max-w-md space-y-5 rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-6 shadow-[rgba(0,0,0,0.1)_0px_4px_12px]">
            <div>
              <h2 id="order-status-title" className="font-serif text-2xl font-semibold text-[#1c1c1c]">Update order</h2>
              <p className="mt-1 text-sm text-[#5f5f5d]">Change fulfillment status and tracking details.</p>
            </div>
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
