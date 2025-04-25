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

export default function LeftRail({ selectedDate }: LeftRailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample patients for the waitlist
  const waitlistPatients = [
    { id: 1, name: 'Elizabeth Rodriguez', procedure: 'Crown', waitingSince: '2 days', propensityScore: 85 },
    { id: 2, name: 'William Jackson', procedure: 'Root Canal', waitingSince: '5 days', propensityScore: 92 },
    { id: 3, name: 'Jennifer Taylor', procedure: 'Extraction', waitingSince: '1 day', propensityScore: 76 },
    { id: 4, name: 'James Brown', procedure: 'Filling', waitingSince: '3 days', propensityScore: 68 },
  ];
  
  // Sample ASAP list (patients who need to be seen urgently)
  const asapList = [
    { id: 5, name: 'Linda Lewis', reason: 'Broken tooth', contact: '555-123-4567' },
    { id: 6, name: 'Richard Walker', reason: 'Severe pain', contact: '555-987-6543' },
  ];
  
  // Filter patients based on search term
  const filteredWaitlist = searchTerm 
    ? waitlistPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.procedure.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : waitlistPatients;
  
  return (
    <div className="h-full overflow-y-auto space-y-4">
      
      {/* Main Card with Accordion layout similar to PatientProfilePage */}
      <Card className="shadow-sm">
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <span>Schedule Management</span>
            <span className="text-sm text-muted-foreground font-normal">{format(selectedDate, 'EEEE, MMMM d')}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Search Input - Integrated inside card */}
          <div className="px-4 py-3 border-b">
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
          
          <Accordion type="multiple" className="w-full" defaultValue={["asapList", "waitlist"]}>
            
            {/* ASAP List Section */}
            <AccordionItem value="asapList" className="border-b">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <Timer className="mr-2 h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">ASAP List</h3>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="secondary" className="font-normal">
                      {asapList.length}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                {asapList.length > 0 ? (
                  <div className="space-y-2">
                    {asapList.map(patient => (
                      <div key={patient.id} className="flex flex-col bg-white rounded-md border text-xs overflow-hidden">
                        <div className="p-2 border-b">
                          <div className="flex justify-between">
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-xs text-muted-foreground">{patient.contact}</p>
                          </div>
                          <div className="flex items-center mt-0.5">
                            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                            <p className="text-muted-foreground">{patient.reason}</p>
                          </div>
                        </div>
                        <div className="flex divide-x">
                          <Button size="sm" variant="ghost" className="h-7 text-xs flex-1 rounded-none hover:bg-gray-50">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs flex-1 rounded-none hover:bg-gray-50">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">No urgent patients</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            
            {/* Waitlist Section */}
            <AccordionItem value="waitlist" className="border-b">
              <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Waitlist</h3>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="secondary" className="font-normal">
                      {filteredWaitlist.length}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                {filteredWaitlist.length > 0 ? (
                  <div className="space-y-2">
                    {filteredWaitlist.map(patient => (
                      <div key={patient.id} className="flex flex-col bg-white rounded-md border text-xs overflow-hidden">
                        <div className="p-2 border-b">
                          <div className="flex justify-between">
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-xs text-muted-foreground">{patient.waitingSince}</p>
                          </div>
                          <div className="flex items-center mt-0.5">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                            <p className="text-muted-foreground">{patient.procedure}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 divide-x">
                          <Button size="sm" variant="ghost" className="h-7 text-xs rounded-none hover:bg-gray-50">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs rounded-none hover:bg-gray-50">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs rounded-none hover:bg-gray-50 font-medium">
                            <Plus className="h-3 w-3 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    ))}
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
                    <Badge variant="secondary" className="font-normal">
                      3
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-2">
                  <div className="flex flex-col bg-white rounded-md border text-xs overflow-hidden">
                    <div className="p-2 border-b">
                      <div className="flex justify-between">
                        <p className="font-medium">30-min opening</p>
                        <p className="text-xs text-muted-foreground">10:30 AM</p>
                      </div>
                      <div className="flex items-center mt-0.5">
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        <p className="text-muted-foreground">Dr. Smith • Op. 2</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-xs rounded-none hover:bg-gray-50">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Fill Slot
                    </Button>
                  </div>
                  
                  <div className="flex flex-col bg-white rounded-md border text-xs overflow-hidden">
                    <div className="p-2 border-b">
                      <div className="flex justify-between">
                        <p className="font-medium">45-min opening</p>
                        <p className="text-xs text-muted-foreground">2:15 PM</p>
                      </div>
                      <div className="flex items-center mt-0.5">
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        <p className="text-muted-foreground">Dr. Johnson • Op. 4</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-xs rounded-none hover:bg-gray-50">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Fill Slot
                    </Button>
                  </div>
                  
                  <div className="flex flex-col bg-white rounded-md border text-xs overflow-hidden">
                    <div className="p-2 border-b">
                      <div className="flex justify-between">
                        <p className="font-medium">60-min opening</p>
                        <p className="text-xs text-muted-foreground">3:30 PM</p>
                      </div>
                      <div className="flex items-center mt-0.5">
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        <p className="text-muted-foreground">Dr. Davis • Op. 1</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-xs rounded-none hover:bg-gray-50">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Fill Slot
                    </Button>
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