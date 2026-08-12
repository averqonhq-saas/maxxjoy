import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const HeroSearch = ({ onSearch }) => {
  const { searchParams, setSearchParams, showToast, formatPrice, destinationsList } = useApp();
  const [destination, setDestination] = useState(searchParams.destination || '');
  const [departure, setDeparture] = useState(searchParams.departure || '');
  const [date, setDate] = useState(searchParams.date || '');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState(5000);
  const [showTravelers, setShowTravelers] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const destinations = (destinationsList || []).map((item) => item.title || item.country || item.name).filter(Boolean);

  const submit = (event) => {
    event.preventDefault();
    setSearchParams({ destination, departure, date, travelers: `${adults} Adults${children ? `, ${children} Kids` : ''}`, budget });
    showToast(`✈️ Showing tour packages for ${destination || 'all destinations'}...`, 'success');
    onSearch?.();
  };

  const Field = ({ icon, label, children, className = '' }) => <div className={`relative min-w-0 ${className}`}><label className="mb-1.5 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500"><span className="material-symbols-outlined text-sm text-[#0A4D8C]">{icon}</span>{label}</label>{children}</div>;

  return (
    <section className="relative isolate overflow-hidden bg-[#062c52] py-12 sm:py-16 md:py-20 lg:py-24">
      <img className="absolute inset-0 -z-20 h-full w-full object-cover scale-105" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=85" alt="Beach background" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/85" />
      <div className="mx-auto flex max-w-[1440px] flex-col justify-center px-4 sm:px-6">
        <div className="relative z-10 max-w-4xl text-center mx-auto">
          <div className="mb-4 flex flex-col items-center gap-3">
            <img src="/maxxjoy-logo1.png" alt="Maxx Joy" className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-2xl" />
            <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur-md sm:text-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A00] animate-ping" />
              Curated journeys. Seamless travel.
            </p>
          </div>
          <h1 className="font-header text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white drop-shadow-2xl">
            Explore The World With <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-100">
              Maxx Joy Travel
            </span>
          </h1>
          <p className="mx-auto mt-2 text-xs sm:text-sm font-semibold text-amber-300/90 tracking-wide">Tours and Travel Pvt Ltd</p>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-base md:text-lg font-medium leading-relaxed text-white/95 drop-shadow-md">
            Discover handpicked luxury stays, international tour packages, and travel plans made around you across 120+ destinations.
          </p>
        </div>

        <form onSubmit={submit} className="relative z-20 mx-auto mt-8 sm:mt-10 w-full max-w-[1240px] rounded-3xl border border-white/80 bg-white/95 backdrop-blur-md p-4 sm:p-6 shadow-2xl shadow-black/40">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.1fr_1fr_1.2fr_auto] lg:items-end lg:gap-3">
            <Field icon="location_on" label="Where to?">
              <input value={destination} onChange={(e) => { setDestination(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} placeholder="Search destinations" className="h-11 w-full rounded-xl bg-slate-50 px-3 text-xs sm:text-sm font-bold text-slate-900 outline-none ring-[#0A4D8C] placeholder:font-medium placeholder:text-slate-400 focus:ring-2" />
              {showSuggestions && <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"><p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">Popular destinations</p><div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">{destinations.length ? destinations.map((name, index) => <button type="button" key={`${name}-${index}`} onClick={() => { setDestination(name); setShowSuggestions(false); }} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-[#0A4D8C] hover:text-white cursor-pointer">{name}</button>) : <span className="text-xs text-slate-500">No locations listed yet.</span>}</div><button type="button" onClick={() => setShowSuggestions(false)} className="mt-2 text-xs font-bold text-[#0A4D8C] cursor-pointer">Close</button></div>}
            </Field>
            <Field icon="flight_takeoff" label="Departing from"><input value={departure} onChange={(e) => setDeparture(e.target.value)} placeholder="Your city" className="h-11 w-full rounded-xl bg-slate-50 px-3 text-xs sm:text-sm font-bold text-slate-900 outline-none ring-[#0A4D8C] placeholder:font-medium placeholder:text-slate-400 focus:ring-2" /></Field>
            <Field icon="calendar_month" label="Travel date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 w-full rounded-xl bg-slate-50 px-3 text-xs sm:text-sm font-bold text-slate-900 outline-none ring-[#0A4D8C] focus:ring-2" /></Field>
            <Field icon="group" label="Travellers & budget">
              <button type="button" onClick={() => setShowTravelers(!showTravelers)} className="flex h-11 w-full items-center justify-between rounded-xl bg-slate-50 px-3 text-left text-xs sm:text-sm font-bold text-slate-900 ring-[#0A4D8C] hover:bg-slate-100 focus:ring-2 cursor-pointer"><span>{adults} adults, {children} children</span><span className="material-symbols-outlined text-base text-slate-500">tune</span></button>
              {showTravelers && <div className="absolute bottom-full left-0 z-30 mb-2 w-full min-w-[260px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"><div className="space-y-3"><Counter label="Adults" value={adults} onDecrease={() => setAdults(Math.max(1, adults - 1))} onIncrease={() => setAdults(adults + 1)} /><Counter label="Children" value={children} onDecrease={() => setChildren(Math.max(0, children - 1))} onIncrease={() => setChildren(children + 1)} /><div className="border-t border-slate-100 pt-3"><p className="mb-2 flex justify-between text-xs font-bold text-slate-600"><span>Max budget</span><span className="text-[#0A4D8C]">{formatPrice(budget)}</span></p><input type="range" min="500" max="10000" step="250" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-[#0A4D8C]" /></div><button type="button" onClick={() => setShowTravelers(false)} className="w-full rounded-xl bg-[#0A4D8C] py-2.5 text-xs font-black text-white cursor-pointer">Done</button></div></div>}
            </Field>
            <button type="submit" className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#FF7A00] px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap text-white shadow-lg shadow-[#FF7A00]/25 transition hover:bg-[#ff881a] cursor-pointer sm:col-span-2 lg:col-span-1 lg:px-6"><span className="material-symbols-outlined text-lg">search</span>Search tours</button>
          </div>
        </form>
      </div>
    </section>
  );
};

const Counter = ({ label, value, onDecrease, onIncrease }) => <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-700">{label}</span><div className="flex items-center gap-3"><button type="button" onClick={onDecrease} className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 font-black text-slate-700">−</button><span className="w-3 text-center text-sm font-black">{value}</span><button type="button" onClick={onIncrease} className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 font-black text-slate-700">+</button></div></div>;
