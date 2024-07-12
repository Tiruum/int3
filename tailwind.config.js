/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}