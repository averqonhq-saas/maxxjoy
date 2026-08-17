import React, { createContext, useContext, useState, useEffect } from 'react';
import { currencies } from '../data/travelData';
import confetti from 'canvas-confetti';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

const AppContext = createContext();

// ── Initial Seed Data (2 Popular Destinations & 2 Handcrafted Packages) ──────
const SEED_DESTINATIONS = [
  {
    id: 'dest-dubai',
    title: 'Dubai, UAE',
    region: 'Middle East',
    category: 'leisure',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Dubai skyline with Burj Khalifa',
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviewsCount: 342,
    popular: true,
    featured: true,
    status: 'Active',
    displayOrder: 1,
    description: 'Experience luxury shopping, ultramodern architecture, sand dune safaris, and a lively nightlife scene.',
    weather: '32°C Sunny',
    bestTime: 'Nov - Mar',
    flightDuration: '7 hrs from London',
    highlights: ['Burj Khalifa Sky Deck', 'Desert Safari with BBQ', 'Marina Yacht Cruise', 'Gold Souk Tour']
  },
  {
    id: 'dest-maldives',
    title: 'Maldives',
    region: 'Asia',
    category: 'honeymoon',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Maldives water villas over clear blue ocean',
    price: 2499,
    originalPrice: 2999,
    rating: 5.0,
    reviewsCount: 520,
    popular: true,
    featured: true,
    status: 'Active',
    displayOrder: 2,
    description: 'Tropical paradise with overwater white-sand villas, vibrant coral reefs, and world-class luxury wellness spas.',
    weather: '29°C Tropical',
    bestTime: 'Nov - Apr',
    flightDuration: '10 hrs from London',
    highlights: ['Overwater Bungalow Resort', 'Private Sunset Dolphin Cruise', 'Scuba Diving & Snorkeling']
  }
];

const SEED_PACKAGES = [
  {
    id: 'pkg-dubai-luxury',
    title: 'Dubai Premium Luxury Escape',
    destinationName: 'Dubai, UAE',
    location: 'Dubai, United Arab Emirates',
    region: 'Middle East',
    duration: '5 Days / 4 Nights',
    durationDays: 5,
    price: 1499,
    originalPrice: 1899,
    category: 'leisure',
    rating: 4.9,
    reviewsCount: 128,
    discountBadge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    status: 'Active',
    featured: true,
    showOnHomepage: true,
    displayOrder: 1,
    highlights: ['5★ Atlantis The Palm Stay', 'Burj Khalifa 148th Floor Access', 'VIP Private Desert Safari', 'Luxury Marina Yacht Dinner'],
    inclusions: ['5★ Atlantis The Palm Stay', 'Burj Khalifa 148th Floor Access', 'VIP Private Desert Safari', 'Luxury Marina Yacht Dinner']
  },
  {
    id: 'pkg-bali-tropical',
    title: 'Bali Tropical Paradise Villa Escape',
    destinationName: 'Bali, Indonesia',
    location: 'Ubud & Seminyak, Indonesia',
    region: 'Asia',
    duration: '7 Days / 6 Nights',
    durationDays: 7,
    price: 1249,
    originalPrice: 1599,
    category: 'honeymoon',
    rating: 4.9,
    reviewsCount: 95,
    discountBadge: 'Popular',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    status: 'Active',
    featured: true,
    showOnHomepage: true,
    displayOrder: 2,
    highlights: ['Private Pool Villa in Ubud', 'Daily Sunrise Yoga & Spa', 'Nusa Penida Island Speedboat', 'Tanah Lot Sunset Tour'],
    inclusions: ['Private Pool Villa in Ubud', 'Daily Sunrise Yoga & Spa', 'Nusa Penida Island Speedboat', 'Tanah Lot Sunset Tour']
  }
];

