// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Pastikan ini mencakup semua file tempat Anda akan menulis class Tailwind
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Contoh warna ungu
        secondary: "#F59E0B", // Contoh warna kuning
        accent: "#10B981", // Contoh warna hijau
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Menggunakan font Inter sebagai default sans-serif
        serif: ["Merriweather", "serif"], // Menggunakan font Merriweather sebagai default serif
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // Plugin untuk styling form
    require("@tailwindcss/typography"), // Plugin untuk styling tipografi
  ],
};
