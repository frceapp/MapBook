import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, RotateCcw, Shield, MapPin, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../services/yogyakartaPlaces';

/**
 * PAGE 2: Top Floating Bar (Header Sapaan & Filter)
 * Strictly follows AGENTS.md Section 4 - PAGE 2:
 * - Posisi: fixed top-4 left-1/2 -translate-x-1/2 z-10
 * - Ukuran: w-[calc(100%-32px)] max-w-[640px], min-h-[60px], px-5 py-2.5
 * - Bentuk: rounded-2xl (Mobile) atau rounded-full (Desktop), latar #FFFDF9/95 backdrop-blur-md, border-2 border-[#5C4033], shadow-[0_4px_0_#5C4033]
 * - Sisi Kiri: "Mau Kemana Hari Ini, <username>?" (font-bold text-[#5C4033] text-base md:text-lg truncate)
 * - Sisi Kanan (Select Dropdown Kategori): min-w-[160px], h-10 (40px), rounded-xl, latar #F5EFE6, border-2 border-[#5C4033]
 *   1. Semua Tempat
 *   2. Museum (Indikator titik #FFE699)
 *   3. Cafe Book (Indikator titik #FFB7C5)
 *   4. Perpustakaan (Indikator titik #A0E7E5)
 */
const CATEGORY_OPTIONS = [
  { id: CATEGORIES.ALL, label: 'Semua Tempat', dotColor: null },
  { id: CATEGORIES.MUSEUM, label: 'Museum', dotColor: '#FFE699' },
  { id: CATEGORIES.CAFE_BOOK, label: 'Cafe Book', dotColor: '#FFB7C5' },
  { id: CATEGORIES.PERPUSTAKAAN, label: 'Perpustakaan', dotColor: '#A0E7E5' },
];

