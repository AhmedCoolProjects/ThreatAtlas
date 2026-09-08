import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        cyber: {
          darkest: "#050811",
          dark: "#0a0f1d",
          panel: "#0f172a",
          border: "#1e293b",
          red: {
            DEFAULT: "#ef4444",
            glow: "#f87171",
            dark: "#7f1d1d",
            light: "#fca5a5",
          },
          blue: {
            DEFAULT: "#06b6d4",
            glow: "#38bdf8",
            dark: "#0e7490",
            light: "#7dd3fc",
          },
          emerald: {
            DEFAULT: "#10b981",
            glow: "#34d399",
            dark: "#064e3b",
          },
          amber: {
            DEFAULT: "#f59e0b",
            glow: "#fbbf24",
            dark: "#78350f",
          },
          purple: {
            DEFAULT: "#8b5cf6",
            glow: "#a78bfa",
            dark: "#4c1d95",
          }
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-red": "glowRed 2s ease-in-out infinite alternate",
        "glow-blue": "glowBlue 2s ease-in-out infinite alternate",
        "radar-scan": "radarScan 4s linear infinite",
      },
      keyframes: {
        glowRed: {
          "0%": { boxShadow: "0 0 5px rgba(239, 68, 68, 0.4), 0 0 10px rgba(239, 68, 68, 0.2)" },
          "100%": { boxShadow: "0 0 15px rgba(239, 68, 68, 0.8), 0 0 25px rgba(239, 68, 68, 0.4)" },
        },
        glowBlue: {
          "0%": { boxShadow: "0 0 5px rgba(6, 182, 212, 0.4), 0 0 10px rgba(6, 182, 212, 0.2)" },
          "100%": { boxShadow: "0 0 15px rgba(6, 182, 212, 0.8), 0 0 25px rgba(6, 182, 212, 0.4)" },
        },
        radarScan: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
