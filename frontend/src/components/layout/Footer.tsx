'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Facebook, Twitter, Instagram } from '@/components/ui/BrandIcons';

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800">

          {/* Brand Ethos Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tighter uppercase font-serif text-white">
                EMBER <span className="text-amber-500">EDGE</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Ember Edge is a contemporary fashion house crafting architectural menswear, minimalist womenswear, and premium children’s apparel. Defined by 280 GSM luxury textiles and precision tailoring.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-zinc-900 hover:bg-amber-500 hover:text-black rounded-full transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 hover:bg-amber-500 hover:text-black rounded-full transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-zinc-900 hover:bg-amber-500 hover:text-black rounded-full transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Collections</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/collections/men" className="hover:text-amber-400 transition-colors">Men’s Apparel</Link></li>
              <li><Link href="/collections/women" className="hover:text-amber-400 transition-colors">Women’s Couture</Link></li>
              <li><Link href="/collections/kids" className="hover:text-amber-400 transition-colors">Kids Essentials</Link></li>
              <li><Link href="/shop?category=outerwear" className="hover:text-amber-400 transition-colors">Outerwear & Coats</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-amber-400 transition-colors">Leather & Accessories</Link></li>
              <li><Link href="/shop?sort=newest" className="hover:text-amber-400 transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Customer Care</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/track-order" className="hover:text-amber-400 transition-colors font-semibold text-amber-500">Track Order</Link></li>
              <li><Link href="/size-guide" className="hover:text-amber-400 transition-colors">Size Guide & Fitting</Link></li>
              <li><Link href="/account/orders" className="hover:text-amber-400 transition-colors">Order History</Link></li>
              <li><Link href="/about" className="hover:text-amber-400 transition-colors">Brand Story</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact Support</Link></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Shipping & Returns</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Join The Atelier</h3>
            <p className="text-xs text-zinc-400 mb-3">
              Subscribe for private access to limited drops, runway launches, and exclusive member discounts.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Ember Edge Atelier!'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-2.5 focus:outline-none focus:border-amber-500 pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-amber-500 hover:bg-amber-400 text-black px-3 transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} EMBER EDGE BRAND LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0 font-mono text-[10px]">
            <span>SUPPORTED PAYMENTS:</span>
            <span className="bg-zinc-900 px-2 py-1 text-zinc-300 rounded border border-zinc-800">JazzCash</span>
            <span className="bg-zinc-900 px-2 py-1 text-zinc-300 rounded border border-zinc-800">EasyPaisa</span>
            <span className="bg-zinc-900 px-2 py-1 text-zinc-300 rounded border border-zinc-800">Stripe / Visa</span>
            <span className="bg-zinc-900 px-2 py-1 text-zinc-300 rounded border border-zinc-800">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
