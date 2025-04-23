import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Appointment } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

// Status color mapping
const statusColors = {
  confirmed: '#10b981', // green
  pending: '#f59e0b',   // amber
  cancelled: '#ef4444', // red
  completed: '#3b82f6',  // blue
  default: '#6b7280'    // gray
};

// Appointment type color mapping
const appointmentTypeColors = {
  examination: '#8b5cf6',   // purple
  cleaning: '#06b6d4',      // cyan
  surgery: '#f43f5e',       // rose
  consultation: '#0ea5e9',  // sky
  followup: '#84cc16',      // lime
  emergency: '#ef4444',     // red
  default: '#6b7280'        // gray
};

// Form schema for appointment creation/editing
const appointmentFormSchema = z.object({
  patientId: z.number({
    required_error: "Please select a patient",
  }),
  providerId: z.number({
    required_error: "Please select a provider",
  }),
  startTime: z.string({
    required_error: "Start time is required",
  }),
  endTime: z.string({
    required_error: "End time is required",
  }),
  appointmentType: z.string({
    required_error: "Appointment type is required",
  }),
  status: z.string({
    required_error: "Status is required",
  }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface ScheduleCalendarProps {
  view?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  height?: string | number;
}

export default function ScheduleCalendar({ 
  view = 'timeGridWeek',
  height = 'auto'
}: ScheduleCalendarProps) {
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);
  const [isEditAppointmentDialogOpen, setIsEditAppointmentDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: Date, end: Date } | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const { toast } = useToast();

  // Query all appointments
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['/api/appointments'],
    queryFn: async () => {
      // Since we don't have a global appointments endpoint, we'll get from a few patients for demo
      // In a real implementation, we would have a dedicated endpoint for all appointments
      const patientIds = [1, 2, 3, 4, 5]; // Demo patient IDs
      const allAppointments = [];
      
      for (const id of patientIds) {
        const response = await fetch(`/api/patients/${id}/appointments`);
        if (response.ok) {
          const patientAppointments = await response.json();
          allAppointments.push(...patientAppointments);
        }
      }
      
      return allAppointments;
    }
  });

  // Query patients for the form
  const { data: patients = [] } = useQuery({
    queryKey: ['/api/patients'],
    queryFn: async () => {
      const response = await fetch('/api/patients');
      if (!response.ok) throw new Error('Failed to fetch patients');
      return await response.json();
    }
  });

  // For the demo, we'll create some mock providers
  const providers = [
    { id: 1, name: 'Dr. Sarah Johnson' },
    { id: 2, name: 'Dr. Michael Chen' },
    { id: 3, name: 'Dr. Emily Rodriguez' },
  ];

  // Form for creating/editing appointments
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: undefined,
      providerId: undefined,
      startTime: '',
      endTime: '',
      appointmentType: '',
      status: 'pending',
      notes: ''
    }
  });

  // Mutation for creating appointments
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointment: AppointmentFormValues) => {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create appointment');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      patients.forEach(patient => {
        queryClient.invalidateQueries({ queryKey: [`/api/patients/${patient.id}/appointments`] });
      });
      toast({
        title: "Appointment created",
        description: "The appointment has been successfully created",
      });
      setIsNewAppointmentDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create appointment",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle date click for creating new appointments
  const handleDateClick = (info: any) => {
    // Calculate end time (30 minutes after start)
    const startDate = new Date(info.date);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30);
    
    setSelectedTimeSlot({
      start: startDate,
      end: endDate
    });
    
    // Set the form values
    form.setValue('startTime', startDate.toISOString());
    form.setValue('endTime', endDate.toISOString());
    
    setIsNewAppointmentDialogOpen(true);
  };

  // Handle event click for editing appointments
  const handleEventClick = (info: any) => {
    const appointment = appointments.find(apt => apt.id.toString() === info.event.id);
    if (!appointment) return;
    
    setSelectedAppointment(appointment);
    
    // Set the form values for editing
    form.setValue('patientId', appointment.patientId);
    form.setValue('providerId', appointment.providerId || 1);
    form.setValue('startTime', appointment.startTime);
    form.setValue('endTime', appointment.endTime);
    form.setValue('appointmentType', appointment.appointmentType);
    form.setValue('status', appointment.status);
    form.setValue('notes', appointment.notes || '');
    
    setIsEditAppointmentDialogOpen(true);
  };

  // Handle form submission for new appointments
  const onCreateAppointment = (data: AppointmentFormValues) => {
    createAppointmentMutation.mutate(data);
  };

  // Transform appointments data for FullCalendar
  const events = appointments.map(appointment => {
    const typeColor = appointmentTypeColors[appointment.appointmentType as keyof typeof appointmentTypeColors] || 
                      appointmentTypeColors.default;
    const statusColor = statusColors[appointment.status as keyof typeof statusColors] || 
                        statusColors.default;
    
    // Find the patient name
    const patient = patients.find(p => p.id === appointment.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
    
    // Find the provider name
    const provider = providers.find(p => p.id === appointment.providerId);
    const providerName = provider ? provider.name : 'Unassigned';
    
    return {
      id: appointment.id.toString(),
      title: `${patientName} - ${appointment.appointmentType}`,
      start: appointment.startTime,
      end: appointment.endTime,
      backgroundColor: typeColor,
      borderColor: statusColor,
      textColor: '#ffffff',
      extendedProps: {
        patientId: appointment.patientId,
        patientName,
        providerId: appointment.providerId,
        providerName,
        appointmentType: appointment.appointmentType,
        status: appointment.status,
        notes: appointment.notes
      }
    };
  });

  return (
    <div className="h-full bg-white p-4 rounded-md shadow-sm">
      {isLoadingAppointments ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          height={height}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          allDaySlot={true}
          slotDuration="00:15:00"
          slotLabelInterval="01:00"
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
            startTime: '08:00',
            endTime: '18:00',
          }}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: true
          }}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: true
          }}
          nowIndicator={true}
          eventDidMount={(info) => {
            // Add tooltip with additional info
            const tooltip = document.createElement('div');
            tooltip.className = 'calendar-tooltip';
            tooltip.innerHTML = `
              <div class="p-2 bg-gray-900 text-white text-xs rounded shadow-lg">
                <div class="font-bold">${info.event.title}</div>
                <div>Provider: ${info.event.extendedProps.providerName}</div>
                <div>Status: ${info.event.extendedProps.status}</div>
                <div>${format(new Date(info.event.start!), 'MMM d, h:mm a')} - ${format(new Date(info.event.end!), 'h:mm a')}</div>
              </div>
            `;
            
            const onMouseEnter = () => {
              document.body.appendChild(tooltip);
              
              const rect = info.el.getBoundingClientRect();
              tooltip.style.position = 'absolute';
              tooltip.style.zIndex = '10000';
              tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
              tooltip.style.left = `${rect.left + window.scrollX}px`;
            };
            
            const onMouseLeave = () => {
              if (document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
              }
            };
            
            info.el.addEventListener('mouseenter', onMouseEnter);
            info.el.addEventListener('mouseleave', onMouseLeave);
          }}
        />
      )}
      
      {/* New Appointment Dialog */}
      <Dialog open={isNewAppointmentDialogOpen} onOpenChange={setIsNewAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              {selectedTimeSlot && (
                <>Schedule for {format(selectedTimeSlot.start, 'MMMM d, yyyy h:mm a')}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreateAppointment)} className="space-y-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id.toString()}>
                            {patient.firstName} {patient.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="providerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id.toString()}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            field.onChange(date.toISOString());
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            field.onChange(date.toISOString());
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="appointmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="examination">Examination</SelectItem>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="followup">Follow-up</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes about the appointment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsNewAppointmentDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createAppointmentMutation.isPending}
                >
                  {createAppointmentMutation.isPending ? 'Saving...' : 'Save Appointment'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Appointment Dialog - Similar to New but with existing data */}
      <Dialog open={isEditAppointmentDialogOpen} onOpenChange={setIsEditAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>
              {selectedAppointment && (
                <>
                  Appointment for {patients.find(p => p.id === selectedAppointment.patientId)?.firstName || 'Unknown'} {' '}
                  {patients.find(p => p.id === selectedAppointment.patientId)?.lastName || 'Patient'}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {/* Similar form as the new appointment dialog, but with update functionality */}
          <div className="flex justify-between mt-4">
            <Button 
              type="button" 
              variant="destructive"
              onClick={() => {
                // Handle delete appointment logic
                toast({
                  title: "Feature not implemented",
                  description: "Appointment deletion would go here",
                });
                setIsEditAppointmentDialogOpen(false);
              }}
            >
              Delete
            </Button>
            
            <div className="space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditAppointmentDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={() => {
                  // Handle update appointment logic
                  toast({
                    title: "Feature not implemented",
                    description: "Appointment updating would go here",
                  });
                  setIsEditAppointmentDialogOpen(false);
                }}
              >
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}