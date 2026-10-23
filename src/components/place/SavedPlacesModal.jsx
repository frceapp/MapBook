import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bookmark,
  MapPin,
  BookOpen,
  Trash2,
  Navigation,
  Star,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_CONFIG } from '../../services/yogyakartaPlaces';

/**
 * Saved Places Modal (Daftar Rencana Kunjungan / Wishlist Yogyakarta)
 * Opened from BottomNavigation "Saved" tab.
 */
export default function SavedPlacesModal() {
  const {
    isSavedModalOpen,
    setIsSavedModalOpen,
    savedPlaces,
    places,
    selectPlaceOnMap,
    openAddJournalModal,
    handleToggleSaved,
    isPlaceVisited,
  } = useApp();

  if (!isSavedModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="saved-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsSavedModalOpen(false)}
        className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-[#5C4033]/25 backdrop-blur-[2px]"
      >
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.97 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[680px] max-h-[82vh] flex flex-col rounded-3xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_8px_0_#5C4033] p-5 md:p-6 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#5C4033]/15 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFE699] border-2 border-[#5C4033] flex items-center justify-center shadow-[0_3px_0_#5C4033]">
                <Bookmark className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#5C4033] leading-[1.35]">
                  Rencana Kunjungan (Saved)
                </h2>
                <p className="text-[12px] font-medium text-[#8C7365]">
                  {savedPlaces.length} destinasi literasi Yogyakarta disimpan untuk dikunjungi
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSavedModalOpen(false)}
              aria-label="Tutup daftar simpanan"
              className="w-10 h-10 rounded-xl bg-[#F5EFE6] hover:bg-[#FF8A8A]/40 border-2 border-[#5C4033] text-[#5C4033] flex items-center justify-center shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
            >
              <X className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
            </button>
          </div>

          {/* Saved List Body */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {savedPlaces.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-2xl bg-[#F5EFE6] border-[1.5px] border-[#5C4033]/30">
                <Bookmark
                  className="w-10 h-10 mx-auto mb-2 text-[#8C7365]"
                  strokeWidth={2}
                />
                <h3 className="text-[16px] font-semibold text-[#5C4033]">
                  Belum Ada Tempat yang Disimpan
                </h3>
                <p className="text-sm text-[#8C7365] mt-1 max-w-md mx-auto">
                  Klik salah satu pin Museum, Cafe Book, atau Perpustakaan di peta Yogyakarta, lalu pilih tombol <b>Save for Later</b>.
                </p>
              </div>
            ) : (
              savedPlaces.map((savedItem) => {
                const placeDetail =
                  places.find((p) => p.placeId === savedItem.placeId) || savedItem;
                const catInfo =
                  CATEGORY_CONFIG[savedItem.category] || CATEGORY_CONFIG.museum;
                const visited = isPlaceVisited(savedItem.placeId);

                return (
                  <div
                    key={savedItem.placeId}
                    className="p-4 rounded-2xl bg-[#FFFDF9] border-[1.5px] border-[#5C4033] shadow-[0_3px_0_#5C4033] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      {placeDetail.photos?.[0] && (
                        <img
                          src={placeDetail.photos[0]}
                          alt={savedItem.placeName}
                          className="w-20 h-20 rounded-xl object-cover border border-[#5C4033] shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className="px-2.5 py-0.5 rounded-full border border-[#5C4033] text-[12px] font-medium text-[#5C4033]"
                            style={{ backgroundColor: catInfo.colorHex }}
                          >
                            {catInfo.label}
                          </span>
                          {visited && (
                            <span className="px-2 py-0.5 rounded-full bg-[#88D49E] border border-[#5C4033] text-[11px] font-bold text-[#5C4033]">
                              ✓ Dikunjungi
                            </span>
                          )}
                          {placeDetail.rating && (
                            <span className="text-xs font-bold text-[#5C4033] flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-[#FFE699] text-[#5C4033]" />
                              {placeDetail.rating}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-[#5C4033] truncate">
                          {savedItem.placeName}
                        </h4>

                        <p className="text-[12px] text-[#8C7365] flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#5C4033] shrink-0" />
                          <span className="truncate">
                            {placeDetail.district || placeDetail.address || 'Yogyakarta'}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons (Touch target >= 40px) */}
                    <div className="flex items-center gap-2 shrink-0 justify-end">
                      <button
                        type="button"
                        onClick={() => selectPlaceOnMap(placeDetail)}
                        className="h-10 px-3 rounded-xl bg-[#A0E7E5] border-[1.5px] border-[#5C4033] text-xs font-bold text-[#5C4033] shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#5C4033]" strokeWidth={2} />
                        <span>Lihat di Peta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSavedModalOpen(false);
                          openAddJournalModal(placeDetail);
                        }}
                        className="h-10 px-3 rounded-xl bg-[#FFB7C5] border-[1.5px] border-[#5C4033] text-xs font-bold text-[#5C4033] shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#5C4033]" strokeWidth={2} />
                        <span>Tulis Jurnal</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleSaved(placeDetail)}
                        title="Hapus dari Saved"
                        aria-label="Hapus dari Saved"
                        className="w-10 h-10 rounded-xl bg-[#F5EFE6] hover:bg-[#FF8A8A]/40 border-[1.5px] border-[#5C4033] text-[#5C4033] flex items-center justify-center shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none"
                      >
                        <Trash2 className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
