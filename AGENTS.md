# AGENTS.MD — SYSTEM SPECIFICATION & UI/UX DESIGN STANDARD

Dokumen ini adalah acuan teknis utama (*Single Source of Truth*) bagi AI Agent dan pengembang untuk membangun aplikasi web pemetaan dan jurnal eksplorasi literasi/budaya (**Museum, Cafe Book, Perpustakaan**) dalam rangka **Lomba Programming ISCOMFEST 2026**.

Seluruh komponen wajib mematuhi standar ergonomi **UI/UX Modern** (Apple Human Interface Guidelines & Google Material 3) yang dipadukan dengan gaya visual **Simple, Cute, & Aesthetic**.

---

## 1. KONTEKS KOMPETISI & BOBOT PENILAIAN (ISCOMFEST 2026)

Agent wajib mengoptimalkan aplikasi berdasarkan indikator penjurian berikut:
1. **Ide & Manfaat Solusi ($25\%$):** Platform pemetaan interaktif dan jurnal literasi (*Museum, Cafe Book, Perpustakaan*) dengan fitur dokumentasi pengalaman (*Archive*), daftar rencana kunjungan (*Saved*), dan gamifikasi sertifikat eksplorasi.
2. **Fungsionalitas ($25\%$):** Aplikasi bebas *error* (*zero-crash*), autentikasi dan *Guest Mode* berjalan mulus, filter peta responsif, CRUD jurnal tersimpan dengan baik, dan unduh sertifikat berfungsi penuh.
3. **Tampilan & Pengalaman Pengguna / UI-UX ($25\%$):** Tata letak proporsional, ukuran elemen konsisten, ramah pengguna di perangkat *mobile* maupun *desktop*, kontras teks jelas, serta transisi halaman yang halus.
4. **Kualitas & Kerapian Kode ($15\%$):** Struktur folder modular, penamaan variabel semantik, *fallback mock data* otomatis bila kuota API habis, dan dokumentasi `README.md` yang jelas.
5. **Dokumentasi & Demo ($10\%$):** Kemudahan simulasi seluruh fitur oleh Dewan Juri dalam waktu singkat.

---

## 2. TECH STACK & ARSITEKTUR SISTEM

* **Core Framework:** Node.js + Vite + React.js
* **Styling Engine:** Tailwind CSS (dengan kustomisasi *theme token* sesuai standar ukuran di bawah)
* **Animation Library:** Framer Motion (transisi *slide-up* halaman login, *spring micro-interactions*, dan modal)
* **Map Visualization:** **OpenFreeMap** + **MapLibre GL JS** (rendering peta vektor gratis dengan *custom warm style*)
* **Location Data API:** **Google Maps Places API** (*Data Fetching Only*):
  * Hanya mengambil: Nama Tempat (`displayName`), Rating Bintang (`rating`), Jam Operasional (`regularOpeningHours`), dan **5 Foto Teratas** (`photos.slice(0, 5)`).
  * *Wajib:* Sediakan *Local Fallback / Mock Data* agar aplikasi tetap menampilkan 5 foto, jam buka, dan rating secara utuh apabila diuji tanpa koneksi API eksternal.
* **Backend & Database:** **Firebase Authentication & Cloud Firestore** (mendukung *Email/Google Auth* serta *Guest Mode* berbasis `localStorage` / *Anonymous Auth*).
* **Icons:** Lucide React (`stroke-width: 2px`, sudut membulat)
* **Certificate Export:** `html2canvas` + `jsPDF`

---

## 3. STANDAR UI/UX: WARNA, TIPOGRAFI, UKURAN & BENTUK

### A. Palet Warna & Standar Kontras (WCAG 2.1 Compliant)
Agar tampilan *cute* tetap nyaman dibaca dan tidak membuat mata lelah, gunakan aturan kontras berikut (**PENTING:** Jangan pernah gunakan teks putih di atas warna Pink, Cyan, atau Yellow; selalu gunakan teks `#5C4033` di atas warna aksen):

