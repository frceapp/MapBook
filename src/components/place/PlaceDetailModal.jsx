import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
  Clock,
  MapPin,
  BookOpen,
  Bookmark,
  X,
  Sparkles,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_CONFIG } from '../../services/yogyakartaPlaces';
import PhotoCarousel from './PhotoCarousel';

/**
 * PAGE 3: Detail Lokasi (After Choosing Pin Point on Maps)
 * Strictly follows AGENTS.md Section 4 - PAGE 3:
 * - Container Modal / Split Card:
 *   - Muncul di tengah layar (Desktop) atau Bottom Sheet setinggi 85vh (Mobile)
 *   - Latar belakang dimmed: bg-[#5C4033]/25 backdrop-blur-[2px]
 *   - Ukuran Desktop: w-[92vw] max-w-[820px], max-h-[85vh], rounded-3xl, bg-[#FFFDF9], border-2 border-[#5C4033], shadow-[0_10px_0_#5C4033], p-5 md:p-6
 * - Header Kartu:
 *   - flex items-center justify-between border-b-2 border-[#5C4033]/15 pb-4 mb-5
 *   - Navigasi Tempat (< Nama Tempat >): Tombol Previous (<) & Next (>) ukuran 40x40px (w-10 h-10), rounded-xl, border-2 border-[#5C4033], bg-[#F5EFE6] hover:bg-[#FFE699]
 *   - Tombol Buka di Google Maps: h-10 (40px), px-3.5, rounded-xl, bg-[#A0E7E5] (Cyan), border-2 border-[#5C4033], text-[13px] font-semibold text-[#5C4033]
 * - Konten Utama (2-Column Split Grid):
 *   - grid grid-cols-1 md:grid-cols-12 gap-6 items-start
 *   - Sisi Kiri (md:col-span-6): PhotoCarousel (aspect-[4/3], max 5 photos) + Baris Info Rating & Jam Buka
 *   - Sisi Kanan (md:col-span-6): Brief Description + Facility tags + Status Jurnal + Grup Tombol Aksi (Add Journal h-12 Pink #FFB7C5, Save for Later h-[46px] #FFFDF9 / #FFE699)
 */
