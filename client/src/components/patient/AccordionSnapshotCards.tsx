import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { 
  Calendar, AlertTriangle, Syringe, Stethoscope, 
  CreditCard, User, Clock, ChevronRight, Edit,
  Shield, DollarSign, Activity
} from "lucide-react";

export default function AccordionSnapshotCards() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg font-medium">Patient Snapshot</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Accordion type="multiple" className="w-full" defaultValue={["nextVisit", "balance"]}>
          <SnapshotSection 
            id="nextVisit" 
            icon={<Calendar className="h-4 w-4" />} 
            title="Next Visit" 
            highlight={<span className="text-blue-700 font-medium">Tomorrow</span>}
          >
            <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-100">
              <div className="text-lg font-semibold text-primary">Tomorrow, 9:00 AM</div>
              <div className="text-sm text-gray-700">Prophylaxis (45 min)</div>
              <div className="text-sm text-gray-700">Dr. Picard · Operatory 3</div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button variant="default" size="sm" className="flex items-center h-8">
                <Calendar className="h-4 w-4 mr-1" />
                Reschedule
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                Details
              </Button>
            </div>
          </SnapshotSection>
          
          <SnapshotSection 
            id="balance" 
            icon={<DollarSign className="h-4 w-4" />} 
            title="Outstanding Balance" 
            highlight={<span className="text-red-600 font-bold">$834.00</span>}
          >
            {/* Aging buckets progress bar */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
              <div className="relative h-3 bg-gray-200 rounded mb-2 overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-green-600" style={{ width: "10%" }} title="Current: $83.40"></div>
                <div className="absolute h-full bg-amber-500" style={{ left: "10%", width: "30%" }} title="1-30 days: $250.20"></div>
                <div className="absolute h-full bg-red-600" style={{ left: "40%", width: "60%" }} title="30+ days: $500.40"></div>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current</span>
                <span>30 days</span>
                <span>60 days</span>
                <span>90+ days</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button variant="default" size="sm" className="flex items-center h-8">
                <CreditCard className="h-4 w-4 mr-1" />
                Payment
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                Details
              </Button>
            </div>
          </SnapshotSection>
          
          <SnapshotSection 
            id="insurance" 
            icon={<Shield className="h-4 w-4" />} 
            title="Insurance" 
            highlight={<span className="text-muted-foreground">Delta Dental PPO</span>}
          >
            <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-100">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Policy #DD78291B</span>
                <span className="text-sm text-muted-foreground">Group #4421</span>
              </div>
            </div>
            
            {/* Annual Maximum section with progress bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">Annual Maximum</div>
                <div className="font-medium text-sm">
                  <span className="text-blue-700">$820</span>
                  <span className="mx-1 text-gray-400">/</span>
                  <span>$1,500</span>
                </div>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full" style={{ width: '55%' }}></div>
              </div>
              <div className="text-xs text-amber-600 mt-1 text-right">Expires 12/31</div>
            </div>
            
            {/* Deductible section with visual indicator */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">Deductible</div>
                <div className="font-medium text-sm flex items-center">
                  <span className="text-green-600">$50</span>
                  <span className="mx-1 text-gray-400">/</span>
                  <span>$50</span>
                  <Badge className="ml-2 bg-green-600 text-white hover:bg-green-700 text-xs">
                    Met
                  </Badge>
                </div>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-green-600 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button variant="default" size="sm" className="flex items-center h-8">
                <Edit className="h-4 w-4 mr-1" />
                Update
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                Details
              </Button>
            </div>
          </SnapshotSection>
          
          <SnapshotSection 
            id="recalls" 
            icon={<Clock className="h-4 w-4" />} 
            title="Recalls & Reminders" 
            highlight={<span className="text-amber-600 font-medium">Overdue</span>}
          >
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <Clock className="text-amber-500 h-4 w-4 mr-2" />
                <span>Hygiene Recall</span>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-600 border-amber-200">
                Overdue 2M
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <Stethoscope className="text-amber-500 h-4 w-4 mr-2" />
                <span>Radiographs</span>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-600 border-amber-200">
                Due now
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 mb-3">
              <div className="flex items-center">
                <Bell className="text-green-600 h-4 w-4 mr-2" />
                <span>Reminders</span>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">
                Sent
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <Button variant="default" size="sm" className="flex items-center h-8">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                Details
              </Button>
            </div>
          </SnapshotSection>
          
          <SnapshotSection 
            id="alerts" 
            icon={<AlertTriangle className="h-4 w-4" />} 
            title="Risk & Alerts" 
            highlight={<span className="text-red-600 font-medium">2 Allergies</span>}
          >
            <div className="grid grid-cols-1 gap-2 mb-3">
              <div className="flex items-center gap-2 bg-red-50 p-2 rounded-md border border-red-100">
                <AlertTriangle className="text-red-600 h-5 w-5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-red-700">Latex, Penicillin</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>Allergies</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md border border-blue-100">
                <Syringe className="text-blue-600 h-5 w-5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-blue-700">Lisinopril, Atorvastatin</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>Medications</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-md border border-amber-100">
                <Activity className="text-amber-600 h-5 w-5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-amber-700">138/85</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Blood Pressure</span>
                    <span className="text-muted-foreground">04/01/25</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button variant="default" size="sm" className="flex items-center h-8">
                <Edit className="h-4 w-4 mr-1" />
                Update
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                Details
              </Button>
            </div>
          </SnapshotSection>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function SnapshotSection({ 
  id, 
  icon, 
  title, 
  highlight, 
  children 
}: { 
  id: string; 
  icon: React.ReactNode; 
  title: string; 
  highlight: React.ReactNode;
  children: React.ReactNode; 
}) {
  return (
    <AccordionItem value={id} className="border-b">
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
        <div className="flex items-center w-full">
          <div className="flex items-center">
            <span className="mr-2 text-muted-foreground">{icon}</span>
            <h3 className="font-medium">{title}</h3>
          </div>
          <div className="ml-auto">
            {highlight}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-3">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function Bell(props: React.ComponentProps<typeof Calendar>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}