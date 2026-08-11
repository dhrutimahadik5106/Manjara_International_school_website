/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#234E70',
        secondary: '#C9A227',
        accent: '#6FA3A8',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: '#2D3748',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 16px 40px -24px rgba(35, 78, 112, 0.18)',
      },
    },
  },
  plugins: [],
};
