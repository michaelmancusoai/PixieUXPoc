import React from "react";

type ToothDiagramProps = {
  highlightedTooth?: number;
};

export default function ToothDiagram({ highlightedTooth }: ToothDiagramProps) {
  // Upper teeth (1-16)
  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
  
  // Lower teeth (32-17)
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => 32 - i);
  
  return (
    <div className="text-center p-2">
      <div className="text-xs text-muted-foreground mb-1">Upper</div>
      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        {upperTeeth.map((tooth) => (
          <div 
            key={`upper-${tooth}`}
            className={`w-5 h-5 border rounded text-xs flex items-center justify-center 
              ${highlightedTooth === tooth ? 'bg-primary text-white font-bold border-primary rounded-xl' : 'text-muted-foreground'}`}
          >
            {tooth}
          </div>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground mb-1">Lower</div>
      <div className="flex justify-center gap-1 flex-wrap">
        {lowerTeeth.map((tooth) => (
          <div 
            key={`lower-${tooth}`}
            className={`w-5 h-5 border rounded text-xs flex items-center justify-center 
              ${highlightedTooth === tooth ? 'bg-primary text-white font-bold border-primary rounded-xl' : 'text-muted-foreground'}`}
          >
            {tooth}
          </div>
        ))}
      </div>
    </div>
  );
}
