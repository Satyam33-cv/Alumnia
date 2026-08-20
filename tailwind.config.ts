import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // New Design System Colors
        ink: {
          DEFAULT: "#282943",
          50: "#f0f0f5",
          100: "#e0e1e8",
          200: "#c1c3d1",
          300: "#a2a5ba",
          400: "#8387a3",
          500: "#64698c",
          600: "#4d5175",
          700: "#3a3e5e",
          800: "#2e314a",
          900: "#282943",
          950: "#1a1b2e",
        },
        canvas: {
          DEFAULT: "#FFFEFF",
          muted: "#F8FAFC",
        },
        purple: {
          DEFAULT: "#6366F1",
          50: "#EEF0FF",
          100: "#DDDFFF",
          200: "#BBBDFF",
          300: "#999BFF",
          400: "#7779FF",
          500: "#6366F1",
          600: "#4F51D1",
          700: "#3E3FA3",
          800: "#30317A",
          900: "#26275C",
        },
        blue: {
          DEFAULT: "#3B82F6",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        border: {
          DEFAULT: "rgba(40, 41, 67, 0.15)",
          strong: "rgba(40, 41, 67, 0.25)",
        },
        glass: "rgba(255, 254, 255, 0.7)",
        glassBorder: "rgba(40, 41, 67, 0.1)",
        glassHover: "rgba(255, 254, 255, 0.9)",

        // Semantic aliases
        primary: "#282943",
        primaryForeground: "#FFFEFF",
        secondary: "#6366F1",
        secondaryForeground: "#FFFEFF",
        accent: "#3B82F6",
        accentForeground: "#FFFEFF",
        muted: "#F8FAFC",
        mutedForeground: "#64698C",
        card: "#FFFEFF",
        cardForeground: "#282943",
        destructive: "#EF4444",
        destructiveForeground: "#FFFEFF",
        success: "#10B981",
        warning: "#F59E0B",
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
        body: ["var(--font-satoshi)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius-lg, 12px)",
        md: "var(--radius-md, 8px)",
        sm: "var(--radius-sm, 4px)",
        xl: "var(--radius-xl, 16px)",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(40, 41, 67, 0.08), 0 2px 8px rgba(40, 41, 67, 0.04)",
        cardHover: "0 8px 30px rgba(40, 41, 67, 0.12), 0 4px 16px rgba(40, 41, 67, 0.06)",
        glass: "0 4px 20px rgba(40, 41, 67, 0.1), 0 2px 8px rgba(40, 41, 67, 0.05)",
        glow: "0 0 30px rgba(99, 102, 241, 0.15)",
        glowBlue: "0 0 30px rgba(59, 130, 246, 0.15)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-10px)" },
          to: { transform: "translateX(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};

export default config;