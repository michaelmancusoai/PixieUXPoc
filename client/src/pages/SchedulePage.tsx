import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ViewModeType, AppointmentWithDetails } from "@shared/schema";
import { 
  DndContext, 
  DragOverlay, 
  MouseSensor, 
  TouchSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragCancelEvent
} from "@dnd-kit/core";
import { useQuery } from "@tanstack/react-query";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Calendar, 
  UserCheck, 
  CreditCard, 
  AlertTriangle,
  Clock8,
  ListChecks,
  ArrowRightCircle,
  AlertCircle
} from "lucide-react";
import CalendarView from "@/components/scheduling/CalendarView";
import AppointmentChip from "@/components/scheduling/AppointmentChip";
import { WaitlistManager } from "@/components/scheduling/WaitlistManager";

// Types for components
interface StatusCardProps {
  title: string;
  count: string;
  icon: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

interface PatientStatusItemProps {
  patient: {
    id: number;
    name: string;
    time: string;
    procedure: string;
    action: string;
  };
}

interface AvailableGapProps {
  gap: {
    id: number;
    time: string;
    duration: number;
    operatory: string;
  };
}

// Status Card Component
const StatusCard = ({ title, count, icon, variant = "default" }: StatusCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "danger":
        return "bg-red-50 border-red-200 text-red-700";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };
  
  return (
    <div className={`border rounded-lg p-3 ${getVariantStyles()}`}>
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-full">
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-2xl font-bold mt-1">{count}</div>
        </div>
      </div>
    </div>
  );
};

// Patient Status Component
const PatientStatusItem = ({ patient }: PatientStatusItemProps) => (
  <div className="flex items-center justify-between border-b last:border-0 py-2.5">
    <div>
      <div className="font-medium">{patient.name}</div>
      <div className="text-sm text-gray-500 mt-0.5">{patient.time} • {patient.procedure}</div>
    </div>
    <Button size="sm" variant="outline" className="h-8">
      <ArrowRightCircle className="h-3.5 w-3.5 mr-1.5" />
      {patient.action}
    </Button>
  </div>
);

