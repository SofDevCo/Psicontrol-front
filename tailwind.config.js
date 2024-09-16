/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#2980b9'
      },
      borderRadius: {
        'custom': '25px'
      }
    },
  },
  plugins: [],
}

