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
  
  // Hard-coded sample appointments for the demo calendar
  const demoAppointments = useMemo(() => {
    return [
      {
        id: 1,
        patientId: 1,
        patient: { id: 1, firstName: "John", lastName: "Johnson", avatarInitials: "JJ", dateOfBirth: null, insuranceProvider: "Delta Dental", allergies: null, balanceDue: 0 },
        providerId: 1,
        provider: { id: 1, name: "Dr. Nguyen", role: "Dentist", color: "#FF9E80" },
        operatoryId: 1,
        operatory: { id: 1, name: "Op 1", color: "#C2E0FF" },
        date: selectedDate,
        startTime: "09:00:00",
        endTime: null,
        duration: 70,
        durationMinutes: null,
        status: "confirmed",
        procedure: "Crown - Porcelain Fused to High Noble Metal",
        cdtCode: "D2750",
        isVerified: null,
        confirmedAt: new Date(new Date().getTime() - 1000 * 60 * 30),
        arrivedAt: null,
        chairStartedAt: null,
        completedAt: null
      },
      {
        id: 2,
        patientId: 2,
        patient: { id: 2, firstName: "Maria", lastName: "Garcia", avatarInitials: "MG", dateOfBirth: null, insuranceProvider: "Cigna", allergies: null, balanceDue: 4500 },
        providerId: 2,
        provider: { id: 2, name: "Dr. Robert", role: "Dentist", color: "#B39DDB" },
        operatoryId: 2,
        operatory: { id: 2, name: "Op 2", color: "#FFD6D6" },
        date: selectedDate,
        startTime: "10:00:00",
        endTime: null,
        duration: 90,
        durationMinutes: null,
        status: "in_chair",
        procedure: "Core Buildup, Including any Pins",
        cdtCode: "D2950",
        isVerified: null,
        confirmedAt: new Date(new Date().getTime() - 1000 * 60 * 60),
        arrivedAt: new Date(new Date().getTime() - 1000 * 60 * 45),
        chairStartedAt: new Date(new Date().getTime() - 1000 * 60 * 15),
        completedAt: null
      },
      {
        id: 3,
        patientId: 3,
        patient: { id: 3, firstName: "David", lastName: "Lee", avatarInitials: "DL", dateOfBirth: null, insuranceProvider: "Aetna", allergies: null, balanceDue: 0 },
        providerId: 4,
        provider: { id: 4, name: "Dr. Maria", role: "Dentist", color: "#C5E1A5" },
        operatoryId: 4,
        operatory: { id: 4, name: "Op 4", color: "#D6EEDA" },
        date: selectedDate,
        startTime: "08:30:00",
        endTime: null,
        duration: 60,
        durationMinutes: null,
        status: "scheduled",
        procedure: "Resin-Based Composite - One Surface",
        cdtCode: "D2330",
        isVerified: null,
        confirmedAt: null,
        arrivedAt: null,
        chairStartedAt: null,
        completedAt: null
      },
      {
        id: 4,
        patientId: 4,
        patient: { id: 4, firstName: "Sarah", lastName: "Martinez", avatarInitials: "SM", dateOfBirth: null, insuranceProvider: "MetLife", allergies: null, balanceDue: 2000 },
        providerId: 1,
        provider: { id: 1, name: "Dr. Nguyen", role: "Dentist", color: "#FF9E80" },
        operatoryId: 1,
        operatory: { id: 1, name: "Op 1", color: "#C2E0FF" },
        date: selectedDate,
        startTime: "11:00:00",
        endTime: null,
        duration: 60,
        durationMinutes: null,
        status: "checked_in",
        procedure: "Prophylaxis - Adult",
        cdtCode: "D1110",
        isVerified: null,
        confirmedAt: new Date(new Date().getTime() - 1000 * 60 * 60),
        arrivedAt: new Date(new Date().getTime() - 1000 * 60 * 10),
        chairStartedAt: null,
        completedAt: null
      },
      {
        id: 5,
        patientId: 5,
        patient: { id: 5, firstName: "Robert", lastName: "Wilson", avatarInitials: "RW", dateOfBirth: null, insuranceProvider: "Delta Dental", allergies: null, balanceDue: 0 },
        providerId: 1,
        provider: { id: 1, name: "Dr. Nguyen", role: "Dentist", color: "#FF9E80" },
        operatoryId: 1,
        operatory: { id: 1, name: "Op 1", color: "#C2E0FF" },
        date: selectedDate,
        startTime: "13:00:00",
        endTime: null,
        duration: 45,
        durationMinutes: null,
        status: "scheduled",
        procedure: "Periodic Oral Evaluation",
        cdtCode: "D0120",
        isVerified: null,
        confirmedAt: null,
        arrivedAt: null,
        chairStartedAt: null,
        completedAt: null
      },
      {
        id: 6,
        patientId: 6,
        patient: { id: 6, firstName: "Jennifer", lastName: "Taylor", avatarInitials: "JT", dateOfBirth: null, insuranceProvider: "Guardian", allergies: null, balanceDue: 0 },
        providerId: 2,
        provider: { id: 2, name: "Dr. Robert", role: "Dentist", color: "#B39DDB" },
        operatoryId: 2,
        operatory: { id: 2, name: "Op 2", color: "#FFD6D6" },
        date: selectedDate,
        startTime: "08:30:00",
        endTime: null,
        duration: 60,
        durationMinutes: null,
        status: "scheduled",
        procedure: "Resin-Based Composite - Three Surfaces",
        cdtCode: "D2332",
        isVerified: null,
        confirmedAt: null,
        arrivedAt: null,
        chairStartedAt: null,
        completedAt: null
      },
      {
        id: 7,
        patientId: 7,
        patient: { id: 7, firstName: "Michael", lastName: "Brown", avatarInitials: "MB", dateOfBirth: null, insuranceProvider: "MetLife", allergies: null, balanceDue: 25000 },
        providerId: 1,
        provider: { id: 1, name: "Dr. Nguyen", role: "Dentist", color: "#FF9E80" },
        operatoryId: 1,
        operatory: { id: 1, name: "Op 1", color: "#C2E0FF" },
        date: selectedDate,
        startTime: "15:00:00",
        endTime: null,
        duration: 60,
        durationMinutes: null,
        status: "completed",
        procedure: "Resin-Based Composite - Four Surfaces",
        cdtCode: "D2335",
        isVerified: null,
        confirmedAt: new Date(new Date().getTime() - 1000 * 60 * 90),
        arrivedAt: new Date(new Date().getTime() - 1000 * 60 * 75),
        chairStartedAt: new Date(new Date().getTime() - 1000 * 60 * 60),
        completedAt: new Date(new Date().getTime() - 1000 * 60 * 5)
      },
    ].map(apt => ({
      ...apt,
      status: getStatusBasedOnTime(apt.startTime),
    }));
  }, [selectedDate]);
  
  // Initialize the resources
  useEffect(() => {
    setResourceColumns(demoResources);
  }, [demoResources]);
  
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

  // Calculate time slots (from start to end of business day)
  const timeSlots = useMemo(() => {
    const slots = [];
    const startTime = BUSINESS_START_HOUR * MINS_IN_HOUR; // 7:00 AM
    const endTime = (BUSINESS_START_HOUR + HOURS_IN_DAY) * MINS_IN_HOUR; // 7:00 PM
    
    for (let i = startTime; i < endTime; i += TIME_SLOT) {
      slots.push({
        time: i,
        label: getTimeFromMinutes(i)
      });
    }
    
    return slots;
  }, []);
  
  // Group appointments by resource
  const appointmentsByResource = useMemo(() => {
    const grouped: { [key: number]: AppointmentWithDetails[] } = {};
    
    resourceColumns.forEach(col => {
      grouped[col.id] = [];
    });
    
    demoAppointments.forEach(appointment => {
      const resourceId = viewMode === 'PROVIDER' ? appointment.providerId : appointment.operatoryId;
      if (resourceId && grouped[resourceId]) {
        grouped[resourceId].push(appointment);
      }
    });
    
    return grouped;
  }, [demoAppointments, resourceColumns, viewMode]);
  
  // Status handling is now in the AppointmentChip component

  return (
    <Card className="w-full h-full overflow-hidden border rounded-md">
      <div className="h-full overflow-auto">
        {/* Resource column headers */}
        <div className="grid" style={{ gridTemplateColumns: `60px repeat(${resourceColumns.length}, 1fr)` }}>
          {/* Time header */}
          <div className="p-1 border-b border-r bg-[#F8F9FA] text-center text-xs font-medium text-gray-600">
            Time
          </div>
          
          {/* Resource headers */}
          {resourceColumns.map(resource => (
            <div key={resource.id} className="py-1 px-2 border-b border-r text-center bg-[#F8F9FA]">
              <div 
                className="font-semibold truncate text-xs" 
                style={{ 
                  color: resource.color || '#6B7280',
                  borderBottom: `2px solid ${resource.color || '#E5E7EB'}`
                }}
              >
                {resource.name}
              </div>
            </div>
          ))}
        </div>
        
        {/* Time grid */}
        <div className="grid" style={{ gridTemplateColumns: `60px repeat(${resourceColumns.length}, 1fr)` }}>
          {/* Time column */}
          <div className="border-r bg-[#F8F9FA]">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className={`
                  border-b text-xs text-right pr-2.5
                  ${index % 12 === 0 ? 'font-medium text-gray-600' : 'text-transparent'}
                `}
                style={{ height: '12px' }}
              >
                {index % 12 === 0 && slot.label}
              </div>
            ))}
          </div>
          
          {/* Resource columns */}
          {resourceColumns.map((resource) => (
            <div key={resource.id} className="relative border-r">
              {/* Time slots background */}
              {timeSlots.map((slot, index) => {
                const slotProps = {
                  key: index,
                  className: `border-b ${index % 12 === 0 ? 'bg-[#F8F9FA]' : ''}`,
                  style: { height: '12px' } as React.CSSProperties,
                };
                
                return (
                  <div 
                    key={index}
                    className={slotProps.className}
                    style={slotProps.style}
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
                const top = (startFromDayBeginning / 5) * 12;
                const height = (appointment.duration / 5) * 12;
                
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