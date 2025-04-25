import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, UserCheck, ClipboardList, Clock, AlertTriangle, CreditCard, LogOut } from 'lucide-react';
import { AppointmentWithDetails } from '@/lib/scheduling-utils';

interface RightRailProps {
  selectedDate: Date;
}

export default function RightRail({ selectedDate }: RightRailProps) {
  // Sample data for the day summary
  const daySummary = {
    totalAppointments: 15,
    completed: 5,
    inProgress: 2,
    upcoming: 8,
    producedAmount: 4325.50,
    openChairs: 2,
  };
  
  // Sample patient check-in data
  const upcomingCheckIns = [
    { id: 1, name: 'Michael Brown', time: '2:00 PM', status: 'confirmed', confirmed: true, isNew: false },
    { id: 2, name: 'Jennifer Taylor', time: '2:30 PM', status: 'confirmed', confirmed: true, isNew: true },
    { id: 3, name: 'David Lee', time: '3:00 PM', status: 'scheduled', confirmed: false, isNew: false },
  ];
  
  // Sample appointment alerts
  const appointmentAlerts = [
    { id: 1, message: 'Sarah Martinez is running 15 minutes late', type: 'warning' },
    { id: 2, message: 'Dr. Nguyen procedure is taking longer than expected', type: 'info' },
    { id: 3, message: 'Richard Walker has arrived early (30 minutes)', type: 'info' },
  ];
  
  // Sample ready for checkout patients
  const readyForCheckout = [
    { 
      id: 101, 
      name: 'Robert Johnson', 
      procedure: 'Crown prep', 
      provider: 'Dr. Williams',
      time: '1:45 PM', 
      paymentAmount: 325.50, 
      needsFollowUp: true 
    },
    { 
      id: 102, 
      name: 'Emily Davis', 
      procedure: 'Root canal', 
      provider: 'Dr. Martinez',
      time: '12:30 PM', 
      paymentAmount: 720.00, 
      needsFollowUp: false 
    },
    { 
      id: 103, 
      name: 'Thomas Wilson', 
      procedure: 'Cleaning', 
      provider: 'Dr. Thompson',
      time: '10:15 AM', 
      paymentAmount: 145.00, 
      needsFollowUp: true 
    },
  ];
  
  return (
    <div className="h-full overflow-y-auto space-y-4">
      
      {/* Upcoming Check-ins */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-semibold flex items-center">
            <UserCheck className="mr-2 h-4 w-4 text-primary" />
            Upcoming Check-ins
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {upcomingCheckIns.map((patient) => (
            <div key={patient.id} className="flex items-center justify-between p-2 border rounded-md text-xs">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium flex items-center">
                    {patient.name}
                    {patient.isNew && (
                      <Badge variant="outline" className="ml-1 text-[8px] py-0 px-1 h-3 bg-blue-50">New</Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground text-[10px]">{patient.time}</div>
                </div>
              </div>
              <div>
                {patient.confirmed ? (
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 text-[9px]">
                    <CheckCircle className="mr-1 h-2 w-2" />
                    Confirmed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700 text-[9px]">
                    <Clock className="mr-1 h-2 w-2" />
                    Unconfirmed
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Ready for Checkout */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-semibold flex items-center">
            <LogOut className="mr-2 h-4 w-4 text-purple-500" />
            Ready for Checkout
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {readyForCheckout.map((patient) => (
            <div key={patient.id} className="flex items-center justify-between p-2 border rounded-md text-xs">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{patient.name}</div>
                  <div className="text-muted-foreground text-[10px]">{patient.procedure}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-medium">${patient.paymentAmount.toFixed(0)}</div>
                {patient.needsFollowUp ? (
                  <Badge variant="outline" className="mt-0.5 bg-blue-50 border-blue-200 text-blue-700 text-[9px]">
                    Follow-up
                  </Badge>
                ) : (
                  <span className="text-[10px] text-muted-foreground">{patient.time}</span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Alerts */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-semibold flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
            Appointment Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {appointmentAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center space-x-2 p-2 border rounded-md text-xs">
              {alert.type === 'warning' ? (
                <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0" />
              ) : (
                <MessageSquare className="h-3 w-3 text-blue-500 flex-shrink-0" />
              )}
              <span className="line-clamp-1">{alert.message}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}