import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

/**
 * ActionButton - A button with an icon and optional label/tooltip
 * Used for action buttons in various components
 */
export default function ActionButton({
  icon,
  label,
  tooltip,
  onClick,
  className,
  variant = "ghost",
}: ActionButtonProps) {
  const button = (
    <Button
      variant={variant}
      size={label ? "sm" : "icon"}
      className={cn(
        "h-7 w-7",
        label && "h-8 w-auto px-2",
        className
      )}
      onClick={onClick}
    >
      <span className={cn("flex items-center", label && "gap-1.5")}>
        {icon}
        {label && <span className="text-xs">{label}</span>}
      </span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}