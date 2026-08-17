import React from 'react';
import { useApp } from '../../context/AppContext';
import { generateAndDownloadInvoice } from '../../utils/invoiceGenerator';

export const InvoiceModal = ({ booking, onClose }) => {
  const { legalSettings, formatPrice } = useApp();

  if (!booking) return null;

  const bookingId = booking.bookingId || `TRV${Math.floor(10000 + Math.random() * 90000)}`;
  const invoiceNum = `INV-${bookingId.replace('TRV', '')}-${new Date().getFullYear()}`;
  const issueDate = booking.dateStr || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

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
  const travelers = booking.travelers || '2 Adults';
  const duration = booking.duration || '5 Days / 4 Nights';

  const totalAmount = typeof booking.totalAmount === 'number' ? booking.totalAmount : (parseFloat(booking.totalAmount) || parseFloat(booking.price) || 1499);
  const paidAmount = typeof booking.amountPaid === 'number' ? booking.amountPaid : (parseFloat(booking.amountPaid) || parseFloat(booking.totalPaid) || totalAmount);
  const balanceDue = typeof booking.balanceDue === 'number' ? booking.balanceDue : (parseFloat(booking.balanceDue) || (totalAmount - paidAmount));

  const basePrice = Math.round(totalAmount * 0.95);
  const gstAmount = Math.round(totalAmount * 0.05);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    generateAndDownloadInvoice(booking, legalSettings);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans print:p-0 print:bg-white">
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
            <span className="text-2xl font-black text-slate-900 tracking-wider uppercase block">
              Tax Invoice
            </span>
            <span className="text-xs font-mono font-bold text-[#0A4D8C] block mt-0.5">
              {invoiceNum}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 mt-2">
              <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
              PAYMENT VERIFIED ✓
            </span>
          </div>
        </div>

        {/* ── DETAILS GRID ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Issued By</h4>
            <p className="text-xs font-bold text-slate-900">{companyName}</p>
            <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">{companyAddress}</p>
            <p className="text-xs font-medium text-slate-600 mt-2">
              <strong className="text-slate-800">Phone:</strong> {companyPhone}<br />
              <strong className="text-slate-800">Email:</strong> {companyEmail}<br />
              <strong className="text-slate-800">GSTIN:</strong> 33AAACM9804F1Z0
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Billed To (Traveler)</h4>
            <p className="text-xs font-bold text-slate-900">{guestName}</p>
            <p className="text-xs font-medium text-slate-600 mt-1">
              <strong className="text-slate-800">Email:</strong> {guestEmail}<br />
              <strong className="text-slate-800">Mobile:</strong> {guestPhone}<br />
              <strong className="text-slate-800">Booking Ref:</strong> <span className="font-mono text-[#0A4D8C]">{bookingId}</span><br />
              <strong className="text-slate-800">Invoice Date:</strong> {issueDate}
            </p>
          </div>
        </div>

        {/* ── ITEMIZED TABLE ──────────────────────────────────────────────── */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-[11px] font-black uppercase tracking-wider">
                <th className="p-4">Item & Description</th>
                <th className="p-4">Travel Details</th>
                <th className="p-4 text-center">Qty</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              <tr>
                <td className="p-4">
                  <span className="font-black text-slate-900 block text-sm">{tourTitle}</span>
                  <span className="text-[11px] text-slate-500">Luxury Hotel Stay, Private Transfers, Sightseeing & Concierge</span>
                </td>
                <td className="p-4">
                  <span className="font-bold text-slate-800">{travelDate}</span><br />
                  <span className="text-[11px] text-slate-500">{duration} • {travelers}</span>
                </td>
                <td className="p-4 text-center font-bold">1</td>
                <td className="p-4 text-right font-black text-slate-900">{formatPrice(basePrice)}</td>
              </tr>
              <tr>
                <td className="p-4">
                  <span className="font-bold text-slate-800">Government Taxes & Service GST (5%)</span>
                  <span className="text-[11px] text-slate-500 block">Includes 5% Govt Tourism Tax & Mandatory GST</span>
                </td>
                <td className="p-4 text-[11px] font-mono text-slate-500">GST-5%</td>
                <td className="p-4 text-center font-bold">1</td>
                <td className="p-4 text-right font-black text-slate-900">{formatPrice(gstAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── TOTALS BREAKDOWN ────────────────────────────────────────────── */}
        <div className="flex flex-col items-end pt-2">
          <div className="w-full sm:w-72 space-y-2 text-xs font-medium border-t border-slate-200 pt-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-800">{formatPrice(basePrice)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST & Taxes (5%):</span>
              <span className="font-bold text-slate-800">{formatPrice(gstAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2 mt-1">
              <span>Total Package Cost:</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-extrabold text-xs bg-emerald-50 p-2 rounded-xl border border-emerald-200 mt-2">
              <span>Amount Received:</span>
              <span>{formatPrice(paidAmount)} ✓</span>
            </div>
            {balanceDue > 0 && (
              <div className="flex justify-between text-amber-700 font-extrabold text-xs bg-amber-50 p-2 rounded-xl border border-amber-200">
                <span>Balance Due:</span>
                <span>{formatPrice(balanceDue)}</span>
              </div>
            )}
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
