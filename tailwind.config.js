/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#FDF8F3',
          100: '#F8EDE3',
          200: '#EED8C5',
          300: '#E1BEA1',
          400: '#D49A78',
          500: '#C77A54',
          600: '#A85E3C',
          700: '#8B4513',
          800: '#6B3610',
          900: '#4A260B',
        }
      },
      fontFamily: {
        serif: ['SimSun', 'Songti SC', 'serif'],
      }
    },
  },
  plugins: [],
}
