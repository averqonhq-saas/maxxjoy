import React from 'react';
import { useApp } from '../context/AppContext';
import { categoriesData } from '../data/travelData';

export const TravelCategories = () => {
  const { activeCategory, setActiveCategory, showToast } = useApp();

  const handleSelectCategory = (catId, catName) => {
    if (activeCategory === catId) {
      setActiveCategory(null);
      showToast('Cleared category filter', 'info');
    } else {
      setActiveCategory(catId);
      showToast(`Showing ${catName} packages & destinations`, 'success');
      
      const target = document.getElementById('destinations');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <span className="text-xs font-bold text-[#0A4D8C] uppercase tracking-widest block mb-2">
            Curated Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-header">
            Travel Your Way
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Pick a category that suits your next adventure style
          </p>
        </div>

        {activeCategory && (
          <button
            onClick={() => setActiveCategory(null)}
            className="text-xs font-bold text-[#0A4D8C] flex items-center gap-1 hover:underline"
          >
            <span className="material-symbols-outlined text-sm">filter_alt_off</span>
            Reset Category Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {categoriesData.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id, cat.name)}
              className={`group relative bg-white p-7 rounded-3xl border transition-all duration-300 text-center cursor-pointer hover:shadow-xl hover:-translate-y-1.5 ${
                isActive
                  ? 'border-[#0A4D8C] ring-2 ring-[#0A4D8C]/20 bg-[#0A4D8C]/5'
                  : 'border-slate-200/80 hover:border-[#0A4D8C]/40 shadow-sm'
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#0A4D8C] text-white flex items-center justify-center text-xs">
                  ✓
                </div>
              )}

              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#0A4D8C]/10 text-[#0A4D8C] flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base mb-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {cat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
