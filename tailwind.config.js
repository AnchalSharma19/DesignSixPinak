/** @type {import('tailwindcss').Config } */
module.exports = {
  content: [
    "./src/**/*.html",
    "./src/_includes/**/*.html",
    "./src/_includes/components/**/*.html",
    "./src/_includes/components/home/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3c82f6",
        secondary: '#2463eb',
        btnColor: '#dc2625',
        headingYellow: '#fff688'
      }
    },
  },
  plugins: [],
};
