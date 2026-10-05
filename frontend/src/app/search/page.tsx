'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { api } from '@/lib/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.getProducts({ search: query })
      .then((res) => {
        if (res.success) setProducts(res.data || []);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-[#eceae4] pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">SEARCH RESULTS</span>
        <h1 className="text-3xl font-black uppercase text-[#1c1c1c] font-serif">
          Results for &ldquo;<span className="text-[#e58a2b]">{query}</span>&rdquo;
        </h1>
        <p className="text-xs text-[#5f5f5d]">Found {products.length} matching items</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-[#5f5f5d]/10 border border-[#eceae4] rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-[#f7f4ed] border border-[#eceae4] rounded-xl space-y-4">
          <Search className="w-12 h-12 text-[#5f5f5d]/40 mx-auto" />
          <p className="text-sm text-[#5f5f5d]">No products matching your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[#5f5f5d]">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
