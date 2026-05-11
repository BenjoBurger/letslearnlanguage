/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF7AA2',
        secondary: '#FFD166',
        accent: '#6EE7B7',
        soft: '#F6E7FF',
        bg: '#FFF8F0',
        ink: '#2A2A2A',
      },
      borderRadius: {
        md: '18px',
      },
    },
  },
  plugins: [],
};
