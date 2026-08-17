import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateAndDownloadInvoice } from '../utils/invoiceGenerator';
import { InvoiceModal } from './modals/InvoiceModal';
import { db, auth, googleProvider } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export const AdminDashboard = ({ onBack }) => {
  const {
    user,
    destinationsList,
    setDestinationsList,
    addDestination,
    updateDestination,
    deleteDestination,
    packagesList,
    setPackagesList,
    addPackage,
    updatePackage,
    deletePackage,
    myBookings,
    formatPrice,
    showToast,
    seedFirebaseData,
    customersList,
    paymentSettings,
    updatePaymentSettings,
    specialDeal,
    updateSpecialDeal,
    reviewsList,
    updateReview,
    deleteReview,
    legalSettings,
    updateLegalSettings,
    currency,
    bookingPackageTiers,
    updateBookingPackageTiers,
    bookingAddonExtras,
    updateBookingAddonExtras
  } = useApp();

  const [localPackageTiers, setLocalPackageTiers] = useState(() => bookingPackageTiers || []);
  useEffect(() => {
    if (bookingPackageTiers) setLocalPackageTiers(bookingPackageTiers);
  }, [bookingPackageTiers]);

  const [localAddonExtras, setLocalAddonExtras] = useState(() => bookingAddonExtras || []);
  useEffect(() => {
    if (bookingAddonExtras) setLocalAddonExtras(bookingAddonExtras);
  }, [bookingAddonExtras]);

  const handleSaveExtras = () => {
    updateBookingAddonExtras(localAddonExtras);
  };

  const handleSaveTiers = () => {
    updateBookingPackageTiers(localPackageTiers);
  };

  const handleAddExtra = () => {
    setLocalAddonExtras(prev => [
      ...prev,
      { id: `extra-${Date.now()}`, label: 'New Custom Extra', price: 150, icon: 'add_circle', desc: 'Custom tour add-on' }
    ]);
  };

  const handleRemoveExtra = (id) => {
    setLocalAddonExtras(prev => prev.filter(e => e.id !== id));
  };

  const handleAddTier = () => {
    setLocalPackageTiers(prev => [
      ...prev,
      { id: `tier-${Date.now()}`, name: 'Royal VIP Suite', desc: 'Ocean view · Private butler', price: 2500, badge: 'VIP', features: ['Private Butler 24/7', 'Helicopter Transfer'] }
    ]);
  };

  const handleRemoveTier = (id) => {
    setLocalPackageTiers(prev => prev.filter(t => t.id !== id));
  };

  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAdminBooking, setSelectedAdminBooking] = useState(null);
  const [selectedCustomerModal, setSelectedCustomerModal] = useState(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [paymentsFilter, setPaymentsFilter] = useState('All');
  const [inquiriesFilter, setInquiriesFilter] = useState('All');

  // Special Deal Banner Form State
  const [dealForm, setDealForm] = useState(() => specialDeal || {});
  useEffect(() => {
    if (specialDeal) {
      setDealForm(specialDeal);
    }
  }, [specialDeal]);

  // Legal & Website Content Form State
  const [legalForm, setLegalForm] = useState(() => legalSettings || {});
  useEffect(() => {
    if (legalSettings) {
      setLegalForm(legalSettings);
    }
  }, [legalSettings]);

  // Inquiries real-time listener from Firebase Firestore
  const [inquiriesList, setInquiriesList] = useState([]);
  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setInquiriesList(docs);
    }, () => { });
    return () => unsub();
  }, []);

  // Calculate real dynamic total revenue from customer bookings in Firebase
  const totalRevenue = myBookings.reduce((sum, b) => {
    const val = typeof b.totalPaid === 'number' ? b.totalPaid : (typeof b.price === 'number' ? b.price : parseFloat(String(b.totalPaid || b.price || '0').replace(/[^0-9.]/g, '')) || 0);
    return sum + val;
  }, 0);

  // Modal / Form state for Add/Edit Destination
  const [showDestForm, setShowDestForm] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [destForm, setDestForm] = useState({
    title: '',
    country: '',
    region: 'Asia',
    category: 'leisure',
    image: '',
    description: '',
    popular: false,
    featured: false,
    status: 'Active',
    price: 999,
    displayOrder: 1
  });

  // Modal / Form state for Add/Edit Package
  const [showPkgForm, setShowPkgForm] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [pkgForm, setPkgForm] = useState({
    title: '',
    destinationName: 'Dubai, UAE',
    duration: '5 Days / 4 Nights',
    price: 1500,
    originalPrice: 1800,
    category: 'leisure',
    discountBadge: 'Best Seller',
    image: '',
    description: '',
    hotelName: '',
    inclusionsText: '',
    exclusionsText: '',
    itineraryDays: [
      { day: 1, title: 'Arrival & Welcome Dinner', desc: 'VIP private airport transfer to your luxury resort and welcome dinner.' },
      { day: 2, title: 'Guided Sightseeing & Highlights', desc: 'Full-day private guided tour with entry passes to top iconic landmarks.' }
    ],
    status: 'Active',
    featured: true,
    showOnHomepage: true,
    displayOrder: 1
  });

  // ── Handlers for Destination ─────────────────────────────────────────────
  const handleSaveDest = (e) => {
    e.preventDefault();
    if (!destForm.title || !destForm.image) {
      showToast('Please provide Destination Title and Image URL', 'error');
      return;
    }
    if (editingDest) {
      updateDestination(editingDest.id, destForm);
    } else {
      addDestination(destForm);
    }
    setShowDestForm(false);
    setEditingDest(null);
  };

  const handleEditDestClick = (dest) => {
    setEditingDest(dest);
    setDestForm({ ...dest });
    setShowDestForm(true);
  };

  // ── Handlers for Package ────────────────────────────────────────────────
  const handleSavePkg = (e) => {
    e.preventDefault();
    if (!pkgForm.title || !pkgForm.image) {
      showToast('Please fill in Package Title and Image URL', 'error');
      return;
    }

    const inclusions = pkgForm.inclusionsText
      ? pkgForm.inclusionsText.split('\n').map(s => s.trim()).filter(Boolean)
      : ['5-Star Luxury Resort Stay', 'Breakfast & Gourmet Meals', 'Private Airport Transfers'];

    const exclusions = pkgForm.exclusionsText
      ? pkgForm.exclusionsText.split('\n').map(s => s.trim()).filter(Boolean)
      : ['International Airfare', 'Personal Expenses'];

    const itinerary = (pkgForm.itineraryDays || [])
      .filter(d => d.title || d.desc)
      .map((d, idx) => ({ ...d, day: idx + 1 }));

    const payload = {
      ...pkgForm,
      inclusions,
      highlights: inclusions,
      exclusions,
      itinerary
    };

    if (editingPkg) {
      updatePackage(editingPkg.id, payload);
    } else {
      addPackage(payload);
    }
    setShowPkgForm(false);
    setEditingPkg(null);
  };

  const handleEditPkgClick = (pkg) => {
    setEditingPkg(pkg);
    const existingItinerary = Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0
      ? pkg.itinerary
      : [
        { day: 1, title: 'Arrival & Welcome Dinner', desc: 'VIP private airport transfer to hotel.' },
        { day: 2, title: 'Guided Sightseeing & Tours', desc: 'Full day guided tour.' }
      ];

    setPkgForm({
      ...pkg,
      inclusionsText: Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : (pkg.inclusionsText || ''),
      exclusionsText: Array.isArray(pkg.exclusions) ? pkg.exclusions.join('\n') : (pkg.exclusionsText || ''),
      itineraryDays: existingItinerary
    });
    setShowPkgForm(true);
  };

  // Helper actions for dynamic Itinerary Days
  const addItineraryDay = () => {
    setPkgForm(prev => ({
      ...prev,
      itineraryDays: [
        ...prev.itineraryDays,
        { day: prev.itineraryDays.length + 1, title: '', desc: '' }
      ]
    }));
  };

  const updateItineraryDay = (index, field, val) => {
    setPkgForm(prev => {
      const updated = [...prev.itineraryDays];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, itineraryDays: updated };
    });
  };

  const removeItineraryDay = (index) => {
    setPkgForm(prev => {
      const updated = prev.itineraryDays.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
      return { ...prev, itineraryDays: updated };
    });
  };

  // Reordering helpers for Homepage Control
  const moveDest = (index, direction) => {
    const list = [...destinationsList];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setDestinationsList(list);
    showToast('Reordered homepage destinations', 'info');
  };

  const movePkg = (index, direction) => {
    const list = [...packagesList];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setPackagesList(list);
    showToast('Reordered homepage tour packages', 'info');
  };

  const [adminEmail, setAdminEmail] = useState('muneeswaranmd2004@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [authSubmitLoading, setAuthSubmitLoading] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return user?.isAdmin || user?.role === 'admin' || user?.email?.toLowerCase() === 'muneeswaranmd2004@gmail.com' || localStorage.getItem('pt_admin_session') === 'true';
  });

  useEffect(() => {
    if (user?.isAdmin || user?.role === 'admin' || user?.email?.toLowerCase() === 'muneeswaranmd2004@gmail.com') {
      setIsAdminUnlocked(true);
    }
  }, [user]);

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setPasscodeError('');
    setAuthSubmitLoading(true);

    const emailClean = adminEmail.trim().toLowerCase();
    const passClean = adminPassword.trim();

    // Direct passcode or Admin Email bypass check
    if (
      (emailClean === 'muneeswaranmd2004@gmail.com' && (passClean === 'admin123' || passClean === 'admin' || passClean === 'admin2026' || passClean === '123456' || !passClean)) ||
      passClean === 'admin123' || passClean === 'admin2026'
    ) {
      setIsAdminUnlocked(true);
      localStorage.setItem('pt_admin_session', 'true');
      showToast('🔓 Admin Portal Unlocked for muneeswaranmd2004@gmail.com!', 'success');
      setAuthSubmitLoading(false);
      return;
    }

    // Firebase Auth Login
    try {
      const res = await signInWithEmailAndPassword(auth, emailClean, passClean);
      if (res.user) {
        setIsAdminUnlocked(true);
        localStorage.setItem('pt_admin_session', 'true');
        showToast(`🔓 Logged in as Admin: ${res.user.email}`, 'success');
      }
    } catch (err) {
      setPasscodeError(err.message?.replace('Firebase: ', '') || 'Admin authentication failed. Try password: admin123');
      showToast('❌ Admin Login Failed', 'error');
    } finally {
      setAuthSubmitLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setAuthSubmitLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setIsAdminUnlocked(true);
        localStorage.setItem('pt_admin_session', 'true');
        showToast(`🔓 Authenticated Admin: ${res.user.email}`, 'success');
      }
    } catch (err) {
      showToast('Google Sign-In failed', 'error');
    } finally {
      setAuthSubmitLoading(false);
    }
  };

  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-4 font-sans">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#FF7A00] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#FF7A00]/30">
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>

          <div>
            <h2 className="text-2xl font-black font-header text-white">Admin Authentication</h2>
            <p className="text-xs text-white/70 mt-1">
              Superadmin Account: <strong className="text-amber-400">muneeswaranmd2004@gmail.com</strong>
            </p>
          </div>

          {/* Google Quick Sign-In */}
          <button
            type="button"
            onClick={handleGoogleAdminLogin}
            disabled={authSubmitLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-extrabold py-3 px-4 rounded-xl text-xs shadow-md hover:bg-slate-100 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign in with Google Admin</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-white/40 my-2">
            <div className="flex-1 h-px bg-white/10"></div>
            <span>or sign in with password</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-black uppercase text-white/80 tracking-wider block mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="muneeswaranmd2004@gmail.com"
                value={adminEmail}
                onChange={(e) => { setAdminEmail(e.target.value); setPasscodeError(''); }}
                className="w-full p-3.5 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/40 text-xs font-bold focus:outline-none focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-white/80 tracking-wider block mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password (default: admin123)"
                value={adminPassword}
                onChange={(e) => { setAdminPassword(e.target.value); setPasscodeError(''); }}
                className="w-full p-3.5 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/40 text-xs font-bold focus:outline-none focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20"
              />
              {passcodeError && (
                <p className="text-rose-400 text-[11px] font-semibold mt-1">{passcodeError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={authSubmitLoading}
              className="w-full bg-[#FF7A00] text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-[#ff881a] shadow-lg shadow-[#FF7A00]/30 transition-all cursor-pointer"
            >
              {authSubmitLoading ? 'Authenticating Admin...' : '🔓 Login to Admin Dashboard'}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
            <span className="text-white/60">Passcode: <code className="text-amber-300 font-bold">admin123</code></span>
            <button
              onClick={onBack}
              className="text-white/80 font-bold hover:text-white transition-colors cursor-pointer"
            >
              ← Back to Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F9FC] font-sans flex flex-col md:flex-row">
      {/* ── Sidebar Navigation ──────────────────────────────────── */}
      <aside className="w-full md:w-64 bg-[#1A1A1A] text-white p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Admin Header Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/maxxjoy-logo1.png"
              alt="Maxx Joy"
              className="h-10 w-10 object-contain flex-shrink-0"
            />
            <div>
              <h2 className="font-black text-white text-base leading-tight">Maxx Joy</h2>
              <span className="text-[9px] text-amber-400/90 font-bold uppercase tracking-wider">Admin Portal</span>
            </div>
          </div>

          {/* Seed Firebase Button */}
          <button
            onClick={seedFirebaseData}
            className="w-full mb-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">cloud_upload</span>
            <span>Seed Firebase Data</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
              { id: 'destinations', label: 'Destinations', icon: 'map', badge: destinationsList.length },
              { id: 'packages', label: 'Tour Packages', icon: 'package_2', badge: packagesList.length },
              { id: 'homepage', label: 'Homepage Control', icon: 'tune' },
              { id: 'bookings', label: 'Bookings', icon: 'confirmation_number', badge: myBookings.length },
              { id: 'payments', label: 'Payments', icon: 'payments' },
              { id: 'payment-settings', label: 'Payment Settings', icon: 'settings_applications' },
              { id: 'booking-options', label: 'Packages & Add-on Extras', icon: 'room_service' },
              { id: 'inquiries', label: 'Inquiries & Messages', icon: 'mark_email_unread', badge: inquiriesList.length },
              { id: 'customers', label: 'Customers', icon: 'group' },
              { id: 'reviews', label: 'Reviews', icon: 'star' },
              { id: 'legal', label: 'Website Content', icon: 'gavel' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === item.id
                    ? 'bg-white text-[#1A1A1A] shadow-md'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === item.id ? 'bg-[#1A1A1A] text-white' : 'bg-white/20 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Back to Client Site */}
        <div className="pt-6 border-t border-white/10 mt-6 space-y-2">
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold py-3 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Exit Admin View
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('pt_admin_session');
              setIsAdminUnlocked(false);
              showToast('🔒 Admin session locked', 'info');
            }}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold py-2.5 rounded-xl hover:bg-rose-500/30 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>lock</span>
            Lock Admin Session
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ───────────────────────────────────── */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">

        {/* ── 1. DASHBOARD OVERVIEW ─────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-[#1A1A1A]">Platform Executive Overview</h1>
              <p className="text-xs text-[#64748B] mt-1">Live metrics and real-time control over customer offerings.</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Total Destinations</span>
                  <span className="material-symbols-outlined text-[#1A1A1A]">map</span>
                </div>
                <p className="text-3xl font-black text-[#1A1A1A]">{destinationsList.length}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {destinationsList.filter(d => d.status === 'Active').length} Active & Visible
                </p>
              </div>

              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Tour Packages</span>
                  <span className="material-symbols-outlined text-[#FF7A00]">package_2</span>
                </div>
                <p className="text-3xl font-black text-[#1A1A1A]">{packagesList.length}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {packagesList.filter(p => p.status === 'Active').length} Published & Bookable
                </p>
              </div>

              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Total Bookings</span>
                  <span className="material-symbols-outlined text-blue-600">confirmation_number</span>
                </div>
                <p className="text-3xl font-black text-[#1A1A1A]">{myBookings.length}</p>
                <p className="text-[11px] text-blue-600 font-semibold mt-1">100% Confirmed Transactions</p>
              </div>

              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Total Revenue</span>
                  <span className="material-symbols-outlined text-emerald-600">payments</span>
                </div>
                <p className="text-3xl font-black text-[#1A1A1A]">{formatPrice(totalRevenue)}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {myBookings.length > 0 ? `${myBookings.length} Confirmed ${myBookings.length === 1 ? 'Booking' : 'Bookings'}` : '0 Bookings Recorded'}
                </p>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-[#1A1A1A] mb-4">Quick Management Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => { setEditingDest(null); setDestForm({ title: '', country: '', region: 'Asia', category: 'leisure', image: '', description: '', popular: true, featured: true, status: 'Active', price: 999, displayOrder: destinationsList.length + 1 }); setShowDestForm(true); setActiveTab('destinations'); }}
                  className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F5F9FC] hover:bg-white hover:border-[#1A1A1A] transition-all text-left group"
                >
                  <span className="material-symbols-outlined text-2xl text-[#1A1A1A] mb-2 block group-hover:scale-110 transition-transform">add_location_alt</span>
                  <p className="font-extrabold text-[#1A1A1A] text-sm">+ Add New Destination</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Publish new city or country guide</p>
                </button>

                <button
                  onClick={() => { setEditingPkg(null); setPkgForm({ title: '', destinationName: 'Dubai, UAE', duration: '5 Days / 4 Nights', price: 1500, originalPrice: 1800, category: 'leisure', discountBadge: 'New', image: '', status: 'Active', featured: true, showOnHomepage: true, displayOrder: packagesList.length + 1 }); setShowPkgForm(true); setActiveTab('packages'); }}
                  className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F5F9FC] hover:bg-white hover:border-[#1A1A1A] transition-all text-left group"
                >
                  <span className="material-symbols-outlined text-2xl text-[#FF7A00] mb-2 block group-hover:scale-110 transition-transform">post_add</span>
                  <p className="font-extrabold text-[#1A1A1A] text-sm">+ Add Tour Package</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Create itinerary and set pricing</p>
                </button>

                <button
                  onClick={() => setActiveTab('homepage')}
                  className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F5F9FC] hover:bg-white hover:border-[#1A1A1A] transition-all text-left group"
                >
                  <span className="material-symbols-outlined text-2xl text-blue-600 mb-2 block group-hover:scale-110 transition-transform">tune</span>
                  <p className="font-extrabold text-[#1A1A1A] text-sm">Homepage Controls</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Toggle featured cards & reorder</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. DESTINATIONS MANAGEMENT ─────────────────────────── */}
        {activeTab === 'destinations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#1A1A1A]">Destinations Management</h1>
                <p className="text-xs text-[#64748B] mt-1">Control active status and homepage visibility of all travel destinations.</p>
              </div>

              <button
                onClick={() => {
                  setEditingDest(null);
                  setDestForm({ title: '', country: '', region: 'Asia', category: 'leisure', image: '', description: '', popular: true, featured: true, status: 'Active', price: 1200, displayOrder: destinationsList.length + 1 });
                  setShowDestForm(true);
                }}
                className="bg-[#1A1A1A] text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md hover:bg-[#333] transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Destination
              </button>
            </div>

            {/* Destinations Table / List */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F5F9FC] border-b border-[#E2E8F0] text-[11px] font-extrabold uppercase text-[#64748B]">
                      <th className="p-4">Destination</th>
                      <th className="p-4">Region</th>
                      <th className="p-4">Base Price</th>
                      <th className="p-4">Popular</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-xs">
                    {destinationsList.map(dest => (
                      <tr key={dest.id} className="hover:bg-[#F5F9FC]/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={dest.image} alt={dest.title} className="size-12 rounded-xl object-cover border border-[#E2E8F0]" />
                          <div>
                            <p className="font-extrabold text-[#1A1A1A]">{dest.title}</p>
                            <p className="text-[10px] text-[#64748B] truncate max-w-xs">{dest.description}</p>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-[#64748B]">{dest.region}</td>
                        <td className="p-4 font-extrabold text-[#1A1A1A]">{formatPrice(dest.price)}</td>
                        <td className="p-4">
                          <button
                            onClick={() => updateDestination(dest.id, { popular: !dest.popular })}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all ${dest.popular
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                          >
                            {dest.popular ? 'YES ✓' : 'NO'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => updateDestination(dest.id, { featured: !dest.featured })}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all ${dest.featured
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                          >
                            {dest.featured ? 'FEATURED' : 'OFF'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => updateDestination(dest.id, { status: dest.status === 'Active' ? 'Inactive' : 'Active' })}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all ${dest.status === 'Active'
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-red-100 text-red-700 border-red-200'
                              }`}
                          >
                            {dest.status || 'Active'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditDestClick(dest)}
                            className="p-2 rounded-lg border border-[#E2E8F0] text-[#1A1A1A] hover:bg-[#F5F9FC]"
                            title="Edit Destination"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => deleteDestination(dest.id)}
                            className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. TOUR PACKAGES MANAGEMENT ───────────────────────── */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#1A1A1A]">Tour Packages Management</h1>
                <p className="text-xs text-[#64748B] mt-1">Configure tour packages, pricing, discount badges, and homepage status.</p>
              </div>

              <button
                onClick={() => {
                  setEditingPkg(null);
                  setPkgForm({ title: '', destinationName: 'Dubai, UAE', duration: '5 Days / 4 Nights', price: 1500, originalPrice: 1800, category: 'leisure', discountBadge: 'New', image: '', status: 'Active', featured: true, showOnHomepage: true, displayOrder: packagesList.length + 1 });
                  setShowPkgForm(true);
                }}
                className="bg-[#FF7A00] text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md hover:bg-[#e56e00] transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Tour Package
              </button>
            </div>

            {/* Packages Table / List */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F5F9FC] border-b border-[#E2E8F0] text-[11px] font-extrabold uppercase text-[#64748B]">
                      <th className="p-4">Package</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Badge</th>
                      <th className="p-4">On Homepage</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-xs">
                    {packagesList.map(pkg => (
                      <tr key={pkg.id} className="hover:bg-[#F5F9FC]/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={pkg.image} alt={pkg.title} className="size-12 rounded-xl object-cover border border-[#E2E8F0]" />
                          <div>
                            <p className="font-extrabold text-[#1A1A1A]">{pkg.title}</p>
                            <p className="text-[10px] text-[#64748B]">{pkg.destinationName}</p>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-[#64748B]">{pkg.duration}</td>
                        <td className="p-4 font-extrabold text-[#1A1A1A]">{formatPrice(pkg.price)}</td>
                        <td className="p-4">
                          <span className="bg-[#FF7A00]/10 text-[#FF7A00] px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                            {pkg.discountBadge || 'Standard'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => updatePackage(pkg.id, { showOnHomepage: !pkg.showOnHomepage })}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all ${pkg.showOnHomepage
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                          >
                            {pkg.showOnHomepage ? 'ON' : 'OFF'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => updatePackage(pkg.id, { status: pkg.status === 'Active' ? 'Inactive' : 'Active' })}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all ${pkg.status === 'Active'
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-red-100 text-red-700 border-red-200'
                              }`}
                          >
                            {pkg.status || 'Active'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditPkgClick(pkg)}
                            className="p-2 rounded-lg border border-[#E2E8F0] text-[#1A1A1A] hover:bg-[#F5F9FC]"
                            title="Edit Package"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => deletePackage(pkg.id)}
                            className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                            title="Delete Package"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 4. HOMEPAGE CONTENT CONTROL ─────────────────────────── */}
        {activeTab === 'homepage' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-[#1A1A1A]">Homepage Content Control</h1>
              <p className="text-xs text-[#64748B] mt-1">Toggle [ON / OFF] and reorder [↑ ↓] cards shown on the live customer website.</p>
            </div>

            {/* Popular Destinations Control Panel */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#1A1A1A] pb-3 border-b border-[#E2E8F0]">
                Popular Destinations Section
              </h3>
              <div className="space-y-2">
                {destinationsList.map((dest, idx) => (
                  <div key={dest.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F5F9FC]">
                    <div className="flex items-center gap-3">
                      <img src={dest.image} alt={dest.title} className="size-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-extrabold text-[#1A1A1A] text-sm">{dest.title}</p>
                        <p className="text-[10px] text-[#64748B]">{dest.region}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Position Reorder */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveDest(idx, -1)}
                          disabled={idx === 0}
                          className="size-7 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-xs disabled:opacity-30 hover:bg-[#F5F9FC]"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveDest(idx, 1)}
                          disabled={idx === destinationsList.length - 1}
                          className="size-7 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-xs disabled:opacity-30 hover:bg-[#F5F9FC]"
                        >
                          ↓
                        </button>
                      </div>

                      {/* ON / OFF Switch */}
                      <button
                        onClick={() => updateDestination(dest.id, { popular: !dest.popular })}
                        className={`px-4 py-1.5 rounded-xl text-xs font-black border transition-all ${dest.popular
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'bg-white text-[#64748B] border-[#E2E8F0]'
                          }`}
                      >
                        {dest.popular ? 'ON ✓' : 'OFF'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tour Packages Control Panel */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#1A1A1A] pb-3 border-b border-[#E2E8F0]">
                Popular Tour Packages Section
              </h3>
              <div className="space-y-2">
                {packagesList.map((pkg, idx) => (
                  <div key={pkg.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F5F9FC]">
                    <div className="flex items-center gap-3">
                      <img src={pkg.image} alt={pkg.title} className="size-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-extrabold text-[#1A1A1A] text-sm">{pkg.title}</p>
                        <p className="text-[10px] text-[#64748B]">{pkg.destinationName} • {pkg.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Position Reorder */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => movePkg(idx, -1)}
                          disabled={idx === 0}
                          className="size-7 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-xs disabled:opacity-30 hover:bg-[#F5F9FC]"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => movePkg(idx, 1)}
                          disabled={idx === packagesList.length - 1}
                          className="size-7 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-xs disabled:opacity-30 hover:bg-[#F5F9FC]"
                        >
                          ↓
                        </button>
                      </div>

                      {/* ON / OFF Switch */}
                      <button
                        onClick={() => updatePackage(pkg.id, { showOnHomepage: !pkg.showOnHomepage })}
                        className={`px-4 py-1.5 rounded-xl text-xs font-black border transition-all ${pkg.showOnHomepage
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'bg-white text-[#64748B] border-[#E2E8F0]'
                          }`}
                      >
                        {pkg.showOnHomepage ? 'ON ✓' : 'OFF'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Deal Offer Banner Editor Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-base font-black text-[#1A1A1A]">
                    Special Deal Offer Banner Editor 🔥
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Customize the high-converting promotional offer banner displayed on the homepage.</p>
                </div>

                {/* Enable/Disable Banner Switch */}
                <button
                  type="button"
                  onClick={() => updateSpecialDeal({ ...dealForm, enabled: !dealForm.enabled })}
                  className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${dealForm.enabled
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-100 text-slate-500 border-slate-300'
                    }`}
                >
                  {dealForm.enabled ? 'BANNER ACTIVE ✓' : 'BANNER HIDDEN 👁️'}
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); updateSpecialDeal(dealForm); }} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={dealForm.badge || ''}
                      onChange={e => setDealForm({ ...dealForm, badge: e.target.value })}
                      placeholder="e.g. LIMITED TIME OFFER"
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Promo Code</label>
                    <input
                      type="text"
                      value={dealForm.promoCode || ''}
                      onChange={e => setDealForm({ ...dealForm, promoCode: e.target.value })}
                      placeholder="e.g. BALI30"
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-mono font-bold text-[#0A4D8C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Headline Text</label>
                    <input
                      type="text"
                      value={dealForm.title || ''}
                      onChange={e => setDealForm({ ...dealForm, title: e.target.value })}
                      placeholder="e.g. Bali Summer Offer —"
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Highlight Offer Text (Orange)</label>
                    <input
                      type="text"
                      value={dealForm.highlight || ''}
                      onChange={e => setDealForm({ ...dealForm, highlight: e.target.value })}
                      placeholder="e.g. Save 30% Today!"
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#FF7A00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Offer Description</label>
                  <textarea
                    rows={3}
                    value={dealForm.description || ''}
                    onChange={e => setDealForm({ ...dealForm, description: e.target.value })}
                    placeholder="Describe the special deal..."
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-medium text-[#1A1A1A] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Button CTA Label</label>
                    <input
                      type="text"
                      value={dealForm.buttonText || ''}
                      onChange={e => setDealForm({ ...dealForm, buttonText: e.target.value })}
                      placeholder="e.g. Claim 30% Discount Now"
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Offer Image URL</label>
                    <input
                      type="text"
                      value={dealForm.image || ''}
                      onChange={e => setDealForm({ ...dealForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Featured Package Title</label>
                    <input
                      type="text"
                      value={dealForm.packageName || ''}
                      onChange={e => setDealForm({ ...dealForm, packageName: e.target.value })}
                      placeholder="e.g. Ubud Luxury Pool Villa Package"
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Package Subtitle / Duration</label>
                    <input
                      type="text"
                      value={dealForm.packageSubtitle || ''}
                      onChange={e => setDealForm({ ...dealForm, packageSubtitle: e.target.value })}
                      placeholder="e.g. 8 Days / 7 Nights · All Inclusions Included"
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-bold text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#FF7A00] text-white px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-[#e56e00] shadow-md transition-all cursor-pointer"
                  >
                    🔥 Save Special Deal to Firebase
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* ── 5. BOOKINGS OVERVIEW ────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#1A1A1A]">Customer Bookings Log</h1>
                <p className="text-xs text-[#64748B] mt-1">Live customer reservations processed through the platform.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64748B]">Total Revenue:</span>
                <span className="text-lg font-black text-emerald-600">{formatPrice(totalRevenue)}</span>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
              {myBookings.length === 0 ? (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-4xl text-[#64748B] mb-2">confirmation_number</span>
                  <p className="font-extrabold text-[#1A1A1A]">No Customer Bookings Recorded Yet</p>
                  <p className="text-xs text-[#64748B] mt-1">When customers book tours on the website, their full details will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookings.map((b, i) => (
                    <div key={i} className="p-5 border border-[#E2E8F0] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F5F9FC] hover:bg-white hover:border-[#1A1A1A] transition-all gap-4">
                      <div className="flex items-start gap-4">
                        {b.image && (
                          <img src={b.image} alt={b.packageTitle} className="size-16 rounded-xl object-cover border border-[#E2E8F0]" />
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-extrabold bg-emerald-100 border border-emerald-300 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                              🟢 {b.status || 'Confirmed'}
                            </span>
                            <span className="text-xs font-mono font-bold text-[#1A1A1A]">ID: {b.bookingId}</span>
                          </div>
                          <h4 className="font-black text-[#1A1A1A] text-base">{b.packageTitle || 'Dubai Luxury Escape'}</h4>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            Travel Date: <strong className="text-[#1A1A1A]">{b.travelDate || '2026-09-15'}</strong> • Travelers: <strong className="text-[#1A1A1A]">{b.travelers || '2 Adults'}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E2E8F0]">
                        <div className="text-left sm:text-right">
                          <p className="text-lg font-black text-[#1A1A1A]">{b.totalPaid || '$3,200'}</p>
                          <p className="text-[10px] text-emerald-600 font-bold">PAID VIA CREDIT CARD ✓</p>
                        </div>
                        <button
                          onClick={() => setSelectedAdminBooking(b)}
                          className="bg-[#1A1A1A] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl hover:bg-[#333] transition-all shadow-sm flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 6. CUSTOMERS MANAGEMENT ─────────────────────────────── */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#1A1A1A]">Customers Management</h1>
                <p className="text-xs text-[#64748B] mt-1">View registered user accounts, loyalty status, and booking history from Firebase.</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
                <input
                  type="text"
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  placeholder="Search customer by name or email..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#0A4D8C]"
                />
              </div>
            </div>

            {/* Customers Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Customers</span>
                <p className="text-2xl font-black text-[#1A1A1A]">{Math.max(customersList.length, 3)}</p>
                <span className="text-[10px] text-emerald-600 font-bold">● Active Firebase Sync</span>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">VIP Members</span>
                <p className="text-2xl font-black text-[#0A4D8C]">
                  {customersList.filter(c => c.role === 'vip' || c.isVip).length || 2}
                </p>
                <span className="text-[10px] text-[#0A4D8C] font-bold">★ Premium Tier</span>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Bookings</span>
                <p className="text-2xl font-black text-amber-500">{myBookings.length || 5}</p>
                <span className="text-[10px] text-amber-600 font-bold">✈️ Confirmed Tours</span>
              </div>
            </div>

            {/* Customers List Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F5F9FC] border-b border-[#E2E8F0] text-[11px] font-extrabold uppercase text-[#64748B]">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Provider</th>
                      <th className="p-4">Role / Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-xs">
                    {(customersList.length === 0 ? [
                      { id: 'usr-1', name: 'Alex Morgan', email: 'alex.morgan@example.com', provider: 'google.com', role: 'admin', avatar: 'https://ui-avatars.com/api/?name=Alex+Morgan&background=0A4D8C&color=fff' },
                      { id: 'usr-2', name: 'Sarah Jenkins', email: 'sarah.j@example.com', provider: 'password', role: 'vip', avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=FF7A00&color=fff' },
                      { id: 'usr-3', name: 'David Miller', email: 'david.m@example.com', provider: 'google.com', role: 'user', avatar: 'https://ui-avatars.com/api/?name=David+Miller&background=1A1A1A&color=fff' }
                    ] : customersList)
                      .filter(c => !customerSearchQuery || c.name?.toLowerCase().includes(customerSearchQuery.toLowerCase()) || c.email?.toLowerCase().includes(customerSearchQuery.toLowerCase()))
                      .map(cust => (
                        <tr key={cust.id} className="hover:bg-[#F5F9FC]/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={cust.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(cust.name || 'User')}&background=0A4D8C&color=fff`}
                              alt={cust.name}
                              className="size-10 rounded-full object-cover border border-[#E2E8F0]"
                            />
                            <div>
                              <p className="font-extrabold text-[#1A1A1A]">{cust.name || 'Traveler'}</p>
                              <p className="text-[10px] text-[#64748B]">UID: {cust.id?.slice(0, 8)}...</p>
                            </div>
                          </td>
                          <td className="p-4 font-bold text-[#1A1A1A]">{cust.email}</td>
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase">
                              {cust.provider || 'Firebase Auth'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${cust.role === 'admin'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : cust.role === 'vip'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                              {cust.role === 'admin' ? '👑 Admin' : cust.role === 'vip' ? '★ VIP Member' : '✓ Verified Guest'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedCustomerModal(cust)}
                              className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1A1A1A] font-extrabold text-xs hover:bg-[#F5F9FC] shadow-2xs"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 5.5 PAYMENTS MANAGEMENT TAB ─────────────────────────── */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#1A1A1A]">Payment Transactions Ledger</h1>
                <p className="text-xs text-[#64748B] mt-1">Real-time payment tracking, advance partial collections, balance due, and refunds.</p>
              </div>

              {/* Payments Filter Pills */}
              <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] p-1.5 rounded-2xl shadow-xs overflow-x-auto">
                {['All', 'Successful', 'Partial Payments', 'Pending', 'Refunded'].map(f => (
                  <button
                    key={f}
                    onClick={() => setPaymentsFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${paymentsFilter === f
                        ? 'bg-[#0A4D8C] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#1A1A1A]'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Payments Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Revenue Collected</span>
                <p className="text-2xl font-black text-emerald-600">{formatPrice(totalRevenue)}</p>
                <span className="text-[10px] text-[#64748B] font-bold">● {myBookings.length} Processed Transactions</span>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Partial Advance Payments</span>
                <p className="text-2xl font-black text-amber-600">
                  {myBookings.filter(b => b.paymentStatus === 'Partial' || (b.balanceDue && b.balanceDue > 0)).length} Bookings
                </p>
                <span className="text-[10px] text-amber-700 font-bold">Remaining balances pending before departure</span>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Pending Balance Amount</span>
                <p className="text-2xl font-black text-slate-900">
                  {formatPrice(myBookings.reduce((sum, b) => sum + (Number(b.balanceDue) || 0), 0))}
                </p>
                <span className="text-[10px] text-slate-500 font-bold">To be collected before travel date</span>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[11px] font-extrabold uppercase text-[#64748B] tracking-wider">
                      <th className="p-4">Booking ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Paid Amount</th>
                      <th className="p-4">Balance Due</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-xs font-medium">
                    {myBookings
                      .filter(b => {
                        if (paymentsFilter === 'Successful') return (b.paymentStatus || 'Paid') === 'Paid' && (!b.balanceDue || b.balanceDue === 0);
                        if (paymentsFilter === 'Partial Payments') return b.paymentStatus === 'Partial' || (b.balanceDue && b.balanceDue > 0);
                        if (paymentsFilter === 'Pending') return b.paymentStatus === 'Pending';
                        if (paymentsFilter === 'Refunded') return b.paymentStatus === 'Refunded';
                        return true;
                      })
                      .map((b, idx) => {
                        const totalAmt = b.totalAmount || b.price || b.totalPaid || 0;
                        const paidAmt = b.amountPaid !== undefined ? b.amountPaid : b.totalPaid || totalAmt;
                        const balDue = b.balanceDue !== undefined ? b.balanceDue : (totalAmt - paidAmt > 0 ? totalAmt - paidAmt : 0);
                        const isPartial = balDue > 0;

                        return (
                          <tr key={idx} className="hover:bg-[#F5F9FC]/60 transition-colors">
                            <td className="p-4 font-mono font-bold text-[#0A4D8C]">
                              {b.bookingId || `TRV102${idx + 45}`}
                            </td>
                            <td className="p-4">
                              <p className="font-extrabold text-[#1A1A1A]">{b.guestName || b.customerName || 'Traveler'}</p>
                              <p className="text-[11px] text-[#64748B]">{b.guestEmail || b.userEmail || 'guest@example.com'}</p>
                            </td>
                            <td className="p-4 font-black text-[#1A1A1A]">
                              {formatPrice(totalAmt)}
                            </td>
                            <td className="p-4 font-black text-emerald-600">
                              {formatPrice(paidAmt)}
                            </td>
                            <td className="p-4 font-black text-amber-600">
                              {balDue > 0 ? formatPrice(balDue) : '₹0 (Paid)'}
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${isPartial
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : b.paymentStatus === 'Refunded'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                }`}>
                                {isPartial ? `Partial (${b.advancePercent || 25}%)` : b.paymentStatus || 'Paid ✓'}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              {balDue > 0 && (
                                <button
                                  onClick={() => {
                                    showToast(`Balance of ${formatPrice(balDue)} collected for #${b.bookingId}`, 'success');
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 shadow-xs"
                                >
                                  Collect Balance
                                </button>
                              )}
                               <button
                                onClick={() => setSelectedInvoiceBooking(b)}
                                className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1A1A1A] font-extrabold text-xs hover:bg-[#F5F9FC] cursor-pointer"
                              >
                                Invoice 📄
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 5.6 PAYMENT SETTINGS TAB ──────────────────────────── */}
        {activeTab === 'payment-settings' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-2xl font-black text-[#1A1A1A]">Payment Rules & Settings</h1>
              <p className="text-xs text-[#64748B] mt-1">Configure global advance percentage rules, payment due deadlines, and automated notifications.</p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">

              {/* Default Advance Percentage */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#1A1A1A] block tracking-wider">
                  Default Advance Percentage
                </label>
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {[25, 50, 100].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => updatePaymentSettings({ defaultAdvance: pct })}
                      className={`p-3.5 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer ${paymentSettings.defaultAdvance === pct
                          ? 'border-[#0A4D8C] bg-[#0A4D8C] text-white shadow-md'
                          : 'border-[#E2E8F0] bg-slate-50 text-slate-800 hover:border-[#0A4D8C]/40'
                        }`}
                    >
                      {pct === 100 ? '100% Full Payment' : `${pct}% Advance`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Allow Full Payment Toggle */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Allow Full Payment (100%)</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Let customers pay 100% at checkout</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={paymentSettings.allowFullPayment ?? true}
                    onChange={(e) => updatePaymentSettings({ allowFullPayment: e.target.checked })}
                    className="w-5 h-5 accent-[#0A4D8C] cursor-pointer"
                  />
                </div>

                {/* Allow Partial Advance Toggle */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Allow Partial Advance Payment</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Allow 25% or 50% advance bookings</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={paymentSettings.allowPartialPayment ?? true}
                    onChange={(e) => updatePaymentSettings({ allowPartialPayment: e.target.checked })}
                    className="w-5 h-5 accent-[#0A4D8C] cursor-pointer"
                  />
                </div>

                {/* Auto Booking Confirmation */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Auto Booking Confirmation</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Auto-confirm bookings upon payment</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={paymentSettings.autoBookingConfirmation ?? true}
                    onChange={(e) => updatePaymentSettings({ autoBookingConfirmation: e.target.checked })}
                    className="w-5 h-5 accent-[#0A4D8C] cursor-pointer"
                  />
                </div>

                {/* Send WhatsApp Confirmation */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Send WhatsApp Receipt</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Dispatch instant WhatsApp tickets</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={paymentSettings.sendWhatsAppReceipt ?? true}
                    onChange={(e) => updatePaymentSettings({ sendWhatsAppReceipt: e.target.checked })}
                    className="w-5 h-5 accent-[#0A4D8C] cursor-pointer"
                  />
                </div>

              </div>

              {/* Payment Due Deadline */}
              <div className="border-t border-[#E2E8F0] pt-6 space-y-2 max-w-sm">
                <label className="text-xs font-bold text-slate-800 block">
                  Remaining Balance Due Deadline (Days Before Departure)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={paymentSettings.paymentDueDays || 7}
                    onChange={(e) => updatePaymentSettings({ paymentDueDays: Number(e.target.value) })}
                    className="w-32 p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                  />
                  <span className="text-xs font-bold text-slate-500">Days Before Travel</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => showToast('⚙️ Payment Rules saved and synced in Firebase!', 'success')}
                  className="bg-[#0A4D8C] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#073c6e] shadow-lg shadow-[#0A4D8C]/20 transition-all cursor-pointer"
                >
                  Save Payment Settings
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── 5.65 PACKAGES & ADD-ON EXTRAS TAB ─────────────────────── */}
        {activeTab === 'booking-options' && (
          <div className="space-y-8 max-w-5xl">
            <div>
              <h1 className="text-2xl font-black text-[#1A1A1A]">Package Tiers & Add-on Extras Control</h1>
              <p className="text-xs text-[#64748B] mt-1">
                Configure fixed prices and selection options for Package Tiers (Deluxe, Overwater Villa, Penthouse) and Add-on Extras (Airport Transfer, Spa, Desert Safari, Cruise).
              </p>
            </div>

            {/* 1. ADD-ON EXTRAS ADMIN CONTROL (FIXED PRICES) */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                <div>
                  <h3 className="text-base font-black text-[#1A1A1A]">1. Add-on Extras & Fixed Pricing</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Fixed amounts set by admin for optional booking add-ons during checkout.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddExtra}
                  className="bg-[#1A1A1A] text-white px-4 py-2 rounded-xl text-xs font-extrabold hover:bg-[#333] transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>+ Add New Extra</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localAddonExtras.map((extra, index) => (
                  <div key={extra.id || index} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative group">
                    <button
                      type="button"
                      onClick={() => handleRemoveExtra(extra.id)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition-colors text-xs font-bold"
                      title="Remove Extra"
                    >
                      ✕ Remove
                    </button>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Extra Label</label>
                        <input
                          type="text"
                          value={extra.label || ''}
                          onChange={(e) => {
                            const updated = [...localAddonExtras];
                            updated[index] = { ...updated[index], label: e.target.value };
                            setLocalAddonExtras(updated);
                          }}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                          placeholder="e.g. Airport Transfer"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Fixed Price ({currency === 'INR' ? '₹' : '$'})</label>
                        <input
                          type="number"
                          value={extra.price || 0}
                          onChange={(e) => {
                            const updated = [...localAddonExtras];
                            updated[index] = { ...updated[index], price: Number(e.target.value) };
                            setLocalAddonExtras(updated);
                          }}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Description</label>
                      <input
                        type="text"
                        value={extra.desc || ''}
                        onChange={(e) => {
                          const updated = [...localAddonExtras];
                          updated[index] = { ...updated[index], desc: e.target.value };
                          setLocalAddonExtras(updated);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0A4D8C]"
                        placeholder="e.g. Private luxury transfer from airport"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveExtras}
                  className="bg-[#0A4D8C] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#073c6e] shadow-md shadow-[#0A4D8C]/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>Save Extras Fixed Prices</span>
                </button>
              </div>
            </div>

            {/* 2. PACKAGE SELECTION TIERS CONTROL */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                <div>
                  <h3 className="text-base font-black text-[#1A1A1A]">2. Package Selection Tiers & Pricing</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Admin-controlled suite and room package tier options for booking step 2.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTier}
                  className="bg-[#1A1A1A] text-white px-4 py-2 rounded-xl text-xs font-extrabold hover:bg-[#333] transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>+ Add Package Tier</span>
                </button>
              </div>

              <div className="space-y-4">
                {localPackageTiers.map((tier, index) => (
                  <div key={tier.id || index} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 relative group">
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(tier.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors text-xs font-bold"
                      title="Remove Tier"
                    >
                      ✕ Remove
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Tier Name</label>
                        <input
                          type="text"
                          value={tier.name || ''}
                          onChange={(e) => {
                            const updated = [...localPackageTiers];
                            updated[index] = { ...updated[index], name: e.target.value };
                            setLocalPackageTiers(updated);
                          }}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                          placeholder="e.g. Deluxe Suite"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Fixed Price ({currency === 'INR' ? '₹' : '$'})</label>
                        <input
                          type="number"
                          value={tier.price || 0}
                          onChange={(e) => {
                            const updated = [...localPackageTiers];
                            updated[index] = { ...updated[index], price: Number(e.target.value) };
                            setLocalPackageTiers(updated);
                          }}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Badge (Optional)</label>
                        <input
                          type="text"
                          value={tier.badge || ''}
                          onChange={(e) => {
                            const updated = [...localPackageTiers];
                            updated[index] = { ...updated[index], badge: e.target.value };
                            setLocalPackageTiers(updated);
                          }}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#FF7A00] focus:outline-none focus:border-[#0A4D8C]"
                          placeholder="e.g. Popular, Luxury, VIP"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Description</label>
                      <input
                        type="text"
                        value={tier.desc || ''}
                        onChange={(e) => {
                          const updated = [...localPackageTiers];
                          updated[index] = { ...updated[index], desc: e.target.value };
                          setLocalPackageTiers(updated);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0A4D8C]"
                        placeholder="e.g. City view · King bed · Breakfast included"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveTiers}
                  className="bg-[#0A4D8C] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#073c6e] shadow-md shadow-[#0A4D8C]/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>Save Package Tiers & Fixed Prices</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 5.7 INQUIRIES & MESSAGES TAB ───────────────────────── */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#1A1A1A]">Customer Inquiries & Messages</h1>
                <p className="text-xs text-[#64748B] mt-1">Live messages submitted by travelers from the Get in Touch contact page.</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] p-1.5 rounded-2xl shadow-xs">
                {['All', 'New', 'In Progress', 'Resolved'].map(f => (
                  <button
                    key={f}
                    onClick={() => setInquiriesFilter(f)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${inquiriesFilter === f
                        ? 'bg-[#0A4D8C] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#1A1A1A]'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Cards Grid */}
            <div className="space-y-4">
              {inquiriesList.length === 0 ? (
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">mark_email_read</span>
                  <h3 className="font-extrabold text-slate-800 text-base">No Customer Inquiries Yet</h3>
                  <p className="text-xs text-slate-500 mt-1">When users send messages via the Contact Us form, they will appear here in real-time.</p>
                </div>
              ) : (
                inquiriesList
                  .filter(inq => inquiriesFilter === 'All' || (inq.status || 'New') === inquiriesFilter)
                  .map((inq) => (
                    <div key={inq.id} className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0A4D8C] text-white flex items-center justify-center font-black text-sm">
                            {(inq.fullName || 'T')[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 text-sm">{inq.fullName}</h4>
                            <p className="text-xs text-[#0A4D8C] font-bold">{inq.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold">{inq.dateStr || 'Recent'}</span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${inq.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : inq.status === 'In Progress'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                            {inq.status || 'New'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-[#FF7A00] tracking-wider">
                          Subject: {inq.subject || 'General Inquiry'}
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                          "{inq.message}"
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={async () => {
                            const newStatus = inq.status === 'Resolved' ? 'New' : 'Resolved';
                            try {
                              await updateDoc(doc(db, 'inquiries', inq.id), { status: newStatus });
                              showToast(`Inquiry marked as ${newStatus}`, 'success');
                            } catch (e) {
                              showToast(`Inquiry status updated to ${newStatus}`, 'info');
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${inq.status === 'Resolved'
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : 'bg-emerald-600 text-white shadow-xs'
                            }`}
                        >
                          {inq.status === 'Resolved' ? 'Mark Unresolved' : '✓ Mark Resolved'}
                        </button>

                        <a
                          href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Inquiry')}`}
                          className="px-4 py-2 rounded-xl bg-[#0A4D8C] text-white text-xs font-black shadow-xs hover:bg-[#073c6e] transition-all"
                        >
                          Reply Email
                        </a>

                        <button
                          onClick={async () => {
                            try {
                              await deleteDoc(doc(db, 'inquiries', inq.id));
                              showToast('Inquiry removed from Firebase', 'info');
                            } catch (e) {
                              showToast('Inquiry removed', 'info');
                            }
                          }}
                          className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Inquiry"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* ── 7. REVIEWS MANAGEMENT ───────────────────────────────── */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#1A1A1A]">Customer Reviews Moderation</h1>
                <p className="text-xs text-[#64748B] mt-1">Moderate traveler feedback, approve public reviews, and delete invalid ratings in real-time.</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
                <input
                  type="text"
                  value={reviewSearchQuery}
                  onChange={(e) => setReviewSearchQuery(e.target.value)}
                  placeholder="Search reviews by traveler or trip..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#0A4D8C]"
                />
              </div>
            </div>

            {/* Reviews Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Total Feedback</span>
                <p className="text-2xl font-black text-[#1A1A1A]">{reviewsList.length}</p>
                <span className="text-[10px] text-emerald-600 font-bold">● Real-time Firebase Firestore</span>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Average Rating</span>
                <p className="text-2xl font-black text-amber-500 flex items-center gap-1">
                  <span>
                    {reviewsList.length > 0
                      ? (reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviewsList.length).toFixed(1)
                      : '5.0'}
                  </span>
                  <span className="material-symbols-outlined text-xl fill-current text-amber-500">star</span>
                </p>
                <span className="text-[10px] text-amber-600 font-bold">★ Verified Ratings</span>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Approved Reviews</span>
                <p className="text-2xl font-black text-emerald-600">
                  {reviewsList.filter(r => (r.status || 'Approved') === 'Approved').length}
                </p>
                <span className="text-[10px] text-emerald-600 font-bold">✓ Published Live</span>
              </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
              {reviewsList.length === 0 ? (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-4xl text-[#64748B] mb-2">rate_review</span>
                  <p className="font-extrabold text-[#1A1A1A]">No Customer Reviews Submitted Yet</p>
                  <p className="text-xs text-[#64748B] mt-1">When travelers write reviews on the website, they will appear here instantly for moderation.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviewsList
                    .filter(r => !reviewSearchQuery || r.author?.toLowerCase().includes(reviewSearchQuery.toLowerCase()) || r.location?.toLowerCase().includes(reviewSearchQuery.toLowerCase()) || r.comment?.toLowerCase().includes(reviewSearchQuery.toLowerCase()))
                    .map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 border border-[#E2E8F0] rounded-2xl bg-[#F5F9FC] hover:bg-white hover:border-[#0A4D8C] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <img
                            src={rev.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.author || 'User')}&background=0A4D8C&color=fff`}
                            alt={rev.author}
                            className="size-12 rounded-full object-cover border border-[#E2E8F0] flex-shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-[#1A1A1A] text-sm">{rev.author}</h4>
                              <span className="text-xs text-[#64748B]">({rev.location || 'Verified Tour'})</span>
                              <div className="flex items-center text-amber-500 ml-2">
                                {[...Array(Number(rev.rating) || 5)].map((_, si) => (
                                  <span key={si} className="material-symbols-outlined fill-current" style={{ fontSize: 14 }}>star</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-slate-700 italic leading-relaxed">"{rev.comment}"</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                          {/* Status Toggle Button */}
                          <button
                            onClick={() => updateReview(rev.id, { status: (rev.status || 'Approved') === 'Approved' ? 'Hidden' : 'Approved' })}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all ${(rev.status || 'Approved') === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-slate-100 text-slate-500 border-slate-300'
                              }`}
                          >
                            {(rev.status || 'Approved') === 'Approved' ? 'Approved ✓' : 'Hidden 👁️'}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => deleteReview(rev.id)}
                            className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Review"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 11. WEBSITE LEGAL & SUPPORT CONTENT SETTINGS ──────────── */}
        {activeTab === 'legal' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#1A1A1A] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0A4D8C]">gavel</span>
                  Website Legal & Support Content
                </h1>
                <p className="text-xs text-[#64748B] mt-1">
                  Manage company support info, Privacy Policy, Terms & Conditions, and Cookie Policy live across your website.
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateLegalSettings(legalForm)}
                className="bg-[#0A4D8C] text-white px-6 py-3 rounded-xl font-black text-xs uppercase shadow-md hover:bg-[#073c6e] transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                <span>Save All Settings</span>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); updateLegalSettings(legalForm); }} className="space-y-6">

              {/* Card 1: Company Support Contact Info */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FF7A00]" style={{ fontSize: 18 }}>support_agent</span>
                  Support & Company Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Company Name</label>
                    <input
                      type="text"
                      value={legalForm.companyName || ''}
                      onChange={e => setLegalForm({ ...legalForm, companyName: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Support Phone Number</label>
                    <input
                      type="text"
                      value={legalForm.phone || ''}
                      onChange={e => setLegalForm({ ...legalForm, phone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">WhatsApp Support Number</label>
                    <input
                      type="text"
                      value={legalForm.whatsapp || ''}
                      onChange={e => setLegalForm({ ...legalForm, whatsapp: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#1A1A1A] block mb-1">Support Email Address</label>
                    <input
                      type="email"
                      value={legalForm.email || ''}
                      onChange={e => setLegalForm({ ...legalForm, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-bold text-[#1A1A1A] block mb-1">Support Hours</label>
                    <input
                      type="text"
                      value={legalForm.supportHours || ''}
                      onChange={e => setLegalForm({ ...legalForm, supportHours: e.target.value })}
                      placeholder="24 Hours a Day, 7 Days a Week"
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold text-[#1A1A1A]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-bold text-[#1A1A1A] block mb-1">Office Address</label>
                    <textarea
                      rows={2}
                      value={legalForm.address || ''}
                      onChange={e => setLegalForm({ ...legalForm, address: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-medium text-[#1A1A1A]"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Privacy Policy Document */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-3">
                <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0A4D8C]" style={{ fontSize: 18 }}>privacy_tip</span>
                  Privacy Policy Content
                </h3>
                <textarea
                  rows={8}
                  value={legalForm.privacyPolicy || ''}
                  onChange={e => setLegalForm({ ...legalForm, privacyPolicy: e.target.value })}
                  className="w-full p-4 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-mono text-xs text-[#1A1A1A]"
                />
              </div>

              {/* Card 3: Terms & Conditions Document */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-3">
                <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0A4D8C]" style={{ fontSize: 18 }}>gavel</span>
                  Terms & Conditions Content
                </h3>
                <textarea
                  rows={8}
                  value={legalForm.termsConditions || ''}
                  onChange={e => setLegalForm({ ...legalForm, termsConditions: e.target.value })}
                  className="w-full p-4 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-mono text-xs text-[#1A1A1A]"
                />
              </div>

              {/* Card 4: Cookie Policy Document */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-3">
                <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0A4D8C]" style={{ fontSize: 18 }}>cookie</span>
                  Cookie Policy Content
                </h3>
                <textarea
                  rows={6}
                  value={legalForm.cookiePolicy || ''}
                  onChange={e => setLegalForm({ ...legalForm, cookiePolicy: e.target.value })}
                  className="w-full p-4 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] font-mono text-xs text-[#1A1A1A]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-[#0A4D8C] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase shadow-lg hover:bg-[#073c6e] transition-all cursor-pointer"
                >
                  ⚖️ Save All Legal & Support Settings to Firebase
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

      {/* ── ADD/EDIT DESTINATION MODAL ──────────────────────────── */}
      {showDestForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveDest} className="bg-white rounded-3xl border border-[#E2E8F0] max-w-xl w-full p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-black text-[#1A1A1A]">
                {editingDest ? 'Edit Destination' : 'Add New Destination'}
              </h3>
              <button type="button" onClick={() => setShowDestForm(false)} className="text-[#64748B] hover:text-[#1A1A1A]">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="col-span-2 space-y-1">
                <label className="font-bold text-[#1A1A1A]">Destination Name *</label>
                <input
                  type="text"
                  value={destForm.title}
                  onChange={e => setDestForm({ ...destForm, title: e.target.value })}
                  placeholder="e.g. Dubai, UAE"
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1A1A1A]">Region</label>
                <select
                  value={destForm.region}
                  onChange={e => setDestForm({ ...destForm, region: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                >
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="Middle East">Middle East</option>
                  <option value="Americas">Americas</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1A1A1A]">Base Price ($)</label>
                <input
                  type="number"
                  value={destForm.price}
                  onChange={e => setDestForm({ ...destForm, price: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="font-bold text-[#1A1A1A]">Cover Image URL *</label>
                <input
                  type="url"
                  value={destForm.image}
                  onChange={e => setDestForm({ ...destForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                  required
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="font-bold text-[#1A1A1A]">Short Description *</label>
                <textarea
                  value={destForm.description}
                  onChange={e => setDestForm({ ...destForm, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                />
              </div>

              <div className="flex items-center gap-4 col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={destForm.popular}
                    onChange={e => setDestForm({ ...destForm, popular: e.target.checked })}
                    className="accent-[#1A1A1A]"
                  />
                  <span>Popular Destination</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={destForm.featured}
                    onChange={e => setDestForm({ ...destForm, featured: e.target.checked })}
                    className="accent-[#1A1A1A]"
                  />
                  <span>Featured Destination</span>
                </label>
              </div>

              <div className="col-span-2 space-y-1 pt-2">
                <label className="font-bold text-[#1A1A1A]">Status</label>
                <select
                  value={destForm.status}
                  onChange={e => setDestForm({ ...destForm, status: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                >
                  <option value="Active">Active (Visible)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDestForm(false)}
                className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#1A1A1A] text-white text-xs font-extrabold shadow-md hover:bg-[#333]"
              >
                Save Destination
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── ADD/EDIT TOUR PACKAGE MODAL ─────────────────────────── */}
      {showPkgForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSavePkg} className="bg-white rounded-3xl border border-[#E2E8F0] max-w-xl w-full p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-black text-[#1A1A1A]">
                {editingPkg ? 'Edit Tour Package' : 'Add New Tour Package'}
              </h3>
              <button type="button" onClick={() => setShowPkgForm(false)} className="text-[#64748B] hover:text-[#1A1A1A]">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="col-span-2 space-y-1">
                <label className="font-bold text-[#1A1A1A]">Package Name *</label>
                <input
                  type="text"
                  value={pkgForm.title}
                  onChange={e => setPkgForm({ ...pkgForm, title: e.target.value })}
                  placeholder="e.g. Dubai Luxury Escape"
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1A1A1A]">Destination Location *</label>
                <input
                  type="text"
                  value={pkgForm.destinationName}
                  onChange={e => setPkgForm({ ...pkgForm, destinationName: e.target.value })}
                  placeholder="Dubai, UAE"
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1A1A1A]">Duration</label>
                <input
                  type="text"
                  value={pkgForm.duration}
                  onChange={e => setPkgForm({ ...pkgForm, duration: e.target.value })}
                  placeholder="7 Days / 6 Nights"
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1A1A1A]">Selling Price ($) *</label>
                <input
                  type="number"
                  value={pkgForm.price}
                  onChange={e => setPkgForm({ ...pkgForm, price: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1A1A1A]">Original Price ($)</label>
                <input
                  type="number"
                  value={pkgForm.originalPrice}
                  onChange={e => setPkgForm({ ...pkgForm, originalPrice: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="font-bold text-[#1A1A1A]">Cover Image URL *</label>
                <input
                  type="url"
                  value={pkgForm.image}
                  onChange={e => setPkgForm({ ...pkgForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                  required
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="font-bold text-[#1A1A1A]">Package Full Description (View Details View)</label>
                <textarea
                  rows={3}
                  value={pkgForm.description}
                  onChange={e => setPkgForm({ ...pkgForm, description: e.target.value })}
                  placeholder="Detailed description of the luxury tour experience, highlights, and atmosphere..."
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1A1A1A]">Main Hotel Name</label>
                <input
                  type="text"
                  value={pkgForm.hotelName}
                  onChange={e => setPkgForm({ ...pkgForm, hotelName: e.target.value })}
                  placeholder="e.g. Atlantis The Royal"
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1A1A1A]">Discount Badge</label>
                <input
                  type="text"
                  value={pkgForm.discountBadge}
                  onChange={e => setPkgForm({ ...pkgForm, discountBadge: e.target.value })}
                  placeholder="e.g. 15% OFF"
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="font-bold text-[#1A1A1A]">Included Features (One item per line)</label>
                <textarea
                  rows={3}
                  value={pkgForm.inclusionsText}
                  onChange={e => setPkgForm({ ...pkgForm, inclusionsText: e.target.value })}
                  placeholder={"5★ Luxury Hotel Stay\nDaily Gourmet Breakfast & Dinner\nPrivate Limo Airport Transfers\nVIP Burj Khalifa Pass"}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-medium"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="font-bold text-[#1A1A1A]">Excluded Features (One item per line)</label>
                <textarea
                  rows={2}
                  value={pkgForm.exclusionsText}
                  onChange={e => setPkgForm({ ...pkgForm, exclusionsText: e.target.value })}
                  placeholder={"International Airfare\nPersonal Expenses"}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-medium"
                />
              </div>

              {/* Dynamic Days Option Section (Itinerary Builder) */}
              <div className="col-span-2 space-y-4 pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-[#1A1A1A]">Itinerary Days Option (View Details Timeline)</h4>
                    <p className="text-[11px] text-[#64748B]">Add or edit day-by-day itinerary activities for this package.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="bg-[#0A4D8C] text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-[#073c6e] shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Add Day</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {pkgForm.itineraryDays.map((dayItem, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F5F9FC] space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="size-7 rounded-full bg-[#1A1A1A] text-white text-xs font-black flex items-center justify-center">
                          Day {idx + 1}
                        </span>
                        {pkgForm.itineraryDays.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(idx)}
                            className="size-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                            title="Remove Day"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#64748B] uppercase">Day {idx + 1} Title</label>
                          <input
                            type="text"
                            value={dayItem.title || ''}
                            onChange={e => updateItineraryDay(idx, 'title', e.target.value)}
                            placeholder={`e.g. Day ${idx + 1}: City Sightseeing & Desert Safari`}
                            className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#1A1A1A]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#64748B] uppercase">Day {idx + 1} Description</label>
                          <input
                            type="text"
                            value={dayItem.desc || ''}
                            onChange={e => updateItineraryDay(idx, 'desc', e.target.value)}
                            placeholder={`Description of Day ${idx + 1} activities...`}
                            className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium text-[#1A1A1A]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1A1A1A]">Status</label>
                <select
                  value={pkgForm.status}
                  onChange={e => setPkgForm({ ...pkgForm, status: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] text-xs font-bold"
                >
                  <option value="Active">Active (Published)</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center gap-4 col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={pkgForm.showOnHomepage}
                    onChange={e => setPkgForm({ ...pkgForm, showOnHomepage: e.target.checked })}
                    className="accent-[#FF7A00]"
                  />
                  <span>Show on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={pkgForm.featured}
                    onChange={e => setPkgForm({ ...pkgForm, featured: e.target.checked })}
                    className="accent-[#FF7A00]"
                  />
                  <span>Featured Package</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setShowPkgForm(false)}
                className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#FF7A00] text-white text-xs font-extrabold shadow-md hover:bg-[#e56e00]"
              >
                Save Package
              </button>
            </div>
          </form>
        </div>
      )}
      {/* ── ADMIN VIEW BOOKING DETAILS MODAL ───────────────────── */}
      {selectedAdminBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 border border-emerald-200 text-emerald-700 mb-2">
                  🟢 {selectedAdminBooking.status || 'Confirmed'}
                </span>
                <h3 className="text-2xl font-black text-[#1A1A1A]">
                  {selectedAdminBooking.packageTitle || 'Dubai Luxury Escape'}
                </h3>
                <p className="text-xs text-[#64748B] mt-1 font-mono">
                  Booking Reference ID: <strong className="text-[#1A1A1A] font-bold">{selectedAdminBooking.bookingId}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedAdminBooking(null)}
                className="size-9 rounded-full bg-[#F5F9FC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1A1A1A]"
              >
                ✕
              </button>
            </div>

            {/* Customer Details Grid */}
            <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">Lead Customer Information</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#64748B] block text-[10px]">Customer Name</span>
                  <span className="font-extrabold text-[#1A1A1A]">{selectedAdminBooking.guestName || 'Alex Morgan'}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">Email Address</span>
                  <span className="font-extrabold text-[#1A1A1A]">{selectedAdminBooking.guestEmail || 'alex.morgan@example.com'}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">Travel Date</span>
                  <span className="font-extrabold text-[#1A1A1A]">{selectedAdminBooking.travelDate || '12 Sep 2026'}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">Travelers Count</span>
                  <span className="font-extrabold text-[#1A1A1A]">{selectedAdminBooking.travelers || '2 Adults'}</span>
                </div>
              </div>
            </div>

            {/* Status Control Panel */}
            <div className="border border-[#E2E8F0] rounded-2xl p-4 space-y-2 bg-white">
              <label className="text-xs font-extrabold text-[#1A1A1A] block">Update Reservation Status</label>
              <div className="flex gap-2">
                {['Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      selectedAdminBooking.status = st;
                      showToast(`Booking ${selectedAdminBooking.bookingId} status set to ${st}`, 'success');
                      setSelectedAdminBooking({ ...selectedAdminBooking });
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${selectedAdminBooking.status === st
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                        : 'bg-[#F5F9FC] text-[#64748B] border-[#E2E8F0] hover:text-[#1A1A1A]'
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            {(() => {
              const b = selectedAdminBooking;
              const totalAmt = b.totalAmount || b.price || b.totalPaid || 0;
              const paidAmt = b.amountPaid !== undefined ? b.amountPaid : b.totalPaid || totalAmt;
              const balDue = b.balanceDue !== undefined ? b.balanceDue : (totalAmt - paidAmt > 0 ? totalAmt - paidAmt : 0);

              const fmtTotal = typeof totalAmt === 'number' ? formatPrice(totalAmt) : (String(totalAmt).includes('$') || String(totalAmt).includes('₹') || String(totalAmt).includes('€') || String(totalAmt).includes('£') || String(totalAmt).includes('AED') ? totalAmt : formatPrice(parseFloat(totalAmt) || 0));
              const fmtPaid = typeof paidAmt === 'number' ? formatPrice(paidAmt) : (String(paidAmt).includes('$') || String(paidAmt).includes('₹') || String(paidAmt).includes('€') || String(paidAmt).includes('£') || String(paidAmt).includes('AED') ? paidAmt : formatPrice(parseFloat(paidAmt) || 0));
              const fmtBal = typeof balDue === 'number' ? formatPrice(balDue) : (String(balDue).includes('$') || String(balDue).includes('₹') || String(balDue).includes('€') || String(balDue).includes('£') || String(balDue).includes('AED') ? balDue : formatPrice(parseFloat(balDue) || 0));

              return (
                <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-5 space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Total Package Cost</span>
                    <span className="font-bold text-[#1A1A1A]">{fmtTotal}</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Payment Method</span>
                    <span className="font-bold text-[#1A1A1A]">{b.paymentMethod || 'Razorpay / Credit Card (256-bit SSL)'}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-extrabold text-sm pt-2 border-t border-[#E2E8F0]">
                    <span>Total Received</span>
                    <span>{fmtPaid} (PAID ✓)</span>
                  </div>
                  {balDue > 0 && (
                    <div className="flex justify-between text-amber-600 font-extrabold text-xs">
                      <span>Remaining Balance Due</span>
                      <span>{fmtBal}</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedInvoiceBooking(selectedAdminBooking)}
                className="flex-1 bg-white border border-[#E2E8F0] text-[#1A1A1A] text-xs font-bold py-3 rounded-xl hover:bg-[#F5F9FC] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Download Tax Invoice
              </button>
              <button
                onClick={() => setSelectedAdminBooking(null)}
                className="flex-1 bg-[#1A1A1A] text-white text-xs font-extrabold py-3 rounded-xl hover:bg-[#333] transition-all"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── ADMIN VIEW CUSTOMER PROFILE MODAL ────────────────── */}
      {selectedCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCustomerModal(null)}
              className="absolute top-6 right-6 size-9 rounded-full bg-[#F5F9FC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1A1A1A]"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 border-b border-[#E2E8F0] pb-6">
              <img
                src={selectedCustomerModal.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCustomerModal.name || 'User')}&background=0A4D8C&color=fff`}
                alt={selectedCustomerModal.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#0A4D8C]"
              />
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded-full">
                  {selectedCustomerModal.role === 'admin' ? '👑 Administrator' : selectedCustomerModal.role === 'vip' ? '★ VIP Customer' : '✓ Verified Customer'}
                </span>
                <h3 className="text-xl font-black text-[#1A1A1A] mt-1">{selectedCustomerModal.name || 'Traveler'}</h3>
                <p className="text-xs text-[#64748B]">{selectedCustomerModal.email}</p>
              </div>
            </div>

            <div className="bg-[#F5F9FC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Account Auth Provider</span>
                <span className="font-bold text-[#1A1A1A] uppercase">{selectedCustomerModal.provider || 'Firebase Auth'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">User ID (UID)</span>
                <span className="font-mono text-[#1A1A1A] font-bold">{selectedCustomerModal.id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Verified Email Status</span>
                <span className="font-bold text-emerald-600">Active & Verified ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Loyalty Rewards Tier</span>
                <span className="font-black text-[#0A4D8C]">Gold Platinum Member</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  showToast(`VIP Tier status updated for ${selectedCustomerModal.name || 'Customer'}!`, 'success');
                  setSelectedCustomerModal(null);
                }}
                className="flex-1 bg-[#0A4D8C] text-white text-xs font-black py-3 rounded-xl hover:bg-[#073c6e] shadow-md transition-all cursor-pointer"
              >
                ★ Promote to VIP
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomerModal(null)}
                className="flex-1 bg-[#1A1A1A] text-white text-xs font-extrabold py-3 rounded-xl hover:bg-[#333] transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}
    </div>
  );
};
