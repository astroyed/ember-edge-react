'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="bg-zinc-950 border border-zinc-850 p-8 sm:p-12 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">CLIENT CONCIERGE</span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-serif">Contact Ember Edge</h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Have questions regarding sizing, custom tailoring, order tracking, or wholesale inquiries?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-850 p-6 flex items-start space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-white tracking-wider">Concierge Email</h3>
              <p className="text-xs text-zinc-400 mt-1">support@emberedge.com</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Response within 24 business hours</p>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-850 p-6 flex items-start space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-white tracking-wider">Helpline & WhatsApp</h3>
              <p className="text-xs text-zinc-400 mt-1">+92 300 1234567 / +92 21 35874410</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Monday - Saturday (10:00 AM - 7:00 PM PKT)</p>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-850 p-6 flex items-start space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-white tracking-wider">Flagship Atelier</h3>
              <p className="text-xs text-zinc-400 mt-1">Ember Edge Atelier, Block 4, Clifton, Karachi, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-zinc-950 border border-zinc-850 p-8 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
            Send Message
          </h2>

          {submitted ? (
            <div className="p-6 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs text-center space-y-2">
              <p className="font-bold uppercase">Thank you for reaching out!</p>
              <p className="text-zinc-300">Your message has been received by our client concierge team.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Zainab Ahmed"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Order inquiry, sizing help, etc."
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your query here..."
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase text-xs py-3.5 tracking-widest flex items-center justify-center space-x-2 transition-colors glow-ember"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
