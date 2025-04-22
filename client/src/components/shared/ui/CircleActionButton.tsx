import React from "react";
import { cn } from "@/lib/utils";

interface CircleActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

/**
 * CircleActionButton - Reusable circular action button with icon and label
 */
export default function CircleActionButton({
  icon,
  label,
  onClick,
  className,
}: CircleActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn("flex flex-col items-center gap-1", className)}
    >
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
        {icon}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </button>
  );
}