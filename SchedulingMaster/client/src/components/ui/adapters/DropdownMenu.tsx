import React from 'react';
import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent as ShadcnDropdownMenuContent,
  DropdownMenuItem as ShadcnDropdownMenuItem,
  DropdownMenuTrigger as ShadcnDropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * DropdownMenu adapter components
 * 
 * These adapters provide a consistent interface for dropdown menus that makes
 * it easy to swap between different UI libraries.
 * 
 * For Material UI migration:
 * - Replace the Shadcn imports with MUI Menu/MenuItem components
 * - Map the props to their MUI equivalents
 * - Adjust the structure to match MUI's menu composition
 */

export interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <ShadcnDropdownMenu>{children}</ShadcnDropdownMenu>;
}

export interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export function DropdownMenuTrigger({
  children,
  className,
  asChild,
}: DropdownMenuTriggerProps) {
  return (
    <ShadcnDropdownMenuTrigger className={className} asChild={asChild}>
      {children}
    </ShadcnDropdownMenuTrigger>
  );
}

export interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function DropdownMenuContent({
  children,
  className,
  align,
}: DropdownMenuContentProps) {
  return (
    <ShadcnDropdownMenuContent className={className} align={align}>
      {children}
    </ShadcnDropdownMenuContent>
  );
}

export interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function DropdownMenuItem({
  children,
  className,
  onClick,
  disabled,
}: DropdownMenuItemProps) {
  return (
    <ShadcnDropdownMenuItem
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </ShadcnDropdownMenuItem>
  );
}

// Export all components for convenience
export const DropdownMenus = {
  Root: DropdownMenu,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
};