'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, User, Search, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart, setIsOpen: setCartOpen } = useCart();
  const { wishlist } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Shop All', href: '/shop' },
    // { name: 'Men', href: '/collections/men' },
    { name: 'Women', href: '/collections/women' },
    // { name: 'Kids', href: '/collections/kids' },
    // { name: 'Size Guide', href: '/size-guide' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Banner */}
      {/* <div className="bg-[#e58a2b] text-black text-xs font-semibold py-2 px-4 text-center tracking-widest uppercase">
        Complimentary Express Shipping on Orders Above Rs. 5,000 | Code: <span className="underline font-extrabold">EMBER10</span>
      </div> */}

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#f7f4ed] border-b border-[#eceae4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Mobile Hamburger */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#1c1c1c] hover:text-[#e58a2b] p-2 focus:outline-none focus:shadow-[rgba(0,0,0,0.1)_0px_4px_12px] shadow-none transition-shadow"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 md:flex-none text-center md:text-left">
              <Link href="/" className="inline-block group">
                <span className="text-2xl sm:text-3xl font-black tracking-tighter uppercase font-serif text-[#1c1c1c]">
                  EMBER <span className="text-[#e58a2b] group-hover:text-[#d97706] transition-colors">EDGE</span>
                </span>
                {/* <span className="block text-[9px] tracking-[0.3em] text-[#5f5f5d] uppercase font-sans font-medium text-center md:text-left">
                  STYLE & ELEGANCE
                </span> */}
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-[#e58a2b] ${isActive ? 'text-[#e58a2b] font-semibold border-b-2 border-[#e58a2b] pb-1' : 'text-[#1c1c1c]'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#5f5f5d] hover:text-[#e58a2b] p-2 transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="text-[#5f5f5d] hover:text-[#e58a2b] p-2 transition-colors relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#e58a2b] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account Dropdown or Link */}
              {user ? (
                <div className="relative group">
                  <Link
                    href="/account"
                    className="flex items-center space-x-2 text-[#5f5f5d] hover:text-[#e58a2b] p-2 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">{user.name}</span>
                  </Link>

                  {/* Account Popup */}
                  <div className="invisible pointer-events-none absolute right-0 top-full z-50 w-48 pt-2 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                    <div className="rounded-lg border border-[#eceae4] bg-[#f7f4ed] py-2 shadow-[rgba(0,0,0,0.1)_0px_4px_12px]">
                    <div className="px-4 py-2 border-b border-[#eceae4] text-xs text-[#5f5f5d]">
                      Logged in as <span className="text-[#1c1c1c] font-medium block truncate">{user.email}</span>
                      {user.role !== 'customer' && (
                        <span className="inline-block mt-1 bg-[#e58a2b]/20 text-[#e58a2b] text-[10px] font-bold px-2 py-0.5 rounded">
                          {user.role.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <Link href="/account" className="block px-4 py-2 text-xs text-[#1c1c1c] hover:bg-[#5f5f5d]/5 hover:text-[#e58a2b]">
                      My Profile & Addresses
                    </Link>
                    <Link href="/account/orders" className="block px-4 py-2 text-xs text-[#1c1c1c] hover:bg-[#5f5f5d]/5 hover:text-[#e58a2b]">
                      Order History
                    </Link>
                    <Link href="/track-order" className="block px-4 py-2 text-xs text-[#1c1c1c] hover:bg-[#5f5f5d]/5 hover:text-[#e58a2b]">
                      Order Tracking
                    </Link>

                    {user.role !== 'customer' && (
                      <Link href="/admin/dashboard" className="block px-4 py-2 text-xs text-[#e58a2b] font-bold hover:bg-[#5f5f5d]/5">
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#5f5f5d]/5 transition-colors"
                    >
                      Sign Out
                    </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-[#5f5f5d] hover:text-[#e58a2b] p-2 transition-colors flex items-center space-x-1"
                  title="Sign In"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs uppercase font-medium">Login</span>
                </Link>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all inset-shadow-btn hover:brightness-90 glow-focus flex items-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart</span>
                <span className="bg-[#fcfbf8] text-[#1c1c1c] text-[11px] px-2 py-0.5 font-mono font-bold rounded-full">
                  {cart?.item_count || 0}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Live Search Bar */}
        {searchOpen && (
          <div className="bg-[#f7f4ed] border-t border-[#eceae4] py-4 px-4 sm:px-8">
            <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto flex items-center space-x-4">
              <Search className="w-5 h-5 text-[#e58a2b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Oversized Tees, Wool Coats, Silk Dresses, Cargo Pants..."
                className="w-full bg-[#f7f4ed] text-[#1c1c1c] placeholder-[#5f5f5d] border border-[#eceae4] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[#1c1c1c] text-[#fcfbf8] text-xs font-bold uppercase px-6 py-2 rounded-full inset-shadow-btn hover:brightness-90 transition-all"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[#5f5f5d] hover:text-[#1c1c1c] p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#f7f4ed] border-t border-[#eceae4] py-6 px-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-[#1c1c1c] hover:text-[#e58a2b] border-b border-[#eceae4] pb-2"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-[#eceae4] flex flex-col space-y-3">
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-[#e58a2b] uppercase tracking-wider flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Track My Order</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
