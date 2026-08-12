import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const WishlistPage = ({ onBack, onBookNow }) => {
  const { wishlist, toggleWishlist, formatPrice, setSelectedDestinationModal, showToast, packagesList } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [compareItems, setCompareItems] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Get full package objects for items in wishlist from dynamic packagesList
  const savedPackages = (packagesList || []).filter(pkg => wishlist.includes(pkg.id));

  // Category Filter logic
  const categories = ['All', 'Domestic', 'International', 'Honeymoon', 'Adventure'];

  const filteredPackages = savedPackages.filter(pkg => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Honeymoon') return pkg.category === 'honeymoon';
    if (activeFilter === 'Adventure') return pkg.category === 'adventure';
    if (activeFilter === 'Domestic') return pkg.destinationName?.toLowerCase().includes('india') || pkg.destinationName?.toLowerCase().includes('swiss');
    if (activeFilter === 'International') return !pkg.destinationName?.toLowerCase().includes('india');
    return true;
  });

  const toggleCompare = (pkgId) => {
    if (compareItems.includes(pkgId)) {
      setCompareItems(prev => prev.filter(id => id !== pkgId));
    } else {
      if (compareItems.length >= 3) {
        showToast('You can compare up to 3 packages at once', 'info');
        return;
      }
      setCompareItems(prev => [...prev, pkgId]);
    }
  };

  const handleShareWishlist = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Wishlist link copied to clipboard! 📋', 'success');
    } else {
      showToast('Shared wishlist link generated', 'info');
    }
  };

  const comparePackagesList = (packagesList || []).filter(p => compareItems.includes(p.id));

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
                My Wishlist <span className="text-rose-500">❤️</span>
              </h1>
              <p className="text-[11px] text-[#64748B] font-medium">
                {savedPackages.length} Saved Tour{savedPackages.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareItems.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="bg-[#1A1A1A] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md hover:bg-[#333] transition-all"
              >
                <span className="material-symbols-outlined text-sm">compare_arrows</span>
                Compare ({compareItems.length})
              </button>
            )}
            <button
              onClick={handleShareWishlist}
              className="bg-white border border-[#E2E8F0] text-[#1A1A1A] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#F5F9FC] transition-all"
            >
              <span className="material-symbols-outlined text-sm text-[#64748B]">share</span>
              Share Wishlist
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ───────────────────────────────────── */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8">

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap border ${
                activeFilter === cat
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
              }`}
            >
              {cat === 'All' ? `All (${savedPackages.length})` : cat}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {savedPackages.length === 0 && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="size-20 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-rose-400" style={{ fontSize: 36 }}>favorite</span>
            </div>
            <h3 className="text-xl font-black text-[#1A1A1A] mb-2">Your wishlist is empty</h3>
            <p className="text-xs text-[#64748B] leading-relaxed mb-6">
              Explore our handcrafted tours and tap the heart icon to save your favorite destinations for later.
            </p>
            <button
              onClick={onBack}
              className="bg-[#FF7A00] text-white font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-[#e56e00] transition-all shadow-md"
            >
              Browse Destinations →
            </button>
          </div>
        )}

        {/* Packages Grid */}
        {filteredPackages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map(pkg => {
              const hasPriceDrop = pkg.originalPrice && pkg.originalPrice > pkg.price;
              const priceDifference = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;
              const isSelectedForCompare = compareItems.includes(pkg.id);

              return (
                <div
                  key={pkg.id}
                  className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Remove from wishlist */}
                      <button
                        onClick={() => toggleWishlist(pkg.id, pkg.title)}
                        className="absolute top-3 right-3 size-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-md"
                        title="Remove from saved"
                      >
                        <span className="material-symbols-outlined text-base fill-current">favorite</span>
                      </button>

                      {/* Compare Checkbox pill */}
                      <button
                        onClick={() => toggleCompare(pkg.id)}
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all flex items-center gap-1 ${
                          isSelectedForCompare
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                            : 'bg-white/90 text-[#1A1A1A] border-[#E2E8F0] hover:bg-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isSelectedForCompare ? 'check_circle' : 'add_circle'}
                        </span>
                        {isSelectedForCompare ? 'Comparing' : '+ Compare'}
                      </button>

                      {/* Rating Badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-bold">
                        <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                        <span>{pkg.rating} ({pkg.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Price Drop Notification Banner */}
                    {hasPriceDrop && (
                      <div className="bg-amber-50 border-b border-amber-200/70 p-3 px-4 flex items-center gap-2 text-xs text-amber-900 font-medium">
                        <span className="material-symbols-outlined text-amber-600 text-sm flex-shrink-0">trending_down</span>
                        <div className="leading-tight">
                          <span className="font-extrabold">Price dropped! 🎉 </span>
                          <span>Was {formatPrice(pkg.originalPrice)} now {formatPrice(pkg.price)} (Save {formatPrice(priceDifference)})</span>
                        </div>
                      </div>
                    )}

                    {/* Body Content */}
                    <div className="p-5">
                      <div className="flex justify-between items-center text-[11px] text-[#64748B] font-bold uppercase tracking-wider mb-1">
                        <span>{pkg.duration}</span>
                        <span className="text-emerald-600 font-extrabold">🟢 Available</span>
                      </div>

                      <h3 className="text-lg font-black text-[#1A1A1A] mb-2">{pkg.title}</h3>
                      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4">
                        {pkg.inclusions.join(' • ')}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-5 pt-0 border-t border-[#E2E8F0]/60 mt-auto flex items-center justify-between gap-3 pt-4">
                    <div>
                      <span className="text-[10px] text-[#64748B] uppercase font-bold block">Current Price</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-[#1A1A1A]">{formatPrice(pkg.price)}</span>
                        {pkg.originalPrice && (
                          <span className="text-xs text-[#64748B] line-through">{formatPrice(pkg.originalPrice)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDestinationModal(pkg)}
                        className="p-2.5 rounded-xl border border-[#E2E8F0] text-[#1A1A1A] hover:bg-[#F5F9FC] text-xs font-bold transition-all"
                        title="View Details"
                      >
                        Details
                      </button>
                      <button
                        onClick={onBookNow}
                        className="bg-[#FF7A00] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl hover:bg-[#e56e00] shadow-md shadow-[#FF7A00]/20 transition-all"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* ── Compare Drawer / Modal ───────────────────────────────── */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E2E8F0]">
              <h2 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1A1A1A]">compare_arrows</span>
                Package Comparison
              </h2>
              <button
                onClick={() => setShowCompareModal(false)}
                className="size-8 rounded-full bg-[#F5F9FC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1A1A1A]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparePackagesList.map(item => (
                <div key={item.id} className="border border-[#E2E8F0] rounded-2xl p-4 space-y-3 bg-[#F5F9FC]">
                  <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded-xl" />
                  <h4 className="font-extrabold text-[#1A1A1A] text-sm">{item.title}</h4>
                  <div className="text-xs space-y-1 text-[#64748B]">
                    <p><strong className="text-[#1A1A1A]">Duration:</strong> {item.duration}</p>
                    <p><strong className="text-[#1A1A1A]">Price:</strong> {formatPrice(item.price)}</p>
                    <p><strong className="text-[#1A1A1A]">Rating:</strong> ⭐ {item.rating}</p>
                  </div>
                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <span className="text-[11px] font-bold text-[#1A1A1A] block mb-1">Highlights:</span>
                    <ul className="text-[11px] text-[#64748B] space-y-1">
                      {item.inclusions.slice(0, 3).map((inc, i) => (
                        <li key={i}>• {inc}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => { setShowCompareModal(false); onBookNow(); }}
                    className="w-full bg-[#FF7A00] text-white py-2 rounded-xl font-extrabold text-xs hover:bg-[#e56e00] transition-all mt-2"
                  >
                    Select & Book
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
