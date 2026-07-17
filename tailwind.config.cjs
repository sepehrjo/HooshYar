const brandPreset = require("./design/tailwind-brand-preset.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [brandPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{json,md,mdx}",
    "./messages/**/*.json",
  ],
  theme: {
    extend: {
      fontSize: {
        display: [
          "clamp(3rem, 8vw, 7.5rem)",
          { lineHeight: "0.9", letterSpacing: "-0.08em" },
        ],
        hero: [
          "clamp(2.5rem, 6vw, 5.75rem)",
          { lineHeight: "0.95", letterSpacing: "-0.065em" },
        ],
      },
      keyframes: {
        "float-soft": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        "float-soft": "float-soft 7s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
