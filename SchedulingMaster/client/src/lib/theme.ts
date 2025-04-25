/**
 * Pixie Design System - Theme constants
 * 
 * This file contains all the theme-related constants used throughout the application.
 * All color and styling values should be defined here to ensure consistency.
 */

import { CSSProperties } from 'react';

export const PixieTheme = {
  colors: {
    // Primary brand colors
    primary: '#10B981', // Pixie primary teal green
    primaryLight: '#D1FAE5', // Lighter shade for hover states or backgrounds
    primaryDark: '#059669', // Darker shade for active states

    // Grayscale palette
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    
    // Status colors
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    
    // Appointment status colors
    scheduled: '#E5E7EB', // light gray
    confirmed: '#DBEAFE', // light blue
    checkedIn: '#D1FAE5', // light green
    inProgress: '#FEF3C7', // light yellow
    completed: '#D1FAE5', // light green
    cancelled: '#FEE2E2', // light red
    noShow: '#FEE2E2', // light red
    
    // Status text colors
    scheduledText: '#4B5563', // dark gray
    confirmedText: '#1D4ED8', // blue
    checkedInText: '#059669', // green
    inProgressText: '#B45309', // amber
    completedText: '#059669', // green
    cancelledText: '#B91C1C', // red
    noShowText: '#B91C1C', // red
  },
  
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    xxl: '3rem',   // 48px
  },
  
  radii: {
    none: '0',
    sm: '0.125rem', // 2px
    md: '0.25rem',  // 4px
    lg: '0.5rem',   // 8px
    xl: '0.75rem',  // 12px
    full: '9999px',
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  
  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  
  fontSizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    md: '1rem',      // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    xxl: '1.5rem',   // 24px
    xxxl: '2rem',    // 32px
  },
  
  fontWeights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Button styles
  buttons: {
    primary: {
      backgroundColor: '#10B981',
      color: 'white',
      borderRadius: '4px',
      fontWeight: 500,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    } as CSSProperties,
    outline: {
      backgroundColor: 'transparent',
      color: '#374151',
      borderRadius: '4px',
      fontWeight: 500,
      border: '1px solid #D1D5DB',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    } as CSSProperties,
    ghost: {
      backgroundColor: 'transparent',
      color: '#374151',
      borderRadius: '4px',
      fontWeight: 500
    } as CSSProperties
  },
  
  // Commonly used component styles
  components: {
    card: {
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    } as CSSProperties,
    chip: {
      padding: '2px 8px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 500
    } as CSSProperties,
    badge: {
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 500
    } as CSSProperties,
    toast: {
      padding: '12px 16px',
      borderRadius: '6px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    } as CSSProperties,
    popover: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #E5E7EB'
    } as CSSProperties
  }
};

// Function to get button styles based on variant
export const getButtonStyle = (variant: 'primary' | 'outline' | 'ghost'): CSSProperties => {
  switch (variant) {
    case 'primary':
      return PixieTheme.buttons.primary;
    case 'outline':
      return PixieTheme.buttons.outline;
    case 'ghost':
      return PixieTheme.buttons.ghost;
    default:
      return PixieTheme.buttons.primary;
  }
};

// Function to get status color based on status string
export const getStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
  
  switch (normalizedStatus) {
    case 'scheduled':
      return PixieTheme.colors.scheduled;
    case 'confirmed':
      return PixieTheme.colors.confirmed;
    case 'checkedin':
      return PixieTheme.colors.checkedIn;
    case 'inprogress':
      return PixieTheme.colors.inProgress;
    case 'completed':
      return PixieTheme.colors.completed;
    case 'cancelled':
      return PixieTheme.colors.cancelled;
    case 'noshow':
      return PixieTheme.colors.noShow;
    default:
      return PixieTheme.colors.gray200;
  }
};

// Function to get status text color based on status string
export const getStatusTextColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
  
  switch (normalizedStatus) {
    case 'scheduled':
      return PixieTheme.colors.scheduledText;
    case 'confirmed':
      return PixieTheme.colors.confirmedText;
    case 'checkedin':
      return PixieTheme.colors.checkedInText;
    case 'inprogress':
      return PixieTheme.colors.inProgressText;
    case 'completed':
      return PixieTheme.colors.completedText;
    case 'cancelled':
      return PixieTheme.colors.cancelledText;
    case 'noshow':
      return PixieTheme.colors.noShowText;
    default:
      return PixieTheme.colors.gray700;
  }
};