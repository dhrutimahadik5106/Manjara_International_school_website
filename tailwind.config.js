/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#123B5D',
        secondary: '#245B8F',
        accent: '#6F9FC2',
        gold: '#C7A45D',
        background: '#F7FAFC',
        surface: '#FFFFFF',
        text: '#263746',
        muted: '#64748B',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 44px -24px rgba(18, 59, 93, 0.24)',
      },
    },
  },
  plugins: [],
};
