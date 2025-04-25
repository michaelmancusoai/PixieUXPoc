import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

/**
 * Example Material UI theme setup for migrating from shadcn/Tailwind
 * 
 * This file demonstrates how to:
 * 1. Create a Material UI theme that matches your current design system
 * 2. Map color variables from CSS to Material UI theme
 * 3. Configure typography and spacing to match your current design
 */

// Create a theme instance based on the current application design
export const theme = createTheme({
  // Color palette mapping from the current application
  palette: {
    primary: {
      main: '#3b82f6', // Equivalent to blue-500 in Tailwind
      light: '#93c5fd', // blue-300
      dark: '#2563eb', // blue-600
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a855f7', // purple-500
      light: '#d8b4fe', // purple-300
      dark: '#9333ea', // purple-600
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // emerald-500
      light: '#6ee7b7', // emerald-300
      dark: '#059669', // emerald-600
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // red-500
      light: '#fca5a5', // red-300
      dark: '#dc2626', // red-600
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f97316', // orange-500
      light: '#fdba74', // orange-300
      dark: '#ea580c', // orange-600
      contrastText: '#ffffff',
    },
    info: {
      main: '#0284c7', // sky-600
      light: '#7dd3fc', // sky-300
      dark: '#0369a1', // sky-700
      contrastText: '#ffffff',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937', // gray-800
      secondary: '#6b7280', // gray-500
      disabled: '#9ca3af', // gray-400
    },
  },
  
  // Typography configuration to match the current design
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },
  
  // Shape configuration for rounded corners
  shape: {
    borderRadius: 6, // Equivalent to rounded-md in Tailwind
  },
  
  // Spacing configuration (default is 8px unit in Material UI)
  spacing: (factor: number) => `${factor * 0.25}rem`, // 1 unit = 0.25rem (4px) to match Tailwind
  
  // Component overrides to match current styling
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem', // rounded-md
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 500,
          padding: '0.5rem 1rem', // py-2 px-4
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1px',
        },
        sizeSmall: {
          padding: '0.25rem 0.5rem', // py-1 px-2
          fontSize: '0.75rem', // text-xs
        },
        sizeLarge: {
          padding: '0.75rem 1.5rem', // py-3 px-6
          fontSize: '1rem', // text-base
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem', // rounded-lg
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          border: '1px solid rgba(229, 231, 235, 1)', // border-gray-200
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)', // slate-900 with 90% opacity
          padding: '0.5rem 0.75rem', // p-2 px-3
          fontSize: '0.75rem', // text-xs
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Theme provider component for wrapping the application
export function ThemeConfig({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * import { ThemeConfig } from './path/to/MaterialUI_Theme';
 * 
 * function App() {
 *   return (
 *     <ThemeConfig>
 *       <YourApplication />
 *     </ThemeConfig>
 *   );
 * }
 */

// Export a function to access theme values (useful for styled components)
export function useAppTheme() {
  return theme;
}