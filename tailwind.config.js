/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        demo_yellow: {
          DEFAULT: "#ffcc00",
          light: "#e0c059",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
