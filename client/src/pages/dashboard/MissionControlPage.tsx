import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AppointmentStatus } from "@shared/schema";
import {
  BarChart4,
  Calendar,
  CheckCircle,
  Clipboard,
  Clock,
  FileCheck,
  HelpCircle,
  Stethoscope,
  CreditCard,
  Bell,
  Armchair,
  AlertCircle,
  AlertTriangle,
  DollarSign,
  X,
  PanelRight,
  ArrowRight
} from "lucide-react";

// Status definitions with colors and icons
const statusColumns = {
  "checked-in": {
    title: "Checked In",
    icon: <Clipboard className="h-4 w-4" />,
    color: "#94a3b8", // slate-400
    wipLimit: 5,
    role: "Front Desk"
  },
  "seated": {
    title: "Seated",
    icon: <Armchair className="h-4 w-4" />,
    color: "#60a5fa", // blue-400
    wipLimit: 6,
    role: "Assistant"
  },
  "pre-clinical": {
    title: "Pre-Clinical",
    icon: <Stethoscope className="h-4 w-4" />,
    color: "#34d399", // emerald-400
    wipLimit: 4,
    role: "Assistant/Hygienist"
  },
  "doctor-ready": {
    title: "Doctor Ready",
    icon: <Bell className="h-4 w-4" />,
    color: "#f97316", // orange-500
    wipLimit: 3,
    role: "Assistant"
  },
  "in-chair": {
    title: "In Treatment",
    icon: <HelpCircle className="h-4 w-4" />,
    color: "#8b5cf6", // violet-500
    wipLimit: 4,
    role: "Dentist"
  },
  "wrap-up": {
    title: "Wrap-Up",
    icon: <FileCheck className="h-4 w-4" />,
    color: "#64748b", // slate-500
    wipLimit: 3,
    role: "Dentist/Assistant"
  },
  "ready-checkout": {
    title: "Ready Checkout",
    icon: <CreditCard className="h-4 w-4" />,
    color: "#10b981", // emerald-500
    wipLimit: 3,
    role: "Front Desk"
  },
  "checked-out": {
    title: "Checked Out",
    icon: <CheckCircle className="h-4 w-4" />,
    color: "#1e293b", // slate-800
    wipLimit: Infinity,
    role: "Front Desk"
  }
};

// Format time for timer display
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Patient card component
interface PatientProps {
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    appointmentType: string;
    status: string;
    timeInStatus: number;
    hasAlert?: boolean;
    balance?: number;
  };
  columnColor: string;
}

