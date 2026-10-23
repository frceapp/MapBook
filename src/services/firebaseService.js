/**
 * Firebase Cloud Firestore Service (Project: test-b9d99)
 * Handles:
 * 1. Firestore Login & Registration (collection: users/{userId})
 * 2. Admin-Managed Locations (collection: places/{placeId})
 * 3. Admin Google Maps API Configuration (document: settings/app_config)
 * 4. User Archives & Journals (collection: users/{userId}/archives/{placeId})
 * 5. User Saved Places (collection: users/{userId}/saved/{placeId})
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { YOGYAKARTA_PLACES } from './yogyakartaPlaces';

// Live Firebase Cloud Firestore Configuration (test-b9d99)
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyChqc5Eg8sD-lYB9ASGBSEY7Ns42ZXa0ZY',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'test-b9d99.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'test-b9d99',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'test-b9d99.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '549349331038',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:549349331038:web:d618a2ddd78098d0eee4cf',
};

export const isFirebaseActive = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);
export const isFirebaseConfigured = isFirebaseActive;

let app = null;
let auth = null;
let db = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firestore initialization warning:', error);
}

export { db, auth };

const STORAGE_KEYS = {
  USER: 'lokabaca_jogja_user_v2',
  PLACES: 'lokabaca_jogja_admin_places_v2',
  CONFIG: 'lokabaca_jogja_admin_config_v2',
  ARCHIVES_PREFIX: 'lokabaca_jogja_archives_v2_',
  SAVED_PREFIX: 'lokabaca_jogja_saved_v2_',
  USERS_DB: 'lokabaca_jogja_users_db_v2',
};

// ==================== 1. FIRESTORE LOGIN & REGISTRATION (users/{userId}) ====================

export function getStoredUserSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUserSession(userObj) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
  } catch (e) {
    console.warn('Could not persist user session:', e);
  }
}

/**
 * Register a new user account in Cloud Firestore collection `users/{userId}`
 */
export async function registerAccount(username, emailOrId, password) {
  const cleanUsername = (username || '').trim() || 'Nadia';
  const cleanIdentifier = (emailOrId || cleanUsername).trim().toLowerCase();
  const isAdminName =
    cleanIdentifier === 'admin' ||
    cleanIdentifier === 'admin@jogja.id' ||
    cleanUsername.toLowerCase() === 'admin';

  const uid = `user_${cleanIdentifier.replace(/[^a-z0-9]/g, '_')}`;

  const userProfile = {
    uid,
    username: cleanUsername,
    identifier: cleanIdentifier,
    email: cleanIdentifier.includes('@')
      ? cleanIdentifier
      : `${cleanIdentifier}@lokabaca.id`,
    password: password,
    role: isAdminName ? 'admin' : 'user',
    isGuest: false,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    try {
      const existingRef = doc(db, 'users', uid);
      const existingSnap = await getDoc(existingRef);
      if (existingSnap.exists()) {
        throw new Error(
          'Username atau email sudah terdaftar di Cloud Firestore. Silakan langsung Masuk.'
        );
      }
      await setDoc(existingRef, userProfile);
    } catch (err) {
      if (err.message?.includes('sudah terdaftar')) {
        throw err;
      }
      console.warn('Firestore registerAccount fallback:', err.message);
    }
  }

  // Local mirror backup
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    const localDb = raw ? JSON.parse(raw) : {};
    localDb[cleanIdentifier] = userProfile;
    localDb[cleanUsername.toLowerCase()] = userProfile;
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(localDb));
  } catch (e) {
    console.warn('Local user mirror warning:', e);
  }

  const sessionUser = {
    uid: userProfile.uid,
    username: userProfile.username,
    email: userProfile.email,
    role: userProfile.role,
    isGuest: false,
    createdAt: userProfile.createdAt,
  };
  persistUserSession(sessionUser);
  return sessionUser;
}

/**
 * Login user by checking Cloud Firestore collection `users/{userId}`
 * Supports built-in Admin account (`admin` / `admin123`) as well as registered Firestore users.
 */
