import React from "react";

interface ToothDiagramProps {
  highlightedTooth?: number;
}

// Simple tooth diagram component
const ToothDiagram: React.FC<ToothDiagramProps> = ({ highlightedTooth }) => {
  // Adult teeth numbering (Universal Numbering System)
  const adultTeeth = [
    // Upper right (1-8)
    1, 2, 3, 4, 5, 6, 7, 8,
    // Upper left (9-16)
    9, 10, 11, 12, 13, 14, 15, 16,
    // Lower left (17-24)
    17, 18, 19, 20, 21, 22, 23, 24,
    // Lower right (25-32)
    25, 26, 27, 28, 29, 30, 31, 32
  ];

  return (
    <div className="mx-auto text-center">
      <div className="tooth-diagram">
        {/* Upper row (teeth 1-16) */}
        <div className="flex justify-center mb-1">
          {adultTeeth.slice(0, 16).map(toothNumber => (
            <div
              key={toothNumber}
              className={`
                w-5 h-5 text-xs border border-gray-300 rounded-sm flex items-center justify-center mx-0.5
                ${highlightedTooth === toothNumber ? 'bg-blue-100 border-blue-500 font-bold' : 'bg-white'}
              `}
              title={`Tooth #${toothNumber}`}
            >
              {toothNumber}
            </div>
          ))}
        </div>
        
        {/* Lower row (teeth 17-32, displayed in reverse for visual accuracy) */}
        <div className="flex justify-center">
          {adultTeeth.slice(16).reverse().map(toothNumber => (
            <div
              key={toothNumber}
              className={`
                w-5 h-5 text-xs border border-gray-300 rounded-sm flex items-center justify-center mx-0.5
                ${highlightedTooth === toothNumber ? 'bg-blue-100 border-blue-500 font-bold' : 'bg-white'}
              `}
              title={`Tooth #${toothNumber}`}
            >
              {toothNumber}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToothDiagram;