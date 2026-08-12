import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const NewsletterSection = () => {
  const { showToast, applyPromoCode } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setSubscribed(true);
    applyPromoCode('WELCOME50');
    showToast('🎉 Thank you for subscribing! Your $50 travel voucher is unlocked: WELCOME50', 'success');
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-[1440px] mx-auto">
      <div className="bg-white rounded-[40px] p-8 sm:p-16 md:p-20 text-center border border-[#E2E8F0] shadow-md relative overflow-hidden">
        
        {/* Background gradient hint */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A4D8C]/5 via-transparent to-[#3FA9F5]/5 pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="w-12 h-12 rounded-2xl bg-[#0A4D8C] text-white inline-flex items-center justify-center mb-6 shadow-lg shadow-[#0A4D8C]/20">
            <span className="material-symbols-outlined text-2xl">mark_email_unread</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-[#1A1A1A] mb-4 font-header">
            Get Exclusive Travel Deals
          </h2>

          <p className="text-[#64748B] text-sm sm:text-lg mb-10 max-w-xl mx-auto">
            Subscribe to our VIP newsletter and instantly receive a <strong className="text-[#0A4D8C]">$50 Travel Voucher</strong> for your first booking!
          </p>

          {subscribed ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl max-w-md mx-auto animate-in zoom-in-95">
              <span className="material-symbols-outlined text-4xl text-emerald-600 mb-2">task_alt</span>
              <p className="font-extrabold text-[#1A1A1A] text-base">You're Subscribed!</p>
              <p className="text-xs text-[#64748B] mt-1">
                Your $50 voucher code <span className="font-mono font-bold text-amber-500">WELCOME50</span> is ready at checkout.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 rounded-2xl px-6 py-4 bg-[#F5F9FC] border border-[#E2E8F0] focus:ring-2 focus:ring-[#0A4D8C] outline-none shadow-xs text-[#1A1A1A] font-medium text-sm"
              />
              <button
                type="submit"
                className="bg-[#0A4D8C] text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-[#073c6e] shadow-xl shadow-[#0A4D8C]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                Subscribe & Get $50
              </button>
            </form>
          )}

          <p className="text-xs text-[#64748B] mt-6">
            By subscribing, you agree to our Privacy Policy and terms of service. No spam, ever.
          </p>
        </div>
      </div>
    </section>
  );
};
