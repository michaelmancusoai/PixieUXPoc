import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Activity, 
  AlertCircle, 
  ArrowUpRight, 
  Bell, 
  Check, 
  ClipboardCheck, 
  CreditCard, 
  FileCheck, 
  FileText, 
  Stethoscope, 
  SmilePlus,
  ChevronDown,
  Clock,
  X,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock patient data for the flow board
const patientData = [
  { id: 1, name: "Thompson, S", firstName: "Sandra", lastName: "Thompson", appointmentType: "Root Canal", operatory: "Op 1", provider: "Dr. Carter", timeInStatus: 423, hasAlert: true, dob: "05/12/1968", balance: 220 },
  { id: 2, name: "Garcia, R", firstName: "Robert", lastName: "Garcia", appointmentType: "Crown Cementation", operatory: "Op 2", provider: "Dr. Carter", timeInStatus: 187, hasAlert: false, dob: "09/22/1985", balance: 0 },
  { id: 3, name: "Chen, E", firstName: "Emily", lastName: "Chen", appointmentType: "New Patient Exam", operatory: "Op 3", provider: "Dr. Smith", timeInStatus: 89, hasAlert: false, dob: "02/14/1992", balance: 0 },
  { id: 4, name: "Johnson, M", firstName: "Mark", lastName: "Johnson", appointmentType: "Filling", operatory: "Op 4", provider: "Dr. Smith", timeInStatus: 312, hasAlert: true, dob: "11/30/1973", balance: 150 },
  { id: 5, name: "Williams, J", firstName: "James", lastName: "Williams", appointmentType: "Cleaning", operatory: "Hyg 1", provider: "Lisa R.", timeInStatus: 275, hasAlert: false, dob: "07/05/1990", balance: 0 },
  { id: 6, name: "Lopez, A", firstName: "Ana", lastName: "Lopez", appointmentType: "Extraction", operatory: "Op 5", provider: "Dr. Carter", timeInStatus: 164, hasAlert: false, dob: "03/18/1982", balance: 75 },
];

// Mock exception data
const exceptionData = {
  late: [
    { id: 101, name: "Miller, K", firstName: "Kevin", lastName: "Miller", appointmentType: "Cleaning", timeInStatus: 725, appointmentTime: "9:30 AM" },
    { id: 102, name: "Davis, L", firstName: "Lisa", lastName: "Davis", appointmentType: "Filling", timeInStatus: 1247, appointmentTime: "10:45 AM" }
  ],
  noShow: [
    { id: 201, name: "Adams, J", firstName: "John", lastName: "Adams", appointmentType: "Consultation", appointmentTime: "8:15 AM" }
  ],
  cancelled: [
    { id: 301, name: "Brown, T", firstName: "Thomas", lastName: "Brown", appointmentType: "Checkup", appointmentTime: "2:30 PM" },
    { id: 302, name: "Wilson, S", firstName: "Sarah", lastName: "Wilson", appointmentType: "Cleaning", appointmentTime: "3:45 PM" }
  ],
  walkOut: [
    { id: 401, name: "Rodriguez, C", firstName: "Carlos", lastName: "Rodriguez", appointmentType: "Emergency", balance: 185 }
  ]
};

// Flow status definitions
const flowColumns = [
  { id: "checked-in", title: "Checked-In", icon: ClipboardCheck, color: "bg-blue-500", wipLimit: 5, role: "Front Desk" },
  { id: "seated", title: "Seated", icon: Activity, color: "bg-teal-500", wipLimit: 8, role: "Assistant" },
  { id: "pre-clinical", title: "Pre-Clinical", icon: Stethoscope, color: "bg-indigo-500", wipLimit: 6, role: "Assistant" },
  { id: "doctor-ready", title: "Doctor Ready", icon: Bell, color: "bg-violet-500", wipLimit: 3, role: "Assistant" },
  { id: "in-treatment", title: "In Treatment", icon: SmilePlus, color: "bg-purple-500", wipLimit: 8, role: "Dentist" },
  { id: "wrap-up", title: "Clinical Wrap-Up", icon: FileCheck, color: "bg-pink-500", wipLimit: 5, role: "Dentist" },
  { id: "checkout-ready", title: "Ready for Checkout", icon: CreditCard, color: "bg-orange-500", wipLimit: 3, role: "Assistant" },
  { id: "checked-out", title: "Checked-Out", icon: Check, color: "bg-green-500", wipLimit: 999, role: "Front Desk" },
];

