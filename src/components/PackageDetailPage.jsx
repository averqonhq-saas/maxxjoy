import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PackageDetailPage = ({ onBack, onBookNow, pkgData }) => {
  const { formatPrice, toggleWishlist, wishlist, showToast, setSelectedPackageForBooking } = useApp();

  // Dynamic package object constructed from passed pkgData
  const pkg = {
    id: pkgData?.id || 'pkg-dubai-getaway',
    title: pkgData?.title || 'Dubai Luxury Getaway',
    duration: pkgData?.duration || `${pkgData?.durationDays || 5} Days / ${(pkgData?.durationDays || 5) - 1} Nights`,
    maxGuests: pkgData?.maxGuests || 'Max 10 Guests',
    rating: pkgData?.rating || 4.9,
    reviewsCount: pkgData?.reviewsCount || 124,
    price: pkgData?.price || 1499,
    baseFare: pkgData?.baseFare || Math.round((pkgData?.price || 1499) * 0.75),
    hotelFare: pkgData?.hotelFare || Math.round((pkgData?.price || 1499) * 0.20),
    vipFare: pkgData?.vipFare || Math.round((pkgData?.price || 1499) * 0.05),
    image: pkgData?.image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=85',
    hotelName: pkgData?.hotelName || `${pkgData?.title || 'Luxury'} Villa & Resort`,
    hotelImage: pkgData?.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    description: pkgData?.description || `Experience an unforgettable luxury getaway with our ${pkgData?.title || 'Bespoke Package'}. Includes 5-star accommodations, guided tours, and private transfers.`,
    overviewSpecs: [
      { icon: 'bed', label: 'STAY', val: '5-Star Luxury' },
      { icon: 'directions_car', label: 'TRANSPORT', val: 'Private Transfer' },
      { icon: 'restaurant', label: 'DINING', val: 'Breakfast & Meals' },
      { icon: 'confirmation_number', label: 'ATTRACTIONS', val: 'Guided Excursions' },
    ],
    itinerary: pkgData?.itinerary || [
      { day: 1, title: 'Arrival & Welcome Dinner', desc: 'VIP private airport transfer to your luxury resort and welcome dinner.' },
      { day: 2, title: 'Guided Sightseeing & Highlights', desc: 'Full-day private guided tour with entry passes to top iconic landmarks.' },
      { day: 3, title: 'Scenic Excursion & Sunset Cruise', desc: 'Exclusive local adventure with private sunset dining.' },
      { day: 4, title: 'Leisure & Wellness Day', desc: 'Day at leisure to explore or relax with complimentary resort wellness treatment.' },
      { day: 5, title: 'Departure', desc: 'Gourmet breakfast and private transfer to airport.' }
    ],
    inclusions: pkgData?.inclusions || pkgData?.highlights || [
      '5-Star Luxury Resort Accommodation',
      'All daily breakfasts and gourmet dinners',
      'Private airport & attraction transfers',
      'VIP entry passes to top landmarks'
    ],
    exclusions: pkgData?.exclusions || [
      'International airfare',
      'Travel Insurance',
      'Personal expenses'
    ],
    reviews: pkgData?.reviews || [
      {
        initials: 'MK',
        name: 'Michael K.',
        date: 'Verified Traveler',
        stars: 5,
        comment: `Outstanding tour package! Everything was organized seamlessly and exceeded expectations.`
      }
    ]
  };

  const handleBookNowClick = () => {
    setSelectedPackageForBooking(pkg);
    onBookNow?.(pkg);
  };

  const isWishlisted = wishlist.includes(pkg.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tour package link copied to clipboard! 📋', 'success');
    } else {
      showToast('Tour package link generated', 'info');
    }
  };

  const handleChatExpert = () => {
    showToast('Connecting to 24/7 Luxury Concierge Chat...', 'info');
  };

  return (
    <div className="min-h-screen bg-[#F5F9FC] font-sans text-[#1A1A1A]">

      {/* ── Main Container ───────────────────────────────────── */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* ── Hero Banner ────────────────────────────────────── */}
        <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-md">
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
            <span className="inline-block bg-[#FF7A00] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              PREMIUM EXPERIENCE
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-header tracking-tight">{pkg.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/90">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {pkg.duration}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">group</span>
                {pkg.maxGuests || 'Max 10 Guests'}
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <span className="material-symbols-outlined text-sm fill-current">star</span>
                {pkg.rating} ({pkg.reviewsCount} Reviews)
              </span>
            </div>
          </div>
        </div>

        {/* ── Content Grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── Left Column: Details ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Overview */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-black border-l-4 border-[#1A1A1A] pl-3">Package Overview</h2>
              <p className="text-xs text-[#64748B] leading-relaxed font-medium">{pkg.description}</p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {pkg.overviewSpecs.map((spec, idx) => (
                  <div key={idx} className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-4 space-y-1">
                    <span className="material-symbols-outlined text-[#1A1A1A]" style={{ fontSize: 20 }}>{spec.icon}</span>
                    <span className="text-[9px] font-extrabold uppercase text-[#64748B] block tracking-wider">{spec.label}</span>
                    <span className="text-xs font-black text-[#1A1A1A] block">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Itinerary */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-black border-l-4 border-[#1A1A1A] pl-3">Detailed Itinerary</h2>
              <div className="space-y-6">
                {pkg.itinerary.map(item => (
                  <div key={item.day} className="flex gap-4 items-start">
                    <div className="size-8 rounded-full bg-[#1A1A1A] text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.day}
                    </div>
                    <div className="space-y-2 flex-1 pb-4 border-b border-[#E2E8F0] last:border-b-0 last:pb-0">
                      <h3 className="font-extrabold text-base text-[#1A1A1A]">{item.title}</h3>
                      <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>

                      {item.photos && (
                        <div className="flex gap-3 pt-2">
                          {item.photos.map((ph, pi) => (
                            <img key={pi} src={ph} alt={`Day ${item.day} photo`} className="h-20 w-32 object-cover rounded-xl border border-[#E2E8F0]" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Included */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                  <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 18 }}>check_circle</span>
                  <span>Included</span>
                </div>
                <ul className="space-y-2.5 text-xs text-emerald-900 font-medium">
                  {pkg.inclusions.map((inc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Excluded */}
              <div className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-rose-800 font-black text-sm">
                  <span className="material-symbols-outlined text-rose-600" style={{ fontSize: 18 }}>cancel</span>
                  <span>Excluded</span>
                </div>
                <ul className="space-y-2.5 text-xs text-rose-900 font-medium">
                  {pkg.exclusions.map((exc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Guest Reviews */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-black border-l-4 border-[#1A1A1A] pl-3">Guest Reviews</h2>
              {pkg.reviews.map((rev, idx) => (
                <div key={idx} className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-[#1A1A1A] text-white font-extrabold text-xs flex items-center justify-center">
                        {rev.initials}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#1A1A1A]">{rev.name}</h4>
                        <p className="text-[10px] text-[#64748B]">{rev.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.stars)].map((_, si) => (
                        <span key={si} className="material-symbols-outlined fill-current" style={{ fontSize: 16 }}>star</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] italic leading-relaxed">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Column: Sticky Sidebar ─────────────────── */}
          <aside className="sticky top-24 space-y-5">
            {/* Price Breakdown Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 space-y-5 shadow-md">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#FF7A00] tracking-wider block">Estimated Price</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xs font-bold text-[#64748B]">Starting from</span>
                  <span className="text-3xl font-black text-[#1A1A1A]">{formatPrice(pkg.price)}</span>
                  <span className="text-xs text-[#64748B]">/ person</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#64748B] pt-3 border-t border-[#E2E8F0]">
                <div className="flex justify-between">
                  <span>Base Package Fare ({pkg.duration})</span>
                  <span className="font-bold text-[#1A1A1A]">{formatPrice(pkg.baseFare || 3850)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Luxury Accommodation</span>
                  <span className="font-bold text-[#1A1A1A]">{formatPrice(pkg.hotelFare || 850)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Activity & Guided Fees</span>
                  <span className="font-bold text-[#1A1A1A]">{formatPrice(pkg.vipFare || 299)}</span>
                </div>
                <div className="flex justify-between font-black text-base text-[#1A1A1A] pt-3 border-t border-[#E2E8F0]">
                  <span>Starting From</span>
                  <span className="text-xl text-[#0A4D8C]">{formatPrice(pkg.price)}</span>
                </div>
              </div>

              {/* Main Hotel Badge */}
              <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-3 space-y-2">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="material-symbols-outlined text-[#1A1A1A]" style={{ fontSize: 16 }}>hotel</span>
                  <span className="font-bold text-[#64748B] uppercase text-[10px]">FEATURED STAY</span>
                  <span className="font-extrabold text-[#1A1A1A]">{pkg.hotelName}</span>
                </div>
                <img src={pkg.hotelImage} alt={pkg.hotelName} className="w-full h-28 object-cover rounded-xl border border-[#E2E8F0]" />
              </div>

              {/* Action Buttons: Enquire Now & Book This Trip */}
              <div className="space-y-2.5">
                <button
                  onClick={handleBookNowClick}
                  className="w-full bg-[#FF7A00] text-white font-black text-sm py-4 rounded-2xl hover:bg-[#e56e00] shadow-lg shadow-[#FF7A00]/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                  <span>Book This Trip (No Payment Today)</span>
                </button>

                <button
                  onClick={handleBookNowClick}
                  className="w-full bg-[#1A1A1A] text-white font-extrabold text-xs py-3 rounded-xl hover:bg-[#333] transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">chat_bubble</span>
                  <span>Enquire / Request Quote</span>
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-[11px] text-emerald-900 space-y-1">
                <div className="flex items-center gap-1 font-extrabold text-emerald-800">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>100% Enquiry-Based Booking</span>
                </div>
                <p className="text-emerald-700 leading-snug">
                  No payment collected today. Our travel specialists will confirm dates, hotel tier, private transfers, and final quote.
                </p>
              </div>
            </div>

            {/* Need Assistance Card */}
            <div className="bg-[#0A4D8C] text-white rounded-3xl p-6 space-y-4 shadow-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3FA9F5]" style={{ fontSize: 22 }}>help</span>
                <h3 className="font-black text-base">Need Assistance?</h3>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Our luxury travel experts are available 24/7 to customize your itinerary.
              </p>
              <button
                onClick={handleChatExpert}
                className="w-full bg-white text-[#0A4D8C] font-extrabold text-xs py-3 rounded-xl hover:bg-white/90 transition-all text-center"
              >
                Chat With Expert
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
