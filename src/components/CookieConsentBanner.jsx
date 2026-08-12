import React, { useState, useEffect } from 'react';

export const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Small delay for smooth entry
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type) => {
    localStorage.setItem('cookieConsent', type);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] p-6 sm:p-8 pointer-events-auto transform transition-transform duration-500 translate-y-0 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h3 className="text-xl font-black text-[#1A1A1A] flex items-center justify-center md:justify-start gap-2">
            <span>🍪</span> We value your privacy
          </h3>
          <p className="text-sm font-medium text-[#64748B] leading-relaxed">
            We use cookies to improve your experience, analyze website traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. Read our Cookie Policy for more details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => handleConsent('essential')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-[#E2E8F0] text-[#64748B] font-bold text-xs hover:bg-[#F5F9FC] transition-colors"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={() => handleConsent('all')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0A4D8C] text-white font-black text-xs shadow-md shadow-[#0A4D8C]/20 hover:bg-[#083c6e] transition-colors"
          >
            Accept All
          </button>
        </div>

      </div>
    </div>
  );
};
