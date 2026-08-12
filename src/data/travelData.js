export const currencies = {
  USD: { symbol: '$', rate: 1, code: 'USD', name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, code: 'EUR', name: 'Euro' },
  GBP: { symbol: '£', rate: 0.78, code: 'GBP', name: 'British Pound' },
  INR: { symbol: '₹', rate: 83.5, code: 'INR', name: 'Indian Rupee' },
  AED: { symbol: 'AED ', rate: 3.67, code: 'AED', name: 'UAE Dirham' }
};

export const categoriesData = [
  { id: 'honeymoon', name: 'Honeymoon', icon: 'favorite', description: 'Romantic getaways & private villas' },
  { id: 'adventure', name: 'Adventure', icon: 'hiking', description: 'Thrilling expeditions & outdoor treks' },
  { id: 'family', name: 'Family', icon: 'family_restroom', description: 'Kid-friendly resorts & fun tours' },
  { id: 'leisure', name: 'Leisure', icon: 'beach_access', description: 'Relaxing beaches & luxury spas' },
  { id: 'business', name: 'Business', icon: 'corporate_fare', description: 'Workcation & premium executive travel' },
  { id: 'heritage', name: 'Heritage', icon: 'castle', description: 'Historic landmarks & cultural tours' }
];

export const destinationsData = [
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
    featured: true,
    description: 'Experience luxury shopping, ultramodern architecture, sand dune safaris, and a lively nightlife scene in the crown jewel of the Emirates.',
    weather: '32°C Sunny',
    bestTime: 'Nov - Mar',
    flightDuration: '7 hrs from London',
    highlights: ['Burj Khalifa Sky Deck Access', 'Desert Safari with BBQ Dinner', 'Marina Luxury Yacht Cruise', 'Gold & Spice Souk Tour']
  },
  {
    id: 'dest-paris',
    title: 'Paris, France',
    region: 'Europe',
    category: 'honeymoon',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    alt: 'Eiffel Tower in Paris at sunset',
    price: 1599,
    originalPrice: 1899,
    rating: 4.8,
    reviewsCount: 489,
    featured: false,
    description: 'The global center for art, fashion, gastronomy, and culture. Stroll along the Seine, visit iconic museums, and dine at Michelin-starred bistros.',
    weather: '22°C Clear',
    bestTime: 'Apr - Oct',
    flightDuration: '1.5 hrs from London',
    highlights: ['Skip-the-line Louvre Museum Ticket', 'Seine River Dinner Cruise', 'Eiffel Tower Summit Tour', 'Day Trip to Palace of Versailles']
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
    featured: true,
    description: 'Tropical paradise with overwater white-sand villas, vibrant coral reefs, crystal turquoise lagoons, and world-class luxury wellness spas.',
    weather: '29°C Tropical',
    bestTime: 'Nov - Apr',
    flightDuration: '10 hrs from London',
    highlights: ['Overwater Bungalow Resort', 'Private Sunset Dolphin Cruise', 'Scuba Diving & Snorkeling', 'Undersea Restaurant Dining']
  },
  {
    id: 'dest-bali',
    title: 'Bali, Indonesia',
    region: 'Asia',
    category: 'adventure',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    alt: 'Bali lush green rice terraces and tropical foliage',
    price: 899,
    originalPrice: 1299,
    rating: 4.9,
    reviewsCount: 612,
    featured: false,
    description: 'Known for its forested volcanic mountains, iconic cascading rice paddies, ancient Hindu temples, surf beaches, and holistic yoga retreats.',
    weather: '28°C Warm',
    bestTime: 'May - Sep',
    flightDuration: '15 hrs from London',
    highlights: ['Ubud Tegalalang Rice Terraces', 'Sacred Monkey Forest Sanctuary', 'Tanah Lot Temple at Sunset', 'Seminyak Beach Club Pass']
  },
  {
    id: 'dest-tokyo',
    title: 'Tokyo, Japan',
    region: 'Asia',
    category: 'heritage',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    alt: 'Tokyo illuminated streets with Mount Fuji view',
    price: 1799,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 390,
    featured: true,
    description: 'A captivating blend of ultramodern neon skyscrapers and timeless historic temples, world-class sushi bars, and anime pop culture.',
    weather: '20°C Mild',
    bestTime: 'Mar - May & Sep - Nov',
    flightDuration: '11.5 hrs from London',
    highlights: ['Shibuya Crossing & Harajuku', 'Mt. Fuji Day Trip & Bullet Train', 'TeamLab Planets Immersive Art', 'Senso-ji Temple & Asakusa']
  },
  {
    id: 'dest-santorini',
    title: 'Santorini, Greece',
    region: 'Europe',
    category: 'honeymoon',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    alt: 'Santorini white domed houses overlooking Aegean sea',
    price: 1699,
    originalPrice: 1999,
    rating: 4.8,
    reviewsCount: 295,
    featured: false,
    description: 'Famous for its whitewashed cliffside villages, blue-domed churches, dramatic volcanic caldera vistas, and breathtaking Aegean sunsets.',
    weather: '26°C Breeze',
    bestTime: 'May - Oct',
    flightDuration: '4 hrs from London',
    highlights: ['Oia Sunset Catamaran Cruise', 'Volcanic Red Sand Beach', 'Assyrtiko Wine Tasting Tour', 'Fira Cliff Walk']
  }
];

