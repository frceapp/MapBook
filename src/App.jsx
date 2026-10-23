import React from 'react';
import { AppProvider } from './context/AppContext';
import PersistentMapLayer from './components/map/PersistentMapLayer';
import LoginPageOverlay from './components/auth/LoginPageOverlay';
import TopFloatingBar from './components/navigation/TopFloatingBar';
import BottomNavigation from './components/navigation/BottomNavigation';
import PlaceDetailModal from './components/place/PlaceDetailModal';
import SavedPlacesModal from './components/place/SavedPlacesModal';
import ArchiveView from './components/archive/ArchiveView';
import JournalFormModal from './components/archive/JournalFormModal';
import ProfileProgressWidget from './components/certificate/ProfileProgressWidget';
import CertificateModal from './components/certificate/CertificateModal';

function AppShell() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#FFFDF9] text-[#5C4033]">
      {/* LAYER PERSISTEN: OpenFreeMap Yogyakarta Background (100vw x 100vh, fixed inset-0 z-0) */}
      <PersistentMapLayer />

      {/* PAGE 1: Halaman Utama (Login, Daftar & Guest Mode) */}
      <LoginPageOverlay />

      {/* PAGE 2: Top Floating Bar & Bottom Navigation */}
      <TopFloatingBar />
      <BottomNavigation />

      {/* PAGE 3: Detail Lokasi (Modal Split Card / Bottom Sheet) */}
      <PlaceDetailModal />

      {/* PAGE 4: Archive & Sertifikat Pencapaian */}
      <ArchiveView />
      <ProfileProgressWidget />

      {/* Sub-Modals: Saved Places, Add/Edit Journal Form, & Certificate Export */}
      <SavedPlacesModal />
      <JournalFormModal />
      <CertificateModal />
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
