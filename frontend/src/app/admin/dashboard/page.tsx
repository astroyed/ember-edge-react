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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-zinc-400">
        Verifying role credentials...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">ADMIN CONTROL CENTER</span>
          <h1 className="text-3xl font-black uppercase text-white font-serif">Ember Edge Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 uppercase rounded border border-amber-500/30">
            ROLE: {user.role.toUpperCase()}
          </span>
          <button
            onClick={loadAdminData}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 p-2 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-zinc-900 pb-4">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'stats' ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          Stats & Revenue
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'orders' ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          Manage Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'products' ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          Product Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('create_product')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1 ${
            activeTab === 'create_product' ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white'
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
            <div className="bg-zinc-950 border border-zinc-850 p-6 space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Sales Revenue</span>
              <p className="text-2xl font-mono font-bold text-amber-400">Rs. {numberFormat(stats.total_revenue || 0)}</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-850 p-6 space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Orders</span>
              <p className="text-2xl font-mono font-bold text-white">{stats.total_orders || 0}</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-850 p-6 space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pending Orders</span>
              <p className="text-2xl font-mono font-bold text-yellow-400">{stats.pending_orders || 0}</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-850 p-6 space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Products</span>
              <p className="text-2xl font-mono font-bold text-white">{stats.total_products || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Orders */}
      {activeTab === 'orders' && (
        <div className="bg-zinc-950 border border-zinc-850 p-6 space-y-6 animate-fadeIn">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
            Customer Orders & Status Fulfillment
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800 text-white uppercase font-mono">
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 font-mono">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-900/50">
                    <td className="p-3 font-bold text-amber-400">{ord.order_number}</td>
                    <td className="p-3 font-sans">
                      {ord.user ? ord.user.name : (ord.shipping_address?.first_name || 'Guest')}
                      <span className="block text-[10px] text-zinc-500 font-mono">{ord.shipping_address?.email || ord.guest_email}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-zinc-900 text-amber-400 border border-amber-500/30">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 uppercase font-sans text-zinc-400">
                      {ord.payment_method} ({ord.payment_status})
                    </td>
                    <td className="p-3 text-white font-bold">Rs. {numberFormat(ord.total_amount)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setUpdatingOrderId(ord.id);
                          setNewStatus(ord.status);
                          setNewTracking(ord.tracking_number || '');
                        }}
                        className="bg-amber-500 text-black px-3 py-1 font-sans font-bold text-[10px] uppercase hover:bg-amber-400"
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
        <div className="bg-zinc-950 border border-zinc-850 p-6 space-y-6 animate-fadeIn">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
            Product Catalog Inventory
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800 text-white uppercase font-mono">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Base Price</th>
                  <th className="p-3">Variants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-900/50">
                    <td className="p-3 font-bold text-white uppercase">{p.name}</td>
                    <td className="p-3 text-zinc-400">{p.category?.name || 'Category'}</td>
                    <td className="p-3 font-mono text-amber-400">Rs. {numberFormat(p.price)}</td>
                    <td className="p-3 font-mono text-xs">
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
        <div className="bg-zinc-950 border border-zinc-850 p-6 sm:p-8 space-y-6 max-w-2xl animate-fadeIn">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
            Create New Product & Variant Matrix
          </h2>

          {prodMsg && (
            <div className={`p-3 border text-xs ${prodMsg.includes('success') ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-red-900/30 border-red-700 text-red-300'}`}>
              {prodMsg}
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="e.g. Minimalist Linen Shirt"
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 block mb-1">Category *</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Price (PKR) *</label>
                <input
                  type="number"
                  required
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Image URL</label>
              <input
                type="text"
                value={newProdImg}
                onChange={(e) => setNewProdImg(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Description</label>
              <textarea
                rows={3}
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2 border-t border-zinc-900 grid grid-cols-3 gap-3">
              <div>
                <label className="text-zinc-400 block mb-1">Initial Color</label>
                <input
                  type="text"
                  value={variantColor}
                  onChange={(e) => setVariantColor(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Initial Size</label>
                <input
                  type="text"
                  value={variantSize}
                  onChange={(e) => setVariantSize(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={variantStock}
                  onChange={(e) => setVariantStock(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3.5 text-xs font-bold uppercase tracking-wider"
            >
              Create Product & Seed Variant
            </button>
          </form>
        </div>
      )}

      {/* Modal for Order Status Update */}
      {updatingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-zinc-950 border border-zinc-800 p-6 max-w-md w-full space-y-4">
            <h3 className="text-xs font-bold uppercase text-white">Update Order Status</h3>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs p-3"
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
              <label className="text-xs text-zinc-400 block mb-1">Tracking Number</label>
              <input
                type="text"
                value={newTracking}
                onChange={(e) => setNewTracking(e.target.value)}
                placeholder="TRK-98765432"
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs p-3"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => handleUpdateStatus(updatingOrderId)}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-black py-2.5 font-bold uppercase text-xs"
              >
                Save Status
              </button>
              <button
                onClick={() => setUpdatingOrderId(null)}
                className="px-4 bg-zinc-800 text-white text-xs font-bold uppercase"
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
