import React, { useState, useEffect } from 'react';
import { format, getHours, getMinutes, setHours, setMinutes, addMinutes } from 'date-fns';
import { CalendarIcon, Clock, User, Stethoscope, Hash, Map, FileText } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertAppointmentSchema, AppointmentStatus, type InsertAppointment } from '@shared/schema';

// Define form schema
const formSchema = insertAppointmentSchema.extend({
  patientSearchTerm: z.string().optional(),
  duration: z.number().min(15).max(240).default(30),
  patientId: z.number()
});

type AppointmentFormValues = z.infer<typeof formSchema>;

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlot: {
    time: string;
    date: Date;
    providerId?: number;
    operatoryId?: number;
  } | null;
  providers: any[];
  operatories: any[];
}

export const BookAppointmentDialog = ({ 
  open, 
  onOpenChange, 
  selectedSlot,
  providers,
  operatories
}: BookAppointmentDialogProps) => {
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Search for patients
  const { data: patientResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['/api/patients/search', patientSearchTerm],
    queryFn: async () => {
      if (!patientSearchTerm || patientSearchTerm.length < 2) return [];
      
      const response = await fetch(`/api/patients/search?q=${encodeURIComponent(patientSearchTerm)}`);
      if (!response.ok) throw new Error('Failed to search patients');
      return response.json();
    },
    enabled: patientSearchTerm.length >= 2,
  });

  // Form setup
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      status: AppointmentStatus.SCHEDULED,
      duration: 30,
      patientId: 0,
      patientSearchTerm: '',
    },
  });
  
  // Update form when selected slot changes
  useEffect(() => {
    if (selectedSlot) {
      const { time, date, providerId, operatoryId } = selectedSlot;
      
      const [hours, minutes] = time.split(':').map(Number);
      const startTime = setMinutes(setHours(date, hours), minutes);
      const endTime = addMinutes(startTime, 30);
      
      form.reset({
        ...form.getValues(),
        date: format(date, 'yyyy-MM-dd'),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        providerId: providerId || undefined,
        operatoryId: operatoryId || undefined,
      });
    }
  }, [selectedSlot, form]);
  
  // Update form with selected patient
  useEffect(() => {
    if (selectedPatient) {
      form.setValue('patientId', selectedPatient.id);
      form.setValue('patientSearchTerm', `${selectedPatient.firstName} ${selectedPatient.lastName}`);
    }
  }, [selectedPatient, form]);
  
  // Handle duration change to update end time
  const handleDurationChange = (duration: string) => {
    const parsedDuration = parseInt(duration);
    if (!parsedDuration || !selectedSlot) return;
    
    const { time, date } = selectedSlot;
    const [hours, minutes] = time.split(':').map(Number);
    const startTime = setMinutes(setHours(date, hours), minutes);
    const endTime = addMinutes(startTime, parsedDuration);
    
    form.setValue('duration', parsedDuration);
    form.setValue('endTime', endTime.toISOString());
  };
  
  // Handle form submission
  const onSubmit = async (values: AppointmentFormValues) => {
    try {
      if (!values.patientId) {
        toast({
          title: "Patient Required",
          description: "Please select a patient for this appointment",
          variant: "destructive"
        });
        return;
      }
      
      const appointmentData: InsertAppointment = {
        patientId: values.patientId,
        providerId: values.providerId,
        operatoryId: values.operatoryId,
        title: values.title,
        description: values.description || '',
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        status: values.status as keyof typeof AppointmentStatus,
      };
      
      await apiRequest('/api/appointments', { method: 'POST', data: appointmentData });
      
      toast({
        title: "Appointment Created",
        description: `Successfully booked appointment for ${format(new Date(values.startTime), 'PPpp')}`,
      });
      
      // Invalidate queries to refresh calendar
      queryClient.invalidateQueries({ queryKey: ['/api/schedule/appointments'] });
      
      // Close dialog
      onOpenChange(false);
      setSelectedPatient(null);
      form.reset();
    } catch (error) {
      console.error('Failed to create appointment:', error);
      toast({
        title: "Error",
        description: "Failed to create appointment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Book Appointment
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Patient Selection */}
            <FormField
              control={form.control}
              name="patientSearchTerm"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Patient
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        placeholder="Search patients..."
                        {...field}
                        value={field.value || patientSearchTerm}
                        onChange={(e) => {
                          field.onChange(e);
                          setPatientSearchTerm(e.target.value);
                          if (!e.target.value) {
                            setSelectedPatient(null);
                          }
                        }}
                      />
                      
                      {/* Patient search results dropdown */}
                      {patientSearchTerm && patientResults.length > 0 && !selectedPatient && (
                        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border max-h-60 overflow-auto">
                          {patientResults.map((patient) => (
                            <div
                              key={patient.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setPatientSearchTerm('');
                              }}
                            >
                              <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                              <div className="text-xs text-gray-500">
                                Chart: {patient.chartNumber} • DOB: {format(new Date(patient.dateOfBirth), 'MM/dd/yyyy')}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {patientSearchTerm && isSearching && (
                        <div className="text-xs text-gray-500 mt-1">Searching patients...</div>
                      )}
                      
                      {patientSearchTerm && patientResults.length === 0 && !isSearching && (
                        <div className="text-xs text-gray-500 mt-1">No patients found</div>
                      )}
                      
                      {selectedPatient && (
                        <div className="mt-2 p-2 border rounded-md bg-gray-50">
                          <div className="flex justify-between">
                            <span className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPatient(null);
                                form.setValue('patientId', 0);
                                form.setValue('patientSearchTerm', '');
                              }}
                            >
                              Change
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500">
                            Chart: {selectedPatient.chartNumber} • DOB: {format(new Date(selectedPatient.dateOfBirth), 'MM/dd/yyyy')}
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Appointment Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    Appointment Title
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Regular Checkup, Teeth Cleaning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              {/* Provider */}
              <FormField
                control={form.control}
                name="providerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Stethoscope className="h-4 w-4" />
                      Provider
                    </FormLabel>
                    <Select
                      value={field.value?.toString() || ''}
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id.toString()}>
                            {provider.firstName} {provider.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Operatory */}
              <FormField
                control={form.control}
                name="operatoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Map className="h-4 w-4" />
                      Operatory
                    </FormLabel>
                    <Select
                      value={field.value?.toString() || ''}
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operatory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {operatories.map((operatory) => (
                          <SelectItem key={operatory.id} value={operatory.id.toString()}>
                            {operatory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Date & Time */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Start Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={field.value ? format(new Date(field.value), 'EEE, MMM d, yyyy h:mm a') : ''}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={handleDurationChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Description / Notes */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional appointment notes or special instructions" 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Book Appointment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};