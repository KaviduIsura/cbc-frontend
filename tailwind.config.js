/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f5f5f5",
        secondary: "#0a0a0a",
        accent: "#ece1d6",
        accent_light: "#ECE2D6",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        nonito_sans: ["Nunito Sans", "sans-serif"],
        open_sans: ["Open Sans", "sans-serif"],
        noto_sans: ["Noto Sans", "sans-serif"],
      },
      screens: {
        xs: "375px",
        sm: "640px",
      },
      fontSize: {
        "level-1": "42px",
        "level-2": "32px",
        "level-3": "24px",
        "level-4": "22px",
        "level-5": "16px",
        "level-6": "14px",
        "level-7": "12px",
      },
    },
  },
  plugins: [],
};
