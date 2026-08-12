import React from 'react';
import { useApp } from '../context/AppContext';

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
