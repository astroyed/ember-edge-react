'use client';

import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import type { Category } from './types';

interface CreateProductTabProps {
  categories: Category[];
  onCreated: () => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800';

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
    <section className="max-w-2xl space-y-6 rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-6 sm:p-8 animate-fadeIn">
      <h2 className="border-b border-[#eceae4] pb-3 text-xs font-bold uppercase tracking-wider text-[#1c1c1c]">
        Create New Product &amp; Variant Matrix
      </h2>
      {message && (
        <p role="status" className={`rounded-lg border p-3 text-xs ${message.includes('success') ? 'border-[#e58a2b]/30 bg-[#e58a2b]/10 text-[#e58a2b]' : 'border-red-500/30 bg-red-500/10 text-red-600'}`}>
          {message}
        </p>
      )}
      <form onSubmit={createProduct} className="space-y-4 text-xs">
        <label className="block text-[#5f5f5d]">
          Product Title *
          <input type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Minimalist Linen Shirt" className="mt-1 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed]/50 p-3 text-[#1c1c1c] focus:border-[#e58a2b] focus:outline-none" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-[#5f5f5d]">
            Category *
            <select value={categoryId} onChange={(event) => setCategoryId(Number(event.target.value))} className="mt-1 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed]/50 p-3 text-[#1c1c1c]">
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label className="block text-[#5f5f5d]">
            Price (PKR) *
            <input type="number" required min="0" value={price} onChange={(event) => setPrice(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed]/50 p-3 text-[#1c1c1c]" />
          </label>
        </div>
        <label className="block text-[#5f5f5d]">
          Image URL
          <input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed]/50 p-3 text-[#1c1c1c]" />
        </label>
        <label className="block text-[#5f5f5d]">
          Description
          <textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed]/50 p-3 text-[#1c1c1c]" />
        </label>
        <div className="grid grid-cols-3 gap-3 border-t border-[#eceae4] pt-4">
          <label className="text-[#5f5f5d]">Initial Color<input value={color} onChange={(event) => setColor(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed]/50 p-2.5 text-[#1c1c1c]" /></label>
          <label className="text-[#5f5f5d]">Initial Size<input value={size} onChange={(event) => setSize(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed]/50 p-2.5 text-[#1c1c1c]" /></label>
          <label className="text-[#5f5f5d]">Stock Quantity<input type="number" min="0" value={stock} onChange={(event) => setStock(event.target.value)} className="mt-1 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed]/50 p-2.5 text-[#1c1c1c]" /></label>
        </div>
        <button type="submit" className="w-full rounded-md bg-[#1c1c1c] py-3.5 text-xs font-bold uppercase tracking-wider text-[#fcfbf8] transition-all hover:bg-[#1c1c1c]/90">
          Create Product &amp; Seed Variant
        </button>
      </form>
    </section>
  );
}
