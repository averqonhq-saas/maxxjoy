import React from 'react';
import { useApp } from '../../context/AppContext';
import { destinationsData, packagesData } from '../../data/travelData';

export const WishlistDrawer = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    formatPrice,
    setSelectedPackageForBooking
  } = useApp();

  if (!isWishlistOpen) return null;

  // Combine items matching wishlist IDs
  const savedItems = [
    ...destinationsData.filter(d => wishlist.includes(d.id)),
    ...packagesData.filter(p => wishlist.includes(p.id))
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500">favorite</span>
              <h3 className="text-lg font-black font-header">Saved Wishlist ({wishlist.length})</h3>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {/* Body List */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {savedItems.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-2">favorite_border</span>
                <p className="font-bold text-sm">Your wishlist is empty</p>
                <p className="text-xs mt-1">Tap the heart icon on any tour package or destination to save it for later.</p>
              </div>
            ) : (
              savedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex gap-4 border border-slate-200/60 dark:border-slate-700/60 relative group"
                >
                  <img src={item.image} alt={item.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.duration || item.region}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm font-black text-[#0A4D8C] dark:text-[#3FA9F5]">{formatPrice(item.price)}</p>
                      
                      <button
                        onClick={() => {
                          setIsWishlistOpen(false);
                          setSelectedPackageForBooking(item);
                        }}
                        className="bg-[#FF7A00] text-white px-3 py-1 rounded-lg text-xs font-bold"
                      >
                        Book
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleWishlist(item.id, item.title)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 text-xs p-1"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {savedItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  setSelectedPackageForBooking(packagesData[0]);
                }}
                className="w-full bg-[#0A4D8C] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center"
              >
                Proceed to Book All Saved Tours
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
