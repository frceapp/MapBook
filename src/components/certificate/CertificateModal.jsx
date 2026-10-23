import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Award,
  Download,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import jogjaIcon from '../../assets/jogja-literasi-icon.svg';

/**
 * PAGE 4: Per-Category Certificate Export Modal (html2canvas + jsPDF)
 * Generates dedicated certificates per category:
 * 1. Museum (#FFE699 - Sunny Butter Yellow)
 * 2. Cafe Book (#FFB7C5 - Pastel Sakura Pink)
 * 3. Perpustakaan (#A0E7E5 - Soft Mint Cyan)
 * Strictly adheres to WCAG 2.1 contrast (#5C4033 text on all accent surfaces).
 */
const CERTIFICATE_CATEGORIES = {
  museum: {
    key: 'museum',
    label: 'Museum',
    shortFileSlug: 'Museum',
    colorHex: '#FFE699',
    certCode: 'LBJ-2026-MUSEUM-DIY',
    badgeTitle: 'Sertifikat Eksplorasi Kategori Museum',
    awardTitle: 'Penjelajah Museum & Warisan Budaya Yogyakarta',
    description:
      'Atas dedikasi dan apresiasi terhadap pelestarian sejarah serta warisan budaya dalam menuntaskan eksplorasi dan dokumentasi jurnal pada seluruh destinasi kategori Museum di Daerah Istimewa Yogyakarta.',
  },
  cafe_book: {
    key: 'cafe_book',
    label: 'Cafe Book',
    shortFileSlug: 'CafeBook',
    colorHex: '#FFB7C5',
    certCode: 'LBJ-2026-CAFEBOOK-DIY',
    badgeTitle: 'Sertifikat Eksplorasi Kategori Cafe Book',
    awardTitle: 'Kurator Ruang Baca & Cafe Book Kreatif Yogyakarta',
    description:
      'Atas antusiasme dan kecintaan terhadap budaya membaca serta diskusi kreatif dalam menuntaskan eksplorasi dan dokumentasi jurnal pada seluruh destinasi kategori Cafe Book di Daerah Istimewa Yogyakarta.',
  },
  perpustakaan: {
    key: 'perpustakaan',
    label: 'Perpustakaan',
    shortFileSlug: 'Perpustakaan',
    colorHex: '#A0E7E5',
    certCode: 'LBJ-2026-PUSTAKA-DIY',
    badgeTitle: 'Sertifikat Eksplorasi Kategori Perpustakaan',
    awardTitle: 'Duta Literasi & Balai Pustaka Daerah Istimewa Yogyakarta',
    description:
      'Atas komitmen dan ketekunan dalam menggali ilmu pengetahuan serta literasi publik dengan menuntaskan eksplorasi dan dokumentasi jurnal pada seluruh destinasi kategori Perpustakaan di Daerah Istimewa Yogyakarta.',
  },
};

