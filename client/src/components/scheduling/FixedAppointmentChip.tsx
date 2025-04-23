import { CSSProperties, useState, useEffect } from "react";
import { AppointmentWithDetails, AppointmentStatus } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { format, parseISO, differenceInMinutes, differenceInSeconds } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  DollarSign,
  Clock,
  Armchair,
  Stethoscope,
  Bell,
  Timer,
  Pencil,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface AppointmentChipProps {
  appointment: AppointmentWithDetails;
  style?: CSSProperties;
  onStatusChange?: (id: number, status: string) => void;
  userRole?: "front_desk" | "assistant" | "provider" | "billing";
}

// Helper function to format time consistently regardless of format
const formatAppointmentTime = (time: any): string => {
  try {
    if (typeof time === 'string') {
      if (time.includes('T')) {
        // ISO format
        return format(parseISO(time), 'h:mm a');
      } else {
        // HH:MM:SS format
        return format(new Date(`2025-01-01T${time}`), 'h:mm a');
      }
    } else if (time instanceof Date) {
      return format(time, 'h:mm a');
    }
    return '';
  } catch (error) {
    console.error("Error formatting time:", error, time);
    return '';
  }
};

// Friendly, clear styles for appointment status
const getStatusStyles = (status: string): CSSProperties => {
  switch (status) {
    case AppointmentStatus.SCHEDULED: 
      return { 
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #94a3b8' // Neutral gray for scheduled
      };
    case AppointmentStatus.CONFIRMED:
      return { 
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #3b82f6' // Blue for confirmed
      };
    case AppointmentStatus.CHECKED_IN:
      return { 
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #10b981' // Green for checked in
      };
    case AppointmentStatus.SEATED:
    case AppointmentStatus.PRE_CLINICAL:
      return { 
        backgroundColor: 'white', // Consistent white background
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #0ea5e9' // Sky blue
      };
    case AppointmentStatus.DOCTOR_READY:
      return { 
        backgroundColor: 'white', // Consistent white background
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #059669' // Green
      };
    case AppointmentStatus.IN_CHAIR:
      return { 
        backgroundColor: 'white', // Consistent white background
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #3b82f6' // Blue
      };
    case AppointmentStatus.WRAP_UP:
      return {
        backgroundColor: 'white', // Consistent white background
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #64748b' // Gray blue
      };
    case AppointmentStatus.READY_CHECKOUT:
      return { 
        backgroundColor: 'white', // Consistent white background
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #14b8a6' // Teal
      };
    case AppointmentStatus.COMPLETED:
      return { 
        backgroundColor: 'white', // Consistent white background
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #64748b', // Gray blue
        opacity: 0.7
      };
    case AppointmentStatus.LATE:
      return { 
        backgroundColor: 'white', // Consistent white background
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #f97316' // Orange
      };
    case AppointmentStatus.NO_SHOW:
      return { 
        backgroundColor: 'white', // Consistent white background
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #ef4444', // Red
        borderStyle: 'dashed'
      };
    case AppointmentStatus.CANCELLED:
      return { 
        backgroundColor: 'white', // Consistent white background
        border: '1px solid #e2e8f0',
        borderLeft: '3px solid #94a3b8', // Gray
        opacity: 0.6
      };
    default:
      return { 
        backgroundColor: 'white',
        border: '1px solid #e2e8f0'
      };
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case AppointmentStatus.CHECKED_IN: return <Clock className="h-3 w-3" />;
    case AppointmentStatus.SEATED: return <Armchair className="h-3 w-3" />;
    case AppointmentStatus.PRE_CLINICAL: return <Stethoscope className="h-3 w-3" />;
    case AppointmentStatus.DOCTOR_READY: return <Bell className="h-3 w-3" />;
    case AppointmentStatus.IN_CHAIR: return <span className="text-xs">🦷</span>;
    case AppointmentStatus.WRAP_UP: return <Pencil className="h-3 w-3" />;
    case AppointmentStatus.READY_CHECKOUT: return <ArrowRight className="h-3 w-3 text-green-500" />;
    case AppointmentStatus.COMPLETED: return <CheckCircle className="h-3 w-3" />;
    case AppointmentStatus.LATE: return <span className="text-xs">L</span>;
    case AppointmentStatus.NO_SHOW: return <span className="text-xs">NS</span>;
    case AppointmentStatus.CANCELLED: return null;
    default: return null;
  }
};

