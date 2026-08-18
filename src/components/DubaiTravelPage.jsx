import React, { useState } from 'react';

const ATTRACTIONS = [
  {
    id: 1,
    title: 'Burj Khalifa',
    category: 'LANDMARK',
    desc: 'Visit the world\'s tallest building offering breathtaking views from observation decks.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    tag: 'LANDMARK',
  },
  {
    id: 2,
    title: 'Desert Safari',
    category: 'ADVENTURE',
    desc: 'Experience the thrill of dune bashing followed by a traditional dinner under the stars.',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80',
    tag: 'ADVENTURE',
  },
  {
    id: 3,
    title: 'Dubai Mall',
    category: 'SHOPPING',
    desc: 'The world\'s largest mall, featuring an indoor ice rink, aquarium, and Olympic-size fountain.',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&q=80',
    tag: 'SHOPPING',
  },
];

const PACKAGES = [
  {
    id: 1,
    title: 'The Royal Experience',
    nights: '5 Nights / 6 Days',
    category: 'Private Helicopter Tour',
    price: 1299,
    badge: 'TOP SALE',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80',
  },
  {
    id: 2,
    title: 'Culture & Heritage',
    nights: '4 Nights / 5 Days',
    category: 'Traditional Taste Testing',
    price: 549,
    badge: null,
    image: 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?w=600&q=80',
  },
];

const TIPS = [
  { icon: 'payments', title: 'Currency', desc: 'UAE Dirham (AED). Cards are widely accepted everywhere in Dubai.' },
  { icon: 'water_drop', title: 'Drink Code', desc: 'Alcohol is available in licensed hotels and restaurants only.' },
  { icon: 'schedule', title: 'Best Time to Visit', desc: 'November to March offers the most pleasant weather for outdoor activities.' },
];

const GALLERY = [
  'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400&q=80',
  'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&q=80',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80',
  'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?w=400&q=80',
  'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80',
];

