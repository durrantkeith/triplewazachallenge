/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'osp-dark': '#17181A',
        'osp-white': '#FFFCFC',
        'osp-navy': '#020142',
        'osp-blue': '#0a286c',
        'osp-light-blue': '#54adec',
        'osp-red': '#e4343c',
        'osp-yellow': '#fece1d',
        'osp-gray': '#C4C4C4',
      },
    },
  },
  plugins: [],
};
