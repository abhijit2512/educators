import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1200px", "2xl": "1320px" },
    },
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#bcd0ff",
          300: "#92b1ff",
          400: "#6589ff",
          500: "#3f64ff",
          600: "#2a47e6",
          700: "#2238b4",
          800: "#1f3290",
          900: "#1e2e75",
          950: "#131b46",
        },
        accent: {
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
        ink: {
          900: "#0b1020",
          800: "#121833",
          700: "#1c2547",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
        display: ["ui-sans-serif", "system-ui", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(15, 23, 42, 0.15)",
        glow: "0 0 0 1px rgba(63,100,255,0.2), 0 20px 50px -20px rgba(63,100,255,0.45)",
      },
      backgroundImage: {
        "grid-soft":
          "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
        "hero-radial":
          "radial-gradient(60% 60% at 50% 0%, rgba(63,100,255,0.18) 0%, rgba(63,100,255,0) 70%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
