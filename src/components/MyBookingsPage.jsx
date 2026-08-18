import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { InvoiceModal } from './modals/InvoiceModal';

export const MyBookingsPage = ({ onBack, onBookNow }) => {
  const { myBookings, formatPrice, legalSettings } = useApp();
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Submitted' | 'Review' | 'Confirmed' | 'Completed' | 'Cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  // Robust price and cost calculator ensuring 100% match across cards, details modal, and invoices
  const getBookingCalculation = (b) => {
    if (!b) return { total: 1499, perAdult: 1499, totalAdult: 1499, totalChild: 0, basePrice: 1424, gstAmount: 75, adults: 1, children: 0 };
    
    const adults = parseInt(b.adults) || 2;
    const children = parseInt(b.children) || 0;

    const total = typeof b.estimatedCost === 'number' && b.estimatedCost > 0
      ? b.estimatedCost
      : (typeof b.totalAmount === 'number' && b.totalAmount > 0
        ? b.totalAmount
        : (parseFloat(b.estimatedCost) || parseFloat(b.totalAmount) || ((parseFloat(b.price || b.basePrice) || 1499) * adults)));

    const perAdult = b.price ? parseFloat(b.price) : Math.round(total / (adults + children * 0.6));
    const perChild = Math.round(perAdult * 0.6);
    const totalAdult = perAdult * adults;
    const totalChild = perChild * children;
    const basePrice = Math.round(total * 0.95);
    const gstAmount = total - basePrice;

    return {
      total,
      perAdult,
      perChild,
      totalAdult,
      totalChild,
      basePrice,
      gstAmount,
      adults,
      children
    };
  };

  // Status mapping helper
  const getStatusCategory = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('submitted') || s.includes('awaiting') || s.includes('pending') || s.includes('request')) return 'Submitted';
    if (s.includes('review') || s.includes('checking') || s.includes('availability') || s.includes('progress')) return 'Review';
    if (s.includes('confirm') || s.includes('upcoming')) return 'Confirmed';
    if (s.includes('complete') || s.includes('finished')) return 'Completed';
    if (s.includes('cancel')) return 'Cancelled';
    return 'Submitted';
  };

  // Filter and search bookings
  const filteredBookings = useMemo(() => {
    return myBookings.filter(b => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' ||
        (b.bookingId || '').toLowerCase().includes(q) ||
        (b.packageTitle || '').toLowerCase().includes(q) ||
        (b.destination || '').toLowerCase().includes(q) ||
        (b.guestName || '').toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeTab === 'All') return true;
      const cat = getStatusCategory(b.status);
      return cat === activeTab;
    });
  }, [myBookings, searchQuery, activeTab]);

  // Clean, professional status badges (zero emojis)
  const getStatusBadge = (status = 'Request Submitted') => {
    const s = status.toLowerCase();
    if (s.includes('submitted') || s.includes('awaiting') || s.includes('pending')) {
      return {
        label: 'Request Submitted',
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        dot: 'bg-amber-500'
      };
    }
    if (s.includes('review')) {
      return {
        label: 'Under Review',
        bg: 'bg-blue-50 border-blue-200 text-blue-800',
        dot: 'bg-blue-500'
      };
    }
    if (s.includes('checking') || s.includes('availability')) {
      return {
        label: 'Availability Checking',
        bg: 'bg-sky-50 border-sky-200 text-sky-800',
        dot: 'bg-sky-500'
      };
    }
    if (s.includes('confirm')) {
      return {
        label: 'Booking Confirmed',
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        dot: 'bg-emerald-500'
      };
    }
    if (s.includes('upcoming')) {
      return {
        label: 'Trip Upcoming',
        bg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
        dot: 'bg-indigo-500'
      };
    }
    if (s.includes('completed')) {
      return {
        label: 'Trip Completed',
        bg: 'bg-slate-100 border-slate-300 text-slate-800',
        dot: 'bg-slate-500'
      };
    }
    if (s.includes('cancel')) {
      return {
        label: 'Request Cancelled',
        bg: 'bg-rose-50 border-rose-200 text-rose-800',
        dot: 'bg-rose-500'
      };
    }
    return {
      label: 'Request Submitted',
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      dot: 'bg-amber-500'
    };
  };

  const handleContactSupport = (booking) => {
    const calc = getBookingCalculation(booking);
    const phone = (legalSettings?.whatsapp || '919804777879').replace(/[^0-9]/g, '');
    const costText = calc.total ? ` (Confirmed Quote: ${formatPrice(calc.total)})` : '';
    const msg = encodeURIComponent(`Hello Maxx Joy Tours Desk, I am following up on my booking request #${booking?.bookingId || ''} for "${booking?.packageTitle || 'Tour Package'}"${costText}.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  // 6-stage lifecycle progress tracker
  const LIFECYCLE_STAGES = [
    { key: 'submitted', step: '01', title: 'Request Submitted', desc: 'Received at concierge desk' },
    { key: 'review', step: '02', title: 'Under Review', desc: 'Travel specialist assigned' },
    { key: 'availability', step: '03', title: 'Availability Checking', desc: 'Resort & transport verification' },
    { key: 'confirmed', step: '04', title: 'Booking Confirmed', desc: 'Itinerary & voucher reserved' },
    { key: 'upcoming', step: '05', title: 'Trip Upcoming', desc: 'Pre-departure briefing' },
    { key: 'completed', step: '06', title: 'Trip Completed', desc: 'Journey concluded' }
  ];

  const getStageIndex = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('completed')) return 5;
    if (s.includes('upcoming')) return 4;
    if (s.includes('confirm')) return 3;
    if (s.includes('checking') || s.includes('availability')) return 2;
    if (s.includes('review')) return 1;
    return 0; // submitted
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1F2937] font-sans pb-16 antialiased">
      
      {/* ── Top Header Bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-bold text-[#6B7280] hover:text-[#1F2937] border border-[#E5E7EB] rounded-xl px-3 py-2 transition-all hover:bg-[#F7F8FA] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back</span>
            </button>
            <div className="h-6 w-[1px] bg-[#E5E7EB] hidden sm:block" />
            <div>
              <h1 className="text-base sm:text-lg font-black text-[#1F2937]">
                My Bookings & Travel Requests
              </h1>
              <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium">
                Live reservation updates, quotations, and concierge support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Synced</span>
            </span>

            <button
              onClick={onBookNow}
              className="bg-[#0A4D8C] text-white text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-[#083b6b] shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>+ Enquire New Trip</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ───────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 space-y-6">

        {/* Informative Guidance Banner */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0A4D8C]">
              Enquiry-Based Reservation Workflow
            </h2>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              No online payment is collected today. Our dedicated concierge team reviews your preferred dates, verifies hotel availability, prepares a tailored quote, and contacts you directly via WhatsApp or phone to finalize your booking.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={`https://wa.me/${(legalSettings?.whatsapp || '919804777879').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Maxx Joy Tours concierge, I have a question regarding my travel booking request.')}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs font-bold text-[#1F2937] hover:bg-[#E5E7EB] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
              <span>Concierge Desk</span>
            </a>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          
          {/* Tab Filter Pills */}
          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'All', label: 'All Requests' },
              { id: 'Submitted', label: 'Submitted' },
              { id: 'Review', label: 'Under Review' },
              { id: 'Confirmed', label: 'Confirmed' },
              { id: 'Completed', label: 'Completed' },
              { id: 'Cancelled', label: 'Cancelled' }
            ].map(tab => {
              const count = myBookings.filter(b => (tab.id === 'All' ? true : getStatusCategory(b.status) === tab.id)).length;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0A4D8C] text-white shadow-xs'
                      : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F7F8FA]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F7F8FA] text-[#6B7280] border border-[#E5E7EB]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#9CA3AF] text-sm">search</span>
            <input
              type="text"
              placeholder="Search by ID, package, date..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[#9CA3AF] text-xs hover:text-[#1F2937]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-12 text-center max-w-md mx-auto my-8 shadow-xs space-y-4">
            <div className="size-16 bg-[#F7F8FA] border border-[#E5E7EB] rounded-2xl flex items-center justify-center mx-auto text-[#0A4D8C]">
              <span className="material-symbols-outlined text-3xl">inbox</span>
            </div>
            <div>
              <h3 className="text-base font-black text-[#1F2937]">No booking requests found</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed mt-1">
                {activeTab === 'All'
                  ? "You haven't submitted any travel booking enquiries yet. Browse our handcrafted tour packages to request your custom itinerary."
                  : `There are currently no requests under the "${activeTab}" filter.`}
              </p>
            </div>
            <button
              onClick={onBookNow}
              className="bg-[#0A4D8C] text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#083b6b] transition-all shadow-xs cursor-pointer"
            >
              Explore Packages & Enquire
            </button>
          </div>
        )}

        {/* Bookings List Cards */}
        {filteredBookings.length > 0 && (
          <div className="space-y-4">
            {filteredBookings.map((b, idx) => {
              const badge = getStatusBadge(b.status);
              const calc = getBookingCalculation(b);

              return (
                <div
                  key={b.bookingId || b.id || idx}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs hover:border-[#CBD5E1] transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5"
                >
                  {/* Left Side Info */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 flex-1 w-full">
                    {b.image && (
                      <img
                        src={b.image}
                        alt={b.packageTitle}
                        className="w-full sm:w-28 sm:h-28 h-40 rounded-xl object-cover border border-[#E5E7EB] flex-shrink-0"
                      />
                    )}
                    <div className="space-y-2 flex-1 min-w-0">
                      
                      {/* Status and ID Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                          <span className={`size-1.5 rounded-full ${badge.dot}`} />
                          <span>{badge.label}</span>
                        </span>
                        <span className="text-[11px] font-mono text-[#6B7280] font-bold">
                          Ref #{b.bookingId || `TRV-${idx + 1000}`}
                        </span>
                        {b.createdAt && (
                          <span className="text-[10px] text-[#9CA3AF]">
                            Submitted {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Package Title */}
                      <h3 className="text-base font-black text-[#1F2937] font-header truncate">
                        {b.packageTitle || 'Tailored Tour Package'}
                      </h3>

                      {/* Key Details Row */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1 font-semibold text-[#1F2937]">
                          <span className="material-symbols-outlined text-sm text-[#0A4D8C]">calendar_month</span>
                          <span>{b.travelDate || 'Date to be confirmed'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-[#0A4D8C]">group</span>
                          <span>{b.travelers || `${calc.adults} Adults${calc.children > 0 ? `, ${calc.children} Children` : ''}`}</span>
                        </span>
                        {b.hotelPreference && (
                          <span className="flex items-center gap-1 font-semibold text-[#FF7A00]">
                            <span className="material-symbols-outlined text-sm">hotel</span>
                            <span>{b.hotelPreference} Class</span>
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {b.transportRequired?.airportPickup && (
                          <span className="text-[10px] font-medium bg-[#F7F8FA] border border-[#E5E7EB] text-[#4B5563] px-2 py-0.5 rounded-md">
                            Airport Transfer
                          </span>
                        )}
                        {b.transportRequired?.localTransportation && (
                          <span className="text-[10px] font-medium bg-[#F7F8FA] border border-[#E5E7EB] text-[#4B5563] px-2 py-0.5 rounded-md">
                            Local Transport
                          </span>
                        )}
                        {b.contactPreference && (
                          <span className="text-[10px] font-medium bg-blue-50 border border-blue-200 text-[#0A4D8C] px-2 py-0.5 rounded-md">
                            Contact: {b.contactPreference}
                          </span>
                        )}
                      </div>

                      {/* Live Admin Notes Notification */}
                      {b.adminNotes && (
                        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2 mt-1">
                          <span className="material-symbols-outlined text-sm text-amber-700 flex-shrink-0 mt-0.5">info</span>
                          <div>
                            <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-800">Concierge Desk Note:</span>
                            <p className="text-[11px] font-medium">{b.adminNotes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side Pricing & Actions */}
                  <div className="flex flex-col items-start lg:items-end justify-between gap-3 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-[#E5E7EB]">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-[#6B7280] uppercase font-bold block tracking-wider">
                        Confirmed / Estimated Quote
                      </span>
                      <span className="text-lg font-black text-[#1F2937] font-mono">
                        {formatPrice(calc.total)}
                      </span>
                      <span className="text-[10px] text-emerald-700 block font-bold mt-0.5">
                        No Online Payment Pending
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap sm:flex-nowrap">
                      <button
                        onClick={() => setSelectedInvoiceBooking(b)}
                        className="flex-1 sm:flex-initial border border-[#E5E7EB] bg-white text-[#1F2937] text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#F7F8FA] transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="View & Download Official Quotation PDF"
                      >
                        <span className="material-symbols-outlined text-sm text-[#0A4D8C]">description</span>
                        <span>Quotation PDF</span>
                      </button>

                      <button
                        onClick={() => handleContactSupport(b)}
                        className="flex-1 sm:flex-initial border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Chat with reservation team on WhatsApp"
                      >
                        <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setSelectedBookingDetails(b)}
                        className="flex-1 sm:flex-initial bg-[#1F2937] text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Details</span>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* ── Request Details Modal with 6-Step Lifecycle Tracker & Full Amount Breakdown ── */}
      {selectedBookingDetails && (() => {
        const calc = getBookingCalculation(selectedBookingDetails);
        const badge = getStatusBadge(selectedBookingDetails.status);

        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#E5E7EB] max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 text-xs">

              {/* Modal Header */}
              <div className="flex justify-between items-start pb-4 border-b border-[#E5E7EB]">
                <div className="space-y-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                    <span className={`size-1.5 rounded-full ${badge.dot}`} />
                    <span>{badge.label}</span>
                  </span>
                  <h3 className="text-xl font-black text-[#1F2937] font-header">
                    {selectedBookingDetails.packageTitle || 'Tour Package'}
                  </h3>
                  <p className="text-xs text-[#6B7280] font-mono">
                    Reference: <strong className="text-[#1F2937]">#{selectedBookingDetails.bookingId}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBookingDetails(null)}
                  className="size-8 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-[#1F2937] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* 6-Stage Clean Step Tracker (Zero emojis) */}
              <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 space-y-3">
                <span className="text-[10px] font-extrabold uppercase text-[#6B7280] tracking-wider block">
                  Booking Request Progression
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LIFECYCLE_STAGES.map((st, sIdx) => {
                    const currentIdx = getStageIndex(selectedBookingDetails.status);
                    const isPast = sIdx < currentIdx;
                    const isCurrent = sIdx === currentIdx;

                    return (
                      <div
                        key={st.key}
                        className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                          isCurrent
                            ? 'bg-[#0A4D8C] text-white border-[#0A4D8C] shadow-xs'
                            : isPast
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                              : 'bg-white border-[#E5E7EB] text-[#9CA3AF] opacity-70'
                        }`}
                      >
                        <div className={`size-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                          isCurrent
                            ? 'bg-white text-[#0A4D8C]'
                            : isPast
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#E5E7EB] text-[#6B7280]'
                        }`}>
                          {isPast ? '✓' : st.step}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold block leading-tight truncate">{st.title}</span>
                          <span className={`text-[9px] block truncate ${isCurrent ? 'text-blue-100' : 'text-[#6B7280]'}`}>
                            {st.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-[#6B7280] block">Lead Traveller Info</span>
                  <p className="font-bold text-[#1F2937] text-sm">{selectedBookingDetails.guestName || 'Traveler'}</p>
                  <p className="text-[#6B7280]">{selectedBookingDetails.guestEmail || 'N/A'}</p>
                  <p className="text-[#6B7280]">Phone / Mobile: <strong className="text-[#1F2937]">{selectedBookingDetails.guestPhone || 'N/A'}</strong></p>
                  <p className="text-[#0A4D8C] font-semibold">Preferred Channel: {selectedBookingDetails.contactPreference || 'WhatsApp'}</p>
                </div>

                <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-[#6B7280] block">Itinerary Details</span>
                  <p className="font-bold text-[#1F2937]">Date: {selectedBookingDetails.travelDate || 'Pending'}</p>
                  <p className="text-[#6B7280]">Travellers: {selectedBookingDetails.travelers || `${calc.adults} Adults${calc.children > 0 ? `, ${calc.children} Children` : ''}`}</p>
                  <p className="text-[#FF7A00] font-bold">Accommodation: {selectedBookingDetails.hotelPreference || '4 Star'} Class</p>
                  <p className="text-emerald-700 font-medium">
                    Transport: {[
                      selectedBookingDetails.transportRequired?.airportPickup && 'Airport Transfer',
                      selectedBookingDetails.transportRequired?.localTransportation && 'Local Transportation'
                    ].filter(Boolean).join(', ') || 'Self Arranged'}
                  </p>
                </div>
              </div>

              {/* ── ITEMIZED AMOUNT CALCULATION BREAKDOWN ──────────────────────── */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-extrabold uppercase text-[#6B7280] tracking-wider block">
                  Detailed Quotation Amount Calculation
                </span>

                <div className="space-y-2 text-xs">
                  {/* Adults Fare Row */}
                  <div className="flex justify-between items-center py-1.5 border-b border-[#F3F4F6]">
                    <div>
                      <span className="font-bold text-[#1F2937]">Adult Travelers Package Fare</span>
                      <span className="text-[11px] text-[#6B7280] block">
                        {calc.adults} Adult(s) × {formatPrice(calc.perAdult)} per adult
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#1F2937]">{formatPrice(calc.totalAdult)}</span>
                  </div>

                  {/* Children Fare Row */}
                  {calc.children > 0 && (
                    <div className="flex justify-between items-center py-1.5 border-b border-[#F3F4F6]">
                      <div>
                        <span className="font-bold text-[#1F2937]">Child Travelers Fare (40% Discount)</span>
                        <span className="text-[11px] text-[#6B7280] block">
                          {calc.children} Child × {formatPrice(calc.perChild)} per child
                        </span>
                      </div>
                      <span className="font-mono font-bold text-[#1F2937]">{formatPrice(calc.totalChild)}</span>
                    </div>
                  )}

                  {/* Subtotal Base */}
                  <div className="flex justify-between items-center text-[#6B7280] pt-1">
                    <span>Base Package Fare (95%):</span>
                    <span className="font-mono font-semibold text-[#1F2937]">{formatPrice(calc.basePrice)}</span>
                  </div>

                  {/* GST (5%) */}
                  <div className="flex justify-between items-center text-[#6B7280]">
                    <span>Mandatory GST & Tourism Fees (5%):</span>
                    <span className="font-mono font-semibold text-[#1F2937]">{formatPrice(calc.gstAmount)}</span>
                  </div>

                  {/* Grand Total */}
                  <div className="flex justify-between items-center text-sm font-black text-[#1F2937] pt-2 border-t-2 border-[#1F2937]">
                    <span>Confirmed / Estimated Total Quote:</span>
                    <span className="font-mono text-base text-[#0A4D8C]">{formatPrice(calc.total)}</span>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              {selectedBookingDetails.additionalRequirements && (
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-1 text-xs">
                  <span className="text-[10px] font-extrabold uppercase text-[#6B7280] block">Your Custom Requirements</span>
                  <p className="text-[#1F2937] italic">"{selectedBookingDetails.additionalRequirements}"</p>
                </div>
              )}

              {/* Travel Desk Notes */}
              {selectedBookingDetails.adminNotes && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1 text-xs text-amber-900">
                  <span className="text-[10px] font-extrabold uppercase text-amber-700 block">Travel Desk Update</span>
                  <p className="font-bold">{selectedBookingDetails.adminNotes}</p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleContactSupport(selectedBookingDetails)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  <span>Chat on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedInvoiceBooking(selectedBookingDetails);
                    setSelectedBookingDetails(null);
                  }}
                  className="flex-1 bg-white border border-[#E5E7EB] text-[#1F2937] text-xs font-bold py-3 rounded-xl hover:bg-[#F7F8FA] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-[#0A4D8C]">description</span>
                  <span>Quotation PDF</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Quotation / Invoice Modal */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}
    </div>
  );
};
