'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ShoppingBag, Users, DollarSign, AlertTriangle, Plus, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'products' | 'create_product'>('stats');
  const [loading, setLoading] = useState(true);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<number>(1);
  const [newProdPrice, setNewProdPrice] = useState('4500');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800');
  const [variantColor, setVariantColor] = useState('Black');
  const [variantSize, setVariantSize] = useState('M');
  const [variantStock, setVariantStock] = useState('25');
  const [prodMsg, setProdMsg] = useState('');

  // Status update modal state
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState('confirmed');
  const [newTracking, setNewTracking] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, oRes, pRes, cRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(),
        api.getAdminProducts(),
        api.getCategories(),
      ]);

      if (sRes.success) setStats(sRes.data);
      if (oRes.success) setOrders(oRes.data?.data || oRes.data || []);
      if (pRes.success) setProducts(pRes.data?.data || pRes.data || []);
      if (cRes.success) setCategories(cRes.data || []);
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role === 'customer') {
        // Restricted to Admin & Staff
        router.push('/');
        return;
      }
      loadAdminData();
    }
  }, [user, authLoading]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdMsg('');
    try {
      const sku = `EE-${variantColor.substring(0, 3).toUpperCase()}-${variantSize.toUpperCase()}-${Math.floor(Math.random()*1000)}`;
      const res = await api.createAdminProduct({
        name: newProdName,
        category_id: newProdCategory,
        price: parseFloat(newProdPrice),
        description: newProdDesc,
        image_url: newProdImg,
        variants: [
          {
            color: variantColor,
            size: variantSize,
            sku: sku,
            stock_quantity: parseInt(variantStock),
          }
        ]
      });

      if (res.success) {
        setProdMsg('Product created successfully!');
        setNewProdName('');
        setNewProdDesc('');
        loadAdminData();
      }
    } catch (err: any) {
      setProdMsg(err.message || 'Failed to create product.');
    }
  };

  const handleUpdateStatus = async (orderId: number) => {
    try {
      const res = await api.updateAdminOrderStatus(orderId, newStatus, newTracking || undefined);
      if (res.success) {
        setUpdatingOrderId(null);
        loadAdminData();
        alert(`Order status updated to ${newStatus}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  if (authLoading || (!user || user.role === 'customer')) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#5f5f5d]">
        Verifying role credentials...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#eceae4] pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">ADMIN CONTROL CENTER</span>
          <h1 className="text-3xl font-black uppercase text-[#1c1c1c] font-serif">Ember Edge Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-[#e58a2b]/10 text-[#e58a2b] text-xs font-bold px-3 py-1 uppercase rounded-full border border-[#e58a2b]/30">
            ROLE: {user.role.toUpperCase()}
          </span>
          <button
            onClick={loadAdminData}
            className="bg-[#f7f4ed] border border-[#eceae4] text-[#1c1c1c] p-2 rounded-md hover:bg-[#5f5f5d]/10 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#eceae4] pb-4">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
            activeTab === 'stats' ? 'bg-[#1c1c1c] text-[#fcfbf8]' : 'bg-[#5f5f5d]/10 text-[#5f5f5d] hover:text-[#1c1c1c]'
          }`}
        >
          Stats & Revenue
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
            activeTab === 'orders' ? 'bg-[#1c1c1c] text-[#fcfbf8]' : 'bg-[#5f5f5d]/10 text-[#5f5f5d] hover:text-[#1c1c1c]'
          }`}
        >
          Manage Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
            activeTab === 'products' ? 'bg-[#1c1c1c] text-[#fcfbf8]' : 'bg-[#5f5f5d]/10 text-[#5f5f5d] hover:text-[#1c1c1c]'
          }`}
        >
          Product Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('create_product')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center space-x-1 ${
            activeTab === 'create_product' ? 'bg-[#1c1c1c] text-[#fcfbf8]' : 'bg-[#5f5f5d]/10 text-[#5f5f5d] hover:text-[#1c1c1c]'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Tab 1: Stats */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-8 animate-fadeIn">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 space-y-2">
              <span className="text-[10px] font-bold text-[#5f5f5d] uppercase tracking-widest">Total Sales Revenue</span>
              <p className="text-2xl font-mono font-bold text-[#e58a2b]">Rs. {numberFormat(stats.total_revenue || 0)}</p>
            </div>

            <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 space-y-2">
              <span className="text-[10px] font-bold text-[#5f5f5d] uppercase tracking-widest">Total Orders</span>
              <p className="text-2xl font-mono font-bold text-[#1c1c1c]">{stats.total_orders || 0}</p>
            </div>

            <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 space-y-2">
              <span className="text-[10px] font-bold text-[#5f5f5d] uppercase tracking-widest">Pending Orders</span>
              <p className="text-2xl font-mono font-bold text-[#e58a2b]">{stats.pending_orders || 0}</p>
            </div>

            <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 space-y-2">
              <span className="text-[10px] font-bold text-[#5f5f5d] uppercase tracking-widest">Total Products</span>
              <p className="text-2xl font-mono font-bold text-[#1c1c1c]">{stats.total_products || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Orders */}
      {activeTab === 'orders' && (
        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 space-y-6 animate-fadeIn">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1c] border-b border-[#eceae4] pb-3">
            Customer Orders & Status Fulfillment
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1c1c1c]">
              <thead>
                <tr className="bg-[#eceae4]/60 border-b border-[#eceae4] text-[#1c1c1c] uppercase font-mono">
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceae4] font-mono">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#5f5f5d]/5">
                    <td className="p-3 font-bold text-[#e58a2b]">{ord.order_number}</td>
                    <td className="p-3 font-sans">
                      {ord.user ? ord.user.name : (ord.shipping_address?.first_name || 'Guest')}
                      <span className="block text-[10px] text-[#5f5f5d] font-mono">{ord.shipping_address?.email || ord.guest_email}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-[#e58a2b]/10 text-[#e58a2b] border border-[#e58a2b]/30">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 uppercase font-sans text-[#5f5f5d]">
                      {ord.payment_method} ({ord.payment_status})
                    </td>
                    <td className="p-3 text-[#1c1c1c] font-bold">Rs. {numberFormat(ord.total_amount)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setUpdatingOrderId(ord.id);
                          setNewStatus(ord.status);
                          setNewTracking(ord.tracking_number || '');
                        }}
                        className="bg-[#1c1c1c] text-[#fcfbf8] px-3 py-1 font-sans font-bold text-[10px] uppercase rounded-md hover:bg-[#1c1c1c]/80 transition-colors"
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Products */}
      {activeTab === 'products' && (
        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 space-y-6 animate-fadeIn">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1c] border-b border-[#eceae4] pb-3">
            Product Catalog Inventory
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1c1c1c]">
              <thead>
                <tr className="bg-[#eceae4]/60 border-b border-[#eceae4] text-[#1c1c1c] uppercase font-mono">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Base Price</th>
                  <th className="p-3">Variants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceae4]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#5f5f5d]/5">
                    <td className="p-3 font-bold text-[#1c1c1c] uppercase">{p.name}</td>
                    <td className="p-3 text-[#5f5f5d]">{p.category?.name || 'Category'}</td>
                    <td className="p-3 font-mono text-[#e58a2b]">Rs. {numberFormat(p.price)}</td>
                    <td className="p-3 font-mono text-xs text-[#5f5f5d]">
                      {p.variants?.map((v: any) => `${v.color}/${v.size} (${v.stock_quantity})`).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Create Product */}
      {activeTab === 'create_product' && (
        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 sm:p-8 space-y-6 max-w-2xl animate-fadeIn">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1c] border-b border-[#eceae4] pb-3">
            Create New Product & Variant Matrix
          </h2>

          {prodMsg && (
            <div className={`p-3 border text-xs rounded-lg ${prodMsg.includes('success') ? 'bg-[#e58a2b]/10 border-[#e58a2b]/30 text-[#e58a2b]' : 'bg-red-500/10 border-red-500/30 text-red-600'}`}>
              {prodMsg}
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            <div>
              <label className="text-[#5f5f5d] block mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="e.g. Minimalist Linen Shirt"
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] rounded-md focus:outline-none focus:border-[#e58a2b]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#5f5f5d] block mb-1">Category *</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(Number(e.target.value))}
                  className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] rounded-md focus:outline-none focus:border-[#e58a2b]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#5f5f5d] block mb-1">Price (PKR) *</label>
                <input
                  type="number"
                  required
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] rounded-md focus:outline-none focus:border-[#e58a2b]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#5f5f5d] block mb-1">Image URL</label>
              <input
                type="text"
                value={newProdImg}
                onChange={(e) => setNewProdImg(e.target.value)}
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] rounded-md focus:outline-none focus:border-[#e58a2b]"
              />
            </div>

            <div>
              <label className="text-[#5f5f5d] block mb-1">Description</label>
              <textarea
                rows={3}
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] rounded-md focus:outline-none focus:border-[#e58a2b]"
              />
            </div>

            <div className="pt-2 border-t border-[#eceae4] grid grid-cols-3 gap-3">
              <div>
                <label className="text-[#5f5f5d] block mb-1">Initial Color</label>
                <input
                  type="text"
                  value={variantColor}
                  onChange={(e) => setVariantColor(e.target.value)}
                  className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-2.5 text-[#1c1c1c] rounded-md"
                />
              </div>
              <div>
                <label className="text-[#5f5f5d] block mb-1">Initial Size</label>
                <input
                  type="text"
                  value={variantSize}
                  onChange={(e) => setVariantSize(e.target.value)}
                  className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-2.5 text-[#1c1c1c] rounded-md"
                />
              </div>
              <div>
                <label className="text-[#5f5f5d] block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={variantStock}
                  onChange={(e) => setVariantStock(e.target.value)}
                  className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-2.5 text-[#1c1c1c] rounded-md"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1c1c1c] hover:bg-[#1c1c1c]/90 text-[#fcfbf8] py-3.5 text-xs font-bold uppercase tracking-wider rounded-md inset-shadow-btn transition-all glow-focus"
            >
              Create Product & Seed Variant
            </button>
          </form>
        </div>
      )}

      {/* Modal for Order Status Update */}
      {updatingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1c1c]/40 backdrop-blur-sm">
          <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 max-w-md w-full space-y-4 shadow-[rgba(0,0,0,0.1)_0px_4px_12px]">
            <h3 className="text-xs font-bold uppercase text-[#1c1c1c]">Update Order Status</h3>

            <div>
              <label className="text-xs text-[#5f5f5d] block mb-1">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] text-[#1c1c1c] text-xs p-3 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-[#5f5f5d] block mb-1">Tracking Number</label>
              <input
                type="text"
                value={newTracking}
                onChange={(e) => setNewTracking(e.target.value)}
                placeholder="TRK-98765432"
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] text-[#1c1c1c] text-xs p-3 rounded-md"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => handleUpdateStatus(updatingOrderId)}
                className="flex-1 bg-[#1c1c1c] hover:bg-[#1c1c1c]/90 text-[#fcfbf8] py-2.5 font-bold uppercase text-xs rounded-md inset-shadow-btn transition-all glow-focus"
              >
                Save Status
              </button>
              <button
                onClick={() => setUpdatingOrderId(null)}
                className="px-4 border border-[#eceae4] text-[#1c1c1c] hover:bg-[#5f5f5d]/10 text-xs font-bold uppercase rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function numberFormat(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num);
}
