/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind where to look for class names
  // It will scan all .jsx and .js files inside src/
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Custom color palette for the club
      colors: {
        // Rose gold — main accent color
        "rose-gold": {
          light: "#e8b4a0",
          DEFAULT: "#c9956a",
          dark: "#a0705a",
        },
        // Muted amber — secondary accent
        amber: {
          muted: "#c8a86b",
        },
        // Dark background tones
        surface: {
          900: "#0d0d0d",  // deepest background
          800: "#141414",  // main page bg
          700: "#1c1c1c",  // card bg
          600: "#242424",  // elevated card bg
          500: "#2e2e2e",  // borders / dividers
        },
      },
      // Custom fonts — we'll load these from Google Fonts in index.html
      fontFamily: {
        display: ['"Playfair Display"', "serif"],   // for headings
        body: ['"Inter"', "sans-serif"],             // for body text
      },
    },
  },
  plugins: [],
}
