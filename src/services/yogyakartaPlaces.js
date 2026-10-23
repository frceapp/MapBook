/**
 * Curated Yogyakarta Literacy & Cultural Exploration Dataset
 * Exclusively covering Daerah Istimewa Yogyakarta (Kota Yogyakarta, Sleman, Bantul)
 * Categories: Museum (#FFE699), Cafe Book (#FFB7C5), Perpustakaan (#A0E7E5)
 */

export const CATEGORIES = {
  ALL: 'all',
  MUSEUM: 'museum',
  CAFE_BOOK: 'cafe_book',
  PERPUSTAKAAN: 'perpustakaan',
};

export const CATEGORY_CONFIG = {
  museum: {
    id: 'museum',
    label: 'Museum',
    colorHex: '#FFE699',
    bgClass: 'bg-[#FFE699]',
    textClass: 'text-[#5C4033]',
    borderClass: 'border-[#5C4033]',
    description: 'Warisan sejarah, budaya Jawa & seni rupa Yogyakarta',
  },
  cafe_book: {
    id: 'cafe_book',
    label: 'Cafe Book',
    colorHex: '#FFB7C5',
    bgClass: 'bg-[#FFB7C5]',
    textClass: 'text-[#5C4033]',
    borderClass: 'border-[#5C4033]',
    description: 'Kedai kopi hangat dengan koleksi buku & ruang diskusi',
  },
  perpustakaan: {
    id: 'perpustakaan',
    label: 'Perpustakaan',
    colorHex: '#A0E7E5',
    bgClass: 'bg-[#A0E7E5]',
    textClass: 'text-[#5C4033]',
    borderClass: 'border-[#5C4033]',
    description: 'Balai pustaka, arsip langka & ruang baca hening di Jogja',
  },
};

export const YOGYAKARTA_CENTER = [110.3695, -7.7956]; // Tugu / Malioboro Axis, Yogyakarta