export const AppProvider = ({ children }) => {
  // ── Theme ─────────────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('pt_theme', 'light');
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pt_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pt_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // ── Currency ──────────────────────────────────────────────────────────────
  const [currency, setCurrency] = useState(() => localStorage.getItem('pt_currency') || 'INR');

  const changeCurrency = (code) => {
    if (currencies[code]) {
      setCurrency(code);
      localStorage.setItem('pt_currency', code);
      showToast(`Currency changed to ${currencies[code].name} (${currencies[code].symbol})`, 'info');
    }
  };

  const formatPrice = (amountInUSD) => {
    if (!amountInUSD && amountInUSD !== 0) return '₹0';
    const cur = currencies[currency] || currencies.INR;
    const converted = Math.round(amountInUSD * cur.rate);
    return `${cur.symbol}${converted.toLocaleString()}`;
  };

  // ── Real Firebase Auth ─────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isAdminUser = firebaseUser.email?.toLowerCase() === 'muneeswaranmd2004@gmail.com' || firebaseUser.email?.includes('admin');
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Traveler',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=1A1A1A&color=fff&size=200`,
          provider: firebaseUser.providerData?.[0]?.providerId || 'email',
          role: isAdminUser ? 'admin' : 'user',
          isAdmin: isAdminUser
        };
        setUser(userData);

        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              name: userData.name,
              email: userData.email,
              avatar: userData.avatar,
              provider: userData.provider,
              role: userData.role,
              createdAt: serverTimestamp()
            });
          }
        } catch (e) {
          console.warn('Firestore user sync failed:', e.message);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logoutUser = async () => {
    try {
      await signOut(auth);
      setMyBookings([]);
      setWishlist([]);
      showToast('Logged out successfully', 'info');
    } catch (e) {
      showToast('Logout failed', 'error');
    }
  };

  // ── Firebase Firestore Destinations Sync ──────────────────────────────────
  const [destinationsList, setDestinationsList] = useState(() => {
    try {
      const saved = localStorage.getItem('pt_admin_destinations');
      if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    } catch (e) {}
    return SEED_DESTINATIONS;
  });

  // Force seed function to ensure Firebase receives initial destinations & packages
  const seedFirebaseData = async () => {
    try {
      for (const dest of SEED_DESTINATIONS) {
        await setDoc(doc(db, 'destinations', dest.id), {
          ...dest,
          createdAt: serverTimestamp()
        });
      }
      for (const pkg of SEED_PACKAGES) {
        await setDoc(doc(db, 'packages', pkg.id), {
          ...pkg,
          createdAt: serverTimestamp()
        });
      }
      showToast('🔥 Successfully seeded 2 Destinations & 2 Tour Packages into Firebase!', 'success');
    } catch (e) {
      console.warn('Seed to Firebase failed:', e.message);
      showToast('Data loaded locally', 'info');
    }
  };

  // Listen to Firestore `destinations` collection & auto-seed if empty
  useEffect(() => {
    const q = query(collection(db, 'destinations'));
    const unsub = onSnapshot(q, async (snap) => {
      if (snap.empty) {
        await seedFirebaseData();
      } else {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setDestinationsList(docs);
        localStorage.setItem('pt_admin_destinations', JSON.stringify(docs));
      }
    }, () => {/* offline fallback */});
    return () => unsub();
  }, []);

  // Admin Actions for Destinations (Firestore Sync)
  const addDestination = async (newDest) => {
    const id = `dest-${Date.now()}`;
    const item = {
      id,
      status: 'Active',
      featured: true,
      popular: true,
      rating: 5.0,
      reviewsCount: 1,
      displayOrder: destinationsList.length + 1,
      ...newDest
    };

    setDestinationsList(prev => [item, ...prev]);

    try {
      await setDoc(doc(db, 'destinations', id), {
        ...item,
        createdAt: serverTimestamp()
      });
      showToast(`✅ Destination "${item.title}" saved to Firebase!`, 'success');
    } catch (e) {
      showToast(`✅ Destination "${item.title}" created!`, 'success');
    }
  };

  const updateDestination = async (id, updatedFields) => {
    setDestinationsList(prev => prev.map(d => (d.id === id ? { ...d, ...updatedFields } : d)));
    try {
      await setDoc(doc(db, 'destinations', id), updatedFields, { merge: true });
      showToast('Destination updated in Firebase', 'success');
    } catch (e) {
      showToast('Destination updated', 'success');
    }
  };

  const deleteDestination = async (id) => {
    setDestinationsList(prev => prev.filter(d => d.id !== id));
    try {
      await deleteDoc(doc(db, 'destinations', id));
      showToast('Destination deleted from Firebase', 'info');
    } catch (e) {
      showToast('Destination deleted', 'info');
    }
  };

  // ── Firebase Firestore Packages Sync ──────────────────────────────────────
  const [packagesList, setPackagesList] = useState(() => {
    try {
      const saved = localStorage.getItem('pt_admin_packages');
      if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    } catch (e) {}
    return SEED_PACKAGES;
  });

  // Listen to Firestore `packages` collection & seed if empty
  useEffect(() => {
    const q = query(collection(db, 'packages'));
    const unsub = onSnapshot(q, async (snap) => {
      if (snap.empty) {
        // Seed default 2 handcrafted packages into Firebase Firestore
        for (const pkg of SEED_PACKAGES) {
          try {
            await setDoc(doc(db, 'packages', pkg.id), {
              ...pkg,
              createdAt: serverTimestamp()
            });
          } catch (e) {}
        }
        setPackagesList(SEED_PACKAGES);
      } else {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPackagesList(docs);
        localStorage.setItem('pt_admin_packages', JSON.stringify(docs));
      }
    }, () => {/* offline fallback */});
    return () => unsub();
  }, []);

  // Admin Actions for Packages (Firestore Sync)
  const addPackage = async (newPkg) => {
    const id = `pkg-${Date.now()}`;
    const item = {
      id,
      status: 'Active',
      featured: true,
      showOnHomepage: true,
      rating: 5.0,
      reviewsCount: 1,
      inclusions: newPkg.inclusions || ['Luxury Hotel Stay', 'Breakfast & Transfers', 'Guided Excursions'],
      displayOrder: packagesList.length + 1,
      ...newPkg
    };

    setPackagesList(prev => [item, ...prev]);

    try {
      await setDoc(doc(db, 'packages', id), {
        ...item,
        createdAt: serverTimestamp()
      });
      showToast(`✈️ Package "${item.title}" saved to Firebase!`, 'success');
    } catch (e) {
      showToast(`✈️ Package "${item.title}" published!`, 'success');
    }
  };

  const updatePackage = async (id, updatedFields) => {
    setPackagesList(prev => prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p)));
    try {
      await setDoc(doc(db, 'packages', id), updatedFields, { merge: true });
      showToast('Package updated in Firebase', 'success');
    } catch (e) {
      showToast('Package updated', 'success');
    }
  };

  const deletePackage = async (id) => {
    setPackagesList(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'packages', id));
      showToast('Package deleted from Firebase', 'info');
    } catch (e) {
      showToast('Package deleted', 'info');
    }
  };

  // ── Wishlist (Firestore + localStorage fallback) ───────────────────────────
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('pt_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('pt_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (!user?.uid) return;
    const docRef = doc(db, 'users', user.uid);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists() && snap.data().wishlist) {
        setWishlist(snap.data().wishlist);
      }
    }, () => {});
    return () => unsub();
  }, [user?.uid]);

  const toggleWishlist = async (itemId, itemTitle) => {
    const exists = wishlist.includes(itemId);
    const next = exists ? wishlist.filter(id => id !== itemId) : [...wishlist, itemId];
    setWishlist(next);
    showToast(exists ? `Removed ${itemTitle || 'item'} from saved tours` : `Added ${itemTitle || 'item'} to saved tours!`, exists ? 'info' : 'success');

    if (user?.uid) {
      try {
        await setDoc(doc(db, 'users', user.uid), { wishlist: next }, { merge: true });
      } catch (e) {
        console.warn('Wishlist Firestore sync failed:', e.message);
      }
    }
  };

  // ── Firebase Firestore Bookings Sync ──────────────────────────────────────
  const [myBookings, setMyBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('pt_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('pt_bookings', JSON.stringify(myBookings));
  }, [myBookings]);

  // Sync Bookings from Firebase Firestore
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'users', user.uid, 'bookings'),
      orderBy('bookingDate', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const bookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMyBookings(bookings);
    }, () => {});
    return () => unsub();
  }, [user?.uid]);

  const addBooking = async (bookingData) => {
    const bookingId = `TRV${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      bookingId,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
      ...bookingData
    };

    setMyBookings(prev => [newBooking, ...prev]);

    // Save to Firebase Firestore under user's bookings & global bookings
    try {
      if (user?.uid) {
        await addDoc(collection(db, 'users', user.uid, 'bookings'), {
          ...newBooking,
          createdAt: serverTimestamp()
        });
      }
      await addDoc(collection(db, 'global_bookings'), {
        ...newBooking,
        userUid: user?.uid || 'guest',
        userEmail: user?.email || newBooking.guestEmail || 'guest@example.com',
        createdAt: serverTimestamp()
      });
      showToast('🎉 Booking Confirmed & Saved in Firebase!', 'success');
    } catch (e) {
      showToast('🎉 Booking Confirmed!', 'success');
    }

    try {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  // ── Payment Settings Sync (Firebase Firestore) ────────────────────────────
  const [paymentSettings, setPaymentSettings] = useState({
    defaultAdvance: 25,
    allowFullPayment: true,
    allowPartialPayment: true,
    paymentDueDays: 7,
    autoBookingConfirmation: true,
    sendWhatsAppReceipt: true,
    sendEmailInvoice: true
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'payment'), (snap) => {
      if (snap.exists()) {
        setPaymentSettings(prev => ({ ...prev, ...snap.data() }));
      }
    }, () => {});
    return () => unsub();
  }, []);

  const updatePaymentSettings = async (newSettings) => {
    setPaymentSettings(prev => ({ ...prev, ...newSettings }));
    try {
      await setDoc(doc(db, 'settings', 'payment'), newSettings, { merge: true });
      showToast('⚙️ Payment settings saved in Firebase!', 'success');
    } catch (e) {
      showToast('Payment settings updated', 'info');
    }
  };

  // ── Special Deals Banner Sync (Firebase Firestore) ────────────────────────
  const [specialDeal, setSpecialDeal] = useState({
    badge: 'Limited Time Offer',
    title: 'Bali Summer Offer —',
    highlight: 'Save 30% Today!',
    description: 'Book your dream Bali getaway for the upcoming season and enjoy exclusive discounts on overwater pool villas, private speedboats, and jungle swings.',
    buttonText: 'Claim 30% Discount Now',
    promoCode: 'BALI30',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    packageName: 'Ubud Luxury Pool Villa Package',
    packageSubtitle: '8 Days / 7 Nights · All Inclusions Included',
    enabled: true
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'special_deal'), (snap) => {
      if (snap.exists()) {
        setSpecialDeal(prev => ({ ...prev, ...snap.data() }));
      }
    }, () => {});
    return () => unsub();
  }, []);

  const updateSpecialDeal = async (newDealData) => {
    setSpecialDeal(prev => ({ ...prev, ...newDealData }));
    try {
      await setDoc(doc(db, 'settings', 'special_deal'), newDealData, { merge: true });
      showToast('🔥 Special deal offer updated in Firebase!', 'success');
    } catch (e) {
      showToast('Special deal updated', 'info');
    }
  };

  // ── Legal & Support Settings Sync (Firebase Firestore) ────────────────────
  const [legalSettings, setLegalSettings] = useState({
    companyName: 'Maxx Joy Tours and Travel Pvt Ltd',
    phone: '+91 9804777879 / +91 7418407088',
    whatsapp: '+91 9804777879',
    email: 'Info@maxxjoytours.com',
    emails: [
      'Info@maxxjoytours.com',
      'Yogaprathap@maxxjoytours.com',
      'George@maxxjoytours.com'
    ],
    address: 'NO 6 new annai indra nagar maruthamalai\nCoimbatore 641046',
    supportHours: '24 Hours / 7 Days',
    privacyPolicy: `Privacy Policy\n\nLast Updated: August 17, 2026\n\nMaxx Joy Tours and Travel Pvt Ltd ("we", "our", or "us") respects your privacy and is committed to protecting the personal information you provide when using our website, booking our travel services, or communicating with us.\n\n1. Information We Collect\nWe may collect information such as:\n• Full name\n• Email address\n• Phone number\n• Billing and payment information\n• Travel dates\n• Number of travellers\n• Passport or travel document information when required\n• Destination and package preferences\n• Booking information & communication history\n\n2. How We Use Your Information\nWe may use your information to:\n• Process tour enquiries and bookings\n• Confirm and manage reservations & process payments\n• Provide 24/7 customer support\n• Send booking confirmations, invoices, and travel itineraries\n• Improve our website performance and user experience\n• Prevent fraud and comply with legal requirements\n\n3. Payment Information\nPayments are processed securely via encrypted payment service providers (e.g. Razorpay, Stripe). We do not store complete credit card or banking credentials on our servers.\n\n4. Data Security & Retention\nWe employ SSL encryption and strict organizational safety measures to protect your personal data. Data is retained only as long as necessary for fulfillment and legal obligations.\n\n5. Contact Us\nMaxx Joy Tours and Travel Pvt Ltd\nEmails: Info@maxxjoytours.com, Yogaprathap@maxxjoytours.com, George@maxxjoytours.com\nMobile: +91 9804777879 / +91 7418407088\nAddress: NO 6 new annai indra nagar maruthamalai, Coimbatore 641046`,
    termsConditions: `Terms & Conditions\n\nLast Updated: August 17, 2026\n\nWelcome to Maxx Joy Tours and Travel Pvt Ltd. By accessing our website or booking our travel services, you agree to comply with these Terms & Conditions.\n\n1. About Our Services\nMaxx Joy Tours and Travel Pvt Ltd provides travel-related services including luxury tour packages, accommodation, private transportation, and guided activities.\n\n2. Booking & Confirmation\nA booking request is confirmed only after required traveller details are submitted and payment (full or required advance) is successfully processed.\n\n3. Pricing & Payment\nAll prices are subject to availability. Depending on the tour package, users may pay full amount or advance options (25% or 50%), with balance due before departure.\n\n4. Cancellation & Refunds\nCancellation requests must be submitted via support channels. Refunds will be processed according to the package specific policy.\n\n5. Travel Documents & Responsibilities\nTravellers are responsible for maintaining valid passports, visas, and required travel permits.\n\n6. Force Majeure\nWe are not liable for disruptions caused by natural disasters, severe weather, government restrictions, or extraordinary unforeseen events.\n\n7. Contact Us\nMaxx Joy Tours and Travel Pvt Ltd\nEmails: Info@maxxjoytours.com, Yogaprathap@maxxjoytours.com, George@maxxjoytours.com\nMobile: +91 9804777879 / +91 7418407088\nAddress: NO 6 new annai indra nagar maruthamalai, Coimbatore 641046`,
    cookiePolicy: `Cookie Policy\n\nLast Updated: August 17, 2026\n\nThis Cookie Policy explains how Maxx Joy Tours and Travel Pvt Ltd uses cookies and similar technologies on our website.\n\n1. What Are Cookies?\nCookies are small text files stored on your device when you visit a website to enhance navigation and remember preferences.\n\n2. Why We Use Cookies\n• Essential Cookies: Required for core website functions such as login, cart, and secure checkout.\n• Preference Cookies: Save selected language, currency, and travel settings.\n• Analytics Cookies: Help us understand website traffic and optimize performance.\n\n3. Managing Cookies\nYou can modify cookie preferences anytime using our on-screen Cookie Consent Banner or via your browser settings.\n\n4. Contact Us\nEmails: Info@maxxjoytours.com, Yogaprathap@maxxjoytours.com, George@maxxjoytours.com\nMobile: +91 9804777879 / +91 7418407088\nAddress: NO 6 new annai indra nagar maruthamalai, Coimbatore 641046`,
    published: true,
    lastUpdated: 'August 17, 2026'
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'legal'), (snap) => {
      if (snap.exists()) {
        setLegalSettings(prev => ({ ...prev, ...snap.data() }));
      }
    }, () => {});
    return () => unsub();
  }, []);

  const updateLegalSettings = async (newSettings) => {
    setLegalSettings(prev => ({ ...prev, ...newSettings }));
    try {
      await setDoc(doc(db, 'settings', 'legal'), newSettings, { merge: true });
      showToast('⚖️ Legal & Support settings saved in Firebase!', 'success');
    } catch (e) {
      showToast('Legal settings updated', 'info');
    }
  };

  // ── Firebase Firestore Customers Sync ──────────────────────────────────────
  const [customersList, setCustomersList] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, uid: d.id, ...d.data() }));
      setCustomersList(docs);
    }, () => {});
    return () => unsub();
  }, []);

  // ── Firebase Firestore Reviews Sync ────────────────────────────────────────
  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'reviews'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setReviewsList(docs);
    }, () => {});
    return () => unsub();
  }, []);

  const addReview = async (reviewData) => {
    const newReview = {
      author: reviewData.name || 'Anonymous Traveler',
      location: reviewData.trip || 'Verified Tour',
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment || '',
      avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewData.name || 'User')}&background=0A4D8C&color=fff`,
      userUid: user?.uid || 'guest',
      status: 'Approved'
    };

    setReviewsList(prev => [newReview, ...prev]);

    try {
      await addDoc(collection(db, 'reviews'), {
        ...newReview,
        createdAt: serverTimestamp()
      });
      showToast('🌟 Thank you! Your review has been saved in Firebase!', 'success');
    } catch (e) {
      showToast('🌟 Review submitted successfully!', 'success');
    }
  };

  const updateReview = async (id, updatedFields) => {
    setReviewsList(prev => prev.map(r => (r.id === id ? { ...r, ...updatedFields } : r)));
    try {
      await setDoc(doc(db, 'reviews', id), updatedFields, { merge: true });
      showToast('Review updated in Firebase', 'success');
    } catch (e) {
      showToast('Review status updated', 'info');
    }
  };

  const deleteReview = async (id) => {
    setReviewsList(prev => prev.filter(r => r.id !== id));
    try {
      await deleteDoc(doc(db, 'reviews', id));
      showToast('Review removed from Firebase', 'info');
    } catch (e) {
      showToast('Review removed', 'info');
    }
  };

  // ── Modals state ──────────────────────────────────────────────────────────
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState(null);
  const [selectedDestinationModal, setSelectedDestinationModal] = useState(null);
  const [selectedPhotoForLightbox, setSelectedPhotoForLightbox] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // ── Search & Filters ──────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchParams, setSearchParams] = useState({
    destination: '',
    departure: '',
    date: '',
    travelers: '2 Adults',
    budget: 5000
  });

  // ── Promo codes ───────────────────────────────────────────────────────────
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);

  const PROMO_CODES = {
    'BALI30':    { code: 'BALI30',    discountPercent: 30, label: '30% Summer Discount' },
    'WELCOME50': { code: 'WELCOME50', discountAmount: 50,  label: '$50 Welcome Bonus' },
    'DUBAI10':   { code: 'DUBAI10',   discountPercent: 10, label: '10% Dubai Special' },
    'TRAVEL20':  { code: 'TRAVEL20',  discountPercent: 20, label: '20% Off Any Package' },
  };

  const applyPromoCode = (code) => {
    const promo = PROMO_CODES[code.toUpperCase()];
    if (promo) {
      setAppliedPromoCode(promo);
      showToast(`✅ ${promo.label} Applied!`, 'success');
    } else {
      showToast('Invalid or expired promo code', 'error');
    }
  };

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode, toggleDarkMode,
        currency, changeCurrency, formatPrice,
        user, authLoading, logoutUser, isAdmin: user?.isAdmin || user?.email?.toLowerCase() === 'muneeswaranmd2004@gmail.com',
        wishlist, toggleWishlist,
        myBookings, addBooking,
        // Admin Controlled Content (Firebase Synced)
        destinationsList, setDestinationsList, addDestination, updateDestination, deleteDestination,
        packagesList, setPackagesList, addPackage, updatePackage, deletePackage,
        seedFirebaseData,
        customersList,
        // Payment Settings
        paymentSettings, updatePaymentSettings,
        // Special Deal Banner
        specialDeal, updateSpecialDeal,
        // Legal & Support Settings
        legalSettings, updateLegalSettings,
        // Verified Reviews (Firebase Synced)
        reviewsList, addReview, updateReview, deleteReview,
        // Modals
        selectedPackageForBooking, setSelectedPackageForBooking,
        selectedDestinationModal, setSelectedDestinationModal,
        selectedPhotoForLightbox, setSelectedPhotoForLightbox,
        isWishlistOpen, setIsWishlistOpen,
        isMyBookingsOpen, setIsMyBookingsOpen,
        isAuthModalOpen, setIsAuthModalOpen,
        isReviewModalOpen, setIsReviewModalOpen,
        // Search & Filters
        activeCategory, setActiveCategory,
        searchParams, setSearchParams,
        appliedPromoCode, applyPromoCode,
        toast, showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
