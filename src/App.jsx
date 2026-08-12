import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from './components/ToastContainer';

// Shared Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { ReviewModal } from './components/modals/ReviewModal';
import { DestinationModal } from './components/modals/DestinationModal';

// Home Sections
import { HeroSearch } from './components/HeroSearch';
import { TravelCategories } from './components/TravelCategories';
import { PopularDestinations } from './components/PopularDestinations';
import { HandcraftedPackages } from './components/HandcraftedPackages';
import { WhyChooseUs } from './components/WhyChooseUs';
import { SpecialDeals } from './components/SpecialDeals';
import { HowItWorks } from './components/HowItWorks';
import { ExperienceGallery } from './components/ExperienceGallery';
import { ReviewsSection } from './components/ReviewsSection';
import { NewsletterSection } from './components/NewsletterSection';

// Full Pages
import { BookingPage } from './components/BookingPage';
import { DubaiTravelPage } from './components/DubaiTravelPage';
import { AuthPage } from './components/AuthPage';
import { WishlistPage } from './components/WishlistPage';
import { MyBookingsPage } from './components/MyBookingsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { PackageDetailPage } from './components/PackageDetailPage';
import { ExploreToursPage } from './components/ExploreToursPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicyPage, TermsConditionsPage, CookiePolicyPage } from './components/LegalPages';

export default function App() {
  const getInitialPage = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === '/admin' || path.startsWith('/admin') || hash === '#/admin' || hash === '#admin') return 'admin';
    if (path === '/contact' || hash === '#/contact') return 'contact';
    if (path === '/explore' || hash === '#/explore') return 'explore-tours';
    if (path === '/privacy' || hash === '#/privacy') return 'privacy';
    if (path === '/terms' || hash === '#/terms') return 'terms';
    if (path === '/cookie' || hash === '#/cookie') return 'cookie';
    return 'home';
  };

  const [page, setPage] = useState(getInitialPage);
  const [prevPage, setPrevPage] = useState('home');
  const [selectedDetailPkg, setSelectedDetailPkg] = useState(null);

  React.useEffect(() => {
    const handlePopState = () => {
      setPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goTo = (p) => {
    setPage(p);
    if (p === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (p === 'home') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', `/${p}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToAuth = (returnTo = 'home') => {
    setPrevPage(returnTo);
    goTo('auth');
  };

  const onAuthSuccess = () => {
    goTo(prevPage || 'home');
  };

  const openPackageDetail = (pkg) => {
    setSelectedDetailPkg(pkg || null);
    goTo('package-detail');
  };

  const scrollToSection = (sectionId) => {
    if (page !== 'home') {
      setPage('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Shared Navbar props
  const navbarProps = {
    onHome: () => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); },
    onDestinations: () => scrollToSection('destinations'),
    onExploreTours: () => goTo('explore-tours'),
    onDeals: () => scrollToSection('deals'),
    onWhyUs: () => scrollToSection('why-us'),
    onBookNow: () => goTo('explore-tours'),
    onLogin: () => goToAuth(page),
    onDubaiPage: () => openPackageDetail(),
    onWishlist: () => goTo('wishlist'),
    onBookings: () => goTo('my-bookings'),
    onAdmin: () => goTo('admin'),
    onContact: () => goTo('contact'),
  };

  // Shared Footer props
  const footerProps = {
    onHome: () => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); },
    onDestinations: () => scrollToSection('destinations'),
    onExploreTours: () => goTo('explore-tours'),
    onDeals: () => scrollToSection('deals'),
    onWhyUs: () => scrollToSection('why-us'),
    onAdmin: () => goTo('admin'),
    onContact: () => goTo('contact'),
    onPrivacy: () => goTo('privacy'),
    onTerms: () => goTo('terms'),
    onCookiePolicy: () => goTo('cookie'),
  };

  return (
    <AppProvider>
      <ToastContainer />
      <CookieConsentBanner />
      <ReviewModal />
      <DestinationModal />

      {/* Standalone Admin View */}
      {page === 'admin' ? (
        <AdminDashboard onBack={() => goTo('home')} />
      ) : page === 'auth' ? (
        /* Standalone Auth View */
        <AuthPage
          onBack={() => goTo(prevPage || 'home')}
          onSuccess={onAuthSuccess}
        />
      ) : (
        /* Shared Unified Layout with Common Navbar & Footer */
        <div className="min-h-screen bg-white text-[#1A1A1A] font-sans flex flex-col justify-between">
          <Navbar {...navbarProps} />

          <main className="flex-1">
            {/* ── Home Page ── */}
            {page === 'home' && (
              <>
                <HeroSearch
                  onBookNow={() => goTo('booking')}
                  onSearch={() => goTo('explore-tours')}
                />
                <TravelCategories onDubai={() => openPackageDetail()} />
                <PopularDestinations onDetail={openPackageDetail} />
                <HandcraftedPackages onBookNow={() => openPackageDetail()} />
                <WhyChooseUs />
                <SpecialDeals onBookNow={() => openPackageDetail()} />
                <HowItWorks />
                <ExperienceGallery />
                <ReviewsSection />
                <NewsletterSection />
              </>
            )}

            {/* ── Contact Us Page ── */}
            {page === 'contact' && (
              <ContactPage
                onNavigateHome={() => goTo('home')}
              />
            )}

            {/* ── Explore Tours Catalog Page ── */}
            {page === 'explore-tours' && (
              <ExploreToursPage
                onBack={() => goTo('home')}
                onBookNow={() => goTo('booking')}
                onDetail={(pkg) => openPackageDetail(pkg)}
                onLogin={() => goToAuth('explore-tours')}
              />
            )}

            {/* ── Package Detail Page ── */}
            {page === 'package-detail' && (
              <PackageDetailPage
                pkgData={selectedDetailPkg}
                onBack={() => goTo('home')}
                onBookNow={() => goTo('booking')}
              />
            )}

            {/* ── Wishlist Full Page ❤️ ── */}
            {page === 'wishlist' && (
              <WishlistPage
                onBack={() => goTo('home')}
                onBookNow={() => goTo('booking')}
                onDetail={(pkg) => openPackageDetail(pkg)}
              />
            )}

            {/* ── My Bookings Full Page 🎫 ── */}
            {page === 'my-bookings' && (
              <MyBookingsPage
                onBack={() => goTo('home')}
                onBookNow={() => goTo('booking')}
              />
            )}

            {/* ── Dubai Travel Guide Page ── */}
            {page === 'dubai' && (
              <DubaiTravelPage
                onBack={() => goTo('home')}
                onBookNow={() => goTo('booking')}
              />
            )}

            {/* ── Booking Flow Page ── */}
            {page === 'booking' && (
              <BookingPage onBack={() => goTo('home')} />
            )}

            {/* ── Legal & Support Pages ── */}
            {page === 'privacy' && <PrivacyPolicyPage />}
            {page === 'terms' && <TermsConditionsPage />}
            {page === 'cookie' && <CookiePolicyPage />}
          </main>

          {page !== 'booking' && <Footer {...footerProps} />}
        </div>
      )}
    </AppProvider>
  );
}
