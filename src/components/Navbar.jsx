import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { currencies } from '../data/travelData';

export const Navbar = ({ onBookNow, onLogin, onWishlist, onBookings, onAdmin, onExploreTours, onHome, onContact, onDestinations, onDeals, onWhyUs }) => {
  const { currency, changeCurrency, wishlist, myBookings, user, logoutUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const closeMenu = (callback) => {
    callback?.();
    setMobileMenuOpen(false);
  };

  const links = [
    ['Home', onHome],
    ['Destinations', onDestinations],
    ['Tour Packages', onExploreTours],
    ['Deals', onDeals],
    ['Why Us', onWhyUs],
    ['Contact', onContact],
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,.06)] backdrop-blur-xl before:block before:h-1 before:bg-gradient-to-r before:from-[#0A4D8C] before:via-[#3FA9F5] before:to-[#FF7A00]">
      <nav className="mx-auto flex h-[70px] max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:h-[76px]" aria-label="Main navigation">
        <button onClick={onHome} className="group flex items-center gap-3 text-left" aria-label="Maxx Joy Tours and Travel home">
          <img
            src="/maxxjoy-logo1.png"
            alt="Maxx Joy Tours and Travel"
            className="h-11 w-11 rounded-xl border border-slate-100 bg-white object-contain p-0.5 shadow-sm transition-transform group-hover:scale-105 sm:h-12 sm:w-12"
          />
          <div className="flex flex-col border-l border-slate-200 pl-3 leading-tight">
            <span className="font-header text-base font-black tracking-tight text-[#0A4D8C] sm:text-lg">
              Maxx <span className="text-amber-500">Joy</span>
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[.13em] text-slate-500 sm:text-[9px]">
              Tours and Travel Pvt Ltd
            </span>
          </div>
        </button>

        <div className="hidden items-center rounded-2xl border border-slate-100 bg-slate-50/80 p-1 xl:flex">
          {links.map(([label, callback]) => (
            <button key={label} onClick={callback} className="rounded-xl px-3 py-2 text-[13px] font-bold text-slate-600 transition hover:bg-white hover:text-[#0A4D8C] hover:shadow-sm">
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            <button onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-700 hover:border-[#0A4D8C]/30 hover:bg-slate-50" aria-expanded={currencyDropdownOpen}>
              <span>{currencies[currency]?.symbol}</span><span>{currency}</span><span className="material-symbols-outlined text-base text-slate-400">expand_more</span>
            </button>
            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-100 bg-white py-2 shadow-2xl">
                <p className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">Currency</p>
                {Object.entries(currencies).map(([code, details]) => (
                  <button key={code} onClick={() => { changeCurrency(code); setCurrencyDropdownOpen(false); }} className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs font-bold hover:bg-slate-50 ${currency === code ? 'bg-[#0A4D8C]/5 text-[#0A4D8C]' : 'text-slate-700'}`}>
                    <span>{details.name}</span><span className="text-slate-400">{details.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={onWishlist} className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:border-rose-200 hover:bg-rose-50 sm:flex" aria-label="View saved trips">
            <span className="material-symbols-outlined text-lg text-rose-500">favorite</span>
            {wishlist.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">{wishlist.length}</span>}
          </button>

          {user ? (
            <div className="relative hidden sm:block">
              <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 transition hover:border-[#0A4D8C]/30 hover:bg-slate-50" aria-expanded={userDropdownOpen}>
                <img src={user.avatar} alt="" className="h-7 w-7 rounded-lg object-cover" />
                <span className="hidden pr-1 text-xs font-bold text-slate-700 md:inline">{user.name.split(' ')[0]}</span>
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 bg-white py-2 shadow-2xl">
                  <div className="border-b border-slate-100 px-3 py-2"><p className="text-xs font-bold text-slate-900">{user.name}</p><p className="truncate text-[10px] text-slate-400">{user.email}</p></div>
                  <button onClick={() => { onBookings?.(); setUserDropdownOpen(false); }} className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50">My Bookings ({myBookings.length})</button>
                  <button onClick={() => { onWishlist?.(); setUserDropdownOpen(false); }} className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50">Saved trips ({wishlist.length})</button>
                  <button onClick={() => { logoutUser(); setUserDropdownOpen(false); }} className="w-full border-t border-slate-100 px-3 py-2 text-left text-xs font-bold text-rose-500 hover:bg-rose-50">Logout</button>
                </div>
              )}
            </div>
          ) : <button onClick={onLogin} className="hidden rounded-xl px-2 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:text-[#0A4D8C] sm:block">Log in</button>}

          <button onClick={onBookNow} className="hidden items-center gap-1.5 rounded-xl bg-[#FF7A00] px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-[#FF7A00]/25 transition hover:-translate-y-0.5 hover:bg-[#e56e00] sm:flex">
            <span className="material-symbols-outlined text-base">flight_takeoff</span>Book now
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 xl:hidden" aria-label="Toggle navigation menu" aria-expanded={mobileMenuOpen}>
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-5 shadow-xl xl:hidden">
          <div className="mx-auto grid max-w-[1440px] gap-1 sm:grid-cols-2">
            {links.map(([label, callback]) => <button key={label} onClick={() => closeMenu(callback)} className="rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0A4D8C]">{label}</button>)}
          </div>
          <div className="mx-auto mt-4 flex max-w-[1440px] flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
            <button onClick={() => closeMenu(onBookings)} className="rounded-xl bg-slate-50 px-3 py-3 text-left text-sm font-bold text-slate-700 sm:flex-1">My bookings ({myBookings.length})</button>
            <button onClick={() => closeMenu(onWishlist)} className="rounded-xl bg-slate-50 px-3 py-3 text-left text-sm font-bold text-slate-700 sm:flex-1">Saved trips ({wishlist.length})</button>
            {!user && <button onClick={() => closeMenu(onLogin)} className="rounded-xl bg-[#0A4D8C] px-3 py-3 text-sm font-bold text-white sm:flex-1">Log in / Register</button>}
            <button onClick={() => closeMenu(onBookNow)} className="rounded-xl bg-[#FF7A00] px-3 py-3 text-sm font-extrabold text-white sm:hidden">Book your trip</button>
          </div>
        </div>
      )}
    </header>
  );
};
