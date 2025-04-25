import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CountdownTimer, getAppointmentTiming, AppointmentWithDetails } from "@/lib/scheduling-utils";
import { STATUS_COLORS } from "@/lib/scheduling-constants";
import { cn } from "@/lib/utils";

interface AppointmentChipProps {
  appointment: AppointmentWithDetails;
  columnIndex: number;
  slotHeight: number;
  onClick?: () => void;
  resizingEnabled?: boolean;
}

export default function AppointmentChip({
  appointment,
  columnIndex,
  slotHeight,
  onClick,
  resizingEnabled = false
}: AppointmentChipProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  // Set up native drag handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('appointment', JSON.stringify(appointment));
    setIsDragging(true);
    // Pass the dragged appointment data to the parent via onClick handler
    if (onClick) {
      onClick();
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Calculate position & dimension
  const startTimeStr = appointment.startTime.toString();
  const [hours, minutes] = startTimeStr.split(':').map(Number);
  
  // Calendar starts at 7:00 AM (60*7 = 420 minutes from midnight)
  const calendarStartMinutes = 7 * 60;
  const appointmentStartMinutes = hours * 60 + (minutes || 0);
  const minutesFromStart = appointmentStartMinutes - calendarStartMinutes;
  
  // Position in grid (TIME_SLOT is 5 minutes)
  const top = Math.round((minutesFromStart / 5) * slotHeight);
  const height = Math.round((appointment.duration / 5) * slotHeight);

  // Get status color classes
  const status = appointment.status.toUpperCase() as keyof typeof STATUS_COLORS;
  const statusColors = STATUS_COLORS[status] || STATUS_COLORS.SCHEDULED;

  // Calculate patient full name
  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
  
  // Calculate time display
  const timeDisplay = getAppointmentTiming(appointment);

  // Calculate balance due badge
  const hasBalance = appointment.patient.balanceDue && appointment.patient.balanceDue > 0;

  // Determine status badge text and colors
  const getStatusBadge = () => {
    switch(appointment.status) {
      case 'confirmed':
        return {
          text: 'Confirmed',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'checked_in':
        return {
          text: 'Checked In',
          color: 'bg-green-100 text-green-800'
        };
      case 'in_chair':
        return {
          text: (
            <div className="flex flex-col">
              <span>In Chair</span>
              {appointment.chairStartedAt && (
                <span className="text-xs">
                  <CountdownTimer expiryTime={new Date(appointment.chairStartedAt.getTime() + appointment.duration * 60 * 1000)} />
                </span>
              )}
            </div>
          ),
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'completed':
        return {
          text: 'Completed',
          color: 'bg-gray-100 text-gray-600'
        };
      case 'no_show':
        return {
          text: 'No Show',
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          text: appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('_', ' '),
          color: 'bg-blue-100 text-blue-800'
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: '4px',
        right: '4px',
        height: `${height}px`,
        cursor: 'grab',
        zIndex: isDragging ? 999 : 1
      }}
      className={cn(
        "transition-shadow hover:shadow-md",
        statusColors.bg,
        statusColors.text,
        statusColors.border
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <Card className={cn(
        "h-full flex flex-col overflow-hidden p-2 text-xs",
        isDragging ? "opacity-75" : "opacity-100",
        statusColors.bg,
        statusColors.text,
        statusColors.border,
        "border rounded-md"
      )}>
        {/* Status badge */}
        <div className={`text-[8px] font-semibold uppercase mb-1 px-1 rounded inline-block ${statusBadge.color}`}>
          {statusBadge.text}
        </div>
        
        {/* Patient info */}
        <div className="font-semibold truncate">{patientName}</div>
        
        {/* Time display */}
        <div className="text-[9px] opacity-90">{timeDisplay}</div>
        
        {/* Procedure display */}
        <div className="text-[9px] mt-1 truncate">
          {appointment.procedure ? (
            <span>{appointment.procedure}</span>
          ) : (
            <span className="italic opacity-75">No procedure specified</span>
          )}
        </div>

        {/* CDT Code if available */}
        {appointment.cdtCode && (
          <div className="text-[8px] font-mono opacity-75">{appointment.cdtCode}</div>
        )}
        
        {/* Balance due */}
        {hasBalance && (
          <div className="mt-auto pt-1">
            <span className="bg-red-100 text-red-800 text-[8px] px-1 py-0.5 rounded">
              Balance: ${(appointment.patient.balanceDue! / 100).toFixed(2)}
            </span>
          </div>
        )}

        {/* Provider/Operatory indicator */}
        <div className="flex mt-auto pt-1 gap-1">
          {appointment.provider && (
            <div 
              className="h-2 w-2 rounded-full" 
              style={{ backgroundColor: appointment.provider.color }}
              title={appointment.provider.name}
            />
          )}
          {appointment.operatory && (
            <div 
              className="h-2 w-2 rounded-sm" 
              style={{ backgroundColor: appointment.operatory.color }}
              title={appointment.operatory.name}
            />
          )}
        </div>
      </Card>
    </div>
  );
}