import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, User, MapPin, MoreVertical, UserCheck, Play, CheckCircle } from 'lucide-react';
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
import { getStatusColor, getStatusTextColor, PixieTheme } from '../../lib/theme';

// Define interface types directly in this file to avoid import issues
interface Patient {
  id: number;
  firstName: string;
  lastName: string;
}

interface Provider {
  id: number;
  name: string;
  role: string;
}

interface Operatory {
  id: number;
  name: string;
}

interface AppointmentWithDetails {
  id: number;
  patientId: number;
  providerId?: number;
  operatoryId?: number;
  date: string;
  startTime: string;
  duration: number;
  procedure?: string;
  status: string;
  patient: Patient;
  provider?: Provider;
  operatory?: Operatory;
}

interface AppointmentChipProps {
  appointment: AppointmentWithDetails;
  isFullHeight?: boolean;
  onStatusChange?: (id: number, status: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function AppointmentChip({
  appointment,
  isFullHeight = false,
  onStatusChange,
  className = '',
  style = {}
}: AppointmentChipProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Parse appointment date
  const appointmentDate = new Date(appointment.date);
  
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
  
  // Calculate status colors
  const statusColor = getStatusColor(appointment.status);
  const statusTextColor = getStatusTextColor(appointment.status);
  
  // Base styles for the chip
  const defaultStyles: React.CSSProperties = {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '2px',
    padding: '0.5rem 0.5rem 0.5rem 0.75rem',
    overflow: 'hidden',
    width: '100%',
    height: isFullHeight ? '100%' : 'auto',
    minHeight: '65px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out',
  };
  
  // Status-based border color
  const borderLeftColor = statusColor;
  
  // Create the merged style object, handling custom style overrides properly
  let chipStyle: React.CSSProperties = {
    ...defaultStyles
  };
  
  // Only add our border styles if not being overriden by props
  if (!style?.borderLeftColor && !style?.borderLeft) {
    chipStyle.borderLeftWidth = '4px';
    chipStyle.borderLeftStyle = 'solid';
    chipStyle.borderLeftColor = borderLeftColor;
  }
  
  // Finally merge in any custom styles
  chipStyle = {
    ...chipStyle,
    ...style
  };
  
  // Format patient name
  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName.charAt(0)}.`;
  const initials = `${appointment.patient.firstName.charAt(0)}${appointment.patient.lastName.charAt(0)}`;
  
  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(appointment.id, newStatus);
    }
  };
  
  // Status badge variant
  const getStatusBadgeVariant = () => {
    switch (appointment.status) {
      case 'SCHEDULED':
        return 'secondary';
      case 'CONFIRMED':
        return 'default'; // Changed from 'info' to 'default' as 'info' isn't in the shadcn/ui badge variants
      case 'CHECKED_IN':
        return 'default';
      case 'IN_PROGRESS':
        return 'secondary'; // Changed from 'warning' to 'secondary'
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
      case 'NO_SHOW':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  // Format status for display
  const getStatusDisplay = () => {
    switch (appointment.status) {
      case 'SCHEDULED':
        return 'Scheduled';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'CHECKED_IN':
        return 'Checked In';
      case 'IN_PROGRESS':
      case 'IN_CHAIR':
        return 'In Chair';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'NO_SHOW':
        return 'No Show';
      default:
        return appointment.status.charAt(0) + appointment.status.slice(1).toLowerCase();
    }
  };
  
  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>
        <div 
          className={`group relative ${className}`}
          style={chipStyle}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-col space-y-1">
            {/* Patient Name (First Line) */}
            <div className="font-medium text-sm">{patientName}</div>
            
            {/* Status Badge with Timer (Second Line) */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {/* Status Badge */}
                <div className="text-[0.65rem] font-medium text-gray-700 bg-gray-100 rounded-sm px-1 py-0.5">
                  {getStatusDisplay()}
                </div>
                
                {/* Timer for In Progress, In Chair or Checked In */}
                {(appointment.status === 'IN_PROGRESS' || appointment.status === 'IN_CHAIR') && (
                  <div className="text-[0.65rem] text-blue-600 flex items-center bg-blue-50 rounded-sm px-1 py-0.5">
                    <Clock className="h-3 w-3 mr-1 text-blue-600" />
                    13:47
                  </div>
                )}
                {appointment.status === 'CHECKED_IN' && (
                  <div className="text-[0.65rem] text-blue-600 flex items-center bg-blue-50 rounded-sm px-1 py-0.5">
                    <Clock className="h-3 w-3 mr-1 text-blue-600" />
                    3:21
                  </div>
                )}
              </div>
              
              {/* Duration with clock icon */}
              <div className="text-[0.65rem] text-gray-600 flex items-center bg-gray-100 rounded-sm px-1 py-0.5">
                <Clock className="h-3 w-3 mr-1 text-gray-500" />
                {durationDisplay}
              </div>
            </div>
            
            {/* Procedure and Doctor (Third Line) */}
            <div className="flex justify-between items-center">
              {/* Procedure on the left */}
              <div className="text-[0.6rem] text-gray-600 truncate max-w-[60%]">
                {appointment.procedure || "General Visit"}
              </div>
              
              {/* Doctor name always on the right */}
              <div className="text-[0.65rem] font-medium text-gray-700 truncate text-right max-w-[40%]">
                {appointment.provider ? 
                  `Dr. ${appointment.provider.name.split(' ').pop()}` : 
                  "No provider"
                }
              </div>
            </div>
            
            {/* Operatory Badge - Small Badge in top right corner */}
            {appointment.operatory && (
              <div className="absolute top-2 right-2 text-[0.65rem] font-medium text-gray-500">
                {appointment.operatory.name}
              </div>
            )}
            
            {/* Action Button and Menu */}
            {onStatusChange && (
              <>
                {/* Action Button with overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20
                  transition-all duration-100 opacity-0 group-hover:opacity-100 bg-white/60">
                  {appointment.status === 'CONFIRMED' && (
                    <Button 
                      variant="default"
                      className="px-6 shadow-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-1.5 h-9"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange('CHECKED_IN');
                      }}
                    >
                      <UserCheck className="h-4 w-4 mr-1.5" />
                      Check In
                    </Button>
                  )}
                  {appointment.status === 'CHECKED_IN' && (
                    <Button 
                      variant="default"
                      className="px-6 shadow-lg bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 h-9"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange('IN_PROGRESS');
                      }}
                    >
                      <Play className="h-4 w-4 mr-1.5" />
                      Start Exam
                    </Button>
                  )}
                  {appointment.status === 'IN_PROGRESS' && (
                    <Button 
                      variant="default"
                      className="px-6 shadow-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-1.5 h-9"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange('COMPLETED');
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      Complete
                    </Button>
                  )}
                </div>
                
                {/* Menu for all status changes */}
                <div className="absolute top-1 right-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-gray-400"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStatusChange('CONFIRMED')}>
                        Confirmed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange('CHECKED_IN')}>
                        Check In
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange('IN_PROGRESS')}>
                        Start Appointment
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange('COMPLETED')}>
                        Complete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600" 
                        onClick={() => handleStatusChange('CANCELLED')}
                      >
                        Cancel
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleStatusChange('NO_SHOW')}
                      >
                        No Show
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>
      </HoverCardTrigger>
      
      <HoverCardContent 
        className="w-72 p-0 border border-gray-200" 
        style={{ 
          borderRadius: '6px', 
          boxShadow: PixieTheme.shadows.md
        }}
      >
        <Card className="border-0 shadow-none">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10 bg-gray-100">
                <AvatarFallback className="text-gray-600">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </div>
                {appointment.procedure && (
                  <div className="text-xs text-gray-500">{appointment.procedure}</div>
                )}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <Clock className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                <div>
                  <div>{formattedDate}</div>
                  <div className="text-gray-500">
                    {formattedTime} ({durationDisplay})
                  </div>
                </div>
              </div>
              
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
                <Badge 
                  variant={getStatusBadgeVariant()} 
                  className="text-xs px-2 font-medium capitalize"
                  style={{ backgroundColor: statusColor, color: statusTextColor }}
                >
                  {getStatusDisplay()}
                </Badge>
                
                {(appointment.status === 'IN_PROGRESS' || appointment.status === 'IN_CHAIR') && (
                  <div className="text-xs text-blue-600 flex items-center bg-blue-50 rounded-sm px-2 py-0.5">
                    <Clock className="h-3 w-3 mr-1 text-blue-600" />
                    Started 23 minutes ago
                  </div>
                )}
                {appointment.status === 'CHECKED_IN' && (
                  <div className="text-xs text-blue-600 flex items-center bg-blue-50 rounded-sm px-2 py-0.5">
                    <Clock className="h-3 w-3 mr-1 text-blue-600" />
                    Waiting 3 minutes
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