/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000066',
          50: '#f0f0f5',
          100: '#e1e1eb',
          200: '#c3c3d7',
          300: '#a5a5c3',
          400: '#8787af',
          500: '#1a1a2e',
          600: '#151525',
          700: '#10101c',
          800: '#0a0a13',
          900: '#050509',
        },
        secondary: {
          DEFAULT: '#22c55e',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        footer: '#0A0A23',
        'primary-light': '#2d2d44',
        'primary-dark': '#0f0f1a',
        'secondary-light': '#33ddff',
        'secondary-dark': '#0099cc',
      }
    },
  },
  plugins: [],
}