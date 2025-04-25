import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, User, MapPin, MoreVertical, UserCheck, Play, CheckCircle } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AppointmentWithDetails, CountdownTimer } from '@/lib/scheduling-utils';

interface AppointmentChipProps {
  appointment: AppointmentWithDetails & { timeStatus?: string };
  style?: React.CSSProperties;
  className?: string;
}

export default function AppointmentChip({ appointment, style = {}, className = '' }: AppointmentChipProps) {
  // Setup draggable
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `appointment-${appointment.id}`,
    data: appointment,
  });
  
  // Determine status display
  const getStatusDisplay = () => {
    const status = appointment.status?.toLowerCase() || 'scheduled';
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'checked_in': return 'Checked In';
      case 'in_chair': return 'In Chair';
      case 'completed': return 'Completed';
      case 'no_show': return 'No Show';
      default: return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }
  };
  
  // Determine border color based on status
  const getStatusBorderColor = () => {
    const status = appointment.status?.toLowerCase() || 'scheduled';
    switch (status) {
      case 'confirmed': return '#3b82f6'; // Blue
      case 'checked_in': return '#10b981'; // Green
      case 'in_chair': return '#ef4444'; // Red
      case 'completed': return '#6b7280'; // Gray
      case 'no_show': return '#f59e0b'; // Amber
      default: return '#3b82f6'; // Default blue
    }
  };
  
  // Get formatted time display
  const getTimeDisplay = () => {
    if (typeof appointment.startTime !== 'string') return '';
    
    const [hours, minutes] = appointment.startTime.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return '';
    
    return format(new Date().setHours(hours, minutes), 'HH:mm');
  };
  
  // Combined style for hover card trigger
  const chipStyles: React.CSSProperties = {
    cursor: 'grab',
    backgroundColor: 'white',
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'relative',
    borderLeft: `3px solid ${getStatusBorderColor()}`,
    ...(isDragging ? { opacity: 0.5 } : {}),
    ...style,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={chipStyles}
      className={className}
      {...listeners} 
      {...attributes}
    >
      <div className="h-full p-1 flex flex-col">
        {/* Status indicator tag at the top */}
        <div className="text-[10px] font-medium mb-1">
          {getStatusDisplay()}
        </div>
        
        {/* Patient name */}
        <div className="font-medium text-[11px] mb-1 flex justify-between items-baseline">
          <span className="truncate">{appointment.patient.firstName} {appointment.patient.lastName}</span>
          
          {/* Time display with clock icon for "In Chair" status */}
          {appointment.status?.toLowerCase() === 'in_chair' && (
            <div className="flex items-center text-[10px] whitespace-nowrap">
              <Clock className="h-3 w-3 mr-0.5 text-gray-500" />
              {getTimeDisplay()}
            </div>
          )}
        </div>
        
        {/* Duration badge */}
        <div className="text-[9px] bg-gray-100 rounded px-1.5 py-0.5 inline-flex items-center self-start mb-1">
          <Clock className="h-2.5 w-2.5 mr-0.5 text-gray-500" />
          <span>{appointment.duration}m</span>
        </div>
        
        {/* Procedure */}
        <div className="text-[9px] text-gray-700 truncate flex-grow">
          {appointment.procedure}
        </div>
        
        {/* Doctor name */}
        <div className="text-[9px] text-gray-500 mt-1">
          {appointment.provider?.name || 'Dr. Unknown'}
        </div>
      </div>
    </div>
  );
}