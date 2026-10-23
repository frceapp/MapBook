import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Star,
  MapPin,
  Edit3,
  Trash2,
  BookOpen,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, CATEGORY_CONFIG } from '../../services/yogyakartaPlaces';

/**
 * PAGE 4: Archive & Sertifikat Pencapaian (Full Overlay Drawer / View)
 * Strictly follows AGENTS.md Section 4 - PAGE 4:
 * - Container Halaman Archive:
 *   - Full Overlay Drawer / View di atas peta: min-h-screen bg-[#FAF6F0]/95 backdrop-blur-md z-20 pt-6 pb-32 px-4 md:px-8
 *   - Lebar Konten Maksimal: 1080px (max-w-[1080px] mx-auto)
 * - Header Archive & Filter Tab:
 *   - Tombol Kembali ke Peta (40px tinggi / h-10, rounded-xl) di kiri atas
 *   - Judul Halaman: "Arsip Perjalanan Literasiku" + Filter kategori (Semua, Museum, Cafe Book, Perpustakaan) berbentuk pill tabs (h-10 px-4 rounded-full)
 * - Grid Daftar Tempat (List of Places):
 *   - grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6
 *   - Ukuran & Bentuk Kartu Archive:
 *     - rounded-2xl, latar #FFFDF9, border-2 border-[#5C4033], shadow-[0_4px_0_#5C4033], p-4, tinggi kartu seragam (flex flex-col justify-between)
 *     - Thumbnail Foto: Tinggi 150px (h-[150px] w-full object-cover rounded-xl border border-[#5C4033]/20)
 *     - Isi Kartu: Badge kategori, Nama Tempat (font-bold text-base), Tanggal Kunjungan (12px #8C7365), Rating Pribadi pengguna (★), dan kutipan catatan jurnal (line-clamp-3 text-sm)
 */
const FILTER_PILLS = [
  { id: CATEGORIES.ALL, label: 'Semua', colorHex: '#FFFDF9' },
  { id: CATEGORIES.MUSEUM, label: 'Museum', colorHex: '#FFE699' },
  { id: CATEGORIES.CAFE_BOOK, label: 'Cafe Book', colorHex: '#FFB7C5' },
  { id: CATEGORIES.PERPUSTAKAAN, label: 'Perpustakaan', colorHex: '#A0E7E5' },
];

