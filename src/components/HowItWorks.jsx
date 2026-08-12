import React, { useState } from 'react';

export const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: 1,
      title: 'Choose Destination',
      desc: 'Select from hundreds of curated global locations, luxury resorts, and custom packages.',
      icon: 'map'
    },
    {
      num: 2,
      title: 'Customize Trip',
      desc: 'Add room upgrades, travel insurance, airport transfers, and private guided excursions.',
      icon: 'tune'
    },
    {
      num: 3,
      title: 'Book & Go',
      desc: 'Complete instant encrypted booking, receive your digital pass, and prepare for takeoff!',
      icon: 'flight_takeoff'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-white transition-colors">
      <div className="max-w-[1440px] mx-auto text-center mb-16">
        <span className="text-xs font-extrabold text-[#0A4D8C] uppercase tracking-widest block mb-2">
          Seamless Travel Planning
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] font-header mb-3">
          How It Works
        </h2>
        <p className="text-[#64748B] text-sm">
          Plan your dream holiday in three simple, hassle-free steps
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 relative">
        {steps.map((step) => {
          const isActive = activeStep === step.num;

          return (
            <div
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`relative z-10 text-center flex flex-col items-center p-8 rounded-3xl transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#F5F9FC] border-[#0A4D8C] shadow-xl scale-105'
                  : 'bg-white border-[#E2E8F0] hover:bg-[#F5F9FC]/60'
              }`}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 text-2xl font-black transition-all ${
                  isActive
                    ? 'bg-[#0A4D8C] text-white shadow-lg shadow-[#0A4D8C]/30 scale-110'
                    : 'bg-[#F5F9FC] border border-[#E2E8F0] text-[#1A1A1A]'
                }`}
              >
                {step.num}
              </div>

              <h5 className="font-extrabold text-[#1A1A1A] text-lg mb-2 font-header">
                {step.title}
              </h5>

              <p className="text-xs text-[#64748B] leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
