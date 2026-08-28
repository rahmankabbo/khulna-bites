import type { Config } from "tailwindcss";

/**
 * Khulna Bites design tokens.
 *
 * Palette — "morning paper by the Rupsha":
 *   paper   warm off-white page background
 *   ink     dark charcoal text
 *   sundari deep Sundarbans green — the single primary accent
 *   amber   ripe-mango amber, used sparingly for highlights/badges
 *   line    hairline borders
 *   mute    secondary text
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7F1",
        ink: "#1C1B17",
        sundari: {
          DEFAULT: "#0E6B4D",
          dark: "#0A523C",
          tint: "#E4EFE9",
        },
        amber: {
          DEFAULT: "#D98E1B",
          tint: "#F8EED8",
        },
        line: "#E5DFD2",
        mute: "#6E695C",
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-bengali)", "sans-serif"],
        body: ["var(--font-body)", "var(--font-bengali)", "sans-serif"],
      },
      maxWidth: {
        site: "1200px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,27,23,0.05), 0 8px 24px -12px rgba(28,27,23,0.12)",
        lift: "0 2px 4px rgba(28,27,23,0.06), 0 16px 40px -16px rgba(28,27,23,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