export const DubaiTravelPage = ({ onBack, onBookNow }) => {
  const [activeNav, setActiveNav] = useState('explore');

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-6">
          {/* Logo */}
          <button onClick={onBack} className="flex items-center gap-2 flex-shrink-0">
            <div className="size-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontSize: 16 }}>travel</span>
            </div>
            <span className="font-black text-[#1A1A1A] text-base">Dubai Travel</span>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { key: 'explore', label: 'Explore' },
              { key: 'attractions', label: 'Attractions' },
              { key: 'tours', label: 'Tours' },
              { key: 'tips', label: 'Tips' },
            ].map(n => (
              <button
                key={n.key}
                onClick={() => setActiveNav(n.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeNav === n.key
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-[#64748B] hover:text-[#1A1A1A] hover:bg-[#F5F9FC]'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>

          {/* Search + Avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#64748B]">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>search</span>
              <span>Search experiences…</span>
            </div>
            <div className="size-9 rounded-full bg-[#F5F9FC] border border-[#E2E8F0] flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined text-[#64748B]" style={{ fontSize: 18 }}>person</span>
            </div>
            <button
              onClick={onBack}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#1A1A1A] border border-[#E2E8F0] rounded-xl px-3 py-2 transition-all hover:bg-[#F5F9FC]"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_back</span>
              Back
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative h-[480px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=85"
          alt="Dubai Skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-[1200px] mx-auto left-0 right-0">
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit mb-3">
            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>star</span>
            BE FAST APPLY
          </span>
          <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-3">
            Explore Dubai
          </h1>
          <p className="text-white/80 text-sm max-w-md leading-relaxed">
            Where tradition meets the future in a spectacular display of luxury and innovation.
          </p>
        </div>
      </section>

      {/* ── City of Wonders ─────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-black text-[#1A1A1A] mb-4">A City of Wonders</h2>
          <p className="text-[#64748B] text-sm leading-relaxed mb-4">
            Dubai is an emirate in the United Arab Emirates known for luxury shopping, a ultramodern architecture and a lively nightlife scene. But Khalifa, an 830m-tall tower, dominates the skyscraper-filled skyline.
          </p>
          <p className="text-[#64748B] text-sm leading-relaxed mb-6">
            Also here: the Dubai Fountain, with jets and lights choreographed to music. On artificial islands just offshore is Atlantis, The Palm, a resort with water and marine-themed parks.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onBookNow}
              className="flex items-center gap-2 bg-[#1A1A1A] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#333] transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add_circle</span>
              VISIT NOW
            </button>
            <button className="flex items-center gap-2 bg-[#F5F9FC] border border-[#E2E8F0] text-[#1A1A1A] text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#E2E8F0] transition-all">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>map</span>
              SELF TRAVEL
            </button>
          </div>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-1 row-span-2">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80"
              alt="Dubai luxury"
              className="w-full h-full object-cover rounded-2xl border border-[#E2E8F0] shadow-sm"
              style={{ minHeight: 260 }}
            />
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&q=80"
              alt="Dubai architecture"
              className="w-full h-[120px] object-cover rounded-2xl border border-[#E2E8F0] shadow-sm"
            />
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400&q=80"
              alt="Dubai mall"
              className="w-full h-[120px] object-cover rounded-2xl border border-[#E2E8F0] shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* ── Must-See Attractions ──────────────────────────── */}
      <section className="bg-[#F5F9FC] py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#1A1A1A]">Must-See Attractions</h2>
              <p className="text-[#64748B] text-sm mt-1">Top landmarks you can't miss on your visit.</p>
            </div>
            <button className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1 hover:opacity-70 transition-all">
              View all attractions
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ATTRACTIONS.map(a => (
              <div key={a.id} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#64748B]">{a.tag}</span>
                  <h3 className="font-extrabold text-[#1A1A1A] mt-0.5 mb-1">{a.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{a.desc}</p>
                  <button
                    onClick={onBookNow}
                    className="mt-3 flex items-center gap-1 text-xs font-bold text-[#1A1A1A] hover:gap-2 transition-all"
                  >
                    Explore
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Curated Tour Packages ─────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-[#1A1A1A]">Curated Tour Packages</h2>
          <p className="text-[#64748B] text-sm mt-1">Choose the perfect itinerary tailored to your travel style.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PACKAGES.map(p => (
            <div key={p.id} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex gap-0">
              <div className="relative w-32 flex-shrink-0">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                {p.badge && (
                  <span className="absolute top-2 left-2 bg-[#FF7A00] text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <p className="text-[10px] text-[#64748B] font-semibold">{p.nights}</p>
                  <h3 className="font-extrabold text-[#1A1A1A] mt-0.5">{p.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-[#64748B]">
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>person</span>
                    {p.category}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[10px] text-[#64748B] block font-bold uppercase">Starting from</span>
                    <span className="text-xl font-black text-[#1A1A1A]">${p.price.toLocaleString()}</span>
                    <span className="text-xs text-[#64748B] ml-1">/ person</span>
                  </div>
                  <button
                    onClick={onBookNow}
                    className="bg-[#FF7A00] text-white text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-[#e56e00] transition-all shadow-md shadow-[#FF7A00]/20 cursor-pointer"
                  >
                    Enquire / Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tips + Gallery ────────────────────────────────── */}
      <section className="bg-[#F5F9FC] py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Tips */}
          <div>
            <h2 className="text-xl font-black text-[#1A1A1A] mb-6">Essential Travel Tips</h2>
            <div className="space-y-5">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="size-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[#1A1A1A]" style={{ fontSize: 18 }}>{tip.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1A1A] text-sm">{tip.title}</p>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div>
            <h2 className="text-xl font-black text-[#1A1A1A] mb-6">Visual Gallery</h2>
            <div className="grid grid-cols-3 gap-2">
              {GALLERY.map((img, i) => (
                <div
                  key={i}
                  className={`rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm ${
                    i === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                  style={{ minHeight: i === 0 ? 200 : 95 }}
                >
                  <img
                    src={img}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    style={{ height: i === 0 ? 200 : 95 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-[#E2E8F0] bg-white py-8 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontSize: 14 }}>travel</span>
            </div>
            <span className="font-bold text-[#64748B] text-sm">Dubai Travel © 2024. All Rights Reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-[#64748B] font-medium">
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#1A1A1A] transition-colors">Cookie Policy</a>
          </div>
          <div className="flex gap-2">
            {['share', 'language', 'settings'].map(icon => (
              <div key={icon} className="size-8 rounded-full bg-[#F5F9FC] border border-[#E2E8F0] flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all cursor-pointer group">
                <span className="material-symbols-outlined text-[#64748B] group-hover:text-white" style={{ fontSize: 15 }}>{icon}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
