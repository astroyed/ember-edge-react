'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { api } from '@/lib/api';

export default function CollectionPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getProducts({ category: slug })
      .then((res) => {
        if (res.success) setProducts(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const titles: Record<string, { title: string; subtitle: string }> = {
    men: {
      title: "MEN'S COLLECTION",
      subtitle: "Architectural menswear, drop-shoulder heavy tees, trench coats & tactical trousers.",
    },
    women: {
      title: "WOMEN'S COLLECTION",
      subtitle: "Fluid mulberry silk gowns, structured power blazers & ribbed cashmere knitwear.",
    },
    kids: {
      title: "KIDS ESSENTIALS",
      subtitle: "Ultra-soft organic fleece hoodies & durable daily loungewear for young trendsetters.",
    },
    outerwear: {
      title: "OUTERWEAR & COATS",
      subtitle: "Italian wool trench coats, heavy blazers & signature leather jackets.",
    },
    accessories: {
      title: "ACCESSORIES & LEATHERWARE",
      subtitle: "Full-grain calf leather bags, gunmetal hardware & signature caps.",
    }
  };

  const meta = titles[slug] || {
    title: `${slug.toUpperCase()} COLLECTION`,
    subtitle: 'Explore Ember Edge signature apparel.',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Banner */}
      <div className="bg-zinc-950 border border-zinc-850 p-8 sm:p-12 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">EMBER EDGE ATELIER</span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-serif">{meta.title}</h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-light">{meta.subtitle}</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-zinc-900 border border-zinc-850" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 text-xs uppercase">
          No products currently available in this collection.
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
