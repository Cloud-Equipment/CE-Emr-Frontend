/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "ce-green": "#0E5F50",
        "ce-lgreen": "#EEFFFC",
        greenText: "#54D4BD",
        blackText: "#40484F",
        greyText: "#8F9AA3",
        greyText2: "#667085",
        borderLine: "#EAECF0",
      },
    },
  },
  plugins: [],
};