import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Timer, UserPlus, Calendar, Clock, Plus, Phone, MessageCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LeftRailProps {
  selectedDate: Date;
}

// Interface definitions
interface WaitlistPatient {
  id: number;
  name: string;
  procedure: string;
  waitingSince: string;
  propensityScore: number;
  isAsap?: boolean;
  requestedDate?: string;
  reason?: string;
  contact?: string;
}

export default function LeftRail({ selectedDate }: LeftRailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Combined waitlist patients
  const allWaitlistPatients: WaitlistPatient[] = [
    // ASAP patients
    { 
      id: 5, 
      name: 'Linda Lewis', 
      procedure: 'Broken tooth', 
      waitingSince: '4 hours', 
      propensityScore: 95, 
      isAsap: true,
      reason: 'Broken tooth',
      contact: '555-123-4567', 
      requestedDate: 'Today 9:30 AM' 
    },
    { 
      id: 6, 
      name: 'Richard Walker', 
      procedure: 'Severe pain', 
      waitingSince: '2 hours', 
      propensityScore: 98,
      isAsap: true,
      reason: 'Severe pain',
      contact: '555-987-6543', 
      requestedDate: 'Today 11:45 AM' 
    },
    
    // Regular waitlist patients
    { id: 1, name: 'Elizabeth Rodriguez', procedure: 'Crown', waitingSince: '2 days', propensityScore: 85 },
    { id: 2, name: 'William Jackson', procedure: 'Root Canal', waitingSince: '5 days', propensityScore: 92 },
    { id: 3, name: 'Jennifer Taylor', procedure: 'Extraction', waitingSince: '1 day', propensityScore: 76 },
    { id: 4, name: 'James Brown', procedure: 'Filling', waitingSince: '3 days', propensityScore: 68 },
  ];
  
  // Filter all patients based on search term
  const filteredWaitlist = searchTerm 
    ? allWaitlistPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.reason && patient.reason.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : allWaitlistPatients;
    
  // Split into ASAP and regular waitlist for display
  const asapPatients = filteredWaitlist.filter(p => p.isAsap);
  const regularWaitlist = filteredWaitlist.filter(p => !p.isAsap);
  
  return (
    <div className="h-full overflow-y-auto space-y-4">
      
      {/* Main Card with Accordion layout similar to PatientProfilePage */}
      <Card className="shadow-sm">
        <CardContent className="p-0">          
          <Accordion type="multiple" className="w-full" defaultValue={["combined-waitlist", "quickFill"]}>
            
            {/* Combined Waitlist Section */}
            <AccordionItem value="combined-waitlist" className="border-b">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Waitlist Patients</h3>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline" className="text-xs font-medium bg-white text-gray-700 border-gray-200 rounded px-2 py-0.5">
                      {asapPatients.length + regularWaitlist.length}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                {/* Search input inside the accordion content */}
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      className="pl-8 h-8 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {filteredWaitlist.length > 0 ? (
                  <div className="space-y-2">
                    
                    {/* ASAP Group */}
                    {asapPatients.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1 px-1">ASAP</h4>
                        <div className="border rounded-sm overflow-hidden divide-y divide-gray-100">
                          {asapPatients.map(patient => (
                            <div key={patient.id} className="group flex items-center bg-white hover:bg-gray-50 py-1.5 px-2 text-xs cursor-pointer">
                              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                              <div className="min-w-0 flex-grow grid grid-cols-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate">{patient.name}</p>
                                  <p className="text-[10px] text-muted-foreground ml-2">{patient.requestedDate || "Today"}</p>
                                </div>
                                <p className="text-muted-foreground truncate">{patient.reason || patient.procedure}</p>
                              </div>
                              <Phone className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 ml-1.5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Regular Waitlist Group */}
                    {regularWaitlist.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1 px-1">Regular Waitlist</h4>
                        <div className="border rounded-sm overflow-hidden divide-y divide-gray-100">
                          {regularWaitlist.map(patient => (
                            <div key={patient.id} className="group flex items-center bg-white hover:bg-gray-50 py-1.5 px-2 text-xs cursor-pointer">
                              <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                              <div className="min-w-0 flex-grow grid grid-cols-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate">{patient.name}</p>
                                  <p className="text-[10px] text-muted-foreground ml-2">{patient.waitingSince}</p>
                                </div>
                                <p className="text-muted-foreground truncate">{patient.procedure}</p>
                              </div>
                              <Phone className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 ml-1.5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">No patients on waitlist</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            
            {/* Quick Fill Section - Example of another accordion section */}
            <AccordionItem value="quickFill" className="border-b">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <div className="relative mr-2 h-4 w-4 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <Clock className="h-2 w-2 absolute -bottom-0.5 -right-0.5" />
                    </div>
                    <h3 className="font-medium">Quick Fill</h3>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline" className="text-xs font-medium bg-white text-gray-700 border-gray-200 rounded px-2 py-0.5">
                      3
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="border rounded-sm overflow-hidden divide-y divide-gray-100">
                  <div className="group flex items-center bg-white hover:bg-gray-50 py-1.5 px-2 text-xs cursor-pointer">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    <div className="min-w-0 flex-grow grid grid-cols-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">30-min opening</p>
                        <p className="text-[10px] text-muted-foreground ml-2">10:30 AM</p>
                      </div>
                      <p className="text-muted-foreground truncate">Dr. Smith • Op. 2</p>
                    </div>
                    <UserPlus className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 ml-1.5" />
                  </div>
                  
                  <div className="group flex items-center bg-white hover:bg-gray-50 py-1.5 px-2 text-xs cursor-pointer">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    <div className="min-w-0 flex-grow grid grid-cols-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">45-min opening</p>
                        <p className="text-[10px] text-muted-foreground ml-2">2:15 PM</p>
                      </div>
                      <p className="text-muted-foreground truncate">Dr. Johnson • Op. 4</p>
                    </div>
                    <UserPlus className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 ml-1.5" />
                  </div>
                  
                  <div className="group flex items-center bg-white hover:bg-gray-50 py-1.5 px-2 text-xs cursor-pointer">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    <div className="min-w-0 flex-grow grid grid-cols-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">60-min opening</p>
                        <p className="text-[10px] text-muted-foreground ml-2">3:30 PM</p>
                      </div>
                      <p className="text-muted-foreground truncate">Dr. Davis • Op. 1</p>
                    </div>
                    <UserPlus className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 ml-1.5" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}