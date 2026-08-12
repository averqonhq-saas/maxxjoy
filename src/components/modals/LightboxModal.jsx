import React from 'react';
import { useApp } from '../../context/AppContext';
import { galleryData } from '../../data/travelData';

export const LightboxModal = () => {
  const { selectedPhotoForLightbox, setSelectedPhotoForLightbox } = useApp();

  if (!selectedPhotoForLightbox) return null;

  const currentIndex = galleryData.findIndex(p => p.id === selectedPhotoForLightbox.id);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % galleryData.length;
    setSelectedPhotoForLightbox(galleryData[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + galleryData.length) % galleryData.length;
    setSelectedPhotoForLightbox(galleryData[prevIdx]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
      <button
        onClick={() => setSelectedPhotoForLightbox(null)}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center z-50 text-lg"
      >
        ✕
      </button>

      {/* Prev / Next controls */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50"
      >
        <span className="material-symbols-outlined text-2xl">arrow_back</span>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50"
      >
        <span className="material-symbols-outlined text-2xl">arrow_forward</span>
      </button>

      <div className="max-w-4xl w-full flex flex-col items-center">
        <img
          src={selectedPhotoForLightbox.image}
          alt={selectedPhotoForLightbox.title}
          className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
        />

        <div className="mt-4 text-center text-white">
          <h4 className="text-xl font-bold font-header">{selectedPhotoForLightbox.title}</h4>
          <p className="text-xs text-white/70 mt-1">📍 {selectedPhotoForLightbox.location} · Photo by {selectedPhotoForLightbox.photographer}</p>
        </div>
      </div>
    </div>
  );
};
