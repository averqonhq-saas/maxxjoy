import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const BookingModal = () => {
  const {
    selectedPackageForBooking,
    setSelectedPackageForBooking,
    formatPrice,
    addBooking,
    appliedPromoCode,
    applyPromoCode,
    showToast
  } = useApp();

  const [step, setStep] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState('deluxe');
  const [travelDate, setTravelDate] = useState('2026-09-15');
  
  // Addons
  const [addons, setAddons] = useState({
    insurance: true,
    transfer: true,
    simCard: false,
    guide: false
  });

  // Contact form
  const [guestName, setGuestName] = useState('Alex Morgan');
  const [guestEmail, setGuestEmail] = useState('alex.morgan@example.com');
  const [guestPhone, setGuestPhone] = useState('+1 (555) 234-5678');
  const [promoInput, setPromoInput] = useState('');

  if (!selectedPackageForBooking) return null;

  const pkg = selectedPackageForBooking;

  // Pricing calculations
  const basePricePerPerson = pkg.price;
  const roomUpgradeCost = roomType === 'villa' ? 400 : roomType === 'deluxe' ? 150 : 0;
  
  let addonCost = 0;
  if (addons.insurance) addonCost += 50 * adults;
  if (addons.transfer) addonCost += 40;
  if (addons.simCard) addonCost += 25;
  if (addons.guide) addonCost += 120;

  const subtotal = (basePricePerPerson + roomUpgradeCost) * adults + (basePricePerPerson * 0.7 * children) + addonCost;

  let discount = 0;
  if (appliedPromoCode?.discountPercent) {
    discount = (subtotal * appliedPromoCode.discountPercent) / 100;
  } else if (appliedPromoCode?.discountAmount) {
    discount = appliedPromoCode.discountAmount;
  }

  const finalTotal = Math.max(0, subtotal - discount);

  const toggleAddon = (key) => {
    setAddons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApplyPromo = () => {
    if (promoInput) {
      applyPromoCode(promoInput);
    }
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!guestName || !guestEmail) {
      showToast('Please fill in guest contact details', 'error');
      return;
    }

    addBooking({
      packageTitle: pkg.title,
      destination: pkg.destinationName || pkg.title,
      travelDate,
      travelers: adults + children,
      totalPaid: formatPrice(finalTotal),
      image: pkg.image
    });

    setSelectedPackageForBooking(null);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-white border-b border-[#E2E8F0]">
          <button
            onClick={() => setSelectedPackageForBooking(null)}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F5F9FC] border border-[#E2E8F0] hover:bg-[#E2E8F0] flex items-center justify-center text-[#64748B] transition-colors text-sm"
          >
            ✕
          </button>

          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#F5F9FC] border border-[#E2E8F0] text-[#64748B] px-3 py-1 rounded-full">
            {pkg.duration}
          </span>

          <h3 className="text-2xl sm:text-3xl font-black mt-2 font-header text-[#1A1A1A]">
            {pkg.title}
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            📍 {pkg.destinationName || pkg.title}
          </p>

          {/* Stepper bar */}
          <div className="flex items-center gap-2 mt-6">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[#FF7A00]' : 'bg-[#E2E8F0]'}`}></div>
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[#FF7A00]' : 'bg-[#E2E8F0]'}`}></div>
            <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-[#FF7A00]' : 'bg-[#E2E8F0]'}`}></div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          
          {/* Step 1: Package & Traveler config */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#64748B] mb-3">1. Select Travel Dates & Guests</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Departure Date</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Adults (12+ yrs)</label>
                    <div className="flex items-center border border-[#E2E8F0] rounded-xl p-1 bg-[#F5F9FC]">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] font-bold text-[#1A1A1A] hover:bg-[#F5F9FC] transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-xs text-[#1A1A1A]">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] font-bold text-[#1A1A1A] hover:bg-[#F5F9FC] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Children (0-11 yrs)</label>
                    <div className="flex items-center border border-[#E2E8F0] rounded-xl p-1 bg-[#F5F9FC]">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] font-bold text-[#1A1A1A] hover:bg-[#F5F9FC] transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-xs text-[#1A1A1A]">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] font-bold text-[#1A1A1A] hover:bg-[#F5F9FC] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#64748B] mb-3">Room Accommodation Level</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'standard', title: 'Standard Room', price: 'Included' },
                    { id: 'deluxe', title: 'Deluxe Ocean View', price: '+ $150 / person' },
                    { id: 'villa', title: 'Private Overwater Villa', price: '+ $400 / person' }
                  ].map((room) => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setRoomType(room.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        roomType === room.id
                          ? 'border-[#1A1A1A] bg-white shadow-md'
                          : 'border-[#E2E8F0] bg-white hover:border-[#64748B]/50 hover:bg-[#F5F9FC]'
                      }`}
                    >
                      <p className="text-xs font-extrabold text-[#1A1A1A]">{room.title}</p>
                      <p className="text-[10px] text-[#64748B] mt-1">{room.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#64748B] mb-2">Package Inclusions Highlight</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {pkg.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-center gap-2 text-[#64748B]">
                      <span className="material-symbols-outlined text-[#64748B] text-sm">check_circle</span>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#64748B] mb-3">2. Optional Add-on Experiences</h4>
                <div className="space-y-2">
                  {[
                    { key: 'insurance', title: 'Comprehensive Travel & Medical Insurance', cost: '+$50 / traveler' },
                    { key: 'transfer', title: 'Private Airport SUV Pickup & Dropoff', cost: '+$40' },
                    { key: 'simCard', title: 'Unlimited International eSIM Data Pass', cost: '+$25' },
                    { key: 'guide', title: 'Dedicated Private Tour Concierge Guide', cost: '+$120' }
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-[#E2E8F0] bg-white cursor-pointer hover:bg-[#F5F9FC] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addons[item.key]}
                          onChange={() => toggleAddon(item.key)}
                          className="w-4 h-4 rounded accent-[#1A1A1A]"
                        />
                        <span className="text-xs font-bold text-[#1A1A1A]">{item.title}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#64748B]">{item.cost}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#64748B] mb-3">Lead Traveler Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1 text-[#1A1A1A]">Full Name</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1 text-[#1A1A1A]">Email Address</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#64748B] mb-3">3. Review & Payment</h4>

              {/* Price Breakdown */}
              <div className="bg-[#F5F9FC] p-5 rounded-2xl border border-[#E2E8F0] space-y-2 text-xs">
                <div className="flex justify-between text-[#64748B]">
                  <span>Base Package ({adults} Adults × {formatPrice(basePricePerPerson)})</span>
                  <span>{formatPrice(basePricePerPerson * adults)}</span>
                </div>

                {children > 0 && (
                  <div className="flex justify-between text-[#64748B]">
                    <span>Child Pass ({children} × {formatPrice(basePricePerPerson * 0.7)})</span>
                    <span>{formatPrice(basePricePerPerson * 0.7 * children)}</span>
                  </div>
                )}

                {roomUpgradeCost > 0 && (
                  <div className="flex justify-between text-[#64748B]">
                    <span>Room Upgrade ({roomType})</span>
                    <span>{formatPrice(roomUpgradeCost * adults)}</span>
                  </div>
                )}

                {addonCost > 0 && (
                  <div className="flex justify-between text-[#64748B]">
                    <span>Selected Add-ons</span>
                    <span>{formatPrice(addonCost)}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promo Discount ({appliedPromoCode?.code})</span>
                    <span>- {formatPrice(discount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#E2E8F0] flex justify-between text-base font-black text-[#1A1A1A]">
                  <span>Total Amount:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Promo input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Promo Code (e.g. BALI30)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold uppercase text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-white border border-[#E2E8F0] text-[#1A1A1A] px-5 py-3 rounded-xl text-xs font-bold hover:bg-[#F5F9FC] transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Payment security notice */}
              <div className="p-4 rounded-2xl border border-emerald-400/40 bg-emerald-50 text-xs">
                <p className="font-bold text-[#1A1A1A] mb-1">🔒 Bank-Level Encrypted Payment</p>
                <p className="text-[#64748B]">Your reservation will be instantly confirmed. Instant refund allowed up to 48h before departure.</p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 bg-white border-t border-[#E2E8F0] flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1A1A1A] text-xs font-bold hover:bg-[#F5F9FC] transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-[#FF7A00] text-white px-7 py-3 rounded-xl text-xs font-extrabold hover:bg-[#e56e00] shadow-lg shadow-[#FF7A00]/20 transition-all"
            >
              Continue to Step {step + 1}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="bg-[#FF7A00] text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-[#e56e00] shadow-xl shadow-[#FF7A00]/30 animate-pulse"
            >
              Confirm &amp; Pay {formatPrice(finalTotal)}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