// Initial patient distribution
const initialFlowDistribution = {
  "checked-in": [patientData[4], patientData[5]],
  "seated": [patientData[3]],
  "pre-clinical": [],
  "doctor-ready": [patientData[2]],
  "in-treatment": [patientData[0], patientData[1]],
  "wrap-up": [],
  "checkout-ready": [],
  "checked-out": [],
};

// Format elapsed time (mm:ss)
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Patient interface
interface PatientData {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  appointmentType: string;
  operatory: string;
  provider: string;
  timeInStatus: number;
  hasAlert: boolean;
  dob: string;
  balance: number;
}

// Patient card component props interface
interface PatientCardProps {
  patient: PatientData;
  columnColor: string;
}

// Patient card component
function PatientCard({ patient, columnColor }: PatientCardProps) {
  const formattedTime = formatTime(patient.timeInStatus);
  const isTimerWarning = patient.timeInStatus > 300; // Warning after 5 minutes
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={cn(
            "w-full cursor-pointer transition-all",
            `border-${columnColor.replace('bg-', 'border-')}`,
            { "border-amber-500 animate-pulse": isTimerWarning }
          )}>
            <CardContent className="p-3 relative">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">{patient.appointmentType}</p>
                </div>
                <div className="flex items-center">
                  {patient.hasAlert && (
                    <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                  )}
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "ml-1 text-xs font-medium", 
                      isTimerWarning ? "text-amber-500" : "text-muted-foreground"
                    )}
                  >
                    {formattedTime}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="p-2 w-60">
          <div className="space-y-1">
            <p className="font-medium">{patient.firstName} {patient.lastName}</p>
            <p className="text-xs">DOB: {patient.dob}</p>
            <p className="text-xs">Provider: {patient.provider}</p>
            <p className="text-xs">Operatory: {patient.operatory}</p>
            {patient.balance > 0 && (
              <p className="text-xs font-medium text-amber-500">Balance: ${patient.balance}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// FlowColumn component interface
interface FlowColumnProps {
  column: {
    id: string;
    title: string;
    icon: React.ElementType;
    color: string;
    wipLimit: number;
    role?: string;
  };
  patients: any[];
  className?: string;
}

// FlowColumn component
function FlowColumn({ column, patients, className }: FlowColumnProps) {
  const isOverWipLimit = patients.length > column.wipLimit;
  const Icon = column.icon;
  
  return (
    <div className={cn("min-w-[220px] w-full flex flex-col h-full", className)}>
      <div className={cn(
        "text-white px-3 py-2 rounded-t-md flex justify-between items-center",
        column.color
      )}>
        <div className="flex items-center">
          <Icon className="h-4 w-4 mr-1" />
          <h3 className="text-sm font-medium">{column.title}</h3>
        </div>
        <Badge 
          variant="outline" 
          className={cn(
            "bg-white/20 hover:bg-white/20 text-white border-none",
            isOverWipLimit && "bg-red-300/30 hover:bg-red-300/30"
          )}
        >
          {patients.length}/{column.wipLimit}
        </Badge>
      </div>
      
      <div className="bg-white border border-t-0 border-muted rounded-b-md p-2 space-y-2 flex-grow">
        {patients.length === 0 ? (
          <div className="h-20 flex items-center justify-center text-muted-foreground text-xs">
            No patients
          </div>
        ) : (
          patients.map((patient) => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              columnColor={column.color} 
            />
          ))
        )}
      </div>
      
      {isOverWipLimit && (
        <div className="h-1 bg-red-500 mt-1 rounded animate-pulse" />
      )}
    </div>
  );
}

// Exception Patient interface
interface ExceptionPatient {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  appointmentType: string;
  appointmentTime?: string;
  operatory?: string;
  provider?: string;
  timeInStatus?: number;
  hasAlert?: boolean;
  dob?: string;
  balance?: number;
}

// Exception Card Props Interface
interface ExceptionCardProps {
  patient: ExceptionPatient;
  type: 'late' | 'noShow' | 'cancelled' | 'walkOut';
}

// Exception Card Component
function ExceptionCard({ patient, type }: ExceptionCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'late':
        return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' };
      case 'noShow':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
      case 'cancelled':
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
      case 'walkOut':
        return { bg: 'bg-amber-50', border: 'border-red-200', text: 'text-amber-700' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' };
    }
  };
  
  const styles = getTypeStyles();
  
  return (
    <Card className={cn("w-full", styles.bg, styles.border, "border")}>
      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <p className={cn("font-medium text-xs", styles.text)}>{patient.name}</p>
          {type === 'late' && patient.timeInStatus !== undefined && (
            <Badge variant="outline" className={styles.text}>
              {formatTime(patient.timeInStatus)}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{patient.appointmentType || 'Appointment'}</p>
        {patient.appointmentTime && (
          <p className="text-xs text-muted-foreground mt-1">{patient.appointmentTime}</p>
        )}
        {patient.balance && (
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-red-600">${patient.balance}</p>
            <Button variant="ghost" size="xs" className="h-5 text-xs px-2">
              Send Statement
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Define flow state type
interface FlowState {
  [key: string]: PatientData[];
}

export default function MissionControlPage() {
  const [flowState, setFlowState] = useState<FlowState>(initialFlowDistribution);

  return (
    <NavigationWrapper>
      <div className="space-y-4">
        {/* Header with KPIs */}
        <div className="bg-white pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold">Mission Control</h1>
            </div>
          </div>
          
          {/* KPI Header Row */}
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-1 px-3">
              <span className="font-normal mr-1">Today:</span> April 22, 2025
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 py-1 px-3">
              <span className="font-normal mr-1">Wait-to-Seat:</span> 4.2 min
            </Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 py-1 px-3">
              <span className="font-normal mr-1">Seat-to-Doctor:</span> 7.5 min
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-1 px-3">
              <span className="font-normal mr-1">Throughput:</span> 14/24
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 py-1 px-3">
              <span className="font-normal mr-1">Utilization:</span> 87%
            </Badge>
            <div className="flex-grow"></div>
          </div>
          
          <Separator className="my-4" />
        </div>
        
        {/* Main Flow Board */}
        <div className="flex">
          {/* Flow Columns */}
          <div className="flex overflow-x-auto pb-4 gap-3 flex-grow flex-1" style={{ minHeight: "calc(100vh - 300px)" }}>
            {flowColumns.map((column, index) => (
              <FlowColumn 
                key={column.id} 
                column={column} 
                patients={flowState[column.id] || []} 
                className="flex-1"
              />
            ))}
          </div>
          
          {/* Exception Rail */}
          <div className="w-80 ml-3 hidden lg:block">
            <div className="bg-gray-50 rounded-md p-3 space-y-3 h-full">
              <div>
                <h3 className="text-sm font-semibold flex items-center text-amber-700 mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  Late ({exceptionData.late.length})
                </h3>
                <div className="space-y-2">
                  {exceptionData.late.map(patient => (
                    <ExceptionCard key={patient.id} patient={patient} type="late" />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold flex items-center text-red-700 mb-2">
                  <X className="h-4 w-4 mr-1" />
                  No-Show ({exceptionData.noShow.length})
                </h3>
                <div className="space-y-2">
                  {exceptionData.noShow.map(patient => (
                    <ExceptionCard key={patient.id} patient={patient} type="noShow" />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold flex items-center text-gray-700 mb-2">
                  <FileText className="h-4 w-4 mr-1" />
                  Cancelled ({exceptionData.cancelled.length})
                </h3>
                <div className="space-y-2">
                  {exceptionData.cancelled.map(patient => (
                    <ExceptionCard key={patient.id} patient={patient} type="cancelled" />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold flex items-center text-amber-800 mb-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Walk-Out ({exceptionData.walkOut.length})
                </h3>
                <div className="space-y-2">
                  {exceptionData.walkOut.map(patient => (
                    <ExceptionCard key={patient.id} patient={patient} type="walkOut" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}