import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Activity, 
  AlertCircle, 
  ArrowUpRight, 
  Bell, 
  Check, 
  ChevronDown,
  ChevronRight,
  ClipboardCheck, 
  Clock,
  CreditCard, 
  ExternalLink,
  FileCheck, 
  FileText, 
  LayoutDashboard,
  LayoutGrid,
  List,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  SmilePlus,
  Stethoscope, 
  Users,
  X,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  style?: React.CSSProperties;
}

// FlowColumn component
function FlowColumn({ column, patients, className, style }: FlowColumnProps) {
  const isOverWipLimit = patients.length > column.wipLimit;
  const Icon = column.icon;
  
  return (
    <div className={cn("min-w-[200px] w-full flex flex-col h-full", className)} style={style}>
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
            <Button variant="ghost" size="sm" className="h-5 text-xs px-2">
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

// Layout mode options
type LayoutMode = 'standard' | 'compact' | 'expanded';
type FlowViewMode = 'kanban' | 'list' | 'grid';

// Optimized Mission Control Page
export default function OptimizedMissionControlPage() {
  const [flowState, setFlowState] = useState<FlowState>(initialFlowDistribution);
  const [activeTab, setActiveTab] = useState('flow');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('standard');
  const [flowViewMode, setFlowViewMode] = useState<FlowViewMode>('kanban');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <NavigationWrapper>
      <div className="space-y-2">
        {/* Header with KPIs and Controls */}
        <div className="bg-white pb-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-2">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Mission Control</h1>
              <div className="flex ml-4 gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-8 ${layoutMode === 'compact' ? 'bg-muted' : ''}`}
                  onClick={() => setLayoutMode('compact')}
                  title="Compact view"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-8 ${layoutMode === 'standard' ? 'bg-muted' : ''}`}
                  onClick={() => setLayoutMode('standard')}
                  title="Standard view"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-8 ${layoutMode === 'expanded' ? 'bg-muted' : ''}`}
                  onClick={() => setLayoutMode('expanded')}
                  title="Expanded view"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-2 h-8" />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
                >
                  {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 items-center mt-2 lg:mt-0">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-1 px-2">
                <span className="font-normal mr-1">Today:</span> April 22, 2025
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 py-1 px-2">
                <span className="font-normal mr-1">Wait-to-Seat:</span> 4.2 min
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 py-1 px-2">
                <span className="font-normal mr-1">Seat-to-Doctor:</span> 7.5 min
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-1 px-2">
                <span className="font-normal mr-1">Throughput:</span> 14/24
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 py-1 px-2">
                <span className="font-normal mr-1">Utilization:</span> 87%
              </Badge>
            </div>
          </div>
          
          <Tabs 
            defaultValue="flow" 
            className="mt-4" 
            value={activeTab} 
            onValueChange={setActiveTab}
          >
            <div className="flex justify-between items-center border-b">
              <TabsList>
                <TabsTrigger value="flow" className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span>Patient Flow</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Insights</span>
                </TabsTrigger>
                <TabsTrigger value="exceptions" className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Exceptions</span>
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'flow' && (
                <div className="flex items-center gap-1 mr-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-8 px-2 ${flowViewMode === 'kanban' ? 'bg-muted' : ''}`}
                    onClick={() => setFlowViewMode('kanban')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-8 px-2 ${flowViewMode === 'list' ? 'bg-muted' : ''}`}
                    onClick={() => setFlowViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <TabsContent value="flow" className="m-0">
                <div className={`flex ${layoutMode === 'compact' ? 'gap-1' : 'gap-3'}`}>
                  {/* Main Flow Board */}
                  <div 
                    className={`flex overflow-x-auto pb-2 ${layoutMode === 'compact' ? 'gap-1' : 'gap-3'} flex-grow flex-1`} 
                    style={{ minHeight: layoutMode === 'compact' ? "calc(100vh - 260px)" : "calc(100vh - 300px)" }}
                  >
                    {flowColumns.map((column, index) => {
                      // Adjust flex proportions based on column index
                      let flexProportion = "1";
                      if (index === 0) {
                        // First column less width
                        flexProportion = "0.75";
                      } else if (index === flowColumns.length - 1 || index === flowColumns.length - 2) {
                        // Last two columns more width
                        flexProportion = "1.25";
                      }
                      
                      return (
                        <FlowColumn 
                          key={column.id} 
                          column={column} 
                          patients={flowState[column.id] || []} 
                          className={`flex-${flexProportion}`}
                          style={{ flex: flexProportion }}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Exception Rail - Collapsible */}
                  {!sidebarCollapsed && (
                    <div className={`${layoutMode === 'compact' ? 'w-80' : 'w-96'} ml-2 hidden lg:block`}>
                      <Accordion 
                        type="multiple" 
                        defaultValue={['exceptions']} 
                        className="bg-gray-50 rounded-md p-2 h-full"
                      >
                        <AccordionItem value="exceptions" className="border-b-0">
                          <AccordionTrigger className="py-2 px-1">
                            <div className="flex items-center text-sm font-semibold">
                              <AlertCircle className="h-4 w-4 mr-1 text-amber-600" />
                              <span>Exceptions ({exceptionData.late.length + exceptionData.noShow.length + exceptionData.cancelled.length + exceptionData.walkOut.length})</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-0 space-y-2">
                            <div>
                              <h3 className="text-xs font-semibold flex items-center text-amber-700 mb-1">
                                <Clock className="h-3 w-3 mr-1" />
                                Late ({exceptionData.late.length})
                              </h3>
                              <div className="space-y-1">
                                {exceptionData.late.map(patient => (
                                  <ExceptionCard key={patient.id} patient={patient} type="late" />
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-xs font-semibold flex items-center text-red-700 mb-1">
                                <X className="h-3 w-3 mr-1" />
                                No-Show ({exceptionData.noShow.length})
                              </h3>
                              <div className="space-y-1">
                                {exceptionData.noShow.map(patient => (
                                  <ExceptionCard key={patient.id} patient={patient} type="noShow" />
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-xs font-semibold flex items-center text-gray-700 mb-1">
                                <FileText className="h-3 w-3 mr-1" />
                                Cancelled ({exceptionData.cancelled.length})
                              </h3>
                              <div className="space-y-1">
                                {exceptionData.cancelled.map(patient => (
                                  <ExceptionCard key={patient.id} patient={patient} type="cancelled" />
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-xs font-semibold flex items-center text-amber-700 mb-1">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                Walk-Out ({exceptionData.walkOut.length})
                              </h3>
                              <div className="space-y-1">
                                {exceptionData.walkOut.map(patient => (
                                  <ExceptionCard key={patient.id} patient={patient} type="walkOut" />
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Patient Flow Analytics</CardTitle>
                      <CardDescription>Average time spent in each status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Check-in to Seated</span>
                            <span className="font-medium">4.2 min</span>
                          </div>
                          <Progress value={42} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Seated to Doctor</span>
                            <span className="font-medium">7.5 min</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Treatment Duration</span>
                            <span className="font-medium">32.1 min</span>
                          </div>
                          <Progress value={66} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Checkout Process</span>
                            <span className="font-medium">5.8 min</span>
                          </div>
                          <Progress value={58} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Operatory Utilization</CardTitle>
                      <CardDescription>Current status by room</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Op 1</span>
                          <Badge className="bg-purple-500">In Treatment</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Op 2</span>
                          <Badge className="bg-purple-500">In Treatment</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Op 3</span>
                          <Badge className="bg-violet-500">Doctor Ready</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Op 4</span>
                          <Badge className="bg-teal-500">Seated</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Op 5</span>
                          <Badge className="bg-green-600">Available</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Hyg 1</span>
                          <Badge className="bg-blue-500">Checked-In</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Provider Status</CardTitle>
                      <CardDescription>Current workload by provider</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Dr. Carter</span>
                            <span className="text-sm font-medium">3 patients</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Dr. Smith</span>
                            <span className="text-sm font-medium">2 patients</span>
                          </div>
                          <Progress value={50} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Lisa R. (Hygienist)</span>
                            <span className="text-sm font-medium">1 patient</span>
                          </div>
                          <Progress value={25} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="exceptions" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-amber-600" />
                        <span>Late Patients</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {exceptionData.late.map(patient => (
                          <ExceptionCard key={patient.id} patient={patient} type="late" />
                        ))}
                        {exceptionData.late.length === 0 && (
                          <div className="text-sm text-muted-foreground text-center py-4">No late patients</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        <X className="h-4 w-4 mr-2 text-red-600" />
                        <span>No-Shows</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {exceptionData.noShow.map(patient => (
                          <ExceptionCard key={patient.id} patient={patient} type="noShow" />
                        ))}
                        {exceptionData.noShow.length === 0 && (
                          <div className="text-sm text-muted-foreground text-center py-4">No missed appointments</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-600" />
                        <span>Cancelled Appointments</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {exceptionData.cancelled.map(patient => (
                          <ExceptionCard key={patient.id} patient={patient} type="cancelled" />
                        ))}
                        {exceptionData.cancelled.length === 0 && (
                          <div className="text-sm text-muted-foreground text-center py-4">No cancelled appointments</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 mr-2 text-amber-600" />
                        <span>Walk-Outs</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {exceptionData.walkOut.map(patient => (
                          <ExceptionCard key={patient.id} patient={patient} type="walkOut" />
                        ))}
                        {exceptionData.walkOut.length === 0 && (
                          <div className="text-sm text-muted-foreground text-center py-4">No walk-outs</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </NavigationWrapper>
  );
}