// Get elapsed time since status change
const getElapsedTime = (appointment: AppointmentWithDetails) => {
  // Use status timestamps when available, otherwise return dummy values for demo
  try {
    const now = new Date();
    
    // If appointment is late, show how late it is
    if (appointment.status === AppointmentStatus.LATE) {
      if (appointment.startTime) {
        const appointmentTime = typeof appointment.startTime === 'string' 
          ? (appointment.startTime.includes('T') ? parseISO(appointment.startTime) : new Date(`2025-01-01T${appointment.startTime}`))
          : new Date(appointment.startTime);
        
        const minsLate = differenceInMinutes(now, appointmentTime);
        return `+${minsLate} m`;
      }
      return "+5 m"; // Default for demo
    }
    
    // For active statuses, show elapsed time
    if ([AppointmentStatus.CHECKED_IN, AppointmentStatus.SEATED, AppointmentStatus.IN_CHAIR].includes(appointment.status as any)) {
      // Use appropriate timestamp based on status
      let startTimeToUse: Date | null = null;
      
      if (appointment.status === AppointmentStatus.CHECKED_IN && appointment.arrivedAt) {
        startTimeToUse = new Date(appointment.arrivedAt);
      } else if (appointment.status === AppointmentStatus.SEATED && appointment.seatedAt) {
        startTimeToUse = new Date(appointment.seatedAt);
      } else if (appointment.status === AppointmentStatus.IN_CHAIR && appointment.chairStartedAt) {
        startTimeToUse = new Date(appointment.chairStartedAt);
      }
      
      if (startTimeToUse) {
        const totalSecs = differenceInSeconds(now, startTimeToUse);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      }
      
      return "5:23"; // Default for demo if no timestamp available
    }
    
    return null;
  } catch (error) {
    console.error("Error calculating elapsed time:", error);
    return null;
  }
};

// Get the appropriate quick actions based on status and user role
const getQuickActions = (
  status: string, 
  role: string = "assistant"
): { label: string, nextStatus: string }[] => {
  if (role === "front_desk") {
    if (status === AppointmentStatus.SCHEDULED || status === AppointmentStatus.CONFIRMED) {
      return [
        { label: "Check-In", nextStatus: AppointmentStatus.CHECKED_IN },
        { label: "Collect Balance", nextStatus: status },
        { label: "Send SMS", nextStatus: status },
        { label: "Cancel", nextStatus: AppointmentStatus.CANCELLED },
      ];
    }
  } else if (role === "assistant") {
    if (status === AppointmentStatus.CHECKED_IN) {
      return [
        { label: "Seat Patient", nextStatus: AppointmentStatus.SEATED },
        { label: "Start Vitals", nextStatus: AppointmentStatus.PRE_CLINICAL },
      ];
    } else if (status === AppointmentStatus.SEATED || status === AppointmentStatus.PRE_CLINICAL) {
      return [
        { label: "Mark Doctor Ready", nextStatus: AppointmentStatus.DOCTOR_READY },
      ];
    } else if (status === AppointmentStatus.IN_CHAIR) {
      return [
        { label: "Mark Ready for Checkout", nextStatus: AppointmentStatus.READY_CHECKOUT },
      ];
    }
  } else if (role === "provider") {
    if (status === AppointmentStatus.DOCTOR_READY) {
      return [
        { label: "Begin Treatment", nextStatus: AppointmentStatus.IN_CHAIR },
      ];
    } else if (status === AppointmentStatus.IN_CHAIR) {
      return [
        { label: "Add Note", nextStatus: AppointmentStatus.IN_CHAIR },
        { label: "Wrap-Up", nextStatus: AppointmentStatus.WRAP_UP },
      ];
    }
  } else if (role === "billing") {
    return [
      { label: "View Ledger", nextStatus: status },
      { label: "Add To AR Queue", nextStatus: status },
    ];
  }
  
  return [];
};

