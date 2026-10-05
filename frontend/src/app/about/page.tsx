'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20">

      {/* Hero Header */}
      <section className="relative py-24 bg-[#f7f4ed] border-b border-[#eceae4] text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#e58a2b]">HERITAGE & CRAFT</span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase text-[#1c1c1c] font-serif tracking-tight">
            The Ember Edge Manifesto
          </h1>
          <p className="text-xs sm:text-sm text-[#5f5f5d] max-w-xl mx-auto font-normal leading-relaxed">
            Founded on the intersection of heavy textile engineering and minimalist luxury, Ember Edge redefines contemporary fashion through unyielding craftsmanship.
          </p>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-[#e58a2b]/10 border border-[#e58a2b]/20 text-[#e58a2b] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold uppercase text-[#1c1c1c] font-serif">280 GSM Textile Standard</h3>
          <p className="text-xs text-[#5f5f5d] leading-relaxed">
            We exclusively use 280 GSM long-staple combed cotton for our streetwear tees and hoodies. This provides a structural silhouette that maintains shape and drape through endless wear.
          </p>
        </div>

        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-[#e58a2b]/10 border border-[#e58a2b]/20 text-[#e58a2b] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold uppercase text-[#1c1c1c] font-serif">Architectural Cut</h3>
          <p className="text-xs text-[#5f5f5d] leading-relaxed">
            Every shoulder seam, lapel angle, and sleeve cuff is engineered for modern movement. Our drop-shoulder tees and Italian wool coats balance oversized ease with sharp tailored elegance.
          </p>
        </div>

        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-[#e58a2b]/10 border border-[#e58a2b]/20 text-[#e58a2b] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold uppercase text-[#1c1c1c] font-serif">Sustainable Atelier</h3>
          <p className="text-xs text-[#5f5f5d] leading-relaxed">
            We produce in limited, controlled drops to eliminate inventory waste. All garments utilize eco-conscious dyes and plastic-free recyclable packaging.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-black uppercase text-[#1c1c1c] font-serif">Experience The Atelier Drop</h2>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider rounded-md inset-shadow-btn transition-all glow-focus"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

    </div>
  );
}