export default function CertificateModal() {
  const {
    user,
    isCertificateModalOpen,
    setIsCertificateModalOpen,
    certificateCategory,
    setCertificateCategory,
    progressStats,
    places,
    archives,
    simulateComplete,
  } = useApp();

  const certRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const activeCatKey = CERTIFICATE_CATEGORIES[certificateCategory]
    ? certificateCategory
    : 'museum';
  const activeSpec = CERTIFICATE_CATEGORIES[activeCatKey];

  useEffect(() => {
    if (isCertificateModalOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#FFE699', '#FFB7C5', '#A0E7E5', '#88D49E'],
        });
      } catch {
        // Ignore confetti errors in headless browsers
      }
    }
  }, [isCertificateModalOpen, activeCatKey]);

  if (!isCertificateModalOpen || !user) return null;

  const recipientName = user.username || 'Nadia';
  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const catBreakdown = progressStats.breakdown[activeCatKey] || {
    visited: 0,
    total: 0,
  };
  const visitedCount = simulateComplete
    ? catBreakdown.total
    : catBreakdown.visited;
  const totalCount = catBreakdown.total;

  // Places belonging to the selected category
  const categoryPlaces = places.filter((p) => p.category === activeCatKey);
  const visitedSet = new Set(archives.map((a) => a.placeId));
  const visitedCategoryPlaces = simulateComplete
    ? categoryPlaces
    : categoryPlaces.filter(
        (p) => visitedSet.has(p.placeId) || visitedSet.has(p.id)
      );

  const handleExportPDF = async () => {
    if (!certRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#FFFDF9',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(
        `Sertifikat-${activeSpec.shortFileSlug}-Yogyakarta-${recipientName.replace(
          /\s+/g,
          '_'
        )}.pdf`
      );
    } catch (err) {
      console.error('Export PDF gagal:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPNG = async () => {
    if (!certRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#FFFDF9',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `Sertifikat-${
        activeSpec.shortFileSlug
      }-Yogyakarta-${recipientName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export PNG gagal:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="certificate-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCertificateModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5C4033]/35 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[900px] rounded-3xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_10px_0_#5C4033] p-5 md:p-6 my-auto"
        >
          {/* Top Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#5C4033]/15 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl border-2 border-[#5C4033] flex items-center justify-center"
                style={{ backgroundColor: activeSpec.colorHex }}
              >
                <Award className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#5C4033] leading-[1.35]">
                  Sertifikat Kategori {activeSpec.label} Yogyakarta
                </h2>
                <p className="text-[12px] font-medium text-[#8C7365]">
                  Pilih kategori sertifikat (Museum, Cafe Book, atau Perpustakaan) untuk diunduh
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={exporting}
                onClick={handleExportPDF}
                style={{ backgroundColor: activeSpec.colorHex }}
                className="h-11 px-4 rounded-xl text-[#5C4033] font-bold text-xs md:text-sm border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center gap-2 disabled:opacity-60"
              >
                <Download className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                <span>
                  {exporting
                    ? 'Menyiapkan PDF...'
                    : `Unduh PDF (${activeSpec.label})`}
                </span>
              </button>

              <button
                type="button"
                disabled={exporting}
                onClick={handleExportPNG}
                className="h-11 px-3.5 rounded-xl bg-[#F5EFE6] hover:bg-[#A0E7E5] text-[#5C4033] font-bold text-xs md:text-sm border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all hidden sm:inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                <ImageIcon className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                <span>Unduh PNG</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCertificateModalOpen(false)}
                aria-label="Tutup modal sertifikat"
                className="w-11 h-11 rounded-xl bg-[#F5EFE6] hover:bg-[#FF8A8A]/40 border-2 border-[#5C4033] text-[#5C4033] flex items-center justify-center shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
              >
                <X className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Pemilih Sertifikat Per Kategori: 1. Museum, 2. Cafe Book, 3. Perpustakaan */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {Object.values(CERTIFICATE_CATEGORIES).map((cat) => {
              const isSelected = activeCatKey === cat.key;
              const isCompleted =
                simulateComplete ||
                progressStats.completedCategories.includes(cat.key);
              const stat = progressStats.breakdown[cat.key] || {
                visited: 0,
                total: 0,
              };
              const vis = simulateComplete ? stat.total : stat.visited;

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCertificateCategory(cat.key)}
                  style={{
                    backgroundColor: isSelected ? cat.colorHex : '#F5EFE6',
                  }}
                  className={`h-12 px-3 rounded-2xl border-2 border-[#5C4033] text-[#5C4033] flex items-center justify-between gap-2 transition-all ${
                    isSelected
                      ? 'shadow-[0_4px_0_#5C4033] -translate-y-0.5 font-extrabold'
                      : 'opacity-80 hover:opacity-100 font-bold'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs md:text-sm truncate">
                    {isCompleted ? (
                      <CheckCircle2
                        className="w-4 h-4 text-[#5C4033] shrink-0"
                        strokeWidth={2.3}
                      />
                    ) : (
                      <Lock
                        className="w-3.5 h-3.5 text-[#8C7365] shrink-0"
                        strokeWidth={2}
                      />
                    )}
                    <span className="truncate">Sertifikat {cat.label}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#FFFDF9] border border-[#5C4033] text-[11px] font-bold text-[#5C4033] shrink-0">
                    {vis}/{stat.total}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Printable Certificate Canvas Container (Per Category) */}
          <div className="overflow-x-auto pb-2 flex justify-center">
            <div
              ref={certRef}
              className="w-[780px] shrink-0 rounded-3xl bg-[#FFFDF9] border-4 border-[#5C4033] p-7 text-[#5C4033] relative"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(92, 64, 51, 0.08) 1.5px, transparent 1.5px)',
                backgroundSize: '20px 20px',
              }}
            >
              <div className="rounded-2xl border-2 border-dashed border-[#5C4033]/50 p-7 flex flex-col items-center text-center bg-[#FFFDF9]/95">
                {/* Badge Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-14 h-14 rounded-2xl border-2 border-[#5C4033] p-1.5 flex items-center justify-center"
                    style={{ backgroundColor: activeSpec.colorHex }}
                  >
                    <img
                      src={jogjaIcon}
                      alt="Ikon LokaBaca Jogja"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#8C7365]">
                      ISCOMFEST 2026 • Daerah Istimewa Yogyakarta
                    </p>
                    <h3 className="text-lg font-extrabold text-[#5C4033]">
                      LokaBaca Yogyakarta — Kategori {activeSpec.label}
                    </h3>
                  </div>
                </div>

                {/* Category Pill Badge */}
                <div
                  className="px-5 py-1.5 rounded-full border-2 border-[#5C4033] text-xs font-extrabold text-[#5C4033] uppercase tracking-wider mt-1"
                  style={{ backgroundColor: activeSpec.colorHex }}
                >
                  {activeSpec.badgeTitle}
                </div>

                <p className="text-xs font-medium text-[#8C7365] mt-4">
                  Diberikan dengan bangga kepada:
                </p>

                <h1
                  className="text-3xl font-extrabold text-[#5C4033] mt-1 mb-1.5 px-6 py-1 border-b-4"
                  style={{ borderColor: activeSpec.colorHex }}
                >
                  {recipientName}
                </h1>

                <p className="text-xs font-extrabold uppercase tracking-wider text-[#5C4033] mb-2">
                  Sebagai {activeSpec.awardTitle}
                </p>

                <p className="text-sm text-[#5C4033] max-w-xl leading-relaxed">
                  {activeSpec.description}
                </p>

                {/* Category Completion Highlight & Visited Places List */}
                <div
                  className="w-full max-w-xl my-4 p-4 rounded-2xl border-2 border-[#5C4033] text-[#5C4033]"
                  style={{ backgroundColor: activeSpec.colorHex }}
                >
                  <div className="flex items-center justify-between border-b border-[#5C4033]/25 pb-2 mb-2.5">
                    <span className="text-xs font-extrabold uppercase tracking-wide">
                      Capaian Kategori {activeSpec.label} DIY
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-[#FFFDF9] border border-[#5C4033] text-xs font-extrabold text-[#5C4033]">
                      {visitedCount} / {totalCount} Lokasi Selesai (100%)
                    </span>
                  </div>

                  {visitedCategoryPlaces.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {visitedCategoryPlaces.slice(0, 10).map((place) => (
                        <span
                          key={place.placeId}
                          className="px-2.5 py-0.5 rounded-lg bg-[#FFFDF9]/90 border border-[#5C4033]/50 text-[11px] font-bold text-[#5C4033]"
                        >
                          ✓ {place.displayName || place.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-[#5C4033]">
                      Seluruh destinasi {activeSpec.label} di Daerah Istimewa Yogyakarta
                    </p>
                  )}
                </div>

                {/* Footer Signatures */}
                <div className="w-full flex items-center justify-between pt-4 border-t border-[#5C4033]/25 text-xs text-[#5C4033]">
                  <div className="text-left">
                    <p className="text-[#8C7365] font-medium">
                      Diterbitkan di Yogyakarta:
                    </p>
                    <p className="font-bold">{formattedDate}</p>
                    <p className="text-[11px] text-[#8C7365]">
                      No. Sertifikat: {activeSpec.certCode}
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-[#88D49E] border-2 border-[#5C4033] font-bold text-[#5C4033] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                    <span>KATEGORI {activeSpec.label.toUpperCase()} • TERVERIFIKASI</span>
                  </div>

                  <div className="text-right">
                    <p className="text-[#8C7365] font-medium">
                      Kurator {activeSpec.label} DIY:
                    </p>
                    <p className="font-bold underline decoration-[#5C4033]">
                      Dewan LokaBaca Jogja
                    </p>
                    <p className="text-[11px] text-[#8C7365]">
                      Daerah Istimewa Yogyakarta
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
