import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Calendar,
  MapPin,
  BookOpen,
  Sparkles,
  Camera,
  ImagePlus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_CONFIG } from '../../services/yogyakartaPlaces';

const MAX_JOURNAL_PHOTOS = 3;
const WASHI_TAPE_COLORS = ['#FFB7C5', '#FFE699', '#A0E7E5'];
const POLAROID_ROTATIONS = ['-rotate-1', 'rotate-1', '-rotate-1'];

/**
 * Compress & resize an uploaded image file into a lightweight JPEG data URL
 * so up to 3 photos can be stored directly in Cloud Firestore & localStorage.
 */
function compressImageFile(file, maxDimension = 840, quality = 0.78) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar (JPG, PNG, atau WEBP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file foto.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak didukung.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFDF9';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Sub-Modal / Form Input Jurnal (Add / Edit Journal)
 * - Dilengkapi fitur Upload Foto Dokumentasi bergaya Polaroid Scrapbook (Drag & Drop + Multi-Foto hingga 3 foto)
 * - Rating murni diambil langsung dari Google Maps (`currentPlace.rating`)
 * - Disimpan ke koleksi Cloud Firestore `users/{userId}/archives/{placeId}`
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
  const [userPhotos, setUserPhotos] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  const isAdmin =
    user?.role === 'admin' || user?.username?.toLowerCase() === 'admin';

  useEffect(() => {
    if (!isJournalModalOpen) return;
    const initialId = journalTargetPlaceId || places[0]?.placeId || '';
    setSelectedPlaceId(initialId);

    const existing = getJournalForPlace(initialId);
    if (existing) {
      setVisitedDate(
        existing.visitedDate || new Date().toISOString().split('T')[0]
      );
      setJournalNote(existing.journalNote || '');
      const savedPhotos = Array.isArray(existing.userPhotos)
        ? existing.userPhotos
        : existing.userPhoto
        ? [existing.userPhoto]
        : [];
      setUserPhotos(savedPhotos.slice(0, MAX_JOURNAL_PHOTOS));
    } else {
      setVisitedDate(new Date().toISOString().split('T')[0]);
      setJournalNote('');
      setUserPhotos([]);
    }
    setErrorMsg('');
  }, [isJournalModalOpen, journalTargetPlaceId, places, getJournalForPlace]);

  const handlePlaceChange = (newPlaceId) => {
    setSelectedPlaceId(newPlaceId);
    const existing = getJournalForPlace(newPlaceId);
    if (existing) {
      setVisitedDate(
        existing.visitedDate || new Date().toISOString().split('T')[0]
      );
      setJournalNote(existing.journalNote || '');
      const savedPhotos = Array.isArray(existing.userPhotos)
        ? existing.userPhotos
        : existing.userPhoto
        ? [existing.userPhoto]
        : [];
      setUserPhotos(savedPhotos.slice(0, MAX_JOURNAL_PHOTOS));
    } else {
      setJournalNote('');
      setUserPhotos([]);
    }
  };

  if (!isJournalModalOpen) return null;

  const currentPlace =
    places.find(
      (p) => p.placeId === selectedPlaceId || p.id === selectedPlaceId
    ) || places[0];
  const catInfo =
    CATEGORY_CONFIG[currentPlace?.category] || CATEGORY_CONFIG.museum;

  const processSelectedFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const remainingSlots = MAX_JOURNAL_PHOTOS - userPhotos.length;
    if (remainingSlots <= 0) {
      setErrorMsg(`Maksimal ${MAX_JOURNAL_PHOTOS} foto dokumentasi per jurnal.`);
      return;
    }

    setErrorMsg('');
    setUploadingPhotos(true);
    try {
      const filesToProcess = files.slice(0, remainingSlots);
      const compressedList = await Promise.all(
        filesToProcess.map((file) => compressImageFile(file))
      );
      setUserPhotos((prev) =>
        [...prev, ...compressedList].slice(0, MAX_JOURNAL_PHOTOS)
      );
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memproses foto dokumentasi.');
    } finally {
      setUploadingPhotos(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e) => {
    processSelectedFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files?.length) {
      processSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleRemovePhoto = (indexToRemove) => {
    setUserPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryPhoto = (indexToPromote) => {
    if (indexToPromote === 0) return;
    setUserPhotos((prev) => {
      const next = [...prev];
      const [chosen] = next.splice(indexToPromote, 1);
      return [chosen, ...next];
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!currentPlace) {
      setErrorMsg('Pilih lokasi di Yogyakarta terlebih dahulu.');
      return;
    }
    if (!journalNote.trim()) {
      setErrorMsg(
        'Tuliskan cerita pengalaman atau kesan kunjunganmu terlebih dahulu.'
      );
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
        userPhotos,
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
          className="w-full max-w-[540px] max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_8px_0_#5C4033] p-5 md:p-6 my-auto"
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
                  Abadikan momen & foto kunjunganmu ke dalam Archive
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
                      [{CATEGORY_CONFIG[p.category]?.label}]{' '}
                      {p.displayName || p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Info Rating dari Google Maps + Tanggal Kunjungan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  className="w-full h-[46px] px-3.5 rounded-2xl bg-[#FFFDF9] text-[#5C4033] text-xs md:text-sm font-semibold border-[1.5px] border-[#5C4033] focus:outline-none"
                />
              </div>

              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#5C4033] mb-1.5">
                  <Star className="w-3.5 h-3.5 text-[#5C4033]" strokeWidth={2} />
                  <span>Rating Google Maps</span>
                </span>
                <div className="h-[46px] px-3.5 rounded-2xl bg-[#F5EFE6] border-[1.5px] border-[#5C4033] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5C4033] flex items-center gap-1">
                    <Star
                      className="w-4 h-4 fill-[#FFE699] text-[#5C4033]"
                      strokeWidth={2}
                    />
                    <span>
                      {Number(currentPlace?.rating || 4.8).toFixed(1)} ★
                    </span>
                  </span>
                  <span className="text-[11px] font-medium text-[#8C7365] truncate ml-1">
                    {(currentPlace?.userRatingCount || 320).toLocaleString(
                      'id-ID'
                    )}{' '}
                    ulasan
                  </span>
                </div>
              </div>
            </div>

            {/* ==================== FITUR UPLOAD FOTO POLAROID SCRAPBOOK ==================== */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5C4033]">
                  <Camera className="w-3.5 h-3.5 text-[#5C4033]" strokeWidth={2} />
                  <span>Upload Foto Dokumentasi Kunjungan</span>
                </label>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFE699] border border-[#5C4033] text-[11px] font-bold text-[#5C4033]">
                  {userPhotos.length} / {MAX_JOURNAL_PHOTOS} Foto Polaroid
                </span>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Kondisi 1: Belum ada foto yang diupload -> Tampilkan Dropzone Polaroid Scrapbook Interaktif */}
              {userPhotos.length === 0 ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`group relative overflow-hidden rounded-2xl border-2 border-dashed border-[#5C4033] p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'bg-[#FFE699]/60 scale-[1.01] shadow-[0_4px_0_#5C4033]'
                      : 'bg-gradient-to-br from-[#F5EFE6] via-[#FFFDF9] to-[#FFB7C5]/25 hover:bg-[#FFE699]/30'
                  }`}
                >
                  {/* Decorative Background Dot Pattern */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-35"
                    style={{
                      backgroundImage:
                        'radial-gradient(#5C4033 1px, transparent 1px)',
                      backgroundSize: '14px 14px',
                    }}
                  />

                  <div className="relative z-10 flex flex-col items-center">
                    {/* Stacked Mini Polaroid Illustration */}
                    <div className="relative flex items-center justify-center mb-3 mt-1">
                      <div className="w-11 h-12 rounded-xl bg-[#A0E7E5] border-2 border-[#5C4033] -rotate-12 translate-x-2 shadow-sm" />
                      <div className="w-12 h-14 rounded-xl bg-[#FFE699] border-2 border-[#5C4033] rotate-3 z-10 flex flex-col items-center justify-center p-1 shadow-[0_3px_0_#5C4033] group-hover:scale-105 transition-transform">
                        <div className="w-full h-full rounded-lg bg-[#FFFDF9] border border-[#5C4033] flex items-center justify-center">
                          <Camera
                            className="w-5 h-5 text-[#5C4033]"
                            strokeWidth={2.2}
                          />
                        </div>
                      </div>
                      <div className="w-11 h-12 rounded-xl bg-[#FFB7C5] border-2 border-[#5C4033] rotate-12 -translate-x-2 shadow-sm" />
                    </div>

                    <p className="text-xs md:text-sm font-bold text-[#5C4033]">
                      {uploadingPhotos
                        ? 'Memproses Bingkai Foto Polaroid...'
                        : isDragging
                        ? 'Lepaskan Foto di Sini!'
                        : 'Tarik & Lepas Foto ke Sini, atau Klik untuk Memilih'}
                    </p>
                    <p className="text-[11px] font-medium text-[#8C7365] mt-1 max-w-xs">
                      Abadikan sudut favoritmu di museum, buku yang sedang dibaca, atau suasana kafe literasi (Maks. 3 foto JPG/PNG/WEBP)
                    </p>

                    <span className="mt-3 h-9 px-4 rounded-xl bg-[#FFE699] group-hover:bg-[#FFB7C5] border-2 border-[#5C4033] text-xs font-bold text-[#5C4033] shadow-[0_2px_0_#5C4033] inline-flex items-center gap-1.5 transition-colors">
                      <ImagePlus
                        className="w-4 h-4 text-[#5C4033]"
                        strokeWidth={2.2}
                      />
                      <span>Pilih Foto dari Perangkat</span>
                    </span>
                  </div>
                </div>
              ) : (
                /* Kondisi 2: Sudah ada foto -> Tampilkan Galeri Bingkai Polaroid Scrapbook */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="p-3.5 rounded-2xl bg-[#F5EFE6] border-2 border-dashed border-[#5C4033] space-y-3"
                >
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    {userPhotos.map((photoDataUrl, idx) => {
                      const isPrimary = idx === 0;
                      const tapeColor =
                        WASHI_TAPE_COLORS[idx % WASHI_TAPE_COLORS.length];
                      const tiltClass =
                        POLAROID_ROTATIONS[idx % POLAROID_ROTATIONS.length];

                      return (
                        <div
                          key={idx}
                          className={`group relative rounded-2xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] p-1.5 pb-2 transition-all hover:rotate-0 hover:-translate-y-0.5 ${tiltClass}`}
                        >
                          {/* Decorative Washi Tape at Top Center */}
                          <div
                            style={{ backgroundColor: tapeColor }}
                            className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 rounded-sm border border-[#5C4033]/60 opacity-90 z-10"
                          />

                          {/* Remove Photo Button */}
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            title="Hapus foto ini"
                            aria-label={`Hapus foto ${idx + 1}`}
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#FF8A8A] hover:brightness-105 border-[1.5px] border-[#5C4033] text-[#5C4033] shadow-[0_2px_0_#5C4033] flex items-center justify-center z-20"
                          >
                            <Trash2
                              className="w-3.5 h-3.5 text-[#5C4033]"
                              strokeWidth={2.2}
                            />
                          </button>

                          {/* Polaroid Image Frame */}
                          <div className="w-full aspect-square rounded-xl overflow-hidden border border-[#5C4033]/30 bg-[#F5EFE6]">
                            <img
                              src={photoDataUrl}
                              alt={`Dokumentasi Jurnal ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Polaroid Bottom Caption / Primary Selector */}
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryPhoto(idx)}
                            className={`mt-1.5 w-full py-1 px-1.5 rounded-lg text-[10px] font-bold text-[#5C4033] flex items-center justify-center gap-1 transition-colors ${
                              isPrimary
                                ? 'bg-[#FFE699] border border-[#5C4033]'
                                : 'bg-[#F5EFE6] hover:bg-[#FFE699]/60 border border-transparent'
                            }`}
                          >
                            {isPrimary ? (
                              <>
                                <CheckCircle2
                                  className="w-3 h-3 text-[#5C4033] shrink-0"
                                  strokeWidth={2.3}
                                />
                                <span className="truncate">Sampul Utama</span>
                              </>
                            ) : (
                              <span className="truncate">Jadikan Sampul</span>
                            )}
                          </button>
                        </div>
                      );
                    })}

                    {/* Add More Photo Slot if < 3 */}
                    {userPhotos.length < MAX_JOURNAL_PHOTOS && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhotos}
                        className="rounded-2xl bg-[#FFFDF9]/80 hover:bg-[#FFE699]/40 border-2 border-dashed border-[#5C4033] p-2 flex flex-col items-center justify-center gap-1.5 text-[#5C4033] transition-all min-h-[120px]"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#A0E7E5] border-[1.5px] border-[#5C4033] shadow-[0_2px_0_#5C4033] flex items-center justify-center">
                          <ImagePlus
                            className="w-4 h-4 text-[#5C4033]"
                            strokeWidth={2.2}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#5C4033]">
                          + Tambah Foto
                        </span>
                        <span className="text-[10px] font-medium text-[#8C7365]">
                          Sisa {MAX_JOURNAL_PHOTOS - userPhotos.length} slot
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
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
                rows={3}
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="Ceritakan koleksi museum yang paling berkesan, buku yang kamu baca, atau suasana sudut baca favoritmu di Yogyakarta..."
                className="w-full p-3.5 rounded-2xl bg-[#FFFDF9] text-[#5C4033] placeholder:text-[#8C7365] text-sm leading-[1.6] border-[1.5px] border-[#5C4033] focus:outline-none"
              />
            </div>

            {/* Tombol Aksi (h-12 / 48px) */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsJournalModalOpen(false)}
                className="h-12 px-5 rounded-xl bg-[#F5EFE6] text-[#5C4033] font-semibold text-sm border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving || uploadingPhotos}
                className="flex-1 h-12 px-5 rounded-xl bg-[#FFB7C5] text-[#5C4033] font-bold text-sm border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] hover:brightness-[1.02] active:translate-y-0.5 active:shadow-[0_2px_0_#5C4033] transition-all disabled:opacity-60"
              >
                {saving ? 'Menyimpan Jurnal & Foto...' : 'Simpan ke Archive'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
