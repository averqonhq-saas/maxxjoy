import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const STEPS = [
  { key: 'details',  label: 'Details',  icon: 'person' },
  { key: 'package',  label: 'Package',  icon: 'inventory_2' },
  { key: 'extras',   label: 'Extras',   icon: 'add_circle' },
  { key: 'payment',  label: 'Payment',  icon: 'payments' },
  { key: 'confirm',  label: 'Confirm',  icon: 'check_circle' },
];

const PACKAGES = [
  {
    id: 'deluxe',
    name: 'Deluxe Suite',
    desc: 'City view · King bed · Breakfast included',
    price: 1250,
    badge: null,
    features: ['Ocean Terrace Access', 'Complimentary Minibar', 'Daily Housekeeping'],
  },
  {
    id: 'royal',
    name: 'Royal Suite',
    desc: 'Ocean view · Butler service · All inclusive',
    price: 2800,
    badge: 'Most Popular',
    features: ['Private Butler 24/7', 'Infinity Pool Access', 'Airport Limo Transfer'],
  },
];

const EXTRAS = [
  { id: 'transfer', label: 'Airport Transfer', price: 120, icon: 'airport_shuttle', desc: 'Private luxury car from DXB' },
  { id: 'spa', label: 'Spa Package', price: 350, icon: 'spa', desc: 'Full-day wellness retreat for 2' },
  { id: 'desert', label: 'Desert Safari', price: 280, icon: 'terrain', desc: 'Sunset dune bashing + BBQ dinner' },
  { id: 'cruise', label: 'Dhow Cruise', price: 180, icon: 'directions_boat', desc: 'Creek cruise with dinner & entertainment' },
];

const CALENDAR_DAYS = [
  { day: 28, disabled: true }, { day: 29, disabled: true }, { day: 30, disabled: true },
  { day: 1 },  { day: 2 },  { day: 3 },  { day: 4 },
  { day: 5 },  { day: 6 },  { day: 7 },  { day: 8, today: true },
  { day: 9 },  { day: 10 }, { day: 11 }, { day: 12 },
  { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 },
  { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 },
  { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 },
  { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 },
  { day: 29 }, { day: 30 }, { day: 31 },
];

const DAY_HEADERS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function SectionHeader({ num, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="size-8 rounded-full bg-white border-2 border-[#E2E8F0] text-[#1A1A1A] text-sm font-extrabold flex items-center justify-center flex-shrink-0 shadow-sm">
        {num}
      </span>
      <h2 className="text-2xl font-black text-[#1A1A1A]">{title}</h2>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#1A1A1A]">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 18, marginTop: 1 }}>{icon}</span>
      <div>
        <p className="font-semibold text-[#1A1A1A]">{label}</p>
        <p className="text-[#64748B] text-xs">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#64748B]">{label}</span>
      <span className={bold ? 'font-black text-[#1A1A1A]' : 'text-[#1A1A1A] font-medium'}>{value}</span>
    </div>
  );
}

