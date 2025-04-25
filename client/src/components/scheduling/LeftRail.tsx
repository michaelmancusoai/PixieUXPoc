import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Timer } from 'lucide-react';
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
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search waitlist..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* ASAP List */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-semibold flex items-center">
            <Timer className="mr-2 h-4 w-4 text-red-500" />
            ASAP List
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {asapList.length > 0 ? (
            <div className="space-y-2">
              {asapList.map(patient => (
                <div key={patient.id} className="border rounded p-2 text-xs">
                  <div className="font-semibold">{patient.name}</div>
                  <div className="text-muted-foreground">{patient.reason}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span>{patient.contact}</span>
                    <Button size="sm" variant="secondary" className="h-6 text-[10px]">
                      Call
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No urgent patients</p>
          )}
        </CardContent>
      </Card>
      
      {/* Waitlist */}
      <Card className="flex-1">
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-semibold">
            Waitlist ({filteredWaitlist.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {filteredWaitlist.length > 0 ? (
            <Accordion type="multiple" className="space-y-2">
              {filteredWaitlist.map(patient => (
                <AccordionItem key={patient.id} value={patient.id.toString()} className="border rounded">
                  <AccordionTrigger className="py-2 px-3 text-xs hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-semibold">{patient.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        Match: {patient.propensityScore}%
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-2 text-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Procedure:</span>
                        <span>{patient.procedure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Waiting:</span>
                        <span>{patient.waitingSince}</span>
                      </div>
                      <Button size="sm" className="w-full mt-1 h-7 text-xs">
                        Schedule
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-xs text-muted-foreground">No patients on waitlist</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}