| Peran Warna | Nama Warna | Kode Hex | Aturan Penggunaan & Kontras |
| :--- | :--- | :--- | :--- |
| **Main Surface** | Warm Cream White | `#FFFDF9` | Latar kartu utama, modal, dan form input. |
| **Secondary Surface** | Soft Oatmeal | `#F5EFE6` | Latar belakang *chip*, *skeleton loader*, dan kartu sekunder. |
| **Main Text & Stroke** | Cozy Dark Brown | `#5C4033` | Teks utama, ikon, dan *outline border* (Rasio kontras $> 9.5:1$ terhadap `#FFFDF9`). |
| **Muted Text** | Warm Taupe | `#8C7365` | Teks sekunder, jam buka, *placeholder*, dan *subtitle*. |
| **Accent 1 (Pink)** | Pastel Sakura | `#FFB7C5` | Kategori **Cafe Book**, tombol *Save/Favorite*, aksen utama. |
| **Accent 2 (Cyan)** | Soft Mint Cyan | `#A0E7E5` | Kategori **Perpustakaan**, tombol navigasi eksternal, badge info. |
| **Accent 3 (Yellow)** | Sunny Butter | `#FFE699` | Kategori **Museum**, ikon bintang rating, tombol CTA utama & sertifikat. |
| **Semantic Status** | Sage Green / Coral | `#88D49E` / `#FF8A8A` | Indikator "Sedang Buka" (Hijau Pastel) & "Tutup" (Merah Muda Karang). |

### B. Sistem Grid & Spasi (8-Point Grid System)
Seluruh jarak (*margin*, *padding*, *gap*) wajib menggunakan kelipatan $4\text{ px}$ atau $8\text{ px}$:
* **Spasi Mikro (Antar ikon & teks):** $8\text{ px}$ (`gap-2`)
* **Spasi Elemen Dalam Kartu:** $12\text{ px}$ hingga $16\text{ px}$ (`gap-3` / `gap-4`)
* **Padding Internal Kartu/Modal:** $20\text{ px}$ pada Mobile (`p-5`), $24\text{ px}$ hingga $32\text{ px}$ pada Desktop (`p-6` / `p-8`)
* **Margin Aman Layar (Safe Area):** Minimal $16\text{ px}$ (`px-4`) dari tepi layar ponsel dan $24\text{ px}$ (`px-6`) pada desktop.

### C. Skala Tipografi Standar
* **Font Family:** `'Plus Jakarta Sans'`, `'Quicksand'`, atau `'Nunito'` (sans-serif membulat yang ramah dan jelas).
* **H1 — Sapaan Header & Judul Halaman:** Ukuran $20\text{ px}$ (Mobile) – $24\text{ px}$ (Desktop), `font-bold` ($700$), `line-height: 1.3`.
* **H2 — Nama Tempat (Modal/Card Title):** Ukuran $18\text{ px}$ – $20\text{ px}$, `font-bold` ($700$), `line-height: 1.35`.
* **H3 — Subjudul Seksi:** Ukuran $16\text{ px}$, `font-semibold` ($600$), `line-height: 1.4`.
* **Body — Deskripsi & Catatan Jurnal:** Ukuran $14\text{ px}$ – $15\text{ px}$, `font-normal` ($400$), `line-height: 1.6` (lebar baris optimal $45\text{--}65$ karakter).
* **Caption / Badge / Jam Buka:** Ukuran $12\text{ px}$, `font-medium` ($500$), `line-height: 1.4`.

### D. Standar Bentuk, Sudut (Border Radius), dan Elevasi
Untuk menjaga harmoni proporsi bentuk antara wadah luar dan elemen dalam, gunakan rumus konsistensi sudut:
$$R_{\text{inner}} = R_{\text{outer}} - \text{Padding}$$

1. **Modal & Kartu Utama ($R_{\text{outer}}$):** `border-radius: 24px` (`rounded-3xl`), dilengkapi `border: 2px solid #5C4033` dan bayangan taktil lembut `box-shadow: 0 6px 0 #5C4033` (atau `0 12px 32px rgba(92, 64, 51, 0.12)`).
2. **Kartu Dalam, Bingkai Carousel Foto & Area Input ($R_{\text{inner}}$):** `border-radius: 14px` hingga `16px` (`rounded-2xl`), `border: 1.5px solid #5C4033`.
3. **Tombol Aksi & Dropdown:**
   * Tinggi standar wajib **$44\text{ px}$ hingga $48\text{ px}$** (`h-11` atau `h-12`) agar memenuhi standar minimum *touch target* jari manusia ($44\times44\text{ px}$).
   * Bentuk: `border-radius: 14px` (`rounded-xl`) untuk tombol form, atau `border-radius: 9999px` (`rounded-full`) untuk *floating pill navigation*.
   * Efek Interaksi: Saat ditekan (*active*), tombol turun $2\text{ px}$ (`translate-y-0.5`) dengan pengurangan bayangan bawah agar terasa responsif.

