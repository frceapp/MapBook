import React, { useState } from 'react';
import { Award, ChevronDown, ChevronUp, User, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * PAGE 4: Bottom-Right Profile & Progress Widget
 * Strictly follows AGENTS.md Section 4 - PAGE 4:
 * - Posisi: fixed bottom-6 right-6 z-30 (with mobile-safe bottom-24 on map view so it never overlaps BottomNavigation)
 * - Ukuran Widget: Lebar 300px hingga 330px (w-[305px] sm:w-[330px]), rounded-2xl, latar #FFFDF9, border-2 border-[#5C4033], shadow-[0_6px_0_#5C4033], p-4
 * - Konten Widget:
 *   1. Baris Profil & Angka Utama: Avatar/ikon kecil + Nama Pengguna + Angka Progres mencolok
 *   2. Progress Bar Utama: Tinggi 12px (h-3 w-full rounded-full bg-[#F5EFE6] border border-[#5C4033] overflow-hidden)
 *   3. Breakdown per Kategori (Museum #FFE699, Cafe Book #FFB7C5, Perpustakaan #A0E7E5) + Tombol Sertifikat Per Kategori
 *   4. Tombol Cetak Sertifikat Per Kategori + Toggle "Simulasi 100% Selesai (Demo Juri)"
 */
export default function ProfileProgressWidget() {
  const {
    user,
    progressStats,
    simulateComplete,
    setSimulateComplete,
    openCertificateModal,
    selectedPlace,
  } = useApp();

  const [showBreakdown, setShowBreakdown] = useState(true);

  if (!user || selectedPlace) return null;

  const {
    totalVisited,
    totalPlaces,
    percentage,
    breakdown,
    completedCategories,
    isEligibleForCertificate,
  } = progressStats;

  const categoryRows = [
    {
      key: 'museum',
      label: 'Museum',
      visited: breakdown.museum.visited,
      total: breakdown.museum.total,
      barColor: '#FFE699',
    },
    {
      key: 'cafe_book',
      label: 'Cafe Book',
      visited: breakdown.cafe_book.visited,
      total: breakdown.cafe_book.total,
      barColor: '#FFB7C5',
    },
    {
      key: 'perpustakaan',
      label: 'Perpustakaan',
      visited: breakdown.perpustakaan.visited,
      total: breakdown.perpustakaan.total,
      barColor: '#A0E7E5',
    },
  ];

  return (
    <aside
      aria-label="Profil dan Progres Eksplorasi Yogyakarta"
      className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-30 w-[305px] sm:w-[330px] rounded-2xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_6px_0_#5C4033] p-4"
    >
      {/* 1. Baris Profil & Angka Utama */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#FFB7C5] border-[1.5px] border-[#5C4033] flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-[#5C4033]" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#5C4033] truncate">
              {user.username || 'Nadia'}
            </p>
            <p className="text-[11px] font-medium text-[#8C7365] truncate">
              Penjelajah Literasi Jogja
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xl font-extrabold text-[#5C4033] tracking-tight">
            {totalVisited} / {totalPlaces}
          </span>
          <button
            type="button"
            onClick={() => setShowBreakdown((prev) => !prev)}
            aria-label={showBreakdown ? 'Sembunyikan rincian' : 'Tampilkan rincian'}
            className="w-7 h-7 rounded-lg bg-[#F5EFE6] border border-[#5C4033] flex items-center justify-center text-[#5C4033]"
          >
            {showBreakdown ? (
              <ChevronDown className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
            ) : (
              <ChevronUp className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* 2. Progress Bar Utama (Tinggi 12px / h-3) */}
      <div className="mt-2.5">
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-3 w-full rounded-full bg-[#F5EFE6] border border-[#5C4033] overflow-hidden"
        >
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, #FFB7C5 0%, #A0E7E5 100%)',
            }}
          />
        </div>
      </div>

      {/* 3. Breakdown per Kategori & Tombol Sertifikat Per Kategori */}
      {showBreakdown && (
        <div className="mt-3 pt-3 border-t border-[#5C4033]/15 space-y-2.5">
          {categoryRows.map((row) => {
            const isCatComplete =
              simulateComplete || completedCategories.includes(row.key);
            const catPct = simulateComplete
              ? 100
              : row.total > 0
              ? Math.min(100, Math.round((row.visited / row.total) * 100))
              : 0;
            const visitedCountDisplay = simulateComplete ? row.total : row.visited;

            return (
              <div key={row.key} className="space-y-1">
                <div className="flex items-center justify-between text-[12px] font-semibold text-[#5C4033]">
                  <span className="flex items-center gap-1.5">
                    <span>{row.label}</span>
                    {isCatComplete && (
                      <button
                        type="button"
                        onClick={() => openCertificateModal(row.key)}
                        style={{ backgroundColor: row.barColor }}
                        className="px-2 py-0.5 rounded-md border border-[#5C4033] text-[10px] font-bold text-[#5C4033] hover:brightness-105 inline-flex items-center gap-1"
                        title={`Cetak Sertifikat Kategori ${row.label}`}
                      >
                        <Award className="w-3 h-3 text-[#5C4033]" strokeWidth={2.2} />
                        <span>Sertifikat</span>
                      </button>
                    )}
                  </span>
                  <span>
                    {visitedCountDisplay} / {row.total}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F5EFE6] border border-[#5C4033]/60 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${catPct}%`,
                      backgroundColor: row.barColor,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Fitur Khusus Penjurian: Toggle "Simulasi 100% Selesai (Demo Juri)" */}
          <div className="pt-2 border-t border-dashed border-[#5C4033]/20 flex items-center justify-between gap-2">
            <label
              htmlFor="judge-demo-toggle"
              className="text-[11px] font-bold text-[#5C4033] flex items-center gap-1.5 cursor-pointer select-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5C4033] shrink-0" strokeWidth={2} />
              <span>Simulasi 100% Selesai (Demo Juri)</span>
            </label>

            <button
              id="judge-demo-toggle"
              type="button"
              role="switch"
              aria-checked={simulateComplete}
              onClick={() => setSimulateComplete(!simulateComplete)}
              className={`w-11 h-6 rounded-full border-[1.5px] border-[#5C4033] p-0.5 transition-colors flex items-center ${
                simulateComplete ? 'bg-[#88D49E] justify-end' : 'bg-[#F5EFE6] justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#FFFDF9] border border-[#5C4033] shadow-sm" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Tombol Cetak Sertifikat Per Kategori */}
      {isEligibleForCertificate && (
        <div className="mt-3 space-y-1.5">
          <div className="grid grid-cols-3 gap-1.5">
            {categoryRows.map((row) => {
              const unlocked =
                simulateComplete || completedCategories.includes(row.key);
              return (
                <button
                  key={row.key}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => openCertificateModal(row.key)}
                  style={{
                    backgroundColor: unlocked ? row.barColor : '#F5EFE6',
                  }}
                  className="h-10 px-1.5 rounded-xl border-2 border-[#5C4033] text-[#5C4033] font-bold text-[11px] shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1 disabled:opacity-45"
                  title={
                    unlocked
                      ? `Cetak Sertifikat ${row.label}`
                      : `Selesaikan kategori ${row.label} untuk membuka sertifikat`
                  }
                >
                  <Award className="w-3.5 h-3.5 text-[#5C4033] shrink-0" strokeWidth={2} />
                  <span className="truncate">{row.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
