module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Замість src/ можете вказати потрібні вам шляхи
  ],
  theme: {
    extend: {},
  },
    plugins: [
      require("tailwind-scrollbar"),
  ],
};
