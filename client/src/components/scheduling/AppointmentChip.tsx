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
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AppointmentWithDetails, CountdownTimer, getAppointmentTiming } from '@/lib/scheduling-utils';

interface AppointmentChipProps {
  appointment: AppointmentWithDetails & { timeStatus?: string };
  isFullHeight?: boolean;
  onStatusChange?: (id: number, status: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function AppointmentChip({
  appointment,
  isFullHeight = false,
  onStatusChange,
  style = {},
  className = '',
}: AppointmentChipProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Parse appointment date
  const appointmentDate = appointment.date instanceof Date 
    ? appointment.date 
    : new Date(appointment.date);
  
  // Format the date for display
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');
  
  // Parse and format time
  let formattedTime = 'Unknown time';
  let appointmentDateTime = new Date(appointmentDate);
  
  if (typeof appointment.startTime === 'string') {
    const timeParts = appointment.startTime.split(':');
    if (timeParts.length >= 2) {
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      
      if (!isNaN(hours) && !isNaN(minutes)) {
        appointmentDateTime.setHours(hours, minutes, 0);
        formattedTime = format(appointmentDateTime, 'h:mm a');
      }
    }
  }
  
  // Format duration
  const durationMin = appointment.duration;
  const durationHrs = Math.floor(durationMin / 60);
  const remainingMins = durationMin % 60;
  const durationDisplay = durationHrs > 0 
    ? `${durationHrs}h ${remainingMins > 0 ? remainingMins + 'm' : ''}`
    : `${durationMin}m`;
  
  // Setup draggable
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `appointment-${appointment.id}`,
    data: appointment,
  });
  
  // Determine status display
  const getStatusDisplay = () => {
    const status = appointment.status?.toLowerCase() || 'scheduled';
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'checked_in':
        return 'Checked In';
      case 'in_chair':
        return 'In Chair';
      case 'completed':
        return 'Completed';
      case 'no_show':
        return 'No Show';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }
  };
  
  // Determine status badge variant
  const getStatusBadgeVariant = () => {
    const status = appointment.status?.toLowerCase() || 'scheduled';
    switch (status) {
      case 'confirmed':
        return 'secondary';
      case 'checked_in':
        return 'default'; // Using default instead of success
      case 'in_chair':
        return 'default'; // Using default instead of warning
      case 'completed':
        return 'outline';
      case 'no_show':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  // Combined style for hover card trigger
  const chipStyles: React.CSSProperties = {
    cursor: 'grab',
    backgroundColor: 'white',
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'relative',
    ...style,
  };
  
  // If dragging, add opacity
  if (isDragging) {
    chipStyles.opacity = 0.5;
  }
  
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div 
          ref={setNodeRef} 
          style={chipStyles}
          className={className}
          {...listeners} 
          {...attributes}
        >
          <div className="h-full p-0.5">
            <div className="overflow-hidden text-xs h-full flex flex-col">
              <div className="font-medium truncate flex justify-between items-center text-[10px]">
                <span className="text-gray-900">{appointment.patient.firstName} {appointment.patient.lastName}</span>
                {appointment.patient.balanceDue && appointment.patient.balanceDue > 0 && (
                  <span className="text-[8px] font-bold text-red-600 whitespace-nowrap">
                    ${(appointment.patient.balanceDue / 100).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-[9px] text-gray-500 flex items-center">
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" 
                  style={{ backgroundColor: appointment.provider?.color || '#ccc' }}></span>
                {getAppointmentTiming(appointment)}
              </div>
              <div className="text-[9px] text-gray-500 truncate flex-grow mt-0.5">
                {appointment.procedure}
              </div>
              {appointment.cdtCode && (
                <div className="text-[8px] font-mono text-gray-400 mt-auto">
                  {appointment.cdtCode}
                </div>
              )}
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      
      <HoverCardContent className="w-80 p-0" align="start">
        <Card className="border-0 shadow-lg">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                  {appointment.patient.avatarInitials && (
                    <Avatar className="h-6 w-6 ml-1">
                      <AvatarFallback className="text-[10px]">
                        {appointment.patient.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </h3>
                
                <div className="text-sm text-muted-foreground">
                  {formattedDate} • {formattedTime} • {durationDisplay}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-500" />
                    Check In
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-amber-500" />
                    Start Appointment
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Complete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="text-sm mt-3">
              <div className="font-medium">
                {appointment.procedure}
              </div>
              {appointment.cdtCode && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {appointment.cdtCode}
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              {appointment.provider && (
                <div className="flex items-start">
                  <User className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <div>{appointment.provider.name}</div>
                    <div className="text-gray-500">{appointment.provider.role}</div>
                  </div>
                </div>
              )}
              
              {appointment.operatory && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <div>Operatory {appointment.operatory.name}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div 
                  className={`text-xs px-2 py-1 rounded font-medium capitalize bg-${appointment.status === 'checked_in' ? 'green' : appointment.status === 'in_chair' ? 'yellow' : 'blue'}-100`}
                >
                  {getStatusDisplay()}
                </div>
                
                {(appointment.status === 'in_chair' || appointment.status === 'IN_CHAIR') && appointment.chairStartedAt && (
                  <div className="text-xs text-blue-600 flex items-center bg-blue-50 rounded-sm px-2 py-0.5">
                    <Clock className="h-3 w-3 mr-1 text-blue-600" />
                    <CountdownTimer expiryTime={new Date(appointment.chairStartedAt.getTime() + appointment.duration * 60 * 1000)} />
                  </div>
                )}
                {(appointment.status === 'checked_in' || appointment.status === 'CHECKED_IN') && appointment.arrivedAt && (
                  <div className="text-xs text-blue-600 flex items-center bg-blue-50 rounded-sm px-2 py-0.5">
                    <Clock className="h-3 w-3 mr-1 text-blue-600" />
                    Waiting <CountdownTimer expiryTime={new Date(new Date().getTime() + 30 * 60 * 1000)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
}