// Available Gap Component
const AvailableGap = ({ gap }: AvailableGapProps) => (
  <div className="flex items-center justify-between border-b last:border-0 py-2.5">
    <div>
      <div className="font-medium">{gap.time}</div>
      <div className="text-sm text-gray-500 mt-0.5">{gap.duration} min • {gap.operatory}</div>
    </div>
    <Button size="sm" variant="outline" className="h-8">
      Book
    </Button>
  </div>
);

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewModeType>("PROVIDER");
  const [activeAppointment, setActiveAppointment] = useState<AppointmentWithDetails | null>(null);

  // Set up dnd-kit sensors
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 10px of movement before drag starts
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // 250ms delay before drag starts
      tolerance: 5, // 5px of movement before drag starts
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  // Fetch arrived patients waiting to be seated
  const { data: readyForCheckIn = [] } = useQuery({
    queryKey: ['/api/schedule/arrived-patients'],
    queryFn: async () => {
      // Placeholder response data
      return [
        { id: 1, name: "John Smith", time: "9:30 AM", procedure: "Exam & Cleaning", action: "Check In" },
        { id: 2, name: "Sarah Williams", time: "10:00 AM", procedure: "Crown Delivery", action: "Check In" },
        { id: 3, name: "Michael Lee", time: "10:30 AM", procedure: "Filling", action: "Check In" }
      ];
    }
  });
  
  // Fetch patients ready for checkout
  const { data: readyForCheckout = [] } = useQuery({
    queryKey: ['/api/schedule/pending-checkout'],
    queryFn: async () => {
      // Placeholder response data
      return [
        { id: 1, name: "Emily Johnson", time: "10:15 AM", procedure: "Root Canal", action: "Checkout" },
        { id: 2, name: "David Miller", time: "11:00 AM", procedure: "Extraction", action: "Checkout" }
      ];
    }
  });
  
  // Fetch available gaps
  const { data: availableGaps = [] } = useQuery({
    queryKey: ['/api/schedule/gaps', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      // Placeholder response data
      return [
        { id: 1, time: "11:30 AM - 12:00 PM", duration: 30, operatory: "Op 2" },
        { id: 2, time: "1:15 PM - 2:00 PM", duration: 45, operatory: "Op 1" },
        { id: 3, time: "3:30 PM - 4:30 PM", duration: 60, operatory: "Op 3" }
      ];
    }
  });

  // Handlers for date navigation
  const goToNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const goToPrevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const goToToday = () => setSelectedDate(new Date());

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveAppointment(active.data?.current?.appointment || null);
  };

  const handleDragEnd = (_event: DragEndEvent) => {
    setActiveAppointment(null);
  };

  const handleDragCancel = (_event: DragCancelEvent) => {
    setActiveAppointment(null);
  };

  return (
    <NavigationWrapper>
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">Scheduling</h1>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatusCard 
            title="Check-Ins Today" 
            count="12/18" 
            icon={<UserCheck className="h-5 w-5 text-emerald-600" />} 
            variant="success"
          />
          <StatusCard 
            title="Chair Utilization" 
            count="78%" 
            icon={<Clock className="h-5 w-5 text-blue-600" />} 
            variant="info" 
          />
          <StatusCard 
            title="Unbilled Procedures" 
            count="4" 
            icon={<CreditCard className="h-5 w-5 text-amber-600" />} 
            variant="warning" 
          />
          <StatusCard 
            title="Schedule Conflicts" 
            count="1" 
            icon={<AlertTriangle className="h-5 w-5 text-red-600" />} 
            variant="danger" 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Side - Calendar */}
          <div className="lg:col-span-3">
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToPrevDay}>
                      &larr;
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNextDay}>
                      &rarr;
                    </Button>
                  </div>
                  <div className="text-xl font-bold">
                    {format(selectedDate, "MMMM d, yyyy")}
                  </div>
                  <div>
                    <Tabs 
                      defaultValue="PROVIDER" 
                      value={viewMode} 
                      onValueChange={(v) => setViewMode(v as ViewModeType)}
                      className="w-[200px]"
                    >
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="PROVIDER">Provider</TabsTrigger>
                        <TabsTrigger value="OPERATORY">Operatory</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DndContext 
                  sensors={sensors}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
                >
                  <CalendarView selectedDate={selectedDate} viewMode={viewMode} />
                  <DragOverlay>
                    {activeAppointment ? (
                      <div className="opacity-80">
                        <AppointmentChip 
                          appointment={activeAppointment} 
                          style={{ width: '200px', height: '80px' }} 
                        />
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Side - Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Waitlist */}
            <WaitlistManager />
            
            {/* Available Gaps */}
            <Card>
              <CardHeader className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock8 className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-base">Available Gaps</CardTitle>
                  </div>
                  <Badge variant="outline">{availableGaps.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 py-3">
                {availableGaps.length === 0 ? (
                  <div className="text-center text-gray-500 py-3">
                    <p>No available gaps</p>
                  </div>
                ) : (
                  availableGaps.map(gap => (
                    <AvailableGap key={gap.id} gap={gap} />
                  ))
                )}
              </CardContent>
            </Card>
            
            {/* Patients Ready for Check-In */}
            <Card>
              <CardHeader className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-emerald-600" />
                    <CardTitle className="text-base">Ready for Check-In</CardTitle>
                  </div>
                  <Badge variant="outline">{readyForCheckIn.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 py-3">
                {readyForCheckIn.length === 0 ? (
                  <div className="text-center text-gray-500 py-3">
                    <p>No patients waiting</p>
                  </div>
                ) : (
                  readyForCheckIn.map(patient => (
                    <PatientStatusItem key={patient.id} patient={patient} />
                  ))
                )}
              </CardContent>
            </Card>
            
            {/* Patients Ready for Checkout */}
            <Card>
              <CardHeader className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-amber-600" />
                    <CardTitle className="text-base">Ready for Checkout</CardTitle>
                  </div>
                  <Badge variant="outline">{readyForCheckout.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 py-3">
                {readyForCheckout.length === 0 ? (
                  <div className="text-center text-gray-500 py-3">
                    <p>No patients waiting</p>
                  </div>
                ) : (
                  readyForCheckout.map(patient => (
                    <PatientStatusItem key={patient.id} patient={patient} />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}