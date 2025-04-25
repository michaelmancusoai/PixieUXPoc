/**
 * Material UI to shadcn/ui Adapter Components
 * 
 * This file contains adapter components to ease migration from Material UI to shadcn/ui.
 * The adapters provide a Material UI-like API but use shadcn/ui components underneath.
 */

import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PixieTheme } from '@/lib/theme';

// Material UI Button adapter
interface ButtonProps {
  variant?: 'text' | 'contained' | 'outlined';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  startIcon,
  endIcon,
  fullWidth = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) => {
  // Map MUI variants to shadcn variants
  const getVariant = () => {
    switch (variant) {
      case 'text':
        return 'ghost';
      case 'outlined':
        return 'outline';
      case 'contained':
      default:
        return 'default';
    }
  };

  // Map MUI sizes to shadcn sizes
  const getSize = () => {
    switch (size) {
      case 'small':
        return 'sm';
      case 'large':
        return 'lg';
      case 'medium':
      default:
        return 'default';
    }
  };

  // Get the color style based on the color prop
  const getColorStyle = () => {
    if (variant !== 'contained') return {};

    switch (color) {
      case 'primary':
        return { backgroundColor: PixieTheme.colors.primary, color: 'white' };
      case 'secondary':
        return { backgroundColor: PixieTheme.colors.gray700, color: 'white' };
      case 'error':
        return { backgroundColor: PixieTheme.colors.danger, color: 'white' };
      case 'warning':
        return { backgroundColor: PixieTheme.colors.warning, color: 'white' };
      case 'info':
        return { backgroundColor: PixieTheme.colors.info, color: 'white' };
      case 'success':
        return { backgroundColor: PixieTheme.colors.success, color: 'white' };
      default:
        return {};
    }
  };

  const fullWidthClass = fullWidth ? 'w-full' : '';

  return (
    <ShadcnButton
      variant={getVariant()}
      size={getSize() as any}
      disabled={disabled}
      onClick={onClick}
      className={`${fullWidthClass} ${className}`}
      type={type}
      style={getColorStyle()}
      {...props}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </ShadcnButton>
  );
};

// Material UI Paper adapter using Card
interface PaperProps {
  elevation?: number;
  variant?: 'outlined' | 'elevation';
  square?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Paper = ({
  elevation = 1,
  variant = 'elevation',
  square = false,
  children,
  className = '',
  ...props
}: PaperProps) => {
  const elevationClass = variant === 'elevation' ? `shadow-${elevation > 6 ? 'lg' : elevation > 3 ? 'md' : 'sm'}` : '';
  const borderClass = variant === 'outlined' || elevation === 0 ? 'border' : '';
  const roundedClass = !square ? 'rounded-md' : '';

  return (
    <div className={`bg-white ${elevationClass} ${borderClass} ${roundedClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Material UI Typography adapter
interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline';
  component?: React.ElementType;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  color?: 'initial' | 'inherit' | 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error';
  children: React.ReactNode;
  className?: string;
}

export const Typography = ({
  variant = 'body1',
  component,
  align = 'inherit',
  color = 'initial',
  children,
  className = '',
  ...props
}: TypographyProps) => {
  // Map MUI variants to CSS classes
  const getVariantClass = () => {
    switch (variant) {
      case 'h1':
        return 'text-4xl font-bold';
      case 'h2':
        return 'text-3xl font-bold';
      case 'h3':
        return 'text-2xl font-bold';
      case 'h4':
        return 'text-xl font-bold';
      case 'h5':
        return 'text-lg font-bold';
      case 'h6':
        return 'text-base font-bold';
      case 'subtitle1':
        return 'text-base';
      case 'subtitle2':
        return 'text-sm font-medium';
      case 'body1':
        return 'text-base';
      case 'body2':
        return 'text-sm';
      case 'caption':
        return 'text-xs';
      case 'overline':
        return 'text-xs uppercase tracking-wider';
      default:
        return 'text-base';
    }
  };

  // Map MUI alignments to CSS classes
  const getAlignClass = () => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'justify':
        return 'text-justify';
      default:
        return '';
    }
  };

  // Map MUI colors to CSS classes
  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return `text-[${PixieTheme.colors.primary}]`;
      case 'secondary':
        return 'text-gray-600';
      case 'textPrimary':
        return 'text-gray-900';
      case 'textSecondary':
        return 'text-gray-600';
      case 'error':
        return `text-[${PixieTheme.colors.danger}]`;
      default:
        return '';
    }
  };

  const Component = component || getDefaultComponent();

  function getDefaultComponent() {
    switch (variant) {
      case 'h1':
        return 'h1';
      case 'h2':
        return 'h2';
      case 'h3':
        return 'h3';
      case 'h4':
        return 'h4';
      case 'h5':
        return 'h5';
      case 'h6':
        return 'h6';
      case 'subtitle1':
      case 'subtitle2':
        return 'h6';
      case 'body1':
      case 'body2':
        return 'p';
      default:
        return 'span';
    }
  }

  return (
    <Component 
      className={`${getVariantClass()} ${getAlignClass()} ${getColorClass()} ${className}`} 
      {...props}
    >
      {children}
    </Component>
  );
};

// Material UI Card adapters
export { Card, CardContent, CardHeader, CardFooter };