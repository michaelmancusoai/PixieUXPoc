import { Surface } from '@/types';
import { Button } from '@/components/ui/button';

interface ToothChartSurfaceProps {
  surface: Surface;
  isSelected: boolean;
  onSelect: (surface: Surface) => void;
}

const surfaceFullNames: Record<Surface, string> = {
  [Surface.Occlusal]: 'Occlusal',
  [Surface.Mesial]: 'Mesial',
  [Surface.Distal]: 'Distal',
  [Surface.Buccal]: 'Buccal',
  [Surface.Lingual]: 'Lingual',
};

const ToothChartSurface = ({ surface, isSelected, onSelect }: ToothChartSurfaceProps) => {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={`${isSelected ? 'bg-primary text-white' : 'bg-white text-gray-800'}`}
      onClick={() => onSelect(surface)}
      aria-label={`Select ${surfaceFullNames[surface]} surface`}
    >
      {surface}
    </Button>
  );
};

export default ToothChartSurface;
