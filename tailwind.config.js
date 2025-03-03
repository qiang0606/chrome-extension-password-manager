/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#409eff",
        secondary: "#67c23a",
        warning: "#e6a23c",
        danger: "#f56c6c",
        info: "#909399",
      },
      boxShadow: {
        card: "0 2px 12px 0 rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
