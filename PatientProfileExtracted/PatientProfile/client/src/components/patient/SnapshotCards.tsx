import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, AlertTriangle, Syringe, Stethoscope, 
  CreditCard, User, Clock, ChevronRight, Edit,
  Shield, DollarSign
} from "lucide-react";

export default function SnapshotCards() {
  return (
    <>
      <NextVisitCard />
      <BalanceCard />
      <InsuranceCard />
      <RecallsCard />
      <RiskAlertsCard />
    </>
  );
}

function NextVisitCard() {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <Calendar className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <CardTitle className="text-base font-medium mb-0">Next Visit</CardTitle>
            <div className="text-sm text-blue-700 font-medium">Tomorrow</div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-100">
          <div className="text-lg font-semibold text-primary">Tomorrow, 9:00 AM</div>
          <div className="text-sm text-gray-700">Prophylaxis (45 min)</div>
          <div className="text-sm text-gray-700">Dr. Nguyen · Operatory 3</div>
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
      </CardContent>
    </Card>
  );
}

function BalanceCard() {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-red-100 rounded-full p-2 mr-3">
            <DollarSign className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-base font-medium mb-0">Outstanding Balance</CardTitle>
            <div className="text-lg font-bold text-red-600">$834.00</div>
          </div>
        </div>
        
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
      </CardContent>
    </Card>
  );
}

function InsuranceCard() {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <Shield className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <CardTitle className="text-base font-medium mb-0">Insurance Coverage</CardTitle>
            <div className="text-sm text-muted-foreground">Delta Dental PPO</div>
          </div>
        </div>
        
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
      </CardContent>
    </Card>
  );
}

function RecallsCard() {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-amber-100 rounded-full p-2 mr-3">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-base font-medium mb-0">Recalls & Reminders</CardTitle>
            <div className="text-sm text-amber-600 font-medium">Overdue</div>
          </div>
        </div>
        
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
      </CardContent>
    </Card>
  );
}

function RiskAlertsCard() {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-red-100 rounded-full p-2 mr-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-base font-medium mb-0">Risk & Alerts</CardTitle>
            <div className="text-sm text-red-600 font-medium">2 Allergies</div>
          </div>
        </div>
        
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
      </CardContent>
    </Card>
  );
}

// Import is missing
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

function Activity(props: React.ComponentProps<typeof Calendar>) {
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
