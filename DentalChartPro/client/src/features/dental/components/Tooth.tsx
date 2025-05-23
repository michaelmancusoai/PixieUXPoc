import { Surface, Tooth as ToothType, ToothStatus } from '@/types';
import { Box } from '@mui/material';
import ToothSVG from './ToothSVG';
import { useSelector } from 'react-redux';
import { RootState } from '../store/dentalSlice';

interface ToothProps {
  tooth: ToothType;
  isSelected: boolean;
  onSelect: (toothNumber: number) => void;
  onSurfaceSelect: (toothNumber: number, surface: Surface) => void;
  selectedSurface: Surface | null;
}

const ToothComponent = ({ tooth, isSelected, onSelect, onSurfaceSelect, selectedSurface }: ToothProps) => {
  const { patientViewMode } = useSelector((state: RootState) => state.dental);
  
  // Detect overall tooth status for display
  const determineToothStatus = (): ToothStatus => {
    // If any surface has caries, show as caries
    if (tooth.surfaces.some(s => s.status === ToothStatus.Caries)) {
      return ToothStatus.Caries;
    }
    // If any surface is planned, show as planned
    if (tooth.surfaces.some(s => s.status === ToothStatus.Planned)) {
      return ToothStatus.Planned;
    }
    // If any surface has existing restoration, show as existing
    if (tooth.surfaces.some(s => s.status === ToothStatus.ExistingRestoration)) {
      return ToothStatus.ExistingRestoration;
    }
    // If any surface is completed, show as completed
    if (tooth.surfaces.some(s => s.status === ToothStatus.Completed)) {
      return ToothStatus.Completed;
    }
    // Default to healthy
    return ToothStatus.Healthy;
  };

  // Simple direct click handler - just select this tooth
  const handleClick = () => {
    onSelect(tooth.number);
  };

  const status = determineToothStatus();

  // Determine if we should use white text for the tooth number
  // White text is used when tooth has a solid fill color (blue, green)
  const useWhiteText = isSelected && (
    status === ToothStatus.ExistingRestoration || 
    status === ToothStatus.Completed
  );

  return (
    <div className="flex flex-col items-center">
      <div className={`text-xs mb-1 ${useWhiteText ? 'text-white font-medium' : 'text-gray-500'}`}>
        {tooth.number}
      </div>
      <div 
        className={`relative ${isSelected ? 'scale-110' : ''} transition-transform`}
        onClick={handleClick}
      >
        <ToothSVG 
          number={tooth.number}
          status={status}
          isSelected={isSelected}
          size={patientViewMode ? 'lg' : 'md'}
        />
        
        {isSelected && selectedSurface && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-xs font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-sm shadow-sm">
              {selectedSurface}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToothComponent;