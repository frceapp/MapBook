import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

/**
 * PAGE 3: Photo Carousel (Maksimal 5 Foto Teratas)
 * Strictly follows AGENTS.md Section 4 - PAGE 3 & Section 6 Checklist:
 * - Rasio Aspek tetap: 4:3 (aspect-[4/3]), zero layout shift saat berganti foto
 * - Bentuk: rounded-2xl, overflow-hidden, border-2 border-[#5C4033]
 * - Kontrol Geser: Tombol panah kiri/kanan berukuran 36x36px (w-9 h-9 bg-[#FFFDF9]/90 rounded-full)
 * - 5 indikator titik (pagination dots) di bagian bawah tengah foto
 */
export default function PhotoCarousel({ photos = [], placeName = 'Lokasi Yogyakarta' }) {
  // Strictly cap at 5 photos per AGENTS.md
  const topFivePhotos = (photos || []).slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset to first photo when switching between places
  useEffect(() => {
    setActiveIndex(0);
  }, [placeName]);

  if (topFivePhotos.length === 0) {
    return (
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#5C4033] bg-[#F5EFE6] flex flex-col items-center justify-center text-[#8C7365]">
        <ImageIcon className="w-8 h-8 mb-2 text-[#8C7365]" strokeWidth={2} />
        <span className="text-xs font-medium">Foto belum tersedia</span>
      </div>
    );
  }

  const goPrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + topFivePhotos.length) % topFivePhotos.length);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % topFivePhotos.length);
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#5C4033] bg-[#F5EFE6] select-none">
      {/* Main Photo (Zero Layout Shift fixed aspect-[4/3]) */}
      <img
        src={topFivePhotos[activeIndex]}
        alt={`${placeName} — Foto ${activeIndex + 1} dari ${topFivePhotos.length}`}
        className="w-full h-full object-cover transition-opacity duration-200"
      />

      {/* Subtle Bottom Gradient for Pagination Dots Readability */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#5C4033]/40 to-transparent" />

      {/* Kontrol Geser Kiri/Kanan (36x36px -> w-9 h-9, bg-[#FFFDF9]/90 rounded-full) */}
      {topFivePhotos.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Foto sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#FFFDF9]/90 hover:bg-[#FFE699] text-[#5C4033] rounded-full border-[1.5px] border-[#5C4033] shadow-[0_2px_0_#5C4033] active:translate-y-[-46%] flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-4 h-4 text-[#5C4033]" strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Foto berikutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#FFFDF9]/90 hover:bg-[#FFE699] text-[#5C4033] rounded-full border-[1.5px] border-[#5C4033] shadow-[0_2px_0_#5C4033] active:translate-y-[-46%] flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-4 h-4 text-[#5C4033]" strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* 5 Indikator Titik (Pagination Dots) di bagian bawah tengah foto */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFDF9]/85 border border-[#5C4033]/40 z-10">
        {topFivePhotos.map((_, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(idx);
              }}
              aria-label={`Tampilkan foto ${idx + 1}`}
              className={`h-2.5 rounded-full border border-[#5C4033] transition-all ${
                isCurrent ? 'w-5 bg-[#FFE699]' : 'w-2.5 bg-[#FFFDF9]'
              }`}
            />
          );
        })}
      </div>

      {/* Top-Left Google Maps Photo Source Badge */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FFFDF9]/90 border border-[#5C4033] text-[11px] font-bold text-[#5C4033]">
        Foto Google Maps
      </div>

      {/* Top-Right Counter Badge */}
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#FFFDF9]/90 border border-[#5C4033] text-[11px] font-bold text-[#5C4033]">
        {activeIndex + 1} / {topFivePhotos.length} Foto
      </div>
    </div>
  );
}