// Get the tooltip suffix text based on status
const getStatusTooltipSuffix = (appointment: AppointmentWithDetails) => {
  const status = appointment.status;
  
  try {
    if (status === AppointmentStatus.CHECKED_IN && appointment.arrivedAt) {
      return `Arrived @ ${format(new Date(appointment.arrivedAt), 'h:mm a')}`;
    } else if (status === AppointmentStatus.SEATED && appointment.seatedAt) {
      return `Seated @ ${format(new Date(appointment.seatedAt), 'h:mm a')}`;
    } else if (status === AppointmentStatus.IN_CHAIR && appointment.chairStartedAt) {
      return `Tx started @ ${format(new Date(appointment.chairStartedAt), 'h:mm a')}`;
    } else if (status === AppointmentStatus.COMPLETED && appointment.completedAt) {
      return `Dismissed @ ${format(new Date(appointment.completedAt), 'h:mm a')}`;
    } else if (status === AppointmentStatus.DOCTOR_READY) {
      return "Doctor is ready";
    }
  } catch (error) {
    console.error("Error getting status tooltip:", error);
  }
  
  return "";
};

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
  
  // Determine if we should use compact view based on appointment height
  useEffect(() => {
    if (style && typeof style.height === 'string') {
      const heightValue = parseInt(style.height.replace('px', ''), 10);
      setIsCompactView(heightValue < 70); // Use compact view for small appointments
    }
  }, [style]);
  
  const { patient, provider } = appointment;
  
  // Format appointment info
  const displayName = `${patient?.lastName}, ${patient?.firstName?.charAt(0) || ''}`;
  const durationInMinutes = appointment.duration || 30;
  
  // Format duration text more readably (30m, 1h, 1h 30m)
  const durationText = durationInMinutes >= 60 
    ? `${Math.floor(durationInMinutes/60)}h${durationInMinutes % 60 ? ` ${durationInMinutes % 60}m` : ''}`
    : `${durationInMinutes}m`;
  
  // Check for alert conditions
  const hasWarning = patient?.balanceDue && patient.balanceDue > 0;
  const balanceDue = hasWarning && patient?.balanceDue ? `$${(patient.balanceDue / 100).toFixed(2)} due` : '';
  const hasAllergy = patient?.allergies && patient.allergies.length > 0;
  
  // Status information
  const statusText = appointment.status || AppointmentStatus.SCHEDULED;
  const statusStyles = getStatusStyles(statusText);
  const statusIcon = getStatusIcon(statusText);
  const elapsedTime = getElapsedTime(appointment);
  const tooltipSuffix = getStatusTooltipSuffix(appointment);
  
  // Actions available for this appointment
  const quickActions = getQuickActions(statusText, userRole);
  
  // Determine if drag is allowed (only for scheduled or checked-in)
  const isDraggable = [
    AppointmentStatus.SCHEDULED, 
    AppointmentStatus.CONFIRMED, 
    AppointmentStatus.CHECKED_IN
  ].includes(statusText as any);
  
  // Handle status change from quick actions
  const handleStatusChange = (newStatus: string) => {
    onStatusChange(appointment.id, newStatus);
  };
  
  // Handle double-click to open patient chart
  const handleDoubleClick = () => {
    // Would open patient side drawer in full implementation
    console.log('Opening patient chart:', patient?.firstName, patient?.lastName);
  };

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
        <TooltipTrigger asChild>
          <div
            ref={setNodeRef}
            {...(isDraggable ? { ...listeners, ...attributes } : {})}
            className={cn(
              "flex flex-col p-1.5 rounded-sm text-xs select-none",
              "shadow-sm hover:shadow transition-all",
              "h-full",
              statusText === AppointmentStatus.DOCTOR_READY ? "doctor-ready-pulse" : "",
              isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"
            )}
            style={{
              ...statusStyles,
              ...style,
              transform: transform && isDraggable ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
              opacity: isDragging ? 0.7 : 1,
              zIndex: isDragging ? 100 : 5,
            }}
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => setIsTooltipOpen(false)}
            onDoubleClick={handleDoubleClick}
            aria-label={`Appointment ${patient?.firstName} ${patient?.lastName}, status ${statusText}${elapsedTime ? `, started ${elapsedTime}` : ''}`}
          >
            {/* Patient name at top - always shown */}
            <div className="flex justify-between items-start mb-2">
              <span className={cn("font-medium truncate", isCompactView ? "text-xs" : "text-sm")}>
                {patient?.firstName} {patient?.lastName}
              </span>
              <span className="text-[10px] text-gray-500">
                Op {appointment.operatoryId || '?'}
              </span>
            </div>
            
            {/* Status line - consistent location and format with visual styling */}
            <div className="flex items-center mb-2">
              <span className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded-sm mr-auto",
                statusText.includes("CHAIR") ? "bg-blue-50 text-blue-700" :
                statusText.includes("CHECKED_IN") ? "bg-green-50 text-green-700" :
                statusText.includes("READY") ? "bg-teal-50 text-teal-700" :
                statusText.includes("COMPLETED") ? "bg-gray-50 text-gray-700" :
                statusText.includes("LATE") ? "bg-amber-50 text-amber-700" :
                statusText.includes("NO_SHOW") ? "bg-red-50 text-red-700" :
                "bg-gray-50 text-gray-700"
              )}>
                {statusText.replace(/_/g, ' ').replace(/(\w+)/g, (word) => 
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )}
                {elapsedTime && [
                  AppointmentStatus.CHECKED_IN, 
                  AppointmentStatus.SEATED, 
                  AppointmentStatus.IN_CHAIR
                ].includes(statusText as any) && (
                  <span className="ml-1 text-[9px] opacity-80">
                    ({elapsedTime})
                  </span>
                )}
              </span>
              
              {hasAllergy && (
                <span title="Patient has allergies" className="ml-1">
                  <AlertTriangle className={cn(isCompactView ? "h-2.5 w-2.5" : "h-3 w-3", "text-amber-500")} />
                </span>
              )}
            </div>

            {isCompactView ? (
              /* Compact View - Limited Information */
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-600 truncate max-w-[65%]">
                  {appointment.procedure || ''}
                </span>
                <span className="text-[9px] bg-gray-100 px-1 rounded-sm text-gray-500">
                  {durationText}
                </span>
              </div>
            ) : (
              /* Regular View - Full Information */
              <>
                {/* Procedure line */}
                <div className="flex items-center mb-2">
                  <span className="text-[11px] font-medium text-gray-700 truncate max-w-[100%]">
                    {appointment.procedure || ''}
                  </span>
                </div>

                {/* Provider/time line */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-medium text-gray-600 truncate max-w-[60%]">
                    {provider?.firstName ? `Dr. ${provider.firstName}` : ''}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {!elapsedTime && (
                      <span className="text-[10px] text-gray-600">
                        {formatAppointmentTime(appointment.startTime)}
                      </span>
                    )}
                    <span className="text-[9px] bg-gray-100 px-1 rounded-sm text-gray-500">
                      {durationText}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Quick actions dropdown */}
            {quickActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full p-1">
                  <span className="text-[8px] font-medium">•••</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {quickActions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleStatusChange(action.nextStatus)}
                    >
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className="bg-white p-3 rounded-md shadow-lg border border-gray-200 max-w-xs"
          align="center"
          side="right"
        >
          <div className="flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{patient?.firstName} {patient?.lastName}</h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  {patient?.chartNumber && `Chart #: ${patient.chartNumber}`}
                </p>
                <p className="text-xs text-gray-600">
                  {patient?.dateOfBirth && `DOB: ${format(new Date(patient.dateOfBirth), 'MMM d, yyyy')}`}
                </p>
              </div>
              {hasWarning && (
                <Badge variant="destructive" className="flex items-center gap-1 ml-2">
                  <DollarSign className="h-3 w-3" />
                  {balanceDue}
                </Badge>
              )}
            </div>
            
            <div className="border-t border-gray-100 pt-2 mb-2">
              <div className="font-medium">{format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}</div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  {formatAppointmentTime(appointment.startTime)} 
                  {appointment.endTime && ` - ${formatAppointmentTime(appointment.endTime)}`}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Badge variant="outline" className="bg-gray-50">
                    {durationText}
                  </Badge>
                </div>
              </div>
              
              <div className="text-sm mt-1">{appointment.procedure || appointment.appointmentType}</div>
              {appointment.notes && <div className="text-xs mt-1 text-gray-600">{appointment.notes}</div>}
            </div>
            
            <div className="border-t border-gray-100 pt-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <Badge 
                    className={cn(
                      "mr-1",
                      statusText.includes("CHAIR") ? "bg-blue-50 text-blue-700 border-blue-200" :
                      statusText.includes("CHECKED_IN") ? "bg-green-50 text-green-700 border-green-200" :
                      statusText.includes("READY") ? "bg-teal-50 text-teal-700 border-teal-200" :
                      statusText.includes("COMPLETED") ? "bg-gray-50 text-gray-700 border-gray-200" :
                      statusText.includes("LATE") ? "bg-amber-50 text-amber-700 border-amber-200" :
                      statusText.includes("NO_SHOW") ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-gray-50 text-gray-700 border-gray-200"
                    )}
                    variant="outline"
                  >
                    {statusText.replace(/_/g, ' ').replace(/(\w+)/g, (word) => 
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    )}
                  </Badge>
                  {elapsedTime && <span className="text-gray-500">({elapsedTime})</span>}
                </div>
                {tooltipSuffix && <div className="text-gray-500">{tooltipSuffix}</div>}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}