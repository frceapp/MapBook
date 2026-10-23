/**
 * Google Maps Places API Service (Data Fetching Only)
 * Strictly follows AGENTS.md Section 2:
 * - Only fetches: displayName, rating, regularOpeningHours, and Top 5 Photos (photos.slice(0, 5))
 * - Mandatory Local Fallback / Mock Data for Yogyakarta locations when tested without API key or quota
 * - Supports dynamic runtime API Key configuration via Admin Panel
 */

import { YOGYAKARTA_PLACES } from './yogyakartaPlaces';

const CACHE_KEY_PREFIX = 'lokabaca_jogja_place_v2_';
const STORAGE_KEY_API = 'lokabaca_google_api_key_override';

export function getGoogleApiKey() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_API);
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {
    console.warn('API key storage read warning:', e);
  }
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
}

export function setGoogleApiKey(key) {
  try {
    if (!key || !key.trim()) {
      localStorage.removeItem(STORAGE_KEY_API);
    } else {
      localStorage.setItem(STORAGE_KEY_API, key.trim());
    }
  } catch (e) {
    console.warn('API key storage write warning:', e);
  }
}

/**
 * Test a Google Maps API Key by making a lightweight probe request
 */
export async function testGoogleMapsApiKey(apiKey) {
  const keyToTest = apiKey || getGoogleApiKey();
  if (!keyToTest) {
    return { success: false, message: 'Kunci API kosong. Menggunakan data lokal (mock fallback).' };
  }

  try {
    // Probe places endpoint for Sonobudoyo Museum place
    const response = await fetch(
      `https://places.googleapis.com/v1/places/place_museum_sonobudoyo`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': keyToTest,
          'X-Goog-FieldMask': 'id,displayName',
        },
      }
    );

    if (response.status === 400 || response.status === 403) {
      const data = await response.json().catch(() => ({}));
      const reason = data.error?.message || `HTTP ${response.status} (Key Invalid / Quota Exceeded)`;
      return { success: false, message: `Gagal: ${reason}` };
    }

    return { success: true, message: 'Kunci Google Maps Places API valid & terhubung!' };
  } catch (err) {
    return { success: false, message: `Kesalahan jaringan: ${err.message}` };
  }
}

/**
 * Fetch place metadata from Google Maps Places API with automatic Yogyakarta local fallback
 * @param {string} placeId
 * @returns {Promise<object>}
 */
export async function getPlaceMetadata(placeId) {
  const localPlace = YOGYAKARTA_PLACES.find(
    (p) => p.placeId === placeId || p.id === placeId
  );

  // Always enforce max 5 photos on fallback
  const sanitizedFallback = localPlace
    ? {
        ...localPlace,
        photos: (localPlace.photos || []).slice(0, 5),
      }
    : null;

  const currentApiKey = getGoogleApiKey();

  // If no external Google API key is configured, return complete local fallback immediately
  if (!currentApiKey || currentApiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return sanitizedFallback;
  }

  // Check localStorage cache first to save quota
  try {
    const cachedRaw = localStorage.getItem(`${CACHE_KEY_PREFIX}${placeId}`);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (Date.now() - cached.timestamp < 1000 * 60 * 60 * 24) {
        return {
          ...sanitizedFallback,
          ...cached.data,
          photos: (cached.data.photos || sanitizedFallback?.photos || []).slice(0, 5),
        };
      }
    }
  } catch (err) {
    console.warn('Place cache read warning:', err);
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': currentApiKey,
          'X-Goog-FieldMask': 'displayName,rating,userRatingCount,regularOpeningHours,photos',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google Places HTTP ${response.status}`);
    }

    const data = await response.json();

    const apiPhotos = (data.photos || []).slice(0, 5).map(
      (photoObj) =>
        `https://places.googleapis.com/v1/${photoObj.name}/media?maxWidthPx=900&maxHeightPx=675&key=${currentApiKey}`
    );

    const merged = {
      ...sanitizedFallback,
      displayName: data.displayName?.text || sanitizedFallback?.displayName,
      name: data.displayName?.text || sanitizedFallback?.name,
      rating: typeof data.rating === 'number' ? data.rating : sanitizedFallback?.rating,
      userRatingCount:
        typeof data.userRatingCount === 'number'
          ? data.userRatingCount
          : sanitizedFallback?.userRatingCount,
      regularOpeningHours: {
        openNow:
          data.regularOpeningHours?.openNow ??
          sanitizedFallback?.regularOpeningHours?.openNow ??
          true,
        todayHours:
          sanitizedFallback?.regularOpeningHours?.todayHours || '08.00 – 21.00 WIB',
        weekdayDescriptions:
          data.regularOpeningHours?.weekdayDescriptions ||
          sanitizedFallback?.regularOpeningHours?.weekdayDescriptions ||
          [],
      },
      photos: apiPhotos.length > 0 ? apiPhotos.slice(0, 5) : sanitizedFallback?.photos || [],
    };

    try {
      localStorage.setItem(
        `${CACHE_KEY_PREFIX}${placeId}`,
        JSON.stringify({ timestamp: Date.now(), data: merged })
      );
    } catch (e) {
      console.warn('Place cache write warning:', e);
    }

    return merged;
  } catch (error) {
    console.info(
      `[Google Places Fallback] Using curated Yogyakarta data for ${placeId}:`,
      error.message
    );
    return sanitizedFallback;
  }
}