export const packagesData = [
  {
    id: 'pkg-dubai-luxury',
    title: 'Dubai Luxury Escape',
    destinationId: 'dest-dubai',
    destinationName: 'Dubai, UAE',
    duration: '7 Days / 6 Nights',
    rating: 4.9,
    reviewsCount: 128,
    category: 'leisure',
    price: 3200,
    originalPrice: 3800,
    discountBadge: '15% OFF',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      '5-Star Atlantis The Palm Stay',
      'Private Yacht Dinner & Marina View',
      'Desert Safari with VIP Quad Biking',
      'Burj Khalifa At The Top SKY VIP Entry',
      'Airport Transfers in Private Luxury SUV'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Marina Dinner', desc: 'VIP airport pickup, check-in at 5-star hotel, and evening private yacht dinner cruise.' },
      { day: 2, title: 'Old Dubai & Gold Souk', desc: 'Guided tour of historical Bastakiya, abra boat ride across Dubai Creek, and gold market exploration.' },
      { day: 3, title: 'Desert Safari Adventure', desc: 'Dune bashing in 4x4 Land Cruisers, camel riding, quad biking, and Arabian starlit BBQ feast.' },
      { day: 4, title: 'Burj Khalifa & Dubai Mall', desc: 'Exclusive entrance to 148th floor sky deck, fountain show, and shopping concierges.' },
      { day: 5, title: 'Day Trip to Abu Dhabi', desc: 'Visit Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, and Ferrari World.' },
      { day: 6, title: 'Beach Spa & Leisure', desc: 'Full day complimentary spa wellness treatment and beach club relaxation.' },
      { day: 7, title: 'Departure', desc: 'Breakfast, souvenir shopping, and private chauffeur transfer to DXB airport.' }
    ]
  },
  {
    id: 'pkg-swiss-alps',
    title: 'Swiss Alps Adventure',
    destinationId: 'dest-swiss',
    destinationName: 'Interlaken & Zermatt, Switzerland',
    duration: '5 Days / 4 Nights',
    rating: 4.8,
    reviewsCount: 94,
    category: 'adventure',
    price: 1850,
    originalPrice: 2200,
    discountBadge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Alpine Mountain Chalet Resort',
      'Glacier 3000 & Jungfraujoch Pass',
      'Scenic Glacier Express Train Ticket',
      'Thermal Luxury Spa & Fondue Dinner',
      'All Regional Train & Cable Car Access'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Interlaken', desc: 'Scenic train from Zurich to Interlaken. Check in to mountain resort with Lake Thun view.' },
      { day: 2, title: 'Jungfraujoch Top of Europe', desc: 'Cogwheel train ride up to Europe’s highest railway station and Ice Palace walkthrough.' },
      { day: 3, title: 'Glacier Express to Zermatt', desc: 'Panoramic glass-roof train travel through deep gorges and snow-capped peaks.' },
      { day: 4, title: 'Matterhorn Alpine Hike', desc: 'Cable car ride to Matterhorn Glacier Paradise and traditional Swiss fondue night.' },
      { day: 5, title: 'Farewell Switzerland', desc: 'Morning alpine walk, Alpine chocolate tasting, and return departure.' }
    ]
  },
  {
    id: 'pkg-grand-italy',
    title: 'Grand Italy Tour',
    destinationId: 'dest-italy',
    destinationName: 'Rome, Florence & Venice, Italy',
    duration: '10 Days / 9 Nights',
    rating: 5.0,
    reviewsCount: 215,
    category: 'heritage',
    price: 4100,
    originalPrice: 4800,
    discountBadge: 'Popular',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Rome & Venice Private Historian Guide',
      'Wine Tasting & Vineyard Lunch in Tuscany',
      'High-Speed Frecciarossa Train Tickets',
      'Private Gondola Ride in Venice Canals',
      'Skip-the-line Colosseum & Vatican Passes'
    ],
    itinerary: [
      { day: 1, title: 'Rome Eternal City Arrival', desc: 'Welcome dinner and evening stroll through Trevi Fountain and Piazza Navona.' },
      { day: 2, title: 'Vatican & Colosseum VIP', desc: 'Private early-bird access to Sistine Chapel, Vatican Museums, and Colosseum arena.' },
      { day: 3, title: 'Journey to Florence', desc: 'High-speed train to Tuscany, Uffizi Gallery tour, and Ponte Vecchio sunset.' },
      { day: 4, title: 'Tuscan Countryside Wine Estate', desc: 'Full day Chianti vineyard tour with sommelier-led tasting and olive oil workshop.' },
      { day: 5, title: 'Pisa & Lucca Day Excursion', desc: 'Photo stop at Leaning Tower of Pisa and medieval bicycle ride on Lucca walls.' },
      { day: 6, title: 'Venice Floating City Arrival', desc: 'Scenic water taxi ride along Grand Canal to luxury waterfront hotel.' },
      { day: 7, title: 'St. Mark Square & Gondola', desc: 'Doges Palace visit and serene sunset gondola ride with serenading musician.' },
      { day: 8, title: 'Murano & Burano Islands', desc: 'Glassblowing demonstration in Murano and colorful photo walk in Burano.' },
      { day: 9, title: 'Leisure & Gastronomy', desc: 'Pasta & gelato masterclass cooking workshop with Italian chef.' },
      { day: 10, title: 'Departure Venice', desc: 'Breakfast overlooking the lagoon and private water taxi to VCE airport.' }
    ]
  },
  {
    id: 'pkg-bali-paradise',
    title: 'Bali Ultra Paradise Escape',
    destinationId: 'dest-bali',
    destinationName: 'Ubud & Seminyak, Bali',
    duration: '8 Days / 7 Nights',
    rating: 4.9,
    reviewsCount: 180,
    category: 'honeymoon',
    price: 1999,
    originalPrice: 2800,
    discountBadge: '30% OFF',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Private Infinity Pool Villa in Ubud',
      'Floating Breakfast & Flower Bath Spa',
      'Nusa Penida Island Private Speedboat Tour',
      'Volcano Batur Sunrise Jeep Safari',
      'All Meals & Daily Cocktail Credits'
    ],
    itinerary: [
      { day: 1, title: 'Ubud Welcome & Floating Breakfast', desc: 'Private Villa check-in with traditional flower garland welcome.' },
      { day: 2, title: 'Rice Terraces & Jungle Swing', desc: 'Visit Tegalalang rice fields, jungle swing photos, and coffee plantation tasting.' },
      { day: 3, title: 'Mt. Batur Jeep Safari', desc: '4WD sunrise excursion over volcanic black lava fields and hot springs.' },
      { day: 4, title: 'Nusa Penida Day Trip', desc: 'Speedboat to Kelingking T-Rex Beach, Broken Beach, and Angel Billabong.' },
      { day: 5, title: 'Transfer to Beachfront Villa', desc: 'Check in at Seminyak beachfront resort, sunset beach club lounge access.' },
      { day: 6, title: 'Uluwatu Temple & Kecak Fire Dance', desc: 'Cliffside temple tour followed by traditional Kecak dance at sunset.' },
      { day: 7, title: 'Holistic Spa & Candlelight Seafood', desc: '3-hour Balinese massage treatment and romantic Jimbaran seafood dinner.' },
      { day: 8, title: 'Departure DPS Airport', desc: 'Souvenir market visit and VIP airport transfer.' }
    ]
  }
];

