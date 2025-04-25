import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { ViewModeType, AppointmentStatus } from "@/lib/scheduling-constants";
import { useQuery } from "@tanstack/react-query";
import { format, addMinutes, isEqual, isSameDay, parseISO } from "date-fns";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDndMonitor, useDraggable, useDroppable, DndContext, DragOverlay } from "@dnd-kit/core";
import AppointmentChip from "./AppointmentChip";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { HOURS_IN_DAY, MINS_IN_HOUR, TIME_SLOT, BUSINESS_START_HOUR } from "@/lib/scheduling-constants";
import { 
  getTimeFromMinutes, 
  getAppointmentPosition, 
  snapToTimeSlot,
  getAppointmentTiming,
  getStatusBasedOnTime,
  AppointmentWithDetails
} from "@/lib/scheduling-utils";
import { getDemoAppointments } from "@/lib/demo-appointments";

interface CalendarViewProps {
  selectedDate: Date;
  viewMode: ViewModeType;
}

export default function CalendarView({ 
  selectedDate,
  viewMode 
}: CalendarViewProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [resourceColumns, setResourceColumns] = useState<Array<{id: number, name: string, color?: string}>>([]);
  const [draggingAppointment, setDraggingAppointment] = useState<AppointmentWithDetails | null>(null);
  const [dragTarget, setDragTarget] = useState<{resourceId: number, time: number} | null>(null);

  // Fetch resources (operatories or providers) based on view mode
  const { data: resources = [] } = useQuery<Array<{id: number, name: string, color?: string}>>({
    queryKey: [viewMode === 'PROVIDER' ? '/api/providers' : '/api/operatories'],
    enabled: false, // Disable actual API call for demo
  });

  // Use hardcoded sample appointments for the demo
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  // Helper function to determine status based on appointment time
  const getStatusColorsByName = useCallback((status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-400' };
      case 'in_chair':
        return { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-400' };
      case 'checked_in':
        return { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-500' };
      case 'confirmed':
        return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-500' };
      case 'scheduled':
        return { bg: 'bg-white', text: 'text-gray-800', border: 'border-gray-300' };
      case 'no_show':
        return { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-500' };
      case 'unconfirmed':
        return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-500' };
      default:
        return { bg: 'bg-white', text: 'text-gray-800', border: 'border-gray-300' };
    }
  }, []);
  
  // Hardcoded resource data for demonstration
  const demoResources = useMemo(() => {
    return viewMode === 'PROVIDER' ? [
      { id: 1, name: 'Dr. Nguyen', color: '#FF9E80' },
      { id: 2, name: 'Dr. Robert', color: '#B39DDB' },
      { id: 3, name: 'Dr. Johnson', color: '#90CAF9' },
      { id: 4, name: 'Dr. Maria', color: '#C5E1A5' }
    ] : [
      { id: 1, name: 'Op 1', color: '#C2E0FF' },
      { id: 2, name: 'Op 2', color: '#FFD6D6' },
      { id: 3, name: 'Op 3', color: '#D7CCC8' },
      { id: 4, name: 'Op 4', color: '#D6EEDA' }
    ];
  }, [viewMode]);
  
  // Use the demo appointments from our external file
  const demoAppointments = useMemo(() => {
    console.log("Rebuilding appointments with view mode:", viewMode);
    return getDemoAppointments(selectedDate).map(apt => ({
      ...apt,
      // Only apply time-based status if no status is explicitly set
      status: apt.status || getStatusBasedOnTime(apt.startTime, apt.duration)
    }));
  }, [selectedDate, viewMode]);
  
  // Initialize the resources and update when viewMode changes
  useEffect(() => {
    setResourceColumns(demoResources);
    console.log(`View mode changed to: ${viewMode}. Resource columns updated with:`, demoResources);
  }, [demoResources, viewMode]);
  
  // Handle DND-kit drag events
  useDndMonitor({
    onDragStart(event) {
      const appointment = event.active.data.current as AppointmentWithDetails;
      if (appointment) {
        setDraggingAppointment(appointment);
      }
    },
    onDragEnd(event) {
      const appointment = event.active.data.current as AppointmentWithDetails;
      const target = dragTarget;
      
      if (appointment && target) {
        // In a real app, update the appointment here with an API call
        const hours = Math.floor(target.time / 60);
        const minutes = target.time % 60;
        const newStartTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        
        toast({
          title: "Appointment Moved",
          description: `${appointment.patient.firstName} ${appointment.patient.lastName} moved to ${format(addMinutes(new Date().setHours(0, 0, 0, 0), target.time), 'h:mm a')}`,
        });
      }
      
      setDraggingAppointment(null);
      setDragTarget(null);
    },
    onDragCancel() {
      setDraggingAppointment(null);
      setDragTarget(null);
    },
  });
  
  // Handle appointment clicks
  const handleAppointmentClick = useCallback((appointment: AppointmentWithDetails) => {
    toast({
      title: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      description: `${appointment.procedure || 'No procedure'} (${getTimeFromMinutes(parseInt(appointment.startTime.split(':')[0]) * 60 + parseInt(appointment.startTime.split(':')[1]))})`,
    });
  }, [toast]);

  // Simplify our approach: just add a current time indicator exactly at 1:15 PM
  const timeSlots = useMemo(() => {
    const slots = [];
    const startTime = BUSINESS_START_HOUR * MINS_IN_HOUR; // 7:00 AM
    const endTime = (BUSINESS_START_HOUR + HOURS_IN_DAY) * MINS_IN_HOUR; // 7:00 PM
    
    // Add all regular time slots
    for (let i = startTime; i <= endTime; i += TIME_SLOT) {
      slots.push({
        time: i,
        label: getTimeFromMinutes(i),
        isTimeIndicator: false
      });
    }
    
    // Now find the index to insert our special current time indicator at 1:15 PM
    const currentTimeAt1_15PM = 13 * 60 + 15; // 1:15 PM in minutes
    const indexBefore1_15 = Math.floor((currentTimeAt1_15PM - startTime) / TIME_SLOT);
    
    // Insert our special indicator at this specific position
    slots.splice(indexBefore1_15 + 1, 0, {
      time: currentTimeAt1_15PM,
      label: "1:15 PM",
      isTimeIndicator: true
    });
    
    console.log('Generated timeSlots with current time indicator:', 
      slots.filter(slot => slot.isTimeIndicator).length > 0 ? 'Indicator present' : 'NO INDICATOR');
    
    return slots;
  }, []);
  
  // Group appointments by resource (operatory or provider based on viewMode)
  const appointmentsByResource = useMemo(() => {
    console.log("REGROUPING APPOINTMENTS BY:", viewMode);
    const grouped: { [key: number]: AppointmentWithDetails[] } = {};
    
    // Initialize empty arrays for each resource column
    resourceColumns.forEach(col => {
      grouped[col.id] = [];
    });
    
    // Assign appointments to the appropriate resource group
    demoAppointments.forEach(appointment => {
      // Use the appropriate ID based on view mode (provider or operatory)
      const resourceId = viewMode === 'PROVIDER' ? appointment.providerId : appointment.operatoryId;
      
      // Add to the group if it exists
      if (resourceId !== undefined && grouped[resourceId]) {
        grouped[resourceId].push(appointment);
      }
    });
    
    // Debug: print count of appointments in each group
    Object.keys(grouped).forEach(key => {
      console.log(`Group ${key} (${viewMode === 'PROVIDER' ? 'Provider' : 'Operatory'}) has ${grouped[Number(key)].length} appointments`);
    });
    
    return grouped;
  }, [viewMode, resourceColumns, demoAppointments]);
  
  // Status handling is now in the AppointmentChip component

  return (
    <Card className="w-full h-full border rounded-md">
      <div className="overflow-auto relative" style={{ height: "calc(100vh - 120px)" }}>
        {/* Removing absolute positioned time indicator - using a different approach */}
        {/* Resource column headers */}
        <div className="grid" style={{ gridTemplateColumns: `60px repeat(${resourceColumns.length}, 1fr)` }}>
          {/* Time header */}
          <div className="py-2 px-2 border-b border-r bg-[#F8F9FA] text-center">
            <div className="font-medium text-sm bg-gray-100 py-2 rounded-md text-gray-700">
              Time
            </div>
          </div>
          
          {/* Resource headers */}
          {resourceColumns.map(resource => (
            <div key={resource.id} className="py-2 px-2 border-b border-r text-center bg-[#F8F9FA]">
              <div 
                className="font-medium truncate text-sm" 
                style={{ 
                  backgroundColor: resource.color ? `${resource.color}20` : 'white',
                  borderRadius: '4px',
                  padding: '2px 4px',
                  color: '#333333',
                  borderLeft: `3px solid ${resource.color || '#6B7280'}`
                }}
              >
                {resource.name}
              </div>
            </div>
          ))}
        </div>
        
        {/* Time grid */}
        <div className="grid" style={{ 
          gridTemplateColumns: `60px repeat(${resourceColumns.length}, 1fr)`,
          minHeight: "1680px"  /* Height for 7am-7pm range (13 hours × 12 slots/hour × 8px + 48px extra) */
        }}>
          {/* Time column with enhanced styling - darker solid gray background */}
          <div className="border-r bg-gray-200 relative">
            {timeSlots.map((slot, index) => (
              slot.isTimeIndicator ? (
                // Special current time indicator at 1:15 PM - just show the label, no line
                <div 
                  key={index} 
                  className="border-0 h-[24px] bg-transparent relative flex items-center"
                >
                  {/* Current time label for 1:15 PM */}
                  <div className="absolute right-0 flex justify-end items-center z-10 h-full">
                    <div className="bg-red-500 text-white text-[10px] py-1 px-2 rounded-l whitespace-nowrap">
                      {slot.label}
                    </div>
                  </div>
                </div>
              ) : (
                // Regular time slot
                <div
                  key={index}
                  className={`
                    border-b text-xs text-right pr-2.5
                    ${index % 12 === 0 ? 'font-medium text-gray-700' : 'text-transparent'}
                  `}
                  style={{ 
                    height: '8px',
                    backgroundColor: '#E2E5E9', // Darker gray background
                    borderBottom: index % 12 === 0 ? '1px solid #D1D5DB' : '1px solid #E5E7EB'
                  }}
                >
                  {index % 12 === 0 && slot.label}
                </div>
              )
            ))}
          </div>
          
          {/* Resource columns */}
          {resourceColumns.map((resource, resourceIndex) => (
            <div key={resource.id} className="relative border-r">
              {/* Time slots with graduated border styling */}
              {timeSlots.map((slot, index) => {
                // Special case for time indicator slot
                if (slot.isTimeIndicator) {
                  // Only start showing the line from the first resource column (skip time column)
                  return (
                    <div 
                      key={index}
                      className="h-[2px] bg-red-500 border-0 my-[11px]"
                    >
                      {/* Line positioned in the middle of the time label height */}
                    </div>
                  );
                }
                
                // Normal time slots
                // Determine border style based on time division
                // Hour marks (darkest), quarter-hour marks (medium), 5-minute increments (lightest)
                let bgColor = 'white';
                let borderStyle = '1px solid #F8F8F8'; // Very light border for 5-min increments
                
                if (index % 12 === 0) {
                  // Hour marks (e.g., 10:00, 11:00)
                  borderStyle = '1px solid #CACACA'; // Much darker border for hours
                } else if (index % 3 === 0) {
                  // Quarter-hour marks (15, 30, 45 minutes)
                  borderStyle = '1px solid #E0E0E0'; // Noticeably darker border for 15-min
                } else {
                  // 5-minute increments - lightest border
                  borderStyle = '1px solid #F8F8F8';
                }
                
                return (
                  <div 
                    key={index}
                    className={`border-b`}
                    style={{ 
                      height: '8px',
                      backgroundColor: bgColor,
                      borderBottom: borderStyle
                    }}
                  >
                    <DropTimeSlot 
                      resourceId={resource.id}
                      time={slot.time}
                      isOver={dragTarget?.resourceId === resource.id && dragTarget?.time === slot.time}
                    />
                  </div>
                );
              })}
              
              {/* Appointments for this resource */}
              {appointmentsByResource[resource.id]?.map(appointment => {
                // Calculate appointment position
                const startMinutes = parseInt(appointment.startTime.split(':')[0]) * 60 + 
                                   parseInt(appointment.startTime.split(':')[1]);
                const startFromDayBeginning = startMinutes - (BUSINESS_START_HOUR * 60);
                // Convert minutes to pixels using the 8px height per 5 minutes ratio
                const top = (startFromDayBeginning / 5) * 8;
                const height = (appointment.duration / 5) * 8;
                
                // We're now passing the appointment directly to the AppointmentChip component
                // which handles status display and styling internally
                
                return (
                  <AppointmentChip
                    key={appointment.id}
                    appointment={appointment}
                    style={{
                      position: 'absolute',
                      top: `${top}px`,
                      left: '4px',
                      right: '4px',
                      height: `${height}px`,
                      zIndex: 5,
                    }}
                  />
                );
              })}
            </div>
          ))}
          

        </div>
      </div>
    </Card>
  );
}

// Drop target component for time slots
function DropTimeSlot({ resourceId, time, isOver }: { resourceId: number, time: number, isOver: boolean }) {
  const { setNodeRef } = useDroppable({
    id: `${resourceId}-${time}`,
  });
  
  return (
    <div 
      ref={setNodeRef} 
      className={`w-full h-full ${isOver ? 'bg-blue-100' : ''}`}
    />
  );
}