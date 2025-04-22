import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, AlertTriangle, Syringe, Stethoscope, 
  CreditCard, User, Clock, ChevronRight, Edit,
  Shield, DollarSign
} from "lucide-react";

export interface SnapshotCardsProps {
  appointments?: any[];
  recalls?: any[];
  claims?: any[];
}

export default function SnapshotCards({ appointments = [], recalls = [], claims = [] }: SnapshotCardsProps) {
  return (
    <>
      <NextVisitCard appointments={appointments} />
      <BalanceCard claims={claims} />
      <InsuranceCard />
      <RecallsCard recalls={recalls} />
      <RiskAlertsCard />
    </>
  );
}

function NextVisitCard({ appointments = [] }: { appointments?: any[] }) {
  // Sort appointments by date to find the next one
  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
  
  const nextAppointment = sortedAppointments.length > 0 ? sortedAppointments[0] : null;
  
  if (!nextAppointment) {
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
          
          <div className="flex items-center justify-center h-20 text-muted-foreground">
            No upcoming appointments
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
  
  // Format the appointment date
  const date = new Date(nextAppointment.startTime);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
  
  // Format the time
  const startTime = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
  
  // Calculate duration
  const endDate = new Date(nextAppointment.endTime);
  const durationMs = endDate.getTime() - date.getTime();
  const durationMinutes = Math.floor(durationMs / 60000);
  
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
          <p className="font-semibold text-xl">{formattedDate}</p>
          <p className="text-sm text-muted-foreground">{startTime} · {nextAppointment.appointmentType}</p>
          <p className="text-sm text-muted-foreground">{durationMinutes} min</p>
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

function BalanceCard({ claims = [] }: { claims?: any[] }) {
  // Calculate total balance from claims
  const totalBalance = claims.reduce((sum, claim) => {
    // If the claim is approved but not paid, add to balance
    if (claim.status === "pending" || claim.status === "submitted") {
      const amount = typeof claim.amount === 'string' 
        ? parseFloat(claim.amount) 
        : (claim.amount || 0);
      return sum + amount;
    }
    return sum;
  }, 0);
  
  // Find the last payment date from the most recent paid claim
  const paidClaims = claims.filter(claim => claim.status === "paid");
  const lastPaymentDate = paidClaims.length > 0 
    ? new Date(Math.max(...paidClaims.map(c => new Date(c.updatedAt).getTime())))
    : null;
  
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
          <p className="font-semibold text-xl">${totalBalance.toFixed(2)}</p>
          {lastPaymentDate && (
            <p className="text-sm text-muted-foreground">
              Last Payment: {lastPaymentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          )}
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
  // Use placeholder insurance data until we add insurance to database
  const insuranceDetails = {
    provider: "Blue Cross Blue Shield",
    policyNumber: "BCBS12345678",
    status: "Active",
    nextVerification: "July 2025"
  };
  
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
          <p className="font-semibold">{insuranceDetails.provider}</p>
          <div className="flex items-center justify-between text-sm mt-1">
            <p className="text-muted-foreground">Policy #: {insuranceDetails.policyNumber}</p>
            <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
              {insuranceDetails.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Next Verification: {insuranceDetails.nextVerification}</p>
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

function RecallsCard({ recalls = [] }: { recalls?: any[] }) {
  if (recalls.length === 0) {
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
          
          <div className="flex items-center justify-center h-20 text-muted-foreground">
            No scheduled recalls
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
          {recalls.map((recall, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>{recall.type}</span>
              <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                {new Date(recall.dueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </Badge>
            </div>
          ))}
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
  // Use placeholder medical alert data until we add support to database
  const medicalAlerts = [
    { type: "Allergy", description: "Penicillin - Severe reaction" },
    { type: "Medical", description: "Asthma - Uses inhaler as needed" }
  ];
  
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
          {medicalAlerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-2">
              <Badge 
                variant={alert.type === "Allergy" ? "destructive" : "outline"} 
                className="mt-0.5"
              >
                {alert.type}
              </Badge>
              <span className="text-sm">{alert.description}</span>
            </div>
          ))}
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