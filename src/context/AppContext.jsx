import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { YOGYAKARTA_PLACES, CATEGORIES, YOGYAKARTA_CENTER } from '../services/yogyakartaPlaces';
import { getPlaceMetadata } from '../services/googlePlacesService';
import {
  getStoredUserSession,
  loginWithAccount,
  registerAccount,
  loginWithGooglePopup,
  enterGuestMode,
  signOutSession,
  fetchUserArchives,
  upsertArchiveJournal,
  removeArchiveJournal,
  fetchUserSavedPlaces,
  toggleSavedPlace,
} from '../services/firebaseService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Authentication State
  const [user, setUser] = useState(() => getStoredUserSession());
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Map & Category Filter State
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.ALL);
  const [places, setPlaces] = useState(YOGYAKARTA_PLACES);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Active Overlay / View State
  // 'map' = Page 2 (or Page 3 if selectedPlaceId is set), 'archive' = Page 4 Full Overlay Drawer
  const [activeView, setActiveView] = useState('map');
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [journalTargetPlaceId, setJournalTargetPlaceId] = useState(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // User Collections State (Firestore + LocalStorage Fallback)
  const [archives, setArchives] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);

  // Special Judge Demo Feature: "Simulasi 100% Selesai (Demo Juri)"
  const [simulateComplete, setSimulateComplete] = useState(false);

  // Load user's archives & saved places whenever user changes
  useEffect(() => {
    let isMounted = true;
    async function loadUserCollections() {
      if (!user) {
        if (isMounted) {
          setArchives([]);
          setSavedPlaces([]);
        }
        return;
      }
      const [loadedArchives, loadedSaved] = await Promise.all([
        fetchUserArchives(user.uid),
        fetchUserSavedPlaces(user.uid),
      ]);
      if (isMounted) {
        setArchives(loadedArchives);
        setSavedPlaces(loadedSaved);
      }
    }
    loadUserCollections();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Filtered Yogyakarta places based on category dropdown
  const filteredPlaces = useMemo(() => {
    if (activeCategory === CATEGORIES.ALL) return places;
    return places.filter((p) => p.category === activeCategory);
  }, [places, activeCategory]);

  // Currently selected place for Page 3 (Detail Lokasi)
  const selectedPlace = useMemo(() => {
    if (!selectedPlaceId) return null;
    return (
      places.find((p) => p.placeId === selectedPlaceId || p.id === selectedPlaceId) || null
    );
  }, [places, selectedPlaceId]);

  // Fetch live Google Maps Places metadata (if API key set) when a place is selected
  useEffect(() => {
    let active = true;
    if (!selectedPlaceId) return;

    getPlaceMetadata(selectedPlaceId).then((enriched) => {
      if (active && enriched) {
        setPlaces((prev) =>
          prev.map((p) =>
            p.placeId === selectedPlaceId || p.id === selectedPlaceId
              ? { ...p, ...enriched, photos: (enriched.photos || p.photos || []).slice(0, 5) }
              : p
          )
        );
      }
    });

    return () => {
      active = false;
    };
  }, [selectedPlaceId]);

  // Camera FlyTo helper for Yogyakarta MapLibre instance
  const flyToPlace = useCallback(
    (coordinates, zoom = 14.8) => {
      if (mapInstance && Array.isArray(coordinates) && coordinates.length === 2) {
        mapInstance.flyTo({
          center: coordinates,
          zoom,
          speed: 1.25,
          curve: 1.35,
          essential: true,
        });
      }
    },
    [mapInstance]
  );

  const resetMapToYogyakarta = useCallback(() => {
    if (mapInstance) {
      mapInstance.flyTo({
        center: YOGYAKARTA_CENTER,
        zoom: 12.2,
        speed: 1.2,
        essential: true,
      });
    }
  }, [mapInstance]);

  // ==================== AUTH ACTIONS ====================
  const handleLogin = async (identifier, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const loggedUser = await loginWithAccount(identifier, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      const msg = err.message || 'Gagal masuk. Periksa kembali akun Anda.';
      setAuthError(msg);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const registeredUser = await registerAccount(username, email, password);
      setUser(registeredUser);
      return registeredUser;
    } catch (err) {
      const msg = err.message || 'Gagal mendaftar akun baru.';
      setAuthError(msg);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const googleUser = await loginWithGooglePopup();
      setUser(googleUser);
      return googleUser;
    } catch (err) {
      const msg = err.message || 'Gagal masuk dengan Google.';
      setAuthError(msg);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGuestMode = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const guestUser = await enterGuestMode();
      setUser(guestUser);
      return guestUser;
    } catch (err) {
      const msg = err.message || 'Gagal memulai mode tamu.';
      setAuthError(msg);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutSession();
    setUser(null);
    setSelectedPlaceId(null);
    setActiveView('map');
    setIsJournalModalOpen(false);
    setIsSavedModalOpen(false);
    setIsCertificateModalOpen(false);
    setSimulateComplete(false);
  };

  // ==================== PLACE NAVIGATION (PAGE 3) ====================
  const selectPlaceOnMap = useCallback(
    (placeOrId) => {
      const id =
        typeof placeOrId === 'string'
          ? placeOrId
          : placeOrId?.placeId || placeOrId?.id;
      if (!id) return;
      setSelectedPlaceId(id);
      setActiveView('map');
      setIsSavedModalOpen(false);

      const target = places.find((p) => p.placeId === id || p.id === id);
      if (target?.coordinates) {
        flyToPlace(target.coordinates, 14.8);
      }
    },
    [places, flyToPlace]
  );

  const closePlaceModal = useCallback(() => {
    setSelectedPlaceId(null);
  }, []);

  const navigatePlace = useCallback(
    (direction) => {
      if (!filteredPlaces.length) return;
      const currentIndex = filteredPlaces.findIndex(
        (p) => p.placeId === selectedPlaceId || p.id === selectedPlaceId
      );
      const safeIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextIndex =
        (safeIndex + direction + filteredPlaces.length) % filteredPlaces.length;
      const nextTarget = filteredPlaces[nextIndex];
      if (nextTarget) {
        setSelectedPlaceId(nextTarget.placeId);
        if (nextTarget.coordinates) {
          flyToPlace(nextTarget.coordinates, 14.8);
        }
      }
    },
    [filteredPlaces, selectedPlaceId, flyToPlace]
  );

  // ==================== ARCHIVE & SAVED HELPERS ====================
  const isPlaceVisited = useCallback(
    (placeId) => {
      if (simulateComplete) return true;
      return archives.some((a) => a.placeId === placeId);
    },
    [archives, simulateComplete]
  );

  const getJournalForPlace = useCallback(
    (placeId) => {
      return archives.find((a) => a.placeId === placeId) || null;
    },
    [archives]
  );

  const isPlaceSaved = useCallback(
    (placeId) => {
      return savedPlaces.some((s) => s.placeId === placeId);
    },
    [savedPlaces]
  );

  const handleToggleSaved = async (place) => {
    if (!user || !place) return;
    const updated = await toggleSavedPlace(user.uid, place);
    setSavedPlaces(updated);
  };

  const openAddJournalModal = (placeOrId = null) => {
    const resolvedId =
      typeof placeOrId === 'string'
        ? placeOrId
        : placeOrId?.placeId ||
          placeOrId?.id ||
          selectedPlaceId ||
          filteredPlaces[0]?.placeId ||
          places[0]?.placeId;
    setJournalTargetPlaceId(resolvedId);
    setIsJournalModalOpen(true);
  };

  const handleSaveJournal = async (payload) => {
    if (!user) return;
    const updated = await upsertArchiveJournal(user.uid, payload);
    setArchives(updated);
    setIsJournalModalOpen(false);
  };

  const handleDeleteJournal = async (placeId) => {
    if (!user) return;
    const updated = await removeArchiveJournal(user.uid, placeId);
    setArchives(updated);
  };

  // ==================== PROGRESS & CERTIFICATE STATS (PAGE 4) ====================
  const progressStats = useMemo(() => {
    const visitedSet = new Set(archives.map((a) => a.placeId));

    const breakdown = {
      museum: { label: 'Museum', visited: 0, total: 0, colorHex: '#FFE699' },
      cafe_book: { label: 'Cafe Book', visited: 0, total: 0, colorHex: '#FFB7C5' },
      perpustakaan: { label: 'Perpustakaan', visited: 0, total: 0, colorHex: '#A0E7E5' },
    };

    places.forEach((p) => {
      const cat = breakdown[p.category];
      if (cat) {
        cat.total += 1;
        if (simulateComplete || visitedSet.has(p.placeId) || visitedSet.has(p.id)) {
          cat.visited += 1;
        }
      }
    });

    const totalPlaces = places.length;
    const totalVisited = simulateComplete
      ? totalPlaces
      : breakdown.museum.visited +
        breakdown.cafe_book.visited +
        breakdown.perpustakaan.visited;

    const percentage =
      totalPlaces > 0 ? Math.min(100, Math.round((totalVisited / totalPlaces) * 100)) : 0;

    const completedCategories = Object.entries(breakdown)
      .filter(([, stat]) => stat.total > 0 && stat.visited >= stat.total)
      .map(([key]) => key);

    const isEligibleForCertificate =
      simulateComplete ||
      (totalPlaces > 0 && totalVisited >= totalPlaces) ||
      completedCategories.length > 0;

    return {
      totalVisited,
      totalPlaces,
      percentage,
      breakdown,
      completedCategories,
      isEligibleForCertificate,
    };
  }, [places, archives, simulateComplete]);

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        authError,
        setAuthError,
        activeCategory,
        setActiveCategory,
        places,
        filteredPlaces,
        selectedPlace,
        selectedPlaceId,
        selectPlaceOnMap,
        closePlaceModal,
        navigatePlace,
        activeView,
        setActiveView,
        isJournalModalOpen,
        setIsJournalModalOpen,
        journalTargetPlaceId,
        openAddJournalModal,
        isSavedModalOpen,
        setIsSavedModalOpen,
        isCertificateModalOpen,
        setIsCertificateModalOpen,
        archives,
        savedPlaces,
        isPlaceVisited,
        getJournalForPlace,
        isPlaceSaved,
        handleToggleSaved,
        handleSaveJournal,
        handleDeleteJournal,
        progressStats,
        simulateComplete,
        setSimulateComplete,
        setMapInstance,
        flyToPlace,
        resetMapToYogyakarta,
        handleLogin,
        handleRegister,
        handleGoogleLogin,
        handleGuestMode,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
