import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, selectTooth, clearSelectedTeeth, selectSurface } from '../store/dentalSlice';
import { Surface, ToothStatus } from '@/types';
import { Button } from '@/components/ui/button';
import Tooth from './Tooth';
import { Eye, ArrowRight, ArrowLeft, Keyboard, Save } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToothChartProps {
  onTogglePalette: () => void;
  onNextTooth: () => void;
  onLastUsed: () => void;
  onToggleTreatmentPlan?: () => void;
}

const ToothChart = ({ onTogglePalette, onNextTooth, onLastUsed, onToggleTreatmentPlan }: ToothChartProps) => {
  const { teeth, selectedTeeth, selectedSurface, patientViewMode } = useSelector((state: RootState) => state.dental);
  const dispatch = useDispatch();
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        // Use the same handler that we're using for the click event
        onNextTooth();
      } else if (e.key === 'ArrowLeft') {
        // Select previous tooth if not at the beginning
        if (selectedTeeth.length > 0) {
          const lastSelectedTooth = selectedTeeth[selectedTeeth.length - 1];
          if (lastSelectedTooth > 1) {
            dispatch(clearSelectedTeeth());
            dispatch(selectTooth(lastSelectedTooth - 1));
          }
        }
      } else if (e.key === 'P' || e.key === 'p') {
        // Toggle procedure palette
        onTogglePalette();
      } else if (e.key === 'L' || e.key === 'l') {
        // Add last used procedure
        onLastUsed();
      } else if (e.key === 'T' || e.key === 't') {
        // Toggle treatment plan visibility
        if (onToggleTreatmentPlan) {
          onToggleTreatmentPlan();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTeeth, dispatch, onTogglePalette, onNextTooth, onLastUsed, onToggleTreatmentPlan]);
  
  // Get the tooth status message for the status bar
  const getStatusMessage = () => {
    if (selectedTeeth.length === 0) {
      return 'No tooth selected';
    } else if (selectedTeeth.length === 1) {
      return `Selected: Tooth ${selectedTeeth[0]}${selectedSurface ? ` (${selectedSurface})` : ''}`;
    } else {
      return `Selected: Teeth ${selectedTeeth.join(', ')}${selectedSurface ? ` (${selectedSurface})` : ''}`;
    }
  };
  
  // Handle tooth click - simplified to always select the tooth and set Occlusal surface
  const handleToothClick = (toothNumber: number) => {
    // Clear previous selections and select this tooth
    dispatch(clearSelectedTeeth());
    dispatch(selectTooth(toothNumber));
    // Always default to Occlusal surface
    dispatch(selectSurface(Surface.Occlusal));
  };
  
  // Handle surface selection - just change the surface of the currently selected tooth
  const handleSurfaceSelect = (toothNumber: number, surface: Surface) => {
    // Make sure this tooth is selected first
    if (!selectedTeeth.includes(toothNumber)) {
      dispatch(clearSelectedTeeth());
      dispatch(selectTooth(toothNumber));
    }
    // Set the surface
    dispatch(selectSurface(surface));
  };

  return (
    <div className="bg-white border-r h-full flex flex-col">
      <div className="flex-1 overflow-auto pt-2 px-4">
        <div className="mx-auto max-w-4xl">

        
          {/* Quadrant Labels and Teeth */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Upper Row */}
            <div>
              <div className="mb-1 text-xs font-medium text-gray-600 rounded border text-center py-1">UR</div>
              <div className="grid grid-cols-8 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((toothNumber) => (
                  <div key={toothNumber} className="flex justify-center">
                    <Tooth
                      tooth={teeth[toothNumber - 1]}
                      isSelected={selectedTeeth.includes(toothNumber)}
                      onSelect={handleToothClick}
                      onSurfaceSelect={handleSurfaceSelect}
                      selectedSurface={selectedSurface}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="mb-1 text-xs font-medium text-gray-600 rounded border text-center py-1">UL</div>
              <div className="grid grid-cols-8 gap-2">
                {[9, 10, 11, 12, 13, 14, 15, 16].map((toothNumber) => (
                  <div key={toothNumber} className="flex justify-center">
                    <Tooth
                      tooth={teeth[toothNumber - 1]}
                      isSelected={selectedTeeth.includes(toothNumber)}
                      onSelect={handleToothClick}
                      onSurfaceSelect={handleSurfaceSelect}
                      selectedSurface={selectedSurface}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Lower Row */}
            <div className="mt-6">
              <div className="grid grid-cols-8 gap-2">
                {[32, 31, 30, 29, 28, 27, 26, 25].map((toothNumber) => (
                  <div key={toothNumber} className="flex justify-center">
                    <Tooth
                      tooth={teeth[toothNumber - 1]}
                      isSelected={selectedTeeth.includes(toothNumber)}
                      onSelect={handleToothClick}
                      onSurfaceSelect={handleSurfaceSelect}
                      selectedSurface={selectedSurface}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1 text-xs font-medium text-gray-600 rounded border text-center py-1">LR</div>
            </div>
            
            <div className="mt-6">
              <div className="grid grid-cols-8 gap-2">
                {[24, 23, 22, 21, 20, 19, 18, 17].map((toothNumber) => (
                  <div key={toothNumber} className="flex justify-center">
                    <Tooth
                      tooth={teeth[toothNumber - 1]}
                      isSelected={selectedTeeth.includes(toothNumber)}
                      onSelect={handleToothClick}
                      onSurfaceSelect={handleSurfaceSelect}
                      selectedSurface={selectedSurface}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1 text-xs font-medium text-gray-600 rounded border text-center py-1">LL</div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-5 gap-2 text-xs border rounded p-2 mb-4 bg-gray-50">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-white border border-gray-300 mr-1"></div>
              <span>Healthy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border-2 border-red-600 mr-1"></div>
              <span>Caries</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-700 mr-1"></div>
              <span>Existing</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border-2 border-green-600 mr-1"></div>
              <span>Planned</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 mr-1"></div>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t bg-gray-50 px-4 py-2 flex justify-between items-center text-xs text-gray-600">
        <div>
          {getStatusMessage()}
        </div>
        <div className="flex items-center space-x-3">          
          {/* Keyboard shortcuts - now clickable */}
          <div 
            className="flex items-center hover:bg-gray-200 px-1.5 py-1 rounded cursor-pointer transition-colors"
            onClick={onTogglePalette}
          >
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono mr-1">P</kbd>
            <span>Toggle Palette</span>
          </div>
          <div 
            className="flex items-center hover:bg-gray-200 px-1.5 py-1 rounded cursor-pointer transition-colors"
            onClick={onNextTooth}
          >
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono mr-1">→</kbd>
            <span>Next Tooth</span>
          </div>
          <div 
            className="flex items-center hover:bg-gray-200 px-1.5 py-1 rounded cursor-pointer transition-colors"
            onClick={onLastUsed}
          >
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono mr-1">L</kbd>
            <span>Last Used</span>
          </div>
          {onToggleTreatmentPlan && (
            <div 
              className="flex items-center hover:bg-gray-200 px-1.5 py-1 rounded cursor-pointer transition-colors"
              onClick={onToggleTreatmentPlan}
            >
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono mr-1">T</kbd>
              <span>Toggle Plan</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToothChart;
