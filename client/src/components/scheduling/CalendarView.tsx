import { useMemo, useRef, useState, useEffect } from "react";
import { format, addMinutes, parseISO } from "date-fns";
import AppointmentChip from "./AppointmentChip";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { HOURS_IN_DAY, MINS_IN_HOUR, TIME_SLOT, ViewModeType } from "@/lib/scheduling-constants";
import { 
  getTimeFromMinutes, 
  snapToTimeSlot,
  AppointmentWithDetails,
  getStatusBasedOnTime
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
  const [slotHeight, setSlotHeight] = useState(4); // Height of a 5-minute time slot
  const [draggingAppointment, setDraggingAppointment] = useState<AppointmentWithDetails | null>(null);
  const [dragTarget, setDragTarget] = useState<{resourceId: number, time: number} | null>(null);
  
  // Hardcoded resource data for demonstration
  const resourceColumns = useMemo(() => {
    return viewMode === 'PROVIDER' ? [
      { id: 1, name: 'Dr. Nguyen' },
      { id: 2, name: 'Dr. Robert' },
      { id: 3, name: 'Dr. Johnson' },
      { id: 4, name: 'Dr. Maria' }
    ] : [
      { id: 1, name: 'Op 1' },
      { id: 2, name: 'Op 2' },
      { id: 3, name: 'Op 3' },
      { id: 4, name: 'Op 4' }
    ];
  }, [viewMode]);
  
  // Hard-coded sample appointments for the demo calendar
  const appointments = useMemo(() => {
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
        status: "confirmed",
        procedure: "Crown - Porcelain Fused to High Noble Metal",
        cdtCode: "D2750",
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
        status: "in_chair",
        procedure: "Core Buildup, Including any Pins",
        cdtCode: "D2950",
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
        status: "scheduled",
        procedure: "Resin-Based Composite - One Surface",
        cdtCode: "D2330",
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
        status: "checked_in",
        procedure: "Prophylaxis - Adult",
        cdtCode: "D1110",
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
        status: "scheduled",
        procedure: "Periodic Oral Evaluation",
        cdtCode: "D0120",
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
        status: "scheduled",
        procedure: "Resin-Based Composite - Three Surfaces",
        cdtCode: "D2332",
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
        status: "completed",
        procedure: "Resin-Based Composite - Four Surfaces",
        cdtCode: "D2335",
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
  
  // Generate time slots for the day (5-minute intervals)
  const timeSlots = useMemo(() => {
    const slots = [];
    const startHour = 7; // 7:00 AM
    const endHour = 19; // 7:00 PM - extending beyond business hours to show all appointments
    
    for (let i = startHour * MINS_IN_HOUR; i <= endHour * MINS_IN_HOUR; i += TIME_SLOT) {
      slots.push({
        time: i,
        label: format(addMinutes(new Date().setHours(0, 0, 0, 0), i), 'h:mm a'),
        isMajor: i % MINS_IN_HOUR === 0,
        isMedium: i % 30 === 0 && !((i % MINS_IN_HOUR) === 0), // 30-minute marks
        isMinor: i % 15 === 0 && !((i % 30) === 0) && !((i % MINS_IN_HOUR) === 0) // 15-minute marks
      });
    }
    return slots;
  }, []);
  
  // Calculate time slot height based on container size
  useEffect(() => {
    const calculateSlotHeight = () => {
      if (containerRef.current) {
        // Calculate height minus header (70px)
        const availableHeight = containerRef.current.clientHeight - 70;
        // Target about 12 hours visible without scrolling (144 time slots)
        const totalSlots = 144;
        // Divide available height by total slots
        const calculatedHeight = Math.max(4, Math.floor(availableHeight / totalSlots)); 
        setSlotHeight(calculatedHeight);
      }
    };
    
    calculateSlotHeight();
    
    // Add resize listener
    window.addEventListener('resize', calculateSlotHeight);
    return () => window.removeEventListener('resize', calculateSlotHeight);
  }, []);
  
  // Filter and group appointments
  const appointmentsByResource = useMemo(() => {
    const groupedAppointments: Record<string, AppointmentWithDetails[]> = {};
    
    // Initialize empty arrays for each resource
    resourceColumns.forEach(resource => {
      groupedAppointments[resource.id] = [];
    });
    
    // Filter and group appointments
    appointments.forEach(appointment => {
      const resourceId = viewMode === 'PROVIDER' ? appointment.providerId : appointment.operatoryId;
      if (resourceId && groupedAppointments[resourceId]) {
        groupedAppointments[resourceId].push(appointment);
      }
    });
    
    return groupedAppointments;
  }, [appointments, resourceColumns, viewMode]);
  
  // Handle appointment clicks
  const handleAppointmentClick = (appointment: AppointmentWithDetails) => {
    toast({
      title: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      description: `${appointment.procedure || 'No procedure'} (${getTimeFromMinutes(parseInt(appointment.startTime.split(':')[0]) * 60 + parseInt(appointment.startTime.split(':')[1]))})`,
    });
  };
  
  // Handle drag start - when appointment is dragged
  const handleAppointmentDragStart = (appointment: AppointmentWithDetails) => {
    setDraggingAppointment(appointment);
  };
  
  // Handle drag over a time slot
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggingAppointment) return;
    
    const target = e.target as HTMLElement;
    const resourceId = parseInt(target.dataset.resourceId || '0');
    const time = parseInt(target.dataset.time || '0');
    
    if (resourceId && time) {
      setDragTarget({ resourceId, time });
    }
  };
  
  // Handle drop on a time slot
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggingAppointment) return;
    
    const target = e.target as HTMLElement;
    const resourceId = parseInt(target.dataset.resourceId || '0');
    const time = parseInt(target.dataset.time || '0');
    
    if (resourceId && time) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const newStartTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      // Simulate API call to update appointment
      toast({
        title: "Appointment Moved",
        description: `${draggingAppointment.patient.firstName} ${draggingAppointment.patient.lastName} moved to ${format(addMinutes(new Date().setHours(0, 0, 0, 0), time), 'h:mm a')}`,
      });
      
      setDraggingAppointment(null);
      setDragTarget(null);
    }
  };
  
  return (
    <div ref={containerRef} className="h-full overflow-auto relative border rounded-md bg-white">
      {/* Time column headers */}
      <div className="grid" style={{ gridTemplateColumns: `70px repeat(${resourceColumns.length}, 1fr)` }}>
        {/* Empty corner cell */}
        <div className="h-[70px] border-b border-r bg-gray-50 sticky top-0 z-20"></div>
        
        {/* Resource column headers */}
        {resourceColumns.map((resource, index) => (
          <div 
            key={resource.id} 
            className="h-[70px] border-b border-r p-2 flex flex-col justify-center items-center text-center sticky top-0 bg-white z-20"
          >
            <div className="font-semibold text-sm">{resource.name}</div>
            <div className="text-xs text-muted-foreground">
              {viewMode === 'PROVIDER' ? 'Provider' : 'Operatory'} {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      {/* Time grid */}
      <div className="grid" style={{ gridTemplateColumns: `70px repeat(${resourceColumns.length}, 1fr)` }}>
        {/* Time labels column */}
        <div className="sticky left-0 bg-gray-50 z-10">
          {timeSlots.map((slot, index) => (
            <div 
              key={index} 
              className={`
                relative border-b border-r
                ${slot.isMajor ? 'font-semibold' : ''}
                ${slot.isMajor ? 'bg-gray-100' : ''}
              `}
              style={{ height: `${slotHeight}px` }}
            >
              {slot.isMajor && (
                <div className="absolute left-2 text-xs">{slot.label}</div>
              )}
            </div>
          ))}
        </div>
        
        {/* Resource columns with time slots */}
        {resourceColumns.map((resource, columnIndex) => {
          return (
            <div key={resource.id} className="relative">
              {/* Time slots for this resource column */}
              {timeSlots.map((slot, slotIndex) => (
                <div 
                  key={slotIndex}
                  className={`
                    relative border-b border-r 
                    ${slot.isMajor ? 'border-gray-300' : 'border-gray-200'}
                    ${slot.isMajor ? 'bg-gray-50' : ''}
                    ${slot.isMedium ? 'border-dashed' : ''}
                    ${dragTarget?.resourceId === resource.id && dragTarget?.time === slot.time ? 'bg-blue-100' : ''}
                    hover:bg-blue-50/50
                  `}
                  style={{ height: `${slotHeight}px` }}
                  data-resource-id={resource.id}
                  data-time={slot.time}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (!draggingAppointment) {
                      // Could handle slot click here to create new appointment
                    }
                  }}
                ></div>
              ))}
              
              {/* Appointments for this resource column */}
              {(appointmentsByResource[resource.id] || []).map((appointment) => (
                <AppointmentChip
                  key={appointment.id}
                  appointment={appointment}
                  columnIndex={columnIndex}
                  slotHeight={slotHeight}
                  onClick={() => handleAppointmentClick(appointment)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}