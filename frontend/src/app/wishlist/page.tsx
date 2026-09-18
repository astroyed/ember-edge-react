'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-zinc-800 pb-6 flex justify-between items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">SAVED PIECES</span>
          <h1 className="text-3xl font-black uppercase text-white font-serif">Your Wishlist ({wishlist.length})</h1>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-zinc-950 border border-zinc-850 space-y-4">
          <Heart className="w-12 h-12 text-zinc-600 mx-auto" />
          <p className="text-sm text-zinc-400">Your wishlist is currently empty.</p>
          <Link href="/shop" className="inline-block bg-amber-500 text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors">
            Discover Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
