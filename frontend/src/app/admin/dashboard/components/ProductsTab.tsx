import { useState, type FormEvent } from 'react';
import { Pencil, Save, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Category, DashboardProduct } from './types';

interface ProductsTabProps {
  products: DashboardProduct[];
  categories: Category[];
  onRefresh: () => void;
}

export default function ProductsTab({ products, categories, onRefresh }: ProductsTabProps) {
  const inputClassName = 'mt-2 min-h-11 w-full rounded-md border border-[#eceae4] bg-[#f7f4ed] px-3 py-2 text-sm text-[#1c1c1c] outline-none focus:border-[#1c1c1c]/40 focus:ring-2 focus:ring-[#1c1c1c]/10';

  const [editingProduct, setEditingProduct] = useState<DashboardProduct | null>(null);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const openEditDialog = (product: DashboardProduct) => {
    setEditingProduct(product);
    setName(product.name);
    setCategoryId(String(product.category_id));
    setPrice(String(product.price));
    setSalePrice(product.sale_price == null ? '' : String(product.sale_price));
    setDescription(product.description || '');
    setImage(null);
    setMessage('');
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProduct) return;

    setSaving(true);
    setMessage('');
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', name);
    formData.append('category_id', categoryId);
    formData.append('price', price);
    formData.append('sale_price', salePrice);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      const response = await api.updateAdminProduct(editingProduct.id, formData);
      if (!response.success) throw new Error(response.message || 'Unable to update product.');
      setEditingProduct(null);
      setMessage('Product updated successfully.');
      onRefresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update product.');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product: DashboardProduct) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    setDeletingId(product.id);
    setMessage('');
    try {
      const response = await api.deleteAdminProduct(product.id);
      if (!response.success) throw new Error(response.message || 'Unable to delete product.');
      setMessage('Product deleted successfully.');
      onRefresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="font-serif text-2xl font-semibold tracking-[-0.5px] text-[#1c1c1c]">Product inventory</h2>
        <p className="mt-2 text-sm text-[#5f5f5d]">Catalog, pricing, and available variants.</p>
      </header>
      {message && (
        <p role="status" className={`rounded-md border px-4 py-3 text-sm ${message.includes('successfully') ? 'border-green-700/25 bg-green-50 text-green-800' : 'border-red-700/25 bg-red-50 text-red-800'}`}>
          {message}
        </p>
      )}
      <div className="overflow-hidden rounded-xl border border-[#eceae4] bg-[#f7f4ed]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#1c1c1c]">
          <thead>
            <tr className="border-b border-[#eceae4] bg-[#1c1c1c]/[0.03] font-sans text-[11px] font-semibold uppercase tracking-wider text-[#5f5f5d]">
              <th className="p-3">Product Name</th><th className="p-3">Category</th>
              <th className="p-3">Base Price</th><th className="p-3">Variants</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eceae4] text-sm">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-[#1c1c1c]/[0.025]">
                <td className="p-4 font-medium text-[#1c1c1c]">{product.name}</td>
                <td className="p-4 text-[#5f5f5d]">{product.category?.name || 'Category'}</td>
                <td className="whitespace-nowrap p-4 font-medium text-[#1c1c1c]">Rs. {numberFormat(product.price)}</td>
                <td className="p-4 text-xs text-[#5f5f5d]">
                  {product.variants?.map((variant) => `${variant.color}/${variant.size} (${variant.stock_quantity})`).join(', ')}
                </td>
                <td className="whitespace-nowrap p-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditDialog(product)}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-[#1c1c1c]/20 px-3 text-xs font-semibold text-[#1c1c1c] hover:bg-[#1c1c1c]/[0.04]"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteProduct(product)}
                      disabled={deletingId === product.id}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-red-800/20 px-3 text-xs font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {deletingId === product.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length === 0 && <p className="border-t border-[#eceae4] px-6 py-12 text-center text-sm text-[#5f5f5d]">No products in the catalog yet.</p>}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditingProduct(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="edit-product-title" className="my-auto w-full max-w-2xl rounded-lg border border-[#eceae4] bg-[#f7f4ed] shadow-2xl">
            <header className="flex items-center justify-between border-b border-[#eceae4] px-5 py-4 sm:px-6">
              <div>
                <h3 id="edit-product-title" className="font-serif text-xl font-semibold text-[#1c1c1c]">Edit product</h3>
                <p className="mt-1 text-xs text-[#5f5f5d]">Update catalog details or replace the product image.</p>
              </div>
              <button type="button" onClick={() => setEditingProduct(null)} className="rounded-md p-2 text-[#5f5f5d] hover:bg-[#1c1c1c]/[0.05]" aria-label="Close edit dialog">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>
            <form onSubmit={saveProduct} className="space-y-4 p-5 sm:p-6">
              <label className="block text-sm font-medium text-[#292824]">
                Product name
                <input required maxLength={255} value={name} onChange={(event) => setName(event.target.value)} className={inputClassName} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#292824]">
                  Category
                  <select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className={inputClassName}>
                    {categories.length === 0 && <option value={categoryId}>{editingProduct.category?.name || 'Current category'}</option>}
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-medium text-[#292824]">
                  Price (PKR)
                  <input type="number" required min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} className={inputClassName} />
                </label>
              </div>
              <label className="block text-sm font-medium text-[#292824]">
                Sale price (PKR)
                <input type="number" min="0" step="0.01" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} className={inputClassName} />
              </label>
              <label className="block text-sm font-medium text-[#292824]">
                Description
                <textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className={`${inputClassName} resize-y`} />
              </label>
              <label className="block text-sm font-medium text-[#292824]">
                Replace image <span className="font-normal text-[#5f5f5d]">(optional)</span>
                <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} className={inputClassName} />
              </label>
              <footer className="flex justify-end gap-3 border-t border-[#eceae4] pt-4">
                <button type="button" onClick={() => setEditingProduct(null)} className="min-h-10 rounded-md border border-[#1c1c1c]/20 px-4 text-sm font-medium text-[#1c1c1c] hover:bg-[#1c1c1c]/[0.04]">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#1c1c1c] px-4 text-sm font-semibold text-[#fcfbf8] hover:opacity-85 disabled:opacity-50">
                  <Save className="h-4 w-4" aria-hidden="true" />
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

function numberFormat(value: number): string {
  return new Intl.NumberFormat('en-PK').format(value);
}