export default function TopFloatingBar() {
  const {
    user,
    places,
    placesLoading,
    activeCategory,
    setActiveCategory,
    activeView,
    handleLogout,
    resetMapToYogyakarta,
    setIsAdminModalOpen,
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user || activeView === 'archive') return null;

  const currentOption =
    CATEGORY_OPTIONS.find((opt) => opt.id === activeCategory) || CATEGORY_OPTIONS[0];

  const usernameDisplay = user.username || 'Nadia';

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-32px)] max-w-[680px] min-h-[60px] px-4 md:px-5 py-2.5 rounded-2xl md:rounded-full bg-[#FFFDF9]/95 backdrop-blur-md border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] flex items-center justify-between gap-2.5">
        {/* Sisi Kiri: Teks Sapaan */}
        <div className="min-w-0 flex-1 flex items-center gap-2">
          <h1
            className="font-bold text-[#5C4033] text-sm md:text-lg truncate leading-[1.3]"
            title={`Mau Kemana Hari Ini, ${usernameDisplay}?`}
          >
            Mau Kemana Hari Ini,{' '}
            <span className="underline decoration-[#FFB7C5] decoration-[3px] underline-offset-2">
              {usernameDisplay}
            </span>
            ?
          </h1>
        </div>

        {/* Sisi Kanan: Select Dropdown Kategori + Admin Menu + Reset/Logout */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Select Dropdown Kategori (min-w-[160px], h-10 / 40px, rounded-xl, bg-[#F5EFE6], border-2 border-[#5C4033]) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              className="min-w-[145px] sm:min-w-[160px] h-10 px-3 rounded-xl bg-[#F5EFE6] border-2 border-[#5C4033] text-[#5C4033] text-xs md:text-sm font-semibold flex items-center justify-between gap-2 shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span className="flex items-center gap-2 truncate">
                {currentOption.dotColor ? (
                  <span
                    className="w-3 h-3 rounded-full border border-[#5C4033] shrink-0"
                    style={{ backgroundColor: currentOption.dotColor }}
                  />
                ) : (
                  <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#FFE699] via-[#FFB7C5] to-[#A0E7E5] border border-[#5C4033] shrink-0" />
                )}
                <span className="truncate">{currentOption.label}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#5C4033] shrink-0 transition-transform duration-150 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={2}
              />
            </button>

            {dropdownOpen && (
              <ul
                role="listbox"
                aria-label="Filter Kategori Tempat Yogyakarta"
                className="absolute right-0 mt-2 w-52 p-1.5 rounded-2xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_6px_0_#5C4033] z-30 space-y-1"
              >
                {CATEGORY_OPTIONS.map((option) => {
                  const isSelected = activeCategory === option.id;
                  return (
                    <li key={option.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setActiveCategory(option.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full h-10 px-3 rounded-xl flex items-center justify-between text-xs font-bold text-[#5C4033] transition-colors ${
                          isSelected
                            ? 'bg-[#F5EFE6] border-[1.5px] border-[#5C4033]'
                            : 'hover:bg-[#F5EFE6]/70'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          {option.dotColor ? (
                            <span
                              className="w-3.5 h-3.5 rounded-full border-[1.5px] border-[#5C4033]"
                              style={{ backgroundColor: option.dotColor }}
                            />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#FFE699] via-[#FFB7C5] to-[#A0E7E5] border-[1.5px] border-[#5C4033]" />
                          )}
                          <span>{option.label}</span>
                        </span>
                        {isSelected && (
                          <span className="text-[11px] font-bold text-[#5C4033]">✓</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Admin Menu Button (Set Lokasi & API Google Maps) */}
          <button
            type="button"
            onClick={() => setIsAdminModalOpen(true)}
            title="Admin Menu: Input Lokasi via Google Maps API & Konfigurasi"
            aria-label="Buka Admin Menu"
            className="h-10 px-3 rounded-xl bg-[#FFE699] hover:brightness-105 border-2 border-[#5C4033] text-[#5C4033] text-xs font-bold flex items-center gap-1.5 shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Shield className="w-4 h-4 text-[#5C4033] shrink-0" strokeWidth={2} />
            <span className="hidden md:inline">Admin</span>
          </button>

          {/* Reset Peta Jogja Button */}
          <button
            type="button"
            onClick={resetMapToYogyakarta}
            title="Pusatkan Peta ke Yogyakarta"
            aria-label="Pusatkan Peta ke Yogyakarta"
            className="hidden sm:flex w-10 h-10 rounded-xl bg-[#F5EFE6] hover:bg-[#FFE699] border-2 border-[#5C4033] text-[#5C4033] items-center justify-center shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <RotateCcw className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar ke Halaman Login"
            aria-label="Keluar ke Halaman Login"
            className="w-10 h-10 rounded-xl bg-[#F5EFE6] hover:bg-[#FF8A8A]/40 border-2 border-[#5C4033] text-[#5C4033] flex items-center justify-center shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <LogOut className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Prompt Mengambang jika Admin belum menginput lokasi sama sekali */}
      {!placesLoading && places.length === 0 && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-32px)] max-w-[460px] p-5 rounded-3xl bg-[#FFFDF9]/95 backdrop-blur-md border-2 border-[#5C4033] shadow-[0_6px_0_#5C4033] text-center">
          <div className="w-11 h-11 rounded-2xl bg-[#FFE699] border-2 border-[#5C4033] flex items-center justify-center mx-auto mb-2.5 shadow-[0_2px_0_#5C4033]">
            <MapPin className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
          </div>
          <h2 className="text-base font-bold text-[#5C4033]">
            Lokasi Peta Menunggu Input Admin
          </h2>
          <p className="text-xs text-[#8C7365] mt-1 leading-relaxed">
            Seluruh titik lokasi di peta Yogyakarta wajib diinput oleh Admin. Admin dapat mencari
            nama tempat dan Google Maps API akan otomatis mencari lokasi beserta koordinatnya.
          </p>
          <button
            type="button"
            onClick={() => setIsAdminModalOpen(true)}
            className="mt-3.5 w-full h-11 px-4 rounded-xl bg-[#FFB7C5] text-[#5C4033] font-bold text-xs border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
            <span>Buka Admin Menu & Cari Lokasi via Google Maps</span>
          </button>
        </div>
      )}
    </>
  );
}
