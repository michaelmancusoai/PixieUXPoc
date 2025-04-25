import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface RightRailProps {
  selectedDate: Date;
}

export default function RightRail({ selectedDate }: RightRailProps) {
  // Fetch arrived patients
  const { data: arrivedPatients = [] } = useQuery<any[]>({
    queryKey: ['/api/scheduling/queue/arrived', format(selectedDate, 'yyyy-MM-dd')],
    enabled: true,
  });

  // Fetch pending checkout patients
  const { data: pendingCheckout = [] } = useQuery<any[]>({
    queryKey: ['/api/scheduling/queue/pending-checkout', format(selectedDate, 'yyyy-MM-dd')],
    enabled: true,
  });

  // State for patient actions
  const [processedPatients, setProcessedPatients] = useState<Record<string, boolean>>({});

  // Mark patient as processed (payment collected)
  const markPaymentCollected = (patientId: number, section: 'checkin' | 'checkout') => {
    setProcessedPatients(prev => ({
      ...prev,
      [`${section}-${patientId}-payment`]: true
    }));
  };

  // Get filterable patients who need attention
  const waitingPatients = arrivedPatients.filter((patient: any) => 
    patient.status !== 'IN_CHAIR'
  );

  return (
    <div className="flex flex-col space-y-4 overflow-y-auto pb-4">
      {/* Check-In Card */}
      <Card className="shadow-sm">
        <CardHeader className="bg-green-100 py-2 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 bg-green-500 text-white rounded-full flex items-center justify-center font-medium">
              {waitingPatients?.length || 0}
            </div>
            <CardTitle className="text-sm font-medium">Ready for Check-In</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {waitingPatients.length > 0 ? (
              waitingPatients.map((patient: any) => {
                const needsPayment = patient.balanceDue > 0;
                const paymentCollected = processedPatients[`checkin-${patient.id}-payment`];
                
                return (
                  <div key={patient.id} className="p-4">
                    <div className="flex items-start">
                      {/* Avatar */}
                      <div className="flex-shrink-0 mr-2 rounded-full bg-green-100 text-green-600 w-7 h-7 flex items-center justify-center text-xs">
                        {patient.avatarInitials}
                      </div>
                      
                      {/* Content container */}
                      <div className="flex-1">
                        {/* Patient name */}
                        <p className="font-medium text-sm">{patient.firstName} {patient.lastName}</p>
                        
                        {/* Time and balance row */}
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          <span>{format(new Date(patient.arrivedAt), 'h:mm a')}</span>
                          
                          {/* Balance Due - Inline */}
                          {needsPayment && !paymentCollected && (
                            <div className="ml-2 bg-red-100 inline-flex items-center rounded-full px-2 py-0.5">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500 mr-0.5">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"></line>
                                <line x1="12" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="2"></line>
                              </svg>
                              <span className="text-red-800 text-xs font-medium">${(patient.balanceDue / 100).toFixed(2)} due</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Buttons row */}
                        <div className="flex gap-1 mt-1.5">
                          <Button 
                            size="sm"
                            className="h-7 px-3 bg-green-500 hover:bg-green-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <line x1="19" y1="8" x2="19" y2="14"></line>
                              <line x1="22" y1="11" x2="16" y2="11"></line>
                            </svg>
                            Seat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center py-4 text-gray-500">No patients waiting</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Checkout Card */}
      <Card className="shadow-sm">
        <CardHeader className="bg-blue-100 py-2 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
              {pendingCheckout?.length || 0}
            </div>
            <CardTitle className="text-sm font-medium">Ready for Checkout</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {pendingCheckout?.length > 0 ? (
              pendingCheckout.map((patient: any) => {
                const needsPayment = patient.balanceDue > 0;
                const paymentCollected = processedPatients[`checkout-${patient.id}-payment`];
                
                return (
                  <div key={patient.id} className="p-4">
                    <div className="flex items-start">
                      {/* Avatar */}
                      <div className="flex-shrink-0 mr-2 rounded-full bg-blue-100 text-blue-600 w-7 h-7 flex items-center justify-center text-xs">
                        {patient.avatarInitials}
                      </div>
                      
                      {/* Content container */}
                      <div className="flex-1">
                        {/* Patient name */}
                        <p className="font-medium text-sm">{patient.firstName} {patient.lastName}</p>
                        
                        {/* Time and balance row */}
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          <span>{format(new Date(patient.completedAt), 'h:mm a')}</span>
                          
                          {/* Balance Due - Inline */}
                          {needsPayment && !paymentCollected && (
                            <div className="ml-2 bg-red-100 inline-flex items-center rounded-full px-2 py-0.5">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500 mr-0.5">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"></line>
                                <line x1="12" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="2"></line>
                              </svg>
                              <span className="text-red-800 text-xs font-medium">${(patient.balanceDue / 100).toFixed(2)} due</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Buttons row */}
                        <div className="flex gap-1 mt-1.5">
                          <Button 
                            size="sm"
                            className="h-7 px-3 bg-blue-500 hover:bg-blue-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                              <polyline points="16 17 21 12 16 7"></polyline>
                              <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Checkout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center py-4 text-gray-500">No patients pending checkout</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}