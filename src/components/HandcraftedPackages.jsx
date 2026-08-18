import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const HandcraftedPackages = ({ onBookNow }) => {
  const {
    formatPrice,
    wishlist,
    toggleWishlist,
    activeCategory,
    setActiveCategory,
    packagesList,
    setSelectedDestinationModal
  } = useApp();

  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'

  const categories = [
    { id: 'all', label: 'All Packages' },
    { id: 'leisure', label: 'Luxury & Leisure' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'honeymoon', label: 'Honeymoon' },
    { id: 'heritage', label: 'Heritage & Culture' },
  ];

  // Dynamic filtering
  let filtered = (packagesList || []).filter(pkg => (pkg.status ? pkg.status === 'Active' : true));

  // Global activeCategory from search bar OR local tab selection
  const currentCategory = activeCategory || (selectedCategoryTab !== 'all' ? selectedCategoryTab : null);
  if (currentCategory) {
    filtered = filtered.filter(pkg => pkg.category === currentCategory);
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(pkg =>
      pkg.title.toLowerCase().includes(q) ||
      pkg.destinationName?.toLowerCase().includes(q) ||
      pkg.inclusions?.some(inc => inc.toLowerCase().includes(q))
    );
  }

  // Sorting logic
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  return (
    <section id="packages" className="py-20 px-4 sm:px-6 max-w-[1440px] mx-auto">
      {/* Section Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-xs font-extrabold text-[#1A1A1A] uppercase tracking-widest block mb-2">
            All-Inclusive Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] font-header">
            Handcrafted Tour Packages
          </h2>
          <p className="text-[#64748B] text-sm mt-1">
            Curated itineraries designed for maximum comfort, thrill, and luxury
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" style={{ fontSize: 18 }}>
              search
            </span>
            <input
              type="text"
              placeholder="Search packages or inclusions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A] focus:bg-white focus:outline-none focus:border-[#1A1A1A] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-[#1A1A1A]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] cursor-pointer"
            >
              <option value="featured">Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated ⭐</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map(cat => {
          const isActive = (activeCategory === cat.id) || (!activeCategory && selectedCategoryTab === cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => {
                if (activeCategory) setActiveCategory(null);
                setSelectedCategoryTab(cat.id);
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Empty Search / Filter State */}
      {filtered.length === 0 && (
        <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-3xl p-12 text-center max-w-md mx-auto my-8">
          <span className="material-symbols-outlined text-4xl text-[#64748B] mb-2">search_off</span>
          <h3 className="text-lg font-black text-[#1A1A1A] mb-1">No matching tour packages found</h3>
          <p className="text-xs text-[#64748B] mb-5">Try clearing your search query or switching package category filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategoryTab('all'); setActiveCategory(null); }}
            className="bg-[#1A1A1A] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#333] transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filtered.map((pkg) => {
          const isWishlisted = wishlist.includes(pkg.id);

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-[#E2E8F0] p-5 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative group"
            >
              {/* Package Image */}
              <div
                onClick={() => setSelectedDestinationModal(pkg)}
                className="relative h-64 overflow-hidden rounded-2xl flex-shrink-0 cursor-pointer"
              >
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Discount Badge */}
                {pkg.discountBadge && (
                  <span className="absolute top-3 left-3 bg-[#FF7A00] text-white px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md">
                    {pkg.discountBadge}
                  </span>
                )}

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(pkg.id, pkg.title);
                  }}
                  className="absolute top-3 right-3 size-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-md"
                >
                  <span className={`material-symbols-outlined text-base ${isWishlisted ? 'fill-current' : ''}`}>
                    favorite
                  </span>
                </button>
              </div>

              {/* Package Details */}
              <div className="flex-1 flex flex-col justify-between pt-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-extrabold text-[#1A1A1A] bg-[#F5F9FC] border border-[#E2E8F0] px-3 py-1 rounded-full uppercase tracking-tight">
                      {pkg.duration}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <span className="material-symbols-outlined text-sm">star</span>
                      <span>{pkg.rating} ({pkg.reviewsCount})</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setSelectedDestinationModal(pkg)}
                    className="text-xl font-black text-[#1A1A1A] mb-3 font-header hover:text-[#FF7A00] transition-colors cursor-pointer"
                  >
                    {pkg.title}
                  </h3>

                  {/* Dynamic Highlights Bullet List */}
                  <ul className="space-y-2 mb-6 text-xs text-[#64748B]">
                    {(pkg.inclusions || []).slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#1A1A1A] text-base flex-shrink-0">
                          check_circle
                        </span>
                        <span className="font-medium text-[#1A1A1A] line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Action */}
                <div className="flex justify-between items-center pt-4 border-t border-[#E2E8F0]">
                  <div>
                    <p className="text-[10px] text-[#64748B] font-extrabold uppercase">Starting From</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-2xl font-black text-[#1A1A1A] font-header">
                        {formatPrice(pkg.price)}
                      </p>
                      {pkg.originalPrice && (
                        <p className="text-xs text-[#64748B] line-through">
                          {formatPrice(pkg.originalPrice)}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onBookNow?.(pkg)}
                    className="bg-[#FF7A00] text-white px-7 py-3 rounded-2xl font-extrabold text-sm hover:bg-[#e56e00] shadow-lg shadow-[#FF7A00]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    Enquire / Book
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