const PatientCard: React.FC<PatientProps> = ({ patient, columnColor }) => {
  const [timeInStatus, setTimeInStatus] = useState(patient.timeInStatus || 0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInStatus(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Time-based styling - card border changes color based on wait time
  const getTimeStyle = () => {
    // Different thresholds based on status
    const threshold = patient.status === "checked-in" ? 300 : // 5 min
                      patient.status === "doctor-ready" ? 180 : // 3 min
                      patient.status === "ready-checkout" ? 240 : // 4 min
                      600; // 10 min default
    
    if (timeInStatus > threshold * 0.8) {
      return "animate-pulse border-orange-500"; // 80% of threshold - warning
    } else if (timeInStatus > threshold * 0.5) {
      return "border-yellow-400"; // 50% of threshold - caution
    }
    return "";
  };
  
  return (
    <Card className={`mb-2 overflow-hidden group ${getTimeStyle()}`} 
          style={{ 
            backgroundColor: `${columnColor}10`,
            borderColor: columnColor
          }}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium flex items-center">
              {patient.lastName}, {patient.firstName.charAt(0)}
              {patient.hasAlert && (
                <AlertCircle className="ml-1 h-3 w-3 text-red-500" />
              )}
            </div>
            <div className="text-xs text-gray-500">{patient.appointmentType}</div>
          </div>
          <Badge variant="outline" className="text-xs" style={{ borderColor: columnColor, color: columnColor }}>
            {formatTime(timeInStatus)}
          </Badge>
        </div>
        
        {/* Action buttons shown on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Button size="sm" variant="ghost" className="h-7 text-xs">
            Advance <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Status column component
interface StatusColumnProps {
  column: string;
  patients: Array<{
    id: number;
    firstName: string;
    lastName: string;
    appointmentType: string;
    status: string;
    timeInStatus: number;
    hasAlert?: boolean;
    balance?: number;
  }>;
}

const StatusColumn: React.FC<StatusColumnProps> = ({ column, patients }) => {
  const { title, icon, color, wipLimit, role } = statusColumns[column as keyof typeof statusColumns];
  const count = patients.length;
  const isOverLimit = count > wipLimit && wipLimit !== Infinity;
  
  return (
    <div className="min-w-[200px] flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 px-1.5">
        <div className="flex items-center">
          <span className="mr-1.5" style={{ color }}>{icon}</span>
          <span className="font-medium text-sm">{title}</span>
        </div>
        <Badge variant={isOverLimit ? "destructive" : "outline"} className="ml-1">
          {count}/{wipLimit === Infinity ? "∞" : wipLimit}
        </Badge>
      </div>
      
      <Card className={`flex-1 shadow-sm ${isOverLimit ? 'shadow-red-100 border-red-100' : ''}`}>
        <CardContent className="p-2 h-full overflow-y-auto">
          {patients.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
              No patients
            </div>
          ) : (
            <div>
              {patients.map(patient => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient} 
                  columnColor={color} 
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-xs text-gray-500 mt-1 text-center">
        Owned by {role}
      </div>
    </div>
  );
};

// Exception rail component
interface ExceptionRailProps {
  patients: Array<{
    id: number;
    firstName: string;
    lastName: string;
    appointmentType: string;
    type: string;
    timeInStatus?: number;
    balance?: number;
  }>;
}

const ExceptionRail: React.FC<ExceptionRailProps> = ({ patients }) => {
  // Group patients by exception type
  const late = patients.filter(patient => patient.type === "late");
  const noShow = patients.filter(patient => patient.type === "no-show");
  const cancelled = patients.filter(patient => patient.type === "cancelled");
  const walkOut = patients.filter(patient => patient.type === "walk-out");
  
  return (
    <div className="w-[220px] flex flex-col">
      <div className="flex items-center mb-2 px-1.5">
        <AlertTriangle className="h-4 w-4 text-orange-500 mr-1.5" />
        <span className="font-medium text-sm">Exceptions</span>
      </div>
      
      <Card className="flex-1">
        <CardContent className="p-2 h-full">
          <Tabs defaultValue="late" className="h-full">
            <TabsList className="mb-2 w-full grid grid-cols-4 h-8">
              <TabsTrigger value="late" className="text-xs h-full px-1">
                <div className="flex flex-col items-center">
                  <span className="text-orange-500 text-[10px]">{late.length}</span>
                  <span>Late</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="no-show" className="text-xs h-full px-1">
                <div className="flex flex-col items-center">
                  <span className="text-red-500 text-[10px]">{noShow.length}</span>
                  <span>No-Show</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs h-full px-1">
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-[10px]">{cancelled.length}</span>
                  <span>Cancelled</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="walk-out" className="text-xs h-full px-1">
                <div className="flex flex-col items-center">
                  <span className="text-amber-500 text-[10px]">{walkOut.length}</span>
                  <span>Walk-Out</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="late" className="mt-0 h-[calc(100%-44px)] overflow-auto">
              {late.map(patient => (
                <ExceptionCard key={patient.id} patient={patient} type="late" />
              ))}
              {late.length === 0 && <EmptyException type="late" />}
            </TabsContent>
            
            <TabsContent value="no-show" className="mt-0 h-[calc(100%-44px)] overflow-auto">
              {noShow.map(patient => (
                <ExceptionCard key={patient.id} patient={patient} type="no-show" />
              ))}
              {noShow.length === 0 && <EmptyException type="no-show" />}
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-0 h-[calc(100%-44px)] overflow-auto">
              {cancelled.map(patient => (
                <ExceptionCard key={patient.id} patient={patient} type="cancelled" />
              ))}
              {cancelled.length === 0 && <EmptyException type="cancelled" />}
            </TabsContent>
            
            <TabsContent value="walk-out" className="mt-0 h-[calc(100%-44px)] overflow-auto">
              {walkOut.map(patient => (
                <ExceptionCard key={patient.id} patient={patient} type="walk-out" />
              ))}
              {walkOut.length === 0 && <EmptyException type="walk-out" />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Exception card component
interface ExceptionCardProps {
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    appointmentType: string;
    timeInStatus?: number;
    balance?: number;
  };
  type: string;
}

const ExceptionCard: React.FC<ExceptionCardProps> = ({ patient, type }) => {
  // Exception type styling
  const getStyle = () => {
    switch(type) {
      case "late":
        return { color: "#f97316", borderColor: "#f97316" }; // orange
      case "no-show":
        return { color: "#ef4444", borderColor: "#ef4444" }; // red
      case "cancelled":
        return { color: "#6b7280", borderColor: "#6b7280" }; // gray
      case "walk-out":
        return { color: "#f59e0b", borderColor: "#f59e0b" }; // amber
      default:
        return {};
    }
  };
  
  return (
    <Card className="mb-2 overflow-hidden" style={{ 
      borderColor: getStyle().borderColor,
      backgroundColor: `${getStyle().color}10`
    }}>
      <CardContent className="p-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-xs">{patient.lastName}, {patient.firstName.charAt(0)}</div>
            <div className="text-[10px] text-gray-500">{patient.appointmentType}</div>
          </div>
          {type === "late" && patient.timeInStatus && (
            <Badge variant="outline" className="text-[10px]" style={{ color: getStyle().color, borderColor: getStyle().color }}>
              +{patient.timeInStatus}m
            </Badge>
          )}
          {type === "walk-out" && patient.balance && patient.balance > 0 && (
            <Badge variant="outline" className="text-[10px]" style={{ color: getStyle().color, borderColor: getStyle().color }}>
              ${(patient.balance/100).toFixed(2)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Empty state for exceptions
interface EmptyExceptionProps {
  type: string;
}

const EmptyException: React.FC<EmptyExceptionProps> = ({ type }) => {
  const getMessage = () => {
    switch(type) {
      case "late": return "No late patients";
      case "no-show": return "No no-shows today";
      case "cancelled": return "No cancelled appointments";
      case "walk-out": return "No walk-outs today";
      default: return "No exceptions";
    }
  };
  
  return (
    <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
      {getMessage()}
    </div>
  );
};

// KPI chip component
interface KpiChipProps {
  label: string;
  value: number;
  target: number;
  icon: React.ReactNode;
}

const KpiChip: React.FC<KpiChipProps> = ({ label, value, target, icon }) => {
  // Color logic based on performance vs target
  const getColor = () => {
    const percentage = (value / target) * 100;
    
    if (percentage >= 100) return "#10b981"; // emerald-500 (green)
    if (percentage >= 90) return "#f59e0b"; // amber-500 (yellow)
    return "#ef4444"; // red-500 (red)
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center bg-white rounded-lg px-3 py-1.5 shadow-sm border">
            <div className="mr-1.5 text-gray-500">{icon}</div>
            <div>
              <div className="text-xs font-medium">{label}</div>
              <div className="flex items-center">
                <span className="text-sm font-semibold" style={{ color: getColor() }}>{value}</span>
                <span className="text-xs text-gray-400 ml-1">/ {target}</span>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Target: {target}</p>
          <p>Current: {value}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function MissionControlPage() {
  // Mock data for demonstration
  const patientFlowData = {
    "checked-in": [
      { id: 1, firstName: "John", lastName: "Smith", appointmentType: "Exam & Clean", operatory: "Op 1", provider: "Dr. Davis", timeInStatus: 120, hasAlert: true, status: "checked-in", dob: "1980-05-15", balance: 0 },
      { id: 2, firstName: "Emily", lastName: "Johnson", appointmentType: "Filling", operatory: "Op 2", provider: "Dr. Wilson", timeInStatus: 240, hasAlert: false, status: "checked-in", dob: "1975-10-20", balance: 12500 }
    ],
    "seated": [
      { id: 3, firstName: "Sarah", lastName: "Williams", appointmentType: "Root Canal", operatory: "Op 3", provider: "Dr. Brown", timeInStatus: 180, hasAlert: false, status: "seated", dob: "1990-03-25", balance: 0 }
    ],
    "pre-clinical": [
      { id: 4, firstName: "Robert", lastName: "Jones", appointmentType: "Crown Prep", operatory: "Op 4", provider: "Dr. Miller", timeInStatus: 150, hasAlert: false, status: "pre-clinical", dob: "1988-07-12", balance: 0 }
    ],
    "doctor-ready": [
      { id: 5, firstName: "Michael", lastName: "Brown", appointmentType: "Extraction", operatory: "Op 5", provider: "Dr. Davis", timeInStatus: 90, hasAlert: true, status: "doctor-ready", dob: "1970-11-30", balance: 20000 }
    ],
    "in-chair": [
      { id: 6, firstName: "Jennifer", lastName: "Davis", appointmentType: "Implant", operatory: "Op 6", provider: "Dr. Wilson", timeInStatus: 360, hasAlert: false, status: "in-chair", dob: "1982-09-05", balance: 0 }
    ],
    "wrap-up": [
      { id: 7, firstName: "David", lastName: "Miller", appointmentType: "Scaling", operatory: "Op 7", provider: "Dr. Brown", timeInStatus: 210, hasAlert: false, status: "wrap-up", dob: "1965-04-18", balance: 0 }
    ],
    "ready-checkout": [
      { id: 8, firstName: "Elizabeth", lastName: "Wilson", appointmentType: "Veneer", operatory: "Op 8", provider: "Dr. Miller", timeInStatus: 270, hasAlert: true, status: "ready-checkout", dob: "1992-01-25", balance: 35000 }
    ],
    "checked-out": []
  };
  
  // Mock exceptions data
  const exceptionData = [
    { id: 101, firstName: "Thomas", lastName: "White", appointmentType: "Check-up", timeInStatus: 15, type: "late" },
    { id: 102, firstName: "Jessica", lastName: "Moore", appointmentType: "Filling", timeInStatus: 0, type: "no-show" },
    { id: 103, firstName: "Richard", lastName: "Taylor", appointmentType: "Crown", timeInStatus: 0, type: "cancelled" },
    { id: 104, firstName: "Mary", lastName: "Anderson", appointmentType: "Root Canal", timeInStatus: 0, type: "walk-out", balance: 42500 }
  ];
  
  // Mock KPI data
  const kpiData = {
    waitToSeat: { value: 6, target: 5 },
    seatToDoctor: { value: 4, target: 8 },
    throughput: { value: 12, target: 16 },
    utilization: { value: 72, target: 85 }
  };
  
  return (
    <NavigationWrapper>
      <div className="flex flex-col h-full">
        {/* Header with KPIs */}
        <div className="bg-slate-800 text-white px-4 py-3 mb-4 flex items-center justify-between rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Mission Control</h1>
            <span className="text-gray-300">{format(new Date(), "EEEE, MMMM d")}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <KpiChip 
              label="Wait-to-Seat" 
              value={kpiData.waitToSeat.value} 
              target={kpiData.waitToSeat.target} 
              icon={<Clock className="h-4 w-4" />} 
            />
            <KpiChip 
              label="Seat-to-Doctor" 
              value={kpiData.seatToDoctor.value} 
              target={kpiData.seatToDoctor.target}
              icon={<HelpCircle className="h-4 w-4" />}
            />
            <KpiChip 
              label="Throughput" 
              value={kpiData.throughput.value} 
              target={kpiData.throughput.target}
              icon={<Calendar className="h-4 w-4" />}
            />
            <KpiChip 
              label="Utilization %" 
              value={kpiData.utilization.value} 
              target={kpiData.utilization.target}
              icon={<BarChart4 className="h-4 w-4" />}
            />
          </div>
        </div>
        
        {/* Main columns grid */}
        <div className="flex-1 overflow-x-auto min-h-0">
          <div className="flex h-full gap-2 pb-2">
            {/* Flow columns */}
            <StatusColumn column="checked-in" patients={patientFlowData["checked-in"]} />
            <StatusColumn column="seated" patients={patientFlowData["seated"]} />
            <StatusColumn column="pre-clinical" patients={patientFlowData["pre-clinical"]} />
            <StatusColumn column="doctor-ready" patients={patientFlowData["doctor-ready"]} />
            <StatusColumn column="in-chair" patients={patientFlowData["in-chair"]} />
            <StatusColumn column="wrap-up" patients={patientFlowData["wrap-up"]} />
            <StatusColumn column="ready-checkout" patients={patientFlowData["ready-checkout"]} />
            <StatusColumn column="checked-out" patients={patientFlowData["checked-out"]} />
            
            {/* Exception rail */}
            <ExceptionRail patients={exceptionData} />
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}