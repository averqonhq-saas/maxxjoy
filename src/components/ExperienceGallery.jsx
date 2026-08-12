import React from 'react';
import { useApp } from '../context/AppContext';
import { galleryData } from '../data/travelData';

const GalleryCard = ({ photo, onClick }) => (
  <div
    onClick={onClick}
    className="relative w-full h-full rounded-3xl overflow-hidden group cursor-pointer border border-[#E2E8F0] shadow-md hover:shadow-2xl transition-all duration-500"
  >
    <img
      src={photo.image}
      alt={photo.title}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
      <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">
        📍 {photo.location}
      </span>
      <h4 className="text-white text-lg font-bold font-header">{photo.title}</h4>
      <p className="text-white/80 text-xs mt-1">Photo by {photo.photographer}</p>
    </div>
  </div>
);

export const ExperienceGallery = () => {
  const { setSelectedPhotoForLightbox } = useApp();
  const photos = galleryData.slice(0, 4);

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#0A4D8C] uppercase tracking-widest block mb-2">
            Real Traveler Moments
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] font-header">
            Experience Gallery
          </h2>
          <p className="text-[#64748B] text-sm mt-1">
            Snapshots captured and shared by our worldwide traveler community
          </p>
        </div>
        <button
          onClick={() => setSelectedPhotoForLightbox(photos[0])}
          className="text-[#0A4D8C] font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
        >
          <span>Open Fullscreen Gallery</span>
          <span className="material-symbols-outlined text-base">fullscreen</span>
        </button>
      </div>

      {/* ── Mobile: simple stack ────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:hidden">
        {photos.map((photo) => (
          <div key={photo.id} className="relative min-h-[220px]">
            <GalleryCard photo={photo} onClick={() => setSelectedPhotoForLightbox(photo)} />
          </div>
        ))}
      </div>

      {/* ── Desktop: explicit bento (no auto-placement = no gaps) ── */}
      <div
        className="hidden md:grid gap-4"
        style={{
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows:    '280px 280px',
        }}
      >
        {/* [0] Large hero — column 1, rows 1-2 */}
        <div style={{ gridColumn: '1 / 2', gridRow: '1 / 3' }}>
          <GalleryCard photo={photos[0]} onClick={() => setSelectedPhotoForLightbox(photos[0])} />
        </div>

        {/* [1] Top-right small — column 2, row 1 */}
        <div style={{ gridColumn: '2 / 3', gridRow: '1 / 2' }}>
          <GalleryCard photo={photos[1]} onClick={() => setSelectedPhotoForLightbox(photos[1])} />
        </div>

        {/* [2] Top-right small — column 3, row 1 */}
        <div style={{ gridColumn: '3 / 4', gridRow: '1 / 2' }}>
          <GalleryCard photo={photos[2]} onClick={() => setSelectedPhotoForLightbox(photos[2])} />
        </div>

        {/* [3] Wide bottom — columns 2-3, row 2 */}
        <div style={{ gridColumn: '2 / 4', gridRow: '2 / 3' }}>
          <GalleryCard photo={photos[3]} onClick={() => setSelectedPhotoForLightbox(photos[3])} />
        </div>
      </div>
    </section>
  );
};
