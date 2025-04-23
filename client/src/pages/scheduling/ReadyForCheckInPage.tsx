import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, CheckCircle2, Users, AlertTriangle } from 'lucide-react';
import { AppointmentStatus } from '@shared/schema';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AppointmentWithDetails {
  id: number;
  patientId: number;
  providerId: number;
  operatoryId: number;
  startTime: string;
  endTime: string;
  status: string;
  patient: {
    firstName: string;
    lastName: string;
    chartNumber: string;
    dateOfBirth: string;
  };
  provider: {
    firstName: string;
    lastName: string;
  };
  procedure: string;
  arrivedAt?: string;
}

const ReadyForCheckInPage = () => {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const formattedDate = format(date, 'yyyy-MM-dd');

  const { data: arrivedPatients, isLoading } = useQuery({
    queryKey: ['/api/schedule/arrived-patients', formattedDate],
    queryFn: () => apiRequest(`/api/schedule/arrived-patients?date=${formattedDate}`),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => {
      return apiRequest(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule/arrived-patients'] });
      toast({
        title: "Status updated",
        description: "Patient status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update patient status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleStatusUpdate = (appointmentId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: appointmentId, status: newStatus });
  };

  // Calculate wait time
  const getWaitTime = (arrivedAt?: string) => {
    if (!arrivedAt) return 'Unknown';
    const arrivedTime = parseISO(arrivedAt);
    const now = new Date();
    const minutes = differenceInMinutes(now, arrivedTime);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div className="container py-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold">Ready for Check-In</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Patients who have arrived and are ready to be seated
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <Users className="h-4 w-4" />
              {!isLoading && arrivedPatients ? arrivedPatients.length : '0'} Patients
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : !arrivedPatients || arrivedPatients.length === 0 ? (
            <div className="py-12 text-center border rounded-lg border-dashed">
              <p className="text-muted-foreground">No patients currently waiting to be checked in</p>
            </div>
          ) : (
            <div className="space-y-3">
              {arrivedPatients.map((appointment: AppointmentWithDetails) => {
                const waitTime = getWaitTime(appointment.arrivedAt);
                const isLongWait = appointment.arrivedAt && 
                  differenceInMinutes(new Date(), parseISO(appointment.arrivedAt)) > 15;
                
                return (
                  <div 
                    key={appointment.id}
                    className="flex items-center justify-between border rounded-md p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-700">
                        <AvatarFallback>
                          {getInitials(appointment.patient.firstName, appointment.patient.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="font-medium">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.procedure}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right mr-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-sm font-medium">
                            {format(parseISO(appointment.startTime), 'h:mm a')}
                          </span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-xs",
                          isLongWait ? "text-amber-600" : "text-gray-500"
                        )}>
                          {isLongWait && <AlertTriangle className="h-3 w-3" />}
                          Waiting: {waitTime}
                        </div>
                      </div>
                      
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
                        Arrived
                      </Badge>
                      
                      <Button 
                        variant="outline"
                        size="sm"
                        className="gap-1 ml-2"
                        onClick={() => handleStatusUpdate(appointment.id, AppointmentStatus.SEATED)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Check In
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadyForCheckInPage;