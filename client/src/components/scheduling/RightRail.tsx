import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, CheckCircle, UserCheck, ClipboardList, Clock, AlertTriangle, CreditCard, LogOut, Plus } from 'lucide-react';
import { AppointmentWithDetails } from '@/lib/scheduling-utils';
import BookAppointmentDialog from './BookAppointmentDialog';

interface RightRailProps {
  selectedDate: Date;
}

export default function RightRail({ selectedDate }: RightRailProps) {
  const [bookAppointmentOpen, setBookAppointmentOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  
  // Updated data for the day summary based on our calendar
  const daySummary = {
    totalAppointments: 22,
    completed: 1,
    inProgress: 2,
    upcoming: 19,
    producedAmount: 4325.50,
    openChairs: 2,
  };
  
  // Updated patient check-in data based on our calendar
  const upcomingCheckIns = [
    { id: 22, name: "D'Vana Tendi", time: '4:30 PM', status: 'confirmed', confirmed: true, isNew: false },
    { id: 23, name: 'Sam Rutherford', time: '4:30 PM', status: 'confirmed', confirmed: true, isNew: false },
    { id: 20, name: 'Charlotte Robinson', time: '4:30 PM', status: 'scheduled', confirmed: false, isNew: false },
  ];
  
  // Updated appointment alerts
  const appointmentAlerts = [
    { id: 1, message: 'Jessica Billard is running 15 minutes late', type: 'warning' },
    { id: 2, message: 'Dr. Picard procedure with Jerry Smith is taking longer than expected', type: 'info' },
    { id: 3, message: 'Bird Person has arrived early (30 minutes)', type: 'info' },
  ];
  
  // Updated ready for checkout patients
  const readyForCheckout = [
    { 
      id: 11, 
      name: 'Beckett Mariner', 
      procedure: 'Comprehensive Oral Evaluation', 
      provider: 'Dr. Janeway',
      time: '1:00 PM', 
      paymentAmount: 325.50, 
      needsFollowUp: true 
    },
    { 
      id: 21, 
      name: 'Bradward Boimler', 
      procedure: 'Root Canal - Anterior', 
      provider: 'Dr. Archer',
      time: '1:00 PM', 
      paymentAmount: 720.00, 
      needsFollowUp: true 
    },
    { 
      id: 7, 
      name: 'Michael Brown', 
      procedure: 'Resin-Based Composite - Four Surfaces', 
      provider: 'Dr. Picard',
      time: '11:00 AM', 
      paymentAmount: 145.00, 
      needsFollowUp: false 
    },
  ];
  
  const handleOpenBookAppointment = (patientName = "") => {
    setSelectedPatient(patientName);
    setBookAppointmentOpen(true);
  };
  
  return (
    <div className="h-full overflow-y-auto space-y-4">
      {/* Book Appointment Dialog */}
      {bookAppointmentOpen && (
        <BookAppointmentDialog
          open={bookAppointmentOpen}
          onClose={() => setBookAppointmentOpen(false)}
          onBook={() => setBookAppointmentOpen(false)}
          selectedDate={selectedDate}
          patientName={selectedPatient}
        />
      )}
      
      {/* Main Card with Accordion layout similar to LeftRail */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Accordion type="multiple" className="w-full" defaultValue={["checkins", "checkout", "alerts"]}>
            
            {/* Check-ins Section */}
            <AccordionItem value="checkins" className="border-b">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                    <h3 className="font-medium">Check-ins</h3>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline" className="text-xs font-medium bg-white text-gray-700 border-gray-200 rounded px-2 py-0.5">
                      {upcomingCheckIns.length}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 space-y-2">
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
                          <CheckCircle className="mr-1 h-2 w-2 text-green-600" />
                          Confirmed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700 text-[9px]">
                          <Clock className="mr-1 h-2 w-2 text-yellow-600" />
                          Unconfirmed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            
            {/* Checkout Section */}
            <AccordionItem value="checkout" className="border-b">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4 text-purple-500" />
                    <h3 className="font-medium">Checkout</h3>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline" className="text-xs font-medium bg-white text-gray-700 border-gray-200 rounded px-2 py-0.5">
                      {readyForCheckout.length}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 space-y-2">
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
              </AccordionContent>
            </AccordionItem>
            
            {/* Alerts Section */}
            <AccordionItem value="alerts" className="border-b">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                    <h3 className="font-medium">Alerts</h3>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline" className="text-xs font-medium bg-white text-gray-700 border-gray-200 rounded px-2 py-0.5">
                      {appointmentAlerts.length}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 space-y-2">
                {appointmentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-2 p-2 border rounded-md text-xs">
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <MessageSquare className="h-3 w-3 text-blue-500 flex-shrink-0" />
                    )}
                    <span className="whitespace-normal">{alert.message}</span>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        </CardContent>
      </Card>
      
    </div>
  );
}