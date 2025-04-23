import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DollarSign, Clock, CheckSquare, AlertCircle } from 'lucide-react';
import { AppointmentStatus } from '@shared/schema';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AppointmentWithDetails {
  id: number;
  patientId: number;
  providerId: number;
  startTime: string;
  endTime: string;
  status: string;
  patient: {
    firstName: string;
    lastName: string;
    chartNumber: string;
  };
  provider: {
    firstName: string;
    lastName: string;
  };
  procedure: string;
  chairStartedAt?: string;
  balanceDue?: number;
}

const ReadyForCheckoutPage = () => {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const formattedDate = format(date, 'yyyy-MM-dd');

  const { data: pendingCheckouts, isLoading } = useQuery({
    queryKey: ['/api/schedule/pending-checkout', formattedDate],
    queryFn: () => apiRequest(`/api/schedule/pending-checkout?date=${formattedDate}`),
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
      queryClient.invalidateQueries({ queryKey: ['/api/schedule/pending-checkout'] });
      toast({
        title: "Status updated",
        description: "Patient has been checked out successfully.",
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

  const handleCheckout = (appointmentId: number) => {
    updateStatusMutation.mutate({ id: appointmentId, status: AppointmentStatus.COMPLETED });
  };

  // Calculate treatment time
  const getTreatmentTime = (chairStartedAt?: string) => {
    if (!chairStartedAt) return 'Unknown';
    const startTime = parseISO(chairStartedAt);
    const now = new Date();
    const minutes = differenceInMinutes(now, startTime);
    
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container py-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold">Ready for Checkout</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Patients who have completed treatment and are ready for checkout
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : !pendingCheckouts || pendingCheckouts.length === 0 ? (
            <div className="py-12 text-center border rounded-lg border-dashed">
              <p className="text-muted-foreground">No patients currently waiting for checkout</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingCheckouts.map((appointment: AppointmentWithDetails) => {
                const treatmentTime = getTreatmentTime(appointment.chairStartedAt);
                
                return (
                  <div 
                    key={appointment.id}
                    className="flex items-center justify-between border rounded-md p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-green-100 text-green-700">
                        <AvatarFallback>
                          {getInitials(appointment.patient.firstName, appointment.patient.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="font-medium">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {appointment.status.replace(/_/g, ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {appointment.procedure}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3.5 w-3.5 text-gray-500" />
                          <span>Duration: {treatmentTime}</span>
                        </div>
                        
                        {appointment.balanceDue && appointment.balanceDue > 0 && (
                          <div className="flex items-center gap-1 text-sm text-red-600 font-medium mt-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            {formatCurrency(appointment.balanceDue)} due
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="gap-1 border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => handleCheckout(appointment.id)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <CheckSquare className="h-4 w-4" />
                          Complete
                        </Button>
                        
                        {appointment.balanceDue && appointment.balanceDue > 0 && (
                          <Button 
                            variant="outline"
                            size="sm"
                            className="gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <DollarSign className="h-4 w-4" />
                            Collect
                          </Button>
                        )}
                      </div>
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

export default ReadyForCheckoutPage;