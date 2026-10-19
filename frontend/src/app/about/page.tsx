'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Sparkles, ArrowRight, User2, Clock } from 'lucide-react';

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
            We believe a bag is more than something you carry.It carries a part of who you are..
            We believe style should feel effortless—not forced.
            That everyday essentials can be beautiful.
            That functionality should never come at the expense of elegance.
            And that the right bag can turn an ordinary moment into something special.
          </p>

          <p className="text-xs sm:text-sm text-[#5f5f5d] max-w-xl mx-auto font-normal leading-relaxed">
            For busy mornings and slow afternoons.
            For workdays, weekends, dinners, and everything in between.
            For the woman who carries her essentials, her ambitions, her memories, and her confidence wherever she goes.
          </p>

          <p className="text-xs sm:text-sm text-[#5f5f5d] max-w-xl mx-auto font-normal leading-relaxed">
            We choose timeless over temporary.
            Purpose over excess.
            Quality over compromise.
            Confidence over conformity.

            We don&apos;t follow every trend.
            We take inspiration from them, refine them, and create pieces that belong to your style.
          </p>

          <p className="text-xs sm:text-sm text-[#5f5f5d] max-w-xl mx-auto font-normal leading-relaxed">
            <b> Every detail has a purpose.Every design has a story.</b>
          </p>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-[#e58a2b]/10 border border-[#e58a2b]/20 text-[#e58a2b] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold uppercase text-[#1c1c1c] font-serif">Made for Everyday</h3>
          <p className="text-xs text-[#5f5f5d] leading-relaxed">
            From busy mornings to weekend plans, find a bag that keeps your essentials close and feels right for wherever the day takes you.
          </p>
        </div>

        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-[#e58a2b]/10 border border-[#e58a2b]/20 text-[#e58a2b] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold uppercase text-[#1c1c1c] font-serif">Style with Purpose</h3>
          <p className="text-xs text-[#5f5f5d] leading-relaxed">
            Thoughtful details and timeless style make it easy to choose a bag that works with your routine and feels like your own.
          </p>
        </div>

        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-[#e58a2b]/10 border border-[#e58a2b]/20 text-[#e58a2b] flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold uppercase text-[#1c1c1c] font-serif">Favorite For Years</h3>
          <p className="text-xs text-[#5f5f5d] leading-relaxed">
            We choose lasting design over passing trends, creating bags that feel at home through changing seasons, plans, and chapters of life.
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
