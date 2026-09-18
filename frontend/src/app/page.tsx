'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Banner, Product } from '@/types';
import { api } from '@/lib/api';

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [bRes, fRes, nRes] = await Promise.all([
          api.getBanners(),
          api.getFeaturedProducts(),
          api.getNewArrivals(),
        ]);

        if (bRes.success) setBanners(bRes.data || []);
        if (fRes.success) setFeaturedProducts(fRes.data || []);
        if (nRes.success) setNewArrivals(nRes.data || []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Automatic banner slide change
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners]);

  const defaultBanner = {
    title: 'AUTUMN / WINTER 2026 ATELIER',
    subtitle: 'Heavyweight textiles, drop shoulders & architectural outer silhouettes.',
    image_path: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600',
    button_text: 'Explore Collection',
    button_url: '/shop',
  };

  const activeBanner = banners[currentBanner] || defaultBanner;

  return (
    <div className="space-y-20 pb-20">

      {/* 1. HERO BANNER SLIDER */}
      <section className="relative h-[85vh] min-h-[550px] bg-zinc-950 overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeBanner.image_path}
            alt={activeBanner.title}
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0C]/80 via-transparent to-[#0B0B0C]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-none backdrop-blur-md">
            EST. 2026 • EMBER EDGE LUXURY
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-serif leading-none">
            {activeBanner.title}
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto font-light tracking-wide leading-relaxed">
            {activeBanner.subtitle}
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href={activeBanner.button_url}
              className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 text-xs font-black uppercase tracking-widest transition-all glow-ember flex items-center space-x-2"
            >
              <span>{activeBanner.button_text}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/collections/men"
              className="border border-zinc-700 hover:border-amber-500 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors backdrop-blur-md"
            >
              Men’s Drop
            </Link>
          </div>
        </div>

        {/* Slider Controls */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`h-1.5 transition-all ${
                  idx === currentBanner ? 'w-8 bg-amber-500' : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. VALUE PROPOSITION BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-zinc-950 border border-zinc-850">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wider">280 GSM Cotton</h4>
              <p className="text-[11px] text-zinc-400">Luxury combed cotton weaving</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wider">Complimentary Shipping</h4>
              <p className="text-[11px] text-zinc-400">Free delivery over Rs. 5,000</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wider">Seamless Exchanges</h4>
              <p className="text-[11px] text-zinc-400">14-day doorstep exchange policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wider">Verified Authenticity</h4>
              <p className="text-[11px] text-zinc-400">100% original Ember Edge tailoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">CURATED EDIT</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-serif mt-1">
              Explore Collections
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase text-amber-400 hover:text-amber-300 tracking-wider flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Men Card */}
          <Link href="/collections/men" className="group relative h-96 overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800"
              alt="Men's Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">MENSWEAR</span>
              <h3 className="text-xl font-bold uppercase text-white font-serif">Men’s Collection</h3>
              <p className="text-xs text-zinc-300 mt-1 line-clamp-1">Oversized tees, utility cargos & outerwear.</p>
              <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase text-amber-400 mt-3 group-hover:translate-x-1 transition-transform">
                <span>Shop Men</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Women Card */}
          <Link href="/collections/women" className="group relative h-96 overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800"
              alt="Women's Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">COUTURE</span>
              <h3 className="text-xl font-bold uppercase text-white font-serif">Women’s Collection</h3>
              <p className="text-xs text-zinc-300 mt-1 line-clamp-1">Silk evening gowns, knitwear & structured blazers.</p>
              <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase text-amber-400 mt-3 group-hover:translate-x-1 transition-transform">
                <span>Shop Women</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Kids Card */}
          <Link href="/collections/kids" className="group relative h-96 overflow-hidden bg-zinc-900 border border-zinc-800">
            <img
              src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800"
              alt="Kids Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">JUNIOR</span>
              <h3 className="text-xl font-bold uppercase text-white font-serif">Kids Collection</h3>
              <p className="text-xs text-zinc-300 mt-1 line-clamp-1">Organic fleece hoodies & everyday comfortable wear.</p>
              <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase text-amber-400 mt-3 group-hover:translate-x-1 transition-transform">
                <span>Shop Kids</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">MUST-HAVE DROPS</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-serif mt-1">
              Featured Products
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase text-amber-400 hover:text-amber-300 tracking-wider flex items-center space-x-1">
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-zinc-900 border border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. EDITORIAL LOOKBOOK SECTION */}
      <section className="relative py-20 bg-zinc-950 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-amber-500">
              PHILOSOPHY OF CRAFT
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-serif leading-tight">
              Ember Edge Atelier & Precision Weaving
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every garment in our collection undergoes rigorous prototyping. From selecting high-grade 280 GSM long-staple cotton to reinforced flatlock stitching, Ember Edge delivers streetwear and formalwear designed to stand the test of time.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <Link
                href="/about"
                className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Read Brand Story
              </Link>
              <Link
                href="/size-guide"
                className="border border-zinc-700 hover:border-amber-500 text-zinc-300 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                View Fit Guide
              </Link>
            </div>
          </div>

          <div className="relative h-96 sm:h-[450px] border border-zinc-800 overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000"
              alt="Ember Edge Atelier Crafting"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">LOOKBOOK 2026</span>
              <p className="text-sm font-serif font-bold text-white uppercase">Architectural Cuts & Drop Shoulders</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">FRESH FROM THE ATELIER</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-serif mt-1">
              New Arrivals
            </h2>
          </div>
          <Link href="/shop?sort=newest" className="text-xs font-bold uppercase text-amber-400 hover:text-amber-300 tracking-wider flex items-center space-x-1">
            <span>Shop Newest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-zinc-950 border border-zinc-850">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">CLIENT TESTIMONIALS</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-serif">What Our Clients Say</h2>
          <div className="flex justify-center text-amber-400 space-x-1 pt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-current" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex text-amber-400 space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className="w-3.5 h-3.5 fill-current" />))}
            </div>
            <p className="text-xs text-zinc-300 italic leading-relaxed">
              "The 280 GSM heavyweight tee is standard-setting. Perfect oversized drape that holds structure even after multiple washes."
            </p>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[11px]">
              <span className="font-bold text-white uppercase">Hamza K.</span>
              <span className="text-zinc-500">Verified Buyer</span>
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex text-amber-400 space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className="w-3.5 h-3.5 fill-current" />))}
            </div>
            <p className="text-xs text-zinc-300 italic leading-relaxed">
              "Ordered the Italian Wool Trench Coat. Shipping was fast (2 days to Lahore) and fit is impeccably sharp. Highly recommended!"
            </p>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[11px]">
              <span className="font-bold text-white uppercase">Ayesha M.</span>
              <span className="text-zinc-500">Verified Buyer</span>
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex text-amber-400 space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className="w-3.5 h-3.5 fill-current" />))}
            </div>
            <p className="text-xs text-zinc-300 italic leading-relaxed">
              "Top tier customer support and easy order tracking. The grain leather bag quality rivals international designer labels."
            </p>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[11px]">
              <span className="font-bold text-white uppercase">Tariq B.</span>
              <span className="text-zinc-500">Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
