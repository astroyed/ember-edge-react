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
const inputClassName = 'mt-2 min-h-12 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed] px-4 py-3 text-sm text-[#1c1c1c] outline-none transition placeholder:text-[#5f5f5d] hover:border-[#1c1c1c]/40 focus:border-[#1c1c1c]/40 focus:ring-2 focus:ring-[#1c1c1c]/10';

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
        {message && (
          <p role="status" className={`m-5 rounded-lg border p-4 text-sm font-semibold sm:mx-8 sm:mt-8 ${message.includes('success') ? 'border-green-700/25 bg-green-50 text-green-800' : 'border-red-700/25 bg-red-50 text-red-800'}`}>
            {message}
          </p>
        )}
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
                Price (PKR) <span className="text-[#a33b2b">*</span>
                <input type="number" required min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="4500" className={inputClassName} />
              </label>
            </div>
            <label className="block text-sm text-[#292824]">
              Product image URL
              <span className="mt-1 block text-xs font-normal text-[#5f5d57]">Paste a publicly accessible image link.</span>
              <span className="relative mt-2 block">
                <ImageIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66635d]" aria-hidden="true" />
                <input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className={`${inputClassName} mt-0 pl-11`} />
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
