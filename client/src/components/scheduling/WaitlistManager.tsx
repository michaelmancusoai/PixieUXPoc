import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { ListFilter, Plus, Clock, User, Phone, FileText, X, Calendar } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertWaitlistSchema, type InsertWaitlist } from '@shared/schema';

// Form schema for adding to waitlist
const formSchema = insertWaitlistSchema.extend({
  patientSearchTerm: z.string().optional(),
});

type WaitlistFormValues = z.infer<typeof formSchema>;

export const WaitlistManager = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch waitlist
  const { data: waitlist = [], isLoading } = useQuery({
    queryKey: ['/api/waitlist'],
    queryFn: async () => {
      const response = await fetch('/api/waitlist');
      if (!response.ok) throw new Error('Failed to fetch waitlist');
      return response.json();
    }
  });

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
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: 0,
      requestDate: new Date().toISOString(),
      contactNumber: '',
      requestedProcedure: '',
      priority: 'NORMAL',
      notes: '',
      patientSearchTerm: '',
    },
  });

  // Function to handle removing from waitlist
  const handleRemoveFromWaitlist = async (id: number) => {
    try {
      await apiRequest(`/api/waitlist/${id}`, { method: 'DELETE' });
      
      toast({
        title: "Removed from waitlist",
        description: "Patient has been removed from the waitlist",
      });
      
      // Refresh waitlist
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
    } catch (error) {
      console.error('Failed to remove from waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove from waitlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle form submission
  const onSubmit = async (values: WaitlistFormValues) => {
    try {
      if (!values.patientId) {
        toast({
          title: "Patient Required",
          description: "Please select a patient for the waitlist",
          variant: "destructive"
        });
        return;
      }
      
      const waitlistData: InsertWaitlist = {
        patientId: values.patientId,
        requestDate: values.requestDate,
        contactNumber: values.contactNumber || '',
        requestedProcedure: values.requestedProcedure || '',
        priority: values.priority as 'HIGH' | 'NORMAL' | 'LOW',
        notes: values.notes || '',
      };
      
      await apiRequest('/api/waitlist', { method: 'POST', data: waitlistData });
      
      toast({
        title: "Added to Waitlist",
        description: "Patient has been added to the waitlist",
      });
      
      // Reset form and close dialog
      form.reset();
      setSelectedPatient(null);
      setAddDialogOpen(false);
      
      // Refresh waitlist
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
    } catch (error) {
      console.error('Failed to add to waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to add to waitlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Update form with selected patient
  React.useEffect(() => {
    if (selectedPatient) {
      form.setValue('patientId', selectedPatient.id);
      form.setValue('patientSearchTerm', `${selectedPatient.firstName} ${selectedPatient.lastName}`);
      
      // If patient has phone, use it as contact number
      if (selectedPatient.phone) {
        form.setValue('contactNumber', selectedPatient.phone);
      }
    }
  }, [selectedPatient, form]);

  // Group waitlist by priority for display
  const groupedWaitlist = {
    HIGH: waitlist.filter(item => item.priority === 'HIGH'),
    NORMAL: waitlist.filter(item => item.priority === 'NORMAL'),
    LOW: waitlist.filter(item => item.priority === 'LOW')
  };

  // Display priority label
  const priorityLabel = (priority: string) => {
    const labels = {
      HIGH: { text: 'High Priority', variant: 'destructive' },
      NORMAL: { text: 'Normal Priority', variant: 'default' },
      LOW: { text: 'Low Priority', variant: 'secondary' }
    };
    return labels[priority as keyof typeof labels] || labels.NORMAL;
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Waitlist</CardTitle>
            <Badge variant="outline">{waitlist.length}</Badge>
          </div>
          <Button onClick={() => setAddDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add to Waitlist
          </Button>
        </CardHeader>
        
        <CardContent className="p-4 pb-6 flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse">Loading waitlist...</div>
            </div>
          ) : waitlist.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No patients on the waitlist</p>
              <Button onClick={() => setAddDialogOpen(true)} variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-1" />
                Add Patient to Waitlist
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="HIGH">
              <TabsList className="mb-4">
                <TabsTrigger value="HIGH" className="flex items-center gap-1">
                  <Badge variant="destructive" className="h-5 rounded-full">{groupedWaitlist.HIGH.length}</Badge>
                  High Priority
                </TabsTrigger>
                <TabsTrigger value="NORMAL" className="flex items-center gap-1">
                  <Badge variant="default" className="h-5 rounded-full">{groupedWaitlist.NORMAL.length}</Badge>
                  Normal
                </TabsTrigger>
                <TabsTrigger value="LOW" className="flex items-center gap-1">
                  <Badge variant="secondary" className="h-5 rounded-full">{groupedWaitlist.LOW.length}</Badge>
                  Low
                </TabsTrigger>
              </TabsList>
              
              {Object.entries(groupedWaitlist).map(([priority, items]) => (
                <TabsContent key={priority} value={priority} className="m-0">
                  <ScrollArea className="h-[calc(100vh-13rem)] pr-4">
                    <div className="space-y-3">
                      {items.map((item: any) => {
                        const patient = item.patient || {};
                        const daysWaiting = differenceInDays(new Date(), new Date(item.requestDate));
                        
                        return (
                          <div key={item.id} className="border rounded-lg p-3 relative group">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <User className="h-3.5 w-3.5 mr-1" />
                                  Chart: {patient.chartNumber} • DOB: {format(new Date(patient.dateOfBirth), 'MM/dd/yyyy')}
                                </div>
                              </div>
                              <Badge variant={priorityLabel(item.priority).variant as any}>
                                {priorityLabel(item.priority).text}
                              </Badge>
                            </div>
                            
                            <div className="text-sm mt-2 space-y-1.5">
                              {item.requestedProcedure && (
                                <div className="flex items-center text-gray-700">
                                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                                  {item.requestedProcedure}
                                </div>
                              )}
                              
                              {item.contactNumber && (
                                <div className="flex items-center text-gray-700">
                                  <Phone className="h-3.5 w-3.5 mr-1.5" />
                                  {item.contactNumber}
                                </div>
                              )}
                              
                              <div className="flex items-center text-gray-700">
                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                Added {format(new Date(item.requestDate), 'MMM d, yyyy')}
                                {daysWaiting > 0 && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {daysWaiting} {daysWaiting === 1 ? 'day' : 'days'} waiting
                                  </Badge>
                                )}
                              </div>
                              
                              {item.notes && (
                                <div className="mt-2 text-sm bg-gray-50 p-2 rounded border">
                                  {item.notes}
                                </div>
                              )}
                            </div>
                            
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveFromWaitlist(item.id)}
                                title="Remove from waitlist"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      {/* Add to waitlist dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add to Waitlist
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
              
              {/* Contact Number */}
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      Contact Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Requested Procedure */}
              <FormField
                control={form.control}
                name="requestedProcedure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Requested Procedure
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Root Canal, Extraction" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="HIGH">High Priority</SelectItem>
                        <SelectItem value="NORMAL">Normal Priority</SelectItem>
                        <SelectItem value="LOW">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes about scheduling preferences or requirements" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setAddDialogOpen(false);
                  setSelectedPatient(null);
                  form.reset();
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add to Waitlist
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};