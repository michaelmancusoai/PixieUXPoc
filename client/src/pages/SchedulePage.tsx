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
import { ViewMode, ViewModeType } from "@/shared/schema";
import CalendarView from "@/components/scheduling/CalendarView";
import { AppointmentChip } from "@/components/scheduling/AppointmentChip";
import { WaitlistManager } from "@/components/scheduling/WaitlistManager";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewModeType>("DAY");

  // Handlers for date navigation
  const goToNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const goToPrevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const goToToday = () => setSelectedDate(new Date());

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
              <CalendarView selectedDate={selectedDate} viewMode={viewMode} />
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