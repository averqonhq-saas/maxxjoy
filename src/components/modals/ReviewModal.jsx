import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const ReviewModal = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, addReview, user, destinationsList } = useApp();
  
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [trip, setTrip] = useState('');
  const [comment, setComment] = useState('');

  // Pre-fill user name if logged in
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  if (!isReviewModalOpen) return null;

  const popularTrips = (destinationsList || []).map(d => d.title).filter(Boolean);

  const RATING_LABELS = {
    1: 'Poor (1★)',
    2: 'Fair (2★)',
    3: 'Good (3★)',
    4: 'Great (4★)',
    5: 'Exceptional (5★)'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment) return;
    
    addReview({
      name,
      trip: trip || 'Verified Tour',
      rating,
      comment
    });

    setName(user?.name || '');
    setTrip('');
    setComment('');
    setRating(5);
    setIsReviewModalOpen(false);
  };

  const activeStar = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsReviewModalOpen(false)}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white mx-auto flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30">
            <span className="material-symbols-outlined text-3xl">rate_review</span>
          </div>
          <h3 className="text-2xl font-black font-header text-slate-900">Write A Review</h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Share your travel experience with our global community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star Rating Picker */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-center">
            <label className="text-xs font-black uppercase text-amber-900 block mb-2 tracking-wider">
              {RATING_LABELS[activeStar]}
            </label>
            <div className="flex items-center justify-center gap-1 py-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-3xl ${star <= activeStar ? 'fill-current text-amber-500' : 'text-slate-300'}`}>
                    star
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Traveler Name */}
          <div>
            <label className="text-xs font-extrabold block mb-1 text-slate-800">Your Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
              required
            />
          </div>

          {/* Destination / Tour Traveled */}
          <div>
            <label className="text-xs font-extrabold block mb-1 text-slate-800">Destination or Tour Traveled *</label>
            <input
              type="text"
              placeholder="e.g. Dubai Luxury Escape"
              value={trip}
              onChange={(e) => setTrip(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
              required
            />
            {/* Quick Trip Selectors */}
            {popularTrips.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {popularTrips.slice(0, 4).map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTrip(t)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0A4D8C] hover:text-white text-slate-700 transition-colors"
                  >
                    + {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Review Message */}
          <div>
            <label className="text-xs font-extrabold block mb-1 text-slate-800">Your Review Experience *</label>
            <textarea
              rows={3}
              placeholder="What were the highlights of your trip? How was the service, hotel, and private transfers?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#0A4D8C] text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#073c6e] shadow-lg shadow-[#0A4D8C]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">send</span>
            <span>Submit Review</span>
          </button>
        </form>
      </div>
    </div>
  );
};
