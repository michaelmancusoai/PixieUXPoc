import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { AppointmentWithDetails, ViewModeType, ViewMode, AppointmentStatus } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from './use-toast';

export function useScheduling() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewModeType>(ViewMode.DAY);
  
  // Get relevant dates based on view mode
  const relevantDates = useCallback(() => {
    if (viewMode === ViewMode.DAY) {
      return [format(selectedDate, 'yyyy-MM-dd')];
    } else if (viewMode === ViewMode.WEEK) {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end }).map(date => format(date, 'yyyy-MM-dd'));
    }
    return [format(selectedDate, 'yyyy-MM-dd')];
  }, [selectedDate, viewMode]);

  // Navigation functions
  const goToNextDay = useCallback(() => {
    setSelectedDate(prev => addDays(prev, 1));
  }, []);

  const goToPreviousDay = useCallback(() => {
    setSelectedDate(prev => subDays(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const goToNextWeek = useCallback(() => {
    setSelectedDate(prev => addDays(prev, 7));
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setSelectedDate(prev => subDays(prev, 7));
  }, []);

  // Fetch appointments based on view and selected date
  const { data: appointments, isLoading: isLoadingAppointments, refetch: refetchAppointments } = useQuery({
    queryKey: ['/api/appointments', ...relevantDates(), viewMode],
    enabled: true,
  });

  // Update appointment status
  const updateAppointmentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: AppointmentStatus }) => {
      return await apiRequest('PATCH', `/api/appointments/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: 'Status Updated',
        description: 'Appointment status has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update appointment status: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Move appointment (time or resource)
  const moveAppointmentMutation = useMutation({
    mutationFn: async ({ 
      id, 
      date,
      startTime,
      operatoryId,
      providerId 
    }: { 
      id: number, 
      date?: string,
      startTime?: string,
      operatoryId?: number,
      providerId?: number
    }) => {
      return await apiRequest('PATCH', `/api/appointments/${id}`, { 
        date,
        startTime,
        operatoryId,
        providerId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: 'Appointment Moved',
        description: 'Appointment has been rescheduled successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to move appointment: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Create new appointment
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      return await apiRequest('POST', '/api/appointments', appointmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: 'Appointment Created',
        description: 'New appointment has been scheduled successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create appointment: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Filter appointments for the current view
  const visibleAppointments = useCallback(() => {
    if (!appointments) return [];

    if (viewMode === ViewMode.DAY) {
      return appointments.filter((apt: AppointmentWithDetails) => 
        format(new Date(apt.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      );
    } else if (viewMode === ViewMode.WEEK) {
      return appointments;
    }
    
    return appointments;
  }, [appointments, selectedDate, viewMode]);

  return {
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    appointments: visibleAppointments(),
    isLoadingAppointments,
    refetchAppointments,
    goToNextDay,
    goToPreviousDay,
    goToToday,
    goToNextWeek,
    goToPreviousWeek,
    updateAppointmentStatus: updateAppointmentStatusMutation.mutate,
    moveAppointment: moveAppointmentMutation.mutate,
    createAppointment: createAppointmentMutation.mutate,
  };
}
