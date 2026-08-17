import React from 'react';

export const Footer = ({ onHome, onExploreTours, onAdmin, onContact, onPrivacy, onTerms, onCookiePolicy, onDestinations, onDeals, onWhyUs }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#F5F9FC] text-[#64748B] py-16 px-4 sm:px-6 relative border-t border-[#E2E8F0] font-sans">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Col 1 */}
        <div>
          <button onClick={onHome} className="flex items-center gap-2.5 mb-6 group text-left cursor-pointer">
            <img
              src="/maxxjoy-logo1.png"
              alt="Maxx Joy Tours and Travel"
              className="h-12 w-12 object-contain transition-transform group-hover:scale-105 flex-shrink-0"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-header text-lg font-black tracking-tight text-[#0A4D8C]">
                Maxx <span className="text-amber-500">Joy</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Tours and Travel Pvt Ltd
              </span>
            </div>
          </button>

          <p className="text-xs leading-relaxed mb-6 text-[#64748B]">
            Maxx Joy Tours and Travel Pvt Ltd — your trusted partner for luxury travel and unforgettable global experiences. We curate moments that last a lifetime across 120+ worldwide destinations.
          </p>

          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center hover:bg-[#0A4D8C] hover:text-white transition-colors text-[#1A1A1A] cursor-pointer">
              <span className="material-symbols-outlined text-base">share</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center hover:bg-[#0A4D8C] hover:text-white transition-colors text-[#1A1A1A] cursor-pointer">
              <span className="material-symbols-outlined text-base">public</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center hover:bg-[#0A4D8C] hover:text-white transition-colors text-[#1A1A1A] cursor-pointer">
              <span className="material-symbols-outlined text-base">mail</span>
            </div>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h5 className="text-[#1A1A1A] font-black mb-6 uppercase tracking-widest text-xs font-header">Company</h5>
          <ul className="space-y-3 text-xs font-medium">
            <li><button onClick={onWhyUs || onHome} className="hover:text-[#0A4D8C] transition-colors cursor-pointer">About Us & Why Us</button></li>
            <li><button onClick={onHome} className="hover:text-[#0A4D8C] transition-colors cursor-pointer">Careers & Culture</button></li>
            <li><button onClick={onExploreTours} className="hover:text-[#0A4D8C] transition-colors cursor-pointer">Travel Catalog</button></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h5 className="text-[#1A1A1A] font-black mb-6 uppercase tracking-widest text-xs font-header">Travel Options</h5>
          <ul className="space-y-3 text-xs font-medium">
            <li><button onClick={onDestinations || onHome} className="hover:text-[#0A4D8C] transition-colors cursor-pointer">Popular Destinations</button></li>
            <li><button onClick={onExploreTours} className="hover:text-[#0A4D8C] transition-colors cursor-pointer">Handcrafted Tour Packages</button></li>
            <li><button onClick={onExploreTours} className="hover:text-[#0A4D8C] transition-colors cursor-pointer">Luxury Vacations</button></li>
            <li><button onClick={onDeals || onHome} className="hover:text-[#0A4D8C] transition-colors cursor-pointer">Special Deals</button></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h5 className="text-[#1A1A1A] font-black mb-6 uppercase tracking-widest text-xs font-header">Contact & Legal</h5>
          <div className="space-y-3 text-xs font-medium">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base text-[#0A4D8C] mt-0.5">location_on</span>
              <span className="leading-snug">NO 6 new annai indra nagar maruthamalai, Coimbatore 641046</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base text-[#0A4D8C] mt-0.5">call</span>
              <div>
                <p><a href="tel:+919804777879" className="hover:text-[#0A4D8C] transition-colors">+91 98047 77879</a></p>
                <p><a href="tel:+917418407088" className="hover:text-[#0A4D8C] transition-colors">+91 74184 07088</a></p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base text-[#0A4D8C] mt-0.5">mail</span>
              <div className="space-y-0.5">
                <p><a href="mailto:Info@maxxjoytours.com" className="hover:text-[#0A4D8C] font-semibold text-[#0A4D8C] transition-colors">Info@maxxjoytours.com</a></p>
                <p><a href="mailto:Yogaprathap@maxxjoytours.com" className="hover:text-[#0A4D8C] transition-colors">Yogaprathap@maxxjoytours.com</a></p>
                <p><a href="mailto:George@maxxjoytours.com" className="hover:text-[#0A4D8C] transition-colors">George@maxxjoytours.com</a></p>
              </div>
            </div>
            <ul className="pt-2 border-t border-[#E2E8F0] space-y-2 text-xs">
              <li><button onClick={onPrivacy} className="hover:text-[#0A4D8C] transition-colors cursor-pointer">Privacy Policy</button></li>
              <li><button onClick={onTerms} className="hover:text-[#0A4D8C] transition-colors cursor-pointer">Terms & Conditions</button></li>
              <li><button onClick={onCookiePolicy} className="hover:text-[#0A4D8C] transition-colors cursor-pointer">Cookie Policy</button></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2026 Maxx Joy Tours and Travel Pvt Ltd. All rights reserved.</p>

        <div className="flex items-center gap-6">
          <button onClick={onPrivacy} className="hover:text-[#0A4D8C] transition-colors">Privacy Policy</button>
          <button onClick={onTerms} className="hover:text-[#0A4D8C] transition-colors">Terms of Service</button>

          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#0A4D8C] hover:text-white text-[#1A1A1A] flex items-center justify-center transition-colors ml-4 shadow-xs"
            title="Back to top"
          >
            <span className="material-symbols-outlined text-lg">arrow_upward</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
