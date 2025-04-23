import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek, addDays, addWeeks, subWeeks, startOfDay, endOfDay, isSameDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookAppointmentDialog } from './BookAppointmentDialog';
import { AppointmentWithDetails, AppointmentStatus } from '@shared/schema';
import { cn } from '@/lib/utils';

// TimeSlot component represents a single 30-minute slot in the schedule
const TimeSlot = ({ 
  time, 
  date,
  appointments, 
  providerId, 
  operatoryId, 
  onAddAppointment 
}: { 
  time: string; 
  date: Date;
  appointments: AppointmentWithDetails[]; 
  providerId?: number;
  operatoryId?: number;
  onAddAppointment: (time: string, date: Date, providerId?: number, operatoryId?: number) => void;
}) => {
  // Check if there's an appointment in this time slot
  const appointment = appointments.find(
    (apt) => 
      format(new Date(apt.startTime), 'HH:mm') === time && 
      isSameDay(new Date(apt.date), date) &&
      (providerId ? apt.providerId === providerId : true) &&
      (operatoryId ? apt.operatoryId === operatoryId : true)
  );

  // Get status color based on appointment status
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'SCHEDULED': 'bg-blue-50 border-blue-200 text-blue-700',
      'CONFIRMED': 'bg-emerald-50 border-emerald-200 text-emerald-700',
      'CHECKED_IN': 'bg-indigo-50 border-indigo-200 text-indigo-700',
      'SEATED': 'bg-purple-50 border-purple-200 text-purple-700',
      'IN_CHAIR': 'bg-amber-50 border-amber-200 text-amber-700',
      'WRAP_UP': 'bg-orange-50 border-orange-200 text-orange-700',
      'COMPLETED': 'bg-green-50 border-green-200 text-green-700',
      'CANCELED': 'bg-red-50 border-red-200 text-red-700',
      'NO_SHOW': 'bg-slate-50 border-slate-200 text-slate-700',
    };
    return statusColors[status] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  return (
    <div 
      className={cn(
        "border p-1 min-h-[60px] relative",
        appointment 
          ? getStatusColor(appointment.status) 
          : "hover:bg-gray-50 cursor-pointer"
      )}
      onClick={() => !appointment && onAddAppointment(time, date, providerId, operatoryId)}
    >
      {appointment ? (
        <div className="text-xs h-full flex flex-col">
          <div className="font-medium">
            {appointment.patient.firstName} {appointment.patient.lastName}
          </div>
          <div>{appointment.title || 'Appointment'}</div>
          <div className="text-gray-500 mt-auto">{format(new Date(appointment.startTime), 'h:mma')} - {format(new Date(appointment.endTime), 'h:mma')}</div>
          
          {appointment.hasAlert && (
            <span className="absolute top-1 right-1 text-red-500">
              <AlertCircle size={12} />
            </span>
          )}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-gray-400">
          <Plus size={16} className="opacity-30" />
        </div>
      )}
    </div>
  );
};

// Day column component - represents a single day in week view
const DayColumn = ({ 
  day, 
  timeSlots, 
  appointments, 
  providerView, 
  provider,
  operatory,
  onAddAppointment 
}: { 
  day: Date; 
  timeSlots: string[]; 
  appointments: AppointmentWithDetails[];
  providerView?: boolean;
  provider?: { id: number; name: string };
  operatory?: { id: number; name: string };
  onAddAppointment: (time: string, date: Date, providerId?: number, operatoryId?: number) => void;
}) => {
  const isToday = isSameDay(day, new Date());
  const dayAppointments = appointments.filter(apt => 
    isSameDay(new Date(apt.date), day) && 
    (providerView && provider ? apt.providerId === provider.id : true) &&
    (!providerView && operatory ? apt.operatoryId === operatory.id : true)
  );
  
  return (
    <div className="flex flex-col flex-1">
      <div className={cn(
        "text-center py-2 font-medium border-b sticky top-0 bg-white z-10",
        isToday ? "bg-blue-50 text-blue-700" : ""
      )}>
        <div className="text-xs text-gray-500">{format(day, 'EEE')}</div>
        <div className={isToday ? "text-blue-700" : ""}>{format(day, 'd MMM')}</div>
        
        {(providerView && provider) && (
          <div className="text-xs text-gray-700 mt-1 font-normal">{provider.name}</div>
        )}
        
        {(!providerView && operatory) && (
          <div className="text-xs text-gray-700 mt-1 font-normal">{operatory.name}</div>
        )}
        
        <div className="text-xs mt-1">
          <Badge variant="outline" className="text-xs">
            {dayAppointments.length} appts
          </Badge>
        </div>
      </div>
      <div className="flex-1">
        {timeSlots.map((time, index) => (
          <TimeSlot 
            key={`${format(day, 'yyyy-MM-dd')}-${time}-${index}`} 
            time={time} 
            date={day}
            appointments={dayAppointments} 
            providerId={provider?.id}
            operatoryId={operatory?.id}
            onAddAppointment={onAddAppointment}
          />
        ))}
      </div>
    </div>
  );
};

