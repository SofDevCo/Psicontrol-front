/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primaria': '#0082BA',
        'custom-white': '#DFEAF2',
        'custom-gray': '#8BA3CB',
        'bg1':'#F5F5F5',
        'new-gray': '#81A0AE',
        'clara4': '#EDF5FC',
        'clara3' : '#C7E0F7',
        'cinza6': '#81A0AE',
        'cinza8':'#B6CAD3'
      },
    },
  },
  plugins: [],
}

