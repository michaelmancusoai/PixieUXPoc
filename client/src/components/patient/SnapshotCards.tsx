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
            <h3 className="font-medium text-gray-900">Next Visit</h3>
            <p className="text-sm text-muted-foreground">Scheduled Appointment</p>
          </div>
        </div>
        
        <div className="mb-2">
          <p className="font-semibold text-xl">June 15, 2025</p>
          <p className="text-sm text-muted-foreground">10:30 AM · Cleaning</p>
          <p className="text-sm text-muted-foreground">Dr. Johnson</p>
        </div>

        <div className="flex justify-end mt-3">
          <Button variant="outline" size="sm" className="flex items-center font-medium">
            <Calendar className="h-4 w-4 mr-1" />
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BalanceCard() {
  return (
    <Card className="mt-4 transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-red-100 rounded-full p-2 mr-3">
            <CreditCard className="h-5 w-5 text-red-700" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Outstanding Balance</h3>
            <p className="text-sm text-muted-foreground">Account Summary</p>
          </div>
        </div>
        
        <div className="mb-2">
          <p className="font-semibold text-xl">$325.75</p>
          <p className="text-sm text-muted-foreground">Last Payment: April 10, 2025</p>
        </div>
        
        <div className="flex justify-end mt-3">
          <Button variant="outline" size="sm" className="flex items-center font-medium">
            <DollarSign className="h-4 w-4 mr-1" />
            Pay Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InsuranceCard() {
  return (
    <Card className="mt-4 transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-emerald-100 rounded-full p-2 mr-3">
            <Shield className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Insurance</h3>
            <p className="text-sm text-muted-foreground">Coverage Details</p>
          </div>
        </div>
        
        <div className="mb-2">
          <p className="font-semibold">Blue Cross Blue Shield</p>
          <div className="flex items-center justify-between text-sm mt-1">
            <p className="text-muted-foreground">Policy #: BCBS12345678</p>
            <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">Active</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Next Verification: July 2025</p>
        </div>
        
        <div className="flex justify-end mt-3">
          <Button variant="outline" size="sm" className="flex items-center font-medium">
            <Edit className="h-4 w-4 mr-1" />
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RecallsCard() {
  return (
    <Card className="mt-4 transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-purple-100 rounded-full p-2 mr-3">
            <Clock className="h-5 w-5 text-purple-700" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Recalls</h3>
            <p className="text-sm text-muted-foreground">Coming Up</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-2">
          <div className="flex justify-between items-center text-sm">
            <span>Annual Check-up</span>
            <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">Aug 2025</Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>X-Rays</span>
            <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">Dec 2025</Badge>
          </div>
        </div>
        
        <div className="flex justify-end mt-3">
          <Button variant="outline" size="sm" className="flex items-center font-medium">
            <Calendar className="h-4 w-4 mr-1" />
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskAlertsCard() {
  return (
    <Card className="mt-4 transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-amber-100 rounded-full p-2 mr-3">
            <AlertTriangle className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Medical Alerts</h3>
            <p className="text-sm text-muted-foreground">Critical Information</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-2">
          <div className="flex items-start gap-2">
            <Badge variant="destructive" className="mt-0.5">Allergy</Badge>
            <span className="text-sm">Penicillin - Severe reaction</span>
          </div>
          
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">Medical</Badge>
            <span className="text-sm">Asthma - Uses inhaler as needed</span>
          </div>
        </div>
        
        <div className="flex justify-end mt-3">
          <Button variant="outline" size="sm" className="flex items-center font-medium">
            <Edit className="h-4 w-4 mr-1" />
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}