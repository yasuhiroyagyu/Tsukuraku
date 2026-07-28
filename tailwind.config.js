/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18312d",
        cream: "#f7faf8",
      },
      boxShadow: {
        card: "0 12px 32px -18px rgba(15, 118, 110, 0.28)",
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Hiragino Kaku Gothic ProN"', 'Meiryo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