---

## 4. SPESIFIKASI DETAIL PER HALAMAN (LAYOUT & DIMENSI)

### LAYER PERSISTEN: OpenFreeMap Background
* **Ukuran:** `100vw x 100vh` (`fixed inset-0 z-0`).
* **Perilaku:** Dirender satu kali sejak awal aplikasi dibuka. Saat pengguna berada di Halaman 1 (Login), peta diberi lapisan penutup semi-transparan (`bg-[#FFFDF9]/65 backdrop-blur-[6px]`).

---

### PAGE 1: Halaman Utama (Login, Daftar & Guest Mode)
**Tujuan:** Memberikan impresi pertama yang *cute*, bersih, dan tidak mengintimidasi pengguna.

* **Container Kartu Login:**
  * Posisi: Tepat di tengah layar (`flex items-center justify-center min-h-screen p-4 z-20`).
  * Ukuran Kartu: Lebar penuh hingga batas maksimal **$400\text{ px}$** (`w-full max-w-[400px]`), `padding: 32px` (`p-8`), bentuk `rounded-3xl`, latar `#FFFDF9`, `border-2 border-[#5C4033]`, bayangan `shadow-[0_8px_0_#5C4033]`.
* **Header Ikon/Ilustrasi (Top Login Page):**
  * Mengambil gambar dari `src/assets/`.
  * Ukuran Wadah Ikon: **$80\times80\text{ px}$** (`w-20 h-20`), terletak di bagian atas tengah kartu dengan bingkai lingkaran atau `rounded-2xl` berlatar `#FFE699` (Yellow).
* **Komponen Form:**
  * Tab Switcher (`Masuk` / `Daftar`): Tinggi $40\text{ px}$, bentuk `rounded-xl`, latar `#F5EFE6`.
  * Input Field (Username/Email & Password): Tinggi **$46\text{ px}$**, `px-4`, `rounded-xl`, `border-2 border-[#5C4033]/30` yang berubah menjadi `border-[#5C4033]` saat *focus*.
  * Tombol Utama (`Masuk Sekarang`): Lebar $100\%$, tinggi **$48\text{ px}$**, latar `#FFB7C5` (Pink), teks `#5C4033` `font-bold`.
  * Pemisah (`atau`): Garis horizontal tipis dengan teks $12\text{ px}$.
  * Tombol **Guest Mode (`Jelajahi sebagai Tamu`)**: Lebar $100\%$, tinggi **$46\text{ px}$**, latar `#A0E7E5` (Cyan) atau `#FFFDF9` dengan `border-2 border-[#5C4033]`, memungkinkan juri masuk dalam 1 klik tanpa registrasi.

---

### PAGE 2: Eksplorasi Peta Utama (After Login Success)
**Transisi Masuk:** Kartu Login bergerak naik ke atas layar (`y: "-110vh"`, durasi $0.6\text{ s}$, kurva `cubic-bezier(0.22, 1, 0.36, 1)`), sedangkan lapisan *blur* memudar (`opacity: 0`), menyingkapkan peta OpenFreeMap seutuhnya.

* **Top Floating Bar (Header Sapaan & Filter):**
  * Posisi: Mengambang di bagian atas tengah (`fixed top-4 left-1/2 -translate-x-1/2 z-10`).
  * Ukuran: Lebar `calc(100% - 32px)` hingga maksimal **$640\text{ px}$**, tinggi minimum **$60\text{ px}$**, `px-5 py-2.5`, bentuk `rounded-2xl` (Mobile) atau `rounded-full` (Desktop), latar `#FFFDF9/95 backdrop-blur-md`, `border-2 border-[#5C4033]`, `shadow-[0_4px_0_#5C4033]`.
  * Tata Letak Internal (`flex items-center justify-between gap-4`):
    * **Sisi Kiri:** Teks sapaan **"Mau Kemana Hari Ini, `<username>`?"** (`font-bold text-[#5C4033] text-base md:text-lg truncate`).
    * **Sisi Kanan (Select Dropdown Kategori):** Lebar minimum **$160\text{ px}$**, tinggi **$40\text{ px}$**, `rounded-xl`, latar `#F5EFE6`, `border-2 border-[#5C4033]`, berisi pilihan:
      1. `Semua Tempat`
      2. `Museum` (Indikator titik `#FFE699`)
      3. `Cafe Book` (Indikator titik `#FFB7C5`)
      4. `Perpustakaan` (Indikator titik `#A0E7E5`)