export async function loginWithAccount(identifier, password) {
  const cleanId = (identifier || '').trim().toLowerCase();
  if (!cleanId || !password) {
    throw new Error('Username/Email dan Password wajib diisi.');
  }

  // Built-in Admin Account support (automatically synced to Firestore `users/user_admin`)
  if (
    (cleanId === 'admin' || cleanId === 'admin@jogja.id') &&
    password === 'admin123'
  ) {
    const adminProfile = {
      uid: 'user_admin',
      username: 'Admin Jogja',
      identifier: 'admin',
      email: 'admin@jogja.id',
      role: 'admin',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };
    if (db) {
      try {
        await setDoc(
          doc(db, 'users', 'user_admin'),
          { ...adminProfile, password: 'admin123' },
          { merge: true }
        );
      } catch (e) {
        console.warn('Admin Firestore sync warning:', e);
      }
    }
    persistUserSession(adminProfile);
    return adminProfile;
  }

  const candidateUid = `user_${cleanId.replace(/[^a-z0-9]/g, '_')}`;

  if (db) {
    try {
      // 1. Direct doc lookup by deterministic UID
      const directSnap = await getDoc(doc(db, 'users', candidateUid));
      let matchedData = directSnap.exists() ? directSnap.data() : null;

      // 2. If not found by UID, query by identifier or email or username
      if (!matchedData) {
        const qIdentifier = query(
          collection(db, 'users'),
          where('identifier', '==', cleanId)
        );
        const snapId = await getDocs(qIdentifier);
        if (!snapId.empty) {
          matchedData = snapId.docs[0].data();
        }
      }

      if (!matchedData && cleanId.includes('@')) {
        const qEmail = query(
          collection(db, 'users'),
          where('email', '==', cleanId)
        );
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          matchedData = snapEmail.docs[0].data();
        }
      }

      if (matchedData) {
        if (matchedData.password && matchedData.password !== password) {
          throw new Error('Password salah. Silakan periksa kembali kata sandi Anda.');
        }

        const sessionUser = {
          uid: matchedData.uid || candidateUid,
          username: matchedData.username || identifier,
          email: matchedData.email || `${cleanId}@lokabaca.id`,
          role: matchedData.role || (cleanId === 'admin' ? 'admin' : 'user'),
          isGuest: false,
          createdAt: matchedData.createdAt || new Date().toISOString(),
        };
        persistUserSession(sessionUser);
        return sessionUser;
      }

      // 3. If user doesn't exist yet in Firestore, create & store in Firestore `users/{uid}` so login works seamlessly
      const displayUsername = cleanId.includes('@')
        ? cleanId.split('@')[0]
        : identifier.trim();
      const formattedUsername =
        displayUsername.charAt(0).toUpperCase() + displayUsername.slice(1);

      const newFirestoreUser = {
        uid: candidateUid,
        username: formattedUsername,
        identifier: cleanId,
        email: cleanId.includes('@') ? cleanId : `${cleanId}@lokabaca.id`,
        password,
        role: cleanId === 'admin' ? 'admin' : 'user',
        isGuest: false,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', candidateUid), newFirestoreUser);

      const sessionUser = {
        uid: newFirestoreUser.uid,
        username: newFirestoreUser.username,
        email: newFirestoreUser.email,
        role: newFirestoreUser.role,
        isGuest: false,
        createdAt: newFirestoreUser.createdAt,
      };
      persistUserSession(sessionUser);
      return sessionUser;
    } catch (err) {
      if (err.message?.includes('Password salah')) {
        throw err;
      }
      console.warn('Firestore login query fallback:', err.message);
    }
  }

  // Fallback to localStorage if offline
  const displayUsername = cleanId.includes('@')
    ? cleanId.split('@')[0]
    : identifier.trim();
  const formattedName =
    displayUsername.charAt(0).toUpperCase() + displayUsername.slice(1);

  const fallbackUser = {
    uid: candidateUid,
    username: formattedName,
    email: cleanId.includes('@') ? cleanId : `${cleanId}@lokabaca.id`,
    role: cleanId === 'admin' ? 'admin' : 'user',
    isGuest: false,
    createdAt: new Date().toISOString(),
  };
  persistUserSession(fallbackUser);
  return fallbackUser;
}

/**
 * Guest Mode Login (Also recorded in Cloud Firestore `users/{guestId}`)
 */
