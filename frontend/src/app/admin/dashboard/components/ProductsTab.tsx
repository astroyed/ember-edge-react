import type { DashboardProduct } from './types';

interface ProductsTabProps {
  products: DashboardProduct[];
}

export default function ProductsTab({ products }: ProductsTabProps) {
  return (
    <section className="space-y-6 rounded-xl border border-[#eceae4] bg-[#f7f4ed] p-6 animate-fadeIn">
      <h2 className="border-b border-[#eceae4] pb-3 text-xs font-bold uppercase tracking-wider text-[#1c1c1c]">
        Product Catalog Inventory
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#1c1c1c]">
          <thead>
            <tr className="border-b border-[#eceae4] bg-[#eceae4]/60 font-mono uppercase">
              <th className="p-3">Product Name</th><th className="p-3">Category</th>
              <th className="p-3">Base Price</th><th className="p-3">Variants</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eceae4]">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-[#5f5f5d]/5">
                <td className="p-3 font-bold uppercase text-[#1c1c1c]">{product.name}</td>
                <td className="p-3 text-[#5f5f5d]">{product.category?.name || 'Category'}</td>
                <td className="p-3 font-mono text-[#e58a2b]">Rs. {numberFormat(product.price)}</td>
                <td className="p-3 font-mono text-xs text-[#5f5f5d]">
                  {product.variants?.map((variant) => `${variant.color}/${variant.size} (${variant.stock_quantity})`).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function numberFormat(value: number): string {
  return new Intl.NumberFormat('en-PK').format(value);
}