* **Pin Lokasi di Atas Peta (Custom Map Markers):**
  * Ukuran Pin: **$44\times44\text{ px}$** (memenuhi standar *touch target*), berbentuk lingkaran dengan ujung penunjuk di bawah (*teardrop/badge pin*), `border-2 border-[#5C4033]`, bayangan `0 3px 0 #5C4033`.
  * Warna Pin: Sesuai kategori (Museum = Yellow, Cafe Book = Pink, Perpustakaan = Cyan) dengan ikon kategori berukuran $20\times20\text{ px}$ di tengahnya.
  * Jika tempat sudah pernah dikunjungi (masuk *Archive*), tampilkan *badge* centang kecil ($16\times16\text{ px}$) di sudut kanan atas pin.

* **Bottom Navigation (Footer Tab):**
  * Posisi: Mengambang di bagian bawah tengah (`fixed bottom-5 left-1/2 -translate-x-1/2 z-10`).
  * Ukuran Bar: Lebar `calc(100% - 32px)` hingga maksimal **$380\text{ px}$**, tinggi **$64\text{ px}$** (`h-16`), `px-4`, bentuk *pill* (`rounded-full`), latar `#FFFDF9`, `border-2 border-[#5C4033]`, `shadow-[0_6px_0_#5C4033]`.
  * 3 Menu Utama (`grid grid-cols-3 items-center`):
    1. **Archive (Kiri):** Ikon buku jurnal + label `Archive` ($12\text{ px}$) + *badge* jumlah kunjungan.
    2. **Add Journal (Tengah - Prominent Button):** Tombol bulat menonjol berukuran **$52\times52\text{ px}$** (`-mt-5`), latar `#FFB7C5` (Pink), `border-2 border-[#5C4033]`, `shadow-[0_4px_0_#5C4033]`, ikon `+` atau pena.
    3. **Saved (Kanan):** Ikon *bookmark* + label `Saved` ($12\text{ px}$) + *badge* jumlah simpanan.

---

### PAGE 3: Detail Lokasi (After Choosing Pin Point on Maps)
**Tujuan:** Menyajikan informasi tempat secara terstruktur, seimbang antara visual kiri dan aksi kanan, tanpa menutupi konteks peta sepenuhnya.

* **Container Modal / Split Card:**
  * Posisi: Muncul di tengah layar (Desktop) atau *Bottom Sheet* setinggi $85\text{ vh}$ (Mobile) dengan latar belakang *dimmed* (`bg-[#5C4033]/25 backdrop-blur-[2px]`).
  * Ukuran (Desktop): Lebar maksimal **$820\text{ px}$** (`w-[92vw] max-w-[820px]`), tinggi otomatis (maksimal $85\text{ vh}$), `rounded-3xl`, latar `#FFFDF9`, `border-2 border-[#5C4033]`, `shadow-[0_10px_0_#5C4033]`, `p-6`.

* **Bagian Header Kartu (Top Navigation Bar):**
  * Tata Letak: `flex items-center justify-between border-b-2 border-[#5C4033]/15 pb-4 mb-5`.
  * **Navigasi Tempat (`<` Nama Tempat `>`):**
    * Tombol **Previous (`<`)** dan **Next (`>`)** mengapit judul tempat. Ukuran masing-masing tombol **$40\times40\text{ px}$**, bentuk `rounded-xl`, `border-2 border-[#5C4033]`, latar `#F5EFE6` (hover `#FFE699`).
    * Nama Tempat berada di tengah dengan kategori *pill badge* di atasnya.
  * **Tombol `Buka di Google Maps`:**
    * Tinggi **$40\text{ px}$**, `px-3.5`, bentuk `rounded-xl`, latar `#A0E7E5` (Cyan), `border-2 border-[#5C4033]`, teks $13\text{ px}$ `font-semibold` beserta ikon panah eksternal.