export const reviewsData = [
  {
    id: 'rev-1',
    author: 'Sarah Jenkins',
    location: 'Traveled to Maldives',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Perfect Travel made our honeymoon in Maldives absolutely magical! Every detail was handled seamlessly, from airport speedboats to private underwater dinners. Will book every trip with them!'
  },
  {
    id: 'rev-2',
    author: 'Michael Chen',
    location: 'Traveled to Dubai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '1 month ago',
    comment: 'The luxury Dubai package far exceeded my expectations. The concierge support was available 24/7 on WhatsApp, and the desert safari VIP setup was unforgettable.'
  },
  {
    id: 'rev-3',
    author: 'Elena Rodriguez',
    location: 'Traveled to Bali',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Unbeatable prices and even better service! We claimed the summer discount offer and booked our Ubud villa. The floating breakfast and private guide made us feel like royalty.'
  }
];

export const galleryData = [
  {
    id: 'gal-1',
    title: 'Himalayan Mountain Summit',
    location: 'Nepal',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    photographer: 'Alex Rivers',
    category: 'adventure'
  },
  {
    id: 'gal-2',
    title: 'Serene Alpine Lake Canoe',
    location: 'Banff, Canada',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    photographer: 'David Miller',
    category: 'leisure'
  },
  {
    id: 'gal-3',
    title: 'Desert Sunset Highway Drive',
    location: 'Arizona, USA',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
    photographer: 'Jessica Hayes',
    category: 'adventure'
  },
  {
    id: 'gal-4',
    title: 'Luxury Lakeside Retreat',
    location: 'Lake Como, Italy',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    photographer: 'Marco Bellini',
    category: 'honeymoon'
  }
];

export const whyUsData = [
  {
    id: 'guarantee',
    icon: 'payments',
    title: 'Best Price Guarantee',
    desc: 'We match any lower competitor price and refund 100% of the difference.'
  },
  {
    id: 'security',
    icon: 'security',
    title: 'Secure Booking',
    desc: '256-bit encrypted checkout with instant reservation protection and zero hidden fees.'
  },
  {
    id: 'support',
    icon: 'support_agent',
    title: '24/7 Dedicated Support',
    desc: 'Personal travel concierges ready on chat, phone, and WhatsApp round-the-clock.'
  },
  {
    id: 'experience',
    icon: 'travel_explore',
    title: 'Curated Experiences',
    desc: 'Handpicked local guides, VIP skip-the-line privileges, and secret spot access.'
  }
];
