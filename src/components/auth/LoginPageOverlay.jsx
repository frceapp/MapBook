import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, AlertCircle, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import jogjaIcon from '../../assets/jogja-literasi-icon.svg';

/**
 * PAGE 1: Halaman Utama (Login, Daftar & Guest Mode)
 * Strictly implements AGENTS.md Section 4 - PAGE 1:
 * - Semi-transparent blur overlay on persistent map: bg-[#FFFDF9]/65 backdrop-blur-[6px]
 * - Slide-up exit transition: y: "-110vh", duration: 0.6s, curve: cubic-bezier(0.22, 1, 0.36, 1)
 * - Container Kartu Login: w-full max-w-[400px], p-8 (32px), rounded-3xl, bg-[#FFFDF9], border-2 border-[#5C4033], shadow-[0_8px_0_#5C4033]
 * - Header Icon: 80x80px (w-20 h-20) from src/assets/, rounded-2xl with #FFE699 background
 * - Tab Switcher (Masuk / Daftar): h-10 (40px), rounded-xl, bg-[#F5EFE6]
 * - Input Fields: h-[46px], px-4, rounded-xl, border-2 border-[#5C4033]/30 focus:border-[#5C4033]
 * - Main Button (Masuk Sekarang): w-full, h-12 (48px), bg-[#FFB7C5] (Pink), text-[#5C4033] font-bold
 * - Guest Mode Button (Jelajahi sebagai Tamu): w-full, h-[46px], bg-[#A0E7E5] (Cyan), border-2 border-[#5C4033]
 */
