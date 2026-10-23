import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  MapPin,
  Key,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Database,
  Navigation,
  Star,
  Clock,
  Settings,
  Layers,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CATEGORIES,
  CATEGORY_CONFIG,
  YOGYAKARTA_PLACES,
} from '../../services/yogyakartaPlaces';
import { searchLocationWithGoogleMaps } from '../../services/googlePlacesService';

const QUICK_SEARCH_EXAMPLES = [
  { label: 'Museum Sonobudoyo', category: 'museum' },
  { label: 'Museum Ullen Sentalu', category: 'museum' },
  { label: 'Blanco Coffee & Books', category: 'cafe_book' },
  { label: 'Buku Akik Yogyakarta', category: 'cafe_book' },
  { label: 'Grhatama Pustaka DIY', category: 'perpustakaan' },
  { label: 'Perpustakaan Kota Yogyakarta', category: 'perpustakaan' },
];

export default function AdminMenuModal() {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    googleMapsApiKey,
    updateGoogleMapsApiKey,
    places,
    addAdminLocation,
    removeAdminLocation,
    clearAdminLocations,
    importYogyakartaPresets,
    selectPlaceOnMap,
  } = useApp();

  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'manage' | 'api'
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.MUSEUM);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState('');

  // Customizing a search result before saving
  const [editingDraft, setEditingDraft] = useState(null);
  const [savingPlaceId, setSavingPlaceId] = useState(null);
  const [statusBanner, setStatusBanner] = useState('');

  // API Key Tab State
  const [apiKeyInput, setApiKeyInput] = useState(googleMapsApiKey || '');
  const [savingKey, setSavingKey] = useState(false);

  if (!isAdminModalOpen) return null;

  const triggerSearch = async (queryOverride = null, categoryOverride = null) => {
    const q = (queryOverride ?? searchQuery).trim();
    const cat = categoryOverride ?? selectedCategory;
    if (!q) {
      setSearchMessage('Masukkan nama lokasi di Yogyakarta yang ingin dicari.');
      return;
    }

    setSearching(true);
    setSearchMessage('');
    setEditingDraft(null);

    try {
      const found = await searchLocationWithGoogleMaps(q, cat, apiKeyInput || googleMapsApiKey);
      setSearchResults(found);
      if (found.length === 0) {
        setSearchMessage(
          `Tidak ditemukan hasil untuk "${q}". Coba kata kunci lain di wilayah Yogyakarta.`
        );
      }
    } catch (err) {
      setSearchMessage(`Gagal mencari lokasi: ${err.message}`);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    triggerSearch();
  };

  const handleAddResultToMap = async (resultItem) => {
    setSavingPlaceId(resultItem.placeId);
    setStatusBanner('');
    try {
      await addAdminLocation({
        ...resultItem,
        category: resultItem.category || selectedCategory,
      });
      setStatusBanner(
        `✓ Lokasi "${resultItem.displayName || resultItem.name}" (${resultItem.coordinates[1]}, ${resultItem.coordinates[0]}) berhasil diinput ke Peta & Cloud Firestore!`
      );
      setEditingDraft(null);
    } finally {
      setSavingPlaceId(null);
    }
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    setSavingKey(true);
    setStatusBanner('');
    try {
      await updateGoogleMapsApiKey(apiKeyInput);
      setStatusBanner(
        '✓ Google Maps API Key berhasil disimpan ke Cloud Firestore & siap digunakan untuk pencarian lokasi!'
      );
    } finally {
      setSavingKey(false);
    }
  };

  const isAlreadyAdded = (placeId, coordinates) => {
    return places.some(
      (p) =>
        p.placeId === placeId ||
        (Array.isArray(p.coordinates) &&
          Array.isArray(coordinates) &&
          Math.abs(p.coordinates[0] - coordinates[0]) < 0.0005 &&
          Math.abs(p.coordinates[1] - coordinates[1]) < 0.0005)
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        key="admin-menu-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsAdminModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#5C4033]/35 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ y: 28, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 28, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[860px] max-h-[88vh] flex flex-col rounded-3xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_10px_0_#5C4033] p-5 md:p-6 overflow-hidden my-auto"
        >
          {/* Header Admin Menu */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#5C4033]/15 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFE699] border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-[#5C4033]" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] md:text-[20px] font-bold text-[#5C4033] leading-[1.3]">
                    Menu Admin — Set Lokasi & Google Maps API
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#88D49E] border border-[#5C4033] text-[11px] font-bold text-[#5C4033]">
                    Firestore Connected
                  </span>
                </div>
                <p className="text-[12px] font-medium text-[#8C7365] mt-0.5">
                  Cari nama lokasi di Yogyakarta, dapatkan koordinat otomatis via Google Maps API, dan kelola pin peta utama.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAdminModalOpen(false)}
              aria-label="Tutup Menu Admin"
              className="w-10 h-10 rounded-xl bg-[#F5EFE6] hover:bg-[#FF8A8A]/40 border-2 border-[#5C4033] text-[#5C4033] flex items-center justify-center shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
            >
              <X className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
            </button>
          </div>

          {/* Status Feedback Banner */}
          {statusBanner && (
            <div className="mb-4 p-3 rounded-2xl bg-[#88D49E]/40 border-[1.5px] border-[#5C4033] flex items-center justify-between gap-2 text-xs font-bold text-[#5C4033]">
              <span>{statusBanner}</span>
              <button
                type="button"
                onClick={() => setStatusBanner('')}
                className="px-2 py-0.5 rounded-lg bg-[#FFFDF9] border border-[#5C4033] text-[11px]"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Navigation Tabs inside Admin Modal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#F5EFE6] border-[1.5px] border-[#5C4033] mb-4 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`h-10 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'search'
                  ? 'bg-[#FFE699] text-[#5C4033] border-[1.5px] border-[#5C4033] shadow-[0_2px_0_#5C4033]'
                  : 'text-[#8C7365] hover:text-[#5C4033]'
              }`}
            >
              <Search className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
              <span>1. Cari & Input Lokasi (Google Maps)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className={`h-10 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'manage'
                  ? 'bg-[#FFB7C5] text-[#5C4033] border-[1.5px] border-[#5C4033] shadow-[0_2px_0_#5C4033]'
                  : 'text-[#8C7365] hover:text-[#5C4033]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
              <span>2. Daftar Lokasi Aktif ({places.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('api')}
              className={`h-10 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'api'
                  ? 'bg-[#A0E7E5] text-[#5C4033] border-[1.5px] border-[#5C4033] shadow-[0_2px_0_#5C4033]'
                  : 'text-[#8C7365] hover:text-[#5C4033]'
              }`}
            >
              <Key className="w-4 h-4 text-[#5C4033]" strokeWidth={2} />
              <span>3. Set Google Maps API & DB</span>
            </button>
          </div>

          {/* Main Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* ==================== TAB 1: CARI & INPUT LOKASI VIA GOOGLE MAPS API ==================== */}
            {activeTab === 'search' && (
              <div className="space-y-4">
                {/* Search Form Box */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="p-4 rounded-2xl bg-[#F5EFE6] border-[1.5px] border-[#5C4033] space-y-3"
                >
                  {/* Pilih Kategori Lokasi yang Akan Diinput */}
                  <div>
                    <label className="block text-xs font-bold text-[#5C4033] mb-1.5">
                      Pilih Kategori Lokasi:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'museum', label: 'Museum', colorHex: '#FFE699' },
                        { id: 'cafe_book', label: 'Cafe Book', colorHex: '#FFB7C5' },
                        {
                          id: 'perpustakaan',
                          label: 'Perpustakaan',
                          colorHex: '#A0E7E5',
                        },
                      ].map((cat) => {
                        const active = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            style={{
                              backgroundColor: active ? cat.colorHex : '#FFFDF9',
                            }}
                            className={`h-11 px-3 rounded-xl border-2 border-[#5C4033] text-xs font-bold text-[#5C4033] flex items-center justify-center gap-2 transition-all ${
                              active
                                ? 'shadow-[0_3px_0_#5C4033] -translate-y-0.5'
                                : 'opacity-80 hover:opacity-100'
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-[#5C4033]"
                              style={{ backgroundColor: cat.colorHex }}
                            />
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input Pencarian Nama Lokasi */}
                  <div>
                    <label
                      htmlFor="admin-place-search"
                      className="block text-xs font-bold text-[#5C4033] mb-1.5"
                    >
                      Cari Nama Tempat di Yogyakarta (Google Maps akan mencari lokasi & koordinatnya):
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Search
                          className="w-4 h-4 text-[#8C7365] absolute left-3.5 top-1/2 -translate-y-1/2"
                          strokeWidth={2}
                        />
                        <input
                          id="admin-place-search"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Contoh: Museum Sonobudoyo, Blanco Coffee, Grhatama Pustaka..."
                          className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#FFFDF9] text-[#5C4033] placeholder:text-[#8C7365] text-sm font-medium border-2 border-[#5C4033] focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={searching}
                        className="h-12 px-5 rounded-xl bg-[#FFE699] text-[#5C4033] font-bold text-sm border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] hover:brightness-[1.02] active:translate-y-0.5 active:shadow-[0_2px_0_#5C4033] transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
                      >
                        <Search className="w-4 h-4 text-[#5C4033]" strokeWidth={2.2} />
                        <span>
                          {searching ? 'Mencari Koordinat...' : 'Cari via Google Maps API'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Contoh Pencarian Cepat 1-Klik */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-[#8C7365] mr-1">
                      Coba Cari Cepat:
                    </span>
                    {QUICK_SEARCH_EXAMPLES.map((ex) => (
                      <button
                        key={ex.label}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(ex.category);
                          setSearchQuery(ex.label);
                          triggerSearch(ex.label, ex.category);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#FFFDF9] hover:bg-[#FFE699] border border-[#5C4033]/50 text-[11px] font-semibold text-[#5C4033] transition-colors"
                      >
                        + {ex.label}
                      </button>
                    ))}
                  </div>
                </form>

                {searchMessage && (
                  <div className="p-4 rounded-2xl bg-[#FFE699]/40 border-[1.5px] border-[#5C4033] text-xs font-semibold text-[#5C4033] text-center">
                    {searchMessage}
                  </div>
                )}

                {/* Modal / Box Edit Draft Sebelum Disimpan */}
                {editingDraft && (
                  <div className="p-4 rounded-2xl bg-[#FFE699]/25 border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#5C4033] flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-[#5C4033]" />
                        <span>Sesuaikan Detail & Koordinat Sebelum Disimpan</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingDraft(null)}
                        className="text-xs font-bold text-[#5C4033] underline"
                      >
                        Batal Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#5C4033] mb-1">
                          Nama Lokasi
                        </label>
                        <input
                          type="text"
                          value={editingDraft.displayName}
                          onChange={(e) =>
                            setEditingDraft({
                              ...editingDraft,
                              displayName: e.target.value,
                              name: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-xl bg-[#FFFDF9] border-[1.5px] border-[#5C4033] text-xs font-bold text-[#5C4033]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#5C4033] mb-1">
                          Kategori
                        </label>
                        <select
                          value={editingDraft.category}
                          onChange={(e) =>
                            setEditingDraft({
                              ...editingDraft,
                              category: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-xl bg-[#FFFDF9] border-[1.5px] border-[#5C4033] text-xs font-bold text-[#5C4033]"
                        >
                          <option value="museum">Museum</option>
                          <option value="cafe_book">Cafe Book</option>
                          <option value="perpustakaan">Perpustakaan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#5C4033] mb-1">
                          Latitude (Yogyakarta)
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={editingDraft.coordinates[1]}
                          onChange={(e) =>
                            setEditingDraft({
                              ...editingDraft,
                              coordinates: [
                                editingDraft.coordinates[0],
                                parseFloat(e.target.value) || -7.7956,
                              ],
                            })
                          }
                          className="w-full h-10 px-3 rounded-xl bg-[#FFFDF9] border-[1.5px] border-[#5C4033] text-xs font-bold text-[#5C4033]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#5C4033] mb-1">
                          Longitude (Yogyakarta)
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={editingDraft.coordinates[0]}
                          onChange={(e) =>
                            setEditingDraft({
                              ...editingDraft,
                              coordinates: [
                                parseFloat(e.target.value) || 110.3695,
                                editingDraft.coordinates[1],
                              ],
                            })
                          }
                          className="w-full h-10 px-3 rounded-xl bg-[#FFFDF9] border-[1.5px] border-[#5C4033] text-xs font-bold text-[#5C4033]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#5C4033] mb-1">
                        Deskripsi Singkat Lokasi
                      </label>
                      <textarea
                        rows={2}
                        value={editingDraft.description}
                        onChange={(e) =>
                          setEditingDraft({
                            ...editingDraft,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-[#FFFDF9] border-[1.5px] border-[#5C4033] text-xs text-[#5C4033]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddResultToMap(editingDraft)}
                      className="w-full h-11 rounded-xl bg-[#FFB7C5] text-[#5C4033] font-bold text-xs border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4 text-[#5C4033]" strokeWidth={2.5} />
                      <span>Simpan Hasil Edit ke Peta & Firestore</span>
                    </button>
                  </div>
                )}

                {/* Daftar Hasil Pencarian Google Maps API */}
                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#5C4033]">
                        Hasil Pencarian Lokasi & Koordinat ({searchResults.length} ditemukan):
                      </h3>
                      <span className="text-[11px] font-medium text-[#8C7365]">
                        Klik &ldquo;Input Lokasi ke Peta&rdquo; untuk menambahkan pin
                      </span>
                    </div>

                    {searchResults.map((item) => {
                      const catInfo =
                        CATEGORY_CONFIG[item.category || selectedCategory] ||
                        CATEGORY_CONFIG.museum;
                      const added = isAlreadyAdded(item.placeId, item.coordinates);

                      return (
                        <div
                          key={item.placeId}
                          className="p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#5C4033] shadow-[0_4px_0_#5C4033] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3.5 min-w-0 flex-1">
                            {item.photos?.[0] && (
                              <img
                                src={item.photos[0]}
                                alt={item.displayName}
                                className="w-20 h-20 rounded-xl object-cover border-[1.5px] border-[#5C4033] shrink-0"
                              />
                            )}

                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span
                                  className="px-2.5 py-0.5 rounded-full border border-[#5C4033] text-[11px] font-bold text-[#5C4033]"
                                  style={{ backgroundColor: catInfo.colorHex }}
                                >
                                  {catInfo.label}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-[#F5EFE6] border border-[#5C4033]/30 text-[11px] font-semibold text-[#5C4033]">
                                  {item.searchSource || 'Google Maps API'}
                                </span>
                                <span className="text-xs font-bold text-[#5C4033] flex items-center gap-0.5">
                                  <Star className="w-3.5 h-3.5 fill-[#FFE699] text-[#5C4033]" />
                                  {item.rating}
                                </span>
                              </div>

                              <h4 className="text-base font-bold text-[#5C4033] truncate">
                                {item.displayName || item.name}
                              </h4>

                              <p className="text-xs text-[#8C7365] line-clamp-1">
                                {item.address}
                              </p>

                              {/* Koordinat Lat & Lng yang ditemukan otomatis */}
                              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#A0E7E5]/50 border border-[#5C4033] text-[11px] font-bold text-[#5C4033]">
                                  <MapPin className="w-3 h-3 text-[#5C4033]" />
                                  Lat: {item.coordinates[1]}, Lng: {item.coordinates[0]}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8C7365]">
                                  <Clock className="w-3 h-3 text-[#5C4033]" />
                                  {item.regularOpeningHours?.todayHours || '08.00 – 21.00 WIB'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Tombol Input ke Peta & Edit */}
                          <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingDraft({
                                  ...item,
                                  category: item.category || selectedCategory,
                                })
                              }
                              className="h-11 px-3 rounded-xl bg-[#F5EFE6] hover:bg-[#FFE699] border-2 border-[#5C4033] text-xs font-bold text-[#5C4033] shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#5C4033]" />
                              <span>Detail</span>
                            </button>

                            <button
                              type="button"
                              disabled={savingPlaceId === item.placeId}
                              onClick={() => handleAddResultToMap(item)}
                              className={`h-11 px-4 rounded-xl border-2 border-[#5C4033] text-xs font-bold text-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 ${
                                added ? 'bg-[#88D49E]' : 'bg-[#FFB7C5] hover:brightness-[1.02]'
                              }`}
                            >
                              {added ? (
                                <>
                                  <Check className="w-4 h-4 text-[#5C4033]" strokeWidth={2.5} />
                                  <span>Sudah Diinput (Update)</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 text-[#5C4033]" strokeWidth={2.5} />
                                  <span>
                                    {savingPlaceId === item.placeId
                                      ? 'Menyimpan...'
                                      : 'Input Lokasi ke Peta'}
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB 2: KELOLA DAFTAR LOKASI AKTIF DI PETA ==================== */}
            {activeTab === 'manage' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F5EFE6] border-[1.5px] border-[#5C4033] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#5C4033]">
                      Total Lokasi yang Diinput Admin: {places.length} Lokasi
                    </h3>
                    <p className="text-xs text-[#8C7365]">
                      Seluruh lokasi di bawah ini tersimpan di koleksi Cloud Firestore <code>places</code> dan tampil di peta Yogyakarta.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await importYogyakartaPresets(YOGYAKARTA_PLACES.slice(0, 6));
                        setStatusBanner(
                          '✓ 6 lokasi populer Yogyakarta berhasil diimpor ke Peta & Firestore!'
                        );
                      }}
                      className="h-10 px-3 rounded-xl bg-[#FFE699] border-2 border-[#5C4033] text-xs font-bold text-[#5C4033] shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none"
                    >
                      + Muat 6 Lokasi Populer
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await importYogyakartaPresets(YOGYAKARTA_PLACES);
                        setStatusBanner(
                          '✓ 28 lokasi kurasi Yogyakarta berhasil diimpor ke Peta & Firestore!'
                        );
                      }}
                      className="h-10 px-3 rounded-xl bg-[#A0E7E5] border-2 border-[#5C4033] text-xs font-bold text-[#5C4033] shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none"
                    >
                      + Muat Semua 28 Lokasi Jogja
                    </button>

                    {places.length > 0 && (
                      <button
                        type="button"
                        onClick={async () => {
                          await clearAdminLocations();
                          setStatusBanner(
                            '✓ Seluruh lokasi di peta telah dikosongkan. Silakan input lokasi baru melalui tab Cari Lokasi.'
                          );
                        }}
                        className="h-10 px-3 rounded-xl bg-[#FF8A8A] border-2 border-[#5C4033] text-xs font-bold text-[#5C4033] shadow-[0_2px_0_#5C4033] active:translate-y-0.5 active:shadow-none"
                      >
                        Kosongkan Semua
                      </button>
                    )}
                  </div>
                </div>

                {places.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#FFFDF9] border-2 border-dashed border-[#5C4033]/40 text-center space-y-3">
                    <MapPin className="w-10 h-10 mx-auto text-[#8C7365]" strokeWidth={2} />
                    <h4 className="text-base font-bold text-[#5C4033]">
                      Belum Ada Lokasi yang Diinput oleh Admin
                    </h4>
                    <p className="text-xs text-[#8C7365] max-w-md mx-auto leading-relaxed">
                      Peta saat ini masih kosong karena lokasi wajib diinput oleh Admin. Silakan buka tab <b>1. Cari & Input Lokasi (Google Maps)</b> untuk mencari tempat dan koordinatnya!
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('search')}
                      className="h-11 px-5 rounded-xl bg-[#FFB7C5] border-2 border-[#5C4033] text-xs font-bold text-[#5C4033] shadow-[0_3px_0_#5C4033] inline-flex items-center gap-2"
                    >
                      <Search className="w-4 h-4 text-[#5C4033]" />
                      <span>Cari & Input Lokasi Sekarang</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {places.map((p) => {
                      const catInfo =
                        CATEGORY_CONFIG[p.category] || CATEGORY_CONFIG.museum;
                      return (
                        <div
                          key={p.placeId}
                          className="p-3.5 rounded-2xl bg-[#FFFDF9] border-[1.5px] border-[#5C4033] shadow-[0_3px_0_#5C4033] flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {p.photos?.[0] && (
                              <img
                                src={p.photos[0]}
                                alt={p.name}
                                className="w-14 h-14 rounded-xl object-cover border border-[#5C4033] shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <span
                                className="inline-block px-2 py-0.5 rounded-full border border-[#5C4033] text-[10px] font-bold text-[#5C4033] mb-0.5"
                                style={{ backgroundColor: catInfo.colorHex }}
                              >
                                {catInfo.label}
                              </span>
                              <h4 className="text-sm font-bold text-[#5C4033] truncate">
                                {p.displayName || p.name}
                              </h4>
                              <p className="text-[11px] font-medium text-[#8C7365] truncate">
                                Koordinat: {p.coordinates?.[1]}, {p.coordinates?.[0]}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => selectPlaceOnMap(p)}
                              title="Lihat di Peta"
                              className="w-10 h-10 rounded-xl bg-[#A0E7E5] border-[1.5px] border-[#5C4033] flex items-center justify-center text-[#5C4033]"
                            >
                              <Navigation className="w-4 h-4 text-[#5C4033]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeAdminLocation(p.placeId)}
                              title="Hapus Lokasi"
                              className="w-10 h-10 rounded-xl bg-[#F5EFE6] hover:bg-[#FF8A8A]/50 border-[1.5px] border-[#5C4033] flex items-center justify-center text-[#5C4033]"
                            >
                              <Trash2 className="w-4 h-4 text-[#5C4033]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB 3: KONFIGURASI GOOGLE MAPS API & FIRESTORE ==================== */}
            {activeTab === 'api' && (
              <div className="space-y-4">
                <form
                  onSubmit={handleSaveApiKey}
                  className="p-5 rounded-2xl bg-[#F5EFE6] border-[1.5px] border-[#5C4033] space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFE699] border-[1.5px] border-[#5C4033] flex items-center justify-center shrink-0">
                      <Key className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#5C4033]">
                        Konfigurasi Google Maps API Key
                      </h3>
                      <p className="text-xs text-[#8C7365] leading-relaxed">
                        Masukkan kunci API Google Maps (Places API / Geocoding API). Kunci ini disimpan ke Cloud Firestore (<code>settings/app_config</code>) dan langsung digunakan saat Admin mencari lokasi & koordinat.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="google-maps-api-key-input"
                      className="block text-xs font-bold text-[#5C4033] mb-1.5"
                    >
                      Google Maps API Key:
                    </label>
                    <input
                      id="google-maps-api-key-input"
                      type="text"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="AIzaSy... (Kosongkan jika ingin memakai Smart Geocode Yogyakarta)"
                      className="w-full h-12 px-4 rounded-xl bg-[#FFFDF9] text-[#5C4033] placeholder:text-[#8C7365] text-sm font-mono border-2 border-[#5C4033] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#5C4033]">
                      Status Saat Ini:{' '}
                      <span className="px-2 py-0.5 rounded-md bg-[#88D49E] border border-[#5C4033] font-bold">
                        {googleMapsApiKey
                          ? `API Key Aktif (${googleMapsApiKey.slice(0, 8)}...)`
                          : 'Mode Smart Geocode + Places Fallback Aktif'}
                      </span>
                    </span>

                    <button
                      type="submit"
                      disabled={savingKey}
                      className="h-11 px-5 rounded-xl bg-[#FFB7C5] text-[#5C4033] font-bold text-xs border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      {savingKey
                        ? 'Menyimpan ke Firestore...'
                        : 'Simpan Google Maps API Key'}
                    </button>
                  </div>
                </form>

                {/* Status Cloud Firestore untuk Login & Lokasi */}
                <div className="p-5 rounded-2xl bg-[#FFFDF9] border-[1.5px] border-[#5C4033] space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-[#5C4033]" strokeWidth={2} />
                    <h3 className="text-sm font-bold text-[#5C4033]">
                      Status Cloud Firestore Database (Login, Lokasi Admin, Archive & Saved)
                    </h3>
                  </div>
                  <p className="text-xs text-[#8C7365] leading-relaxed">
                    Terhubung ke Firebase Project <b><code>test-b9d99</code></b>:
                  </p>
                  <ul className="text-xs text-[#5C4033] space-y-1 font-medium pl-4 list-disc">
                    <li>
                      <b>Koleksi <code>users/&#123;userId&#125;</code>:</b> Menyimpan akun Login, Register, Guest Mode, dan akun Admin (<code>admin</code> / <code>admin123</code>).
                    </li>
                    <li>
                      <b>Koleksi <code>places/&#123;placeId&#125;</code>:</b> Menyimpan daftar lokasi & koordinat Yogyakarta yang diinput oleh Admin.
                    </li>
                    <li>
                      <b>Koleksi <code>settings/app_config</code>:</b> Menyimpan konfigurasi Google Maps API Key.
                    </li>
                    <li>
                      <b>Sub-koleksi <code>archives</code> & <code>saved</code>:</b> Menyimpan jurnal perjalanan dan wishlist pengguna.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
