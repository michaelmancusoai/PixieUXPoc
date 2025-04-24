import { Surface, ToothStatus } from '@/types/dental';
import { Box, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ToothSurfaceProps {
  surface: Surface;
  status: ToothStatus;
  isSelected: boolean;
  onClick: () => void;
}

// Map from ToothStatus to colors
const getStatusColor = (status: ToothStatus, theme: any): string => {
  switch (status) {
    case ToothStatus.Caries:
      return theme.palette.error.main;
    case ToothStatus.ExistingRestoration:
      return '#1565c0'; // Blue
    case ToothStatus.Planned:
      return '#ffb74d'; // Amber
    case ToothStatus.Completed:
      return '#2e7d32'; // Green
    case ToothStatus.Healthy:
    default:
      return 'transparent';
  }
};

// Map surface to position in the grid
const getSurfaceGridPosition = (surface: Surface): { gridArea: string } => {
  switch (surface) {
    case Surface.Occlusal:
      return { gridArea: '2 / 2 / 3 / 3' };
    case Surface.Mesial:
      return { gridArea: '2 / 1 / 3 / 2' };
    case Surface.Distal:
      return { gridArea: '2 / 3 / 3 / 4' };
    case Surface.Buccal:
      return { gridArea: '1 / 2 / 2 / 3' };
    case Surface.Lingual:
      return { gridArea: '3 / 2 / 4 / 3' };
    default:
      return { gridArea: '2 / 2 / 3 / 3' };
  }
};

// Map ToothStatus to a human-readable description
const getStatusDescription = (status: ToothStatus): string => {
  switch (status) {
    case ToothStatus.Caries:
      return 'Caries';
    case ToothStatus.ExistingRestoration:
      return 'Existing Restoration';
    case ToothStatus.Planned:
      return 'Planned Treatment';
    case ToothStatus.Completed:
      return 'Completed Treatment';
    case ToothStatus.Healthy:
    default:
      return 'Healthy';
  }
};

const ToothSurface = ({ surface, status, isSelected, onClick }: ToothSurfaceProps) => {
  const theme = useTheme();
  const position = getSurfaceGridPosition(surface);
  const backgroundColor = getStatusColor(status, theme);
  const hasStatus = status !== ToothStatus.Healthy;
  
  const handleClick = () => {
    onClick();
  };
  
  return (
    <Tooltip title={`${surface}: ${getStatusDescription(status)}`} arrow>
      <Box
        sx={{
          ...position,
          width: '100%',
          height: '100%',
          backgroundColor,
          border: '1px solid #ccc',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            opacity: 0.8,
          },
          outline: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
          // If the status is healthy, we still want to see the border of the surface
          ...(hasStatus ? {
            borderColor: backgroundColor,
          } : {})
        }}
        onClick={handleClick}
        role="button"
        aria-label={`Surface ${surface} - ${getStatusDescription(status)}`}
      />
    </Tooltip>
  );
};

export default ToothSurface;