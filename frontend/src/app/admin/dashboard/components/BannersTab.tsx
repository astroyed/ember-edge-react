'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle, Edit, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { FALLBACK_BANNER_IMAGE, resolveBannerImageSrc } from '@/lib/banner-image';
import type { Banner } from './types';

interface BannersTabProps {
  banners: Banner[];
  loading: boolean;
  loadError: string;
  onRefresh: () => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600';

export default function BannersTab({ banners, loading, loadError, onRefresh }: BannersTabProps) {
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [buttonText, setButtonText] = useState('Shop Now');
  const [buttonUrl, setButtonUrl] = useState('/shop');
  const [position, setPosition] = useState(0);
  const [active, setActive] = useState(true);
  const [message, setMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const resetForm = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setImage(DEFAULT_IMAGE);
    setButtonText('Shop Now');
    setButtonUrl('/shop');
    setPosition(0);
    setActive(true);
    setMessage('');
  };

  const createBanner = () => {
    resetForm();
    setFormOpen(true);
  };

  const editBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || '');
    setImage(banner.image_path);
    setButtonText(banner.button_text || 'Shop Now');
    setButtonUrl(banner.button_url || '/shop');
    setPosition(banner.position || 0);
    setActive(Boolean(banner.is_active));
    setMessage('');
    setFormOpen(true);
  };

  const saveBanner = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    const data = {
      title,
      subtitle,
      image_path: image,
      button_text: buttonText,
      button_url: buttonUrl,
      position,
      is_active: active,
    };

    try {
      const response = editingBanner
        ? await api.updateBanner(editingBanner.id, data)
        : await api.createBanner(data);

      if (response.success) {
        setMessage(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!');
        setFormOpen(false);
        resetForm();
        onRefresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save banner.');
    }
  };

  const deleteBanner = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const response = await api.deleteBanner(id);
      if (response.success) onRefresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete banner.');
    }
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1c]">Homepage Banners</h2>
          <p className="mt-1 text-xs text-[#5f5f5d]">Manage the banners displayed in the storefront.</p>
        </div>
        <button type="button" onClick={createBanner} className="inline-flex items-center gap-2 rounded-md bg-[#1c1c1c] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#fcfbf8] transition-colors hover:bg-[#1c1c1c]/80">
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </header>

      {loadError && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600">{loadError}</p>}

      {formOpen && (
        <div className="rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-6 sm:p-8">
          <h3 className="mb-5 border-b border-[#eceae4] pb-3 text-xs font-bold uppercase tracking-wider text-[#1c1c1c]">
            {editingBanner ? 'Edit Banner' : 'Create Banner'}
          </h3>
          {message && <p role="status" className={`mb-4 rounded-lg border p-3 text-xs ${message.includes('success') ? 'border-[#e58a2b]/30 bg-[#e58a2b]/10 text-[#e58a2b]' : 'border-red-500/30 bg-red-500/10 text-red-600'}`}>{message}</p>}
          <form onSubmit={saveBanner} className="grid gap-4 text-xs sm:grid-cols-2">
            <label htmlFor="banner-title" className="text-[#5f5f5d]">Title *<input id="banner-title" required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-white/50 p-3 text-[#1c1c1c] focus:border-[#e58a2b] focus:outline-none" /></label>
            <label htmlFor="banner-subtitle" className="text-[#5f5f5d]">Subtitle<input id="banner-subtitle" value={subtitle} onChange={(event) => setSubtitle(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-white/50 p-3 text-[#1c1c1c] focus:border-[#e58a2b] focus:outline-none" /></label>
            <label htmlFor="banner-image" className="text-[#5f5f5d] sm:col-span-2">Image URL *<input id="banner-image" type="url" required value={image} onChange={(event) => setImage(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-white/50 p-3 text-[#1c1c1c] focus:border-[#e58a2b] focus:outline-none" /></label>
            <label htmlFor="banner-button-text" className="text-[#5f5f5d]">Button Text<input id="banner-button-text" value={buttonText} onChange={(event) => setButtonText(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-white/50 p-3 text-[#1c1c1c]" /></label>
            <label htmlFor="banner-button-url" className="text-[#5f5f5d]">Button URL<input id="banner-button-url" value={buttonUrl} onChange={(event) => setButtonUrl(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-white/50 p-3 text-[#1c1c1c]" /></label>
            <label htmlFor="banner-position" className="text-[#5f5f5d]">Display Position<input id="banner-position" type="number" min="0" value={position} onChange={(event) => setPosition(Number(event.target.value))} className="mt-1 w-full rounded-md border border-[#eceae4] bg-white/50 p-3 text-[#1c1c1c]" /></label>
            <label className="flex items-center gap-2 self-end pb-3 text-[#1c1c1c]"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} className="accent-[#e58a2b]" />Active on storefront</label>
            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" className="rounded-md bg-[#1c1c1c] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#fcfbf8] hover:bg-[#1c1c1c]/80">{editingBanner ? 'Save Changes' : 'Create Banner'}</button>
              <button type="button" onClick={() => { setFormOpen(false); setMessage(''); }} className="rounded-md border border-[#eceae4] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#1c1c1c] hover:bg-[#5f5f5d]/10">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-10 text-center text-sm text-[#5f5f5d]">Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="rounded-xl border border-[#eceae4] bg-[#f7f4ed] px-6 py-12 text-center">
          <ImageIcon aria-hidden="true" className="mx-auto mb-3 h-8 w-8 text-[#5f5f5d]" />
          <p className="text-sm font-bold text-[#1c1c1c]">No banners found</p>
          <p className="mt-1 text-xs text-[#5f5f5d]">Add a banner to feature it on your storefront.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {banners.map((banner) => (
            <article key={banner.id} className="overflow-hidden rounded-xl border border-[#eceae4] bg-[#f7f4ed]">
              <div className="h-40 bg-[#eceae4]"><img src={resolveBannerImageSrc(banner.image_path)} alt={banner.title ? `${banner.title} banner` : 'Banner'} className="h-full w-full object-cover object-center" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_BANNER_IMAGE; }} /></div>
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><h3 className="font-bold text-[#1c1c1c]">{banner.title}</h3>{banner.subtitle && <p className="mt-1 text-xs text-[#5f5f5d]">{banner.subtitle}</p>}</div>
                  <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${banner.is_active ? 'border-green-600/20 bg-green-600/10 text-green-700' : 'border-[#5f5f5d]/20 bg-[#5f5f5d]/10 text-[#5f5f5d]'}`}>
                    {banner.is_active && <CheckCircle className="h-3 w-3" />}{banner.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-[11px] text-[#5f5f5d]">Position: {banner.position} · Button: {banner.button_text || 'Shop Now'}</p>
                <div className="flex gap-2 border-t border-[#eceae4] pt-3">
                  <button type="button" onClick={() => editBanner(banner)} className="inline-flex items-center gap-1.5 rounded-md border border-[#eceae4] px-3 py-2 text-[10px] font-bold uppercase text-[#1c1c1c] hover:bg-[#5f5f5d]/10"><Edit className="h-3.5 w-3.5" /> Edit</button>
                  <button type="button" onClick={() => deleteBanner(banner.id)} className="inline-flex items-center gap-1.5 rounded-md border border-red-500/20 px-3 py-2 text-[10px] font-bold uppercase text-red-600 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
