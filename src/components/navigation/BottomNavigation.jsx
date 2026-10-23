import React from 'react';
import { BookOpen, Plus, Bookmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * PAGE 2: Bottom Navigation (Footer Tab)
 * Strictly follows AGENTS.md Section 4 - PAGE 2:
 * - Posisi: fixed bottom-5 left-1/2 -translate-x-1/2 z-10
 * - Ukuran Bar: w-[calc(100%-32px)] max-w-[380px], h-16 (64px), px-4, rounded-full, latar #FFFDF9, border-2 border-[#5C4033], shadow-[0_6px_0_#5C4033]
 * - 3 Menu Utama (grid grid-cols-3 items-center):
 *   1. Archive (Kiri): Ikon buku jurnal + label Archive (12px) + badge jumlah kunjungan
 *   2. Add Journal (Tengah - Prominent Button): Tombol bulat menonjol 52x52px (-mt-5), latar #FFB7C5 (Pink), border-2 border-[#5C4033], shadow-[0_4px_0_#5C4033], ikon +
 *   3. Saved (Kanan): Ikon bookmark + label Saved (12px) + badge jumlah simpanan
 */
export default function BottomNavigation() {
  const {
    user,
    activeView,
    setActiveView,
    openAddJournalModal,
    isSavedModalOpen,
    setIsSavedModalOpen,
    closePlaceModal,
    progressStats,
    savedPlaces,
  } = useApp();

  if (!user) return null;

  const visitedCount = progressStats.totalVisited;
  const savedCount = savedPlaces.length;

  return (
    <nav
      aria-label="Navigasi Utama Bawah"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-32px)] max-w-[380px] h-16 px-4 rounded-full bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_6px_0_#5C4033]"
    >
      <div className="grid grid-cols-3 items-center h-full">
        {/* 1. Archive (Kiri) */}
        <button
          type="button"
          onClick={() => {
            closePlaceModal();
            setIsSavedModalOpen(false);
            setActiveView(activeView === 'archive' ? 'map' : 'archive');
          }}
          className={`h-11 rounded-full flex flex-col items-center justify-center transition-all relative ${
            activeView === 'archive'
              ? 'bg-[#FFE699] text-[#5C4033] border border-[#5C4033]'
              : 'text-[#5C4033] hover:bg-[#F5EFE6]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
            <span className=" -top-1.5 -right-5 absolute min-w-[18px] h-[18px] px-1 rounded-full bg-[#FFB7C5] border border-[#5C4033] text-[10px] font-bold text-[#5C4033] flex items-center justify-center">
              {visitedCount}
            </span>
          </div>
          <span className="text-[12px] font-medium text-[#5C4033] leading-[1.2] mt-0.5">
            Archive
          </span>
        </button>

        {/* 2. Add Journal (Tengah - Prominent Button 52x52px, -mt-5) */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => openAddJournalModal()}
            aria-label="Tambah Jurnal Baru"
            title="Add Journal (Tulis Jurnal Kunjungan)"
            className="w-[52px] h-[52px] -mt-5 rounded-full bg-[#FFB7C5] text-[#5C4033] border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] hover:brightness-[1.03] active:translate-y-0.5 active:shadow-[0_2px_0_#5C4033] transition-all flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-[#5C4033]" strokeWidth={2.5} />
          </button>
        </div>

        {/* 3. Saved (Kanan) */}
        <button
          type="button"
          onClick={() => {
            closePlaceModal();
            setIsSavedModalOpen(!isSavedModalOpen);
          }}
          className={`h-11 rounded-full flex flex-col items-center justify-center transition-all relative ${
            isSavedModalOpen
              ? 'bg-[#A0E7E5] text-[#5C4033] border border-[#5C4033]'
              : 'text-[#5C4033] hover:bg-[#F5EFE6]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
            <span className="-top-1.5 -right-5 absolute min-w-[18px] h-[18px] px-1 rounded-full bg-[#FFE699] border border-[#5C4033] text-[10px] font-bold text-[#5C4033] flex items-center justify-center">
              {savedCount}
            </span>
          </div>
          <span className="text-[12px] font-medium text-[#5C4033] leading-[1.2] mt-0.5">
            Saved
          </span>
        </button>
      </div>
    </nav>
  );
}
