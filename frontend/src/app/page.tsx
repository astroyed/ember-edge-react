'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award, Star } from 'lucide-react';
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
      <section className="relative h-[85vh] min-h-[550px] overflow-hidden flex items-center justify-center">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f7f4ed] via-[#f7f4ed] to-[#eceae4]/50 z-0" />
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeBanner.image_path}
            alt={activeBanner.title}
            className="w-full h-full object-cover object-center opacity-30 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f7f4ed] via-[#f7f4ed]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f4ed]/40 via-transparent to-[#f7f4ed]/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block bg-[#e58a2b] text-[#1c1c1c] text-xs font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
            EST. 2026 • EMBER EDGE LUXURY
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#1c1c1c] font-serif leading-tight">
            {activeBanner.title}
          </h1>
          <p className="text-base sm:text-lg text-[#5f5f5d] max-w-xl mx-auto font-light leading-relaxed">
            {activeBanner.subtitle}
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href={activeBanner.button_url}
              className="bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] px-8 py-4 text-xs font-black uppercase tracking-widest transition-all inset-shadow-btn hover:brightness-90 glow-focus flex items-center space-x-2"
            >
              <span>{activeBanner.button_text}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/collections/men"
              className="border border-[#5f5f5d]/40 hover:border-[#e58a2b] text-[#1c1c1c] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Men's Drop
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
                  idx === currentBanner ? 'w-8 bg-[#e58a2b]' : 'w-2 bg-[#5f5f5d]/30 hover:bg-[#5f5f5d]/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. VALUE PROPOSITION BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-[#f7f4ed] border border-[#eceae4]">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#e58a2b]/10 text-[#e58a2b] rounded-full">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1c1c] uppercase">280 GSM Cotton</h4>
              <p className="text-[11px] text-[#5f5f5d]">Luxury combed cotton weaving</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#e58a2b]/10 text-[#e58a2b] rounded-full">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1c1c] uppercase">Complimentary Shipping</h4>
              <p className="text-[11px] text-[#5f5f5d]">Free delivery over Rs. 5,000</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#e58a2b]/10 text-[#e58a2b] rounded-full">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1c1c] uppercase">Seamless Exchanges</h4>
              <p className="text-[11px] text-[#5f5f5d]">14-day doorstep exchange policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#e58a2b]/10 text-[#e58a2b] rounded-full">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1c1c1c] uppercase">Verified Authenticity</h4>
              <p className="text-[11px] text-[#5f5f5d]">100% original Ember Edge tailoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-[#eceae4] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">CURATED EDIT</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#1c1c1c] font-serif mt-1">
              Explore Collections
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase text-[#e58a2b] hover:text-[#d97706] flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Men Card */}
          <Link href="/collections/men" className="group relative h-96 overflow-hidden bg-[#5f5f5d]/5 border border-[#eceae4]">
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800"
              alt="Men's Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/90 via-[#1c1c1c]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-bold text-[#e58a2b] uppercase tracking-widest block">MENSWEAR</span>
              <h3 className="text-xl font-black uppercase text-[#fcfbf8] font-serif">Men's Collection</h3>
              <p className="text-xs text-[#5f5f5d] mt-1 line-clamp-1">Oversized tees, utility cargos & outerwear.</p>
              <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase text-[#e58a2b] mt-3 group-hover:translate-x-1 transition-transform">
                <span>Shop Men</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Women Card */}
          <Link href="/collections/women" className="group relative h-96 overflow-hidden bg-[#5f5f5d]/5 border border-[#eceae4]">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800"
              alt="Women's Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/90 via-[#1c1c1c]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-bold text-[#e58a2b] uppercase tracking-widest block">COUTURE</span>
              <h3 className="text-xl font-black uppercase text-[#fcfbf8] font-serif">Women's Collection</h3>
              <p className="text-xs text-[#5f5f5d] mt-1 line-clamp-1">Silk evening gowns, knitwear & structured blazers.</p>
              <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase text-[#e58a2b] mt-3 group-hover:translate-x-1 transition-transform">
                <span>Shop Women</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Kids Card */}
          <Link href="/collections/kids" className="group relative h-96 overflow-hidden bg-[#5f5f5d]/5 border border-[#eceae4]">
            <img
              src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800"
              alt="Kids Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/90 via-[#1c1c1c]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-bold text-[#e58a2b] uppercase tracking-widest block">JUNIOR</span>
              <h3 className="text-xl font-black uppercase text-[#fcfbf8] font-serif">Kids Collection</h3>
              <p className="text-xs text-[#5f5f5d] mt-1 line-clamp-1">Organic fleece hoodies & everyday comfortable wear.</p>
              <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase text-[#e58a2b] mt-3 group-hover:translate-x-1 transition-transform">
                <span>Shop Kids</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-[#eceae4] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">MUST-HAVE DROPS</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#1c1c1c] font-serif mt-1">
              Featured Products
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase text-[#e58a2b] hover:text-[#d97706] flex items-center space-x-1">
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-[#5f5f5d]/10 border border-[#eceae4]" />
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
      <section className="relative py-20 bg-[#f7f4ed] border-y border-[#eceae4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#e58a2b]">
              PHILOSOPHY OF CRAFT
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-[#1c1c1c] font-serif leading-tight">
              Ember Edge Atelier & Precision Weaving
            </h2>
            <p className="text-sm text-[#5f5f5d] leading-relaxed">
              Every garment in our collection undergoes rigorous prototyping. From selecting high-grade 280 GSM long-staple cotton to reinforced flatlock stitching, Ember Edge delivers streetwear and formalwear designed to stand the test of time.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <Link
                href="/about"
                className="bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] px-6 py-3 text-xs font-black uppercase tracking-wider inset-shadow-btn hover:brightness-90 transition-all glow-focus flex items-center"
              >
                Read Brand Story
              </Link>
              <Link
                href="/size-guide"
                className="border border-[#5f5f5d]/40 hover:border-[#e58a2b] text-[#1c1c1c] px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                View Fit Guide
              </Link>
            </div>
          </div>

          <div className="relative h-96 sm:h-[450px] border border-[#eceae4] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000"
              alt="Ember Edge Atelier Crafting"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#e58a2b]">LOOKBOOK 2026</span>
              <p className="text-sm font-serif font-bold text-[#fcfbf8] uppercase">Architectural Cuts & Drop Shoulders</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-[#eceae4] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">FRESH FROM THE ATELIER</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#1c1c1c] font-serif mt-1">
              New Arrivals
            </h2>
          </div>
          <Link href="/shop?sort=newest" className="text-xs font-bold uppercase text-[#e58a2b] hover:text-[#d97706] flex items-center space-x-1">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#f7f4ed] border border-[#eceae4]">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">CLIENT TESTIMONIALS</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#1c1c1c] font-serif">What Our Clients Say</h2>
          <div className="flex justify-center text-[#e58a2b] space-x-1 pt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-current" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#f7f4ed] border border-[#eceae4] space-y-3">
            <div className="flex text-[#e58a2b] space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className="w-3.5 h-3.5 fill-current" />))}
            </div>
            <p className="text-xs italic leading-relaxed">
              "The 280 GSM heavyweight tee is standard-setting. Perfect oversized drape that holds structure even after multiple washes."
            </p>
            <div className="pt-2 border-t border-[#eceae4] flex justify-between items-center text-[11px]">
              <span className="font-bold text-[#1c1c1c] uppercase">Hamza K.</span>
              <span className="text-[#5f5f5d]">Verified Buyer</span>
            </div>
          </div>

          <div className="p-6 bg-[#f7f4ed] border border-[#eceae4] space-y-3">
            <div className="flex text-[#e58a2b] space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className="w-3.5 h-3.5 fill-current" />))}
            </div>
            <p className="text-xs italic leading-relaxed">
              "Ordered the Italian Wool Trench Coat. Shipping was fast (2 days to Lahore) and fit is impeccably sharp."
            </p>
            <div className="pt-2 border-t border-[#eceae4] flex justify-between items-center text-[11px]">
              <span className="font-bold text-[#1c1c1c] uppercase">Ayesha M.</span>
              <span className="text-[#5f5f5d]">Verified Buyer</span>
            </div>
          </div>

          <div className="p-6 bg-[#f7f4ed] border border-[#eceae4] space-y-3">
            <div className="flex text-[#e58a2b] space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className="w-3.5 h-3.5 fill-current" />))}
            </div>
            <p className="text-xs italic leading-relaxed">
              "Top tier customer support and easy order tracking. The grain leather bag quality rivals international labels."
            </p>
            <div className="pt-2 border-t border-[#eceae4] flex justify-between items-center text-[11px]">
              <span className="font-bold text-[#1c1c1c] uppercase">Tariq B.</span>
              <span className="text-[#5f5f5d]">Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
