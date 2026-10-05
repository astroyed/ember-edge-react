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
      <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-8 sm:p-12 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#e58a2b]">CLIENT CONCIERGE</span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-[#1c1c1c] font-serif">Contact Ember Edge</h1>
        <p className="text-xs sm:text-sm text-[#5f5f5d] max-w-md mx-auto">
          Have questions regarding sizing, custom tailoring, order tracking, or wholesale inquiries?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 flex items-start space-x-4">
            <div className="p-3 bg-[#e58a2b]/10 text-[#e58a2b] border border-[#e58a2b]/20 rounded-lg">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-[#1c1c1c] tracking-wider">Concierge Email</h3>
              <p className="text-xs text-[#5f5f5d] mt-1">support@emberedge.com</p>
              <p className="text-[11px] text-[#5f5f5d]/70 mt-0.5">Response within 24 business hours</p>
            </div>
          </div>

          <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 flex items-start space-x-4">
            <div className="p-3 bg-[#e58a2b]/10 text-[#e58a2b] border border-[#e58a2b]/20 rounded-lg">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-[#1c1c1c] tracking-wider">Helpline & WhatsApp</h3>
              <p className="text-xs text-[#5f5f5d] mt-1">+92 300 1234567 / +92 21 35874410</p>
              <p className="text-[11px] text-[#5f5f5d]/70 mt-0.5">Monday - Saturday (10:00 AM - 7:00 PM PKT)</p>
            </div>
          </div>

          <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-6 flex items-start space-x-4">
            <div className="p-3 bg-[#e58a2b]/10 text-[#e58a2b] border border-[#e58a2b]/20 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-[#1c1c1c] tracking-wider">Flagship Atelier</h3>
              <p className="text-xs text-[#5f5f5d] mt-1">Ember Edge Atelier, Block 4, Clifton, Karachi, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#f7f4ed] border border-[#eceae4] rounded-xl p-8 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1c] border-b border-[#eceae4] pb-3">
            Send Message
          </h2>

          {submitted ? (
            <div className="p-6 bg-[#e58a2b]/10 border border-[#e58a2b]/30 text-[#e58a2b] text-xs text-center space-y-2 rounded-lg">
              <p className="font-bold uppercase">Thank you for reaching out!</p>
              <p className="text-[#5f5f5d]">Your message has been received by our client concierge team.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#5f5f5d] block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Zainab Ahmed"
                  className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] placeholder-[#5f5f5d]/60 rounded-md focus:outline-none focus:border-[#e58a2b]"
                />
              </div>

              <div>
                <label className="text-[#5f5f5d] block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] placeholder-[#5f5f5d]/60 rounded-md focus:outline-none focus:border-[#e58a2b]"
                />
              </div>

              <div>
                <label className="text-[#5f5f5d] block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Order inquiry, sizing help, etc."
                  className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] placeholder-[#5f5f5d]/60 rounded-md focus:outline-none focus:border-[#e58a2b]"
                />
              </div>

              <div>
                <label className="text-[#5f5f5d] block mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your query here..."
                  className="w-full bg-[#f7f4ed]/50 border border-[#eceae4] p-3 text-[#1c1c1c] placeholder-[#5f5f5d]/60 rounded-md focus:outline-none focus:border-[#e58a2b]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1c1c1c] hover:bg-[#1c1c1c]/90 text-[#fcfbf8] font-bold uppercase text-xs py-3.5 tracking-wider flex items-center justify-center space-x-2 rounded-md inset-shadow-btn transition-all glow-focus"
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
