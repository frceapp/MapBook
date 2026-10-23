import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          maplibre: ['maplibre-gl'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          pdf: ['html2canvas', 'jspdf'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
