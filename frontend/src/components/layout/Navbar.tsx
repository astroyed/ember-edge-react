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
    { name: 'Men', href: '/collections/men' },
    { name: 'Women', href: '/collections/women' },
    { name: 'Kids', href: '/collections/kids' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black text-xs font-semibold py-2 px-4 text-center tracking-widest uppercase">
        Complimentary Express Shipping on Orders Above Rs. 5,000 | Code: <span className="underline font-extrabold">EMBER10</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#0B0B0C]/90 backdrop-blur-md border-b border-zinc-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Mobile Hamburger */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-zinc-300 hover:text-amber-500 p-2 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 md:flex-none text-center md:text-left">
              <Link href="/" className="inline-block group">
                <span className="text-2xl sm:text-3xl font-black tracking-tighter uppercase font-serif text-white">
                  EMBER <span className="text-amber-500 group-hover:text-amber-400 transition-colors">EDGE</span>
                </span>
                <span className="block text-[9px] tracking-[0.3em] text-zinc-400 uppercase font-sans font-medium text-center md:text-left">
                  ATELIER & STYLING
                </span>
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
                    className={`text-sm font-medium tracking-wider uppercase transition-colors hover:text-amber-400 ${
                      isActive ? 'text-amber-500 font-semibold border-b-2 border-amber-500 pb-1' : 'text-zinc-300'
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
                className="text-zinc-300 hover:text-amber-400 p-2 transition-colors relative"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="text-zinc-300 hover:text-amber-400 p-2 transition-colors relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account Dropdown or Link */}
              {user ? (
                <div className="relative group">
                  <Link
                    href="/account"
                    className="flex items-center space-x-2 text-zinc-300 hover:text-amber-400 p-2 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">{user.name}</span>
                  </Link>

                  {/* Account Popup */}
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-zinc-800 text-xs text-zinc-400">
                      Logged in as <span className="text-white font-medium block truncate">{user.email}</span>
                      {user.role !== 'customer' && (
                        <span className="inline-block mt-1 bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">
                          {user.role.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <Link href="/account" className="block px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-amber-400">
                      My Profile & Addresses
                    </Link>
                    <Link href="/account/orders" className="block px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-amber-400">
                      Order History
                    </Link>
                    <Link href="/track-order" className="block px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-amber-400">
                      Order Tracking
                    </Link>

                    {user.role !== 'customer' && (
                      <Link href="/admin/dashboard" className="block px-4 py-2 text-xs text-amber-400 font-bold hover:bg-zinc-800">
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-zinc-800 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-zinc-300 hover:text-amber-400 p-2 transition-colors flex items-center space-x-1"
                  title="Sign In"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs uppercase font-medium">Login</span>
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setCartOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2.5 rounded-none font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all glow-ember"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart</span>
                <span className="bg-black text-amber-400 text-[11px] px-2 py-0.5 font-mono font-bold rounded">
                  {cart?.item_count || 0}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Live Search Bar */}
        {searchOpen && (
          <div className="bg-zinc-950 border-t border-zinc-800 py-4 px-4 sm:px-8 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto flex items-center space-x-4">
              <Search className="w-5 h-5 text-amber-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Oversized Tees, Wool Coats, Silk Dresses, Cargo Pants..."
                className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm tracking-wide"
                autoFocus
              />
              <button
                type="submit"
                className="bg-amber-500 text-black text-xs font-bold uppercase px-4 py-2 hover:bg-amber-400 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-zinc-400 hover:text-white p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-950 border-b border-zinc-800 py-6 px-6 space-y-4 animate-slideDown">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold uppercase tracking-wider text-zinc-200 hover:text-amber-400 border-b border-zinc-900 pb-2"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-zinc-800 flex flex-col space-y-3">
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase font-medium text-amber-400 tracking-wider flex items-center space-x-2"
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
