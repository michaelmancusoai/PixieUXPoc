import { useEffect, useState } from 'react';
import { format, formatDistance, parseISO, differenceInMinutes, differenceInSeconds, isSameDay } from 'date-fns';
import { AppointmentWithDetails } from '@shared/schema';
import { BUSINESS_START_HOUR, MINS_IN_HOUR } from './constants';

// Convert time string to minutes from midnight
export function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * MINS_IN_HOUR + minutes;
}

// Convert minutes from midnight to formatted time string
export function getTimeFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / MINS_IN_HOUR);
  const mins = minutes % MINS_IN_HOUR;
  return format(new Date().setHours(hours, mins), 'h:mm a');
}

// Calculate appointment position in the calendar grid
export function getAppointmentPosition(appointment: AppointmentWithDetails, slotHeight: number) {
  // Parse start time
  let hours = 0, minutes = 0;
  
  try {
    if (typeof appointment.startTime === 'string') {
      if (appointment.startTime.includes('T')) {
        // Handle ISO date format
        const date = parseISO(appointment.startTime);
        hours = date.getHours();
        minutes = date.getMinutes();
      } else {
        // Handle HH:MM:SS format
        const timeParts = appointment.startTime.split(':');
        if (timeParts.length >= 2) {
          hours = parseInt(timeParts[0], 10);
          minutes = parseInt(timeParts[1], 10);
        }
      }
    } else if (appointment.startTime instanceof Date) {
      // Handle Date object
      hours = appointment.startTime.getHours();
      minutes = appointment.startTime.getMinutes();
    }
    
    // Calculate minutes from calendar start (8:00 AM)
    const calendarStartHour = BUSINESS_START_HOUR; // Calendar starts at business hours
    const calendarStartMinutes = calendarStartHour * MINS_IN_HOUR;
    const appointmentStartMinutes = hours * MINS_IN_HOUR + minutes;
    const minutesFromStart = appointmentStartMinutes - calendarStartMinutes;
    
    // Calculate top position and height
    const top = (minutesFromStart / 5) * slotHeight; // 5-minute intervals
    const height = Math.max((appointment.duration / 5) * slotHeight, slotHeight); // Ensure minimum height
    
    return { top, height };
  } catch (error) {
    console.error("Error calculating appointment position:", error, appointment);
    return { top: 0, height: slotHeight * 2 };
  }
}

// Snap time to nearest time slot (5-minute intervals)
export function snapToTimeSlot(minutes: number, slotSize = 5): number {
  return Math.round(minutes / slotSize) * slotSize;
}

// Format appointment timing details
export function getAppointmentTiming(appointment: AppointmentWithDetails): string {
  try {
    let hours = 0, minutes = 0;
    
    if (typeof appointment.startTime === 'string') {
      if (appointment.startTime.includes('T')) {
        // Handle ISO date format
        const date = parseISO(appointment.startTime);
        hours = date.getHours();
        minutes = date.getMinutes();
      } else {
        // Handle HH:MM:SS format
        const timeParts = appointment.startTime.split(':');
        if (timeParts.length >= 2) {
          hours = parseInt(timeParts[0], 10);
          minutes = parseInt(timeParts[1], 10);
        }
      }
    } else if (appointment.startTime instanceof Date) {
      // Handle Date object
      hours = appointment.startTime.getHours();
      minutes = appointment.startTime.getMinutes();
    }
    
    const start = format(new Date().setHours(hours, minutes), 'h:mm a');
    
    const endHours = Math.floor((hours * 60 + minutes + appointment.duration) / 60);
    const endMinutes = (minutes + appointment.duration) % 60;
    const end = format(new Date().setHours(endHours, endMinutes), 'h:mm a');
    
    return `${start} - ${end}`;
  } catch (error) {
    console.error("Error formatting appointment timing:", error, appointment);
    return "00:00 - 00:00";
  }
}

// Get staggering information for overlapping appointments
export function getAppointmentStaggering(
  appointment: AppointmentWithDetails,
  resourceAppointments: AppointmentWithDetails[],
  staggerAmount = 8 // Stagger by 8px by default
) {
  // Group appointments by start time
  const timeGroupedAppointments: Record<string, AppointmentWithDetails[]> = {};
  
  resourceAppointments.forEach(apt => {
    // Convert appointment start time to a consistent string format for grouping
    let startHour = 0, startMinute = 0;
    
    if (typeof apt.startTime === 'string') {
      if (apt.startTime.includes('T')) {
        const date = parseISO(apt.startTime);
        startHour = date.getHours();
        startMinute = date.getMinutes();
      } else {
        const timeParts = apt.startTime.split(':');
        if (timeParts.length >= 2) {
          startHour = parseInt(timeParts[0], 10);
          startMinute = parseInt(timeParts[1], 10);
        }
      }
    } else if (apt.startTime instanceof Date) {
      startHour = apt.startTime.getHours();
      startMinute = apt.startTime.getMinutes();
    }
    
    // Use hour:minute as key
    const timeKey = `${startHour}:${startMinute}`;
    
    if (!timeGroupedAppointments[timeKey]) {
      timeGroupedAppointments[timeKey] = [];
    }
    
    timeGroupedAppointments[timeKey].push(apt);
  });
  
  // Find this appointment's time key
  let thisStartHour = 0, thisStartMinute = 0;
  
  if (typeof appointment.startTime === 'string') {
    if (appointment.startTime.includes('T')) {
      const date = parseISO(appointment.startTime);
      thisStartHour = date.getHours();
      thisStartMinute = date.getMinutes();
    } else {
      const timeParts = appointment.startTime.split(':');
      if (timeParts.length >= 2) {
        thisStartHour = parseInt(timeParts[0], 10);
        thisStartMinute = parseInt(timeParts[1], 10);
      }
    }
  } else if (appointment.startTime instanceof Date) {
    thisStartHour = appointment.startTime.getHours();
    thisStartMinute = appointment.startTime.getMinutes();
  }
  
  const thisTimeKey = `${thisStartHour}:${thisStartMinute}`;
  const overlappingAppointments = timeGroupedAppointments[thisTimeKey] || [];
  
  // Find this appointment's index in the overlapping appointments
  const overlapIndex = overlappingAppointments.findIndex(apt => apt.id === appointment.id);
  const overlappingCount = overlappingAppointments.length;
  
  // Calculate staggering
  const leftOffset = overlappingCount > 1 ? (overlapIndex * staggerAmount) : 0;
  const widthReduction = overlappingCount > 1 ? ((overlappingCount - 1) * staggerAmount) : 0;
  const zIndex = 5 + overlapIndex; // Higher z-index for later overlapping appointments
  
  return { leftOffset, widthReduction, zIndex, overlapIndex, overlappingCount };
}

// Countdown timer component
export function CountdownTimer({ expiryTime }: { expiryTime: Date }) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetTime = new Date(expiryTime);
      
      if (targetTime <= now) {
        setTimeLeft('Expired');
        return;
      }
      
      const secondsDiff = differenceInSeconds(targetTime, now);
      
      if (secondsDiff < 60) {
        setTimeLeft(`${secondsDiff}s`);
      } else if (secondsDiff < 3600) {
        const minutes = Math.floor(secondsDiff / 60);
        const seconds = secondsDiff % 60;
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        const hours = Math.floor(secondsDiff / 3600);
        const minutes = Math.floor((secondsDiff % 3600) / 60);
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [expiryTime]);
  
  return timeLeft;
}
