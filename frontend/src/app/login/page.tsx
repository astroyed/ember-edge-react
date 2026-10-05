'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        router.push(res.data.user.role !== 'customer' ? '/admin/dashboard' : '/account');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#f7f4ed] border border-[#eceae4] p-8 space-y-6 shadow-[rgba(0,0,0,0.1)_0px_4px_12px]">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">EMBER EDGE ATELIER</span>
          <h1 className="text-2xl font-black uppercase text-[#1c1c1c] font-serif">Customer Sign In</h1>
          <p className="text-xs text-[#5f5f5d]">Access your orders, address book, and saved wishlist.</p>
        </div>

        {error && (
          <div className="p-3 bg-[#5f5f5d]/10 border border-[#5f5f5d]/30 text-[#5f5f5d] text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[#5f5f5d] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5f5f5d] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@emberedge.com"
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 pl-10 text-[#1c1c1c] focus:outline-none focus:border-[#e58a2b] rounded-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[#5f5f5d] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5f5f5d] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 pl-10 text-[#1c1c1c] focus:outline-none focus:border-[#e58a2b] rounded-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 inset-shadow-btn hover:brightness-90 transition-all glow-focus disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#eceae4] text-center text-xs text-[#5f5f5d]">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#e58a2b] font-bold">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