* **Bagian Konten Utama (2-Column Split Grid):**
  * Menggunakan `grid grid-cols-1 md:grid-cols-12 gap-6 items-start`.

  * **Sisi Kiri (`md:col-span-6` — Visual & Metadata Google Maps):**
    1. **Photo Carousel (Maksimal 5 Foto Teratas):**
       * Rasio Aspek: **$4:3$** (`aspect-[4/3]`, tinggi sekitar $240\text{ px}$ – $260\text{ px}$), bentuk `rounded-2xl`, `overflow-hidden`, `border-2 border-[#5C4033]`.
       * Kontrol Geser: Tombol panah kiri/kanan berukuran $36\times36\text{ px}$ (`bg-[#FFFDF9]/90 rounded-full`) di dalam bingkai foto, serta **5 indikator titik (*pagination dots*)** di bagian bawah tengah foto.
    2. **Baris Info Rating & Jam Buka:**
       * Terletak tepat di bawah foto (`flex flex-wrap items-center justify-between gap-2 mt-3 p-3 rounded-xl bg-[#F5EFE6] border border-[#5C4033]/20`).
       * **Google Stars:** Ikon bintang `#FFE699` bersudut tegas + angka rating tebal (contoh: **`4.8 ★ (320 ulasan)`**).
       * **Open Hours:** Badge status (`Buka` / `Tutup`) + jam operasional hari ini (contoh: **`09.00 – 21.00 WIB`**).

  * **Sisi Kanan (`md:col-span-6` — Deskripsi & Tombol Aksi):**
    * Tata Letak: `flex flex-col justify-between h-full space-y-4`.
    1. **Brief Description:**
       * Kotak teks nyaman dibaca (`text-sm md:text-[15px] text-[#5C4033] leading-relaxed`), dilengkapi tag fasilitas singkat (misal: *Wi-Fi, Koleksi Buku Klasik, Area Baca Tenang*).
    2. **Status Jurnal (Jika sudah pernah dikunjungi):**
       * Menampilkan cuplikan catatan jurnal pengguna dalam kotak kuning muda (`bg-[#FFE699]/30 p-3 rounded-xl border border-[#5C4033]/30`).
    3. **Grup Tombol Aksi (Bagian Bawah Sisi Kanan):**
       * **Tombol 1 — `Add Journal` (Masuk ke Archive):**
         * Lebar $100\%$, tinggi **$48\text{ px}$**, bentuk `rounded-xl`, latar `#FFB7C5` (Pink), `border-2 border-[#5C4033]`, `shadow-[0_4px_0_#5C4033]`, `font-bold`. Saat diklik membuka *sub-modal/form* input tanggal, rating bintang pribadi ($1\text{--}5$), dan cerita jurnal.
       * **Tombol 2 — `Save for Later` (Masuk ke Saved):**
         * Lebar $100\%$, tinggi **$46\text{ px}$**, bentuk `rounded-xl`, latar `#FFFDF9` (berubah menjadi `#FFE699` jika sudah disimpan), `border-2 border-[#5C4033]`, `shadow-[0_3px_0_#5C4033]`, `font-semibold`.

---

### PAGE 4: Archive & Sertifikat Pencapaian
**Tujuan:** Menampilkan koleksi jurnal perjalanan pengguna dalam tata letak galeri yang rapi sekaligus memotivasi pengguna menyelesaikan eksplorasi.

* **Container Halaman Archive:**
  * Berupa *Full Overlay Drawer / View* di atas peta (`min-h-screen bg-[#FAF6F0]/95 backdrop-blur-md z-20 pt-6 pb-32 px-4 md:px-8`).
  * Lebar Konten Maksimal: **$1080\text{ px}$** (`max-w-5xl mx-auto`).

* **Header Archive & Filter Tab:**
  * Tombol `Kembali ke Peta` ($40\text{ px}$ tinggi, `rounded-xl`) di kiri atas.
  * Judul Halaman: **"Arsip Perjalanan Literasiku"** + Filter kategori (`Semua`, `Museum`, `Cafe Book`, `Perpustakaan`) berbentuk *pill tabs* (`h-10 px-4 rounded-full`).

* **Grid Daftar Tempat (List of Places):**
  * Tata Letak: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6`.
  * **Ukuran & Bentuk Kartu Archive:**
    * Bentuk `rounded-2xl`, latar `#FFFDF9`, `border-2 border-[#5C4033]`, `shadow-[0_4px_0_#5C4033]`, `p-4`, tinggi kartu seragam (`flex flex-col justify-between`).
    * Thumbnail Foto: Tinggi **$150\text{ px}$** (`h-[150px] w-full object-cover rounded-xl border border-[#5C4033]/20`).
    * Isi Kartu: Badge kategori, Nama Tempat (`font-bold text-base`), Tanggal Kunjungan ($12\text{ px}$ `#8C7365`), Rating Pribadi pengguna (`★`), dan kutipan catatan jurnal (`line-clamp-3 text-sm`).

