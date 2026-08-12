import React from 'react';
import { useApp } from '../../context/AppContext';

export const MyBookingsModal = () => {
  const { isMyBookingsOpen, setIsMyBookingsOpen, myBookings, showToast } = useApp();

  if (!isMyBookingsOpen) return null;

  const handlePrintBoardingPass = (bookingId) => {
    showToast(`🖨️ Generating digital boarding pass for #${bookingId}...`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-[#0A4D8C] text-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">confirmation_number</span>
            <h3 className="text-xl font-black font-header">My Active & Past Bookings</h3>
          </div>
          <button
            onClick={() => setIsMyBookingsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {myBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-2">flight_takeoff</span>
              <p className="font-bold text-sm">No bookings yet</p>
              <p className="text-xs mt-1">Book your first vacation to view your itinerary & digital boarding passes here.</p>
            </div>
          ) : (
            myBookings.map((b) => (
              <div
                key={b.bookingId}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold font-mono text-[#0A4D8C] dark:text-[#3FA9F5] bg-[#0A4D8C]/10 px-2 py-0.5 rounded">
                      ID: #{b.bookingId}
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-1 font-header">
                      {b.packageTitle}
                    </h4>
                    <p className="text-xs text-slate-500">📍 {b.destination}</p>
                  </div>

                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/20">
                    ✓ {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-slate-200/60 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Travel Date</span>
                    <span className="font-bold">{b.travelDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Travelers</span>
                    <span className="font-bold">{b.travelers} Persons</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Amount Paid</span>
                    <span className="font-bold text-[#0A4D8C] dark:text-[#3FA9F5]">{b.totalPaid}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handlePrintBoardingPass(b.bookingId)}
                    className="text-xs font-bold text-[#0A4D8C] dark:text-[#3FA9F5] flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">print</span>
                    Download Ticket Pass
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
