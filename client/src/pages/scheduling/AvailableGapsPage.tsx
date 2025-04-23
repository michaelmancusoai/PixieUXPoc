import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { format, addMinutes, parseISO } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';
import { Clock, CalendarIcon, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Gap {
  startTime: string;
  endTime: string;
  duration: number;
  operatoryId?: number;
  providerId?: number;
}

const AvailableGapsPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const formattedDate = format(date, 'yyyy-MM-dd');

  const { data: gaps, isLoading } = useQuery({
    queryKey: ['/api/schedule/gaps', formattedDate],
    queryFn: () => apiRequest(`/api/schedule/gaps?date=${formattedDate}`),
  });

  const { data: providers } = useQuery({
    queryKey: ['/api/providers'],
    queryFn: () => apiRequest('/api/providers'),
  });

  const { data: operatories } = useQuery({
    queryKey: ['/api/operatories'],
    queryFn: () => apiRequest('/api/operatories'),
  });

  // Get provider/operatory details
  const getProviderName = (providerId?: number) => {
    if (!providerId || !providers) return 'Any Provider';
    const provider = providers.find(p => p.id === providerId);
    return provider ? `Dr. ${provider.firstName}` : 'Any Provider';
  };

  const getOperatoryName = (operatoryId?: number) => {
    if (!operatoryId || !operatories) return 'Any Operatory';
    const operatory = operatories.find(o => o.id === operatoryId);
    return operatory ? operatory.name : 'Any Operatory';
  };

  return (
    <div className="container py-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mb-4"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <div className="text-sm text-muted-foreground mt-4">
                <p>Viewing available gaps for:</p>
                <p className="font-medium text-foreground">{format(date, 'EEEE, MMMM d, yyyy')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Available Gaps</CardTitle>
              <p className="text-sm text-muted-foreground">
                Open time slots that can be used for new appointments
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : !gaps || gaps.length === 0 ? (
                <div className="py-8 text-center border rounded-lg border-dashed">
                  <p className="text-muted-foreground">No available gaps found for this date</p>
                  <Button variant="outline" className="mt-4" onClick={() => setDate(new Date())}>
                    Check Today
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {gaps.map((gap: Gap, i: number) => {
                    const startTime = parseISO(gap.startTime);
                    const endTime = parseISO(gap.endTime);
                    return (
                      <div 
                        key={i}
                        className="flex items-center border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">
                              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                            </span>
                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                              {gap.duration} min
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {getProviderName(gap.providerId)} • {getOperatoryName(gap.operatoryId)}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Check className="h-4 w-4" />
                          Book
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AvailableGapsPage;