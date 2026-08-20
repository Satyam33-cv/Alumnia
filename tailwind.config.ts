import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "#0f172a",
        primaryContainer: "#1e293b",
        secondary: "#3b82f6",
        secondaryContainer: "#bfdbfe",
        tertiary: "#10b981",
        tertiaryContainer: "#d1fae5",
        accent: "#f59e0b",
        accentLight: "#fbbf24",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        muted: "#64748b",
        mutedForeground: "#94a3b8",
        destructive: "#dc2626",
        destructiveForeground: "#fef2f2",
        glass: "rgba(255, 255, 255, 0.1)",
        glassBorder: "rgba(255, 255, 255, 0.2)",
        card: "rgba(255, 255, 255, 0.6)",
        cardHover: "rgba(255, 255, 255, 0.8)",
        paper: "#f8fafc",
        ink: "#020617",
        sage: "#059669",
        clay: "#ea580c",
        mist: "#e2e8f0",
        
        /* shadcn-inspired mappings to our brand colors */
        /* shadcn neutral-50 -> our paper-50 */
        /* shadcn neutral-900 -> our ink-900 */
        /* shadcn primary-500 -> our brass-500 */
        /* shadcn primary-600 -> our brass-600 */
        /* shadcn success -> our sage-500 */
        /* shadcn warning -> our clay-500 */
        /* shadcn info -> our sage-500 */
        /* shadcn destructive -> our clay-500 */
      },
      borderRadius: {
        lg: "var(--radius-lg, 12px)",
        md: "var(--radius-md, 8px)",
        sm: "var(--radius-sm, 4px)",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
        cardHover: "0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)",
        glass: "0 4px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)",
        glow: "0 0 30px rgba(59, 130, 246, 0.15)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.3s ease-out",
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
          from: { opacity: "0", transform: "translateY(10px)" },
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