import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Calendar, MapPin, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_CONFIG } from '../../services/yogyakartaPlaces';

/**
 * Sub-Modal / Form Input Jurnal (Add / Edit Journal)
 * - Input tanggal kunjungan dan cerita jurnal (tanpa input rating manual dari pengguna)
 * - Rating murni diambil langsung dari Google Maps (`currentPlace.rating`)
 * - Disimpan ke koleksi users/{userId}/archives/{placeId}
 */
export default function JournalFormModal() {
  const {
    user,
    isJournalModalOpen,
    setIsJournalModalOpen,
    journalTargetPlaceId,
    places,
    getJournalForPlace,
    handleSaveJournal,
    setIsAdminModalOpen,
  } = useApp();

  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [visitedDate, setVisitedDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [journalNote, setJournalNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const isAdmin =
    user?.role === 'admin' || user?.username?.toLowerCase() === 'admin';

  useEffect(() => {
    if (!isJournalModalOpen) return;
    const initialId = journalTargetPlaceId || places[0]?.placeId || '';
    setSelectedPlaceId(initialId);

    const existing = getJournalForPlace(initialId);
    if (existing) {
      setVisitedDate(existing.visitedDate || new Date().toISOString().split('T')[0]);
      setJournalNote(existing.journalNote || '');
    } else {
      setVisitedDate(new Date().toISOString().split('T')[0]);
      setJournalNote('');
    }
    setErrorMsg('');
  }, [isJournalModalOpen, journalTargetPlaceId, places, getJournalForPlace]);

  const handlePlaceChange = (newPlaceId) => {
    setSelectedPlaceId(newPlaceId);
    const existing = getJournalForPlace(newPlaceId);
    if (existing) {
      setVisitedDate(existing.visitedDate || new Date().toISOString().split('T')[0]);
      setJournalNote(existing.journalNote || '');
    } else {
      setJournalNote('');
    }
  };

  if (!isJournalModalOpen) return null;

  const currentPlace =
    places.find((p) => p.placeId === selectedPlaceId || p.id === selectedPlaceId) ||
    places[0];
  const catInfo =
    CATEGORY_CONFIG[currentPlace?.category] || CATEGORY_CONFIG.museum;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!currentPlace) {
      setErrorMsg('Pilih lokasi di Yogyakarta terlebih dahulu.');
      return;
    }
    if (!journalNote.trim()) {
      setErrorMsg('Tuliskan cerita pengalaman atau kesan kunjunganmu terlebih dahulu.');
      return;
    }

    setSaving(true);
    try {
      await handleSaveJournal({
        placeId: currentPlace.placeId,
        placeName: currentPlace.displayName || currentPlace.name,
        category: currentPlace.category,
        visitedDate,
        googleRating: Number(currentPlace.rating || 4.8),
        journalNote: journalNote.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="journal-form-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsJournalModalOpen(false)}
        className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#5C4033]/30 backdrop-blur-[2px] overflow-y-auto"
      >
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[500px] rounded-3xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_8px_0_#5C4033] p-5 md:p-6 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#5C4033]/15 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFB7C5] border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#5C4033] leading-[1.35]">
                  Jurnal Eksplorasi Jogja
                </h2>
                <p className="text-[12px] font-medium text-[#8C7365]">
                  Dokumentasikan cerita kunjunganmu ke dalam Archive
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsJournalModalOpen(false)}
              aria-label="Tutup form jurnal"
              className="w-10 h-10 rounded-xl bg-[#F5EFE6] hover:bg-[#FF8A8A]/40 border-2 border-[#5C4033] text-[#5C4033] flex items-center justify-center shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
            >
              <X className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#FF8A8A]/30 border-[1.5px] border-[#5C4033] text-xs font-semibold text-[#5C4033]">
              {errorMsg}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Pilih Tempat di Yogyakarta */}
            <div>
              <label
                htmlFor="journal-place-select"
                className="flex items-center justify-between text-xs font-semibold text-[#5C4033] mb-1.5"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#5C4033]" strokeWidth={2} />
                  <span>Lokasi di Yogyakarta</span>
                </span>
                <span
                  className="px-2 py-0.5 rounded-full border border-[#5C4033] text-[11px] font-semibold text-[#5C4033]"
                  style={{ backgroundColor: catInfo.colorHex }}
                >
                  {catInfo.label}
                </span>
              </label>

              {places.length === 0 ? (
                <div className="p-3 rounded-2xl bg-[#F5EFE6] border-[1.5px] border-[#5C4033] flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#8C7365]">
                    Belum ada lokasi yang diinput Admin.
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsJournalModalOpen(false);
                        setIsAdminModalOpen(true);
                      }}
                      className="h-9 px-3 rounded-xl bg-[#FFE699] text-[#5C4033] text-xs font-bold border border-[#5C4033]"
                    >
                      Input di Admin
                    </button>
                  )}
                </div>
              ) : (
                <select
                  id="journal-place-select"
                  value={selectedPlaceId}
                  onChange={(e) => handlePlaceChange(e.target.value)}
                  className="w-full h-[46px] px-3.5 rounded-2xl bg-[#F5EFE6] text-[#5C4033] text-sm font-semibold border-[1.5px] border-[#5C4033] focus:outline-none"
                >
                  {places.map((p) => (
                    <option key={p.placeId} value={p.placeId}>
                      [{CATEGORY_CONFIG[p.category]?.label}] {p.displayName || p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Info Rating dari Google Maps (Read-Only, Tidak Ada Input Rating User) */}
            {currentPlace && (
              <div className="p-3 rounded-2xl bg-[#F5EFE6] border-[1.5px] border-[#5C4033]/30 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#8C7365]">
                  Rating Lokasi (Sumber Google Maps):
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#FFE699] border border-[#5C4033] text-xs font-bold text-[#5C4033] inline-flex items-center gap-1">
                  <Star
                    className="w-3.5 h-3.5 fill-[#5C4033] text-[#5C4033]"
                    strokeWidth={2}
                  />
                  <span>
                    {Number(currentPlace.rating || 4.8).toFixed(1)} ★ (
                    {(currentPlace.userRatingCount || 320).toLocaleString('id-ID')}{' '}
                    ulasan)
                  </span>
                </span>
              </div>
            )}

            {/* Tanggal Kunjungan */}
            <div>
              <label
                htmlFor="journal-date-input"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5C4033] mb-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#5C4033]" strokeWidth={2} />
                <span>Tanggal Kunjungan</span>
              </label>
              <input
                id="journal-date-input"
                type="date"
                value={visitedDate}
                onChange={(e) => setVisitedDate(e.target.value)}
                className="w-full h-[46px] px-4 rounded-2xl bg-[#FFFDF9] text-[#5C4033] text-sm font-medium border-[1.5px] border-[#5C4033] focus:outline-none"
              />
            </div>

            {/* Cerita Jurnal */}
            <div>
              <label
                htmlFor="journal-note-textarea"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5C4033] mb-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5C4033]" strokeWidth={2} />
                <span>Cerita Jurnal & Kesan Eksplorasi</span>
              </label>
              <textarea
                id="journal-note-textarea"
                rows={4}
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="Ceritakan koleksi museum yang paling berkesan, buku yang kamu baca, atau suasana sudut baca favoritmu di Yogyakarta..."
                className="w-full p-3.5 rounded-2xl bg-[#FFFDF9] text-[#5C4033] placeholder:text-[#8C7365] text-sm leading-[1.6] border-[1.5px] border-[#5C4033] focus:outline-none"
              />
            </div>

            {/* Tombol Aksi (h-12 / 48px) */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsJournalModalOpen(false)}
                className="h-12 px-5 rounded-xl bg-[#F5EFE6] text-[#5C4033] font-semibold text-sm border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 h-12 px-5 rounded-xl bg-[#FFB7C5] text-[#5C4033] font-bold text-sm border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] hover:brightness-[1.02] active:translate-y-0.5 active:shadow-[0_2px_0_#5C4033] transition-all disabled:opacity-60"
              >
                {saving ? 'Menyimpan...' : 'Simpan ke Archive'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
