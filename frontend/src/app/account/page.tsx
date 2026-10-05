'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User as UserIcon, MapPin, Package, LogOut, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function CustomerAccountPage() {
  const { user, logout, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await api.updateProfile({ name, phone, password: password || undefined });
      if (res.success) {
        await refreshUser();
        setMsg('Profile updated successfully!');
        setPassword('');
      }
    } catch (err: any) {
      setMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold uppercase text-[#1c1c1c]">Access Denied</h1>
        <p className="text-xs text-[#5f5f5d]">Please sign in to view your profile and orders.</p>
        <Link href="/login" className="inline-block bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] px-6 py-2.5 text-xs font-bold uppercase rounded-md inset-shadow-btn transition-all glow-focus">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-[#eceae4] pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">CLIENT PORTAL</span>
          <h1 className="text-3xl font-black uppercase text-[#1c1c1c] font-serif">Welcome, {user.name}</h1>
        </div>
        <button
          onClick={logout}
          className="text-xs text-red-500 hover:text-red-700 font-semibold uppercase flex items-center space-x-1"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-1 bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-4 h-fit">
          <Link
            href="/account"
            className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#1c1c1c] text-[#fcfbf8] rounded-md"
          >
            Profile & Settings
          </Link>
          <Link
            href="/account/orders"
            className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#5f5f5d] hover:bg-[#5f5f5d]/10 hover:text-[#1c1c1c] rounded-md transition-colors"
          >
            Order History
          </Link>
          <Link
            href="/track-order"
            className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#5f5f5d] hover:bg-[#5f5f5d]/10 hover:text-[#1c1c1c] rounded-md transition-colors"
          >
            Order Tracking
          </Link>
          <Link
            href="/wishlist"
            className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#5f5f5d] hover:bg-[#5f5f5d]/10 hover:text-[#1c1c1c] rounded-md transition-colors"
          >
            My Wishlist
          </Link>
        </aside>

        {/* Account Edit Form */}
        <div className="md:col-span-3 bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1c] border-b border-[#eceae4] pb-3">
            Personal Information
          </h2>

          {msg && (
            <p className={`text-xs p-3 rounded-lg border ${msg.includes('success') ? 'bg-[#e58a2b]/10 border-[#e58a2b]/30 text-[#e58a2b]' : 'bg-red-500/10 border-red-500/30 text-red-600'}`}>
              {msg}
            </p>
          )}

          <form onSubmit={handleUpdate} className="space-y-4 text-xs max-w-xl">
            <div>
              <label className="text-[#5f5f5d] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] rounded-md focus:outline-none focus:border-[#e58a2b]"
              />
            </div>

            <div>
              <label className="text-[#5f5f5d] block mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-[#5f5f5d]/10 border border-[#eceae4] p-3 text-[#5f5f5d] rounded-md cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[#5f5f5d] block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] rounded-md focus:outline-none focus:border-[#e58a2b]"
              />
            </div>

            <div>
              <label className="text-[#5f5f5d] block mb-1">New Password (Leave blank to keep current)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] rounded-md focus:outline-none focus:border-[#e58a2b]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-[#1c1c1c] hover:bg-[#1c1c1c]/90 text-[#fcfbf8] px-6 py-3 font-bold uppercase text-xs tracking-wider flex items-center space-x-2 rounded-md inset-shadow-btn transition-all glow-focus disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
