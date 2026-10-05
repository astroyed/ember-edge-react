'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Facebook, Twitter, Instagram } from '@/components/ui/BrandIcons';

export const Footer = () => {
  return (
    <footer className="bg-[#1c1c1c] text-[#5f5f5d] pt-16 pb-12 border-t border-[#eceae4]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#eceae4]/20">

          {/* Brand Ethos Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tighter uppercase font-serif text-[#fcfbf8]">
                EMBER <span className="text-[#e58a2b]">EDGE</span>
              </span>
              <span className="block text-[9px] tracking-[0.3em] text-[#5f5f5d] uppercase font-sans font-medium mt-1">
                ATELIER & STYLING
              </span>
            </Link>
            <p className="text-xs text-[#5f5f5d] leading-relaxed max-w-sm">
              Ember Edge is a contemporary fashion house crafting architectural menswear, minimalist womenswear, and premium children's apparel. Defined by 280 GSM luxury textiles and precision tailoring.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-[#5f5f5d]/10 hover:bg-[#e58a2b] hover:text-[#1c1c1c] rounded-full transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-[#5f5f5d]/10 hover:bg-[#e58a2b] hover:text-[#1c1c1c] rounded-full transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-[#5f5f5d]/10 hover:bg-[#e58a2b] hover:text-[#1c1c1c] rounded-full transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections Column */}
          <div>
            <h3 className="text-xs font-bold text-[#fcfbf8] uppercase tracking-widest mb-4">Collections</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/collections/men" className="hover:text-[#e58a2b] transition-colors">Men's Apparel</Link></li>
              <li><Link href="/collections/women" className="hover:text-[#e58a2b] transition-colors">Women's Couture</Link></li>
              <li><Link href="/collections/kids" className="hover:text-[#e58a2b] transition-colors">Kids Essentials</Link></li>
              <li><Link href="/shop?category=outerwear" className="hover:text-[#e58a2b] transition-colors">Outerwear & Coats</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-[#e58a2b] transition-colors">Leather & Accessories</Link></li>
              <li><Link href="/shop?sort=newest" className="hover:text-[#e58a2b] transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h3 className="text-xs font-bold text-[#fcfbf8] uppercase tracking-widest mb-4">Customer Care</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/track-order" className="hover:text-[#e58a2b] transition-colors text-[#e58a2b] font-semibold">Track Order</Link></li>
              <li><Link href="/size-guide" className="hover:text-[#e58a2b] transition-colors">Size Guide & Fitting</Link></li>
              <li><Link href="/account/orders" className="hover:text-[#e58a2b] transition-colors">Order History</Link></li>
              <li><Link href="/about" className="hover:text-[#e58a2b] transition-colors">Brand Story</Link></li>
              <li><Link href="/contact" className="hover:text-[#e58a2b] transition-colors">Contact Support</Link></li>
              <li><a href="#" className="hover:text-[#e58a2b] transition-colors">Shipping & Returns</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-xs font-bold text-[#fcfbf8] uppercase tracking-widest mb-4">Join The Atelier</h3>
            <p className="text-xs text-[#5f5f5d] mb-3">
              Subscribe for private access to limited drops, runway launches, and exclusive member discounts.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Ember Edge Atelier!'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  required
                  className="w-full bg-[#f7f4ed]/10 border border-[#eceae4]/20 text-[#fcfbf8] text-xs px-3 py-2.5 rounded-full focus:outline-none focus:border-[#e58a2b] placeholder-[#5f5f5d]/60 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-[#e58a2b] hover:bg-[#d97706] text-[#1c1c1c] px-3 rounded-full transition-colors flex items-center justify-center inset-shadow-btn"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5f5f5d]">
          <p>© {new Date().getFullYear()} EMBER EDGE BRAND LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0 font-mono text-[10px]">
            <span>SUPPORTED PAYMENTS:</span>
            <span className="bg-[#5f5f5d]/10 px-2 py-1 text-[#fcfbf8] rounded border border-[#eceae4]/20">JazzCash</span>
            <span className="bg-[#5f5f5d]/10 px-2 py-1 text-[#fcfbf8] rounded border border-[#eceae4]/20">EasyPaisa</span>
            <span className="bg-[#5f5f5d]/10 px-2 py-1 text-[#fcfbf8] rounded border border-[#eceae4]/20">Stripe / Visa</span>
            <span className="bg-[#5f5f5d]/10 px-2 py-1 text-[#fcfbf8] rounded border border-[#eceae4]/20">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
