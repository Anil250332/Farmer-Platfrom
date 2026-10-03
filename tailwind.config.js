/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kisan: {
          bg: '#FAF8F5',
          card: '#FFFFFF',
          dark: '#1B4332',
          primary: '#2D6A4F',
          secondary: '#40916C',
          accent: '#D97706',
          border: '#E8E3D9',
          muted: '#6B7280',
          lightGreen: '#EBF5EE',
          badge: '#F3F4F6',
          error: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans Devanagari"', '"Inter"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
