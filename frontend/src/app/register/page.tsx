'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.register({
        name,
        email,
        phone,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#f7f4ed] border border-[#eceae4] p-8 space-y-6 shadow-[rgba(0,0,0,0.1)_0px_4px_12px]">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#e58a2b]">JOIN THE ATELIER</span>
          <h1 className="text-2xl font-black uppercase text-[#1c1c1c] font-serif">Create Account</h1>
          <p className="text-xs text-[#5f5f5d]">Register for faster checkout, order history and private drops.</p>
        </div>

        {error && (
          <div className="p-3 bg-[#5f5f5d]/10 border border-[#5f5f5d]/30 text-[#5f5f5d] text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[#5f5f5d] block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#5f5f5d] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Zainab Ahmed"
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 pl-10 text-[#1c1c1c] focus:outline-none focus:border-[#e58a2b] rounded-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[#5f5f5d] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5f5f5d] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="zainab@example.com"
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 pl-10 text-[#1c1c1c] focus:outline-none focus:border-[#e58a2b] rounded-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[#5f5f5d] block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#5f5f5d] absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 pl-10 text-[#1c1c1c] focus:outline-none focus:border-[#e58a2b] rounded-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[#5f5f5d] block mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5f5f5d] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 pl-10 text-[#1c1c1c] focus:outline-none focus:border-[#e58a2b] rounded-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c1c1c] hover:bg-[#1c1c1c]/80 text-[#fcfbf8] py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 inset-shadow-btn hover:brightness-90 transition-all glow-focus disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#eceae4] text-center text-xs text-[#5f5f5d]">
          Already registered?{' '}
          <Link href="/login" className="text-[#e58a2b] font-bold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