* **Bottom-Right Profile & Progress Widget:**
  * Posisi: Mengambang di sudut kanan bawah layar (`fixed bottom-6 right-6 z-30`).
  * Ukuran Widget: Lebar **$300\text{ px}$ hingga $330\text{ px}$**, bentuk `rounded-2xl`, latar `#FFFDF9`, `border-2 border-[#5C4033]`, `shadow-[0_6px_0_#5C4033]`, `p-4`.
  * Konten Widget:
    1. **Baris Profil & Angka Utama:** Avatar/ikon kecil + Nama Pengguna + Angka Progres mencolok, contoh: **`23 / 67`** (`text-xl font-extrabold text-[#5C4033]`).
    2. **Progress Bar Utama:** Tinggi **$12\text{ px}$** (`h-3 w-full rounded-full bg-[#F5EFE6] border border-[#5C4033] overflow-hidden`), dengan bar pengisi berwarna `#FFB7C5` / `#A0E7E5`.
    3. **Breakdown per Kategori (Expandable / Terlihat Jelas):**
       * Museum: `10 / 25` (Bar `#FFE699`)
       * Cafe Book: `8 / 22` (Bar `#FFB7C5`)
       * Perpustakaan: `5 / 20` (Bar `#A0E7E5`)
    4. **Tombol `Cetak Sertifikat` (Print Certificate):**
       * Muncul sebagai tombol aktif penuh (`h-11 w-full rounded-xl bg-[#FFE699] border-2 border-[#5C4033] font-bold shadow-[0_3px_0_#5C4033] mt-3`) ketika seluruh tempat pada kategori atau total keseluruhan telah selesai dikunjungi.
       * *Fitur Khusus Penjurian:* Sediakan *toggle* kecil **"Simulasi 100% Selesai (Demo Juri)"** di dalam widget profil agar Dewan Juri dapat langsung menguji dan mengunduh sertifikat PDF tanpa harus mengisi 67 lokasi secara manual.

---

## 5. SKEMA DATABASE (CLOUD FIRESTORE & LOCAL FALLBACK)

```json
// 1. Collection: users/{userId}
{
  "username": "Nadia",
  "isGuest": false,
  "createdAt": "2026-10-23T10:00:00Z"
}

// 2. Collection: users/{userId}/archives/{placeId}
{
  "placeId": "place_museum_sonobudoyo",
  "placeName": "Museum Sonobudoyo",
  "category": "museum",
  "visitedDate": "2026-10-23",
  "userRating": 5,
  "journalNote": "Pameran topeng dan wayangnya sangat terawat, pencahayaannya estetik!",
  "updatedAt": "2026-10-23T14:20:00Z"
}

// 3. Collection: users/{userId}/saved/{placeId}
{
  "placeId": "place_cafe_buku_kecil",
  "placeName": "Kedai Buku & Kopi Senja",
  "category": "cafe_book",
  "savedAt": "2026-10-23T09:15:00Z"
}
```

---

## 6. CHECKLIST KEPATUHAN UI/UX SEBELUM DIKUMPULKAN

Agent wajib memeriksa daftar berikut sebelum menyelesaikan kode:
- [ ] **Ukuran Sentuh Standar:** Semua tombol interaktif (`<`, `>`, `Add Journal`, `Save`, `Dropdown`, `Pin Peta`) memiliki tinggi/lebar minimal $40\text{--}48\text{ px}$.
- [ ] **Konsistensi Sudut:** Kartu luar menggunakan `rounded-3xl` ($24\text{ px}$) dan elemen di dalamnya menggunakan `rounded-2xl` ($16\text{ px}$) atau `rounded-xl` ($12\text{ px}$).
- [ ] **Keterbacaan Teks:** Seluruh teks di atas warna Pink (`#FFB7C5`), Cyan (`#A0E7E5`), dan Yellow (`#FFE699`) menggunakan warna cokelat tua (`#5C4033`), bukan putih.
- [ ] **Batas 5 Foto & Rasio Stabil:** Carousel foto di Page 3 selalu membatasi maksimal 5 foto dengan rasio tetap `aspect-[4/3]` sehingga modal tidak melompat-lompat (*zero layout shift*) saat berganti foto.
- [ ] **Transisi Peta Mulus:** Peta OpenFreeMap tidak dimuat ulang (*re-render*) saat berpindah dari Page 1 ke Page 2.