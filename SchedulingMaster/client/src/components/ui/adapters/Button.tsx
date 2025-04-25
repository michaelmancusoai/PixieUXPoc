import React from 'react';
import { 
  Button as ShadcnButton,
  type ButtonProps as ShadcnButtonProps
} from '@/components/ui/button';

// Define our component's props
export interface ButtonProps extends ShadcnButtonProps {}

/**
 * Button adapter component
 * 
 * This adapter provides a consistent interface for buttons that makes it easy
 * to swap between different UI libraries.
 * 
 * For Material UI migration:
 * - Replace the ShadcnButton import with the MUI Button
 * - Map variant and size props to their MUI equivalents
 * - Transform className to sx prop if needed
 */
export function Button({
  children,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
}

export default Button;