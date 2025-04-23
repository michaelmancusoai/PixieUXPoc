import React from 'react';
import { useDraggable } from "@dnd-kit/core";
import { AppointmentWithDetails, AppointmentStatus } from "@shared/schema";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";
import { AlertTriangle, DollarSign, Clock } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface AppointmentChipProps {
  appointment: AppointmentWithDetails;
  style?: React.CSSProperties;
  isCompact?: boolean;
  staggerIndex?: number;  // New prop for staggering
  totalOverlapping?: number;  // New prop for total overlapping appointments
}

export default function StaggeredAppointmentChip({ 
  appointment, 
  style = {}, 
  isCompact = false,
  staggerIndex = 0,
  totalOverlapping = 1
}: AppointmentChipProps) {
  const { 
    patient, 
    provider, 
    procedure, 
    startTime, 
    endTime, 
    status, 
    arrivedAt, 
    seatedAt, 
    chairStartedAt 
  } = appointment;
  
  // Handle drag and drop
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: appointment.id,
    data: { appointment }
  });
  
  // Format status and determine color
  const statusText = status || AppointmentStatus.SCHEDULED;
  const colorConfig = STATUS_COLORS[statusText as keyof typeof STATUS_COLORS] || STATUS_COLORS.SCHEDULED;
  
  // Determine if appointment has started timing
  const hasStarted = Boolean(arrivedAt || seatedAt || chairStartedAt);
  
  // Calculate elapsed time if appointment has started
  let elapsedTime = null;
  if (hasStarted) {
    const now = new Date();
    const startPoint = chairStartedAt ? parseISO(chairStartedAt.toString()) : 
                       seatedAt ? parseISO(seatedAt.toString()) : 
                       arrivedAt ? parseISO(arrivedAt.toString()) : null;
    
    if (startPoint) {
      const minutes = differenceInMinutes(now, startPoint);
      elapsedTime = minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    }
  }
  
  // Format time for display
  const formatAppointmentTime = (time: string | Date) => {
    if (typeof time === 'string') {
      try {
        return format(parseISO(time.toString()), 'h:mm a');
      } catch (e) {
        return time;
      }
    } else if (time instanceof Date) {
      return format(time, 'h:mm a');
    }
    return String(time);
  };
  
  // Calculate duration for display
  const durationText = appointment.duration
    ? `${appointment.duration}m`
    : (startTime && endTime) 
      ? `${differenceInMinutes(parseISO(endTime.toString()), parseISO(startTime.toString()))}m`
      : '';
  
  // Check for warnings like balance due or allergies
  const hasWarning = (patient?.balanceDue && patient.balanceDue > 0);
  const hasAllergy = patient?.allergies && patient.allergies.length > 0;
  const balanceDue = hasWarning ? `$${Math.round(patient.balanceDue)}` : null;
  
  // Determine which quick actions to show based on current status
  const quickActions = [];
  
  // Calculate staggering
  const staggerOffset = staggerIndex * 10; // 10px of horizontal offset per overlapping appointment
  const widthReduction = (totalOverlapping - 1) * 10; // Reduce width based on how many overlapping appointments
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(
              "rounded border select-none p-2 overflow-hidden group text-sm",
              colorConfig.bg,
              colorConfig.text,
              colorConfig.border,
              isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab",
              status === AppointmentStatus.DOCTOR_READY && "animate-pulse",
              isCompact && "p-1 text-xs"
            )}
            style={{
              ...style,
              left: `${parseInt(style.left as string) + staggerOffset}px`,
              width: style.width 
                ? `calc(${style.width} - ${widthReduction}px)` 
                : `calc(100% - ${8 + widthReduction}px)`,
              zIndex: (style.zIndex as number || 5) + staggerIndex  // Increase z-index based on stagger
            }}
            onDoubleClick={() => {
              // Handle double click (e.g., opening details)
            }}
            aria-label={`Appointment ${patient?.firstName} ${patient?.lastName}, status ${statusText}${elapsedTime ? `, started ${elapsedTime}` : ''}`}
          >
            {/* Patient name at top - always shown */}
            <div className="flex justify-between items-start mb-2">
              <span className={cn("font-medium truncate", isCompact ? "text-xs" : "text-sm")}>
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
                  <AlertTriangle className={cn(isCompact ? "h-2.5 w-2.5" : "h-3 w-3", "text-amber-500")} />
                </span>
              )}
            </div>

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
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}