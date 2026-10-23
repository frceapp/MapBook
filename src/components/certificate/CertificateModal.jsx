import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Download, Image as ImageIcon, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import jogjaIcon from '../../assets/jogja-literasi-icon.svg';

/**
 * PAGE 4: Certificate Export Modal (html2canvas + jsPDF)
 * Generates & downloads the official Yogyakarta Literacy & Culture Exploration Certificate.
 * Strictly adheres to WCAG 2.1 contrast (#5C4033 text on #FFE699, #FFB7C5, #A0E7E5).
 */
export default function CertificateModal() {
  const {
    user,
    isCertificateModalOpen,
    setIsCertificateModalOpen,
    progressStats,
  } = useApp();

  const certRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (isCertificateModalOpen) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#FFE699', '#FFB7C5', '#A0E7E5', '#88D49E'],
        });
      } catch {
        // Ignore confetti errors in headless browsers
      }
    }
  }, [isCertificateModalOpen]);

  if (!isCertificateModalOpen || !user) return null;

  const recipientName = user.username || 'Nadia';
  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
        `Sertifikat-LokaBaca-Yogyakarta-${recipientName.replace(/\s+/g, '_')}.pdf`
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
      link.download = `Sertifikat-LokaBaca-Yogyakarta-${recipientName.replace(
        /\s+/g,
        '_'
      )}.png`;
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
          className="w-full max-w-[880px] rounded-3xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_10px_0_#5C4033] p-5 md:p-6 my-auto"
        >
          {/* Top Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#5C4033]/15 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FFE699] border-2 border-[#5C4033] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#5C4033] leading-[1.35]">
                  Sertifikat Eksplorasi Literasi Yogyakarta
                </h2>
                <p className="text-[12px] font-medium text-[#8C7365]">
                  Siap diunduh dalam format PDF maupun gambar resolusi tinggi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={exporting}
                onClick={handleExportPDF}
                className="h-11 px-4 rounded-xl bg-[#FFE699] text-[#5C4033] font-bold text-xs md:text-sm border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center gap-2 disabled:opacity-60"
              >
                <Download className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                <span>{exporting ? 'Menyiapkan PDF...' : 'Unduh Sertifikat PDF'}</span>
              </button>

              <button
                type="button"
                disabled={exporting}
                onClick={handleExportPNG}
                className="h-11 px-3.5 rounded-xl bg-[#A0E7E5] text-[#5C4033] font-bold text-xs md:text-sm border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all hidden sm:inline-flex items-center gap-1.5 disabled:opacity-60"
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

          {/* Printable Certificate Canvas Container */}
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
              <div className="rounded-2xl border-2 border-dashed border-[#5C4033]/50 p-7 flex flex-col items-center text-center bg-[#FFFDF9]/90">
                {/* Badge Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFE699] border-2 border-[#5C4033] p-1.5 flex items-center justify-center">
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
                      LokaBaca Yogyakarta — Jurnal & Peta Budaya
                    </h3>
                  </div>
                </div>

                <div className="px-4 py-1 rounded-full bg-[#FFE699] border-[1.5px] border-[#5C4033] text-xs font-bold text-[#5C4033] uppercase tracking-wider mt-1">
                  Sertifikat Apresiasi Eksplorasi Literasi
                </div>

                <p className="text-xs font-medium text-[#8C7365] mt-4">
                  Diberikan dengan bangga kepada Penjelajah Literasi & Budaya:
                </p>

                <h1 className="text-3xl font-extrabold text-[#5C4033] mt-1 mb-2 px-6 py-1 border-b-4 border-[#FFB7C5]">
                  {recipientName}
                </h1>

                <p className="text-sm text-[#5C4033] max-w-xl leading-relaxed">
                  Atas dedikasi dan kecintaan terhadap literasi serta pelestarian budaya dalam menjelajahi dan mendokumentasikan jurnal perjalanan di <b>Museum, Cafe Book, dan Perpustakaan</b> di kawasan Daerah Istimewa Yogyakarta.
                </p>

                {/* Category Stats Pills */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-xl my-5">
                  <div className="p-3 rounded-2xl bg-[#FFE699] border-2 border-[#5C4033] text-[#5C4033]">
                    <p className="text-xs font-bold">Museum Jogja</p>
                    <p className="text-lg font-extrabold mt-0.5">
                      {progressStats.breakdown.museum.visited} /{' '}
                      {progressStats.breakdown.museum.total} Lokasi
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FFB7C5] border-2 border-[#5C4033] text-[#5C4033]">
                    <p className="text-xs font-bold">Cafe Book Jogja</p>
                    <p className="text-lg font-extrabold mt-0.5">
                      {progressStats.breakdown.cafe_book.visited} /{' '}
                      {progressStats.breakdown.cafe_book.total} Lokasi
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#A0E7E5] border-2 border-[#5C4033] text-[#5C4033]">
                    <p className="text-xs font-bold">Perpustakaan DIY</p>
                    <p className="text-lg font-extrabold mt-0.5">
                      {progressStats.breakdown.perpustakaan.visited} /{' '}
                      {progressStats.breakdown.perpustakaan.total} Lokasi
                    </p>
                  </div>
                </div>

                {/* Footer Signatures */}
                <div className="w-full flex items-center justify-between pt-4 border-t border-[#5C4033]/25 text-xs text-[#5C4033]">
                  <div className="text-left">
                    <p className="text-[#8C7365] font-medium">Diterbitkan di Yogyakarta:</p>
                    <p className="font-bold">{formattedDate}</p>
                    <p className="text-[11px] text-[#8C7365]">
                      ID Sertifikat: LBJ-2026-DIY
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-[#88D49E] border-2 border-[#5C4033] font-bold text-[#5C4033] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                    <span>TERVERIFIKASI • ISCOMFEST 2026</span>
                  </div>

                  <div className="text-right">
                    <p className="text-[#8C7365] font-medium">Kurator Literasi DIY:</p>
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
