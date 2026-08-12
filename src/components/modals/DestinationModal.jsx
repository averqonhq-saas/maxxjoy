import React from 'react';
import { useApp } from '../../context/AppContext';
import { packagesData } from '../../data/travelData';

export const DestinationModal = () => {
  const {
    selectedDestinationModal,
    setSelectedDestinationModal,
    setSelectedPackageForBooking,
    formatPrice
  } = useApp();

  if (!selectedDestinationModal) return null;

  const dest = selectedDestinationModal;

  const handleBookFromDestination = () => {
    // Find matching package or fallback
    const pkg = packagesData.find(p => p.destinationId === dest.id) || packagesData[0];
    setSelectedDestinationModal(null);
    setSelectedPackageForBooking(pkg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden relative">
        
        {/* Header Image */}
        <div className="relative h-64 sm:h-72">
          <img src={dest.image} alt={dest.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          <button
            onClick={() => setSelectedDestinationModal(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
              📍 {dest.region}
            </span>
            <h3 className="text-3xl font-black mt-2 font-header">
              {dest.title}
            </h3>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Weather</p>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">{dest.weather}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Best Season</p>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">{dest.bestTime}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Flight Time</p>
              <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">{dest.flightDuration}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Overview</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {dest.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Key Highlights & Excursions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {dest.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="material-symbols-outlined text-[#0A4D8C] dark:text-[#3FA9F5] text-sm">stars</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Starting Package Price</p>
            <p className="text-2xl font-black text-[#0A4D8C] dark:text-[#3FA9F5] font-header">
              {formatPrice(dest.price)}
            </p>
          </div>

          <button
            onClick={handleBookFromDestination}
            className="bg-[#FF7A00] text-white px-7 py-3 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#ff891a] shadow-lg shadow-[#FF7A00]/25 transition-all"
          >
            Explore & Book Packages
          </button>
        </div>

      </div>
    </div>
  );
};
