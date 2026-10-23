import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  YOGYAKARTA_PLACES,
  CATEGORIES,
  YOGYAKARTA_CENTER,
} from '../services/yogyakartaPlaces';
import { getPlaceMetadata } from '../services/googlePlacesService';
import {
  getStoredUserSession,
  loginWithAccount,
  registerAccount,
  enterGuestMode,
  signOutSession,
  fetchAdminConfig,
  saveAdminConfig,
  fetchAdminPlaces,
  saveAdminPlace,
  deleteAdminPlace,
  clearAllAdminPlaces,
  bulkImportAdminPlaces,
  fetchUserArchives,
  upsertArchiveJournal,
  removeArchiveJournal,
  fetchUserSavedPlaces,
  toggleSavedPlace,
} from '../services/firebaseService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Authentication State (Backed by Cloud Firestore `users` collection)
  const [user, setUser] = useState(() => getStoredUserSession());
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Admin Config & Locations State (Backed by Cloud Firestore `settings/app_config` & `places`)
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);

  // Map & Category Filter State
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.ALL);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Active Overlay / View & Modals State
  const [activeView, setActiveView] = useState('map');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [journalTargetPlaceId, setJournalTargetPlaceId] = useState(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateCategory, setCertificateCategory] = useState('museum');

  // User Collections State (Firestore `users/{uid}/archives` & `users/{uid}/saved`)
  const [archives, setArchives] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);

  // Judge Demo Toggle ("Simulasi 100% Selesai (Demo Juri)")
  const [simulateComplete, setSimulateComplete] = useState(false);

  // Load Admin Config (Google Maps API Key) & Admin-inputted Locations from Cloud Firestore on boot
  useEffect(() => {
    let mounted = true;
    async function initAdminData() {
      setPlacesLoading(true);
      try {
        const [configData, firestorePlaces] = await Promise.all([
          fetchAdminConfig(),
          fetchAdminPlaces(),
        ]);
        if (mounted) {
          setGoogleMapsApiKey(configData.googleMapsApiKey || '');
          setPlaces(firestorePlaces);
        }
      } finally {
        if (mounted) setPlacesLoading(false);
      }
    }
    initAdminData();
    return () => {
      mounted = false;
    };
  }, []);

  // Load user's archives & saved places from Cloud Firestore whenever user changes
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

  // Filtered places based on category dropdown
  const filteredPlaces = useMemo(() => {
    if (activeCategory === CATEGORIES.ALL) return places;
    return places.filter((p) => p.category === activeCategory);
  }, [places, activeCategory]);

  // Currently selected place for Page 3 (Detail Lokasi)
  const selectedPlace = useMemo(() => {
    if (!selectedPlaceId) return null;
    return (
      places.find(
        (p) => p.placeId === selectedPlaceId || p.id === selectedPlaceId
      ) || null
    );
  }, [places, selectedPlaceId]);

  // Enrich selected place with live Google Maps Places metadata when selected
  useEffect(() => {
    let active = true;
    if (!selectedPlaceId) return;
    const currentObj = places.find(
      (p) => p.placeId === selectedPlaceId || p.id === selectedPlaceId
    );

    getPlaceMetadata(selectedPlaceId, currentObj).then((enriched) => {
      if (active && enriched) {
        setPlaces((prev) =>
          prev.map((p) =>
            p.placeId === selectedPlaceId || p.id === selectedPlaceId
              ? {
                  ...p,
                  ...enriched,
                  photos: (enriched.photos || p.photos || []).slice(0, 5),
                }
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
    (coordinates, zoom = 15) => {
      if (
        mapInstance &&
        Array.isArray(coordinates) &&
        coordinates.length === 2
      ) {
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

  // ==================== AUTH ACTIONS (FIRESTORE) ====================
  const handleLogin = async (identifier, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const loggedUser = await loginWithAccount(identifier, password);
      setUser(loggedUser);
      if (loggedUser.role === 'admin') {
        setIsAdminModalOpen(true);
      }
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
      if (registeredUser.role === 'admin') {
        setIsAdminModalOpen(true);
      }
      return registeredUser;
    } catch (err) {
      const msg = err.message || 'Gagal mendaftar akun baru.';
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
    setIsAdminModalOpen(false);
    setIsJournalModalOpen(false);
    setIsSavedModalOpen(false);
    setIsCertificateModalOpen(false);
    setSimulateComplete(false);
  };

  // ==================== ADMIN ACTIONS (FIRESTORE PLACES & GOOGLE MAPS API) ====================
  const updateGoogleMapsApiKey = async (newKey) => {
    const saved = await saveAdminConfig({ googleMapsApiKey: newKey });
    setGoogleMapsApiKey(saved.googleMapsApiKey);
    return saved;
  };

  const addAdminLocation = async (placePayload) => {
    const updatedList = await saveAdminPlace(placePayload);
    setPlaces(updatedList);
    if (placePayload.coordinates) {
      flyToPlace(placePayload.coordinates, 15.2);
    }
    return updatedList;
  };

  const removeAdminLocation = async (placeId) => {
    const updatedList = await deleteAdminPlace(placeId);
    setPlaces(updatedList);
    if (selectedPlaceId === placeId) {
      setSelectedPlaceId(null);
    }
    return updatedList;
  };

  const clearAdminLocations = async () => {
    const empty = await clearAllAdminPlaces();
    setPlaces(empty);
    setSelectedPlaceId(null);
    return empty;
  };

  const importYogyakartaPresets = async (subset = null) => {
    const toImport = subset || YOGYAKARTA_PLACES;
    const updatedList = await bulkImportAdminPlaces(toImport);
    setPlaces(updatedList);
    resetMapToYogyakarta();
    return updatedList;
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
      setIsAdminModalOpen(false);

      const target = places.find((p) => p.placeId === id || p.id === id);
      if (target?.coordinates) {
        flyToPlace(target.coordinates, 15);
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
          flyToPlace(nextTarget.coordinates, 15);
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
      cafe_book: {
        label: 'Cafe Book',
        visited: 0,
        total: 0,
        colorHex: '#FFB7C5',
      },
      perpustakaan: {
        label: 'Perpustakaan',
        visited: 0,
        total: 0,
        colorHex: '#A0E7E5',
      },
    };

    places.forEach((p) => {
      const cat = breakdown[p.category];
      if (cat) {
        cat.total += 1;
        if (
          simulateComplete ||
          visitedSet.has(p.placeId) ||
          visitedSet.has(p.id)
        ) {
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
      totalPlaces > 0
        ? Math.min(100, Math.round((totalVisited / totalPlaces) * 100))
        : simulateComplete
        ? 100
        : 0;

    const completedCategories = simulateComplete
      ? ['museum', 'cafe_book', 'perpustakaan']
      : Object.entries(breakdown)
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

  const openCertificateModal = useCallback(
    (categoryKey = null) => {
      const validCats = ['museum', 'cafe_book', 'perpustakaan'];
      if (categoryKey && validCats.includes(categoryKey)) {
        setCertificateCategory(categoryKey);
      } else if (progressStats.completedCategories.length > 0) {
        setCertificateCategory(progressStats.completedCategories[0]);
      } else {
        setCertificateCategory('museum');
      }
      setIsCertificateModalOpen(true);
    },
    [progressStats.completedCategories]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        authError,
        setAuthError,
        googleMapsApiKey,
        updateGoogleMapsApiKey,
        places,
        placesLoading,
        addAdminLocation,
        removeAdminLocation,
        clearAdminLocations,
        importYogyakartaPresets,
        activeCategory,
        setActiveCategory,
        filteredPlaces,
        selectedPlace,
        selectedPlaceId,
        selectPlaceOnMap,
        closePlaceModal,
        navigatePlace,
        activeView,
        setActiveView,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isJournalModalOpen,
        setIsJournalModalOpen,
        journalTargetPlaceId,
        openAddJournalModal,
        isSavedModalOpen,
        setIsSavedModalOpen,
        isCertificateModalOpen,
        setIsCertificateModalOpen,
        certificateCategory,
        setCertificateCategory,
        openCertificateModal,
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