export default function ArchiveView() {
  const {
    user,
    activeView,
    setActiveView,
    archives,
    places,
    openAddJournalModal,
    handleDeleteJournal,
    selectPlaceOnMap,
    simulateComplete,
    progressStats,
    setIsCertificateModalOpen,
  } = useApp();

  const [categoryTab, setCategoryTab] = useState(CATEGORIES.ALL);

  // Merge user's real archives with simulated entries when "Simulasi 100% Selesai (Demo Juri)" is toggled ON
  const displayedArchives = useMemo(() => {
    let list = [...archives];

    if (simulateComplete) {
      const existingIds = new Set(list.map((a) => a.placeId));
      places.forEach((p) => {
        if (!existingIds.has(p.placeId)) {
          list.push({
            placeId: p.placeId,
            placeName: p.displayName || p.name,
            category: p.category,
            visitedDate: '2026-10-23',
            userRating: 5,
            journalNote: `[Simulasi Demo Juri] Kunjungan eksplorasi literasi di ${
              p.displayName || p.name
            }, ${p.district || 'Yogyakarta'}. Suasana sangat kondusif, edukatif, dan menginspirasi!`,
            isSimulated: true,
          });
        }
      });
    }

    if (categoryTab === CATEGORIES.ALL) return list;
    return list.filter((item) => item.category === categoryTab);
  }, [archives, places, simulateComplete, categoryTab]);

  if (!user || activeView !== 'archive') return null;

  return (
    <AnimatePresence>
      <motion.section
        key="page-4-archive-drawer"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Arsip Perjalanan Literasiku"
        className="fixed inset-0 overflow-y-auto min-h-screen bg-[#FAF6F0]/95 backdrop-blur-md z-20 pt-6 pb-36 px-4 md:px-8"
      >
        <div className="max-w-[1080px] mx-auto">
          {/* Top Bar: Tombol Kembali ke Peta (40px tinggi, rounded-xl) di kiri atas */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <button
              type="button"
              onClick={() => setActiveView('map')}
              className="h-10 px-4 rounded-xl bg-[#FFFDF9] hover:bg-[#F5EFE6] text-[#5C4033] font-bold text-xs md:text-sm border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
              <span>Kembali ke Peta</span>
            </button>

            <div className="flex items-center gap-2.5">
              {progressStats.isEligibleForCertificate && (
                <button
                  type="button"
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="h-10 px-4 rounded-xl bg-[#FFE699] text-[#5C4033] font-bold text-xs md:text-sm border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                  <span>Cetak Sertifikat</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => openAddJournalModal()}
                className="h-10 px-4 rounded-xl bg-[#FFB7C5] text-[#5C4033] font-bold text-xs md:text-sm border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#5C4033]" strokeWidth={2.5} />
                <span>Tulis Jurnal Baru</span>
              </button>
            </div>
          </div>

          {/* Judul Halaman & Filter Kategori Berbentuk Pill Tabs (h-10 px-4 rounded-full) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b-2 border-[#5C4033]/15">
            <div>
              <h1 className="text-[20px] md:text-[24px] font-bold text-[#5C4033] leading-[1.3]">
                Arsip Perjalanan Literasiku
              </h1>
              <p className="text-sm text-[#8C7365] mt-1">
                Koleksi dokumentasi pengalaman mengunjungi Museum, Cafe Book, dan Perpustakaan di Daerah Istimewa Yogyakarta
              </p>
            </div>

            {/* Filter Kategori Pill Tabs (h-10 px-4 rounded-full) */}
            <div
              role="tablist"
              aria-label="Filter kategori arsip"
              className="flex flex-wrap items-center gap-2"
            >
              {FILTER_PILLS.map((pill) => {
                const isActive = categoryTab === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setCategoryTab(pill.id)}
                    style={{
                      backgroundColor: isActive ? pill.colorHex : '#F5EFE6',
                    }}
                    className={`h-10 px-4 rounded-full text-xs md:text-sm font-bold text-[#5C4033] border-2 border-[#5C4033] transition-all flex items-center gap-2 ${
                      isActive
                        ? 'shadow-[0_3px_0_#5C4033] -translate-y-0.5'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Daftar Tempat (List of Places: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6) */}
          {displayedArchives.length === 0 ? (
            <div className="mt-8 p-8 rounded-3xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_6px_0_#5C4033] text-center max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#FFE699] border-2 border-[#5C4033] flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-[#5C4033]" strokeWidth={2} />
              </div>
              <h2 className="text-[18px] font-bold text-[#5C4033]">
                Belum Ada Jurnal pada Kategori Ini
              </h2>
              <p className="text-sm text-[#8C7365] mt-1 leading-[1.6]">
                Mulai dokumentasikan pengalamanmu menjelajahi sudut literasi dan budaya di Yogyakarta.
              </p>
              <button
                type="button"
                onClick={() => openAddJournalModal()}
                className="mt-4 h-11 px-5 rounded-xl bg-[#FFB7C5] text-[#5C4033] font-bold text-sm border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] active:translate-y-0.5 active:shadow-none inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#5C4033]" strokeWidth={2.5} />
                <span>Tambah Jurnal Pertama</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {displayedArchives.map((entry) => {
                const placeObj = places.find(
                  (p) => p.placeId === entry.placeId || p.id === entry.placeId
                );
                const catInfo =
                  CATEGORY_CONFIG[entry.category] || CATEGORY_CONFIG.museum;
                const thumbnailPhoto =
                  placeObj?.photos?.[0] ||
                  'https://images.unsplash.com/photo-1507842229356-51c61504d3ab?auto=format&fit=crop&w=800&q=80';

                return (
                  <article
                    key={entry.placeId}
                    className="rounded-2xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] p-4 flex flex-col justify-between transition-transform hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Thumbnail Foto: Tinggi 150px (h-[150px] w-full object-cover rounded-xl border border-[#5C4033]/20) */}
                      <div className="relative mb-3">
                        <img
                          src={thumbnailPhoto}
                          alt={entry.placeName}
                          className="h-[150px] w-full object-cover rounded-xl border border-[#5C4033]/20"
                          loading="lazy"
                        />

                        {/* Badge Kategori */}
                        <span
                          className="absolute top-2.5 left-2.5 px-3 py-0.5 rounded-full border-[1.5px] border-[#5C4033] text-[12px] font-semibold text-[#5C4033] shadow-[0_2px_0_#5C4033]"
                          style={{ backgroundColor: catInfo.colorHex }}
                        >
                          {catInfo.label}
                        </span>

                        {/* Rating Pribadi Pengguna (★) */}
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#FFE699] border-[1.5px] border-[#5C4033] text-[12px] font-bold text-[#5C4033] shadow-[0_2px_0_#5C4033] flex items-center gap-1">
                          <Star
                            className="w-3 h-3 fill-[#5C4033] text-[#5C4033]"
                            strokeWidth={2}
                          />
                          <span>{entry.userRating || 5}.0</span>
                        </span>
                      </div>

                      {/* Nama Tempat & Tanggal Kunjungan */}
                      <div className="mb-2">
                        <h2 className="font-bold text-base text-[#5C4033] leading-snug line-clamp-1">
                          {entry.placeName}
                        </h2>
                        <div className="flex items-center justify-between text-[12px] font-medium text-[#8C7365] mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#5C4033]" strokeWidth={2} />
                            <span>{entry.visitedDate}</span>
                          </span>
                          <span className="flex items-center gap-1 truncate max-w-[140px]">
                            <MapPin className="w-3.5 h-3.5 text-[#5C4033] shrink-0" strokeWidth={2} />
                            <span className="truncate">
                              {placeObj?.district || 'Yogyakarta'}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Kutipan Catatan Jurnal (line-clamp-3 text-sm) */}
                      <p className="line-clamp-3 text-sm text-[#5C4033] leading-[1.6] bg-[#F5EFE6] p-3 rounded-xl border border-[#5C4033]/20">
                        &ldquo;{entry.journalNote}&rdquo;
                      </p>
                    </div>

                    {/* Baris Tombol Aksi Kartu */}
                    <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-[#5C4033]/15">
                      <button
                        type="button"
                        onClick={() => {
                          if (placeObj) selectPlaceOnMap(placeObj);
                        }}
                        className="h-10 px-3 rounded-xl bg-[#A0E7E5] border-[1.5px] border-[#5C4033] text-xs font-bold text-[#5C4033] shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all flex-1"
                      >
                        Lihat di Peta
                      </button>

                      <button
                        type="button"
                        onClick={() => openAddJournalModal(placeObj || entry.placeId)}
                        title="Edit Catatan Jurnal"
                        aria-label="Edit Catatan Jurnal"
                        className="w-10 h-10 rounded-xl bg-[#F5EFE6] hover:bg-[#FFE699] border-[1.5px] border-[#5C4033] text-[#5C4033] flex items-center justify-center shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
                      >
                        <Edit3 className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                      </button>

                      {!entry.isSimulated && (
                        <button
                          type="button"
                          onClick={() => handleDeleteJournal(entry.placeId)}
                          title="Hapus Jurnal"
                          aria-label="Hapus Jurnal"
                          className="w-10 h-10 rounded-xl bg-[#F5EFE6] hover:bg-[#FF8A8A]/40 border-[1.5px] border-[#5C4033] text-[#5C4033] flex items-center justify-center shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