export const CalendarView = () => {
  // State for current view date and view type
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'week' | 'day'>('week');
  const [view, setView] = useState<'providers' | 'operatories'>('providers');
  const [bookAppointmentOpen, setBookAppointmentOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    time: string;
    date: Date;
    providerId?: number;
    operatoryId?: number;
  } | null>(null);

  // Generate time slots from 8am to 6pm in 30 minute intervals
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Calculate week dates
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['/api/schedule/appointments', format(currentDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      // Get the week range
      const startDate = format(startOfDay(weekStart), 'yyyy-MM-dd');
      const endDate = format(endOfDay(addDays(weekStart, 4)), 'yyyy-MM-dd');
      
      const response = await fetch(`/api/schedule/appointments?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json();
    }
  });

  // Fetch providers
  const { data: providers = [] } = useQuery({
    queryKey: ['/api/providers'],
    queryFn: async () => {
      const response = await fetch('/api/providers');
      if (!response.ok) throw new Error('Failed to fetch providers');
      return response.json();
    }
  });

  // Fetch operatories
  const { data: operatories = [] } = useQuery({
    queryKey: ['/api/operatories'],
    queryFn: async () => {
      const response = await fetch('/api/operatories');
      if (!response.ok) throw new Error('Failed to fetch operatories');
      return response.json();
    }
  });

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());
  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  // Handle adding a new appointment
  const handleAddAppointment = (time: string, date: Date, providerId?: number, operatoryId?: number) => {
    setSelectedSlot({ time, date, providerId, operatoryId });
    setBookAppointmentOpen(true);
  };

  // Return loading state if data is still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">Loading schedule...</div>
      </div>
    );
  }

  return (
    <>
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Schedule</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Tabs defaultValue="week" className="mr-4">
                <TabsList>
                  <TabsTrigger value="day" onClick={() => setViewType('day')}>Day</TabsTrigger>
                  <TabsTrigger value="week" onClick={() => setViewType('week')}>Week</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="font-medium text-sm px-2">
                {format(weekStart, 'd MMM')} - {format(addDays(weekStart, 4), 'd MMM yyyy')}
              </div>
            </div>
            
            <Tabs value={view} onValueChange={(v) => setView(v as 'providers' | 'operatories')}>
              <TabsList>
                <TabsTrigger value="providers">Providers</TabsTrigger>
                <TabsTrigger value="operatories">Operatories</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 overflow-auto">
          <div className="flex h-full border-t">
            {/* Time column */}
            <div className="w-20 flex-shrink-0 border-r">
              <div className="h-12 border-b"></div> {/* Empty cell for alignment */}
              {timeSlots.map((time, index) => (
                <div key={`time-${index}`} className="border-b h-[60px] flex items-center justify-center">
                  <span className="text-xs text-gray-500">{format(new Date(`2000-01-01T${time}`), 'h:mm a')}</span>
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="flex-1 overflow-auto">
              <div className="flex min-w-[800px]">
                {view === 'providers' ? (
                  // Provider view - each column is a day for a specific provider
                  providers.slice(0, 3).map((provider) => (
                    <DayColumn 
                      key={`provider-${provider.id}`}
                      day={currentDate}
                      timeSlots={timeSlots}
                      appointments={appointments}
                      providerView={true}
                      provider={provider}
                      onAddAppointment={handleAddAppointment}
                    />
                  ))
                ) : (
                  // Operatory view - each column is a day for a specific operatory
                  operatories.slice(0, 5).map((operatory) => (
                    <DayColumn 
                      key={`operatory-${operatory.id}`}
                      day={currentDate}
                      timeSlots={timeSlots}
                      appointments={appointments}
                      providerView={false}
                      operatory={operatory}
                      onAddAppointment={handleAddAppointment}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment booking dialog */}
      <BookAppointmentDialog
        open={bookAppointmentOpen}
        onOpenChange={setBookAppointmentOpen}
        selectedSlot={selectedSlot}
        providers={providers}
        operatories={operatories}
      />
    </>
  );
};