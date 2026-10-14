'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { BrandLogo } from '@/components/layout/BrandLogo';
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
  const [loadingTabs, setLoadingTabs] = useState<Partial<Record<DashboardTab, boolean>>>({});
  const [tabErrors, setTabErrors] = useState<Partial<Record<DashboardTab, string>>>({});
  const [loadedTabs, setLoadedTabs] = useState<Partial<Record<DashboardTab, boolean>>>({});
  const loadedTabsRef = useRef(new Set<DashboardTab>());
  const inFlightTabsRef = useRef(new Set<DashboardTab>());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerLoadError, setBannerLoadError] = useState('');

  const loadTabData = useCallback(async (tab: DashboardTab, force = false) => {
    if ((loadedTabsRef.current.has(tab) && !force) || inFlightTabsRef.current.has(tab)) return;

    inFlightTabsRef.current.add(tab);
    setLoadingTabs((current) => ({ ...current, [tab]: true }));
    setTabErrors((current) => ({ ...current, [tab]: undefined }));
    try {
      let succeeded = false;
      switch (tab) {
        case 'stats': {
          const response = await api.getAdminStats();
          if (response.success) {
            setStats(response.data);
            succeeded = true;
          }
          break;
        }
        case 'orders': {
          const response = await api.getAdminOrders();
          if (response.success) {
            setOrders(response.data?.data || response.data || []);
            succeeded = true;
          }
          break;
        }
        case 'products': {
          const [response, categoryResponse] = await Promise.all([
            api.getAdminProducts(),
            api.getCategories().catch(() => null),
          ]);
          if (response.success) {
            setProducts(response.data?.data || response.data || []);
            if (categoryResponse?.success) setCategories(categoryResponse.data || []);
            succeeded = true;
          }
          break;
        }
        case 'banners': {
          const response = await api.getAdminBanners();
          if (response.success) {
            setBanners(Array.isArray(response.data) ? response.data : []);
            setBannerLoadError('');
            succeeded = true;
          }
          break;
        }
        case 'create_product': {
          const response = await api.getCategories();
          if (response.success) {
            setCategories(response.data || []);
            succeeded = true;
          }
          break;
        }
      }

      if (succeeded) {
        loadedTabsRef.current.add(tab);
        setLoadedTabs((current) => ({ ...current, [tab]: true }));
      } else {
        const errorMessage = tab === 'banners'
          ? 'Unable to load banners. Please try refreshing.'
          : `Unable to load ${tab === 'create_product' ? 'categories' : tab}. Please try again.`;
        setTabErrors((current) => ({ ...current, [tab]: errorMessage }));
        if (tab === 'banners') setBannerLoadError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to load dashboard data.';
      setTabErrors((current) => ({ ...current, [tab]: errorMessage }));
      if (tab === 'banners') setBannerLoadError(errorMessage);
    } finally {
      inFlightTabsRef.current.delete(tab);
      setLoadingTabs((current) => ({ ...current, [tab]: false }));
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role === 'customer') {
      router.push('/');
      return;
    }
    const timer = window.setTimeout(() => void loadTabData('stats'), 0);
    return () => window.clearTimeout(timer);
  }, [authLoading, user, router, loadTabData]);

  if (authLoading || !user || user.role === 'customer') {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-[#5f5f5d]">Verifying role credentials...</div>;
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-[1200px] space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="flex flex-col justify-between gap-6 border-b border-[#eceae4] pb-8 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5f5f5d]">Administration</span>
          </div>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-none tracking-[-1.2px] text-[#1c1c1c] sm:text-5xl">Dashboard</h1>
          <p className="mt-3 text-base leading-relaxed text-[#5f5f5d]">A clear view of your store, orders, and inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#eceae4] bg-[#1c1c1c]/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#1c1c1c]">
            {user.role}
          </span>
          <button onClick={() => void loadTabData(activeTab, true)} className="rounded-md border border-[#eceae4] bg-[#f7f4ed] p-2 text-[#1c1c1c] transition-colors hover:bg-[#5f5f5d]/10" title="Refresh Data" aria-label="Refresh current dashboard section">
            <RefreshCw className={`h-4 w-4 ${loadingTabs[activeTab] ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <nav aria-label="Dashboard sections" className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = tab.id === 'orders' ? orders.length : tab.id === 'products' ? products.length : tab.id === 'banners' ? banners.length : null;
          const countLoaded = loadedTabs[tab.id];
          const selected = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); void loadTabData(tab.id); }} aria-current={selected ? 'page' : undefined}
              className={`flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20 ${selected ? 'border-[#1c1c1c] bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset]' : 'border-[#eceae4] bg-[#f7f4ed] text-[#5f5f5d] hover:border-[#1c1c1c]/40 hover:text-[#1c1c1c]'}`}>
              {tab.id === 'create_product' && <Plus className="h-3.5 w-3.5" />}
              {tab.label}{count !== null && ` (${countLoaded ? count : '…'})`}
            </button>
          );
        })}
      </nav>

      {loadingTabs[activeTab] && !loadedTabs[activeTab] && (
        <div role="status" className="rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-10 text-center text-sm text-[#5f5f5d]">
          Loading {activeTab === 'create_product' ? 'categories' : activeTab}…
        </div>
      )}
      {tabErrors[activeTab] && !loadedTabs[activeTab] && (
        <div role="alert" className="rounded-xl border border-red-900/15 bg-[#f7f4ed] p-6 text-sm text-[#1c1c1c]">
          <p>{tabErrors[activeTab]}</p>
          <button onClick={() => void loadTabData(activeTab, true)} className="mt-3 rounded-md border border-[#1c1c1c]/40 px-4 py-2 text-sm hover:bg-[#1c1c1c]/[0.04]">Try again</button>
        </div>
      )}
      {activeTab === 'stats' && loadedTabs.stats && <StatsTab stats={stats} />}
      {activeTab === 'orders' && loadedTabs.orders && <OrdersTab orders={orders} onRefresh={() => { void loadTabData('orders', true); void loadTabData('stats', true); }} />}
      {activeTab === 'products' && loadedTabs.products && (
        <ProductsTab
          products={products}
          categories={categories}
          onRefresh={() => { void loadTabData('products', true); void loadTabData('stats', true); }}
        />
      )}
      {activeTab === 'banners' && (loadedTabs.banners || loadingTabs.banners) && <BannersTab banners={banners} loading={Boolean(loadingTabs.banners)} loadError={bannerLoadError} onRefresh={() => void loadTabData('banners', true)} />}
      {activeTab === 'create_product' && loadedTabs.create_product && <CreateProductTab categories={categories} onCreated={() => { void loadTabData('products', true); void loadTabData('stats', true); }} />}
    </main>
  );
}
