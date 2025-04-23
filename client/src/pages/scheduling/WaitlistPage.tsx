import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format, parseISO, formatDistance } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, Plus, X, Clock, Phone, CalendarDays, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WaitlistItem {
  id: number;
  patientId: number;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    chartNumber: string;
  };
  requestedDate: string;
  requestedProcedure: string;
  notes: string;
  status: string;
  createdAt: string;
}

const formSchema = z.object({
  patientId: z.number({
    required_error: "Please select a patient",
  }),
  requestedProcedure: z.string().min(1, "Procedure is required"),
  requestedDate: z.date({
    required_error: "Please select a date",
  }),
  notes: z.string().optional(),
});

const WaitlistPage = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  // Fetch waitlist data
  const { data: waitlist, isLoading } = useQuery({
    queryKey: ['/api/waitlist'],
    queryFn: () => apiRequest('/api/waitlist'),
  });

  // Fetch patients for the form
  const { data: patients } = useQuery({
    queryKey: ['/api/patients'],
    queryFn: () => apiRequest('/api/patients'),
  });

  // Add to waitlist mutation
  const addToWaitlistMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return apiRequest('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
      setOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Patient successfully added to waitlist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add patient to waitlist",
        variant: "destructive",
      });
    }
  });

  // Remove from waitlist mutation
  const removeFromWaitlistMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest(`/api/waitlist/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
      toast({
        title: "Success",
        description: "Patient removed from waitlist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove patient from waitlist",
        variant: "destructive",
      });
    }
  });

  // Form submission handler
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addToWaitlistMutation.mutate(data);
  };

  const handleRemoveFromWaitlist = (id: number) => {
    if (confirm("Are you sure you want to remove this patient from the waitlist?")) {
      removeFromWaitlistMutation.mutate(id);
    }
  };

  // Filter waitlist items based on search term
  const filteredWaitlist = waitlist?.filter((item: WaitlistItem) => {
    if (!searchTerm) return true;
    const patient = item.patient;
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           patient.chartNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTimeAgo = (dateString: string) => {
    return formatDistance(parseISO(dateString), new Date(), { addSuffix: true });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div className="container py-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold">Waitlist</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Patients waiting for an appointment opening
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add Patient to Waitlist</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
                                {patients?.map((patient) => (
                                  <SelectItem key={patient.id} value={patient.id.toString()}>
                                    {patient.firstName} {patient.lastName} ({patient.chartNumber})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="requestedProcedure"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requested Procedure</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select procedure" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Regular cleaning">Regular cleaning</SelectItem>
                                <SelectItem value="Deep cleaning">Deep cleaning</SelectItem>
                                <SelectItem value="Cavity filling">Cavity filling</SelectItem>
                                <SelectItem value="Root canal">Root canal</SelectItem>
                                <SelectItem value="Crown prep">Crown prep</SelectItem>
                                <SelectItem value="Extraction">Extraction</SelectItem>
                                <SelectItem value="Emergency visit">Emergency visit</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="requestedDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Requested Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any special requirements or preferences..."
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          disabled={addToWaitlistMutation.isPending}
                        >
                          {addToWaitlistMutation.isPending ? "Adding..." : "Add to Waitlist"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : !filteredWaitlist || filteredWaitlist.length === 0 ? (
            <div className="py-12 text-center border rounded-lg border-dashed">
              <p className="text-muted-foreground">
                {searchTerm ? "No matching patients found in the waitlist" : "No patients on the waitlist"}
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWaitlist.map((item: WaitlistItem) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between border rounded-md p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-amber-100 text-amber-700">
                      <AvatarFallback>
                        {getInitials(item.patient.firstName, item.patient.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="font-medium">
                        {item.patient.firstName} {item.patient.lastName}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {item.requestedProcedure}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Added {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="hidden md:flex flex-col items-start gap-1 mr-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {format(parseISO(item.requestedDate), 'MMM d, yyyy')}
                      </div>
                      
                      {item.patient.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-3.5 w-3.5" />
                          {item.patient.phone}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <CalendarIcon className="h-4 w-4" />
                              Book
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Book an appointment for this patient</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="text-gray-500"
                              onClick={() => handleRemoveFromWaitlist(item.id)}
                              disabled={removeFromWaitlistMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove from waitlist</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitlistPage;