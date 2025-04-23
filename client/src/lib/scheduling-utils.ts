import { useEffect, useState } from 'react';
import { format, formatDistance, parseISO, differenceInMinutes, differenceInSeconds } from 'date-fns';
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
  let hours, minutes;
  if (typeof appointment.startTime === 'string') {
    if (appointment.startTime.includes('T')) {
      // Handle ISO date format
      const date = new Date(appointment.startTime);
      hours = date.getHours();
      minutes = date.getMinutes();
    } else {
      // Handle HH:MM:SS format
      [hours, minutes] = appointment.startTime.split(':').map(Number);
    }
  } else {
    // Handle Date object
    const date = new Date(appointment.startTime);
    hours = date.getHours();
    minutes = date.getMinutes();
  }
  
  // Calculate minutes from calendar start (7:00 AM)
  const calendarStartHour = 7; // Updated to match the calendar start time
  const calendarStartMinutes = calendarStartHour * MINS_IN_HOUR;
  const appointmentStartMinutes = hours * MINS_IN_HOUR + minutes;
  const minutesFromStart = appointmentStartMinutes - calendarStartMinutes;
  
  // Calculate top position and height
  const top = (minutesFromStart / 5) * slotHeight;
  const height = (appointment.duration / 5) * slotHeight;
  
  return { top, height };
}

// Snap time to nearest time slot (5-minute intervals)
export function snapToTimeSlot(minutes: number, slotSize = 5): number {
  return Math.round(minutes / slotSize) * slotSize;
}

// Format appointment timing details
export function getAppointmentTiming(appointment: AppointmentWithDetails): string {
  let hours, minutes;
  
  if (typeof appointment.startTime === 'string') {
    if (appointment.startTime.includes('T')) {
      // Handle ISO date format
      const date = new Date(appointment.startTime);
      hours = date.getHours();
      minutes = date.getMinutes();
    } else {
      // Handle HH:MM:SS format
      [hours, minutes] = appointment.startTime.split(':').map(Number);
    }
  } else {
    // Handle Date object
    const date = new Date(appointment.startTime);
    hours = date.getHours();
    minutes = date.getMinutes();
  }
  
  const start = format(new Date().setHours(hours, minutes), 'h:mm a');
  
  const endHours = Math.floor((hours * 60 + minutes + appointment.duration) / 60);
  const endMinutes = (minutes + appointment.duration) % 60;
  const end = format(new Date().setHours(endHours, endMinutes), 'h:mm a');
  
  return `${start} - ${end}`;
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
