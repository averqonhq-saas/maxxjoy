import React from 'react';
import { useApp } from '../context/AppContext';

const LegalContactCard = () => (
  <div className="mt-12 pt-8 border-t border-slate-200">
    <h3 className="text-xl font-bold text-slate-900 mb-2 font-header flex items-center gap-2">
      <span className="material-symbols-outlined text-[#0A4D8C]">contact_support</span>
      Contact Details
    </h3>
    <p className="text-sm text-slate-600 mb-6">
      For any inquiries, requests, or questions regarding our Privacy Policy, Terms & Conditions, or Cookie Policy, please reach out to us:
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
      {/* Phone numbers */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0A4D8C] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-xl">call</span>
        </div>
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm mb-1.5">Phone & WhatsApp</h4>
          <div className="text-xs font-bold text-slate-700 space-y-1.5">
            <p className="flex items-center gap-2">
              <a href="tel:+919804777879" className="hover:text-[#0A4D8C] transition-colors text-slate-800">+91 98047 77879</a>
              <a href="https://wa.me/919804777879" target="_blank" rel="noreferrer" className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold hover:bg-emerald-200">WhatsApp</a>
            </p>
            <p>
              <a href="tel:+917418407088" className="hover:text-[#0A4D8C] transition-colors text-slate-800">+91 74184 07088</a>
            </p>
          </div>
        </div>
      </div>

      {/* Email addresses */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0A4D8C] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-xl">mail</span>
        </div>
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm mb-1.5">Email Support</h4>
          <div className="text-xs font-bold text-slate-700 space-y-1">
            <p>
              <a href="mailto:Info@maxxjoytours.com" className="text-[#0A4D8C] hover:underline font-extrabold">Info@maxxjoytours.com</a>
            </p>
            <p>
              <a href="mailto:Yogaprathap@maxxjoytours.com" className="hover:text-[#0A4D8C] transition-colors text-slate-800">Yogaprathap@maxxjoytours.com</a>
            </p>
            <p>
              <a href="mailto:George@maxxjoytours.com" className="hover:text-[#0A4D8C] transition-colors text-slate-800">George@maxxjoytours.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Reusable Legal Page Layout Wrapper
const LegalPageLayout = ({ title, lastUpdated, children }) => (
  <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
    <div className="bg-[#0A4D8C] text-white pt-16 pb-24 px-4 sm:px-6">
      <div className="max-w-[800px] mx-auto text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black font-header tracking-tight">{title}</h1>
        <p className="text-sm font-medium text-sky-200 uppercase tracking-widest">
          Last Updated: {lastUpdated}
        </p>
      </div>
    </div>
    
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 -mt-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 min-h-[500px]">
        <div className="prose prose-slate max-w-none font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
          {children}
        </div>
        <LegalContactCard />
      </div>
    </div>
  </div>
);


export const PrivacyPolicyPage = () => {
  const { legalSettings } = useApp();
  
  return (
    <LegalPageLayout 
      title="Privacy Policy" 
      lastUpdated={legalSettings?.lastUpdated || 'Loading...'}
    >
      {legalSettings?.privacyPolicy || 'Loading Privacy Policy...'}
    </LegalPageLayout>
  );
};


export const TermsConditionsPage = () => {
  const { legalSettings } = useApp();
  
  return (
    <LegalPageLayout 
      title="Terms & Conditions" 
      lastUpdated={legalSettings?.lastUpdated || 'Loading...'}
    >
      {legalSettings?.termsConditions || 'Loading Terms & Conditions...'}
    </LegalPageLayout>
  );
};


export const CookiePolicyPage = () => {
  const { legalSettings } = useApp();
  
  return (
    <LegalPageLayout 
      title="Cookie Policy" 
      lastUpdated={legalSettings?.lastUpdated || 'Loading...'}
    >
      {legalSettings?.cookiePolicy || 'Loading Cookie Policy...'}
    </LegalPageLayout>
  );
};

