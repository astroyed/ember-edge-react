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
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">SEARCH RESULTS</span>
        <h1 className="text-3xl font-black uppercase text-white font-serif">
          Results for "<span className="text-amber-400">{query}</span>"
        </h1>
        <p className="text-xs text-zinc-400">Found {products.length} matching items</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-zinc-900 border border-zinc-800" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-zinc-950 border border-zinc-850 space-y-4">
          <Search className="w-12 h-12 text-zinc-600 mx-auto" />
          <p className="text-sm text-zinc-400">No products matching your search query.</p>
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
    <Suspense fallback={<div className="py-20 text-center text-zinc-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
