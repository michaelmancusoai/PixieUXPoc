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
  const startTimeStr = appointment.startTime.toString();
  const [hours, minutes] = startTimeStr.split(':').map(Number);
  
  // Calculate minutes from calendar start (7:00 AM)
  const calendarStartHour = 7; // Calendar starts at 7:00 AM
  const calendarStartMinutes = calendarStartHour * MINS_IN_HOUR;
  const appointmentStartMinutes = hours * MINS_IN_HOUR + (minutes || 0);
  const minutesFromStart = appointmentStartMinutes - calendarStartMinutes;
  
  // TIME_SLOT is 5 minutes, so we divide minutesFromStart by 5 to get the number of slots
  // and multiply by slotHeight to get the pixel position
  const top = Math.round((minutesFromStart / 5) * slotHeight);
  const height = Math.round((appointment.duration / 5) * slotHeight);
  
  return { top, height };
}

// Snap time to nearest time slot (5-minute intervals)
export function snapToTimeSlot(minutes: number, slotSize = 5): number {
  return Math.round(minutes / slotSize) * slotSize;
}

// Format appointment timing details
export function getAppointmentTiming(appointment: AppointmentWithDetails): string {
  const startTimeStr = appointment.startTime.toString();
  const [hours, minutes] = startTimeStr.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    return 'Invalid time';
  }
  
  // Create date objects to handle time formatting properly
  const startDate = new Date();
  startDate.setHours(hours, minutes || 0, 0);
  const start = format(startDate, 'h:mm a');
  
  // Calculate end time by adding duration
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + appointment.duration);
  const end = format(endDate, 'h:mm a');
  
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
