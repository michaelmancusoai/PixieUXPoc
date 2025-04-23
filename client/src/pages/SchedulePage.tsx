import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
  Clock, 
  UserCheck, 
  CreditCard, 
  AlertTriangle,
  Clock8,
  ClipboardCheck,
  CalendarDays,
  LayoutDashboard
} from "lucide-react";
import CalendarView from "@/components/scheduling/CalendarView";
import AppointmentChip from "@/components/scheduling/AppointmentChip";
import { WaitlistManager } from "@/components/scheduling/WaitlistManager";
import AvailableGapsPage from "./scheduling/AvailableGapsPage";
import WaitlistPage from "./scheduling/WaitlistPage";
import ReadyForCheckInPage from "./scheduling/ReadyForCheckInPage";
import ReadyForCheckoutPage from "./scheduling/ReadyForCheckoutPage";
import { Link, useLocation } from "wouter";

// Types for components
interface StatusCardProps {
  title: string;
  count: string;
  icon: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
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

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewModeType>("PROVIDER");
  const [activeAppointment, setActiveAppointment] = useState<AppointmentWithDetails | null>(null);
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("calendar");

  // Determine which tab content to show
  const getTabContent = () => {
    switch (activeTab) {
      case "gaps":
        return <AvailableGapsPage />;
      case "waitlist":
        return <WaitlistPage />;
      case "check-in":
        return <ReadyForCheckInPage />;
      case "checkout":
        return <ReadyForCheckoutPage />;
      default:
        return <CalendarContent />;
    }
  };

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

  // Fetch scheduling stats and metrics
  const { data: schedulingMetrics } = useQuery({
    queryKey: ['/api/schedule/utilization', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      // Fetch from API in a real implementation
      return { 
        checkIns: "12/18", 
        utilization: "78%", 
        unbilledProcedures: "4", 
        conflicts: "1" 
      };
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

  // Tab header for calendar view
  const CalendarTabHeader = () => (
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
      <div className="text-xl font-bold hidden md:block">
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
  );

  // The main calendar content component
  const CalendarContent = () => (
    <div className="grid grid-cols-12 gap-4">
      {/* Left Side - Available Gaps and Waitlist */}
      <div className="col-span-12 lg:col-span-3 space-y-4">
        {/* Link to Available Gaps */}
        <Card className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setActiveTab("gaps")}>
          <CardHeader className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock8 className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-base">Available Gaps</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
        </Card>
        
        {/* Link to Waitlist */}
        <Card className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setActiveTab("waitlist")}>
          <CardHeader className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-amber-600" />
                <CardTitle className="text-base">Waitlist</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
      
      {/* Middle - Calendar */}
      <div className="col-span-12 lg:col-span-6">
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CalendarTabHeader />
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
      
      {/* Right Side - Patient flow*/}
      <div className="col-span-12 lg:col-span-3 space-y-4">
        {/* Link to Ready for Check-In */}
        <Card className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setActiveTab("check-in")}>
          <CardHeader className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-base">Ready for Check-In</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
        </Card>
        
        {/* Link to Ready for Checkout */}
        <Card className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setActiveTab("checkout")}>
          <CardHeader className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-amber-600" />
                <CardTitle className="text-base">Ready for Checkout</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  return (
    <NavigationWrapper>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Scheduling</h1>
          {activeTab !== "calendar" && (
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("calendar")}
              className="gap-1"
            >
              <LayoutDashboard className="h-4 w-4 mr-1" />
              Return to Calendar
            </Button>
          )}
        </div>
        
        {activeTab === "calendar" && (
          <>
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatusCard 
                title="Check-Ins Today" 
                count={schedulingMetrics?.checkIns || "0/0"}
                icon={<UserCheck className="h-5 w-5 text-emerald-600" />} 
                variant="success"
              />
              <StatusCard 
                title="Chair Utilization" 
                count={schedulingMetrics?.utilization || "0%"}
                icon={<Clock className="h-5 w-5 text-blue-600" />} 
                variant="info" 
              />
              <StatusCard 
                title="Unbilled Procedures" 
                count={schedulingMetrics?.unbilledProcedures || "0"}
                icon={<CreditCard className="h-5 w-5 text-amber-600" />} 
                variant="warning" 
              />
              <StatusCard 
                title="Schedule Conflicts" 
                count={schedulingMetrics?.conflicts || "0"}
                icon={<AlertTriangle className="h-5 w-5 text-red-600" />} 
                variant="danger" 
              />
            </div>
          </>
        )}
        
        {/* Tab Content */}
        {getTabContent()}
      </div>
    </NavigationWrapper>
  );
}