import React, { useState } from 'react';
import { Award, ChevronDown, ChevronUp, User, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * PAGE 4: Bottom-Right Profile & Progress Widget
 * Strictly follows AGENTS.md Section 4 - PAGE 4:
 * - Posisi: fixed bottom-6 right-6 z-30 (with mobile-safe bottom-24 on map view so it never overlaps BottomNavigation)
 * - Ukuran Widget: Lebar 300px hingga 330px (w-[310px] sm:w-[325px]), rounded-2xl, latar #FFFDF9, border-2 border-[#5C4033], shadow-[0_6px_0_#5C4033], p-4
 * - Konten Widget:
 *   1. Baris Profil & Angka Utama: Avatar/ikon kecil + Nama Pengguna + Angka Progres mencolok (text-xl font-extrabold text-[#5C4033])
 *   2. Progress Bar Utama: Tinggi 12px (h-3 w-full rounded-full bg-[#F5EFE6] border border-[#5C4033] overflow-hidden), bar pengisi #FFB7C5 / #A0E7E5
 *   3. Breakdown per Kategori (Expandable / Terlihat Jelas):
 *      - Museum (Bar #FFE699)
 *      - Cafe Book (Bar #FFB7C5)
 *      - Perpustakaan (Bar #A0E7E5)
 *   4. Tombol Cetak Sertifikat (Print Certificate):
 *      - h-11 w-full rounded-xl bg-[#FFE699] border-2 border-[#5C4033] font-bold shadow-[0_3px_0_#5C4033] mt-3
 *      - Fitur Khusus Penjurian: Toggle kecil "Simulasi 100% Selesai (Demo Juri)" di dalam widget profil
 */
export default function ProfileProgressWidget() {
  const {
    user,
    progressStats,
    simulateComplete,
    setSimulateComplete,
    setIsCertificateModalOpen,
    selectedPlace,
  } = useApp();

  const [showBreakdown, setShowBreakdown] = useState(true);

  if (!user || selectedPlace) return null;

  const {
    totalVisited,
    totalPlaces,
    percentage,
    breakdown,
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
      className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-30 w-[305px] sm:w-[325px] rounded-2xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_6px_0_#5C4033] p-4"
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

      {/* 3. Breakdown per Kategori (Expandable / Terlihat Jelas) */}
      {showBreakdown && (
        <div className="mt-3 pt-3 border-t border-[#5C4033]/15 space-y-2.5">
          {categoryRows.map((row) => {
            const catPct =
              row.total > 0 ? Math.min(100, Math.round((row.visited / row.total) * 100)) : 0;
            return (
              <div key={row.key} className="space-y-1">
                <div className="flex items-center justify-between text-[12px] font-semibold text-[#5C4033]">
                  <span>{row.label}</span>
                  <span>
                    {row.visited} / {row.total}
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

      {/* 4. Tombol Cetak Sertifikat (Print Certificate) */}
      {isEligibleForCertificate && (
        <button
          type="button"
          onClick={() => setIsCertificateModalOpen(true)}
          className="h-11 w-full rounded-xl bg-[#FFE699] text-[#5C4033] border-2 border-[#5C4033] font-bold text-sm shadow-[0_3px_0_#5C4033] hover:brightness-[1.02] active:translate-y-0.5 active:shadow-[0_1px_0_#5C4033] transition-all mt-3 flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4 text-[#5C4033]" strokeWidth={2.2} />
          <span>Cetak Sertifikat</span>
        </button>
      )}
    </aside>
  );
}
