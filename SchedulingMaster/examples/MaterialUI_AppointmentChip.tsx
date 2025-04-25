import React, { useState, useEffect, CSSProperties } from "react";
import { AppointmentWithDetails, AppointmentStatus } from "../shared/schema";
import { useDraggable } from "@dnd-kit/core";
import { format, parseISO, differenceInMinutes, differenceInSeconds } from "date-fns";

// Material UI imports
import { 
  Paper, 
  Typography, 
  Box, 
  Chip,
  Tooltip, 
  Menu,
  MenuItem,
  IconButton,
  styled,
  alpha
} from "@mui/material";
import {
  Alert as AlertIcon,
  Timer as TimerIcon,
  EditNote as PencilIcon,
  ArrowRight as ArrowRightIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

// Interfaces
interface AppointmentChipProps {
  appointment: AppointmentWithDetails;
  style?: CSSProperties;
  onStatusChange?: (id: number, status: string) => void;
  userRole?: "front_desk" | "assistant" | "provider" | "billing";
}

// Styled components
const StatusContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusType'
})<{ statusType: string }>(({ theme, statusType }) => {
  // Define color mappings
  const colors: Record<string, { bg: string, border: string }> = {
    SCHEDULED: { 
      bg: alpha(theme.palette.primary.light, 0.3), 
      border: theme.palette.primary.main 
    },
    CONFIRMED: { 
      bg: alpha(theme.palette.primary.main, 0.2), 
      border: theme.palette.primary.dark 
    },
    CHECKED_IN: { 
      bg: alpha(theme.palette.success.light, 0.3), 
      border: theme.palette.success.main 
    },
    SEATED: { 
      bg: alpha(theme.palette.info.light, 0.3), 
      border: theme.palette.info.main 
    },
    IN_CHAIR: { 
      bg: alpha(theme.palette.info.main, 0.2), 
      border: theme.palette.info.dark 
    },
    COMPLETED: { 
      bg: alpha(theme.palette.grey[300], 0.5), 
      border: theme.palette.grey[500] 
    },
    LATE: { 
      bg: alpha(theme.palette.warning.light, 0.3), 
      border: theme.palette.warning.main 
    },
    NO_SHOW: { 
      bg: alpha(theme.palette.error.light, 0.3), 
      border: theme.palette.error.main 
    },
    CANCELLED: { 
      bg: alpha(theme.palette.grey[300], 0.5), 
      border: theme.palette.grey[400] 
    },
  };

  // Get colors or use default
  const colorSet = colors[statusType] || { 
    bg: alpha(theme.palette.grey[100], 0.5), 
    border: theme.palette.grey[300]
  };

  return {
    backgroundColor: colorSet.bg,
    border: `1px solid ${alpha(colorSet.border, 0.5)}`,
    borderLeft: `5px solid ${colorSet.border}`,
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: theme.shape.borderRadius,
    zIndex: 4,
  };
});

const ContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  zIndex: 5,
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}));

const StatusChip = styled(Chip)<{ statustype: string }>(({ theme, statustype }) => {
  // Define color mappings for status chips
  const colors: Record<string, { bg: string, color: string }> = {
    CHAIR: { bg: alpha(theme.palette.info.light, 0.3), color: theme.palette.info.dark },
    CHECKED_IN: { bg: alpha(theme.palette.success.light, 0.3), color: theme.palette.success.dark },
    READY: { bg: alpha(theme.palette.success.light, 0.3), color: theme.palette.success.dark },
    COMPLETED: { bg: alpha(theme.palette.grey[200], 0.8), color: theme.palette.grey[700] },
    LATE: { bg: alpha(theme.palette.warning.light, 0.3), color: theme.palette.warning.dark },
    NO_SHOW: { bg: alpha(theme.palette.error.light, 0.3), color: theme.palette.error.dark },
  };

  // Find matching status type
  const matchedType = Object.keys(colors).find(type => statustype.includes(type));
  const colorSet = matchedType ? colors[matchedType] : { 
    bg: alpha(theme.palette.grey[200], 0.8), 
    color: theme.palette.grey[700] 
  };

  return {
    backgroundColor: colorSet.bg,
    color: colorSet.color,
    fontSize: '0.625rem',
    height: 20,
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };
});

const DurationChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.grey[200], 0.8),
  color: theme.palette.grey[700],
  fontSize: '0.625rem',
  height: 18,
  '& .MuiChip-label': {
    padding: '0 6px',
  },
}));

const TimerChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.light, 0.3),
  color: theme.palette.primary.dark,
  fontSize: '0.625rem',
  height: 18,
  '& .MuiChip-label': {
    padding: '0 6px',
    fontFamily: 'monospace',
  },
}));

