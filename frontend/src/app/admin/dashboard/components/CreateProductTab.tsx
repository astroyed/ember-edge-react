'use client';

import { useState, type FormEvent } from 'react';
import { AlertCircle, Boxes, CheckCircle2, Image as ImageIcon, PackagePlus, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Category } from './types';

interface CreateProductTabProps {
  categories: Category[];
  onCreated: () => void;
}

const inputClassName = 'mt-2 min-h-12 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed] px-4 py-3 text-sm text-[#1c1c1c] outline-none transition placeholder:text-[#5f5f5d] hover:border-[#1c1c1c]/40 focus:border-[#1c1c1c]/40 focus:ring-2 focus:ring-[#1c1c1c]/10';
type Notification = { type: 'success' | 'error'; message: string } | null;

export default function CreateProductTab({ categories, onCreated }: CreateProductTabProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [price, setPrice] = useState('4500');
  const [salePrice, setSalePrice] = useState('3000');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [color, setColor] = useState('Black');
  const [size, setSize] = useState('M');
  const [featured, setFeatured] = useState(true);
  const [newArrival, setNewArrival] = useState(true);
  const [stock, setStock] = useState('25');
  const [notification, setNotification] = useState<Notification>(null);

  const createProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotification(null);

    try {
      const sku = `EE-${color.substring(0, 3).toUpperCase()}-${size.toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category_id', String(categoryId));
      formData.append('price', price);
      formData.append('sale_price', salePrice);
      formData.append('description', description);
      formData.append('is_featured', featured ? '1' : '0');
      formData.append('is_new_arrival', newArrival ? '1' : '0');
      formData.append('variants[0][color]', color);
      formData.append('variants[0][size]', size);
      formData.append('variants[0][sku]', sku);
      formData.append('variants[0][stock_quantity]', stock);
      if (image) formData.append('image', image);

      const response = await api.createAdminProduct(formData);

      if (response.success) {
        setNotification({ type: 'success', message: 'Product created successfully!' });
        setName('');
        setDescription('');
        onCreated();
      } else {
        setNotification({ type: 'error', message: response.message || 'Failed to create product.' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: error instanceof Error ? error.message : 'Failed to create product.' });
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 animate-fadeIn">
      {notification && (
        <div
          role={notification.type === 'error' ? 'alert' : 'status'}
          aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
          className={`fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-md items-start gap-3 rounded-lg border p-4 text-sm font-semibold shadow-lg ${notification.type === 'success' ? 'border-green-700/25 bg-green-50 text-green-800' : 'border-red-700/25 bg-red-50 text-red-800'}`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}
          <p className="min-w-0 flex-1">{notification.message}</p>
          <button type="button" onClick={() => setNotification(null)} aria-label="Dismiss notification" className="shrink-0 rounded p-1 transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-current/30">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
      <header className="flex items-center gap-4 rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-5 sm:p-7">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#eceae4] bg-[#1c1c1c]/[0.03] text-[#1c1c1c]">
          <PackagePlus className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#5f5f5d]">Product catalog</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.5px] text-[#1c1c1c] sm:text-3xl">Add a new product</h2>
          <p className="mt-1 text-sm text-[#5f5f5d]">Enter the product details and set up its first inventory variant.</p>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-[#eceae4] bg-[#f3efe6]">
        <form onSubmit={createProduct} className="space-y-8 bg-gradient-to-br from-[#f3efe6] via-[#f7f4ed] to-[#f0ece2] p-5 sm:p-8">
          <section aria-labelledby="product-details-heading" className="space-y-5">
            <div className="border-b border-[#e3e0d9] pb-3">
              <h3 id="product-details-heading" className="text-sm font-extrabold uppercase tracking-wider text-[#1c1c1c]">Product details</h3>
              <p className="mt-1 text-xs text-[#5f5d57]">Name, category, pricing, and storefront information.</p>
            </div>
            <label className="block text-sm text-[#292824]">
              Product name <span className="text-[#a33b2b]">*</span>
              <input type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Minimalist Linen Shirt" className={inputClassName} />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm text-[#292824]">
                Category <span className="text-[#a33b2b">*</span>
                <select required value={categoryId} onChange={(event) => setCategoryId(Number(event.target.value))} className={inputClassName}>
                  {categories.length === 0 && <option value="">No categories available</option>}
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <label className="block text-sm text-[#292824]">
                Actual Price (PKR) <span className="text-[#a33b2b">*</span>
                <input type="number" required min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="4500" className={inputClassName} />
              </label>
              <label className="block text-sm text-[#292824]">
                Sale Price (PKR) <span className="text-[#a33b2b">*</span>
                <input type="number" required min="0" step="0.01" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} placeholder="3000" className={inputClassName} />
              </label>

              <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
                <button type="button" role="switch" aria-checked={featured} onClick={() => setFeatured((current) => !current)} className="flex min-h-12 items-center justify-between rounded-md border border-[#eceae4] bg-[#f7f4ed] px-4 text-sm text-[#1c1c1c] transition hover:border-[#1c1c1c]/40 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20">
                  Featured
                  <span aria-hidden="true" className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition-colors ${featured ? 'bg-[#e58a2b]' : 'bg-[#d4d0c7]'}`}>
                    <span className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${featured ? 'translate-x-5' : 'translate-x-0'}`} />
                  </span>
                </button>
                <button type="button" role="switch" aria-checked={newArrival} onClick={() => setNewArrival((current) => !current)} className="flex min-h-12 items-center justify-between rounded-md border border-[#eceae4] bg-[#f7f4ed] px-4 text-sm text-[#1c1c1c] transition hover:border-[#1c1c1c]/40 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/20">
                  New Arrival
                  <span aria-hidden="true" className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition-colors ${newArrival ? 'bg-[#e58a2b]' : 'bg-[#d4d0c7]'}`}>
                    <span className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${newArrival ? 'translate-x-5' : 'translate-x-0'}`} />
                  </span>
                </button>
              </div>
            </div>
            
          
            <label className="block text-sm text-[#292824]">
              Product image
              <span className="mt-1 block text-xs font-normal text-[#5f5d57]">Choose an image file to upload.</span>
              <span className="relative mt-2 block">
                <ImageIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66635d]" aria-hidden="true" />
                <input type="file" accept="image/*" required onChange={(event) => setImage(event.target.files?.[0] ?? null)} className={`${inputClassName} mt-0 pl-11`} />
              </span>
            </label>
            <label className="block text-sm text-[#292824]">
              Description
              <textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the materials, fit, and key product details..." className={`${inputClassName} min-h-28 resize-y`} />
            </label>
          </section>

          <section aria-labelledby="variant-heading" className="space-y-5 rounded-xl border border-[#eceae4] bg-[#1c1c1c]/[0.02] p-5 sm:p-6">
            <div className="flex items-start gap-3 border-b border-[#eceae4] pb-3">
              <Boxes className="mt-0.5 h-5 w-5 shrink-0 text-[#5f5f5d]" aria-hidden="true" />
              <div>
                <h3 id="variant-heading" className="text-sm font-extrabold uppercase tracking-wider text-[#1c1c1c]">Initial variant &amp; stock</h3>
                <p className="mt-1 text-xs text-[#5f5f5d]">This creates the first color/size option available for purchase.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm text-[#292824]">
                Color
                <input value={color} onChange={(event) => setColor(event.target.value)} placeholder="Black" className={inputClassName} />
              </label>
              <label className="block text-sm text-[#292824]">
                Size
                <input value={size} onChange={(event) => setSize(event.target.value)} placeholder="M" className={inputClassName} />
              </label>
              <label className="block text-sm text-[#292824]">
                Stock quantity
                <input type="number" min="0" value={stock} onChange={(event) => setStock(event.target.value)} className={inputClassName} />
              </label>
            </div>
          </section>

          <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-[#eceae4] pt-6 sm:flex-row sm:items-center">
            <p className="text-xs text-[#5f5f5d]">Fields marked <span className="font-semibold text-[#1c1c1c]">*</span> are required.</p>
            <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#1c1c1c] px-6 py-2.5 text-sm text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px] transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]/30">
              <PackagePlus className="h-4 w-4" aria-hidden="true" />
              Create product
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
