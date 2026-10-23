import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useApp } from '../../context/AppContext';
import { YOGYAKARTA_CENTER } from '../../services/yogyakartaPlaces';

/**
 * LAYER PERSISTEN: OpenFreeMap Background (Yogyakarta Exclusive)
 * Size: 100vw x 100vh (fixed inset-0 z-0)
 * Rendered once at app launch and never re-mounted across Page 1 -> Page 2 -> Page 3 -> Page 4.
 */
export default function PersistentMapLayer() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const {
    filteredPlaces,
    selectedPlaceId,
    selectPlaceOnMap,
    isPlaceVisited,
    setMapInstance,
  } = useApp();

  // Initialize OpenFreeMap + MapLibre GL JS centered on Daerah Istimewa Yogyakarta
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: YOGYAKARTA_CENTER, // [110.3695, -7.7956] Yogyakarta
      zoom: 12.2,
      minZoom: 9.8,
      maxZoom: 18,
      // Bounding box around Daerah Istimewa Yogyakarta and surrounding slopes
      maxBounds: [
        [110.05, -8.15], // Southwest DIY
        [110.68, -7.52], // Northeast DIY (Mount Merapi)
      ],
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    map.on('load', () => {
      mapRef.current = map;
      setMapInstance(map);
    });

    mapRef.current = map;
    setMapInstance(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [setMapInstance]);

  // Render Custom Map Markers (44x44px teardrop/badge pin with 20x20px icon & 16x16px visited check badge)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const getMarkerTheme = (category) => {
      switch (category) {
        case 'museum':
          return {
            bg: '#FFE699', // Sunny Butter Yellow
            label: 'Museum',
            // 20x20px Landmark SVG in Cozy Dark Brown #5C4033
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C4033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`,
          };
        case 'cafe_book':
          return {
            bg: '#FFB7C5', // Pastel Sakura Pink
            label: 'Cafe Book',
            // 20x20px Coffee SVG in Cozy Dark Brown #5C4033
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C4033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>`,
          };
        case 'perpustakaan':
        default:
          return {
            bg: '#A0E7E5', // Soft Mint Cyan
            label: 'Perpustakaan',
            // 20x20px BookOpen SVG in Cozy Dark Brown #5C4033
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C4033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>`,
          };
      }
    };

    filteredPlaces.forEach((place) => {
      const isSelected =
        selectedPlaceId === place.placeId || selectedPlaceId === place.id;
      const visited = isPlaceVisited(place.placeId);
      const theme = getMarkerTheme(place.category);

      const wrapper = document.createElement('div');
      wrapper.className = 'group relative cursor-pointer select-none';
      wrapper.style.zIndex = isSelected ? '30' : '10';

      wrapper.innerHTML = `
        <div class="flex flex-col items-center transition-transform duration-200 ${
          isSelected ? 'scale-125 -translate-y-1' : 'hover:scale-110'
        }">
          <!-- Hover Tooltip -->
          <div class="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute -top-9 px-3 py-1 rounded-xl bg-[#FFFDF9] text-[#5C4033] text-xs font-bold border-2 border-[#5C4033] shadow-[0_3px_0_#5C4033] whitespace-nowrap z-50">
            ${place.name}
          </div>

          <!-- 44x44px Circular Badge Pinhead (Touch Target Standard) -->
          <button
            type="button"
            aria-label="${place.name}"
            class="relative w-11 h-11 rounded-full flex items-center justify-center border-2 border-[#5C4033] transition-all focus:outline-none"
            style="background-color: ${theme.bg}; box-shadow: 0 3px 0 #5C4033;"
          >
            ${theme.iconSvg}

            ${
              visited
                ? `
              <!-- 16x16px Visited Checkmark Badge at Top-Right Corner -->
              <span
                title="Sudah Dikunjungi (Tercatat di Archive)"
                class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#88D49E] border-[1.5px] border-[#5C4033] flex items-center justify-center shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5C4033" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </span>
            `
                : ''
            }
          </button>

          <!-- Teardrop Pointer Tip at Bottom -->
          <div
            class="w-3 h-3 -mt-1.5 rotate-45 border-r-2 border-b-2 border-[#5C4033]"
            style="background-color: ${theme.bg};"
          ></div>
        </div>
      `;

      wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        selectPlaceOnMap(place);
      });

      const marker = new maplibregl.Marker({
        element: wrapper,
        anchor: 'bottom',
      })
        .setLngLat(place.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [filteredPlaces, selectedPlaceId, isPlaceVisited, selectPlaceOnMap]);

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-0 warm-map-canvas overflow-hidden"
      aria-label="Peta Eksplorasi Literasi Yogyakarta"
    >
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