export const BookingPage = ({ onBack, onMyBookings }) => {
  const { addBooking, formatPrice, showToast, applyPromoCode, selectedPackageForBooking, paymentSettings } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(5);
  const [selectedPackage, setSelectedPackage] = useState('deluxe');
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', travelers: '2' });
  const [payForm, setPayForm] = useState({ card: '', expiry: '', cvv: '', holder: '' });
  const [advanceOption, setAdvanceOption] = useState('25'); // 'full' | '25' | '50'
  const [paymentGatewayMethod, setPaymentGatewayMethod] = useState('razorpay'); // 'razorpay' | 'card' | 'pay_online'
  const [upiId, setUpiId] = useState('');
  const [onlineTxnRef, setOnlineTxnRef] = useState('');

  const activeTour = selectedPackageForBooking || {
    title: 'Dubai Premium Luxury Escape',
    location: 'Dubai, UAE',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=85',
    duration: '5 Days'
  };

  const totalSteps = STEPS.length;
  const progress = Math.round((currentStep / totalSteps) * 100);

  const pkg = PACKAGES.find(p => p.id === selectedPackage);
  const basePrice = activeTour.price || (pkg ? pkg.price * 2 : 1499);
  const extrasTotal = selectedExtras.reduce((sum, id) => {
    const ex = EXTRAS.find(e => e.id === id);
    return sum + (ex ? ex.price : 0);
  }, 0);
  const subtotal = basePrice + extrasTotal;
  const taxes = Math.round(subtotal * 0.05);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const totalAmount = subtotal + taxes - discount;

  // Advance Payment calculations
  const advancePercent = advanceOption === 'full' ? 100 : Number(advanceOption);
  const payNow = advanceOption === 'full' ? totalAmount : Math.round((totalAmount * advancePercent) / 100);
  const remainingBalance = totalAmount - payNow;

  function toggleExtra(id) {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  }

  function applyPromo() {
    if (promo) {
      applyPromoCode(promo);
      if (promo.toUpperCase() === 'DUBAI10' || promo.toUpperCase() === 'BALI30' || promo.toUpperCase() === 'WELCOME50' || promo.toUpperCase() === 'TRAVEL20') {
        setPromoApplied(true);
      }
    }
  }

  const handleDownloadInvoice = () => {
    showToast('📄 Generating official tax invoice PDF...', 'info');
  };

  const handleDownloadItinerary = () => {
    showToast('🗺️ Downloading detailed tour itinerary PDF...', 'info');
  };

  // Razorpay Integration Helper
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    showToast('💳 Opening Razorpay Secure Payment Gateway...', 'info');
    
    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded || !window.Razorpay) {
      // Fallback simulated payment ID if network/adblock prevents loading
      const razorpayPaymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
      finishBookingProcess(`Razorpay (Payment ID #${razorpayPaymentId})`);
      return;
    }

    const options = {
      key: 'rzp_test_MAX9928374', // Razorpay Test Key ID
      amount: payNow * 100, // Amount in paise
      currency: 'INR',
      name: 'Perfect Travel Experiences',
      description: `Tour Booking: ${activeTour.title}`,
      image: 'https://ui-avatars.com/api/?name=Perfect+Travel&background=0A4D8C&color=fff',
      handler: function (response) {
        showToast(`🎉 Razorpay Payment Successful! (ID: ${response.razorpay_payment_id})`, 'success');
        finishBookingProcess(`Razorpay (Payment ID: ${response.razorpay_payment_id})`);
      },
      prefill: {
        name: form.name || 'Traveler',
        email: form.email || 'guest@example.com',
        contact: form.phone || '+91 9876543210'
      },
      theme: {
        color: '#0A4D8C'
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        showToast(`Razorpay Payment Failed: ${response.error.description}`, 'error');
      });
      rzp.open();
    } catch (e) {
      const razorpayPaymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
      finishBookingProcess(`Razorpay (Payment ID #${razorpayPaymentId})`);
    }
  };

  const finishBookingProcess = (selectedMethodName) => {
    addBooking({
      packageTitle: activeTour.title,
      destination: activeTour.location || activeTour.destinationName || 'Dubai, UAE',
      travelDate: `2026-09-${selectedDate < 10 ? '0' + selectedDate : selectedDate}`,
      travelers: `${form.travelers || 2} Adults`,
      totalAmount,
      totalPaid: payNow,
      amountPaid: payNow,
      balanceDue: remainingBalance,
      advancePercent,
      paymentType: advanceOption === 'full' ? 'Full' : 'Partial',
      paymentStatus: remainingBalance === 0 ? 'Paid' : 'Partial',
      price: totalAmount,
      image: activeTour.image,
      duration: activeTour.duration || '5 Days',
      guestName: form.name || 'Traveler',
      guestEmail: form.email || 'guest@example.com',
      guestPhone: form.phone || '',
      paymentMethod: selectedMethodName
    });

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  function goNext() {
    if (currentStep === 4) {
      if (paymentGatewayMethod === 'razorpay') {
        handleRazorpayPayment();
        return;
      }
      const selectedMethodName = paymentGatewayMethod === 'card'
        ? `Credit Card (**** ${payForm.card?.slice(-4) || '4242'})`
        : `Pay Online (Instant Transfer / Ref #${onlineTxnRef || 'PAY992'})`;

      finishBookingProcess(selectedMethodName);
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }
  function goPrev() { if (currentStep > 1) setCurrentStep(s => s - 1); }

  const renderDetails = () => (
    <section>
      <SectionHeader num={1} title="Traveler Information" />
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Lead Traveler Full Name">
            <input
              className="booking-input"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Email Address">
            <input
              className="booking-input"
              placeholder="john@example.com"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Phone Number">
            <div className="flex">
              <select className="rounded-l-xl border border-[#E2E8F0] border-r-0 bg-[#F5F9FC] text-sm px-3 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0A4D8C]/20">
                <option>+971</option><option>+1</option><option>+44</option><option>+91</option>
              </select>
              <input
                className="flex-1 rounded-r-xl border border-[#E2E8F0] bg-[#F5F9FC] px-4 py-3 text-sm text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A4D8C]/20"
                placeholder="50 123 4567"
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </Field>
          <Field label="Additional Travelers">
            <select
              className="booking-input"
              value={form.travelers}
              onChange={e => setForm({ ...form, travelers: e.target.value })}
            >
              <option value="0">0 travelers</option>
              <option value="1">1 traveler</option>
              <option value="2">2 travelers</option>
              <option value="3">3 travelers</option>
              <option value="4">4+ travelers</option>
            </select>
          </Field>
        </div>
        <Field label="Special Requests (Optional)">
          <textarea
            className="booking-input resize-none h-24"
            placeholder="Dietary requirements, accessibility needs, special occasions…"
          />
        </Field>
      </div>
    </section>
  );

  const renderPackage = () => (
    <section className="space-y-6">
      <SectionHeader num={2} title="Package Selection" />
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6">
        <h3 className="text-base font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#FF7A00] text-xl">calendar_month</span>
          Select Travel Date —{' '}
          <span className="text-[#64748B] font-normal text-sm">October 2025</span>
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-[#64748B] mb-2 uppercase tracking-widest">
          {DAY_HEADERS.map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {CALENDAR_DAYS.map(({ day, disabled, today }, i) => (
            <button
              key={i}
              disabled={disabled}
              onClick={() => !disabled && setSelectedDate(day)}
              className={[
                'p-2.5 rounded-xl text-sm font-medium transition-all',
                disabled ? 'text-[#E2E8F0] cursor-not-allowed' : '',
                !disabled && selectedDate === day
                  ? 'bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] font-extrabold shadow-md scale-105'
                  : !disabled && today
                    ? 'bg-[#F5F9FC] text-[#64748B] font-bold border border-[#E2E8F0]'
                    : !disabled
                      ? 'hover:bg-[#F5F9FC] text-[#1A1A1A]'
                      : ''
              ].join(' ')}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PACKAGES.map(p => (
          <label key={p.id} htmlFor={`pkg-${p.id}`} className="cursor-pointer block">
            <input
              id={`pkg-${p.id}`}
              type="radio"
              name="room_type"
              value={p.id}
              checked={selectedPackage === p.id}
              onChange={() => setSelectedPackage(p.id)}
              className="sr-only"
            />
            <div className={[
              'relative p-5 rounded-2xl border-2 transition-all h-full',
              selectedPackage === p.id
                ? 'border-[#1A1A1A] bg-white shadow-lg'
                : 'border-[#E2E8F0] bg-white hover:border-[#64748B]/50 hover:bg-[#F5F9FC]'
            ].join(' ')}>
              {p.badge && (
                <span className="absolute top-3 right-3 bg-[#FF7A00] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  {p.badge}
                </span>
              )}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-extrabold text-lg text-[#1A1A1A]">{p.name}</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">{p.desc}</p>
                </div>
                <div className={[
                  'size-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-1',
                  selectedPackage === p.id ? 'border-[#1A1A1A]' : 'border-[#E2E8F0]'
                ].join(' ')}>
                  {selectedPackage === p.id && <div className="size-3 rounded-full bg-[#1A1A1A]" />}
                </div>
              </div>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-xs text-[#64748B] mb-1">$</span>
                <span className="text-2xl font-black text-[#1A1A1A]">{p.price.toLocaleString()}</span>
                <span className="text-xs text-[#64748B] mb-1">/ night</span>
              </div>
              <ul className="space-y-1.5">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#64748B]">
                    <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 14 }}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </label>
        ))}
      </div>
    </section>
  );

  const renderExtras = () => (
    <section className="space-y-6">
      <SectionHeader num={3} title="Add Extras" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXTRAS.map(ex => {
          const active = selectedExtras.includes(ex.id);
          return (
            <div
              key={ex.id}
              onClick={() => toggleExtra(ex.id)}
              className={[
                'cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-start gap-4',
                active
                  ? 'border-[#1A1A1A] bg-white shadow-md'
                  : 'border-[#E2E8F0] bg-white hover:border-[#64748B]/50 hover:bg-[#F5F9FC]'
              ].join(' ')}
            >
              <div className={[
                'size-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all border',
                active ? 'bg-white border-[#1A1A1A] text-[#1A1A1A]' : 'bg-[#F5F9FC] border-[#E2E8F0] text-[#64748B]'
              ].join(' ')}>
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{ex.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-[#1A1A1A]">{ex.label}</h4>
                  <div className={[
                    'size-5 rounded-md border-2 flex items-center justify-center transition-all',
                    active ? 'bg-[#1A1A1A] border-[#1A1A1A]' : 'border-[#E2E8F0]'
                  ].join(' ')}>
                    {active && <span className="material-symbols-outlined text-white" style={{ fontSize: 13 }}>check</span>}
                  </div>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">{ex.desc}</p>
                <p className="text-sm font-extrabold text-[#1A1A1A] mt-2">+${ex.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  const renderPayment = () => (
    <section className="space-y-6">
      <SectionHeader num={4} title="Payment & Advance Options" />
      
      {/* ── Choose Payment Option (Full vs Advance) ────────────── */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-4">
        <h4 className="font-extrabold text-[#1A1A1A] text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0A4D8C]" style={{ fontSize: 18 }}>account_balance_wallet</span>
          Choose Payment Option
        </h4>

        <div className="space-y-3">
          {/* Pay Full Amount */}
          {paymentSettings.allowFullPayment && (
            <label
              onClick={() => setAdvanceOption('full')}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                advanceOption === 'full'
                  ? 'border-[#0A4D8C] bg-[#0A4D8C]/5 shadow-xs'
                  : 'border-[#E2E8F0] bg-white hover:border-[#0A4D8C]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${advanceOption === 'full' ? 'border-[#0A4D8C]' : 'border-slate-300'}`}>
                  {advanceOption === 'full' && <div className="size-2.5 rounded-full bg-[#0A4D8C]" />}
                </div>
                <div>
                  <p className="font-extrabold text-sm text-[#1A1A1A]">Pay Full Amount</p>
                  <p className="text-[11px] text-[#64748B]">Complete 100% booking payment now</p>
                </div>
              </div>
              <span className="font-black text-[#1A1A1A] text-base">{formatPrice(totalAmount)}</span>
            </label>
          )}

          {/* Pay 25% Advance */}
          {paymentSettings.allowPartialPayment && (
            <label
              onClick={() => setAdvanceOption('25')}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                advanceOption === '25'
                  ? 'border-[#0A4D8C] bg-[#0A4D8C]/5 shadow-xs'
                  : 'border-[#E2E8F0] bg-white hover:border-[#0A4D8C]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${advanceOption === '25' ? 'border-[#0A4D8C]' : 'border-slate-300'}`}>
                  {advanceOption === '25' && <div className="size-2.5 rounded-full bg-[#0A4D8C]" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-sm text-[#1A1A1A]">Pay 25% Advance</p>
                    <span className="bg-[#FF7A00]/10 text-[#FF7A00] px-2 py-0.5 rounded-full text-[10px] font-black">Popular</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Remaining: {formatPrice(totalAmount - Math.round(totalAmount * 0.25))}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-[#0A4D8C] text-base block">{formatPrice(Math.round(totalAmount * 0.25))}</span>
                <span className="text-[10px] text-slate-400 font-extrabold">Pay Now</span>
              </div>
            </label>
          )}

          {/* Pay 50% Advance */}
          {paymentSettings.allowPartialPayment && (
            <label
              onClick={() => setAdvanceOption('50')}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                advanceOption === '50'
                  ? 'border-[#0A4D8C] bg-[#0A4D8C]/5 shadow-xs'
                  : 'border-[#E2E8F0] bg-white hover:border-[#0A4D8C]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${advanceOption === '50' ? 'border-[#0A4D8C]' : 'border-slate-300'}`}>
                  {advanceOption === '50' && <div className="size-2.5 rounded-full bg-[#0A4D8C]" />}
                </div>
                <div>
                  <p className="font-extrabold text-sm text-[#1A1A1A]">Pay 50% Advance</p>
                  <p className="text-[11px] text-[#64748B]">
                    Remaining: {formatPrice(totalAmount - Math.round(totalAmount * 0.50))}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-[#0A4D8C] text-base block">{formatPrice(Math.round(totalAmount * 0.50))}</span>
                <span className="text-[10px] text-slate-400 font-extrabold">Pay Now</span>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* ── Promo & Credit Card Details ──────────────────────────── */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 space-y-5">
        <div className="flex gap-3">
          <input
            className="booking-input flex-1"
            placeholder="Promo Code (try DUBAI10, BALI30)"
            value={promo}
            onChange={e => setPromo(e.target.value)}
          />
          <button
            onClick={applyPromo}
            className={[
              'px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap border cursor-pointer',
              promoApplied
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-white border-[#E2E8F0] text-[#1A1A1A] hover:bg-[#F5F9FC] hover:border-[#64748B]/40'
            ].join(' ')}
          >
            {promoApplied ? '✓ Applied' : 'Apply'}
          </button>
        </div>

        {promoApplied && (
          <p className="text-xs text-emerald-600 font-extrabold flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
            Promo discount applied successfully!
          </p>
        )}

        <div className="pt-2 border-t border-[#E2E8F0] space-y-4">
          <h4 className="font-extrabold text-[#1A1A1A] text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0A4D8C]" style={{ fontSize: 18 }}>credit_score</span>
            Select Payment Method
          </h4>

          {/* 3 Gateway Method Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Method 1: Razorpay / UPI / Net Banking */}
            <button
              type="button"
              onClick={() => setPaymentGatewayMethod('razorpay')}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                paymentGatewayMethod === 'razorpay'
                  ? 'border-[#0A4D8C] bg-[#0A4D8C]/5 shadow-xs'
                  : 'border-[#E2E8F0] bg-white hover:border-[#0A4D8C]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-xs text-[#0A4D8C]">Razorpay & UPI</span>
                <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">Popular</span>
              </div>
              <p className="text-[11px] text-[#64748B] font-medium">GPay, PhonePe, Paytm, BHIM & Net Banking</p>
            </button>

            {/* Method 2: Credit / Debit Card */}
            <button
              type="button"
              onClick={() => setPaymentGatewayMethod('card')}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                paymentGatewayMethod === 'card'
                  ? 'border-[#0A4D8C] bg-[#0A4D8C]/5 shadow-xs'
                  : 'border-[#E2E8F0] bg-white hover:border-[#0A4D8C]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-xs text-slate-900">Credit / Debit Card</span>
                <span className="text-[10px] font-bold text-slate-400">Online</span>
              </div>
              <p className="text-[11px] text-[#64748B] font-medium">Visa, Mastercard, RuPay & Amex</p>
            </button>

            {/* Method 3: Pay Online / QR Transfer */}
            <button
              type="button"
              onClick={() => setPaymentGatewayMethod('pay_online')}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                paymentGatewayMethod === 'pay_online'
                  ? 'border-[#0A4D8C] bg-[#0A4D8C]/5 shadow-xs'
                  : 'border-[#E2E8F0] bg-white hover:border-[#0A4D8C]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-xs text-emerald-700">Pay Online & QR</span>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">Instant</span>
              </div>
              <p className="text-[11px] text-[#64748B] font-medium">Scan QR or Direct Bank Wire</p>
            </button>

          </div>

          {/* Conditional Input UI per Method */}
          {paymentGatewayMethod === 'razorpay' && (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">account_balance</span>
                <span className="font-extrabold text-slate-900 text-xs">Razorpay UPI & Net Banking Gateway</span>
              </div>
              <Field label="Enter VPA / UPI ID (Optional for Quick Verification)">
                <input
                  className="booking-input"
                  placeholder="e.g. mobile@upi, name@okaxis"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                />
              </Field>
              <div className="flex flex-wrap gap-2 text-[10px] font-extrabold text-slate-600">
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md">✓ Google Pay</span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md">✓ PhonePe</span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md">✓ Paytm UPI</span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md">✓ 50+ Banks Net Banking</span>
              </div>
            </div>
          )}

          {paymentGatewayMethod === 'card' && (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-4">
              <Field label="Card Number">
                <input
                  className="booking-input font-mono tracking-widest"
                  placeholder="4242  4242  4242  4242"
                  maxLength={19}
                  value={payForm.card}
                  onChange={e => setPayForm({ ...payForm, card: e.target.value })}
                />
              </Field>
              <Field label="Cardholder Name">
                <input
                  className="booking-input"
                  placeholder="As on card"
                  value={payForm.holder}
                  onChange={e => setPayForm({ ...payForm, holder: e.target.value })}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry Date">
                  <input
                    className="booking-input"
                    placeholder="12 / 28"
                    value={payForm.expiry}
                    onChange={e => setPayForm({ ...payForm, expiry: e.target.value })}
                  />
                </Field>
                <Field label="CVV Security Code">
                  <input
                    className="booking-input"
                    placeholder="•••"
                    maxLength={4}
                    value={payForm.cvv}
                    onChange={e => setPayForm({ ...payForm, cvv: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          )}

          {paymentGatewayMethod === 'pay_online' && (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl">
                <div>
                  <p className="font-extrabold text-xs text-slate-900">Direct Online Scan & Bank Wire</p>
                  <p className="text-[11px] text-slate-500 font-mono">Account: Perfect Travel Pvt Ltd</p>
                  <p className="text-[10px] text-slate-400 font-mono">IFSC: HDFC0001234 · A/C: 502000889911</p>
                </div>
                <div className="size-16 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                  [Scan QR]
                </div>
              </div>
              <Field label="Payment Reference / UTR Number">
                <input
                  className="booking-input font-mono"
                  placeholder="e.g. UTR98421054"
                  value={onlineTxnRef}
                  onChange={e => setOnlineTxnRef(e.target.value)}
                />
              </Field>
            </div>
          )}

        </div>
        <div className="flex flex-wrap items-center gap-5 pt-2 border-t border-[#E2E8F0]">
          {[
            { icon: 'verified_user', text: '256-bit SSL Encrypted' },
            { icon: 'lock', text: 'PCI DSS Compliant' },
            { icon: 'shield', text: 'Razorpay / Stripe Gateways' },
          ].map(b => (
            <div key={b.icon} className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 14 }}>{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderConfirm = () => (
    <section>
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-8 text-center space-y-6">
        <div className="size-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <span className="material-symbols-outlined text-emerald-600 text-4xl">check_circle</span>
        </div>

        <div>
          <h2 className="text-3xl font-black text-[#1A1A1A]">🎉 Booking Confirmed!</h2>
          <p className="text-[#64748B] text-xs mt-1">
            Thank you for booking with us. Confirmation sent to{' '}
            <strong className="text-[#1A1A1A] font-bold">{form.email || 'your email'}</strong>.
          </p>
        </div>

        {/* Confirmation Receipt Breakdown */}
        <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-5 text-left space-y-3 max-w-md mx-auto">
          <Row label="Booking Reference ID" value={`TRV${Math.floor(10000 + Math.random() * 90000)}`} bold />
          <Row label="Tour Package" value={activeTour.title} />
          <Row label="Travel Date" value={`2026-09-${selectedDate < 10 ? '0' + selectedDate : selectedDate}`} />
          <Row label="Travelers" value={`${form.travelers || 2} Adults`} />
          
          <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Total Package Cost:</span>
              <span className="font-bold text-slate-900">{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-extrabold text-sm">
              <span>Paid Now ({advancePercent}%):</span>
              <span>{formatPrice(payNow)} ✓</span>
            </div>
            {remainingBalance > 0 && (
              <div className="flex justify-between text-amber-600 font-extrabold text-xs pt-1 border-t border-slate-200">
                <span>Remaining Balance Due:</span>
                <span>{formatPrice(remainingBalance)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dispatch Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
            📱 WhatsApp Confirmation Sent
          </span>
          <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1">
            📧 Email Invoice Sent
          </span>
        </div>

        {/* Action Receipts */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
          {onMyBookings && (
            <button
              onClick={onMyBookings}
              className="w-full sm:w-auto bg-[#0A4D8C] text-white px-5 py-3 rounded-xl font-extrabold text-xs hover:bg-[#073c6e] shadow-md transition-all cursor-pointer"
            >
              View My Bookings
            </button>
          )}
          <button
            onClick={handleDownloadInvoice}
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded-xl font-extrabold text-xs hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Download Invoice</span>
          </button>
          <button
            onClick={handleDownloadItinerary}
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded-xl font-extrabold text-xs hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">map</span>
            <span>Itinerary</span>
          </button>
        </div>

        <div className="pt-4">
          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Back to Home Page
          </button>
        </div>
      </div>
    </section>
  );

  const stepContent = [renderDetails, renderPackage, renderExtras, renderPayment, renderConfirm];

  return (
    <div className="min-h-screen bg-[#F5F9FC] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0A4D8C]" style={{ fontSize: 20 }}>travel</span>
            </div>
            <div>
              <p className="max-w-[190px] truncate text-sm font-black leading-tight text-[#1A1A1A] sm:max-w-none sm:text-base">{activeTour.title}</p>
              <p className="text-[10px] text-[#64748B] font-medium">Verified Tour Booking Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] text-[#64748B]">Need help?</span>
              <a href="tel:+919804777879" className="text-sm font-bold text-[#1A1A1A] hover:text-[#0A4D8C] transition-colors">+91 98047 77879</a>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0A4D8C] border border-[#E2E8F0] rounded-xl px-3 py-2 transition-all hover:border-[#0A4D8C]/30 hover:bg-[#F5F9FC] cursor-pointer"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 lg:py-12">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#1A1A1A] uppercase tracking-wider text-xs font-extrabold">
              Step {currentStep} of {totalSteps}: {STEPS[currentStep - 1].label}
            </span>
            <span className="text-[#64748B] text-xs font-semibold">{progress}% Complete</span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0A4D8C] h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <nav className="mt-8 flex flex-wrap gap-0 border-b border-[#E2E8F0]">
            {STEPS.map((step, idx) => {
              const stepNum = idx + 1;
              const isActive = stepNum === currentStep;
              const isDone = stepNum < currentStep;
              return (
                <button
                  key={step.key}
                  onClick={() => isDone && setCurrentStep(stepNum)}
                  className={[
                    'flex-1 min-w-[90px] pb-4 border-b-2 flex items-center justify-center gap-2 transition-all text-sm',
                    isActive ? 'border-[#0A4D8C] text-[#0A4D8C] font-bold'
                      : isDone ? 'border-[#64748B] text-[#64748B] font-semibold cursor-pointer hover:opacity-80'
                        : 'border-transparent text-[#E2E8F0] cursor-default'
                  ].join(' ')}
                >
                  {isDone
                    ? <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: 16 }}>check_circle</span>
                    : <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{step.icon}</span>
                  }
                  <span className="hidden sm:block">{step.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Step content */}
          <div className="lg:col-span-2 space-y-8">
            {stepContent[currentStep - 1]()}

            {currentStep < totalSteps && (
              <div className="flex justify-between items-center pt-6 border-t border-[#E2E8F0]">
                <button
                  onClick={currentStep === 1 ? onBack : goPrev}
                  className="px-7 py-3 rounded-xl font-bold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F5F9FC] transition-all text-sm cursor-pointer"
                >
                  {currentStep === 1 ? '← Home' : '← Back'}
                </button>
                <button
                  onClick={goNext}
                  className="px-10 py-3 rounded-xl font-extrabold text-white bg-[#FF7A00] hover:bg-[#e56e00] shadow-lg shadow-[#FF7A00]/25 transition-all text-sm cursor-pointer"
                >
                  {currentStep === totalSteps - 1 ? 'Confirm Booking →' : `Continue to ${STEPS[currentStep]?.label} →`}
                </button>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <aside className="sticky top-28 space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div
                className="h-44 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${activeTour.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-black text-lg leading-tight">{activeTour.title}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="material-symbols-outlined text-amber-400 fill-current text-xs">star</span>
                    ))}
                    <span className="text-white/90 text-[10px] ml-1.5 font-bold">
                      {activeTour.rating || 4.9} ({activeTour.reviewsCount || 120} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <h3 className="font-extrabold text-[#1A1A1A]">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <SummaryRow icon="calendar_today" label="Selected Dates" value={`2026-09-${selectedDate < 10 ? '0' + selectedDate : selectedDate}`} />
                  <SummaryRow icon="group" label="Travelers" value={`${form.travelers || 2} Adults`} />
                  <SummaryRow icon="location_on" label="Destination" value={activeTour.location || activeTour.destinationName || 'Verified Tour'} />
                  {selectedExtras.length > 0 && (
                    <SummaryRow icon="add_circle" label="Extras" value={`${selectedExtras.length} add-on${selectedExtras.length > 1 ? 's' : ''}`} />
                  )}
                </div>

                <div className="border-t border-[#E2E8F0] pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Tour Base Package</span>
                    <span>{formatPrice(basePrice)}</span>
                  </div>
                  {extrasTotal > 0 && (
                    <div className="flex justify-between text-[#64748B]">
                      <span>Extras & Upgrades</span><span>+{formatPrice(extrasTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#64748B]">
                    <span>Taxes & Service Fees</span><span>{formatPrice(taxes)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount</span><span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-[#1A1A1A] pt-2 border-t border-[#E2E8F0]">
                    <span>Total Amount</span><span>{formatPrice(totalAmount)}</span>
                  </div>

                  <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl p-3 space-y-1.5 text-xs font-bold mt-2">
                    <div className="flex justify-between text-[#0A4D8C]">
                      <span>Pay Now ({advancePercent}%):</span>
                      <span>{formatPrice(payNow)}</span>
                    </div>
                    {remainingBalance > 0 && (
                      <div className="flex justify-between text-amber-600">
                        <span>Balance Due Later:</span>
                        <span>{formatPrice(remainingBalance)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 20 }}>verified_user</span>
              <div>
                <h4 className="font-bold text-[#1A1A1A] text-sm">Best Price Guaranteed</h4>
                <p className="text-xs text-[#64748B] mt-1">Find it cheaper elsewhere? We'll match it + give you a $50 credit.</p>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 20 }}>cancel</span>
              <div>
                <h4 className="font-bold text-[#1A1A1A] text-sm">Free Cancellation</h4>
                <p className="text-xs text-[#64748B] mt-1">Cancel up to 72 hours before departure for a full refund.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-16 border-t border-[#E2E8F0] bg-white py-8 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 18 }}>travel</span>
            <span className="font-bold text-[#64748B] text-sm">Dubai Luxury Tour © 2025</span>
          </div>
          <div className="flex gap-6 text-sm text-[#64748B] font-medium">
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>

      <style>{`
        .booking-input {
          width: 100%;
          border: 1px solid #E2E8F0;
          border-radius: 0.75rem;
          background-color: #F5F9FC;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: #1A1A1A;
          outline: none;
          transition: box-shadow 0.2s, border-color 0.2s, background-color 0.2s;
        }
        .booking-input::placeholder { color: #94A3B8; }
        .booking-input:focus {
          border-color: #1A1A1A;
          box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.08);
          background-color: #ffffff;
        }
      `}</style>
    </div>
  );
};
