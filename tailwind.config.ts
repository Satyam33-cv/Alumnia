import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000615",
        primaryContainer: "#0b1f3a",
        secondary: "#7b580b",
        secondaryContainer: "#fdcd78",
        tertiaryOnContainer: "#30967a",
        background: "#fbf9f4",
        surfaceContainerLow: "#f5f3ee",
        surfaceContainerHigh: "#eae8e3",
        onSurface: "#1b1c19",
        onSurfaceVariant: "#44474d",
        outlineVariant: "#c4c6ce",
        error: "#ba1a1a",
        ink: { 900: "#1b1c19" },
        paper: { 50: "#fbf9f4" },
        brass: { 500: "#7b580b", 600: "#5c4208" },
        sage: { 500: "#30967a" },
        clay: { 500: "#ba1a1a" },
        mist: { 200: "#c4c6ce" },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
        cardHover: "0 4px 16px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.04)",
      },
      spacing: {
        base: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
    },
  },
  plugins: [],
};

export default config;