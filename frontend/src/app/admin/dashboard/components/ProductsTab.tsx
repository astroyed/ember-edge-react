import type { DashboardProduct } from './types';

interface ProductsTabProps {
  products: DashboardProduct[];
}

export default function ProductsTab({ products }: ProductsTabProps) {
  return (
    <section className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="font-serif text-2xl tracking-[-0.5px] text-[#1c1c1c]">Product inventory</h2>
        <p className="mt-2 text-sm text-[#5f5f5d]">Catalog, pricing, and available variants.</p>
      </header>
      <div className="overflow-hidden rounded-xl border border-[#eceae4] bg-[#f7f4ed]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#1c1c1c]">
          <thead>
            <tr className="border-b border-[#eceae4] bg-[#1c1c1c]/[0.03] font-sans text-[11px] font-semibold uppercase tracking-wider text-[#5f5f5d]">
              <th className="p-3">Product Name</th><th className="p-3">Category</th>
              <th className="p-3">Base Price</th><th className="p-3">Variants</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length === 0 && <p className="border-t border-[#eceae4] px-6 py-12 text-center text-sm text-[#5f5f5d]">No products in the catalog yet.</p>}
      </div>
    </section>
  );
}

function numberFormat(value: number): string {
  return new Intl.NumberFormat('en-PK').format(value);
}
