import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { format } from 'date-fns';

/**
 * This file provides an example of how to convert the calendar grid
 * from shadcn/Tailwind to Material UI
 */

// Types
interface TimeSlotProps {
  time: string;
  resourceId: number;
  isOver?: boolean;
  children?: React.ReactNode;
}

// Styled components for the calendar grid
const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  position: 'relative',
  height: '100%',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const HeaderCell = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.light, 0.1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderRight: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderRight: 'none',
  },
}));

const TimeLabel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  position: 'sticky',
  left: 0,
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '60px',
}));

const TimeSlotContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOver' && prop !== 'isEvenHour',
})<{ isOver?: boolean; isEvenHour?: boolean }>(({ theme, isOver, isEvenHour }) => ({
  position: 'relative',
  borderBottom: `1px solid ${alpha(theme.palette.divider, isEvenHour ? 1 : 0.5)}`,
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: isOver 
    ? alpha(theme.palette.primary.light, 0.15) 
    : isEvenHour
      ? alpha(theme.palette.background.default, 0.4)
      : theme.palette.background.paper,
  '&:last-child': {
    borderRight: 'none',
  },
  minHeight: '20px',
  transition: 'background-color 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
}));

const CurrentTimeIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  height: '2px',
  backgroundColor: theme.palette.error.main,
  zIndex: 3,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '60px',
    top: '-4px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: theme.palette.error.main,
  },
}));

// Component implementations
function TimeSlot({ time, resourceId, isOver = false, children }: TimeSlotProps) {
  const hour = parseInt(time.split(':')[0]);
  const isEvenHour = hour % 2 === 0;
  
  return (
    <TimeSlotContainer isOver={isOver} isEvenHour={isEvenHour}>
      {children}
    </TimeSlotContainer>
  );
}

interface CalendarGridProps {
  resources: Array<{ id: number, name: string }>;
  startHour: number;
  endHour: number;
  date: Date;
  timeSlotHeight?: number;
  children?: React.ReactNode;
}

export default function CalendarGrid({
  resources,
  startHour = 8,
  endHour = 17,
  date,
  timeSlotHeight = 20,
  children
}: CalendarGridProps) {
  // Calculate the current time indicator position
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimePosition = 
    ((currentHour - startHour) * 60 + currentMinute) * (timeSlotHeight / 5);
  
  // Check if current time is within business hours
  const showCurrentTime = 
    now.toDateString() === date.toDateString() && 
    currentHour >= startHour && 
    currentHour < endHour;
  
  // Generate time slots
  const timeSlots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      timeSlots.push({
        hour,
        minute,
        label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      });
    }
  }
  
  // Calculate grid template
  const gridTemplateColumns = `60px repeat(${resources.length}, 1fr)`;
  const gridTemplateRows = `40px repeat(${timeSlots.length}, ${timeSlotHeight}px)`;
  
  return (
    <GridContainer
      sx={{
        gridTemplateColumns,
        gridTemplateRows,
      }}
    >
      {/* Empty top-left corner */}
      <Box sx={{ 
        borderRight: '1px solid',
        borderColor: 'divider',
        borderBottom: '1px solid',
        backgroundColor: 'background.paper',
        zIndex: 3,
      }} />
      
      {/* Resource headers */}
      {resources.map((resource) => (
        <HeaderCell key={resource.id}>
          <Typography variant="subtitle2" noWrap>
            {resource.name}
          </Typography>
        </HeaderCell>
      ))}
      
      {/* Time labels and slots */}
      {timeSlots.map((slot, index) => {
        // Only show hour labels
        const showLabel = slot.minute === 0;
        
        return (
          <React.Fragment key={slot.label}>
            {/* Time label */}
            <TimeLabel>
              {showLabel && (
                <Typography variant="caption" sx={{ fontWeight: slot.hour % 2 === 0 ? 500 : 400 }}>
                  {format(new Date().setHours(slot.hour, slot.minute), 'h a')}
                </Typography>
              )}
            </TimeLabel>
            
            {/* Time slots for each resource */}
            {resources.map((resource) => (
              <TimeSlot
                key={`${resource.id}-${slot.label}`}
                time={slot.label}
                resourceId={resource.id}
              />
            ))}
          </React.Fragment>
        );
      })}
      
      {/* Current time indicator */}
      {showCurrentTime && (
        <CurrentTimeIndicator
          sx={{
            top: `calc(40px + ${currentTimePosition}px)`,
          }}
        />
      )}
      
      {/* Render appointment components or other children */}
      {children}
    </GridContainer>
  );
}