'use client';

import { useState, type FormEvent } from 'react';
import { Boxes, Image as ImageIcon, PackagePlus } from 'lucide-react';
import { api } from '@/lib/api';
import type { Category } from './types';

interface CreateProductTabProps {
  categories: Category[];
  onCreated: () => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800';
const inputClassName = 'mt-2 min-h-12 w-full rounded-lg border border-[#c9c6bd] bg-white px-4 py-3 text-sm text-[#1c1c1c] shadow-sm outline-none transition placeholder:text-[#77756f] hover:border-[#8e8b83] focus:border-[#b86512] focus:ring-2 focus:ring-[#e58a2b]/25';

export default function CreateProductTab({ categories, onCreated }: CreateProductTabProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [price, setPrice] = useState('4500');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [color, setColor] = useState('Black');
  const [size, setSize] = useState('M');
  const [stock, setStock] = useState('25');
  const [message, setMessage] = useState('');

  const createProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    try {
      const sku = `EE-${color.substring(0, 3).toUpperCase()}-${size.toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
      const response = await api.createAdminProduct({
        name,
        category_id: categoryId,
        price: Number.parseFloat(price),
        description,
        image_url: imageUrl,
        variants: [{ color, size, sku, stock_quantity: Number.parseInt(stock, 10) }],
      });

      if (response.success) {
        setMessage('Product created successfully!');
        setName('');
        setDescription('');
        onCreated();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to create product.');
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 animate-fadeIn">
      <header className="flex items-center gap-4 rounded-2xl border border-[#d8d3c8] bg-white p-5 shadow-sm sm:p-7">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e58a2b]/15 text-[#9a4e0b]">
          <PackagePlus className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#a6570d]">Product catalog</p>
          <h2 className="mt-1 font-serif text-2xl font-black text-[#1c1c1c] sm:text-3xl">Add a new product</h2>
          <p className="mt-1 text-sm text-[#55534e]">Enter the product details and set up its first inventory variant.</p>
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-[#d8d3c8] bg-white shadow-[0_12px_32px_rgba(28,28,28,0.08)]">
        {message && (
          <p role="status" className={`m-5 rounded-lg border p-4 text-sm font-semibold sm:mx-8 sm:mt-8 ${message.includes('success') ? 'border-green-700/25 bg-green-50 text-green-800' : 'border-red-700/25 bg-red-50 text-red-800'}`}>
            {message}
          </p>
        )}
        <form onSubmit={createProduct} className="space-y-8 p-5 sm:p-8">
          <section aria-labelledby="product-details-heading" className="space-y-5">
            <div className="border-b border-[#e3e0d9] pb-3">
              <h3 id="product-details-heading" className="text-sm font-extrabold uppercase tracking-wider text-[#1c1c1c]">Product details</h3>
              <p className="mt-1 text-xs text-[#5f5d57]">Name, category, pricing, and storefront information.</p>
            </div>
            <label className="block text-sm font-bold text-[#292824]">
              Product name <span className="text-[#a33b2b]">*</span>
              <input type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Minimalist Linen Shirt" className={inputClassName} />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-bold text-[#292824]">
                Category <span className="text-[#a33b2b">*</span>
                <select required value={categoryId} onChange={(event) => setCategoryId(Number(event.target.value))} className={inputClassName}>
                  {categories.length === 0 && <option value="">No categories available</option>}
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <label className="block text-sm font-bold text-[#292824]">
                Price (PKR) <span className="text-[#a33b2b">*</span>
                <input type="number" required min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="4500" className={inputClassName} />
              </label>
            </div>
            <label className="block text-sm font-bold text-[#292824]">
              Product image URL
              <span className="mt-1 block text-xs font-normal text-[#5f5d57]">Paste a publicly accessible image link.</span>
              <span className="relative mt-2 block">
                <ImageIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66635d]" aria-hidden="true" />
                <input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className={`${inputClassName} mt-0 pl-11`} />
              </span>
            </label>
            <label className="block text-sm font-bold text-[#292824]">
              Description
              <textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the materials, fit, and key product details..." className={`${inputClassName} min-h-28 resize-y`} />
            </label>
          </section>

          <section aria-labelledby="variant-heading" className="space-y-5 rounded-xl border border-[#e5c99f] bg-[#fff9ef] p-5 sm:p-6">
            <div className="flex items-start gap-3 border-b border-[#ead8bc] pb-3">
              <Boxes className="mt-0.5 h-5 w-5 shrink-0 text-[#94500f]" aria-hidden="true" />
              <div>
                <h3 id="variant-heading" className="text-sm font-extrabold uppercase tracking-wider text-[#1c1c1c]">Initial variant &amp; stock</h3>
                <p className="mt-1 text-xs text-[#5f5141]">This creates the first color/size option available for purchase.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-bold text-[#292824]">
                Color
                <input value={color} onChange={(event) => setColor(event.target.value)} placeholder="Black" className={inputClassName} />
              </label>
              <label className="block text-sm font-bold text-[#292824]">
                Size
                <input value={size} onChange={(event) => setSize(event.target.value)} placeholder="M" className={inputClassName} />
              </label>
              <label className="block text-sm font-bold text-[#292824]">
                Stock quantity
                <input type="number" min="0" value={stock} onChange={(event) => setStock(event.target.value)} className={inputClassName} />
              </label>
            </div>
          </section>

          <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-[#e3e0d9] pt-6 sm:flex-row sm:items-center">
            <p className="text-xs text-[#5f5d57]">Fields marked <span className="font-bold text-[#a33b2b">*</span> are required.</p>
            <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#a6570d] px-7 py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-md transition hover:bg-[#854407] focus:outline-none focus:ring-4 focus:ring-[#e58a2b]/35">
              <PackagePlus className="h-4 w-4" aria-hidden="true" />
              Create product
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
