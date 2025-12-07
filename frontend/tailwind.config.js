// File: documind-enterprise/frontend/tailwind.config.js 
// Purpose: Configures Tailwind to scan our source files.

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a", // Navy Blue
        secondary: "#334155",
        accent: "#3b82f6",  // Royal Blue
      }
    },
  },
  plugins: [],
}