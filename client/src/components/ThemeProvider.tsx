import { createContext, useContext, useEffect, useState } from "react";

// Define theme properties that can be customized
export interface ThemeSettings {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  popover: string;
  popoverForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  primary: string;
  primaryDark: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  ring: string;
  radius: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

// Default theme values - matches CSS variables in index.css
const defaultTheme: ThemeSettings = {
  background: "0 0% 100%",
  foreground: "20 14.3% 4.1%",
  muted: "60 4.8% 95.9%",
  mutedForeground: "25 5.3% 44.7%",
  popover: "0 0% 100%",
  popoverForeground: "20 14.3% 4.1%",
  card: "0 0% 100%",
  cardForeground: "20 14.3% 4.1%",
  border: "20 5.9% 90%",
  input: "20 5.9% 90%",
  primary: "174 100% 24%",
  primaryDark: "174 100% 18%",
  primaryForeground: "211 100% 99%",
  secondary: "200 19% 33%",
  secondaryForeground: "24 9.8% 10%",
  accent: "60 4.8% 95.9%",
  accentForeground: "24 9.8% 10%",
  destructive: "0 84.2% 60.2%",
  destructiveForeground: "60 9.1% 97.8%",
  ring: "20 14.3% 4.1%",
  radius: "0.5rem",
  chart1: "174 100% 24%",
  chart2: "200 19% 33%",
  chart3: "187 47% 55%",
  chart4: "200 18% 46%",
  chart5: "174 42% 65%",
  sidebarBackground: "0 0% 100%",
  sidebarForeground: "20 14.3% 4.1%",
  sidebarPrimary: "174 100% 24%",
  sidebarPrimaryForeground: "211 100% 99%",
  sidebarAccent: "174 42% 95%",
  sidebarAccentForeground: "174 100% 24%",
  sidebarBorder: "220 13% 91%",
  sidebarRing: "174 100% 24%",
}

// Define dark theme values
const defaultDarkTheme: ThemeSettings = {
  background: "240 10% 3.9%",
  foreground: "0 0% 98%",
  muted: "240 3.7% 15.9%",
  mutedForeground: "240 5% 64.9%",
  popover: "240 10% 3.9%",
  popoverForeground: "0 0% 98%",
  card: "240 10% 3.9%",
  cardForeground: "0 0% 98%",
  border: "240 3.7% 15.9%",
  input: "240 3.7% 15.9%",
  primary: "174 100% 24%",
  primaryDark: "174 100% 18%",
  primaryForeground: "211 100% 99%",
  secondary: "200 19% 33%",
  secondaryForeground: "0 0% 98%",
  accent: "240 3.7% 15.9%",
  accentForeground: "0 0% 98%",
  destructive: "0 62.8% 30.6%",
  destructiveForeground: "0 0% 98%",
  ring: "240 4.9% 83.9%",
  radius: "0.5rem",
  chart1: "174 100% 24%",
  chart2: "200 19% 33%",
  chart3: "187 47% 55%",
  chart4: "200 18% 46%",
  chart5: "174 42% 65%",
  sidebarBackground: "240 10% 3.9%",
  sidebarForeground: "0 0% 98%",
  sidebarPrimary: "174 100% 24%",
  sidebarPrimaryForeground: "211 100% 99%",
  sidebarAccent: "240 3.7% 15.9%",
  sidebarAccentForeground: "174 100% 24%",
  sidebarBorder: "240 3.7% 15.9%",
  sidebarRing: "174 100% 24%",
}

interface ThemeContextType {
  theme: ThemeSettings;
  darkMode: boolean;
  setTheme: (theme: ThemeSettings) => void;
  setDarkMode: (dark: boolean) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setThemeState] = useState<ThemeSettings>(defaultTheme);

  useEffect(() => {
    // Apply theme to CSS variables when theme changes
    const root = document.documentElement;
    const themeToApply = darkMode ? { ...defaultDarkTheme, ...theme } : theme;

    Object.entries(themeToApply).forEach(([key, value]) => {
      // Convert camelCase to kebab-case for CSS variables
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVarName}`, value);
    });

    // Toggle dark class on body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, darkMode]);

  const setTheme = (newTheme: ThemeSettings) => {
    setThemeState(newTheme);
    // Save theme to localStorage for persistence
    localStorage.setItem('custom-theme', JSON.stringify(newTheme));
  };

  const resetTheme = () => {
    setThemeState(darkMode ? defaultDarkTheme : defaultTheme);
    localStorage.removeItem('custom-theme');
  };

  useEffect(() => {
    // Load theme from localStorage if exists
    const savedTheme = localStorage.getItem('custom-theme');
    if (savedTheme) {
      try {
        setThemeState(JSON.parse(savedTheme));
      } catch (e) {
        console.error("Failed to parse saved theme", e);
      }
    }

    // Check for user preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, darkMode, setTheme, setDarkMode, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}