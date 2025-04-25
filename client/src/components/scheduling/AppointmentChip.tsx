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
      case 'scheduled': return 'Unconfirmed';
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
      case 'confirmed': return '#3b82f6'; // Blue for confirmed
      case 'scheduled': return '#eab308'; // Yellow for unconfirmed
      case 'checked_in': return '#10b981'; // Green for checked in
      case 'in_chair': 
      case 'in_progress': return '#f97316'; // Orange for in process/in chair
      case 'completed': return '#6b7280'; // Gray for completed
      case 'no_show': return '#ef4444'; // Red for no-shows
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
  
  // Combined style for appointment card
  const chipStyles: React.CSSProperties = {
    cursor: 'grab',
    backgroundColor: 'white',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
    borderLeft: `4px solid ${getStatusBorderColor()}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
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
      <div className="h-full p-2 flex flex-col">
        {/* Top row: Patient name and Operatory */}
        <div className="font-medium text-[13px] mb-1 flex justify-between items-baseline">
          <span className="truncate max-w-[70%]">{appointment.patient.firstName} {appointment.patient.lastName}</span>
          <span className="text-gray-500 text-[11px] whitespace-nowrap">Op {appointment.operatory?.id || appointment.operatoryId || 3}</span>
        </div>
        
        {/* Middle row: Status + time in status and Duration */}
        <div className="flex justify-between items-center mb-1 w-full">
          <div className="flex items-center overflow-hidden max-w-[70%]">
            <span 
              className="text-[11px] font-medium rounded-md px-2 py-0.5 whitespace-nowrap"
              style={{ 
                backgroundColor: `${getStatusBorderColor()}20`, // 20% opacity version of the border color 
                color: getStatusBorderColor(),
                borderRadius: '4px'
              }}
            >
              {getStatusDisplay()}
            </span>
            {/* Time display with clock icon for "In Chair" or "Checked In" status */}
            {(appointment.status?.toLowerCase() === 'in_chair' || 
              appointment.status?.toLowerCase() === 'checked_in') && (
              <div className="flex items-center text-[11px] text-gray-500 ml-2 whitespace-nowrap">
                <Clock className="h-3 w-3 mr-0.5 flex-shrink-0" />
                {getTimeDisplay()}
              </div>
            )}
          </div>
          
          {/* Duration badge */}
          <div className="text-[11px] flex items-center whitespace-nowrap flex-shrink-0">
            <Clock className="h-3 w-3 mr-0.5 text-gray-500" />
            <span className="text-gray-700">{appointment.duration}m</span>
          </div>
        </div>
        
        {/* Bottom row: Procedure type and Doctor name */}
        <div className="flex justify-between items-center mt-auto w-full">
          {/* Procedure - limited width with truncation */}
          <div className="text-[11px] text-gray-700 truncate max-w-[60%] overflow-hidden">
            {appointment.procedure}
          </div>
          
          {/* Doctor name - never wraps */}
          <div className="text-[11px] text-gray-700 whitespace-nowrap flex-shrink-0">
            {appointment.provider?.name || 'Dr. Unknown'}
          </div>
        </div>
      </div>
    </div>
  );
}