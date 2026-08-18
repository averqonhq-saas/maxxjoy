import React from 'react';
import { useApp } from '../../context/AppContext';
import { generateAndDownloadInvoice } from '../../utils/invoiceGenerator';

export const InvoiceModal = ({ booking, onClose }) => {
  const { legalSettings, formatPrice } = useApp();

  if (!booking) return null;

  const bookingId = booking.bookingId || `TRV${Math.floor(10000 + Math.random() * 90000)}`;
  const invoiceNum = `INV-${bookingId.replace('TRV-', '').replace('TRV', '')}-${new Date().getFullYear()}`;
  const issueDate = booking.dateStr || (booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));

  const isPlaceholder = (str) => !str || str.includes('Perfect Travel') || str.includes('123 Adventure') || str.includes('555') || str.includes('perfecttravel');

  const companyName = isPlaceholder(legalSettings?.companyName) ? 'Maxx Joy Tours and Travel Pvt Ltd' : legalSettings.companyName;
  const companyAddress = isPlaceholder(legalSettings?.address) ? 'NO 6 new annai indra nagar maruthamalai, Coimbatore 641046, Tamil Nadu' : legalSettings.address;
  const companyPhone = isPlaceholder(legalSettings?.phone) ? '+91 98047 77879 / +91 74184 07088' : legalSettings.phone;
  const companyEmail = isPlaceholder(legalSettings?.email) ? 'Info@maxxjoytours.com' : legalSettings.email;

  const rawGuestEmail = booking.email || booking.guestEmail || booking.userEmail;
  const guestName = booking.fullName || booking.guestName || booking.name || 'Valued Traveler';
  const guestEmail = (!rawGuestEmail || rawGuestEmail.includes('example.com')) ? 'Info@maxxjoytours.com' : rawGuestEmail;
  const guestPhone = booking.phone || booking.guestPhone || '+91 98047 77879';

  const tourTitle = booking.packageTitle || booking.title || 'Custom Luxury Tour Package';
  const travelDate = booking.travelDate || booking.date || 'Upcoming Travel';
  const duration = booking.duration || '5 Days / 4 Nights';

  const adults = parseInt(booking.adults) || 2;
  const children = parseInt(booking.children) || 0;
  const travelers = booking.travelers || `${adults} Adults${children > 0 ? `, ${children} Children` : ''}`;

  // Robust total amount resolution matching cards and admin CRM
  const totalAmount = typeof booking.estimatedCost === 'number' && booking.estimatedCost > 0
    ? booking.estimatedCost
    : (typeof booking.totalAmount === 'number' && booking.totalAmount > 0
      ? booking.totalAmount
      : (parseFloat(booking.estimatedCost) || parseFloat(booking.totalAmount) || ((parseFloat(booking.price || booking.basePrice) || 1499) * adults)));

  const perAdultPrice = booking.price ? parseFloat(booking.price) : Math.round(totalAmount / (adults + children * 0.6));
  const perChildPrice = Math.round(perAdultPrice * 0.6);
  const totalAdultFare = perAdultPrice * adults;
  const totalChildFare = perChildPrice * children;

  const basePrice = Math.round(totalAmount * 0.95);
  const gstAmount = totalAmount - basePrice;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    generateAndDownloadInvoice(booking, legalSettings);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans print:p-0 print:bg-white antialiased">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-10 shadow-2xl space-y-6 relative my-8 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none">
        
        {/* Top Floating Close Button for Screen */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 size-10 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer print:hidden"
          title="Close Modal"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* ── INVOICE HEADER ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-dashed border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="size-14 rounded-2xl bg-[#0A4D8C] text-white flex items-center justify-center font-black text-2xl shadow-md">
              M
            </div>
            <div>
              <h2 className="font-header text-2xl font-black text-[#0A4D8C] tracking-tight">
                Maxx <span className="text-amber-500">Joy</span>
              </h2>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Tours & Travel Pvt Ltd
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-wider uppercase block">
              Booking Quotation & Invoice
            </span>
            <span className="text-xs font-mono font-bold text-[#0A4D8C] block mt-0.5">
              {invoiceNum}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 mt-2">
              <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>{booking.status || 'CONFIRMED QUOTATION'}</span>
            </span>
          </div>
        </div>

        {/* ── DETAILS GRID ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Issued By</h4>
            <p className="font-bold text-slate-900">{companyName}</p>
            <p className="font-medium text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">{companyAddress}</p>
            <p className="font-medium text-slate-600 mt-2">
              <strong className="text-slate-800">Phone:</strong> {companyPhone}<br />
              <strong className="text-slate-800">Email:</strong> {companyEmail}<br />
              <strong className="text-slate-800">GSTIN:</strong> 33AAACM9804F1Z0
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Billed To (Traveler)</h4>
            <p className="font-bold text-slate-900">{guestName}</p>
            <p className="font-medium text-slate-600 mt-1">
              <strong className="text-slate-800">Email:</strong> {guestEmail}<br />
              <strong className="text-slate-800">Mobile:</strong> {guestPhone}<br />
              <strong className="text-slate-800">Booking Ref:</strong> <span className="font-mono text-[#0A4D8C]">#{bookingId}</span><br />
              <strong className="text-slate-800">Travel Date:</strong> {travelDate}
            </p>
          </div>
        </div>

        {/* ── ITEMIZED BREAKDOWN TABLE ──────────────────────────────────────── */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-[11px] font-black uppercase tracking-wider">
                <th className="p-3.5">Package Item & Description</th>
                <th className="p-3.5 text-center">Travellers</th>
                <th className="p-3.5 text-right">Unit Rate</th>
                <th className="p-3.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              <tr>
                <td className="p-3.5">
                  <span className="font-black text-slate-900 block text-sm">{tourTitle}</span>
                  <span className="text-[11px] text-slate-500">
                    {duration} • {travelers} • Hotel: {booking.hotelPreference || '4 Star'} Class
                  </span>
                </td>
                <td className="p-3.5 text-center font-bold">{adults} Adult(s)</td>
                <td className="p-3.5 text-right font-mono">{formatPrice(perAdultPrice)}</td>
                <td className="p-3.5 text-right font-black text-slate-900 font-mono">{formatPrice(totalAdultFare)}</td>
              </tr>
              {children > 0 && (
                <tr>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-800">Child Fare (Special 40% Discount)</span>
                    <span className="text-[11px] text-slate-500 block">Includes extra bed, meals & activities</span>
                  </td>
                  <td className="p-3.5 text-center font-bold">{children} Child</td>
                  <td className="p-3.5 text-right font-mono">{formatPrice(perChildPrice)}</td>
                  <td className="p-3.5 text-right font-black text-slate-900 font-mono">{formatPrice(totalChildFare)}</td>
                </tr>
              )}
              <tr>
                <td className="p-3.5">
                  <span className="font-bold text-slate-800">Inclusions & Logistics</span>
                  <span className="text-[11px] text-slate-500 block">
                    {[
                      booking.transportRequired?.airportPickup && 'Airport Pickup',
                      booking.transportRequired?.localTransportation && 'Local Transportation',
                      'Daily Breakfasts & Sightseeing Excursions'
                    ].filter(Boolean).join(' • ')}
                  </span>
                </td>
                <td className="p-3.5 text-center font-bold text-emerald-700">Included</td>
                <td className="p-3.5 text-right text-emerald-700 font-bold">Complimentary</td>
                <td className="p-3.5 text-right font-bold text-emerald-700">Included</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── TOTALS & TAX BREAKDOWN ────────────────────────────────────────── */}
        <div className="flex flex-col items-end pt-2">
          <div className="w-full sm:w-80 space-y-2 text-xs font-medium border-t border-slate-200 pt-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Base Fare (95%):</span>
              <span className="font-bold text-slate-800 font-mono">{formatPrice(basePrice)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Mandatory GST & Tourism Tax (5%):</span>
              <span className="font-bold text-slate-800 font-mono">{formatPrice(gstAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2 mt-1">
              <span>Confirmed / Estimated Total:</span>
              <span className="font-mono">{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-800 font-bold text-xs bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 mt-2">
              <span>Payment Condition:</span>
              <span>Enquiry Based · No Online Advance</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER SEAL & NOTE ──────────────────────────────────────────── */}
        <div className="pt-6 border-t border-slate-200 text-center space-y-3">
          <p className="text-xs font-semibold text-slate-600">
            Thank you for choosing <strong className="text-slate-900">Maxx Joy Tours and Travel Pvt Ltd</strong> for your journey!
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-[#0A4D8C]">
            <span className="material-symbols-outlined text-base">verified</span>
            <span>Official Computer Generated Tax Invoice • Maxx Joy Signature Stamp</span>
          </div>
        </div>

        {/* ── ACTION BUTTONS FOR SCREEN VIEW ──────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-[#0A4D8C] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#073c6e] shadow-lg shadow-[#0A4D8C]/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Print / Save PDF</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="bg-slate-100 border border-slate-200 text-slate-800 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Download HTML File</span>
          </button>

          <button
            onClick={onClose}
            className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
