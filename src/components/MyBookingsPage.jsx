import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAndDownloadInvoice, generateAndDownloadItinerary } from '../utils/invoiceGenerator';
import { InvoiceModal } from './modals/InvoiceModal';

export const MyBookingsPage = ({ onBack, onBookNow }) => {
  const { myBookings, formatPrice, legalSettings, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('Upcoming'); // 'Upcoming' | 'Completed' | 'Cancelled'
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  // Filter bookings based on activeTab
  const filteredBookings = myBookings.filter(b => {
    if (activeTab === 'Upcoming') return b.status === 'Confirmed' || b.status === 'Upcoming' || !b.status;
    if (activeTab === 'Completed') return b.status === 'Completed';
    if (activeTab === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  const handleDownloadInvoice = (target) => {
    const booking = typeof target === 'object' && target !== null 
      ? target 
      : (myBookings.find(b => b.bookingId === target) || { bookingId: target });
    
    setSelectedInvoiceBooking(booking);
  };

  const handleDownloadItinerary = (target) => {
    const booking = typeof target === 'object' && target !== null 
      ? target 
      : (myBookings.find(b => b.bookingId === target) || { bookingId: target });
    
    showToast(`🗺️ Travel Itinerary for ${booking.bookingId || 'Booking'} downloaded!`, 'success');
    generateAndDownloadItinerary(booking, legalSettings);
  };

  const handleContactSupport = () => {
    showToast('Connecting to 24/7 Travel Concierge Support at +91 98047 77879...', 'info');
  };

  // Sample timeline steps for active booking
  const TIMELINE_STEPS = [
    { label: 'Booking Requested', status: 'completed' },
    { label: 'Payment Received', status: 'completed' },
    { label: 'Booking Confirmed', status: 'completed' },
    { label: 'Hotel Confirmed', status: 'completed' },
    { label: 'Trip Upcoming', status: 'current' },
    { label: 'Trip Completed', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FC] font-sans pb-16">
      {/* ── Top Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#1A1A1A] border border-[#E2E8F0] rounded-xl px-3 py-2 transition-all hover:bg-[#F5F9FC]"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
              Back
            </button>
            <div className="h-6 w-[1px] bg-[#E2E8F0]" />
            <div>
              <h1 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                My Bookings 🎫
              </h1>
              <p className="text-[11px] text-[#64748B] font-medium">
                Customer Travel Management Center
              </p>
            </div>
          </div>

          <button
            onClick={onBookNow}
            className="bg-[#FF7A00] text-white text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-[#e56e00] shadow-md shadow-[#FF7A00]/20 transition-all"
          >
            + Book New Trip
          </button>
        </div>
      </header>

      {/* ── Main Content Area ───────────────────────────────────── */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8">

        {/* Tab Navigation */}
        <div className="flex bg-white p-1.5 border border-[#E2E8F0] rounded-2xl max-w-md mb-8 shadow-sm">
          {['Upcoming', 'Completed', 'Cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all text-center ${
                activeTab === tab
                  ? 'bg-[#1A1A1A] text-white shadow-md'
                  : 'text-[#64748B] hover:text-[#1A1A1A]'
              }`}
            >
              {tab} ({myBookings.filter(b => (tab === 'Upcoming' ? b.status !== 'Completed' && b.status !== 'Cancelled' : b.status === tab)).length})
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="size-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[#0A4D8C]" style={{ fontSize: 36 }}>confirmation_number</span>
            </div>
            <h3 className="text-xl font-black text-[#1A1A1A] mb-2">No {activeTab.toLowerCase()} bookings</h3>
            <p className="text-xs text-[#64748B] leading-relaxed mb-6">
              {activeTab === 'Upcoming'
                ? "You don't have any upcoming trips reserved yet. Explore our curated packages to get started!"
                : `You currently have no ${activeTab.toLowerCase()} tour reservations.`}
            </p>
            <button
              onClick={onBookNow}
              className="bg-[#FF7A00] text-white font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-[#e56e00] transition-all shadow-md"
            >
              Book Your Next Tour →
            </button>
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length > 0 && (
          <div className="space-y-4 max-w-3xl">
            {filteredBookings.map((b, idx) => (
              <div
                key={b.bookingId || idx}
                className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div className="flex items-start gap-4">
                  {b.image && (
                    <img
                      src={b.image}
                      alt={b.packageTitle}
                      className="size-20 rounded-2xl object-cover border border-[#E2E8F0] flex-shrink-0"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 border border-emerald-200 text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        🟢 {b.status || 'Confirmed'}
                      </span>
                      <span className="text-[11px] font-mono text-[#64748B]">ID: {b.bookingId}</span>
                    </div>

                    <h3 className="text-lg font-black text-[#1A1A1A] mb-1">{b.packageTitle || 'Dubai Luxury Escape'}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                        {b.travelDate || '12 Sep 2026 – 15 Sep 2026'}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">group</span>
                        {b.travelers || '2 Adults'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end sm:items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-[#E2E8F0]">
                  <div className="text-right">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Total Amount</span>
                    <span className="text-xl font-black text-[#1A1A1A]">
                      {typeof b.totalPaid === 'number' ? formatPrice(b.totalPaid) : (b.totalPaid || formatPrice(b.price || 0))}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleDownloadInvoice(b)}
                      className="flex-1 sm:flex-initial border border-[#E2E8F0] bg-white text-[#1A1A1A] text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-[#F5F9FC] transition-all cursor-pointer"
                    >
                      Invoice
                    </button>
                    <button
                      onClick={() => setSelectedBookingDetails(b)}
                      className="flex-1 sm:flex-initial bg-[#1A1A1A] text-white text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-[#333] transition-all shadow-sm"
                    >
                      View Booking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* ── View Booking Detail Modal / Drawer ──────────────────── */}
      {selectedBookingDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">

            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 border border-emerald-200 text-emerald-700 mb-2">
                  🟢 Booking Confirmed
                </span>
                <h2 className="text-2xl font-black text-[#1A1A1A]">
                  {selectedBookingDetails.packageTitle || 'Dubai Premium Escape'}
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-[#64748B] mt-1 font-medium">
                  <span>Booking ID: <strong className="text-[#1A1A1A] font-mono">{selectedBookingDetails.bookingId}</strong></span>
                  <span>Travel Date: <strong className="text-[#1A1A1A]">{selectedBookingDetails.travelDate || '12 Sep 2026'}</strong></span>
                  <span>Travellers: <strong className="text-[#1A1A1A]">{selectedBookingDetails.travelers || '2 Adults'}</strong></span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBookingDetails(null)}
                className="size-9 rounded-full bg-[#F5F9FC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1A1A1A]"
              >
                ✕
              </button>
            </div>

            {/* 🔔 Booking Status Timeline */}
            <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] mb-4">
                Booking Status Timeline
              </h4>
              <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
                {TIMELINE_STEPS.map((step, idx) => (
                  <div key={idx} className="flex sm:flex-col items-center gap-3 sm:gap-1.5 text-center flex-1 z-10">
                    <div
                      className={`size-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                        step.status === 'completed'
                          ? 'bg-emerald-500 text-white'
                          : step.status === 'current'
                          ? 'bg-[#1A1A1A] text-white ring-4 ring-black/10'
                          : 'bg-[#E2E8F0] text-[#64748B]'
                      }`}
                    >
                      {step.status === 'completed' ? '✓' : step.status === 'current' ? '●' : '○'}
                    </div>
                    <span
                      className={`text-[11px] font-bold ${
                        step.status === 'completed'
                          ? 'text-emerald-700'
                          : step.status === 'current'
                          ? 'text-[#1A1A1A]'
                          : 'text-[#64748B]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions / Components */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl p-3.5">
                <span className="text-lg mb-1 block">📍</span>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Destination</span>
                <span className="text-xs font-extrabold text-[#1A1A1A]">Dubai, UAE</span>
              </div>
              <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl p-3.5">
                <span className="text-lg mb-1 block">🏨</span>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Hotel</span>
                <span className="text-xs font-extrabold text-[#1A1A1A]">5-Star Luxury</span>
              </div>
              <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl p-3.5">
                <span className="text-lg mb-1 block">✈️</span>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Flight</span>
                <span className="text-xs font-extrabold text-[#1A1A1A]">Roundtrip Included</span>
              </div>
              <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl p-3.5">
                <span className="text-lg mb-1 block">🚐</span>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Transport</span>
                <span className="text-xs font-extrabold text-[#1A1A1A]">Airport Pickup</span>
              </div>
            </div>

            {/* 📅 ITINERARY */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">📅 ITINERARY</h4>
              <div className="space-y-2 border border-[#E2E8F0] rounded-2xl p-4 bg-white">
                {[
                  { day: 'Day 1', title: 'Arrival & Airport Pickup → Hotel Check-in' },
                  { day: 'Day 2', title: 'Dubai City Tour & Burj Khalifa Sky Deck' },
                  { day: 'Day 3', title: 'Desert Safari with Quad Biking & Starlit Dinner' },
                  { day: 'Day 4', title: 'Leisure Spa Morning → Airport Chauffeur Departure' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-[#E2E8F0] last:border-b-0">
                    <span className="bg-[#1A1A1A] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                      {item.day}
                    </span>
                    <span className="text-xs font-extrabold text-[#1A1A1A] mt-0.5">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            {(() => {
              const b = selectedBookingDetails;
              const totalAmt = b.totalAmount || b.price || b.totalPaid || 0;
              const paidAmt = b.amountPaid !== undefined ? b.amountPaid : b.totalPaid || totalAmt;
              const balDue = b.balanceDue !== undefined ? b.balanceDue : 0;
              
              const fmtTotal = typeof totalAmt === 'number' ? formatPrice(totalAmt) : (String(totalAmt).includes('$') || String(totalAmt).includes('₹') || String(totalAmt).includes('€') || String(totalAmt).includes('£') || String(totalAmt).includes('AED') ? totalAmt : formatPrice(parseFloat(totalAmt) || 0));
              const fmtPaid = typeof paidAmt === 'number' ? formatPrice(paidAmt) : (String(paidAmt).includes('$') || String(paidAmt).includes('₹') || String(paidAmt).includes('€') || String(paidAmt).includes('£') || String(paidAmt).includes('AED') ? paidAmt : formatPrice(parseFloat(paidAmt) || 0));
              const fmtBal = typeof balDue === 'number' ? formatPrice(balDue) : formatPrice(parseFloat(balDue) || 0);

              return (
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Total Package Cost:</span>
                    <span className="font-extrabold text-[#1A1A1A]">{fmtTotal}</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Amount Paid:</span>
                    <span className="font-extrabold text-emerald-600">{fmtPaid}</span>
                  </div>
                  {balDue > 0 && (
                    <div className="flex justify-between text-amber-600 font-extrabold text-xs">
                      <span>Remaining Balance:</span>
                      <span>{fmtBal}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#E2E8F0] flex justify-between font-black text-sm text-[#1A1A1A]">
                    <span>Payment Status:</span>
                    <span className="text-emerald-600 uppercase">{b.paymentStatus || 'PAID ✓'}</span>
                  </div>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleDownloadInvoice(selectedBookingDetails)}
                className="flex-1 bg-white border border-[#E2E8F0] text-[#1A1A1A] text-xs font-extrabold py-3 rounded-xl hover:bg-[#F5F9FC] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Download Invoice
              </button>
              <button
                onClick={() => handleDownloadItinerary(selectedBookingDetails)}
                className="flex-1 bg-white border border-[#E2E8F0] text-[#1A1A1A] text-xs font-extrabold py-3 rounded-xl hover:bg-[#F5F9FC] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">map</span>
                Download Itinerary
              </button>
              <button
                onClick={handleContactSupport}
                className="flex-1 bg-[#1A1A1A] text-white text-xs font-extrabold py-3 rounded-xl hover:bg-[#333] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">support_agent</span>
                Contact Support
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Invoice Modal ──────────────────────────────────────── */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}
    </div>
  );
};
