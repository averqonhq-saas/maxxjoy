import React from 'react';
import { useApp } from '../context/AppContext';

export const ReviewsSection = () => {
  const { setIsReviewModalOpen, reviewsList } = useApp();

  return (
    <section className="py-24 bg-[#F5F9FC] px-4 sm:px-6 transition-colors border-y border-[#E2E8F0]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
          <div>
            <span className="text-xs font-extrabold text-[#0A4D8C] uppercase tracking-widest block mb-2">
              Verified Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] font-header">
              What Travelers Say
            </h2>
            <p className="text-[#64748B] text-sm mt-1">
              Read authentic stories from guests who explored the world with us
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-[#0A4D8C] text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#073c6e] transition-colors shadow-md cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">rate_review</span>
            Write A Review
          </button>
        </div>

        {reviewsList.length === 0 ? (
          /* Empty state */
          <div className="bg-white p-12 rounded-3xl text-center border border-[#E2E8F0] shadow-sm max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">rate_review</span>
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A]">No Reviews Written Yet</h3>
            <p className="text-xs text-[#64748B]">Be the first traveler to share your experience with Maxxjoy Travel!</p>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-[#FF7A00] text-white text-xs font-extrabold px-6 py-3 rounded-xl hover:bg-[#e56e00] shadow-md transition-all inline-block"
            >
              Write First Review ★
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {reviewsList.map((rev, idx) => (
              <div
                key={rev.id || idx}
                className="bg-white p-8 rounded-3xl shadow-sm border border-[#E2E8F0] flex flex-col justify-between hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Star rating */}
                  <div className="flex items-center gap-1 mb-6 text-amber-500">
                    {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-xl fill-current">
                        star
                      </span>
                    ))}
                  </div>

                  <p className="text-[#1A1A1A] italic text-sm leading-relaxed mb-8">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-[#E2E8F0]">
                  <img
                    src={rev.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.author || 'User')}&background=0A4D8C&color=fff`}
                    alt={rev.author}
                    className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-[#0A4D8C]/20"
                  />
                  <div>
                    <p className="font-extrabold text-[#1A1A1A] text-sm font-header">
                      {rev.author}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {rev.location || 'Verified Guest'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