export async function enterGuestMode() {
  let uid = 'guest_yogyakarta_demo';
  const guestProfile = {
    uid,
    username: 'Penjelajah Jogja',
    role: 'guest',
    isGuest: true,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    try {
      if (auth) {
        try {
          const cred = await signInAnonymously(auth);
          uid = cred.user.uid;
          guestProfile.uid = uid;
        } catch {
          // Use deterministic guest_yogyakarta_demo if anonymous auth is not enabled in console
        }
      }
      await setDoc(doc(db, 'users', uid), guestProfile, { merge: true });
    } catch (err) {
      console.warn('Firestore guest record fallback:', err.message);
    }
  }

  persistUserSession(guestProfile);
  return guestProfile;
}

export async function signOutSession() {
  if (auth) {
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
  }
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// ==================== 2. ADMIN CONFIG & GOOGLE MAPS API KEY (settings/app_config) ====================

export function getLocalGoogleMapsApiKey() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.googleMapsApiKey) return parsed.googleMapsApiKey;
    }
  } catch {
    // Ignore
  }
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
}

export async function fetchAdminConfig() {
  const localKey = getLocalGoogleMapsApiKey();

  if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'app_config'));
      if (snap.exists()) {
        const data = snap.data();
        const merged = {
          googleMapsApiKey: data.googleMapsApiKey || localKey || '',
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.warn('Firestore fetchAdminConfig warning:', err.message);
    }
  }

  return {
    googleMapsApiKey: localKey || '',
    updatedAt: null,
  };
}

export async function saveAdminConfig({ googleMapsApiKey }) {
  const cleanKey = (googleMapsApiKey || '').trim();
  const payload = {
    googleMapsApiKey: cleanKey,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(payload));
  } catch (e) {
    console.warn('Local config write warning:', e);
  }

  if (db) {
    try {
      await setDoc(doc(db, 'settings', 'app_config'), payload, { merge: true });
    } catch (err) {
      console.warn('Firestore saveAdminConfig warning:', err.message);
    }
  }

  return payload;
}

// ==================== 3. ADMIN LOCATIONS CRUD (places/{placeId} in Cloud Firestore) ====================

function sanitizePlacePhotos(data) {
  const rawPhotos = Array.isArray(data?.photos) ? data.photos : [];
  const hasOldTemplate = rawPhotos.some(
    (u) => typeof u === 'string' && u.includes('images.unsplash.com')
  );
  if (!hasOldTemplate && rawPhotos.length > 0) {
    return rawPhotos.slice(0, 5);
  }
  const matched = YOGYAKARTA_PLACES.find(
    (p) =>
      p.placeId === data?.placeId ||
      p.id === data?.id ||
      p.displayName?.toLowerCase() === data?.displayName?.toLowerCase()
  );
  if (matched && Array.isArray(matched.photos) && matched.photos.length > 0) {
    return matched.photos.slice(0, 5);
  }
  const catFallback = YOGYAKARTA_PLACES.find(
    (p) => p.category === (data?.category || 'museum')
  );
  return (catFallback?.photos || []).slice(0, 5);
}

/**
 * Fetch all locations inputted by Admin from Cloud Firestore `places` collection
 */
export async function fetchAdminPlaces() {
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'places'));
      const list = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && Array.isArray(data.coordinates) && data.coordinates.length === 2) {
          list.push({
            ...data,
            id: data.placeId || docSnap.id,
            placeId: data.placeId || docSnap.id,
            photos: sanitizePlacePhotos(data),
          });
        }
      });

      // Sort by createdAt descending or name
      list.sort((a, b) =>
        (b.createdAt || '').localeCompare(a.createdAt || '')
      );

      localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(list));
      return list;
    } catch (err) {
      console.warn('Firestore fetchAdminPlaces fallback:', err.message);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLACES);
    const parsed = raw ? JSON.parse(raw) : [];
    return parsed.map((item) => ({
      ...item,
      photos: sanitizePlacePhotos(item),
    }));
  } catch {
    return [];
  }
}

/**
 * Add or update a location inputted by Admin into Cloud Firestore `places/{placeId}`
 */
