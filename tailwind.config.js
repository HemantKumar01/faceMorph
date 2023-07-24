/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**",
    "./node_modules/flowbite/**/*.js",
    "./public/*.html",
    "./public/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