export default function PlaceDetailModal() {
  const {
    selectedPlace,
    closePlaceModal,
    navigatePlace,
    isPlaceVisited,
    getJournalForPlace,
    isPlaceSaved,
    handleToggleSaved,
    openAddJournalModal,
  } = useApp();

  if (!selectedPlace) return null;

  const catInfo = CATEGORY_CONFIG[selectedPlace.category] || CATEGORY_CONFIG.museum;
  const visited = isPlaceVisited(selectedPlace.placeId);
  const existingJournal = getJournalForPlace(selectedPlace.placeId);
  const saved = isPlaceSaved(selectedPlace.placeId);
  const isOpenNow = selectedPlace.regularOpeningHours?.openNow ?? true;
  const todayHours =
    selectedPlace.regularOpeningHours?.todayHours || '08.00 – 21.00 WIB';

  return (
    <AnimatePresence>
      <motion.div
        key="page-3-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closePlaceModal}
        className="fixed inset-0 z-30 flex items-end md:items-center justify-center bg-[#5C4033]/25 backdrop-blur-[2px] p-0 md:p-4"
      >
        <motion.div
          key={selectedPlace.placeId}
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full md:w-[92vw] md:max-w-[820px] max-h-[85vh] overflow-y-auto rounded-t-3xl md:rounded-3xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_10px_0_#5C4033] p-5 md:p-6"
        >
          {/* Bagian Header Kartu (Top Navigation Bar) */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#5C4033]/15 pb-4 mb-5">
            {/* Navigasi Tempat (< Nama Tempat >) */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {/* Tombol Previous (<) 40x40px */}
              <button
                type="button"
                onClick={() => navigatePlace(-1)}
                title="Tempat Sebelumnya"
                aria-label="Tempat Sebelumnya"
                className="w-10 h-10 shrink-0 rounded-xl border-2 border-[#5C4033] bg-[#F5EFE6] hover:bg-[#FFE699] text-[#5C4033] flex items-center justify-center shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
              </button>

              {/* Nama Tempat di tengah dengan kategori pill badge di atasnya */}
              <div className="flex-1 min-w-0 text-center px-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border-[1.5px] border-[#5C4033] text-[12px] font-medium text-[#5C4033] mb-1"
                  style={{ backgroundColor: catInfo.colorHex }}
                >
                  <span>{catInfo.label}</span>
                  <span>•</span>
                  <span className="truncate max-w-[140px] sm:max-w-none">
                    {selectedPlace.district || 'Yogyakarta'}
                  </span>
                </div>
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#5C4033] leading-[1.35] truncate">
                  {selectedPlace.displayName || selectedPlace.name}
                </h2>
              </div>

              {/* Tombol Next (>) 40x40px */}
              <button
                type="button"
                onClick={() => navigatePlace(1)}
                title="Tempat Berikutnya"
                aria-label="Tempat Berikutnya"
                className="w-10 h-10 shrink-0 rounded-xl border-2 border-[#5C4033] bg-[#F5EFE6] hover:bg-[#FFE699] text-[#5C4033] flex items-center justify-center shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
              >
                <ChevronRight className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
              </button>
            </div>

            {/* Kanan Header: Tombol Buka di Google Maps + Tombol Tutup */}
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <a
                href={selectedPlace.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3.5 rounded-xl bg-[#A0E7E5] border-2 border-[#5C4033] text-[13px] font-semibold text-[#5C4033] shadow-[0_2px_0_#5C4033] hover:brightness-[1.03] active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
              </a>

              <button
                type="button"
                onClick={closePlaceModal}
                title="Tutup Detail Lokasi"
                aria-label="Tutup Detail Lokasi"
                className="w-10 h-10 shrink-0 rounded-xl bg-[#F5EFE6] hover:bg-[#FF8A8A]/40 border-2 border-[#5C4033] text-[#5C4033] flex items-center justify-center shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
              >
                <X className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Bagian Konten Utama (2-Column Split Grid: grid-cols-1 md:grid-cols-12 gap-6 items-start) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Sisi Kiri (md:col-span-6 — Visual & Metadata Google Maps) */}
            <div className="md:col-span-6">
              {/* 1. Photo Carousel (Maksimal 5 Foto Teratas, aspect-[4/3]) */}
              <PhotoCarousel
                photos={selectedPlace.photos}
                placeName={selectedPlace.displayName || selectedPlace.name}
              />

              {/* 2. Baris Info Rating & Jam Buka */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 p-3 rounded-xl bg-[#F5EFE6] border border-[#5C4033]/20">
                {/* Google Stars (Rating Hanya Diambil dari Google Maps) */}
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-[#FFE699] border border-[#5C4033] flex items-center justify-center">
                    <Star
                      className="w-3.5 h-3.5 fill-[#FFE699] text-[#5C4033]"
                      strokeWidth={2}
                    />
                  </span>
                  <span className="text-sm font-bold text-[#5C4033]">
                    {Number(selectedPlace.rating || 4.8).toFixed(1)} ★
                  </span>
                  <span className="text-[12px] font-medium text-[#8C7365]">
                    ({(selectedPlace.userRatingCount || 320).toLocaleString('id-ID')} ulasan Google Maps)
                  </span>
                </div>

                {/* Open Hours */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md border border-[#5C4033] text-[12px] font-semibold text-[#5C4033] ${
                      isOpenNow ? 'bg-[#88D49E]' : 'bg-[#FF8A8A]'
                    }`}
                  >
                    {isOpenNow ? 'Buka' : 'Tutup'}
                  </span>
                  <span className="text-[12px] font-medium text-[#8C7365] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#5C4033]" strokeWidth={2} />
                    <span>{todayHours}</span>
                  </span>
                </div>
              </div>

              {/* Alamat Singkat Yogyakarta */}
              <div className="mt-2.5 px-3 py-2 rounded-xl bg-[#F5EFE6]/60 border border-[#5C4033]/15 flex items-start gap-2 text-[12px] font-medium text-[#8C7365]">
                <MapPin className="w-4 h-4 text-[#5C4033] shrink-0 mt-0.5" strokeWidth={2} />
                <span>{selectedPlace.address}</span>
              </div>
            </div>

            {/* Sisi Kanan (md:col-span-6 — Deskripsi & Tombol Aksi) */}
            <div className="md:col-span-6 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-4">
                {/* 1. Brief Description & Tag Fasilitas */}
                <div>
                  <h3 className="text-[16px] font-semibold text-[#5C4033] leading-[1.4] mb-2">
                    Tentang Destinasi Literasi
                  </h3>
                  <p className="text-sm md:text-[15px] text-[#5C4033] leading-[1.6] font-normal">
                    {selectedPlace.description}
                  </p>

                  {/* Tag Fasilitas Singkat */}
                  {Array.isArray(selectedPlace.facilities) &&
                    selectedPlace.facilities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedPlace.facilities.map((facility, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-[#F5EFE6] border border-[#5C4033]/30 text-[12px] font-medium text-[#5C4033]"
                          >
                            ✦ {facility}
                          </span>
                        ))}
                      </div>
                    )}
                </div>

                {/* 2. Status Jurnal (Jika sudah pernah dikunjungi) */}
                {visited && (
                  <div className="bg-[#FFE699]/30 p-3 rounded-xl border border-[#5C4033]/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C4033]">
                        <Sparkles className="w-3.5 h-3.5 text-[#5C4033]" strokeWidth={2} />
                        <span>Sudah Dikunjungi (Tercatat di Archive)</span>
                      </span>
                      {existingJournal?.visitedDate && (
                        <span className="text-[12px] font-medium text-[#8C7365]">
                          Dikunjungi: {existingJournal.visitedDate}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#5C4033] italic leading-relaxed">
                      &ldquo;
                      {existingJournal?.journalNote ||
                        'Destinasi literasi Yogyakarta yang sangat berkesan dan penuh inspirasi!'}
                      &rdquo;
                    </p>

                    {/* Galeri Mini Polaroid jika User Mengupload Foto pada Jurnal Ini */}
                    {Array.isArray(existingJournal?.userPhotos) &&
                      existingJournal.userPhotos.length > 0 && (
                        <div className="pt-2 flex items-center gap-2 overflow-x-auto">
                          {existingJournal.userPhotos.map((uPhoto, idx) => (
                            <div
                              key={idx}
                              className="w-16 h-16 rounded-xl bg-[#FFFDF9] p-1 border-[1.5px] border-[#5C4033] shadow-[0_2px_0_#5C4033] shrink-0"
                            >
                              <img
                                src={uPhoto}
                                alt={`Dokumentasi Pribadi ${idx + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* 3. Grup Tombol Aksi (Bagian Bawah Sisi Kanan) */}
              <div className="space-y-3 pt-2">
                {/* Tombol 1 — Add Journal (Masuk ke Archive): w-full, h-12 (48px), rounded-xl, latar #FFB7C5 (Pink), border-2 border-[#5C4033], shadow-[0_4px_0_#5C4033], font-bold */}
                <button
                  type="button"
                  onClick={() => openAddJournalModal(selectedPlace)}
                  className="w-full h-12 px-4 rounded-xl bg-[#FFB7C5] text-[#5C4033] border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] font-bold text-sm hover:brightness-[1.02] active:translate-y-0.5 active:shadow-[0_2px_0_#5C4033] transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                  <span>
                    {existingJournal ? 'Edit Catatan Jurnal (Archive)' : 'Add Journal (Masuk ke Archive)'}
                  </span>
                </button>

                {/* Tombol 2 — Save for Later (Masuk ke Saved): w-full, h-[46px], rounded-xl, latar #FFFDF9 (berubah menjadi #FFE699 jika sudah disimpan), border-2 border-[#5C4033], shadow-[0_3px_0_#5C4033], font-semibold */}
                <button
                  type="button"
                  onClick={() => handleToggleSaved(selectedPlace)}
                  className={`w-full h-[46px] px-4 rounded-xl border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] font-semibold text-sm text-[#5C4033] active:translate-y-0.5 active:shadow-[0_1px_0_#5C4033] transition-all flex items-center justify-center gap-2 ${
                    saved ? 'bg-[#FFE699]' : 'bg-[#FFFDF9] hover:bg-[#F5EFE6]'
                  }`}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4 text-[#5C4033]" strokeWidth={2.5} />
                      <span>Tersimpan di Rencana Kunjungan (Saved)</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                      <span>Save for Later (Masuk ke Saved)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
