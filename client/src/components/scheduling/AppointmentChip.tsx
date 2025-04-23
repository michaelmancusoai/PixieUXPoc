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
        borderLeft: '3px solid #059669', // Green
        animation: 'pulse-glow 2s infinite'
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
        const appointmentTime = new Date(appointment.startTime);
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
  
  if (status === AppointmentStatus.CHECKED_IN && appointment.arrivedAt) {
    return `Arrived @ ${format(new Date(appointment.arrivedAt), 'hh:mm')}`;
  } else if (status === AppointmentStatus.SEATED && appointment.statusUpdatedAt) {
    return `Seated @ ${format(new Date(appointment.statusUpdatedAt), 'hh:mm')}`;
  } else if (status === AppointmentStatus.IN_CHAIR && appointment.chairStartedAt) {
    return `Tx started @ ${format(new Date(appointment.chairStartedAt), 'hh:mm')}`;
  } else if (status === AppointmentStatus.COMPLETED && appointment.completedAt) {
    return `Dismissed @ ${format(new Date(appointment.completedAt), 'hh:mm')}`;
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
            <div className="flex justify-between items-start mb-1">
              <span className={cn("font-medium truncate", isCompactView ? "text-xs" : "text-sm")}>
                {patient?.firstName} {patient?.lastName}
              </span>
              <span className="text-[10px] text-gray-500">
                Op {appointment.operatoryId || '?'}
              </span>
            </div>
            
            {/* Status line - consistent location and format with visual styling */}
            <div className="flex items-center mb-1">
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
                <div className="flex items-center mb-1">
                  <span className="text-[10px] text-gray-600 truncate max-w-[100%]">
                    {appointment.procedure || ''}
                  </span>
                </div>

                {/* Provider/time line */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-600 flex items-center">
                    <span className="mr-0.5">Dr.</span>
                    {provider?.name?.split(' ')[1] || 'Unassigned'}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {!elapsedTime && (
                      <span className="text-[10px] text-gray-600">
                        {format(new Date(`2025-01-01T${appointment.startTime}`), 'h:mm a')}
                      </span>
                    )}
                    <span className="text-[9px] bg-gray-100 px-1 rounded-sm text-gray-500">
                      {durationText}
                    </span>
                  </div>
                </div>
              </>
            )}
            
            {/* Quick action menu */}
            {quickActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger className="absolute inset-0 opacity-0">
                  Actions
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {quickActions.map((action) => (
                    <DropdownMenuItem 
                      key={action.label}
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
        <TooltipContent side="right" className="z-50">
          <div className="p-2 space-y-2.5 max-w-xs bg-white rounded-md shadow-lg border border-gray-200">
            {/* Patient header with name and status */}
            <div className="border-b pb-2">
              <p className="font-semibold text-sm">{patient?.firstName} {patient?.lastName}</p>
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-500">
                  {patient?.dateOfBirth && `DOB: ${format(new Date(patient.dateOfBirth), 'MMM d, yyyy')}`}
                </p>
              </div>
            </div>
            
            {/* Appointment details */}
            <div className="space-y-2">
              {/* Time and duration */}
              <div className="flex items-center text-xs bg-gray-50 rounded p-1.5">
                <Clock className="h-3.5 w-3.5 text-blue-500 mr-2" />
                <div>
                  <div className="font-medium">{format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}</div>
                  <div className="text-gray-600">
                    {appointment.startTime && (
                      <>
                        {format(new Date(`2025-01-01T${appointment.startTime}`), 'h:mm a')} 
                        {appointment.endTime && ` - ${format(new Date(`2025-01-01T${appointment.endTime}`), 'h:mm a')}`}
                        <span className="ml-1 text-gray-500">({durationInMinutes} min)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Status box */}
              <div className={cn(
                "flex items-center text-xs rounded p-1.5",
                statusText.includes("CHAIR") ? "bg-blue-50" :
                statusText.includes("CHECKED_IN") ? "bg-green-50" :
                statusText.includes("READY") ? "bg-teal-50" :
                statusText.includes("LATE") ? "bg-amber-50" :
                statusText.includes("NO_SHOW") ? "bg-red-50" :
                "bg-gray-50"
              )}>
                <div className={cn(
                  "h-2 w-2 rounded-full mr-2",
                  statusText.includes("CHAIR") ? "bg-blue-500" :
                  statusText.includes("CHECKED_IN") ? "bg-green-500" :
                  statusText.includes("READY") ? "bg-teal-500" :
                  statusText.includes("LATE") ? "bg-amber-500" :
                  statusText.includes("NO_SHOW") ? "bg-red-500" :
                  "bg-gray-500"
                )}></div>
                <div>
                  <div className="font-medium">
                    {statusText.replace(/_/g, ' ').replace(/(\w+)/g, (word) => 
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    )}
                  </div>
                  <div className="text-gray-600">
                    {tooltipSuffix || (elapsedTime ? `Elapsed: ${elapsedTime}` : '')}
                  </div>
                </div>
              </div>
              
              {/* Provider and Operatory */}
              <div className="flex items-start text-xs">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Stethoscope className="h-3 w-3 text-gray-500 mr-1" />
                    <span className="font-medium">Provider</span>
                  </div>
                  <div className="ml-4 text-gray-700 mt-0.5">{provider?.name || 'Unassigned'}</div>
                </div>
                
                {appointment.operatoryId && (
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Armchair className="h-3 w-3 text-gray-500 mr-1" />
                      <span className="font-medium">Operatory</span>
                    </div>
                    <div className="ml-4 text-gray-700 mt-0.5">Op {appointment.operatoryId}</div>
                  </div>
                )}
              </div>
              
              {/* Procedure info */}
              {appointment.procedure && (
                <div className="text-xs border-t border-gray-100 pt-2 mt-2">
                  <div className="font-medium mb-1">Procedure Details</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{appointment.procedure}</span>
                    {appointment.cdtCode && (
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded-sm text-blue-600 font-medium">
                        {appointment.cdtCode}
                      </span>
                    )}
                  </div>
                  {appointment.cdtCode && (
                    <div className="text-[10px] text-gray-500 mt-1">
                      {/* Explaining what CDT codes are */}
                      CDT Code = Current Dental Terminology code used for insurance and billing
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Alerts/Warnings */}
            {(patient?.allergies || appointment.isVerified) && (
              <div className="mt-1 pt-2 border-t border-gray-100 space-y-2">
                {patient?.allergies && (
                  <div className="flex items-center gap-1 text-xs">
                    <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    <span className="text-red-600">
                      <span className="font-medium">Allergies:</span> {patient.allergies}
                    </span>
                  </div>
                )}
                {appointment.isVerified && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="h-3 w-3 flex-shrink-0" />
                    <span>Insurance verified</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
