import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Timer, UserPlus, Calendar, Clock, Plus } from 'lucide-react';
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
      
      {/* Search Input */}
      <div className="relative mb-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search waitlist..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Main Card with Accordion layout similar to PatientProfilePage */}
      <Card className="shadow-sm">
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle className="text-lg font-medium">Schedule Management</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <Accordion type="multiple" className="w-full" defaultValue={["asapList", "waitlist"]}>
            
            {/* ASAP List Section */}
            <AccordionItem value="asapList" className="border-b">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <Timer className="mr-2 h-4 w-4 text-red-500" />
                    <h3 className="font-medium">ASAP List</h3>
                  </div>
                  <div className="ml-auto">
                    <span className="text-red-600 font-medium">{asapList.length} patients</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                {asapList.length > 0 ? (
                  <div className="space-y-2">
                    {asapList.map(patient => (
                      <div key={patient.id} className="flex items-center gap-2 bg-red-50 p-2 rounded-md border border-red-100 text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-red-700">{patient.name}</p>
                          <div className="text-muted-foreground">{patient.reason}</div>
                          <div className="flex justify-between items-center mt-1">
                            <span>{patient.contact}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="secondary" className="h-6 text-[10px] ml-auto flex-shrink-0">
                          Call
                        </Button>
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
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4 text-blue-500" />
                    <h3 className="font-medium">Waitlist</h3>
                  </div>
                  <div className="ml-auto">
                    <span className="text-blue-600 font-medium">{filteredWaitlist.length} patients</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                {filteredWaitlist.length > 0 ? (
                  <div className="space-y-2">
                    {filteredWaitlist.map(patient => (
                      <div key={patient.id} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{patient.name}</span>
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                            {patient.propensityScore}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block">Procedure:</span>
                            <span className="font-medium">{patient.procedure}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Waiting since:</span>
                            <span className="font-medium">{patient.waitingSince}</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3 h-7 text-xs">
                          Schedule
                        </Button>
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
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center w-full">
                  <div className="flex items-center">
                    <div className="relative mr-2 h-4 w-4 text-green-500">
                      <Calendar className="h-4 w-4" />
                      <Clock className="h-2 w-2 absolute -bottom-0.5 -right-0.5" />
                    </div>
                    <h3 className="font-medium">Quick Fill</h3>
                  </div>
                  <div className="ml-auto">
                    <span className="text-green-600 font-medium">Find openings</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Quick fill feature helps you identify available slots to maximize chair utilization.</p>
                </div>
                <Button size="sm" className="w-full mt-3 h-7 text-xs">
                  Find Available Slots
                </Button>
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}