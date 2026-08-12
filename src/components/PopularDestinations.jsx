import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { packagesData } from '../data/travelData';

export const PopularDestinations = ({ onDetail }) => {
  const {
    formatPrice,
    wishlist,
    toggleWishlist,
    activeCategory,
    searchParams,
    destinationsList
  } = useApp();

  const [activeRegion, setActiveRegion] = useState('All');

  const regions = ['All', 'Asia', 'Europe', 'Middle East'];

  const openPackageDetails = (destination) => {
    const matchingPackage = packagesData.find((pkg) => pkg.destinationId === destination.id);
    onDetail?.(matchingPackage || {
      ...destination,
      duration: destination.duration || '5 Days / 4 Nights',
      inclusions: destination.highlights,
    });
  };

  const filteredDestinations = (destinationsList || []).filter(dest => {
    // Admin Active check
    if (dest.status && dest.status !== 'Active') return false;
    if (dest.popular === false && !dest.featured) return false;

    // Category filter
    if (activeCategory && dest.category !== activeCategory) {
      return false;
    }
    // Region filter
    if (activeRegion !== 'All' && dest.region !== activeRegion) {
      return false;
    }
    // Search query filter
    if (searchParams.destination) {
      const q = searchParams.destination.toLowerCase();
      if (!dest.title.toLowerCase().includes(q) && !dest.description?.toLowerCase().includes(q)) {
        return false;
      }
    }
    // Budget filter
    if (searchParams.budget && dest.price > searchParams.budget) {
      return false;
    }
    return true;
  }).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <section id="destinations" className="py-20 bg-[#0A4D8C]/5 px-4 sm:px-6 transition-colors">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-xs font-bold text-[#0A4D8C] uppercase tracking-widest block mb-2">
              Top Picked Locations
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-header">
              Popular Destinations
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              The most sought-after places by travelers this season
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-x-auto max-w-full">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                  activeRegion === region
                    ? 'bg-[#0A4D8C] text-white shadow-md shadow-[#0A4D8C]/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredDestinations.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-200">
            <span className="material-symbols-outlined text-5xl text-slate-400 mb-3">travel_explore</span>
            <h3 className="text-xl font-bold mb-1 text-slate-900">No destinations match your criteria</h3>
            <p className="text-sm text-slate-500 mb-4">Try clearing your budget or category filters.</p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => {
              const isWishlisted = wishlist.includes(dest.id);

              return (
                <div
                  key={dest.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-200/80 flex flex-col"
                >
                  {/* Card Image Header */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                    {/* Featured Tag */}
                    {dest.featured && (
                      <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md">
                        ★ Featured
                      </span>
                    )}

                    {/* Heart Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(dest.id, dest.title);
                      }}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-lg"
                      title="Save to wishlist"
                    >
                      <span className={`material-symbols-outlined text-lg ${isWishlisted ? 'filled' : ''}`}>
                        favorite
                      </span>
                    </button>

                    {/* Weather Badge */}
                    <div className="absolute bottom-3 left-4 text-white text-xs font-bold flex items-center gap-1.5 drop-shadow-md">
                      <span className="material-symbols-outlined text-amber-300 text-sm">wb_sunny</span>
                      <span>{dest.weather}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-xl font-black text-slate-900 font-header">
                          {dest.title}
                        </h3>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-extrabold bg-amber-500/10 px-2 py-0.5 rounded-md">
                          <span className="material-symbols-outlined text-sm">star</span>
                          <span>{dest.rating}</span>
                        </div>
                      </div>

                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                        {dest.description}
                      </p>
                    </div>

                    {/* Footer price & Action */}
                    <div>
                      <div className="flex justify-between items-end mb-5 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Starts from</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-black text-[#0A4D8C] font-header">
                              {formatPrice(dest.price)}
                            </p>
                            {dest.originalPrice && (
                              <p className="text-xs text-slate-400 line-through">
                                {formatPrice(dest.originalPrice)}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {dest.flightDuration}
                        </span>
                      </div>

                      <button
                        onClick={() => openPackageDetails(dest)}
                        className="w-full py-3 bg-slate-100 text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#0A4D8C] hover:text-white transition-all duration-200 cursor-pointer shadow-xs"
                      >
                        View Details & Packages
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
