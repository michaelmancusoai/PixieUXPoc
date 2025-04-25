import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { ViewModeType, AppointmentWithDetails, AppointmentStatus } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { format, addMinutes, isEqual, isSameDay, parseISO } from "date-fns";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import AppointmentChip from "./AppointmentChip";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { HOURS_IN_DAY, MINS_IN_HOUR, TIME_SLOT, BUSINESS_START_HOUR } from "@/lib/constants";
import { 
  getTimeFromMinutes, 
  getAppointmentPosition, 
  snapToTimeSlot,
  getAppointmentTiming 
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
  const [resourceColumns, setResourceColumns] = useState<Array<{id: number, name: string}>>([]);
  const [draggingAppointment, setDraggingAppointment] = useState<AppointmentWithDetails | null>(null);
  const [dragTarget, setDragTarget] = useState<{resourceId: number, time: number} | null>(null);

  // Fetch resources (operatories or providers) based on view mode
  const { data: resources = [] } = useQuery<Array<{id: number, name: string}>>({
    queryKey: [viewMode === 'PROVIDER' ? '/api/providers' : '/api/operatories'],
    enabled: true,
  });

  // Use hardcoded sample appointments for the demo
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  // Helper function to determine status based on appointment time
  const getStatusBasedOnTime = (timeString: string): string => {
    const hourMinutes = timeString.split(':').map(Number);
    const hour = hourMinutes[0];
    
    if (hour < 12) {
      return "completed"; // Before noon: completed
    } else if (hour < 14) {
      return "in_chair"; // 1-2pm: in progress/in chair
    } else if (hour < 15) {
      return "checked_in"; // 2-3pm: checked in
    } else {
      return "confirmed"; // After 3pm: scheduled or confirmed
    }
  };
  
  // Hard-coded sample appointments for the demo calendar
  const demoAppointments: any[] = [
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
      confirmedAt: null,
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
      confirmedAt: null,
      arrivedAt: null,
      chairStartedAt: null,
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
      confirmedAt: null,
      arrivedAt: null,
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
      confirmedAt: null,
      arrivedAt: null,
      chairStartedAt: null,
      completedAt: null
    },
    {
      id: 8,
      patientId: 8,
      patient: { id: 8, firstName: "Lisa", lastName: "Thomas", avatarInitials: "LT", dateOfBirth: null, insuranceProvider: "Aetna", allergies: null, balanceDue: 0 },
      providerId: 3,
      provider: { id: 3, name: "Dr. Johnson", role: "Dentist", color: "#FFE082" },
      operatoryId: 3,
      operatory: { id: 3, name: "Op 3", color: "#FFF1C2" },
      date: selectedDate,
      startTime: "08:00:00",
      endTime: null,
      duration: 120,
      durationMinutes: null,
      status: "confirmed",
      procedure: "Crown - Full Cast High Noble Metal",
      cdtCode: "D2790",
      isVerified: null,
      confirmedAt: null,
      arrivedAt: null,
      chairStartedAt: null,
      completedAt: null
    },
    {
      id: 9,
      patientId: 9,
      patient: { id: 9, firstName: "James", lastName: "Brown", avatarInitials: "JB", dateOfBirth: null, insuranceProvider: "Delta Dental", allergies: null, balanceDue: 0 },
      providerId: 3,
      provider: { id: 3, name: "Dr. Johnson", role: "Dentist", color: "#FFE082" },
      operatoryId: 3,
      operatory: { id: 3, name: "Op 3", color: "#FFF1C2" },
      date: selectedDate,
      startTime: "11:00:00",
      endTime: null,
      duration: 90,
      durationMinutes: null,
      status: "scheduled",
      procedure: "Anterior Root Canal",
      cdtCode: "D3310",
      isVerified: null,
      confirmedAt: null,
      arrivedAt: null,
      chairStartedAt: null,
      completedAt: null
    },
    {
      id: 10,
      patientId: 10,
      patient: { id: 10, firstName: "Jessica", lastName: "Garcia", avatarInitials: "JG", dateOfBirth: null, insuranceProvider: "Cigna", allergies: null, balanceDue: 0 },
      providerId: 3,
      provider: { id: 3, name: "Dr. Johnson", role: "Dentist", color: "#FFE082" },
      operatoryId: 3,
      operatory: { id: 3, name: "Op 3", color: "#FFF1C2" },
      date: selectedDate,
      startTime: "14:30:00",
      endTime: null,
      duration: 45,
      durationMinutes: null,
      status: "scheduled",
      procedure: "Prophylaxis - Adult",
      cdtCode: "D1110",
      isVerified: null,
      confirmedAt: null,
      arrivedAt: null,
      chairStartedAt: null,
      completedAt: null
    },
    {
      id: 11,
      patientId: 11,
      patient: { id: 11, firstName: "William", lastName: "Jackson", avatarInitials: "WJ", dateOfBirth: null, insuranceProvider: "Guardian", allergies: null, balanceDue: 3000 },
      providerId: 4,
      provider: { id: 4, name: "Dr. Maria", role: "Dentist", color: "#C5E1A5" },
      operatoryId: 4,
      operatory: { id: 4, name: "Op 4", color: "#D6EEDA" },
      date: selectedDate,
      startTime: "09:30:00",
      endTime: null,
      duration: 60,
      durationMinutes: null,
      status: "scheduled",
      procedure: "Resin-Based Composite - One Surface",
      cdtCode: "D2391",
      isVerified: null,
      confirmedAt: null,
      arrivedAt: null,
      chairStartedAt: null,
      completedAt: null
    },
    {
      id: 12,
      patientId: 12,
      patient: { id: 12, firstName: "Linda", lastName: "Lewis", avatarInitials: "LL", dateOfBirth: null, insuranceProvider: "Delta Dental", allergies: null, balanceDue: 0 },
      providerId: 3,
      provider: { id: 3, name: "Dr. Johnson", role: "Dentist", color: "#FFE082" },
      operatoryId: 3,
      operatory: { id: 3, name: "Op 3", color: "#FFF1C2" },
      date: selectedDate,
      startTime: "16:00:00",
      endTime: null,
      duration: 30,
      durationMinutes: null,
      status: "scheduled",
      procedure: "Prophylaxis - Adult",
      cdtCode: "D1110",
      isVerified: null,
      confirmedAt: null,
      arrivedAt: null,
      chairStartedAt: null,
      completedAt: null
    },
    {
      id: 13,
      patientId: 13,
      patient: { id: 13, firstName: "Richard", lastName: "Walker", avatarInitials: "RW", dateOfBirth: null, insuranceProvider: "Cigna", allergies: null, balanceDue: 0 },
      providerId: 4,
      provider: { id: 4, name: "Dr. Maria", role: "Dentist", color: "#C5E1A5" },
      operatoryId: 4,
      operatory: { id: 4, name: "Op 4", color: "#D6EEDA" },
      date: selectedDate,
      startTime: "15:00:00",
      endTime: null,
      duration: 60,
      durationMinutes: null,
      status: "confirmed",
      procedure: "Bitewings - Four Films",
      cdtCode: "D0274",
      isVerified: null,
      confirmedAt: null,
      arrivedAt: null,
      chairStartedAt: null,
      completedAt: null
    },
    {
      id: 14,
      patientId: 14,
      patient: { id: 14, firstName: "Elizabeth", lastName: "Rodriguez", avatarInitials: "ER", dateOfBirth: null, insuranceProvider: "MetLife", allergies: null, balanceDue: 0 },
      providerId: 3,
      provider: { id: 3, name: "Dr. Johnson", role: "Dentist", color: "#FFE082" },
      operatoryId: 3,
      operatory: { id: 3, name: "Op 3", color: "#FFF1C2" },
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
    }
  ];

  // Update appointment statuses based on time
  const updatedAppointments = demoAppointments.map(apt => ({
    ...apt,
    status: getStatusBasedOnTime(apt.startTime),
    // Add timestamps for status-related fields to enable timers
    confirmedAt: apt.status === "confirmed" ? new Date(new Date().getTime() - 1000 * 60 * 30) : null, // 30 mins ago
    arrivedAt: apt.status === "checked_in" || apt.status === "in_chair" || apt.status === "completed" ? 
      new Date(new Date().getTime() - 1000 * 60 * 45) : null, // 45 mins ago
    chairStartedAt: apt.status === "in_chair" || apt.status === "completed" ? 
      new Date(new Date().getTime() - 1000 * 60 * 15) : null, // 15 mins ago
    completedAt: apt.status === "completed" ? 
      new Date(new Date().getTime() - 1000 * 60 * 5) : null // 5 mins ago
  }));

  // For any other date, don't show appointments (or could clone to other days if desired)
  const appointments = updatedAppointments;
  const refetchAppointments = () => console.log("Refetching appointments...");
  
  // Log appointments for debugging
  useEffect(() => {
    if (appointments.length > 0) {
      const dateStr = format(selectedDate, 'MMM dd, yyyy');
      console.log(`Loaded ${appointments.length} appointments for ${dateStr}`);
    }
  }, [appointments.length, selectedDate]);

  // Set up resource columns when resources are loaded
  useEffect(() => {
    if (resources && resources.length > 0) {
      setResourceColumns(resources);
    } else {
      // Default columns if data isn't loaded yet
      setResourceColumns([
        { id: 1, name: 'Op 1' },
        { id: 2, name: 'Op 2' },
        { id: 3, name: 'Op 3' },
        { id: 4, name: 'Op 4' }
      ]);
    }
  }, [resources]);

  // Generate time slots for the day (5-minute intervals)
  const timeSlots = useMemo(() => {
    const slots = [];
    const totalMinutes = HOURS_IN_DAY * MINS_IN_HOUR;
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

  // Calculate a larger time slot height to fill the available space 
  // while maintaining the same grid structure
  const calculateTimeSlotHeight = () => {
    // We want to display 12 hours (7am-7pm) in the visible area
    const hoursToShow = 12;
    // Number of 5-minute slots in those hours
    const totalSlots = (hoursToShow * 60) / TIME_SLOT;
    // Calculate available height (minus some padding for header)
    const availableHeight = window.innerHeight - 150;
    // Divide available height by number of slots to get optimal slot height
    return Math.max(Math.floor(availableHeight / totalSlots), TIME_SLOT);
  };
  
  // Use a taller time slot to better fill the screen
  const EXPANDED_TIME_SLOT = calculateTimeSlotHeight();
  
  // Set up virtualization for time slots
  const rowVirtualizer = useVirtualizer({
    count: timeSlots.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => EXPANDED_TIME_SLOT,
    overscan: 10,
  });

  // Handle appointment drag monitoring
  useDndMonitor({
    onDragStart(event) {
      const { active } = event;
      const appointmentId = active.id as number;
      
      if (appointments) {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (appointment) {
          setDraggingAppointment(appointment);
        }
      }
    },
    onDragMove(event) {
      if (!containerRef.current || !draggingAppointment) return;
      
      const { active, over } = event;
      if (over) {
        const [resourceId, timeString] = (over.id as string).split('-');
        const time = parseInt(timeString, 10);
        
        setDragTarget({
          resourceId: parseInt(resourceId, 10),
          time: snapToTimeSlot(time)
        });
      }
    },
    onDragEnd(event) {
      const { active, over } = event;
      
      if (over && draggingAppointment) {
        const [resourceId, timeString] = (over.id as string).split('-');
        const time = parseInt(timeString, 10);
        const snappedTime = snapToTimeSlot(time);
        
        // Determine the new resource and time
        const newResourceId = parseInt(resourceId, 10);
        const newTimeSlot = snappedTime;
        
        // Make API call to update appointment
        updateAppointment(draggingAppointment.id, newResourceId, newTimeSlot);
      }
      
      setDraggingAppointment(null);
      setDragTarget(null);
    },
  });

  // Handle appointment update
  const updateAppointment = async (
    appointmentId: number, 
    newResourceId: number, 
    newTimeMinutes: number
  ) => {
    try {
      // Convert time to proper format
      const hours = Math.floor(newTimeMinutes / 60);
      const minutes = newTimeMinutes % 60;
      const newTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      const resourceField = viewMode === 'PROVIDER' ? 'providerId' : 'operatoryId';
      
      await apiRequest('PATCH', `/api/appointments/${appointmentId}`, {
        [resourceField]: newResourceId,
        startTime: newTime
      });
      
      // Refetch appointments to update the view
      refetchAppointments();
      
      toast({
        title: "Appointment Updated",
        description: "The appointment has been successfully rescheduled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate the position for the current time indicator (1:15 PM)
  const getCurrentTimePosition = () => {
    // Set to 1:15 PM (13 hours and 15 minutes)
    const currentTime = 13 * 60 + 15; // 1:15 PM in minutes
    
    // Calculate the position relative to calendar start time (7 AM = 7 * 60 = 420 minutes)
    // Using 7:00 AM instead of 8:00 AM since the calendar starts at 7:00 AM in the UI
    const calendarStartHour = 7; // 7:00 AM (actual start of visible calendar)
    const calendarStartTime = calendarStartHour * 60; // 7:00 AM in minutes
    const minutesFromStart = currentTime - calendarStartTime;
    
    // Convert to pixels (each row represents TIME_SLOT minutes)
    // The position is based on rows, where each row is EXPANDED_TIME_SLOT px tall
    return (minutesFromStart / TIME_SLOT) * EXPANDED_TIME_SLOT;
  };
  
  // Position of the current time indicator
  const currentTimePosition = getCurrentTimePosition();
  
  // Render virtual time grid
  const virtualTimeSlots = rowVirtualizer.getVirtualItems();
  
  return (
    <Card className="bg-white shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div 
        className="grid border-b sticky top-0 z-10 bg-gray-50" 
        style={{ 
          gridTemplateColumns: `60px repeat(${resourceColumns.length}, 1fr)` 
        }}
      >
        <div className="p-2 font-medium text-center text-sm">Time</div>
        {resourceColumns.map(resource => (
          <div key={resource.id} className="p-2 font-medium text-center border-l">
            <span className="text-sm">{resource.name}</span>
            <div className="text-xs text-gray-500 mt-0.5">
              {viewMode === 'PROVIDER' ? 'Provider' : 'Operatory'}
            </div>
          </div>
        ))}
      </div>
      
      {/* Calendar Content */}
      <div ref={containerRef} className="relative overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: `60px repeat(${resourceColumns.length}, 1fr)`,
            height: rowVirtualizer.getTotalSize(),
          }}
        >
          {/* Time Labels Column */}
          <div className="sticky left-0 z-10 bg-gray-50">
            {virtualTimeSlots.map(virtualRow => {
              const timeSlot = timeSlots[virtualRow.index];
              return timeSlot.isMajor ? (
                <div
                  key={virtualRow.index}
                  className="text-xs text-right pr-2 font-medium text-gray-700 border-b border-gray-200"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${EXPANDED_TIME_SLOT}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}
                >
                  {format(addMinutes(new Date().setHours(0, 0, 0, 0), timeSlot.time), 'h:mm a')}
                </div>
              ) : null;
            })}
          </div>
          
          {/* Resource Columns */}
          {resourceColumns.map((resource, colIndex) => (
            <div
              key={resource.id}
              className="relative border-l"
            >
              {/* Current time indicator (1:15 PM) - positioned with lower z-index so it appears behind appointments */}
              <div 
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  top: `${currentTimePosition}px`,
                  height: '3px',
                  backgroundColor: '#ef4444', // Red line
                  zIndex: 1, // Lower z-index to ensure it appears behind appointments
                  boxShadow: '0 0 4px rgba(239, 68, 68, 0.6)', // Add glow effect to make it more visible
                }}
              >
                {/* Time indicator circle */}
                {colIndex === 0 && (
                  <div 
                    className="absolute -left-1 -top-2 w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-md flex items-center justify-center"
                    style={{ zIndex: 2 }} // Just enough to appear above the line
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
              
              {/* Time grid lines */}
              {virtualTimeSlots.map(virtualRow => {
                const timeSlot = timeSlots[virtualRow.index];
                return (
                  <div
                    key={virtualRow.index}
                    className={`absolute left-0 right-0 ${
                      timeSlot.isMajor 
                        ? 'border-b border-gray-300 bg-gray-50/30' 
                        : timeSlot.isMedium 
                          ? 'border-b border-gray-200'
                          : timeSlot.isMinor
                            ? 'border-b border-gray-200/70'
                            : 'border-b border-gray-100/50'
                    }`}
                    style={{
                      top: `${virtualRow.start}px`,
                      height: `${EXPANDED_TIME_SLOT}px`,
                    }}
                  >
                    {/* Drop target zone */}
                    <DropTimeSlot
                      resourceId={resource.id}
                      time={timeSlot.time}
                      isOver={
                        dragTarget?.resourceId === resource.id && 
                        dragTarget?.time === timeSlot.time
                      }
                    />
                  </div>
                );
              })}
              
              {/* Appointments */}
              {appointments
                .filter(apt => {
                  // Check if appointment belongs to this resource (operatory or provider)
                  const resourceMatch = viewMode === 'PROVIDER' ? 
                    apt.providerId === resource.id : 
                    apt.operatoryId === resource.id;
                  
                  // Check if appointment is on the selected date
                  // If apt.date is already a Date object, use it directly
                  const aptDate = typeof apt.date === 'string' || apt.date instanceof String 
                    ? parseISO(apt.date.toString()) 
                    : apt.date;
                  
                  const dateMatch = isSameDay(aptDate, selectedDate);
                  
                  return resourceMatch && dateMatch;
                })
                .map(appointment => {
                  const { top, height } = getAppointmentPosition(appointment, EXPANDED_TIME_SLOT);
                  
                  // Get appointment color based on status - hardcoded for demo
                  const getAppointmentColor = (status: string) => {
                    switch(status) {
                      case "confirmed": return "#bfdbfe"; // Blue
                      case "checked_in": return "#d1fae5"; // Green
                      case "in_chair": return "#e0f2fe"; // Light blue
                      case "completed": return "#f1f5f9"; // Light gray
                      default: return "#dbeafe"; // Default blue
                    }
                  };
                  
                  // Get the color for time-based status
                  const getColorBasedOnTime = (startTimeStr: string) => {
                    const [hours] = startTimeStr.split(':').map(Number);
                    if (hours < 12) return "#f1f5f9"; // Before noon: completed (light gray)
                    if (hours < 14) return "#e0f2fe"; // 1-2 PM: in progress (light blue)
                    if (hours < 15) return "#d1fae5"; // 2-3 PM: checked in (green)
                    return "#bfdbfe"; // After 3 PM: scheduled/confirmed (blue)
                  };
                  
                  // Apply time-based colors for the demo instead of using status
                  const backgroundColor = getColorBasedOnTime(appointment.startTime);
                  
                  // Get the correct status from time for demo purposes
                  let timeStatus = "SCHEDULED"; // Default status
                  
                  // Extract hours for time-based status
                  const [hours] = appointment.startTime.split(':').map(Number);
                  if (hours < 12) timeStatus = "COMPLETED";
                  else if (hours < 14) timeStatus = "IN_PROGRESS";
                  else if (hours < 15) timeStatus = "CHECKED_IN";
                  else timeStatus = "CONFIRMED";
                  
                  // Clone appointment with modified status for demo
                  const apptWithTimeStatus = {
                    ...appointment,
                    status: timeStatus
                  };
                  
                  // Get the color for the appointment status
                  // Border colors for appointments - matching what we saw in the screenshot
                  const getStatusBorderColor = (status: string) => {
                    switch(status) {
                      case "COMPLETED": return "#94a3b8"; // Gray
                      case "IN_PROGRESS": return "#0284c7"; // Blue
                      case "IN_CHAIR": return "#0284c7"; // Blue (synonym for IN_PROGRESS)
                      case "CHECKED_IN": return "#10b981"; // Green
                      case "CONFIRMED": return "#3b82f6"; // Light blue
                      case "SCHEDULED": return "#3b82f6"; // Light blue
                      default: return "#3b82f6"; // Default blue
                    }
                  };
                  
                  const borderColor = getStatusBorderColor(timeStatus);
                  
                  return (
                    <AppointmentChip
                      key={appointment.id}
                      appointment={apptWithTimeStatus}
                      style={{
                        position: 'absolute',
                        top: `${top}px`,
                        left: '4px',
                        right: '4px',
                        height: `${height}px`,
                        zIndex: 5,
                        padding: '0.25rem',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        borderLeftWidth: '3px',
                        borderLeftStyle: 'solid',
                        borderLeftColor: borderColor,
                        borderTop: 'none',
                        borderRight: 'none',
                        borderBottom: 'none'
                      }}
                    />
                  );
                })
              }
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
