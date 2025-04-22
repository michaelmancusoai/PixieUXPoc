import React from "react";
import { cn } from "@/lib/utils";

interface ToothDiagramProps {
  selectedTeeth?: number[];
  onToothClick?: (toothNumber: number) => void;
  className?: string;
  readOnly?: boolean;
}

/**
 * ToothDiagramViewer - A component for displaying and interacting with a dental tooth diagram
 * Used for viewing and selecting teeth for procedures, treatments, etc.
 */
export default function ToothDiagramViewer({
  selectedTeeth = [],
  onToothClick,
  className,
  readOnly = false,
}: ToothDiagramProps) {
  // Tooth numbers following standard dental notation
  // Universal Numbering System (1-32 for adult teeth)
  const topTeeth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const bottomTeeth = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];
  
  const handleToothClick = (toothNumber: number) => {
    if (!readOnly && onToothClick) {
      onToothClick(toothNumber);
    }
  };
  
  const renderTooth = (toothNumber: number) => {
    const isSelected = selectedTeeth.includes(toothNumber);
    
    return (
      <div 
        key={toothNumber}
        className={cn(
          "flex flex-col items-center",
          !readOnly && "cursor-pointer"
        )}
        onClick={() => handleToothClick(toothNumber)}
      >
        <div 
          className={cn(
            "w-8 h-10 border border-gray-300 rounded flex items-center justify-center",
            isSelected && "bg-blue-100 border-blue-500",
            !readOnly && "hover:bg-gray-100"
          )}
        >
          <span className="text-xs">{toothNumber}</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className={cn("max-w-lg mx-auto", className)}>
      {/* Top teeth row */}
      <div className="flex justify-center gap-1 mb-6">
        {topTeeth.map(renderTooth)}
      </div>
      
      {/* Bottom teeth row */}
      <div className="flex justify-center gap-1">
        {bottomTeeth.map(renderTooth)}
      </div>
    </div>
  );
}