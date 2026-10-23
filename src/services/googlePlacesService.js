/**
 * Google Maps Places API Service (Data Fetching Only)
 * Strictly follows AGENTS.md Section 2:
 * - Only fetches: displayName, rating, regularOpeningHours, and Top 5 Photos (photos.slice(0, 5))
 * - Mandatory Local Fallback / Mock Data for Yogyakarta locations when tested without API key or quota
 */

import { YOGYAKARTA_PLACES } from './yogyakartaPlaces';

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const CACHE_KEY_PREFIX = 'lokabaca_jogja_place_v2_';

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

  // If no external Google API key is configured, return complete local fallback immediately
  if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
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
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
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
        `https://places.googleapis.com/v1/${photoObj.name}/media?maxWidthPx=900&maxHeightPx=675&key=${GOOGLE_PLACES_API_KEY}`
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
