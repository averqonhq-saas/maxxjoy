import React from 'react';
import { useApp } from '../context/AppContext';
import { whyUsData } from '../data/travelData';

export const WhyChooseUs = () => {
  const { showToast } = useApp();

  const handleFeatureClick = (item) => {
    showToast(`🛡️ ${item.title}: ${item.desc}`, 'info');
  };

  return (
    <section id="why-us" className="py-24 bg-[#F5F9FC] text-[#1A1A1A] px-4 sm:px-6 relative border-y border-[#E2E8F0]">
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-[#0A4D8C] uppercase tracking-widest block mb-2">
            The Perfect Travel Promise
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mb-3 font-header text-[#1A1A1A]">
            Why Travelers Choose Us
          </h2>
          <p className="text-[#64748B] text-sm">
            We ensure every journey is smooth, secure, and packed with unforgettable moments.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {whyUsData.map((item) => (
            <div
              key={item.id}
              onClick={() => handleFeatureClick(item)}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#0A4D8C] hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1.5"
            >
              <div className="w-20 h-20 bg-[#0A4D8C]/10 rounded-2xl flex items-center justify-center mb-6 shadow-xs group-hover:scale-110 group-hover:bg-[#0A4D8C] transition-all">
                <span className="material-symbols-outlined text-4xl text-[#0A4D8C] group-hover:text-white transition-colors">{item.icon}</span>
              </div>
              
              <h4 className="text-xl font-bold mb-3 font-header text-[#1A1A1A] group-hover:text-[#0A4D8C] transition-colors">
                {item.title}
              </h4>
              
              <p className="text-[#64748B] text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
