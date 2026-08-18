import React from 'react';
import { useApp } from '../context/AppContext';

export const SpecialDeals = ({ onBookNow }) => {
  const { applyPromoCode, specialDeal } = useApp();

  const deal = specialDeal || {
    badge: 'Limited Time Offer',
    title: 'Bali Summer Offer —',
    highlight: 'Save 40% Today!',
    description: 'Book your dream Bali getaway for the upcoming season and enjoy exclusive discounts on overwater pool villas, private speedboats, and jungle swings.',
    buttonText: 'Claim 40% Discount Now',
    promoCode: 'BALI40',
    discountValue: 40,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    packageName: 'Ubud Luxury Pool Villa Package',
    packageSubtitle: '8 Days / 7 Nights · All Inclusions Included',
    enabled: true
  };

  if (deal.enabled === false) return null;

  // Ensure button text always reflects current discount if not custom worded
  const buttonLabel = deal.buttonText || (deal.discountValue ? `Claim ${deal.discountValue}% Discount Now` : 'Claim Discount Now');

  const handleClaimOffer = () => {
    if (deal.promoCode) {
      applyPromoCode(deal.promoCode);
    }
    onBookNow();
  };

  return (
    <section id="deals" className="py-20 px-4 sm:px-6 max-w-[1440px] mx-auto">
      <div className="relative rounded-[36px] sm:rounded-[44px] overflow-hidden bg-white p-8 sm:p-14 md:p-16 flex flex-col lg:flex-row items-center gap-10 shadow-lg border border-[#E2E8F0]">
        
        {/* Background Decorative Accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A4D8C]/5 via-white to-amber-500/5 pointer-events-none"></div>

        {/* Text Details */}
        <div className="relative z-10 flex-1 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 bg-[#0A4D8C]/10 text-[#0A4D8C] px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider mb-6 border border-[#0A4D8C]/20">
            <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-ping"></span>
            {deal.badge || 'Limited Time Offer'}
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1A1A1A] leading-tight mb-6 font-header">
            {deal.title} <br />
            <span className="text-[#FF7A00]">{deal.highlight}</span>
          </h2>

          <p className="text-[#64748B] text-base sm:text-lg mb-8 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
            {deal.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={handleClaimOffer}
              className="bg-[#FF7A00] text-white px-9 py-4 rounded-2xl font-black text-base hover:bg-[#ff8a1c] hover:scale-105 active:scale-95 shadow-xl shadow-[#FF7A00]/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">local_offer</span>
              {buttonLabel}
            </button>

            {deal.promoCode && (
              <span className="text-[#64748B] text-xs font-mono">
                Use code: <span className="text-[#0A4D8C] font-bold">{deal.promoCode}</span>
              </span>
            )}
          </div>
        </div>

        {/* Offer Image */}
        <div className="relative z-10 w-full max-w-md aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white flex-shrink-0 group">
          <img
            src={deal.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'}
            alt={deal.packageName || 'Special Offer Package'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E2E8F0] shadow-md">
            <p className="text-xs font-extrabold text-[#1A1A1A]">{deal.packageName || 'Special Offer Package'}</p>
            <p className="text-[11px] text-[#64748B]">{deal.packageSubtitle || 'All Inclusions Included'}</p>
          </div>
        </div>

      </div>
    </section>
  );
};
