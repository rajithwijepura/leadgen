/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        loadingBar: 'loadingBar 1.5s infinite',
      },
    },
  },
  plugins: [],
};