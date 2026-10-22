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
        // Comprehensive MIS Brand System Colors
        'mis-navy': '#0B2742',
        'mis-blue-dark': '#145A86',
        'mis-blue': '#1D78A8',
        'mis-soft': '#EAF4FA',
        'mis-gold': '#C9A24D',
        'mis-gold-soft': '#F4E8C7',
        'mis-slate': '#F4F7FA',
        'mis-dark-text': '#102A43',
        'mis-muted': '#526777',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 44px -24px rgba(18, 59, 93, 0.24)',
        card: '0 4px 20px -2px rgba(11, 39, 66, 0.08)',
        'card-hover': '0 12px 32px -4px rgba(11, 39, 66, 0.16)',
        header: '0 2px 16px rgba(11, 39, 66, 0.06)',
      },
    },
  },
  plugins: [],
};
