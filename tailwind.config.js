/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "60": "#ffffff",
        "30": "#b19cd9",
        "10": "#800080",
        "disabled": "rgb(156,163,175)",
        "valid": "rgb(22,163,74)"
      }
    },
  },
  plugins: [],
}
