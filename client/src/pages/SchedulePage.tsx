import React from 'react';
import { CalendarView } from '@/components/scheduling/CalendarView';
import { WaitlistManager } from '@/components/scheduling/WaitlistManager';
import { BarChart, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

const SchedulePage = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Get schedule utilization
  const { data: utilization } = useQuery({
    queryKey: ['/api/schedule/utilization', today],
    queryFn: async () => {
      const response = await fetch(`/api/schedule/utilization?date=${today}`);
      if (!response.ok) throw new Error('Failed to fetch utilization data');
      return response.json();
    }
  });
  
  // Get arrived patients
  const { data: arrivedPatients = [] } = useQuery({
    queryKey: ['/api/schedule/arrived-patients', today],
    queryFn: async () => {
      const response = await fetch(`/api/schedule/arrived-patients?date=${today}`);
      if (!response.ok) throw new Error('Failed to fetch arrived patients');
      return response.json();
    }
  });
  
  // Get patients pending checkout
  const { data: pendingCheckout = [] } = useQuery({
    queryKey: ['/api/schedule/pending-checkout', today],
    queryFn: async () => {
      const response = await fetch(`/api/schedule/pending-checkout?date=${today}`);
      if (!response.ok) throw new Error('Failed to fetch pending checkout');
      return response.json();
    }
  });

  // Get utilization color based on percentage
  const getUtilizationColor = (percentage: number) => {
    if (percentage < 50) return 'text-blue-500';
    if (percentage < 80) return 'text-green-500';
    if (percentage < 95) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="container px-6 mx-auto max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <div className="text-sm text-gray-500">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </div>
        </div>
        
        {/* Schedule metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-medium">Schedule Utilization</CardTitle>
              <BarChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              {utilization ? (
                <>
                  <div className="text-3xl font-bold flex items-end gap-2">
                    <span className={getUtilizationColor(utilization.percentage)}>
                      {utilization.percentage}%
                    </span>
                    <span className="text-base text-gray-500 mb-0.5">
                      ({utilization.bookedSlots}/{utilization.totalSlots} slots)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full mt-2">
                    <div 
                      className={`h-2 rounded-full ${getUtilizationColor(utilization.percentage).replace('text-', 'bg-')}`}
                      style={{ width: `${utilization.percentage}%` }}
                    ></div>
                  </div>
                </>
              ) : (
                <div className="text-3xl font-bold text-gray-300">--</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-medium">Patients In Office</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{arrivedPatients.length}</div>
              <div className="text-xs text-gray-500 mt-1">
                {arrivedPatients.length === 0 ? 
                  'No patients currently in office' : 
                  `${arrivedPatients.length} patient${arrivedPatients.length === 1 ? '' : 's'} currently in office`
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-medium">Pending Checkout</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingCheckout.length}</div>
              <div className="text-xs text-gray-500 mt-1">
                {pendingCheckout.length === 0 ? 
                  'No patients pending checkout' : 
                  `${pendingCheckout.length} patient${pendingCheckout.length === 1 ? '' : 's'} waiting for checkout`
                }
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main schedule content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <CalendarView />
          </div>
          <div className="lg:col-span-1">
            <WaitlistManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;