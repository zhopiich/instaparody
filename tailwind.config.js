/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "max-2xl": { max: "1535px" },
        // => @media (max-width: 1535px) { ... }

        "max-xl": { max: "1279px" },
        // => @media (max-width: 1279px) { ... }

        "max-lg": { max: "1023px" },
        // => @media (max-width: 1023px) { ... }

        "max-md": { max: "767px" },
        // => @media (max-width: 767px) { ... }

        "max-sm": { max: "639px" },
        // => @media (max-width: 639px) { ... }

        "max-h-md": { raw: "(max-height: 767px)" },
        // => @media (max-height: 767px) { ... }

        "h-md": { raw: "(min-height: 768px)" },

        "max-h-lg": { raw: "(max-height: 1023px)" },

        "h-lg": { raw: "(min-height: 1024px)" },
      },
    },
  },
  plugins: [require("daisyui")],
};
