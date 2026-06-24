/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      colors: {
        teal: {
          brand: "#1a4a47",
          deep: "#122e2c",
          mid: "#1f5c58",
          light: "#2a7a74",
          accent: "#3d9e96",
        },
      },
    },
  },
  plugins: [],
}
