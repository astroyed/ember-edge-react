'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import BannersTab from './components/BannersTab';
import CreateProductTab from './components/CreateProductTab';
import OrdersTab from './components/OrdersTab';
import ProductsTab from './components/ProductsTab';
import StatsTab from './components/StatsTab';
import type { DashboardOrder, DashboardProduct, DashboardStats, DashboardTab, Banner, Category } from './components/types';

const TABS: Array<{ id: DashboardTab; label: string }> = [
  { id: 'stats', label: 'Stats & Revenue' },
  { id: 'orders', label: 'Manage Orders' },
  { id: 'products', label: 'Product Inventory' },
  { id: 'banners', label: 'Banners' },
  { id: 'create_product', label: 'Add Product' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('stats');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerLoadError, setBannerLoadError] = useState('');

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    const [statsResult, ordersResult, productsResult, categoriesResult, bannersResult] = await Promise.allSettled([
      api.getAdminStats(),
      api.getAdminOrders(),
      api.getAdminProducts(),
      api.getCategories(),
      api.getAdminBanners(),
    ]);

    if (statsResult.status === 'fulfilled' && statsResult.value.success) setStats(statsResult.value.data);
    if (ordersResult.status === 'fulfilled' && ordersResult.value.success) {
      setOrders(ordersResult.value.data?.data || ordersResult.value.data || []);
    }
    if (productsResult.status === 'fulfilled' && productsResult.value.success) {
      setProducts(productsResult.value.data?.data || productsResult.value.data || []);
    }
    if (categoriesResult.status === 'fulfilled' && categoriesResult.value.success) {
      setCategories(categoriesResult.value.data || []);
    }
    if (bannersResult.status === 'fulfilled' && bannersResult.value.success) {
      setBanners(Array.isArray(bannersResult.value.data) ? bannersResult.value.data : []);
      setBannerLoadError('');
    } else {
      setBanners([]);
      setBannerLoadError(bannersResult.status === 'rejected' && bannersResult.reason instanceof Error
        ? bannersResult.reason.message
        : 'Unable to load banners. Please try refreshing.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role === 'customer') {
      router.push('/');
      return;
    }
    void loadAdminData();
  }, [authLoading, user, router, loadAdminData]);

  if (authLoading || !user || user.role === 'customer') {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-[#5f5f5d]">Verifying role credentials...</div>;
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-[1200px] space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="flex flex-col justify-between gap-6 border-b border-[#eceae4] pb-8 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f5f5d]">Ember Edge · Administration</span>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-none tracking-[-1.2px] text-[#1c1c1c] sm:text-5xl">Dashboard</h1>
          <p className="mt-3 text-base leading-relaxed text-[#5f5f5d]">A clear view of your store, orders, and inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#eceae4] bg-[#1c1c1c]/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#1c1c1c]">
            {user.role}
          </span>
          <button onClick={() => void loadAdminData()} className="rounded-md border border-[#eceae4] bg-[#f7f4ed] p-2 text-[#1c1c1c] transition-colors hover:bg-[#5f5f5d]/10" title="Refresh Data" aria-label="Refresh dashboard data">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </header>

      <nav aria-label="Dashboard sections" className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = tab.id === 'orders' ? orders.length : tab.id === 'products' ? products.length : tab.id === 'banners' ? banners.length : null;
          const selected = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} aria-current={selected ? 'page' : undefined}
              className={`flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20 ${selected ? 'border-[#1c1c1c] bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset]' : 'border-[#eceae4] bg-[#f7f4ed] text-[#5f5f5d] hover:border-[#1c1c1c]/40 hover:text-[#1c1c1c]'}`}>
              {tab.id === 'create_product' && <Plus className="h-3.5 w-3.5" />}
              {tab.label}{count !== null && ` (${count})`}
            </button>
          );
        })}
      </nav>

      {loading && activeTab !== 'banners' ? (
        <div className="rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-10 text-center text-sm text-[#5f5f5d]">Loading dashboard...</div>
      ) : (
        <>
          {activeTab === 'stats' && <StatsTab stats={stats} />}
          {activeTab === 'orders' && <OrdersTab orders={orders} onRefresh={() => void loadAdminData()} />}
          {activeTab === 'products' && <ProductsTab products={products} />}
          {activeTab === 'banners' && <BannersTab banners={banners} loading={loading} loadError={bannerLoadError} onRefresh={() => void loadAdminData()} />}
          {activeTab === 'create_product' && <CreateProductTab categories={categories} onCreated={() => void loadAdminData()} />}
        </>
      )}
    </main>
  );
}
