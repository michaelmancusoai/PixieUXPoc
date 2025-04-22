import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  tooltip: string;
  onClick?: () => void;
}

/**
 * ActionButton - A reusable button component with icon, label and tooltip
 */
export default function ActionButton({ icon, label, tooltip, onClick }: ActionButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center" onClick={onClick}>
            {icon}
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}