const brand = {
  colors: {
    "bg-void": "#05060F",
    "bg-deep": "#0A0E1F",
    "cyan-primary": "#3FE8F4",
    "blue-electric": "#5B7FFF",
    "violet-core": "#9D5CFF",
    "magenta-glow": "#E63CD8",
    "text-primary": "#F2F4FF",
    "text-muted": "#8A91B0",
    glass: {
      bg: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.12)",
    },
  },
  fontFamily: {
    heading: [
      "var(--font-heading)",
      "Space Grotesk",
      "Sora",
      "system-ui",
      "sans-serif",
    ],
    body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
    persian: ["var(--font-persian)", "Vazirmatn", "Tahoma", "sans-serif"],
    mono: [
      "var(--font-mono)",
      "JetBrains Mono",
      "Fira Code",
      "ui-monospace",
      "monospace",
    ],
  },
  backgroundImage: {
    "brand-beam":
      "linear-gradient(135deg, #3FE8F4 0%, #5B7FFF 35%, #9D5CFF 68%, #E63CD8 100%)",
    "glass-glow":
      "linear-gradient(135deg, rgba(63,232,244,0.22), rgba(157,92,255,0.18), rgba(230,60,216,0.22))",
    "deep-space":
      "radial-gradient(circle at 20% 20%, rgba(63,232,244,0.16), transparent 30%), radial-gradient(circle at 80% 10%, rgba(230,60,216,0.14), transparent 28%), linear-gradient(180deg, #05060F 0%, #0A0E1F 100%)",
  },
  borderRadius: {
    glass: "24px",
    panel: "32px",
  },
  boxShadow: {
    "cyan-glow": "0 0 32px rgba(63,232,244,0.28)",
    "violet-glow": "0 0 40px rgba(157,92,255,0.28)",
    "magenta-glow": "0 0 40px rgba(230,60,216,0.26)",
    "glass-lift": "0 24px 80px rgba(0,0,0,0.42)",
  },
  transitionTimingFunction: {
    premium: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
};

module.exports = {
  theme: {
    extend: brand,
  },
};