export const YOGYAKARTA_PLACES = [
  // ==================== 1. MUSEUM (10 LOKASI DI YOGYAKARTA) ====================
  {
    id: 'place_museum_sonobudoyo',
    placeId: 'place_museum_sonobudoyo',
    displayName: 'Museum Sonobudoyo Unit I',
    name: 'Museum Sonobudoyo Unit I',
    category: 'museum',
    rating: 4.8,
    userRatingCount: 6840,
    address: 'Jl. Pangurakan No.6, Ngupasan, Kec. Gondomanan, Kota Yogyakarta, DIY 55122',
    district: 'Titik Nol Kilometer, Kota Yogyakarta',
    coordinates: [110.3639, -7.8022],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 21.00 WIB',
      weekdayDescriptions: [
        'Senin: Tutup',
        'Selasa – Minggu: 08.00 – 21.00 WIB',
      ],
    },
    facilities: ['Koleksi Keris & Wayang', 'Bioskop Sejarah', 'Pertunjukan Wayang Kulit', 'Area Interaktif'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Museum_Sonobudoyo_Yogyakarta_Unit_1.jpg/960px-Museum_Sonobudoyo_Yogyakarta_Unit_1.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Pondok_Wayang_Museum_Sonobudoyo_Yogyakarta_Unit_1.jpg/960px-Pondok_Wayang_Museum_Sonobudoyo_Yogyakarta_Unit_1.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Javanese_tembang_and_dance_fusion_performance%2C_Sonobudoyo_Museum%2C_Yogyakarta%2C_2017-12-05_03.jpg/960px-Javanese_tembang_and_dance_fusion_performance%2C_Sonobudoyo_Museum%2C_Yogyakarta%2C_2017-12-05_03.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Javanese_tembang_and_dance_fusion_performance%2C_Sonobudoyo_Museum%2C_Yogyakarta%2C_2017-12-05_06.jpg/960px-Javanese_tembang_and_dance_fusion_performance%2C_Sonobudoyo_Museum%2C_Yogyakarta%2C_2017-12-05_06.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Javanese_tembang_and_dance_fusion_performance%2C_Sonobudoyo_Museum%2C_Yogyakarta%2C_2017-12-05_08.jpg/960px-Javanese_tembang_and_dance_fusion_performance%2C_Sonobudoyo_Museum%2C_Yogyakarta%2C_2017-12-05_08.jpg',
    ],
    description:
      'Museum kebudayaan Jawa terlengkap di jantung Titik Nol Kilometer Yogyakarta. Menyimpan ribuan koleksi topeng klasik, wayang kulit, senjata tradisional keris, naskah kuno, serta ruang pameran baru yang sangat estetik dan imersif.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Museum+Sonobudoyo+Yogyakarta',
  },
  {
    id: 'place_museum_ullen_sentalu',
    placeId: 'place_museum_ullen_sentalu',
    displayName: 'Museum Ullen Sentalu',
    name: 'Museum Ullen Sentalu',
    category: 'museum',
    rating: 4.9,
    userRatingCount: 15420,
    address: 'Jl. Boyong KM 25, Kaliurang, Hargobinangun, Kec. Pakem, Kabupaten Sleman, DIY 55582',
    district: 'Kaliurang, Sleman',
    coordinates: [110.4234, -7.5978],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.30 – 16.00 WIB',
      weekdayDescriptions: [
        'Senin: Tutup',
        'Selasa – Minggu: 08.30 – 16.00 WIB',
      ],
    },
    facilities: ['Tur Edukasi Berpemandu', 'Arsitektur Taman Asri', 'Koleksi Batik Vorstenlanden', 'Kafe Beukenhof'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Museum_Ullen_Sentalu_Yogyakarta.jpg/960px-Museum_Ullen_Sentalu_Yogyakarta.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Museum_Ullen_Sentalu_Spot_Foto.jpg/960px-Museum_Ullen_Sentalu_Spot_Foto.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Papan_penanda_di_area_Museum_Ullen_Sentalu%2C_Kaliurang.jpg/960px-Papan_penanda_di_area_Museum_Ullen_Sentalu%2C_Kaliurang.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Ullen_Sentalu_%281%29.jpg/960px-Ullen_Sentalu_%281%29.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Statue_at_Ullen_Sentalu.jpg/960px-Statue_at_Ullen_Sentalu.jpg',
    ],
    description:
      'Museum seni dan budaya bangsawan Dinasti Mataram (Kasunanan Surakarta, Kasultanan Yogyakarta, Praja Mangkunegaran, dan Kadipaten Pakualaman) yang berpadu harmonis dengan hutan pinus sejuk di lereng Gunung Merapi.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Museum+Ullen+Sentalu+Yogyakarta',
  },
  {
    id: 'place_museum_vredeburg',
    placeId: 'place_museum_vredeburg',
    displayName: 'Museum Benteng Vredeburg',
    name: 'Museum Benteng Vredeburg',
    category: 'museum',
    rating: 4.7,
    userRatingCount: 22150,
    address: 'Jl. Margo Mulyo No.6, Ngupasan, Kec. Gondomanan, Kota Yogyakarta, DIY 55122',
    district: 'Malioboro, Kota Yogyakarta',
    coordinates: [110.3662, -7.8003],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 20.00 WIB',
      weekdayDescriptions: [
        'Senin: Tutup',
        'Selasa – Kamis: 08.00 – 20.00 WIB',
        'Jumat – Minggu: 08.00 – 21.00 WIB',
      ],
    },
    facilities: ['Diorama Sejarah Kemerdekaan', 'Perpustakaan Sejarah', 'Taman Air Mancur Malam', 'Akses Ramah Difabel'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Fort_Vredeburg%2C_Yogyakarta%2C_Indonesia.JPG/960px-Fort_Vredeburg%2C_Yogyakarta%2C_Indonesia.JPG',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/KITLV_53180_-_Kassian_C%C3%A9phas_-_Street_behind_Fort_Vredeburg_in_Yogyakarta_-_Around_1890.tif/lossy-page1-960px-KITLV_53180_-_Kassian_C%C3%A9phas_-_Street_behind_Fort_Vredeburg_in_Yogyakarta_-_Around_1890.tif.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Fort_Vredeburg_Museum_%28inside%29%2C_Yogyakarta.jpg/960px-Fort_Vredeburg_Museum_%28inside%29%2C_Yogyakarta.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Kunjungan_Wiki_Mrebawani_II_ke_Museum_Benteng_Vredeburg_%2801%29.jpg/960px-Kunjungan_Wiki_Mrebawani_II_ke_Museum_Benteng_Vredeburg_%2801%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/bc/Museum_Benteng_Vredeburg_02.jpg',
    ],
    description:
      'Benteng kolonial bersejarah abad ke-18 di ujung selatan kawasan Malioboro yang kini menjadi museum perjuangan nasional dengan diorama interaktif, instalasi proyeksi digital, dan ruang literasi sejarah Indonesia.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Museum+Benteng+Vredeburg+Yogyakarta',
  },
  {
    id: 'place_museum_affandi',
    placeId: 'place_museum_affandi',
    displayName: 'Museum Affandi',
    name: 'Museum Affandi',
    category: 'museum',
    rating: 4.7,
    userRatingCount: 4180,
    address: 'Jl. Laksda Adisucipto No.167, Papringan, Caturtunggal, Kec. Depok, Kabupaten Sleman, DIY 55281',
    district: 'Caturtunggal, Sleman',
    coordinates: [110.3964, -7.7828],
    regularOpeningHours: {
      openNow: true,
      todayHours: '09.00 – 16.00 WIB',
      weekdayDescriptions: [
        'Senin – Minggu: 09.00 – 16.00 WIB',
      ],
    },
    facilities: ['4 Galeri Lukisan Maestro', 'Kelas Melukis', 'Kafe Loteng Daun Pisang', 'Arsip Seni Rupa'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Affandi_Museum_Sketch.jpg/960px-Affandi_Museum_Sketch.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/bd/Patung_Affandi_dan_Kartika_Karya_Affandi_Koleksi_Museum_Affandi_Yogyakarta.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Affandi_Museum_Exhibition_Room.jpg/960px-Affandi_Museum_Exhibition_Room.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/The_Western_Roof_of_Affandi_Musuem.jpg/960px-The_Western_Roof_of_Affandi_Musuem.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/a0/Plakat_Peresmian_Gedung_Museum_Affandi_Tahun_1988_Koleksi_Museum_Affandi_Yogyakarta.jpg',
    ],
    description:
      'Kediaman sekaligus galeri sang maestro lukis ekspresionis Indonesia, Affandi, di tepi Sungai Gajah Wong. Bangunan beratap pelepah daun pisang yang ikonik ini menyimpan ratusan lukisan asli dan artefak perjalanan hidup beliau.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Museum+Affandi+Yogyakarta',
  },
  {
    id: 'place_museum_keraton_jogja',
    placeId: 'place_museum_keraton_jogja',
    displayName: 'Museum Keraton Yogyakarta',
    name: 'Museum Keraton Yogyakarta',
    category: 'museum',
    rating: 4.8,
    userRatingCount: 19300,
    address: 'Jl. Rotowijayan Blok No. 1, Panembahan, Kec. Kraton, Kota Yogyakarta, DIY 55131',
    district: 'Kraton, Kota Yogyakarta',
    coordinates: [110.3642, -7.8053],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.30 – 14.30 WIB',
      weekdayDescriptions: [
        'Senin: Tutup',
        'Selasa – Minggu: 08.30 – 14.30 WIB',
      ],
    },
    facilities: ['Pentas Gamelan & Tari Klasik', 'Museum Lukisan & Kristal', 'Naskah Babad Keraton', 'Abdi Dalem Guide'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Yogyakarta_Indonesia_Kraton-the-Sultans-Palace-02.jpg/960px-Yogyakarta_Indonesia_Kraton-the-Sultans-Palace-02.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Kraton_Ngayogyakarta_Hadiningrat_%2849797461187%29.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat_%2849797461187%29.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0946_8882.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0946_8882.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0950_8884.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0950_8884.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0943_8872.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0943_8872.jpg',
    ],
    description:
      'Pusat kebudayaan hidup Kasultanan Ngayogyakarta Hadiningrat. Pengunjung dapat mengagumi arsitektur filosofis Jawa, koleksi manuskrip serat kuno, pusaka kerajaan, serta menikmati pementasan seni karawitan dan tari klasik setiap pagi.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Keraton+Yogyakarta',
  },
  {
    id: 'place_museum_merapi',
    placeId: 'place_museum_merapi',
    displayName: 'Museum Gunungapi Merapi (MGM)',
    name: 'Museum Gunungapi Merapi (MGM)',
    category: 'museum',
    rating: 4.6,
    userRatingCount: 5410,
    address: 'Jl. Kaliurang KM 22, Banteng, Hargobinangun, Kec. Pakem, Kabupaten Sleman, DIY 55582',
    district: 'Pakem, Sleman',
    coordinates: [110.4242, -7.6159],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 15.30 WIB',
      weekdayDescriptions: [
        'Senin: Tutup',
        'Selasa – Minggu: 08.00 – 15.30 WIB',
      ],
    },
    facilities: ['Teater Mini Erupsi', 'Alat Simulasi Gempa', 'Koleksi Batuan Vulkanik', 'Spot Foto Merapi'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Taman_Pintar_Yogyakarta.jpg/960px-Taman_Pintar_Yogyakarta.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Taman_pintar_-_panoramio.jpg/960px-Taman_pintar_-_panoramio.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Yogyakarta_planetarium.jpg/960px-Yogyakarta_planetarium.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Front_gate_of_Taman_Pintar.jpg/960px-Front_gate_of_Taman_Pintar.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Gondomanan_Temple.jpg/960px-Gondomanan_Temple.jpg',
    ],
    description:
      'Wahana edukasi geologi dan vulkanologi di kaki Gunung Merapi. Menyajikan informasi ilmiah mengenai aktivitas vulkanik, mitigasi bencana, artefak sisa erupsi 2010, dan filosofi kosmologi Gunung Merapi – Keraton – Laut Selatan.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Museum+Gunungapi+Merapi+Sleman',
  },
  {
    id: 'place_museum_sandi',
    placeId: 'place_museum_sandi',
    displayName: 'Museum Sandi Yogyakarta',
    name: 'Museum Sandi Yogyakarta',
    category: 'museum',
    rating: 4.7,
    userRatingCount: 1890,
    address: 'Jl. Faridan M Noto No.21, Kotabaru, Kec. Gondokusuman, Kota Yogyakarta, DIY 55224',
    district: 'Kotabaru, Kota Yogyakarta',
    coordinates: [110.3718, -7.7867],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.30 – 15.00 WIB',
      weekdayDescriptions: [
        'Senin – Minggu: 08.30 – 15.00 WIB',
      ],
    },
    facilities: ['Mesin Sandi Klasik', 'Game Pemecah Kriptografi', 'Bangunan Cagar Budaya', 'Gratis Tiket Masuk'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Monumen_Yogya_Kembali.JPG/960px-Monumen_Yogya_Kembali.JPG',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/76_mm_mountain_gun_M48_at_Monumen_Jogja_Kembali_1.jpg/960px-76_mm_mountain_gun_M48_at_Monumen_Jogja_Kembali_1.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Cart_used_by_Student_Army%2C_Monumen_Jogja_Kembali.jpg/960px-Cart_used_by_Student_Army%2C_Monumen_Jogja_Kembali.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Bambu_runcing%2C_Monumen_Jogja_Kembali.jpg/960px-Bambu_runcing%2C_Monumen_Jogja_Kembali.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Litter_used_by_Sudirman%2C_Monumen_Jogja_Kembali.jpg/960px-Litter_used_by_Sudirman%2C_Monumen_Jogja_Kembali.jpg',
    ],
    description:
      'Satu-satunya museum kriptografi dan persandian di Indonesia yang terletak di kawasan heritage Kotabaru. Mengajak pengunjung memecahkan kode rahasia perjuangan diplomasi kemerdekaan RI menggunakan mesin sandi bersejarah.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Museum+Sandi+Kotabaru+Yogyakarta',
  },
  {
    id: 'place_museum_monjali',
    placeId: 'place_museum_monjali',
    displayName: 'Museum Monumen Jogja Kembali (Monjali)',
    name: 'Museum Monumen Jogja Kembali',
    category: 'museum',
    rating: 4.6,
    userRatingCount: 9840,
    address: 'Jl. Ring Road Utara, Jongkang, Sariharjo, Kec. Ngaglik, Kabupaten Sleman, DIY 55581',
    district: 'Ngaglik, Sleman',
    coordinates: [110.3696, -7.7495],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 16.00 WIB',
      weekdayDescriptions: [
        'Senin: Tutup',
        'Selasa – Minggu: 08.00 – 16.00 WIB',
      ],
    },
    facilities: ['Ruang Hening Garbha Graha', '10 Diorama Lingkar', 'Perpustakaan Perjuangan', 'Taman Pelangi'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Museum_Gunungapi_Merapi.jpg/960px-Museum_Gunungapi_Merapi.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Museum_Gunungapi_Merapi_%282%29.jpg/960px-Museum_Gunungapi_Merapi_%282%29.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Museum_Gunungapi_Merapi_%281%29.jpg/960px-Museum_Gunungapi_Merapi_%281%29.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Morfologi_Puncak_Gunungapi_Merapi.jpg/960px-Morfologi_Puncak_Gunungapi_Merapi.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Museum_Gunungapi_Merapi.png/960px-Museum_Gunungapi_Merapi.png',
    ],
    description:
      'Museum berbentuk kerucut gunung yang berada tepat di sumbu imajiner Yogyakarta. Mengabadikan peristiwa ditariknya tentara pendudukan Belanda dari ibu kota RI di Yogyakarta pada 29 Juni 1949.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Monumen+Jogja+Kembali',
  },
  {
    id: 'place_museum_history_of_java',
    placeId: 'place_museum_history_of_java',
    displayName: 'History of Java Museum',
    name: 'History of Java Museum',
    category: 'museum',
    rating: 4.7,
    userRatingCount: 3120,
    address: 'Jl. Parangtritis KM 5.5, Tarudan, Bangunharjo, Kec. Sewon, Kabupaten Bantul, DIY 55188',
    district: 'Sewon, Bantul',
    coordinates: [110.3627, -7.8422],
    regularOpeningHours: {
      openNow: true,
      todayHours: '09.00 – 18.00 WIB',
      weekdayDescriptions: [
        'Senin – Minggu: 09.00 – 18.00 WIB',
      ],
    },
    facilities: ['Teknologi Augmented Reality', 'Teater 3D Purba', 'Diorama Kerajaan Jawa', 'Spot Foto Tematik'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/An_Indonesian_Air_Force_A-4-Skyhawk_TT-0440_at_Dirgantara_Mandala_Museum.jpg/960px-An_Indonesian_Air_Force_A-4-Skyhawk_TT-0440_at_Dirgantara_Mandala_Museum.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Bae_Hawk_Indonesian_Air_Force_at_Dirgantara_Mandala_Museum.jpg/960px-Bae_Hawk_Indonesian_Air_Force_at_Dirgantara_Mandala_Museum.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Dirgantara_Mandala_Museum_63.jpg/960px-Dirgantara_Mandala_Museum_63.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Dirgantara_Mandala_Museum_64.jpg/960px-Dirgantara_Mandala_Museum_64.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Dirgantara_Mandala_Museum_92.jpg/960px-Dirgantara_Mandala_Museum_92.jpg',
    ],
    description:
      'Museum sejarah tanah Jawa berbasis teknologi Augmented Reality (AR) dan visualisasi sinematik. Mengajak pengunjung menelusuri peradaban manusia purba, era Mataram Kuno, Majapahit, hingga penyebaran Wali Songo.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=History+of+Java+Museum+Yogyakarta',
  },
  {
    id: 'place_museum_dewantara',
    placeId: 'place_museum_dewantara',
    displayName: 'Museum Dewantara Kirti Griya',
    name: 'Museum Dewantara Kirti Griya',
    category: 'museum',
    rating: 4.8,
    userRatingCount: 1520,
    address: 'Jl. Tamansiswa No.25, Wirogunan, Kec. Mergangsan, Kota Yogyakarta, DIY 55151',
    district: 'Tamansiswa, Kota Yogyakarta',
    coordinates: [110.3772, -7.8075],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 15.00 WIB',
      weekdayDescriptions: [
        'Senin – Sabtu: 08.00 – 15.00 WIB',
        'Minggu: Tutup',
      ],
    },
    facilities: ['Naskah Asli Ki Hadjar Dewantara', 'Perpustakaan Tamansiswa', 'Pendopo Agung', 'Tur Literasi Pendidikan'],
    photos: [

    ],
    description:
      'Rumah kediaman Bapak Pendidikan Nasional, Ki Hadjar Dewantara, di kompleks Perguruan Tamansiswa Yogyakarta. Menyimpan meja kerja, mesin ketik, surat-surat perjuangan, dan lebih dari 3.000 koleksi buku pustaka beliau.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Museum+Dewantara+Kirti+Griya+Yogyakarta',
  },

  // ==================== 2. CAFE BOOK (10 LOKASI DI YOGYAKARTA) ====================
  {
    id: 'place_cafe_blanco_books',
    placeId: 'place_cafe_blanco_books',
    displayName: 'Blanco Coffee & Books',
    name: 'Blanco Coffee & Books',
    category: 'cafe_book',
    rating: 4.7,
    userRatingCount: 2890,
    address: 'Jl. Kranggan No.30, Cokrodiningratan, Kec. Jetis, Kota Yogyakarta, DIY 55233',
    district: 'Kranggan, Kota Yogyakarta',
    coordinates: [110.3631, -7.7827],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 23.00 WIB',
      weekdayDescriptions: [
        'Senin – Minggu: 08.00 – 23.00 WIB',
      ],
    },
    facilities: ['Rak Buku Sastra & Desain', 'Specialty Pour-Over Coffee', 'Wi-Fi Cepat', 'Area Baca Indoor AC'],
    photos: [

    ],
    description:
      'Book cafe legendaris dekat Tugu Jogja yang menggabungkan racikan kopi specialty kelas wahid dengan rak buku setinggi langit-langit. Koleksi bukunya mencakup novel dunia, esai filsafat, majalah desain, dan komik pilihan.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Blanco+Coffee+and+Books+Yogyakarta',
  },
  {
    id: 'place_cafe_buku_akik',
    placeId: 'place_cafe_buku_akik',
    displayName: 'Buku Akik & Ruang Baca',
    name: 'Buku Akik & Ruang Baca',
    category: 'cafe_book',
    rating: 4.9,
    userRatingCount: 1940,
    address: 'Jl. Kaliurang KM 12 Gg. Besi Raja No.60D, Candi Karang, Sardonoharjo, Kec. Ngaglik, Sleman, DIY 55581',
    district: 'Kaliurang, Sleman',
    coordinates: [110.3951, -7.7305],
    regularOpeningHours: {
      openNow: true,
      todayHours: '10.00 – 18.00 WIB',
      weekdayDescriptions: [
        'Senin – Minggu: 10.00 – 18.00 WIB',
      ],
    },
    facilities: ['Perpustakaan & Toko Buku Indie', 'Kucing Lucu Ramah', 'Pojok Teh & Kopi', 'Taman Baca Asri'],
    photos: [

    ],
    description:
      'Surga tersembunyi bagi pecinta literasi di Yogyakarta utara. Rumah hangat bernuansa vintage yang dipenuhi ribuan buku kurasi independen, piringan hitam, suguhan minuman hangat, dan kucing-kucing menggemaskan yang menemani membaca.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Buku+Akik+Yogyakarta',
  },
  {
    id: 'place_cafe_buku_kecil',
    placeId: 'place_cafe_buku_kecil',
    displayName: 'Kedai Buku & Kopi Senja Prawirotaman',
    name: 'Kedai Buku & Kopi Senja Prawirotaman',
    category: 'cafe_book',
    rating: 4.8,
    userRatingCount: 1120,
    address: 'Jl. Prawirotaman II No.612, Brontokusuman, Kec. Mergangsan, Kota Yogyakarta, DIY 55153',
    district: 'Prawirotaman, Kota Yogyakarta',
    coordinates: [110.3709, -7.8192],
    regularOpeningHours: {
      openNow: true,
      todayHours: '09.00 – 22.00 WIB',
      weekdayDescriptions: [
        'Senin – Minggu: 09.00 – 22.00 WIB',
      ],
    },
    facilities: ['Koleksi Sastra Nusantara', 'Kopi Susu Gula Aren', 'Stopkontak di Tiap Meja', 'Diskusi Buku Mingguan'],
    photos: [

    ],
    description:
      'Kedai buku dan kopi mungil yang super cozy di kampung turis Prawirotaman. Menghadirkan suasana tenang dengan alunan musik akustik pelan, aroma seduhan biji kopi nusantara, dan rak penuh novel sastra Indonesia.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Prawirotaman+Book+Cafe+Yogyakarta',
  },
  {
    id: 'place_cafe_kedai_kebun_forum',
    placeId: 'place_cafe_kedai_kebun_forum',
    displayName: 'Kedai Kebun Forum (KKF) & Reading Room',
    name: 'Kedai Kebun Forum (KKF)',
    category: 'cafe_book',
    rating: 4.8,
    userRatingCount: 1650,
    address: 'Jl. Tirtodipuran No.3, Mantrijeron, Kec. Mantrijeron, Kota Yogyakarta, DIY 55143',
    district: 'Mantrijeron, Kota Yogyakarta',
    coordinates: [110.3625, -7.8186],
    regularOpeningHours: {
      openNow: true,
      todayHours: '11.00 – 22.00 WIB',
      weekdayDescriptions: [
        'Selasa: Tutup',
        'Rabu – Senin: 11.00 – 22.00 WIB',
      ],
    },
    facilities: ['Galeri Seni & Ruang Baca', 'Menu Organik Lokal', 'Toko Zine & Buku Seni', 'Balkon Taman Rindang'],
    photos: [

    ],
    description:
      'Ruang alternatif seni, literasi, dan kuliner legendaris di selatan Yogyakarta. Menggabungkan restoran taman yang teduh, toko buku independen, zine seni rupa, serta ruang baca tempat seniman dan penulis Jogja berkumpul.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kedai+Kebun+Forum+Tirtodipuran+Yogyakarta',
  },
  {
    id: 'place_cafe_dongeng_kopi',
    placeId: 'place_cafe_dongeng_kopi',
    displayName: 'Dongeng Kopi & Pustaka Jogja',
    name: 'Dongeng Kopi & Pustaka Jogja',
    category: 'cafe_book',
    rating: 4.7,
    userRatingCount: 2310,
    address: 'Jl. Wahid Hasyim No.3, Gorongan, Condongcatur, Kec. Depok, Kabupaten Sleman, DIY 55283',
    district: 'Condongcatur, Sleman',
    coordinates: [110.4092, -7.7681],
    regularOpeningHours: {
      openNow: true,
      todayHours: '09.00 – 23.30 WIB',
      weekdayDescriptions: [
        'Senin – Minggu: 09.00 – 23.30 WIB',
      ],
    },
    facilities: ['Perpustakaan Mini Komunitas', 'Wi-Fi Kencang', 'Roastery Sendiri', 'Ruang Diskusi Literasi'],
    photos: [

    ],
    description:
      'Kedai kopi pelopor gerakan literasi kopi di Sleman dengan slogannya "Setiap Kopi Punya Cerita". Menyediakan ratusan koleksi buku bacaan sejarah, sosial, dan fiksi yang bebas dibaca sembari menikmati manual brew.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dongeng+Kopi+Yogyakarta',
  },
  {
    id: 'place_cafe_kebun_buku',
    placeId: 'place_cafe_kebun_buku',
    displayName: 'Kebun Buku (Secondhand & Rare Book Cafe)',
    name: 'Kebun Buku Jogja',
    category: 'cafe_book',
    rating: 4.8,
    userRatingCount: 780,
    address: 'Jl. Minggiran Baru No.61A, Suryodiningratan, Kec. Mantrijeron, Kota Yogyakarta, DIY 55141',
    district: 'Minggiran, Kota Yogyakarta',
    coordinates: [110.3558, -7.8195],
    regularOpeningHours: {
      openNow: true,
      todayHours: '12.00 – 20.00 WIB',
      weekdayDescriptions: [
        'Senin: Tutup',
        'Selasa – Minggu: 12.00 – 20.00 WIB',
      ],
    },
    facilities: ['Koleksi Buku Langka & Lawas', 'Artisanal Tea & Coffee', 'Halaman Rumput Teduh', 'Pameran Ilustrasi'],
    photos: [

    ],
    description:
      'Kafe dan toko buku independen berkonsep taman rumah Jawa yang hangat. Menyimpan koleksi buku-buku sastra klasik, terbitan lama yang langka, buku anak bergambar, serta teh bunga telang dan kue rumahan.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kebun+Buku+Minggiran+Yogyakarta',
  },
  {
    id: 'place_cafe_klinik_kopi',
    placeId: 'place_cafe_klinik_kopi',
    displayName: 'Klinik Kopi & Pojok Pustaka',
    name: 'Klinik Kopi & Pojok Pustaka',
    category: 'cafe_book',
    rating: 4.8,
    userRatingCount: 4820,
    address: 'Jl. Kaliurang KM 7.8 Gg. Bima, Sinduharjo, Kec. Ngaglik, Kabupaten Sleman, DIY 55581',
    district: 'Ngaglik, Sleman',
    coordinates: [110.3886, -7.7372],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 14.00 WIB',
      weekdayDescriptions: [
        'Senin – Sabtu: 08.00 – 14.00 WIB',
        'Minggu: Tutup',
      ],
    },
    facilities: ['Storytelling Biji Kopi Nusantara', 'Teras Bambu Asri', 'Koleksi Majalah & Buku Alam', 'Suasana Tenang Tanpa Gadget'],
    photos: [

    ],
    description:
      'Kedai kopi ikonik di Yogyakarta yang mengedepankan budaya bercerita (storytelling) dan membaca di teras bambu yang rimbun. Tempat terbaik menikmati pagi sambil tenggelam dalam halaman buku favorit dan kopi single origin.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Klinik+Kopi+Yogyakarta',
  },
  {
    id: 'place_cafe_kalluna_kotabaru',
    placeId: 'place_cafe_kalluna_kotabaru',
    displayName: 'Kalluna Reading Corner Kotabaru',
    name: 'Kalluna Reading Corner Kotabaru',
    category: 'cafe_book',
    rating: 4.7,
    userRatingCount: 3450,
    address: 'Jl. Sajiono No.13, Kotabaru, Kec. Gondokusuman, Kota Yogyakarta, DIY 55224',
    district: 'Kotabaru, Kota Yogyakarta',
    coordinates: [110.3738, -7.7859],
    regularOpeningHours: {
      openNow: true,
      todayHours: '09.00 – 22.30 WIB',
      weekdayDescriptions: [
        'Senin – Minggu: 09.00 – 22.30 WIB',
      ],
    },
    facilities: ['Interior Pastel Estetik', 'Sudut Baca Nyaman', 'Wi-Fi Cepat', 'Pastry & Artisan Tea'],
    photos: [

    ],
    description:
      'Kafe berdesain bohem-pastel yang cerah dan sangat nyaman untuk membaca buku maupun menulis jurnal perjalanan di kawasan rindang Kotabaru. Dilengkapi pencahayaan alami yang ramah mata.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kalluna+Kotabaru+Yogyakarta',
  },
  {
    id: 'place_cafe_loko_malioboro',
    placeId: 'place_cafe_loko_malioboro',
    displayName: 'Pojok Baca & Kopi Stasiun Tugu',
    name: 'Pojok Baca & Kopi Stasiun Tugu',
    category: 'cafe_book',
    rating: 4.6,
    userRatingCount: 4120,
    address: 'Jl. Pasar Kembang, Sosromenduran, Gedong Tengen, Kota Yogyakarta, DIY 55271',
    district: 'Malioboro, Kota Yogyakarta',
    coordinates: [110.3645, -7.7897],
    regularOpeningHours: {
      openNow: true,
      todayHours: '07.00 – 23.00 WIB',
      weekdayDescriptions: [
        'Senin – Minggu: 07.00 – 23.00 WIB',
      ],
    },
    facilities: ['Pemandangan Kereta Api & Malioboro', 'Rak Buku Perjalanan', 'Buka Sejak Pagi', 'Kuliner Tradisional'],
    photos: [

    ],
    description:
      'Tempat singgah favorit para pelancong literasi tepat di pintu masuk Malioboro dan Stasiun Tugu Yogyakarta. Menawarkan sensasi menyeruput kopi hangat sambil menulis jurnal perjalanan dan melihat lalu-lalang kereta api.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Loko+Coffee+Shop+Malioboro+Yogyakarta',
  },
  {
    id: 'place_cafe_sastra_kotagede',
    placeId: 'place_cafe_sastra_kotagede',
    displayName: 'Omah Pustaka & Teh Jawa Kotagede',
    name: 'Omah Pustaka & Teh Jawa Kotagede',
    category: 'cafe_book',
    rating: 4.8,
    userRatingCount: 940,
    address: 'Jl. Kemasan No.45, Prenggan, Kec. Kotagede, Kota Yogyakarta, DIY 55172',
    district: 'Kotagede, Kota Yogyakarta',
    coordinates: [110.3992, -7.8282],
    regularOpeningHours: {
      openNow: true,
      todayHours: '09.00 – 21.00 WIB',
      weekdayDescriptions: [
        'Senin – Minggu: 09.00 – 21.00 WIB',
      ],
    },
    facilities: ['Arsitektur Joglo Heritage', 'Buku Sejarah Mataram', 'Teh Nasgitel & Jajanan Pasar', 'Area Baca Pendopo'],
    photos: [

    ],
    description:
      'Tersembunyi di gang bersejarah ibu kota lama Mataram Islam di Kotagede, kafe buku berarsitektur rumah Kalang ini menyajikan teh poci gula batu dan ratusan literatur sejarah arsitektur serta kerajinan perak.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kotagede+Heritage+Yogyakarta',
  },

  // ==================== 3. PERPUSTAKAAN (8 LOKASI DI YOGYAKARTA) ====================
  {
    id: 'place_perpus_grhatama_pustaka',
    placeId: 'place_perpus_grhatama_pustaka',
    displayName: 'Grhatama Pustaka (Perpustakaan Daerah DIY)',
    name: 'Grhatama Pustaka DIY',
    category: 'perpustakaan',
    rating: 4.8,
    userRatingCount: 8750,
    address: 'Jl. Janti, Wonocatur, Banguntapan, Kec. Banguntapan, Kabupaten Bantul, DIY 55198',
    district: 'Banguntapan, Yogyakarta',
    coordinates: [110.4052, -7.7991],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 21.00 WIB',
      weekdayDescriptions: [
        'Senin – Jumat: 08.00 – 21.00 WIB',
        'Sabtu – Minggu: 08.00 – 16.00 WIB',
      ],
    },
    facilities: ['Ratusan Ribu Koleksi Buku', 'Bioskop 6D & Ruang Anak', 'Ruang Koleksi Langka Jogja', 'Wi-Fi & Co-Working Gratis'],
    photos: [

    ],
    description:
      'Perpustakaan termegah dan terbesar di Daerah Istimewa Yogyakarta. Memiliki desain bangunan ikonik dengan empat menara pensil, ruang baca berkapasitas ribuan pengunjung, koleksi braille, ruang dongeng anak, dan gazebo taman.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Grhatama+Pustaka+Yogyakarta',
  },
  {
    id: 'place_perpus_kota_jogja',
    placeId: 'place_perpus_kota_jogja',
    displayName: 'Perpustakaan Kota Yogyakarta (Puskot Kotabaru)',
    name: 'Perpustakaan Kota Yogyakarta',
    category: 'perpustakaan',
    rating: 4.7,
    userRatingCount: 3420,
    address: 'Jl. Suroto No.9, Kotabaru, Kec. Gondokusuman, Kota Yogyakarta, DIY 55224',
    district: 'Kotabaru, Kota Yogyakarta',
    coordinates: [110.3748, -7.7862],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 21.00 WIB',
      weekdayDescriptions: [
        'Senin – Jumat: 08.00 – 21.00 WIB',
        'Sabtu – Minggu: 08.00 – 16.00 WIB',
      ],
    },
    facilities: ['Gazebo Baca di Bawah Pohon', 'Ruang Diskusi Komunitas', 'E-Library & Komputer Gratis', 'Buka Hingga Malam'],
    photos: [

    ],
    description:
      'Berada di boulevard hijau Jalan Suroto Kotabaru, Perpustakaan Kota Yogyakarta memadukan gedung cagar budaya Indische dengan area baca semi-outdoor yang sangat teduh bagi pelajar, mahasiswa, dan warga Jogja.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Perpustakaan+Kota+Yogyakarta+Kotabaru',
  },
  {
    id: 'place_perpus_pusat_ugm',
    placeId: 'place_perpus_pusat_ugm',
    displayName: 'Perpustakaan dan Arsip Universitas Gadjah Mada',
    name: 'Perpustakaan Pusat UGM',
    category: 'perpustakaan',
    rating: 4.8,
    userRatingCount: 4190,
    address: 'Bulaksumur No.16, Caturtunggal, Kec. Depok, Kabupaten Sleman, DIY 55281',
    district: 'Bulaksumur, Sleman',
    coordinates: [110.3779, -7.7694],
    regularOpeningHours: {
      openNow: true,
      todayHours: '07.30 – 21.00 WIB',
      weekdayDescriptions: [
        'Senin – Jumat: 07.30 – 21.00 WIB',
        'Sabtu: 08.00 – 16.00 WIB',
        'Minggu: Tutup',
      ],
    },
    facilities: ['Koleksi Riset & Jurnal Dunia', 'Windows of the World Corner', 'Ruang Baca Hening Modern', 'Arsitektur Kampus Hijau'],
    photos: [

    ],
    description:
      'Jantung literasi akademik di kampus kerakyatan Universitas Gadjah Mada. Menyediakan ratusan ribu literatur ilmiah, koleksi naskah Nusantara, pojok kebudayaan internasional, dan ruang kolaborasi berfasilitas modern.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Perpustakaan+Pusat+UGM+Yogyakarta',
  },
  {
    id: 'place_perpus_kolsani',
    placeId: 'place_perpus_kolsani',
    displayName: 'Perpustakaan Ignatius (Kolsani) Kotabaru',
    name: 'Perpustakaan Ignatius (Kolsani)',
    category: 'perpustakaan',
    rating: 4.9,
    userRatingCount: 1680,
    address: 'Jl. Abu Bakar Ali No.1, Kotabaru, Kec. Gondokusuman, Kota Yogyakarta, DIY 55224',
    district: 'Kotabaru, Kota Yogyakarta',
    coordinates: [110.3712, -7.7885],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 16.00 WIB',
      weekdayDescriptions: [
        'Senin – Jumat: 08.00 – 16.00 WIB',
        'Sabtu: 08.00 – 13.00 WIB',
        'Minggu: Tutup',
      ],
    },
    facilities: ['Lebih dari 250.000 Buku Humaniora', 'Koleksi Filsafat & Sejarah Jawa', 'Suasana Sangat Hening', 'Taman Tengah Rindang'],
    photos: [

    ],
    description:
      'Salah satu perpustakaan filsafat, sejarah, sastra, dan budaya Jawa terbaik di Asia Tenggara yang berdiri sejak tahun 1923. Terkenal dengan ketenangannya yang syahdu serta kelengkapan literatur langka yang terjaga rapi.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Perpustakaan+Ignatius+Kotabaru+Yogyakarta',
  },
  {
    id: 'place_perpus_jogja_library_center',
    placeId: 'place_perpus_jogja_library_center',
    displayName: 'Jogja Library Center (Malioboro)',
    name: 'Jogja Library Center Malioboro',
    category: 'perpustakaan',
    rating: 4.7,
    userRatingCount: 1450,
    address: 'Jl. Malioboro No.175, Sosromenduran, Gedong Tengen, Kota Yogyakarta, DIY 55271',
    district: 'Malioboro, Kota Yogyakarta',
    coordinates: [110.3658, -7.7925],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 15.30 WIB',
      weekdayDescriptions: [
        'Senin – Jumat: 08.00 – 15.30 WIB',
        'Sabtu – Minggu: Tutup',
      ],
    },
    facilities: ['Arsip Koran & Majalah Tempo Dulu', 'Gedung Heritage 1940-an', 'Koleksi Sejarah Jogja', 'Lokasi Tepat di Malioboro'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Yogyakarta_Indonesia_Kraton-the-Sultans-Palace-02.jpg/960px-Yogyakarta_Indonesia_Kraton-the-Sultans-Palace-02.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Kraton_Ngayogyakarta_Hadiningrat_%2849797461187%29.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat_%2849797461187%29.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0946_8882.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0946_8882.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0950_8884.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0950_8884.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0943_8872.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0943_8872.jpg',
    ],
    description:
      'Oasis ketenangan tepat di tengah hiruk-pikuk pedestrian Jalan Malioboro. Menempati gedung cagar budaya bersejarah, perpustakaan ini menyimpan koleksi surat kabar masa kolonial, majalah lawas, dan ensiklopedia budaya Yogyakarta.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jogja+Library+Center+Malioboro',
  },
  {
    id: 'place_perpus_uin_suka',
    placeId: 'place_perpus_uin_suka',
    displayName: 'Perpustakaan UIN Sunan Kalijaga Yogyakarta',
    name: 'Perpustakaan UIN Sunan Kalijaga',
    category: 'perpustakaan',
    rating: 4.8,
    userRatingCount: 2560,
    address: 'Jl. Marsda Adisucipto, Papringan, Caturtunggal, Kec. Depok, Kabupaten Sleman, DIY 55281',
    district: 'Depok, Sleman',
    coordinates: [110.3945, -7.7842],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 16.00 WIB',
      weekdayDescriptions: [
        'Senin – Jumat: 08.00 – 16.00 WIB',
        'Sabtu – Minggu: Tutup',
      ],
    },
    facilities: ['4 Lantai Ruang Baca', 'Layanan Mandiri RFID', 'Corner Literasi Inklusif', 'Kafe Pustaka Lantai Dasar'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Yogyakarta_Indonesia_Kraton-the-Sultans-Palace-02.jpg/960px-Yogyakarta_Indonesia_Kraton-the-Sultans-Palace-02.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Kraton_Ngayogyakarta_Hadiningrat_%2849797461187%29.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat_%2849797461187%29.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0946_8882.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0946_8882.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0950_8884.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0950_8884.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0943_8872.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0943_8872.jpg',
    ],
    description:
      'Perpustakaan perguruan tinggi berstandar internasional yang terkenal sangat ramah difabel dan memiliki sistem sirkulasi otomasi mandiri serta ribuan literatur keislaman, sains, dan kebudayaan Nusantara.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Perpustakaan+UIN+Sunan+Kalijaga+Yogyakarta',
  },
  {
    id: 'place_perpus_sleman',
    placeId: 'place_perpus_sleman',
    displayName: 'Dinas Perpustakaan & Kearsipan Kabupaten Sleman',
    name: 'Perpustakaan Daerah Sleman',
    category: 'perpustakaan',
    rating: 4.7,
    userRatingCount: 1120,
    address: 'Jl. KRT Pringgodiningrat No.13, Beran, Tridadi, Kec. Sleman, Kabupaten Sleman, DIY 55511',
    district: 'Tridadi, Sleman',
    coordinates: [110.3547, -7.7126],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 15.30 WIB',
      weekdayDescriptions: [
        'Senin – Jumat: 08.00 – 15.30 WIB',
        'Sabtu – Minggu: 08.30 – 13.00 WIB',
      ],
    },
    facilities: ['Ruang Baca Keluarga & Anak', 'Koleksi Sejarah Desa Sleman', 'Wi-Fi Publik Gratis', 'Taman Baca Terbuka'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Yogyakarta_Indonesia_Kraton-the-Sultans-Palace-02.jpg/960px-Yogyakarta_Indonesia_Kraton-the-Sultans-Palace-02.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Kraton_Ngayogyakarta_Hadiningrat_%2849797461187%29.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat_%2849797461187%29.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0946_8882.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0946_8882.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0950_8884.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0950_8884.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0943_8872.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0943_8872.jpg',
    ],
    description:
      'Pusat literasi masyarakat Kabupaten Sleman yang asri dan nyaman. Dilengkapi ruang baca anak yang penuh warna, koleksi buku pertanian lereng Merapi, hingga literatur populer dan fiksi terkini.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dinas+Perpustakaan+dan+Kearsipan+Sleman',
  },
  {
    id: 'place_perpus_bantul',
    placeId: 'place_perpus_bantul',
    displayName: 'Perpustakaan Umum Daerah Kabupaten Bantul',
    name: 'Perpustakaan Daerah Bantul',
    category: 'perpustakaan',
    rating: 4.8,
    userRatingCount: 1380,
    address: 'Jl. Jenderal Sudirman No.1, Bantul, Kec. Bantul, Kabupaten Bantul, DIY 55711',
    district: 'Pusat Kota Bantul',
    coordinates: [110.3341, -7.8878],
    regularOpeningHours: {
      openNow: true,
      todayHours: '08.00 – 20.00 WIB',
      weekdayDescriptions: [
        'Senin – Jumat: 08.00 – 20.00 WIB',
        'Sabtu – Minggu: 08.00 – 15.00 WIB',
      ],
    },
    facilities: ['Gedung Baru 4 Lantai Estetik', 'Amphitheater Literasi', 'Ruang Podcast & Kreatif', 'Akses Difabel Lengkap'],
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Yogyakarta_Indonesia_Kraton-the-Sultans-Palace-02.jpg/960px-Yogyakarta_Indonesia_Kraton-the-Sultans-Palace-02.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Kraton_Ngayogyakarta_Hadiningrat_%2849797461187%29.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat_%2849797461187%29.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0946_8882.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0946_8882.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0950_8884.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0950_8884.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0943_8872.jpg/960px-Kraton_Ngayogyakarta_Hadiningrat%2C_Yogyakarta%2C_Indonesia%2C_20220818_0943_8872.jpg',
    ],
    description:
      'Gedung perpustakaan daerah baru yang sangat modern dan estetik di jantung Kabupaten Bantul. Menyediakan ruang baca berdesain hangat, amphitheater komunitas, serta koleksi literasi seni kriya dan budaya pesisir selatan Jogja.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dinas+Perpustakaan+dan+Kearsipan+Kabupaten+Bantul',
  },
];
