import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        "surface-muted": "hsl(var(--surface-muted) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        "foreground-muted": "hsl(var(--foreground-muted) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        indigo: {
          DEFAULT: "hsl(var(--indigo) / <alpha-value>)",
          foreground: "hsl(var(--indigo-foreground) / <alpha-value>)",
        },
        ochre: {
          DEFAULT: "hsl(var(--ochre) / <alpha-value>)",
          foreground: "hsl(var(--ochre-foreground) / <alpha-value>)",
        },
        palm: {
          DEFAULT: "hsl(var(--palm) / <alpha-value>)",
          foreground: "hsl(var(--palm-foreground) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "hsl(var(--danger) / <alpha-value>)",
          foreground: "hsl(var(--danger-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "18px",
        photo: "14px",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