export async function saveAdminPlace(placeData) {
  const placeId =
    placeData.placeId ||
    placeData.id ||
    `place_${placeData.category || 'museum'}_${Date.now()}`;

  const cleanCoordinates = Array.isArray(placeData.coordinates)
    ? [Number(placeData.coordinates[0]), Number(placeData.coordinates[1])]
    : [110.3695, -7.7956];

  const record = {
    id: placeId,
    placeId,
    displayName: (placeData.displayName || placeData.name || 'Lokasi Literasi Jogja').trim(),
    name: (placeData.name || placeData.displayName || 'Lokasi Literasi Jogja').trim(),
    category: placeData.category || 'museum',
    rating: Number(placeData.rating) || 4.8,
    userRatingCount: Number(placeData.userRatingCount) || 320,
    address:
      placeData.address ||
      'Daerah Istimewa Yogyakarta',
    district: placeData.district || 'Yogyakarta',
    coordinates: cleanCoordinates, // [lng, lat]
    regularOpeningHours: placeData.regularOpeningHours || {
      openNow: true,
      todayHours: '08.00 – 21.00 WIB',
      weekdayDescriptions: ['Senin – Minggu: 08.00 – 21.00 WIB'],
    },
    facilities: Array.isArray(placeData.facilities)
      ? placeData.facilities
      : ['Area Baca Nyaman', 'Koleksi Literasi', 'Spot Edukasi'],
    photos: (placeData.photos || []).slice(0, 5),
    description:
      placeData.description ||
      `Destinasi ${placeData.category === 'cafe_book' ? 'Cafe Book' : placeData.category === 'perpustakaan' ? 'Perpustakaan' : 'Museum'} pilihan di Daerah Istimewa Yogyakarta.`,
    googleMapsUrl:
      placeData.googleMapsUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        (placeData.displayName || placeData.name) + ' Yogyakarta'
      )}`,
    searchSource: placeData.searchSource || 'Google Maps API',
    createdAt: placeData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (db) {
    try {
      await setDoc(doc(db, 'places', placeId), record);
    } catch (err) {
      console.warn('Firestore saveAdminPlace warning:', err.message);
    }
  }

  const current = await fetchAdminPlaces();
  const existsIdx = current.findIndex((p) => p.placeId === placeId);
  let updated;
  if (existsIdx >= 0) {
    updated = [...current];
    updated[existsIdx] = record;
  } else {
    updated = [record, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage places write warning:', e);
  }

  return updated;
}

/**
 * Delete a location from Cloud Firestore `places/{placeId}`
 */
export async function deleteAdminPlace(placeId) {
  if (db) {
    try {
      await deleteDoc(doc(db, 'places', placeId));
    } catch (err) {
      console.warn('Firestore deleteAdminPlace warning:', err.message);
    }
  }

  const current = await fetchAdminPlaces();
  const updated = current.filter((p) => p.placeId !== placeId && p.id !== placeId);
  try {
    localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage delete place warning:', e);
  }
  return updated;
}

/**
 * Clear all locations from Cloud Firestore `places`
 */
export async function clearAllAdminPlaces() {
  const current = await fetchAdminPlaces();
  if (db) {
    try {
      await Promise.all(
        current.map((p) => deleteDoc(doc(db, 'places', p.placeId || p.id)))
      );
    } catch (err) {
      console.warn('Firestore clearAllAdminPlaces warning:', err.message);
    }
  }
  localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify([]));
  return [];
}

/**
 * Bulk import multiple locations into Cloud Firestore `places`
 */
export async function bulkImportAdminPlaces(placesArray) {
  if (db) {
    try {
      await Promise.all(
        placesArray.map((item) => {
          const pid = item.placeId || item.id;
          return setDoc(doc(db, 'places', pid), {
            ...item,
            id: pid,
            placeId: pid,
            photos: (item.photos || []).slice(0, 5),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        })
      );
    } catch (err) {
      console.warn('Firestore bulkImportAdminPlaces warning:', err.message);
    }
  }

  const updated = await fetchAdminPlaces();
  return updated;
}

// ==================== 4. ARCHIVES CRUD (users/{userId}/archives/{placeId}) ====================

export async function fetchUserArchives(userId) {
  const storageKey = `${STORAGE_KEYS.ARCHIVES_PREFIX}${userId}`;

  if (db && userId) {
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'archives'));
      const items = [];
      snap.forEach((docSnap) => items.push(docSnap.data()));
      localStorage.setItem(storageKey, JSON.stringify(items));
      return items;
    } catch (err) {
      console.warn('Firestore fetchUserArchives fallback:', err.message);
    }
  }

  try {
    const localRaw = localStorage.getItem(storageKey);
    if (localRaw) {
      return JSON.parse(localRaw);
    }
  } catch (e) {
    console.warn('Local archives parse error:', e);
  }
  return [];
}

export async function upsertArchiveJournal(userId, journalPayload) {
  const record = {
    placeId: journalPayload.placeId,
    placeName: journalPayload.placeName,
    category: journalPayload.category,
    visitedDate:
      journalPayload.visitedDate || new Date().toISOString().split('T')[0],
    googleRating: Number(journalPayload.googleRating) || 4.8,
    journalNote: (journalPayload.journalNote || '').trim(),
    updatedAt: new Date().toISOString(),
  };

  if (db && userId) {
    try {
      await setDoc(doc(db, 'users', userId, 'archives', record.placeId), record);
    } catch (err) {
      console.warn('Firestore upsertArchiveJournal fallback:', err.message);
    }
  }

  const current = await fetchUserArchives(userId);
  const existingIndex = current.findIndex(
    (item) => item.placeId === record.placeId
  );
  let updated;
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = record;
  } else {
    updated = [record, ...current];
  }

  try {
    localStorage.setItem(
      `${STORAGE_KEYS.ARCHIVES_PREFIX}${userId}`,
      JSON.stringify(updated)
    );
  } catch (e) {
    console.warn('LocalStorage archive write error:', e);
  }

  return updated;
}

export async function removeArchiveJournal(userId, placeId) {
  if (db && userId) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'archives', placeId));
    } catch (err) {
      console.warn('Firestore removeArchiveJournal fallback:', err.message);
    }
  }

  const current = await fetchUserArchives(userId);
  const updated = current.filter((item) => item.placeId !== placeId);

  try {
    localStorage.setItem(
      `${STORAGE_KEYS.ARCHIVES_PREFIX}${userId}`,
      JSON.stringify(updated)
    );
  } catch (e) {
    console.warn('LocalStorage archive delete error:', e);
  }

  return updated;
}

// ==================== 5. SAVED PLACES CRUD (users/{userId}/saved/{placeId}) ====================

export async function fetchUserSavedPlaces(userId) {
  const storageKey = `${STORAGE_KEYS.SAVED_PREFIX}${userId}`;

  if (db && userId) {
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'saved'));
      const items = [];
      snap.forEach((docSnap) => items.push(docSnap.data()));
      localStorage.setItem(storageKey, JSON.stringify(items));
      return items;
    } catch (err) {
      console.warn('Firestore fetchUserSavedPlaces fallback:', err.message);
    }
  }

  try {
    const localRaw = localStorage.getItem(storageKey);
    if (localRaw) {
      return JSON.parse(localRaw);
    }
  } catch (e) {
    console.warn('Local saved places parse error:', e);
  }
  return [];
}

export async function toggleSavedPlace(userId, place) {
  const targetPlaceId = place.placeId || place.id;
  const current = await fetchUserSavedPlaces(userId);
  const exists = current.some((item) => item.placeId === targetPlaceId);

  let updated;
  if (exists) {
    updated = current.filter((item) => item.placeId !== targetPlaceId);
    if (db && userId) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'saved', targetPlaceId));
      } catch (err) {
        console.warn('Firestore delete saved fallback:', err.message);
      }
    }
  } else {
    const record = {
      placeId: targetPlaceId,
      placeName: place.displayName || place.name || place.placeName,
      category: place.category,
      savedAt: new Date().toISOString(),
    };
    updated = [record, ...current];
    if (db && userId) {
      try {
        await setDoc(doc(db, 'users', userId, 'saved', targetPlaceId), record);
      } catch (err) {
        console.warn('Firestore set saved fallback:', err.message);
      }
    }
  }

  try {
    localStorage.setItem(
      `${STORAGE_KEYS.SAVED_PREFIX}${userId}`,
      JSON.stringify(updated)
    );
  } catch (e) {
    console.warn('LocalStorage saved write error:', e);
  }

  return updated;
}
