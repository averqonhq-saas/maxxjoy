import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAndDownloadItinerary, generateAndDownloadInvoice } from '../utils/invoiceGenerator';
import { InvoiceModal } from './modals/InvoiceModal';

export const BookingPage = ({ onBack, onNavigateMyBookings, onExploreMore }) => {
  const {
    addBooking,
    formatPrice,
    showToast,
    selectedPackageForBooking,
    legalSettings,
    user
  } = useApp();

  const activeTour = selectedPackageForBooking || {
    id: 'pkg-dubai-luxury',
    title: 'Dubai Premium Luxury Escape',
    destinationName: 'Dubai, UAE',
    location: 'Dubai, United Arab Emirates',
    price: 1499,
    originalPrice: 1899,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=85',
    duration: '5 Days / 4 Nights',
    inclusions: ['5★ Atlantis The Palm Stay', 'Burj Khalifa 148th Floor Access', 'VIP Private Desert Safari', 'Luxury Marina Yacht Dinner']
  };

  // Form States
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 24);
    return d.toISOString().split('T')[0];
  });

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');

  const [hotelPreference, setHotelPreference] = useState('4 Star'); // '3 Star' | '4 Star' | '5 Star'
  const [airportPickup, setAirportPickup] = useState(true);
  const [localTransportation, setLocalTransportation] = useState(true);
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [contactPreference, setContactPreference] = useState('WhatsApp'); // 'WhatsApp' | 'Phone Call' | 'Email'

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [selectedInvoiceModal, setSelectedInvoiceModal] = useState(null);

  // Form submission handler
  const handleSubmitBookingRequest = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 7) {
      showToast('Please enter a valid phone / WhatsApp number', 'error');
      return;
    }

    setIsSubmitting(true);

    const randomId = `TRV-${Math.floor(10000 + Math.random() * 90000)}`;
    const travellersText = `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`;

    const newBookingData = {
      bookingId: randomId,
      packageTitle: activeTour.title,
      destination: activeTour.destinationName || activeTour.location || 'Dubai, UAE',
      image: activeTour.image,
      duration: activeTour.duration || '5 Days / 4 Nights',
      travelDate,
      adults,
      children,
      travelers: travellersText,
      guestName: customerName.trim(),
      guestEmail: customerEmail.trim(),
      guestPhone: customerPhone.trim(),
      hotelPreference,
      transportRequired: {
        airportPickup,
        localTransportation
      },
      contactPreference,
      additionalRequirements: additionalRequirements.trim(),
      status: 'Request Submitted',
      estimatedCost: (activeTour.price || 1499) * adults + Math.round((activeTour.price || 1499) * 0.6 * children),
      totalAmount: (activeTour.price || 1499) * adults + Math.round((activeTour.price || 1499) * 0.6 * children),
      price: activeTour.price || 1499,
      basePrice: activeTour.price || 1499
    };

    try {
      const created = await addBooking(newBookingData);
      setSubmittedBooking(created || newBookingData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmittedBooking(newBookingData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date helper for human readable display
  const formatDateDisplay = (dateStr) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    } catch (e) {}
    return dateStr;
  };

  // If successfully submitted, show the Customer Request Confirmation Screen
  if (submittedBooking) {
    return (
      <div className="min-h-screen bg-[#F5F9FC] font-sans py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Main Success Card */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-10 shadow-xl space-y-6 text-center">
            
            {/* Animated Celebration Icon */}
            <div className="size-20 bg-amber-50 border-2 border-amber-200 rounded-full flex items-center justify-center mx-auto shadow-inner text-4xl animate-bounce">
              🎉
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase tracking-wider mb-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                🟡 Request Submitted · Awaiting Confirmation
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] font-header">
                Booking Request Submitted!
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-md mx-auto leading-relaxed">
                Thank you for choosing <strong className="text-[#1A1A1A]">{legalSettings?.companyName || 'Maxx Joy Tours and Travel Pvt Ltd'}</strong>. Your travel enquiry has been successfully logged with our reservation concierge.
              </p>
            </div>

            {/* Request Summary Receipt Box */}
            <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-5 text-left space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Booking Request ID</span>
                  <span className="font-mono text-base font-black text-[#0A4D8C]">{submittedBooking.bookingId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Lead Traveler</span>
                  <span className="font-extrabold text-[#1A1A1A]">{submittedBooking.guestName}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Package Name</span>
                  <span className="font-bold text-[#1A1A1A] text-sm">{submittedBooking.packageTitle}</span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Travel Date</span>
                  <span className="font-bold text-[#1A1A1A] text-sm">{formatDateDisplay(submittedBooking.travelDate)}</span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Travellers</span>
                  <span className="font-bold text-[#1A1A1A]">{submittedBooking.travelers}</span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Hotel Preference</span>
                  <span className="font-bold text-[#FF7A00]">{submittedBooking.hotelPreference} Accommodation</span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Transport Selected</span>
                  <span className="font-medium text-[#1A1A1A]">
                    {[
                      submittedBooking.transportRequired?.airportPickup && 'Airport Pickup',
                      submittedBooking.transportRequired?.localTransportation && 'Local Transportation'
                    ].filter(Boolean).join(' + ') || 'Self Arranged'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block">Preferred Contact</span>
                  <span className="font-bold text-[#0A4D8C]">{submittedBooking.contactPreference}</span>
                </div>
              </div>

              {submittedBooking.additionalRequirements && (
                <div className="pt-3 border-t border-[#E2E8F0]">
                  <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider block mb-0.5">Special Requirements</span>
                  <p className="text-xs text-[#1A1A1A] italic bg-white p-2.5 rounded-xl border border-[#E2E8F0]">
                    "{submittedBooking.additionalRequirements}"
                  </p>
                </div>
              )}
            </div>

            {/* Reassurance Notice */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3 text-left">
              <span className="material-symbols-outlined text-amber-600 text-lg flex-shrink-0 mt-0.5">verified_user</span>
              <div className="space-y-1">
                <p className="font-extrabold text-amber-950">Next Steps & Confirmation</p>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  Our travel specialist will contact you via <strong>{submittedBooking.contactPreference}</strong> ({submittedBooking.guestPhone}) shortly to verify hotel availability, customize your itinerary, and finalize booking details.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onNavigateMyBookings) {
                    onNavigateMyBookings();
                  } else {
                    window.location.href = '/my-bookings';
                  }
                }}
                className="w-full bg-[#1A1A1A] text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm hover:bg-[#333] shadow-lg shadow-[#1A1A1A]/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">confirmation_number</span>
                View My Booking Request
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Generating Quotation / Request Summary PDF...', 'info');
                    generateAndDownloadInvoice(submittedBooking, legalSettings);
                  }}
                  className="w-full bg-white border border-[#E2E8F0] text-[#1A1A1A] font-bold py-3 px-4 rounded-2xl text-xs hover:bg-[#F5F9FC] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-[#0A4D8C]">download</span>
                  Download Quotation Summary
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onExploreMore) onExploreMore();
                    else if (onBack) onBack();
                    else window.location.href = '/';
                  }}
                  className="w-full bg-[#FF7A00] text-white font-extrabold py-3 px-4 rounded-2xl text-xs hover:bg-[#e56e00] shadow-md shadow-[#FF7A00]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">explore</span>
                  Browse More Tours
                </button>
              </div>
            </div>

            <p className="text-[11px] text-[#64748B] flex items-center justify-center gap-1">
              <span>📱</span>
              <span>Need instant assistance? Call / WhatsApp us at <strong>{legalSettings?.whatsapp || '+91 98047 77879'}</strong></span>
            </p>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F9FC] font-sans pb-16">
      
      {/* ── Top Header Navigation Bar ─────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-bold text-[#64748B] hover:text-[#1A1A1A] border border-[#E2E8F0] rounded-xl px-3 py-2 transition-all hover:bg-[#F5F9FC] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back
            </button>
            <div className="h-6 w-[1px] bg-[#E2E8F0]" />
            <div>
              <h1 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                Book Your Trip
              </h1>
              <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium">
                Enquiry-Based Reservation · No Online Payment Required
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Direct Travel Desk Confirmation</span>
          </div>
        </div>
      </header>

      {/* ── Main Form Container ───────────────────────────────────── */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8">
        
        {/* Banner Notice */}
        <div className="mb-8 bg-gradient-to-r from-[#062c52] to-[#0A4D8C] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-2">
            <span className="inline-block bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              Hassle-Free Booking Process
            </span>
            <h2 className="text-xl sm:text-3xl font-black font-header tracking-tight">
              Customize & Submit Your Travel Request
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              No advance payment is collected online today. Simply share your preferred travel dates, guests, hotel class, and requirements. Our destination team will verify exact hotel availability, airport transfers, and deliver your customized quote.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 size-48 rounded-full bg-white/5 pointer-events-none" />
        </div>

        <form onSubmit={handleSubmitBookingRequest}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* ── Left 2 Columns: The Booking Form ─────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* 1. Travel Dates & Guests */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
                  <span className="size-8 rounded-full bg-[#1A1A1A] text-white text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                      Select Travel Date & Travellers
                    </h3>
                    <p className="text-xs text-[#64748B]">When would you like to travel and with whom?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Travel Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#1A1A1A] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#0A4D8C]">calendar_month</span>
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all"
                    />
                    <span className="text-[11px] text-[#64748B] block">
                      Selected: <strong>{formatDateDisplay(travelDate)}</strong>
                    </span>
                  </div>

                  {/* Number of Travellers */}
                  <div className="space-y-3">
                    <label className="text-xs font-extrabold text-[#1A1A1A] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#0A4D8C]">group</span>
                      Number of Travellers
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Adults Counter */}
                      <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-3">
                        <span className="text-[10px] font-extrabold uppercase text-[#64748B] block mb-1">Adults (12+ yrs)</span>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="size-8 rounded-xl bg-white border border-[#E2E8F0] font-black text-sm text-[#1A1A1A] hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                          >
                            −
                          </button>
                          <span className="font-black text-base text-[#1A1A1A]">{adults}</span>
                          <button
                            type="button"
                            onClick={() => setAdults(adults + 1)}
                            className="size-8 rounded-xl bg-white border border-[#E2E8F0] font-black text-sm text-[#1A1A1A] hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children Counter */}
                      <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-3">
                        <span className="text-[10px] font-extrabold uppercase text-[#64748B] block mb-1">Children (0-11 yrs)</span>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="size-8 rounded-xl bg-white border border-[#E2E8F0] font-black text-sm text-[#1A1A1A] hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                          >
                            −
                          </button>
                          <span className="font-black text-base text-[#1A1A1A]">{children}</span>
                          <button
                            type="button"
                            onClick={() => setChildren(children + 1)}
                            className="size-8 rounded-xl bg-white border border-[#E2E8F0] font-black text-sm text-[#1A1A1A] hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Customer Contact Details */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
                  <span className="size-8 rounded-full bg-[#1A1A1A] text-white text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                      Customer Details
                    </h3>
                    <p className="text-xs text-[#64748B]">Where should we send your booking itinerary & quote?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Full Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-extrabold text-[#1A1A1A]">Full Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Muneeswaran MD"
                      required
                      className="w-full p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A] focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#1A1A1A]">Email Address *</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@email.com"
                      required
                      className="w-full p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A] focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#1A1A1A]">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98047 77879"
                      required
                      className="w-full p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A] focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Travel Requirements & Hotel Preference */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
                  <span className="size-8 rounded-full bg-[#1A1A1A] text-white text-xs font-black flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                      Travel Requirements & Preferences
                    </h3>
                    <p className="text-xs text-[#64748B]">Choose your accommodation tier and transportation needs.</p>
                  </div>
                </div>

                {/* Hotel Preference */}
                <div className="space-y-3">
                  <label className="text-xs font-extrabold text-[#1A1A1A] block">
                    Hotel Preference
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { tier: '3 Star', desc: 'Comfort & Value', icon: 'hotel' },
                      { tier: '4 Star', desc: 'Premium & Modern', icon: 'star' },
                      { tier: '5 Star', desc: 'Luxury Resort & Spa', icon: 'diamond' }
                    ].map(h => (
                      <label
                        key={h.tier}
                        onClick={() => setHotelPreference(h.tier)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center space-y-1 block ${
                          hotelPreference === h.tier
                            ? 'border-[#FF7A00] bg-orange-50/50 shadow-sm'
                            : 'border-[#E2E8F0] bg-[#F5F9FC] hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 text-[#FF7A00] font-black text-sm">
                          <span>{h.tier}</span>
                        </div>
                        <span className="text-[10px] text-[#64748B] block font-medium">{h.desc}</span>
                        <input
                          type="radio"
                          name="hotelPreference"
                          checked={hotelPreference === h.tier}
                          onChange={() => setHotelPreference(h.tier)}
                          className="sr-only"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Transport Required */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-extrabold text-[#1A1A1A] block">
                    Transport Required
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      airportPickup ? 'border-[#0A4D8C] bg-blue-50/50' : 'border-[#E2E8F0] bg-[#F5F9FC]'
                    }`}>
                      <input
                        type="checkbox"
                        checked={airportPickup}
                        onChange={(e) => setAirportPickup(e.target.checked)}
                        className="size-4 accent-[#0A4D8C] rounded-sm"
                      />
                      <div>
                        <span className="font-extrabold text-xs text-[#1A1A1A] block">Airport Pickup & Drop</span>
                        <span className="text-[10px] text-[#64748B]">Private AC vehicle on arrival & departure</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      localTransportation ? 'border-[#0A4D8C] bg-blue-50/50' : 'border-[#E2E8F0] bg-[#F5F9FC]'
                    }`}>
                      <input
                        type="checkbox"
                        checked={localTransportation}
                        onChange={(e) => setLocalTransportation(e.target.checked)}
                        className="size-4 accent-[#0A4D8C] rounded-sm"
                      />
                      <div>
                        <span className="font-extrabold text-xs text-[#1A1A1A] block">Local Transportation</span>
                        <span className="text-[10px] text-[#64748B]">Dedicated cab for all sightseeing & tours</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Additional Requirements */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-extrabold text-[#1A1A1A] block">
                    Additional Requirements (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    placeholder="e.g. Vegetarian food preferences, honeymoon room decor, baby cot, flight assistance, extra day stay..."
                    className="w-full p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#0A4D8C] focus:bg-white resize-none transition-all"
                  />
                </div>

                {/* Contact Preference */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-extrabold text-[#1A1A1A] block">
                    How would you like us to contact you?
                  </label>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    {[
                      { id: 'WhatsApp', icon: 'chat', label: 'WhatsApp' },
                      { id: 'Phone Call', icon: 'call', label: 'Phone Call' },
                      { id: 'Email', icon: 'mail', label: 'Email' }
                    ].map(c => (
                      <label
                        key={c.id}
                        onClick={() => setContactPreference(c.id)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer font-extrabold ${
                          contactPreference === c.id
                            ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white shadow-sm'
                            : 'border-[#E2E8F0] bg-[#F5F9FC] text-[#64748B] hover:text-[#1A1A1A]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{c.icon}</span>
                        <span>{c.label}</span>
                        <input
                          type="radio"
                          name="contactPreference"
                          checked={contactPreference === c.id}
                          onChange={() => setContactPreference(c.id)}
                          className="sr-only"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF7A00] text-white font-black text-sm sm:text-base py-4 rounded-2xl hover:bg-[#e56e00] shadow-xl shadow-[#FF7A00]/25 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Booking Request...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">send</span>
                        <span>Submit Booking Request</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-[#64748B] mt-2.5 flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-emerald-600">lock</span>
                    <span>No advance payment needed today · We will confirm package details with you first</span>
                  </p>
                </div>

              </div>

            </div>

            {/* ── Right Column: Tour Summary Sticky Card ───────────── */}
            <div className="space-y-6 lg:sticky lg:top-24">
              
              {/* Package Summary Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-md space-y-5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#FF7A00] tracking-wider block mb-1">
                    Selected Tour Package
                  </span>
                  <h3 className="text-xl font-black text-[#1A1A1A] font-header leading-snug">
                    {activeTour.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#0A4D8C]">location_on</span>
                    {activeTour.destinationName || activeTour.location || 'Dubai, UAE'}
                  </p>
                </div>

                <div className="relative h-44 rounded-2xl overflow-hidden border border-[#E2E8F0]">
                  <img
                    src={activeTour.image}
                    alt={activeTour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#1A1A1A]/80 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                    {activeTour.duration || '5 Days / 4 Nights'}
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">
                    Starting From
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#1A1A1A]">
                      {formatPrice(activeTour.price || 1499)}
                    </span>
                    <span className="text-xs text-[#64748B]">/ person</span>
                  </div>
                  <p className="text-[10px] text-[#64748B] pt-1">
                    *Final price confirmed based on hotel star rating, travel dates & inclusions.
                  </p>
                </div>

                {/* Inclusions Preview */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider block">
                    Key Inclusions Included:
                  </span>
                  <ul className="space-y-2 text-[#1A1A1A]">
                    {(activeTour.inclusions || [
                      '5-Star Luxury Resort Stay',
                      'Daily Breakfasts & Gourmet Meals',
                      'Private Airport & Tour Transfers',
                      'VIP Sightseeing Access'
                    ]).slice(0, 4).map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold text-sm">✓</span>
                        <span className="font-medium text-[11px]">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Why Enquiry-Based Notice */}
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#0A4D8C] font-black text-xs">
                    <span className="material-symbols-outlined text-sm">handshake</span>
                    <span>100% Tailored To You</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Our team directly coordinates with hotels and drivers to ensure peak dates and best rates before collecting advance fees.
                  </p>
                </div>

              </div>

              {/* Need Immediate Help Card */}
              <div className="bg-[#0A4D8C] text-white rounded-3xl p-6 space-y-3 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-300 text-xl">support_agent</span>
                  <h4 className="font-black text-sm">Prefer Direct Booking?</h4>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  Call or WhatsApp our travel managers directly for instant quotes & availability:
                </p>
                <a
                  href={`https://wa.me/${(legalSettings?.whatsapp || '919804777879').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Maxx Joy, I would like to enquire about the ${activeTour.title} tour package.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Chat on WhatsApp</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>

            </div>

          </div>
        </form>

      </main>

      {selectedInvoiceModal && (
        <InvoiceModal
          booking={selectedInvoiceModal}
          onClose={() => setSelectedInvoiceModal(null)}
        />
      )}
    </div>
  );
};
