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
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between border-b border-[#eceae4] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">ADMIN CONTROL CENTER</span>
          <h1 className="font-serif text-3xl font-black uppercase text-[#1c1c1c]">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="rounded-full border border-[#e58a2b]/30 bg-[#e58a2b]/10 px-3 py-1 text-xs font-bold uppercase text-[#e58a2b]">
            ROLE: {user.role.toUpperCase()}
          </span>
          <button onClick={() => void loadAdminData()} className="rounded-md border border-[#eceae4] bg-[#f7f4ed] p-2 text-[#1c1c1c] transition-colors hover:bg-[#5f5f5d]/10" title="Refresh Data" aria-label="Refresh dashboard data">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </header>

      <nav aria-label="Dashboard sections" className="flex flex-wrap gap-2 border-b border-[#eceae4] pb-4">
        {TABS.map((tab) => {
          const count = tab.id === 'orders' ? orders.length : tab.id === 'products' ? products.length : tab.id === 'banners' ? banners.length : null;
          const selected = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} aria-current={selected ? 'page' : undefined}
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${selected ? 'bg-[#1c1c1c] text-[#fcfbf8]' : 'bg-[#5f5f5d]/10 text-[#5f5f5d] hover:text-[#1c1c1c]'}`}>
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