export default function LoginPageOverlay() {
  const {
    user,
    handleLogin,
    handleRegister,
    handleGuestMode,
    authLoading,
    authError,
    setAuthError,
  } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const switchTab = (nextMode) => {
    setMode(nextMode);
    setLocalError('');
    if (setAuthError) setAuthError(null);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (mode === 'register') {
      if (!username.trim()) {
        setLocalError('Silakan isi username panggilanmu terlebih dahulu.');
        return;
      }
      if (!identifier.trim() || !password.trim()) {
        setLocalError('Silakan lengkapi email/username dan kata sandi.');
        return;
      }
      try {
        await handleRegister(username, identifier, password);
      } catch {
        // Error handled in context
      }
    } else {
      if (!identifier.trim() || !password.trim()) {
        setLocalError('Silakan masukkan username/email dan kata sandi.');
        return;
      }
      try {
        await handleLogin(identifier, password);
      } catch {
        // Error handled in context
      }
    }
  };

  const onGuestClick = async () => {
    setLocalError('');
    try {
      await handleGuestMode();
    } catch {
      setLocalError('Gagal masuk sebagai tamu.');
    }
  };

  return (
    <AnimatePresence>
      {!user && (
        <motion.div
          key="page-1-backdrop"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-20 flex items-center justify-center min-h-screen p-4 bg-[#FFFDF9]/65 backdrop-blur-[6px] overflow-y-auto"
        >
          {/* Container Kartu Login */}
          <motion.div
            key="page-1-login-card"
            initial={{ y: 24, opacity: 0, scale: 0.97 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              y: '-110vh',
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            }}
            className="w-full max-w-[400px] p-8 rounded-3xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_8px_0_#5C4033] my-auto"
          >
            {/* Header Ikon/Ilustrasi (80x80px, w-20 h-20, rounded-2xl berlatar #FFE699) */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-[#FFE699] border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] flex items-center justify-center mb-4 p-2">
                <img
                  src={jogjaIcon}
                  alt="Ikon LokaBaca Yogyakarta"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] border border-[#5C4033]/30 text-xs font-medium text-[#5C4033] mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#5C4033]" strokeWidth={2} />
                <span>Edisi Khusus Daerah Istimewa Yogyakarta</span>
              </div>

              <h1 className="text-[20px] md:text-[24px] font-bold text-[#5C4033] leading-[1.3]">
                LokaBaca Jogja
              </h1>
              <p className="text-[14px] text-[#8C7365] mt-1 leading-[1.5]">
                Peta & Jurnal Eksplorasi Museum, Cafe Book, dan Perpustakaan di Yogyakarta
              </p>
            </div>

            {/* Tab Switcher (Masuk / Daftar): Tinggi 40px (h-10), rounded-xl, latar #F5EFE6 */}
            <div
              role="tablist"
              aria-label="Pilih mode autentikasi"
              className="h-10 p-1 rounded-xl bg-[#F5EFE6] border-[1.5px] border-[#5C4033] grid grid-cols-2 gap-1 mb-5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                onClick={() => switchTab('login')}
                className={`h-full rounded-lg text-xs font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-[#FFFDF9] text-[#5C4033] border border-[#5C4033] shadow-[0_2px_0_#5C4033]'
                    : 'text-[#8C7365] hover:text-[#5C4033]'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                onClick={() => switchTab('register')}
                className={`h-full rounded-lg text-xs font-bold transition-all ${
                  mode === 'register'
                    ? 'bg-[#FFFDF9] text-[#5C4033] border border-[#5C4033] shadow-[0_2px_0_#5C4033]'
                    : 'text-[#8C7365] hover:text-[#5C4033]'
                }`}
              >
                Daftar
              </button>
            </div>

            {/* Error Alert */}
            {(localError || authError) && (
              <div className="mb-4 p-3 rounded-xl bg-[#FF8A8A]/25 border-[1.5px] border-[#5C4033] flex items-center gap-2 text-xs font-semibold text-[#5C4033]">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#5C4033]" strokeWidth={2} />
                <span>{localError || authError}</span>
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={onSubmitForm} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label
                    htmlFor="register-username"
                    className="block text-xs font-semibold text-[#5C4033] mb-1.5"
                  >
                    Nama Panggilan
                  </label>
                  <input
                    id="register-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: Nadia"
                    className="w-full h-[46px] px-4 rounded-xl bg-[#FFFDF9] text-[#5C4033] placeholder:text-[#8C7365] text-sm border-2 border-[#5C4033]/30 focus:border-[#5C4033] focus:outline-none transition-colors"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-identifier"
                  className="block text-xs font-semibold text-[#5C4033] mb-1.5"
                >
                  Username atau Email
                </label>
                <input
                  id="auth-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="nadia@jogja.id atau nadia"
                  className="w-full h-[46px] px-4 rounded-xl bg-[#FFFDF9] text-[#5C4033] placeholder:text-[#8C7365] text-sm border-2 border-[#5C4033]/30 focus:border-[#5C4033] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-semibold text-[#5C4033] mb-1.5"
                >
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full h-[46px] px-4 rounded-xl bg-[#FFFDF9] text-[#5C4033] placeholder:text-[#8C7365] text-sm border-2 border-[#5C4033]/30 focus:border-[#5C4033] focus:outline-none transition-colors"
                />
              </div>

              {/* Tombol Utama (Masuk Sekarang): w-full, h-12 (48px), latar #FFB7C5 (Pink), teks #5C4033 font-bold */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-12 mt-2 rounded-xl bg-[#FFB7C5] text-[#5C4033] font-bold text-sm border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] hover:brightness-[1.02] active:translate-y-0.5 active:shadow-[0_2px_0_#5C4033] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Compass className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
                <span>
                  {authLoading
                    ? 'Memproses...'
                    : mode === 'register'
                    ? 'Daftar & Masuk Sekarang'
                    : 'Masuk Sekarang'}
                </span>
              </button>
            </form>

            {/* Pemisah (atau): Garis horizontal tipis dengan teks 12px */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="w-full border-t border-[#5C4033]/25" />
              <span className="px-3 bg-[#FFFDF9] text-[12px] font-medium text-[#8C7365]">
                atau
              </span>
              <div className="w-full border-t border-[#5C4033]/25" />
            </div>

            {/* Tombol Guest Mode (Jelajahi sebagai Tamu): w-full, h-[46px], latar #A0E7E5 (Cyan), border-2 border-[#5C4033] */}
            <button
              type="button"
              onClick={onGuestClick}
              disabled={authLoading}
              className="w-full h-[46px] rounded-xl bg-[#A0E7E5] text-[#5C4033] font-bold text-sm border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] hover:brightness-[1.02] active:translate-y-0.5 active:shadow-[0_2px_0_#5C4033] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
              <span>Jelajahi sebagai Tamu</span>
            </button>

            <p className="text-[12px] text-[#8C7365] text-center mt-3 leading-[1.4]">
              1-klik akses langsung bagi Dewan Juri ISCOMFEST 2026 tanpa perlu registrasi.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
