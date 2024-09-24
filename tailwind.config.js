/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#0082BA',
        'custom-white': '#DFEAF2',
        'custom-gray': '#8BA3CB',
        'new-white':'#F5F5F5',
        'new-gray': '#81A0AE',
        'little-blue': '#E9F6F9',
        'primaria-clara3' : '#BDE3ED'
      },
      borderRadius: {
        'custom': '25px'
      },
    },
  },
  plugins: [],
}