// Main component
export default function AppointmentChip({ 
  appointment, 
  style, 
  onStatusChange = () => {}, 
  userRole = "assistant" 
}: AppointmentChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: appointment.id,
  });
  
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  // Determine if we should use compact view based on appointment height
  useEffect(() => {
    if (style && typeof style.height === 'string') {
      const heightValue = parseInt(style.height.replace('px', ''), 10);
      setIsCompactView(heightValue < 70);
    }
  }, [style]);
  
  const { patient, provider } = appointment;
  
  // Format appointment info
  const durationInMinutes = appointment.duration || 30;
  
  // Format duration text
  const durationText = durationInMinutes >= 60 
    ? `${Math.floor(durationInMinutes/60)}h${durationInMinutes % 60 ? ` ${durationInMinutes % 60}m` : ''}`
    : `${durationInMinutes}m`;
  
  // Check for alert conditions
  const hasAllergy = patient?.allergies && patient.allergies.length > 0;
  
  // Status information
  const statusText = appointment.status || AppointmentStatus.SCHEDULED;
  
  // Timer display for visualization (simplified from original)
  const timerDisplay = (() => {
    const [hours] = appointment.startTime.split(':').map(Number);
    if (hours < 12) return null;
    if (hours === 12) return "24:31";
    if (hours === 13) return "13:47";
    if (hours === 14) return "7:12";
    if (hours === 15) return "4:05";
    return null;
  })();
  
  // Actions available for this appointment
  const quickActions = [
    { label: "Check-In", nextStatus: AppointmentStatus.CHECKED_IN },
    { label: "Seat Patient", nextStatus: AppointmentStatus.SEATED },
    { label: "Start Treatment", nextStatus: AppointmentStatus.IN_CHAIR },
  ];
  
  // Determine if drag is allowed
  const isDraggable = [
    AppointmentStatus.SCHEDULED, 
    AppointmentStatus.CONFIRMED, 
    AppointmentStatus.CHECKED_IN
  ].includes(statusText as any);
  
  // Handle status change from quick actions
  const handleStatusChange = (newStatus: string) => {
    onStatusChange(appointment.id, newStatus);
    setMenuAnchorEl(null);
  };
  
  // Handle double-click to open patient chart
  const handleDoubleClick = () => {
    console.log('Opening patient chart:', patient?.firstName, patient?.lastName);
  };

  // Calculate minimum height
  const minHeight = durationInMinutes < 15 ? 100 : undefined;

  // Format status text for display
  const formattedStatusText = statusText.replace(/_/g, ' ').replace(/(\w+)/g, (word) => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  // Menu handlers
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Tooltip
      title={
        <Paper elevation={6} sx={{ 
          p: 2, 
          maxWidth: 300, 
          border: '1px solid',
          borderColor: 'grey.100',
          borderLeft: `4px solid ${
            statusText.includes("CHAIR") ? "#3b82f6" :
            statusText.includes("CHECKED_IN") ? "#22c55e" :
            statusText.includes("READY") ? "#14b8a6" :
            statusText.includes("LATE") ? "#f59e0b" :
            statusText.includes("NO_SHOW") ? "#ef4444" :
            "#9ca3af"
          }`
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Typography variant="subtitle2">{patient?.firstName} {patient?.lastName}</Typography>
            {timerDisplay && (
              <Chip
                label={timerDisplay}
                size="small"
                sx={{ 
                  height: 20, 
                  fontSize: '0.7rem',
                  backgroundColor: 'grey.100'
                }}
              />
            )}
          </Box>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary', pt: 1 }}>
            {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {appointment.startTime} - {durationText} - {formattedStatusText}
          </Typography>
          {appointment.procedure && (
            <Typography variant="caption" display="block" sx={{ mt: 1, fontWeight: 'bold' }}>
              {appointment.procedure}
            </Typography>
          )}
        </Paper>
      }
      open={isTooltipOpen}
      onOpen={() => setIsTooltipOpen(true)}
      onClose={() => setIsTooltipOpen(false)}
      placement="right"
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            backgroundColor: 'transparent',
            padding: 0,
            boxShadow: 'none'
          }
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          minHeight,
          overflow: 'visible',
          ...style,
        }}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        onDoubleClick={handleDoubleClick}
      >
        {/* Status background */}
        <StatusContainer statusType={statusText} />
        
        {/* Content */}
        <ContentContainer
          ref={setNodeRef}
          {...(isDraggable ? { ...listeners, ...attributes } : {})}
          sx={{
            cursor: isDraggable ? 'grab' : 'default',
            transform: transform && isDraggable ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            opacity: isDragging ? 0.7 : 1,
            zIndex: isDragging ? 100 : 5,
          }}
        >
          {/* Patient name */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: isCompactView ? '0.7rem' : '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '70%',
              }}
            >
              {patient?.firstName} {patient?.lastName}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>
              Op {appointment.operatoryId || '?'}
            </Typography>
          </Box>
          
          {/* Status and duration */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <StatusChip
              label={formattedStatusText}
              size="small"
              statustype={statusText}
            />
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {timerDisplay && (
                <TimerChip
                  icon={<TimerIcon sx={{ fontSize: '0.7rem' }} />}
                  label={timerDisplay}
                  size="small"
                />
              )}
              <DurationChip label={durationText} size="small" />
            </Box>
          </Box>
          
          {/* Procedure and provider */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.625rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '55%',
              }}
            >
              {appointment.procedure || ''}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.625rem',
                fontWeight: 500,
                display: 'flex',
              }}
            >
              Dr. {provider?.name || 'Unassigned'}
            </Typography>
          </Box>
          
          {/* Actions menu handler */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
            }}
            onClick={handleOpenMenu}
          />
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleCloseMenu}
          >
            {quickActions.map((action) => (
              <MenuItem
                key={action.label}
                onClick={() => handleStatusChange(action.nextStatus)}
                dense
              >
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </ContentContainer>
      </Box>
    </Tooltip>
  );
}