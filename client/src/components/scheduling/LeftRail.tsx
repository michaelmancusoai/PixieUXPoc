import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Timer, UserPlus, Calendar, Clock, Plus, Phone, MessageCircle, Bell } from 'lucide-react';
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

interface RecallPatient {
  id: number;
  name: string;
  recallType: string;
  dueDate: string;
  lastVisit: string;
  contact?: string;
  isOverdue?: boolean;
}

export default function LeftRail({ selectedDate }: LeftRailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Helper function for formatting wait time
  const formatWaitTime = (hours: number): string => {
    if (hours < 24) {
      return hours === 1 ? '1 hour' : `${hours} hours`;
    } else {
      const days = Math.floor(hours / 24);
      return days === 1 ? '1 day' : `${days} days`;
    }
  };

  // Combined waitlist patients
  const allWaitlistPatients: WaitlistPatient[] = [
    // ASAP patients
    { 
      id: 5, 
      name: 'Harry Potter', 
      procedure: 'Broken tooth', 
      waitingSince: formatWaitTime(4), 
      propensityScore: 95, 
      isAsap: true,
      reason: 'Broken tooth',
      contact: '555-123-4567', 
      requestedDate: 'Today 9:30 AM' 
    },
    { 
      id: 6, 
      name: 'Hermione Granger', 
      procedure: 'Severe pain', 
      waitingSince: formatWaitTime(1), 
      propensityScore: 98,
      isAsap: true,
      reason: 'Severe pain',
      contact: '555-987-6543', 
      requestedDate: 'Today 11:45 AM' 
    },
    
    // Regular waitlist patients
    { id: 1, name: 'Ron Weasley', procedure: 'Crown', waitingSince: formatWaitTime(48), propensityScore: 85 },
    { id: 2, name: 'Draco Malfoy', procedure: 'Root Canal', waitingSince: formatWaitTime(120), propensityScore: 92 },
    { id: 3, name: 'Luna Lovegood', procedure: 'Extraction', waitingSince: formatWaitTime(24), propensityScore: 76 },
    { id: 4, name: 'Neville Longbottom', procedure: 'Filling', waitingSince: formatWaitTime(72), propensityScore: 68 },
  ];
  
  // Filter all patients based on search term
  const filteredWaitlist = searchTerm 
    ? allWaitlistPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.reason && patient.reason.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : allWaitlistPatients;
    
  // Recall patients data
  const recallPatients: RecallPatient[] = [
    { 
      id: 101, 
      name: 'Ginny Weasley', 
      recallType: '6-month cleaning', 
      dueDate: 'Today', 
      lastVisit: '6 months ago',
      contact: '555-444-5678',
      isOverdue: true
    },
    { 
      id: 102, 
      name: 'Albus Dumbledore', 
      recallType: 'Annual exam', 
      dueDate: 'Tomorrow', 
      lastVisit: '1 year ago',
      contact: '555-222-3333' 
    },
    { 
      id: 103, 
      name: 'Severus Snape', 
      recallType: '3-month perio maintenance', 
      dueDate: 'In 2 days', 
      lastVisit: '3 months ago',
      contact: '555-888-9999' 
    },
    { 
      id: 104, 
      name: 'Minerva McGonagall', 
      recallType: '6-month check-up', 
      dueDate: 'Next week', 
      lastVisit: '5 months ago',
      contact: '555-777-1111' 
    }
  ];

  // Split into ASAP and regular waitlist for display
  const asapPatients = filteredWaitlist.filter(p => p.isAsap);
  const regularWaitlist = filteredWaitlist.filter(p => !p.isAsap);
  
  return (
    <div className="h-full overflow-y-auto space-y-4">
      
      {/* Main Card with Accordion layout similar to PatientProfilePage */}
      <Card className="shadow-sm">
        <CardContent className="p-0">          
          <Accordion type="multiple" className="w-full" defaultValue={["combined-waitlist", "recalls", "quickFill"]}>
            
            {/* Combined Waitlist Section */}
            <AccordionItem value="combined-waitlist" className="border-b">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4 text-blue-500" />
                    <h3 className="font-medium">Waitlist</h3>
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
                                  <p className="text-[10px] text-muted-foreground ml-2">{patient.waitingSince}</p>
                                </div>
                                {/* First content line */}
                                <p className="text-muted-foreground truncate">{patient.reason || patient.procedure}</p>
                                {/* Optional second content line */}
                                {patient.contact && (
                                  <p className="text-[10px] text-muted-foreground truncate">Call: {patient.contact}</p>
                                )}
                              </div>
                              <Phone className="h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 ml-1.5" />
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
                                {/* First content line */}
                                <p className="text-muted-foreground truncate">{patient.procedure}</p>
                                {/* Optional second content line */}
                                {patient.contact && (
                                  <p className="text-[10px] text-muted-foreground truncate">Call: {patient.contact}</p>
                                )}
                              </div>
                              <Phone className="h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 ml-1.5" />
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
            
            {/* Recalls Section */}
            <AccordionItem value="recalls" className="border-b">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <Bell className="mr-2 h-4 w-4 text-purple-500" />
                    <h3 className="font-medium">Recalls</h3>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline" className="text-xs font-medium bg-white text-gray-700 border-gray-200 rounded px-2 py-0.5">
                      {recallPatients.length}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="border rounded-sm overflow-hidden divide-y divide-gray-100">
                  {recallPatients.map(patient => (
                    <div key={patient.id} className="group flex items-center bg-white hover:bg-gray-50 py-1.5 px-2 text-xs cursor-pointer">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                      <div className="min-w-0 flex-grow grid grid-cols-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{patient.name}</p>
                          <p className={`text-[10px] ml-2 ${patient.isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                            {patient.dueDate}
                          </p>
                        </div>
                        {/* First content line */}
                        <p className="text-muted-foreground truncate">{patient.recallType}</p>
                        {/* Optional second content line */}
                        {patient.lastVisit && (
                          <p className="text-[10px] text-muted-foreground truncate">Last visit: {patient.lastVisit}</p>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Phone className="h-3 w-3 text-purple-500 opacity-0 group-hover:opacity-100" />
                        <Calendar className="h-3 w-3 text-purple-500 opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Quick Fill Section - Example of another accordion section */}
            <AccordionItem value="quickFill" className="border-b">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <div className="relative mr-2 h-4 w-4">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <Clock className="h-2 w-2 absolute -bottom-0.5 -right-0.5 text-green-600" />
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
                <div className="border rounded-sm overflow-y-auto max-h-40 divide-y divide-gray-100">
                  <div className="group flex items-center bg-white hover:bg-gray-50 py-1.5 px-2 text-xs cursor-pointer">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    <div className="min-w-0 flex-grow grid grid-cols-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">30-min opening</p>
                        <p className="text-[10px] text-muted-foreground ml-2">10:30 AM</p>
                      </div>
                      {/* First content line */}
                      <p className="text-muted-foreground truncate">Dr. Picard • Op. 2</p>
                      {/* Second content line with note */}
                      <p className="text-[10px] text-muted-foreground truncate">Perfect for hygiene recall</p>
                    </div>
                    <UserPlus className="h-3 w-3 text-green-500 opacity-0 group-hover:opacity-100 ml-1.5" />
                  </div>
                  
                  <div className="group flex items-center bg-white hover:bg-gray-50 py-1.5 px-2 text-xs cursor-pointer">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    <div className="min-w-0 flex-grow grid grid-cols-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">45-min opening</p>
                        <p className="text-[10px] text-muted-foreground ml-2">2:15 PM</p>
                      </div>
                      <p className="text-muted-foreground truncate">Dr. Janeway • Op. 4</p>
                    </div>
                    <UserPlus className="h-3 w-3 text-green-500 opacity-0 group-hover:opacity-100 ml-1.5" />
                  </div>
                  
                  <div className="group flex items-center bg-white hover:bg-gray-50 py-1.5 px-2 text-xs cursor-pointer">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    <div className="min-w-0 flex-grow grid grid-cols-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">60-min opening</p>
                        <p className="text-[10px] text-muted-foreground ml-2">3:30 PM</p>
                      </div>
                      <p className="text-muted-foreground truncate">Dr. Sisko • Op. 1</p>
                    </div>
                    <UserPlus className="h-3 w-3 text-green-500 opacity-0 group-hover:opacity-100 ml-1.5" />
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