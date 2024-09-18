/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#0082BA',
        'custom-white': '#DFEAF2'
      },
      borderRadius: {
        'custom': '25px'
      }
    },
  },
  plugins: [],
}

