# LokaBaca Jogja — Peta & Jurnal Eksplorasi Literasi Yogyakarta (ISCOMFEST 2026)

Platform pemetaan interaktif dan jurnal eksplorasi literasi/budaya (**Museum, Cafe Book, dan Perpustakaan**) khusus wilayah **Daerah Istimewa Yogyakarta (Kota Yogyakarta, Sleman, dan Bantul)** untuk **Lomba Programming ISCOMFEST 2026**.

---

## Fitur Utama & Keunggulan Solusi

1. **Peta Interaktif Persisten Yogyakarta (`OpenFreeMap` + `MapLibre GL JS`)**:
   - Menampilkan **28 lokasi literasi & budaya ikonik di Daerah Istimewa Yogyakarta** (*10 Museum, 10 Cafe Book, 8 Perpustakaan*).
   - Layer peta dirender satu kali (`fixed inset-0 z-0`) dan tidak pernah dimuat ulang (*zero re-mount*) saat transisi *slide-up* dari halaman Login ke Peta Utama.
   - Pin lokasi berukuran `44x44px` dengan warna kategori (*Museum = `#FFE699`*, *Cafe Book = `#FFB7C5`*, *Perpustakaan = `#A0E7E5`*) serta badge centang (`✓`) otomatis jika sudah dikunjungi.

2. **Integrasi Google Maps Places API + *Zero-Crash Local Fallback***:
   - Mengambil `displayName`, `rating`, `regularOpeningHours`, dan **maksimal 5 foto teratas** (`photos.slice(0, 5)`).
   - Dilengkapi *Local Fallback Data* Yogyakarta secara utuh sehingga aplikasi tetap menampilkan 5 foto, jam buka, fasilitas, dan rating meskipun diuji tanpa kunci API eksternal.

3. **Jurnal Literasi Pribadi (*Archive*) & Rencana Kunjungan (*Saved*)**:
   - Dokumentasi tanggal kunjungan, rating bintang pribadi (`1–5`), dan catatan cerita pengalaman yang tersimpan ke **Cloud Firestore** (`users/{userId}/archives/{placeId}` & `users/{userId}/saved/{placeId}`) maupun `localStorage` pada *Guest Mode*.

4. **Gamifikasi Progres & Unduh Sertifikat PDF (`html2canvas` + `jsPDF`)**:
   - Widget profil dan progres kunjungan per kategori di sudut kanan bawah layar.
   - **Fitur Khusus Dewan Juri**: Tersedia toggle **"Simulasi 100% Selesai (Demo Juri)"** untuk langsung membuka kunci dan mengunduh sertifikat PDF/PNG dalam 1 klik.

---

## Panduan Cepat Simulasi untuk Dewan Juri (1 Menit)

1. Jalankan aplikasi (`npm install` lalu `npm run dev`).
2. Pada **Halaman 1 (Login)**, klik tombol **`Jelajahi sebagai Tamu`** untuk masuk dalam 1 klik tanpa registrasi.
3. Pada **Halaman 2 (Peta Yogyakarta)**, gunakan dropdown filter di kanan atas (`Semua Tempat`, `Museum`, `Cafe Book`, `Perpustakaan`) dan klik pin lokasi di peta.
4. Pada **Halaman 3 (Detail Lokasi)**, gunakan tombol `<` dan `>` untuk berpindah antar tempat di Yogyakarta, geser 5 foto pada carousel, klik **`Add Journal`** untuk mencatat jurnal, atau **`Save for Later`**.
5. Pada **Halaman 4 (Archive & Sertifikat)**, klik menu **`Archive`** di navigasi bawah atau aktifkan toggle **`Simulasi 100% Selesai (Demo Juri)`** pada widget kanan bawah, lalu klik **`Cetak Sertifikat`** -> **`Unduh Sertifikat PDF`**.
