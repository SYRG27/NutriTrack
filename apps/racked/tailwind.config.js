/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0d0e0f",
        surface: "#141517",
        "surface-2": "#17181a",
        "surface-3": "#18191b",
        border: "#232527",
        "border-input": "#2a2c2e",
        ink: "#f3f1ee",
        "ink-2": "#c8c5c1",
        muted: "#9ea2a6",
        label: "#a2a6aa",
        accent: "oklch(0.78 0.16 72)",
        "accent-hi": "oklch(0.82 0.15 72)",
        "accent-soft": "rgba(214,150,58,0.14)",
        danger: "oklch(0.68 0.19 25)",
        placeholder: "#191a1c",
      },
      fontFamily: {
        display: ["Oswald", "Impact", "sans-serif"],
        body: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      // Oswald 500/600 and Plex 400/500/600 are the only weights the brief allows,
      // so expose them by number rather than by Tailwind's names.
      fontWeight: { 400: "400", 500: "500", 600: "600" },
      borderRadius: { card: "14px", box: "12px", "box-sm": "11px" },
      boxShadow: { drawer: "-18px 0 50px rgba(0,0,0,0.5)" },
      maxWidth: { copy: "70ch" },
    },
  },
  plugins: [],
};
