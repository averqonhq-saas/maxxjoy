import React, { useState } from 'react';
import { useApp } from '../context/AppContext';



export const ExploreToursPage = ({ onBack, onBookNow, onDetail, onLogin }) => {
  const { formatPrice, showToast, packagesList, searchParams } = useApp();

  // Filters State initialized with searchParams from Hero Search widget
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [maxPrice, setMaxPrice] = useState(searchParams?.budget || 5000);
  const [searchQuery, setSearchQuery] = useState(searchParams?.destination || '');
  const [sortBy, setSortBy] = useState('Popularity');
  const [currentPage, setCurrentPage] = useState(1);

  const toggleRegion = (region) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const clearAllFilters = () => {
    setSelectedRegions([]);
    setSelectedDuration('All');
    setMaxPrice(5000);
    setSearchQuery('');
    showToast('Filters cleared', 'info');
  };

  // Dynamic Filtering Logic using Firebase Firestore packagesList
  let filtered = (packagesList || []).filter(pkg => {
    // Status check - only show Active packages to customers
    if (pkg.status && pkg.status !== 'Active') return false;
    // Region Check
    if (selectedRegions.length > 0 && !selectedRegions.includes(pkg.region)) {
      return false;
    }
    // Duration Check
    if (selectedDuration === 'short' && pkg.durationDays > 5) return false;
    if (selectedDuration === 'medium' && (pkg.durationDays < 6 || pkg.durationDays > 8)) return false;
    if (selectedDuration === 'long' && pkg.durationDays < 9) return false;

    // Price Check
    if (pkg.price > maxPrice) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = pkg.title?.toLowerCase().includes(q);
      const locationMatch = pkg.location?.toLowerCase().includes(q) || pkg.destinationName?.toLowerCase().includes(q);
      const highlights = pkg.highlights || pkg.inclusions || [];
      const highlightMatch = highlights.some(h => typeof h === 'string' && h.toLowerCase().includes(q));
      if (!titleMatch && !locationMatch && !highlightMatch) {
        return false;
      }
    }
    return true;
  });

  // Sorting
  if (sortBy === 'Price: Low to High') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price: High to Low') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen bg-[#F5F9FC] font-sans text-[#1A1A1A]">

      {/* ── Redesigned Full-Width Hero Banner ───────────────────── */}
      <section className="relative min-h-[440px] py-16 px-4 sm:px-8 bg-[#0F172A] overflow-hidden flex items-center justify-center">
        {/* Full panoramic background image */}
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=90"
          alt="Explore Your Next Adventure"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
        />

        {/* Multi-stage ambient overlay for perfect contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0F172A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

        <div className="relative max-w-[1200px] w-full mx-auto text-center text-white space-y-6 z-10">
          {/* Glassmorphic Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-amber-300 shadow-lg">
            <span>✨ CURATED GLOBAL ADVENTURES</span>
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-header tracking-tight max-w-4xl mx-auto leading-none text-white drop-shadow-md">
            Explore Your Next <span className="text-[#FF7A00]">Adventure</span>
          </h1>

          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            Handcrafted tour packages, private villa stays, and VIP expeditions across 120+ breathtaking worldwide destinations.
          </p>

          {/* Quick Search & Action Bar embedded */}
          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-lg p-2.5 rounded-2xl shadow-2xl border border-white/40 flex flex-col sm:flex-row items-center gap-2 text-[#1A1A1A]">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2 w-full">
              <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 20 }}>search</span>
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs font-bold bg-transparent text-[#1A1A1A] placeholder:text-[#64748B] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => window.scrollTo({ top: 460, behavior: 'smooth' })}
                className="w-full sm:w-auto bg-[#FF7A00] text-white text-xs font-black px-6 py-3 rounded-xl hover:bg-[#e56e00] shadow-md transition-all whitespace-nowrap"
              >
                Find Packages →
              </button>
            </div>
          </div>

          {/* Trust Metrics Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
              4.9/5 Rating (12,400+ Reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
              100% Guaranteed Departures
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-400 text-sm">headset_mic</span>
              24/7 Concierge Support
            </span>
          </div>
        </div>
      </section>

      {/* ── Main Catalog Grid (Sidebar + Packages) ─────────────── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* ── Left Sidebar Filters ────────────────────────────── */}
          <aside className="space-y-6">
            {/* Filter Box */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
                <h3 className="font-extrabold text-[#1A1A1A] text-sm">Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] font-extrabold uppercase tracking-wider text-[#0A4D8C] hover:underline"
                >
                  CLEAR ALL
                </button>
              </div>

              {/* Destination Checklist */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider block">
                  📍 DESTINATION
                </span>
                {['Europe', 'Asia', 'Africa', 'Americas'].map(reg => (
                  <label key={reg} className="flex items-center gap-2.5 text-xs font-bold text-[#1A1A1A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRegions.includes(reg)}
                      onChange={() => toggleRegion(reg)}
                      className="size-4 rounded accent-[#0A4D8C]"
                    />
                    <span>{reg}</span>
                  </label>
                ))}
              </div>

              {/* Duration Dropdown */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider block">
                  ⏱️ DURATION
                </span>
                <select
                  value={selectedDuration}
                  onChange={e => setSelectedDuration(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A]"
                >
                  <option value="All">All Durations</option>
                  <option value="short">1 - 5 Days</option>
                  <option value="medium">6 - 8 Days</option>
                  <option value="long">9+ Days</option>
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-[#64748B]">
                  <span>🏷️ PRICE RANGE</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="250"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0A4D8C]"
                />
                <div className="flex justify-between text-xs font-bold text-[#64748B]">
                  <span>{formatPrice(500)}</span>
                  <span className="text-[#1A1A1A] font-black">{formatPrice(maxPrice)}+</span>
                </div>
              </div>

              <button
                onClick={() => showToast(`Applied filters — ${filtered.length} packages found!`, 'info')}
                className="w-full bg-[#F5F9FC] border border-[#E2E8F0] text-[#0A4D8C] font-extrabold text-xs py-3 rounded-xl hover:bg-[#0A4D8C] hover:text-white transition-all text-center"
              >
                Apply Filters
              </button>
            </div>

            {/* Need Help? Box */}
            <div className="bg-gradient-to-br from-[#3FA9F5] to-[#0A4D8C] text-white rounded-3xl p-6 space-y-4 shadow-md">
              <div className="size-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">headset_mic</span>
              </div>
              <div>
                <h4 className="font-black text-lg">Need Help?</h4>
                <p className="text-xs text-white/80 leading-relaxed mt-1">
                  Talk to our travel experts for a personalized itinerary.
                </p>
              </div>
              <button
                onClick={() => showToast('Connecting to travel expert team...', 'info')}
                className="w-full bg-white text-[#0A4D8C] font-black text-xs py-3 rounded-xl hover:bg-white/90 transition-all text-center"
              >
                Contact Us
              </button>
            </div>
          </aside>

          {/* ── Right Content Area ────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h2 className="text-2xl font-black text-[#1A1A1A] flex items-center gap-2">
                  Featured Tour Packages
                  <span className="text-xs font-bold text-[#64748B] bg-[#F5F9FC] border border-[#E2E8F0] px-3 py-1 rounded-full">
                    [{filtered.length} found]
                  </span>
                </h2>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64748B]">SORT BY:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="p-2 px-3 rounded-xl border border-[#E2E8F0] bg-white text-xs font-extrabold text-[#1A1A1A]"
                >
                  <option value="Popularity">Popularity</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Rating">Top Rating ⭐</option>
                </select>
              </div>
            </div>

            {/* Empty Result */}
            {filtered.length === 0 && (
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-12 text-center space-y-3 shadow-sm">
                <span className="material-symbols-outlined text-4xl text-[#64748B]">search_off</span>
                <h3 className="font-black text-lg text-[#1A1A1A]">No packages found</h3>
                <p className="text-xs text-[#64748B]">Try resetting your filter parameters or selecting additional regions.</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#0A4D8C] text-white text-xs font-bold px-5 py-2.5 rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Package Cards 3x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(pkg => (
                <div
                  key={pkg.id}
                  className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Rating pill */}
                      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        ⭐ {pkg.rating}
                      </span>

                      {/* Duration pill */}
                      <span className="absolute bottom-3 left-3 bg-[#0A4D8C] text-white text-[10px] font-black uppercase px-3 py-1 rounded-md">
                        {pkg.duration}
                      </span>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3
                          onClick={() => onDetail?.(pkg)}
                          className="font-black text-lg text-[#1A1A1A] hover:text-[#FF7A00] transition-colors cursor-pointer"
                        >
                          {pkg.title}
                        </h3>
                        <p className="text-[11px] text-[#64748B] font-medium">{pkg.location}</p>
                      </div>

                      {/* Checklist */}
                      <ul className="space-y-1.5 text-xs text-[#64748B]">
                        {(pkg.highlights || pkg.inclusions || ['Luxury Hotel Stay', 'Daily Breakfast', 'Guided Excursions']).slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[#0A4D8C] text-sm flex-shrink-0">check_circle</span>
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="p-5 pt-0 border-t border-[#E2E8F0]/60 mt-auto flex items-center justify-between pt-4">
                    <div>
                      <span className="text-[10px] text-[#64748B] uppercase font-bold block">Starting from</span>
                      <span className="text-xl font-black text-[#1A1A1A]">{formatPrice(pkg.price)}</span>
                    </div>
                    <button
                      onClick={() => onDetail?.(pkg)}
                      className="bg-[#FF7A00] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl hover:bg-[#e56e00] shadow-md shadow-[#FF7A00]/20 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="size-9 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-center text-xs text-[#64748B] hover:text-[#1A1A1A] disabled:opacity-40"
              >
                ‹
              </button>
              {[1, 2, 3].map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`size-9 rounded-xl font-extrabold text-xs transition-all ${
                    currentPage === num
                      ? 'bg-[#0A4D8C] text-white shadow-sm'
                      : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#1A1A1A]'
                  }`}
                >
                  {num}
                </button>
              ))}
              <span className="text-xs text-[#64748B]">...</span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                className="size-9 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-center text-xs text-[#64748B] hover:text-[#1A1A1A]"
              >
                ›
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
