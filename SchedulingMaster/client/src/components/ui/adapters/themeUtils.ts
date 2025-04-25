import { cn } from '@/lib/utils';

/**
 * Theme utility functions to help with migrating between UI libraries
 * 
 * These utilities make it easier to swap between Tailwind/shadcn and Material UI styling
 */

type ColorVariant = 
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'accent'
  | 'muted'
  | 'success'
  | 'warning'
  | 'info'
  | 'error';

type SizeVariant = 'sm' | 'md' | 'lg' | 'xs' | 'xl';

/**
 * Maps color variants between our system and Material UI
 * This can be updated when migrating to Material UI
 */
export function mapColorVariant(variant: ColorVariant): string {
  // For now, this returns the same string (used with Tailwind/shadcn)
  // When migrating to MUI, this would convert to MUI color names
  return variant;
}

/**
 * Maps size variants between our system and Material UI
 * This can be updated when migrating to Material UI
 */
export function mapSizeVariant(size: SizeVariant): string {
  // For now, this returns the same string (used with Tailwind/shadcn)
  // When migrating to MUI, this would convert to MUI size names
  return size;
}

/**
 * Converts Tailwind/shadcn classes to Material UI sx prop
 * This would be expanded during migration
 */
export function classesToSx(className: string): Record<string, any> {
  // This is a placeholder implementation
  // When migrating to MUI, this would convert Tailwind classes to MUI sx prop values
  return { className };
}

/**
 * Generic style helper that works with both Tailwind/shadcn and can be adapted for MUI
 */
export function getStyles(
  baseStyles: string,
  conditionalStyles: Record<string, boolean>,
  additionalClasses?: string
): string {
  return cn(baseStyles, conditionalStyles, additionalClasses);
}

export const colors = {
  primary: {
    light: 'hsl(var(--primary) / 0.2)',
    main: 'hsl(var(--primary))',
    dark: 'hsl(var(--primary) / 0.8)',
    contrastText: 'hsl(var(--primary-foreground))',
  },
  secondary: {
    light: 'hsl(var(--secondary) / 0.2)',
    main: 'hsl(var(--secondary))',
    dark: 'hsl(var(--secondary) / 0.8)',
    contrastText: 'hsl(var(--secondary-foreground))',
  },
  success: {
    light: 'hsl(var(--success) / 0.2)',
    main: 'hsl(var(--success))',
    dark: 'hsl(var(--success) / 0.8)',
    contrastText: 'hsl(var(--success-foreground))',
  },
  error: {
    light: 'hsl(var(--destructive) / 0.2)',
    main: 'hsl(var(--destructive))',
    dark: 'hsl(var(--destructive) / 0.8)',
    contrastText: 'hsl(var(--destructive-foreground))',
  },
  warning: {
    light: 'hsl(var(--warning) / 0.2)',
    main: 'hsl(var(--warning))',
    dark: 'hsl(var(--warning) / 0.8)',
    contrastText: 'hsl(var(--warning-foreground))',
  },
};