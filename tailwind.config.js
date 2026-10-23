/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          main: '#FFFDF9',      // Warm Cream White
          secondary: '#F5EFE6', // Soft Oatmeal
          drawer: '#FAF6F0',    // Warm Archive Drawer Surface
        },
        cozy: {
          text: '#5C4033',      // Cozy Dark Brown (Main Text & Stroke, > 9.5:1 contrast)
          muted: '#8C7365',     // Warm Taupe (Muted Text)
        },
        accent: {
          pink: '#FFB7C5',      // Pastel Sakura (Cafe Book, Save, Primary CTA)
          cyan: '#A0E7E5',      // Soft Mint Cyan (Perpustakaan, External Nav, Info Badge)
          yellow: '#FFE699',    // Sunny Butter (Museum, Star Rating, Certificate)
        },
        status: {
          open: '#88D49E',      // Sage Green (Sedang Buka)
          closed: '#FF8A8A',    // Coral (Tutup)
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Quicksand"', '"Nunito"', 'sans-serif'],
        display: ['"Quicksand"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'tactile-xs': '0 2px 0 #5C4033',
        'tactile-sm': '0 3px 0 #5C4033',
        'tactile': '0 4px 0 #5C4033',
        'tactile-md': '0 6px 0 #5C4033',
        'tactile-lg': '0 8px 0 #5C4033',
        'tactile-xl': '0 10px 0 #5C4033',
        'soft-elevated': '0 12px 32px rgba(92, 64, 51, 0.12)',
      },
    },
  },
  plugins: [],
};
