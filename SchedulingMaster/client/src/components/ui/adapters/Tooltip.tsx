import React from 'react';
import {
  Tooltip as ShadcnTooltip,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
  TooltipTrigger as ShadcnTooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Tooltip adapter components
 * 
 * These adapters provide a consistent interface for tooltips that makes
 * it easy to swap between different UI libraries.
 * 
 * For Material UI migration:
 * - Replace the Shadcn imports with MUI Tooltip components
 * - Map the props to their MUI equivalents
 * - Adjust the structure to match MUI's tooltip composition
 */

export interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

export function TooltipProvider({ 
  children, 
  delayDuration 
}: TooltipProviderProps) {
  return (
    <ShadcnTooltipProvider delayDuration={delayDuration}>
      {children}
    </ShadcnTooltipProvider>
  );
}

export interface TooltipProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Tooltip({
  children,
  open,
  onOpenChange,
}: TooltipProps) {
  return (
    <ShadcnTooltip
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </ShadcnTooltip>
  );
}

export interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function TooltipTrigger({
  children,
  asChild,
}: TooltipTriggerProps) {
  return (
    <ShadcnTooltipTrigger asChild={asChild}>
      {children}
    </ShadcnTooltipTrigger>
  );
}

export interface TooltipContentProps {
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export function TooltipContent({
  children,
  className,
  side,
  align,
}: TooltipContentProps) {
  return (
    <ShadcnTooltipContent
      className={className}
      side={side}
      align={align}
    >
      {children}
    </ShadcnTooltipContent>
  );
}

// Export all components for convenience
export const Tooltips = {
  Provider: TooltipProvider,
  Root: Tooltip,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};