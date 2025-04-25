import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
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
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Pixie-specific colors based on the actual screenshots
        pixie: {
          primary: "#10B981", // Teal green (Pixie's actual primary color)
          secondary: "#0EA5E9", // Sky blue
          accent: "#6366F1", // Indigo
          success: "#22C55E", // Green
          warning: "#F59E0B", // Amber
          danger: "#EF4444", // Red
          info: "#06B6D4", // Cyan
          light: "#F8FAFC", // Almost white
          dark: "#0F172A", // Almost black
          gray: "#64748B", // Slate
        },
        status: {
          scheduled: "#2563EB", // Blue
          confirmed: "#0EA5E9", // Sky blue
          checked_in: "#22C55E", // Green
          in_chair: "#0284C7", // Sky blue
          complete: "#94A3B8", // Slate
          late: "#F97316", // Orange
          no_show: "#EF4444", // Red
        },
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
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0px rgba(34, 197, 94, 0)" },
          "50%": { boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.25)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
      },
      boxShadow: {
        pixie: "0 2px 10px rgba(15, 23, 42, 0.08)",
        "pixie-md": "0 4px 20px rgba(15, 23, 42, 0.1)",
        "pixie-lg": "0 10px 30px rgba(15, 23, 42, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
