import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const BookingModal = () => {
  const {
    selectedPackageForBooking,
    setSelectedPackageForBooking,
    formatPrice,
    addBooking,
    showToast,
    user
  } = useApp();

  const [step, setStep] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  
  // Requirements
  const [hotelPreference, setHotelPreference] = useState('4 Star');
  const [airportPickup, setAirportPickup] = useState(true);
  const [localTransportation, setLocalTransportation] = useState(true);
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [contactPreference, setContactPreference] = useState('WhatsApp');

  // Contact form
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');

  if (!selectedPackageForBooking) return null;

  const pkg = selectedPackageForBooking;

  const handleConfirmEnquiry = (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!guestPhone.trim() || guestPhone.length < 7) {
      showToast('Please enter a valid phone / WhatsApp number', 'error');
      return;
    }

    const travellersText = `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`;

    addBooking({
      packageTitle: pkg.title,
      destination: pkg.destinationName || pkg.location || pkg.title,
      travelDate,
      adults,
      children,
      travelers: travellersText,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      hotelPreference,
      transportRequired: {
        airportPickup,
        localTransportation
      },
      contactPreference,
      additionalRequirements: additionalRequirements.trim(),
      status: 'Request Submitted',
      estimatedCost: (pkg.price || 1499) * adults + Math.round((pkg.price || 1499) * 0.6 * children),
      totalAmount: (pkg.price || 1499) * adults + Math.round((pkg.price || 1499) * 0.6 * children),
      price: pkg.price || 1499,
      image: pkg.image
    });

    setSelectedPackageForBooking(null);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] w-full max-w-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-white border-b border-[#E2E8F0]">
          <button
            onClick={() => setSelectedPackageForBooking(null)}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F5F9FC] border border-[#E2E8F0] hover:bg-[#E2E8F0] flex items-center justify-center text-[#64748B] transition-colors text-sm cursor-pointer"
          >
            ✕
          </button>

          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full">
            Enquiry-Based Booking · No Payment Today
          </span>

          <h3 className="text-xl sm:text-2xl font-black mt-2 font-header text-[#1A1A1A]">
            {pkg.title}
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            📍 {pkg.destinationName || pkg.location || pkg.title} · {pkg.duration || '5 Days / 4 Nights'}
          </p>

          {/* Stepper bar */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[#FF7A00]' : 'bg-[#E2E8F0]'}`}></div>
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[#FF7A00]' : 'bg-[#E2E8F0]'}`}></div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          
          {/* Step 1: Travel Dates, Guests & Requirements */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] mb-2.5">1. Travel Date & Number of Guests</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Departure Date</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Adults (12+ yrs)</label>
                    <div className="flex items-center border border-[#E2E8F0] rounded-xl p-1 bg-[#F5F9FC]">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] font-bold text-[#1A1A1A] hover:bg-[#F5F9FC] transition-colors cursor-pointer"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-bold text-xs text-[#1A1A1A]">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] font-bold text-[#1A1A1A] hover:bg-[#F5F9FC] transition-colors cursor-pointer"
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
                        className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] font-bold text-[#1A1A1A] hover:bg-[#F5F9FC] transition-colors cursor-pointer"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-bold text-xs text-[#1A1A1A]">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] font-bold text-[#1A1A1A] hover:bg-[#F5F9FC] transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotel Preference */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] mb-2.5">Hotel Preference</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['3 Star', '4 Star', '5 Star'].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setHotelPreference(star)}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        hotelPreference === star
                          ? 'border-[#FF7A00] bg-orange-50/50 font-black text-[#FF7A00]'
                          : 'border-[#E2E8F0] bg-[#F5F9FC] text-slate-700 font-bold'
                      }`}
                    >
                      <p className="text-xs">{star} Hotel</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transport */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] mb-2">Transport Required</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer ${
                    airportPickup ? 'border-[#0A4D8C] bg-blue-50/50' : 'border-[#E2E8F0] bg-[#F5F9FC]'
                  }`}>
                    <input
                      type="checkbox"
                      checked={airportPickup}
                      onChange={(e) => setAirportPickup(e.target.checked)}
                      className="accent-[#0A4D8C]"
                    />
                    <span className="font-bold text-[#1A1A1A]">Airport Pickup</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer ${
                    localTransportation ? 'border-[#0A4D8C] bg-blue-50/50' : 'border-[#E2E8F0] bg-[#F5F9FC]'
                  }`}>
                    <input
                      type="checkbox"
                      checked={localTransportation}
                      onChange={(e) => setLocalTransportation(e.target.checked)}
                      className="accent-[#0A4D8C]"
                    />
                    <span className="font-bold text-[#1A1A1A]">Local Transportation</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details & Submit */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] mb-2.5">2. Customer Contact Details</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1 text-[#1A1A1A]">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Munees"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold block mb-1 text-[#1A1A1A]">Email Address *</label>
                      <input
                        type="email"
                        placeholder="customer@email.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                      />
                    </div>

                    <div>
                      <label className="font-bold block mb-1 text-[#1A1A1A]">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        placeholder="+91 98047 77879"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold block mb-1 text-[#1A1A1A]">How would you like us to contact you?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['WhatsApp', 'Phone Call', 'Email'].map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setContactPreference(ch)}
                          className={`p-2.5 rounded-xl border text-xs font-extrabold cursor-pointer ${
                            contactPreference === ch
                              ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white'
                              : 'border-[#E2E8F0] bg-[#F5F9FC] text-[#64748B]'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold block mb-1 text-[#1A1A1A]">Additional Requirements (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Vegetarian food, room with view, baby cot..."
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-extrabold">🟡 No Payment Required Today</p>
                <p className="text-[11px] text-amber-800">
                  Our destination team will confirm exact hotel dates, transfers, and total price with you directly.
                </p>
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
              className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1A1A1A] text-xs font-bold hover:bg-[#F5F9FC] transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-[#FF7A00] text-white px-7 py-3 rounded-xl text-xs font-extrabold hover:bg-[#e56e00] shadow-md shadow-[#FF7A00]/20 transition-all cursor-pointer"
            >
              Continue to Customer Details →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmEnquiry}
              className="bg-[#FF7A00] text-white px-8 py-3 rounded-xl font-black text-xs hover:bg-[#e56e00] shadow-xl shadow-[#FF7A00]/30 cursor-pointer"
            >
              Submit Booking Request
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
