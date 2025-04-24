import React from 'react';
import { ToothStatus } from '@/types';

export interface ToothSVGProps {
  number: number;
  status?: ToothStatus;
  onClick?: () => void;
  isSelected?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SVG representation of a tooth with proper anatomical shape
 */
const ToothSVG: React.FC<ToothSVGProps> = ({ 
  number, 
  status = ToothStatus.Healthy, 
  onClick,
  isSelected = false,
  size = 'md'
}) => {
  // Determine if the tooth is a molar, premolar, canine, or incisor
  const getToothType = (num: number) => {
    // Upper teeth
    if (num >= 1 && num <= 16) {
      if (num === 1 || num === 2 || num === 15 || num === 16) return 'molar';
      if (num === 3 || num === 14) return 'molar'; // Third molars
      if (num === 4 || num === 5 || num === 12 || num === 13) return 'premolar';
      if (num === 6 || num === 11) return 'canine';
      return 'incisor';
    } 
    // Lower teeth
    else {
      if (num === 17 || num === 18 || num === 31 || num === 32) return 'molar';
      if (num === 19 || num === 30) return 'molar'; // Third molars
      if (num === 20 || num === 21 || num === 28 || num === 29) return 'premolar';
      if (num === 22 || num === 27) return 'canine';
      return 'incisor';
    }
  };

  const toothType = getToothType(number);
  
  // Determine the size dimensions
  const dimensions = {
    sm: { width: 30, height: 40 },
    md: { width: 40, height: 50 },
    lg: { width: 50, height: 60 }
  };
  
  const { width, height } = dimensions[size];
  
  // Get fill color based on status
  const getFill = () => {
    switch(status) {
      case ToothStatus.Caries:
        return 'white';
      case ToothStatus.ExistingRestoration:
        return '#1565c0'; // Blue
      case ToothStatus.Planned:
        return 'white';
      case ToothStatus.Completed:
        return '#2e7d32'; // Green
      case ToothStatus.Healthy:
      default:
        return '#F8F8EE'; // Off-white ivory color
    }
  };
  
  // Get stroke/outline based on status
  const getStroke = () => {
    switch(status) {
      case ToothStatus.Caries:
        return '#d32f2f'; // Red
      case ToothStatus.Planned:
        return '#2e7d32'; // Green
      case ToothStatus.Completed:
        return '#2e7d32'; // Green
      default:
        return '#ccc'; // Gray
    }
  };
  
  const getStrokeWidth = () => {
    switch(status) {
      case ToothStatus.Caries:
      case ToothStatus.Planned:
        return 2;
      default:
        return 1;
    }
  };
  
  // Define SVG paths for different tooth types
  const getToothPath = () => {
    switch(toothType) {
      case 'molar':
        return "M8,5 C8,2 12,0 20,0 C28,0 32,2 32,5 C32,10 30,15 32,25 C32,35 25,40 20,40 C15,40 8,35 8,25 C10,15 8,10 8,5 Z";
      case 'premolar':
        return "M10,5 C10,2 15,0 20,0 C25,0 30,2 30,5 C30,10 28,15 30,25 C30,35 25,40 20,40 C15,40 10,35 10,25 C12,15 10,10 10,5 Z";
      case 'canine':
        return "M12,5 C12,2 15,0 20,0 C25,0 28,2 28,5 C28,10 25,15 25,25 C25,35 22,40 20,40 C18,40 15,35 15,25 C15,15 12,10 12,5 Z";
      case 'incisor':
      default:
        return "M14,5 C14,2 17,0 20,0 C23,0 26,2 26,5 C26,10 24,15 24,25 C24,35 22,40 20,40 C18,40 16,35 16,25 C16,15 14,10 14,5 Z";
    }
  };

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 40 40" 
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'scale-105' : ''}`}
      role="img"
      aria-label={`Tooth ${number}`}
    >
      <path
        d={getToothPath()}
        fill={getFill()}
        stroke={isSelected ? '#3b82f6' : getStroke()}
        strokeWidth={isSelected ? 2 : getStrokeWidth()}
        strokeLinejoin="round"
      />
      {/* Tooth number */}
      <text
        x="20"
        y="20"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#666"
      >
        {number}
      </text>
    </svg>
  );
};

export default ToothSVG;