import { useState, useEffect } from "react";
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
import CalendarView from "@/components/scheduling/CalendarView";
import AppointmentChip from "@/components/scheduling/AppointmentChip";
import { WaitlistManager } from "@/components/scheduling/WaitlistManager";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewModeType>("DAY");
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
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-4">Scheduling</h1>
      
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
                    defaultValue="DAY" 
                    value={viewMode} 
                    onValueChange={(v) => setViewMode(v as ViewModeType)}
                    className="w-[260px]"
                  >
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="DAY">Day</TabsTrigger>
                      <TabsTrigger value="WEEK">Week</TabsTrigger>
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
        
        {/* Right Side - Waitlist */}
        <div className="lg:col-span-1">
          <WaitlistManager />
        </div>
      </div>
    </div>
  );
}