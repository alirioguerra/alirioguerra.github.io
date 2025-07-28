/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1F2937',
        accent: '#F59E0B'
      },
      fontFamily: {
        lalezar: ['Lalezar', 'cursive'],
        montserrat: ['Montserrat', 'sans-serif']
      }
    },
  },
  plugins: [],
} 