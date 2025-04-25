import React, { useState } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, setHours, setMinutes } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Operatories for the heatmap
const operatories = [
  { id: 1, name: "Op 1", color: "#C2E0FF" },
  { id: 2, name: "Op 2", color: "#FFD6D6" },
  { id: 3, name: "Op 3", color: "#D7CCC8" },
  { id: 4, name: "Op 4", color: "#D6EEDA" },
];

// Mock data for the heatmap
const generateHeatmapData = (date: Date) => {
  // Generate capacity data for the whole week
  const startDate = startOfWeek(date, { weekStartsOn: 1 });
  const endDate = endOfWeek(date, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Generate data for each day of the week
  const weekData = weekDays.map(day => {
    // Start with 7am (7) and end with 7pm (19)
    const hours = Array.from({ length: 13 }, (_, i) => 7 + i);
    
    // For each hour, generate capacity data for each operatory
    const dayData = hours.map(hour => {
      // Generate capacity for each operatory at this hour
      const operatoriesData = operatories.map(op => {
        // Generate random capacity between 0 and 1
        // 0 = empty, 0.5 = half booked, 1 = fully booked
        // Use deterministic calculation based on day, hour, and operatory
        const seed = day.getDate() + hour + op.id;
        let capacity = ((seed * 13) % 10) / 10;
        
        // Add some slots that are completely free or completely booked
        if (capacity < 0.2) capacity = 0;
        if (capacity > 0.8) capacity = 1;
        
        return {
          operatoryId: op.id,
          capacity,
        };
      });
      
      return {
        hour,
        operatories: operatoriesData,
      };
    });
    
    return {
      date: day,
      hours: dayData,
    };
  });
  
  return weekData;
};

const CapacityPage: React.FC = () => {
  // State for selected date and view mode
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 3, 23)); // April 23, 2025
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>(["all"]);
  const [selectedServices, setSelectedServices] = useState<string[]>(["all"]);
  
  // Generate heatmap data
  const heatmapData = generateHeatmapData(selectedDate);
  
  // Navigation handlers
  const goToPreviousWeek = () => {
    setSelectedDate(date => subDays(date, 7));
  };
  
  const goToNextWeek = () => {
    setSelectedDate(date => addDays(date, 7));
  };
  
  const goToToday = () => {
    setSelectedDate(new Date(2025, 3, 23)); // Reset to April 23, 2025 for demo
  };
  
  // Get the capacity color based on the value (0-1)
  const getCapacityColor = (capacity: number) => {
    if (capacity === 0) return "bg-green-100";
    if (capacity <= 0.3) return "bg-green-300";
    if (capacity <= 0.7) return "bg-amber-300";
    return "bg-red-300";
  };
  
  // Get capacity text
  const getCapacityText = (capacity: number) => {
    if (capacity === 0) return "Open";
    if (capacity <= 0.3) return "Low";
    if (capacity <= 0.7) return "Medium";
    return "High";
  };
  
  // Calculate statistics
  const calculateStatistics = () => {
    let totalSlots = 0;
    let openSlots = 0;
    let lowCapacitySlots = 0;
    let mediumCapacitySlots = 0;
    let highCapacitySlots = 0;
    
    heatmapData.forEach(day => {
      day.hours.forEach(hour => {
        hour.operatories.forEach(op => {
          totalSlots++;
          if (op.capacity === 0) openSlots++;
          else if (op.capacity <= 0.3) lowCapacitySlots++;
          else if (op.capacity <= 0.7) mediumCapacitySlots++;
          else highCapacitySlots++;
        });
      });
    });
    
    return {
      totalSlots,
      openSlots,
      lowCapacitySlots,
      mediumCapacitySlots,
      highCapacitySlots,
      openPercentage: Math.round((openSlots / totalSlots) * 100),
      utilization: Math.round(((totalSlots - openSlots) / totalSlots) * 100)
    };
  };
  
  const stats = calculateStatistics();
  
  return (
    <NavigationWrapper>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Scheduling Capacity</h1>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">
              {viewMode === "week" ? (
                <>
                  Week of {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "MMMM d")} - 
                  {format(endOfWeek(selectedDate, { weekStartsOn: 1 }), "MMMM d, yyyy")}
                </>
              ) : (
                <>Month of {format(selectedDate, "MMMM yyyy")}</>
              )}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Tabs defaultValue="week" onValueChange={(value) => setViewMode(value as "week" | "month")}>
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Statistics cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.utilization}%</div>
              <div className="text-xs text-muted-foreground">
                {stats.openSlots} open slots available
              </div>
              
              <div className="mt-2 h-2 w-full bg-gray-100 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${stats.utilization}%` }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.openSlots}</div>
              <div className="text-xs text-muted-foreground">
                {stats.openPercentage}% of total capacity
              </div>
              <div className="mt-2 flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-green-100 mr-1" />
                <span>Available slots</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Prime Time Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">87%</div>
              <div className="text-xs text-muted-foreground">
                10am-2pm time slots
              </div>
              
              <div className="mt-2 h-2 w-full bg-gray-100 rounded-full">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `87%` }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Most Available Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-sm font-medium">Monday 8:00-9:00</div>
                <div className="text-sm font-medium">Wednesday 3:00-4:00</div>
                <div className="text-sm font-medium">Friday 4:00-5:00</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex space-x-2 my-4">
          <Select value={selectedDoctors[0]} onValueChange={(value) => setSelectedDoctors([value])}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              <SelectItem value="dr-1">Dr. Floyd Miles</SelectItem>
              <SelectItem value="dr-2">Dr. Annette Black</SelectItem>
              <SelectItem value="dr-3">Dr. Ronald Richards</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedServices[0]} onValueChange={(value) => setSelectedServices([value])}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="exam">Exam & Cleaning</SelectItem>
              <SelectItem value="restorative">Restorative</SelectItem>
              <SelectItem value="surgery">Surgery</SelectItem>
              <SelectItem value="prosth">Prosthodontics</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-1 mb-2">
          <div className="text-sm font-medium text-muted-foreground">Capacity Legend:</div>
          <div className="flex items-center space-x-2 ml-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-100 mr-1" />
              <span className="text-xs">Open</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-300 mr-1" />
              <span className="text-xs">Low</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-300 mr-1" />
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-300 mr-1" />
              <span className="text-xs">High</span>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Open: Fully available, Low: &lt;30% booked, Medium: 30-70% booked, High: &gt;70% booked
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Heat Map */}
        <Card className="overflow-x-auto">
          <CardContent className="p-4">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-1">
                {/* Time labels column */}
                <div className="pt-8">
                  {/* Header spacer */}
                </div>
                
                {/* Day headers */}
                {heatmapData.slice(0, 5).map((day) => (
                  <div key={day.date.toISOString()} className="text-center p-2 font-medium">
                    <div>{format(day.date, "EEEE")}</div>
                    <div className="text-sm text-muted-foreground">{format(day.date, "MMM d")}</div>
                  </div>
                ))}
                
                {/* Time slots and heat map cells */}
                {Array.from({ length: 13 }, (_, i) => 7 + i).map(hour => (
                  <React.Fragment key={hour}>
                    {/* Time label */}
                    <div className="text-right pr-2 py-1 text-sm text-muted-foreground">
                      {hour === 12 ? "12 PM" : (hour < 12 ? `${hour} AM` : `${hour - 12} PM`)}
                    </div>
                    
                    {/* Heat map cells for each day */}
                    {heatmapData.slice(0, 5).map(day => {
                      const hourData = day.hours.find(h => h.hour === hour);
                      if (!hourData) return null;
                      
                      // Calculate the average capacity across all operatories for this time slot
                      const totalCapacity = hourData.operatories.reduce((sum, op) => sum + op.capacity, 0);
                      const avgCapacity = totalCapacity / hourData.operatories.length;
                      
                      return (
                        <div key={`${day.date.toISOString()}-${hour}`} className="relative border rounded-md p-2">
                          <div 
                            className={`absolute inset-0 ${getCapacityColor(avgCapacity)} rounded-md opacity-80`}
                          />
                          <div className="relative z-10 flex flex-col h-full">
                            <div className="text-xs font-medium">{getCapacityText(avgCapacity)}</div>
                            <div className="flex-1 flex items-end justify-end">
                              <Badge variant="outline" className="text-xs bg-white/70">
                                {Math.round((1 - avgCapacity) * 4)} slots
                              </Badge>
                            </div>
                            
                            {/* Show operatory breakdown on hover */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="absolute inset-0 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-xs p-1">
                                    <div className="font-medium mb-1">
                                      {format(day.date, "MMM d")} at {hour === 12 ? "12 PM" : (hour < 12 ? `${hour} AM` : `${hour - 12} PM`)}
                                    </div>
                                    {hourData.operatories.map(op => {
                                      const operatory = operatories.find(o => o.id === op.operatoryId);
                                      return (
                                        <div key={op.operatoryId} className="flex items-center justify-between">
                                          <span>{operatory?.name}: </span>
                                          <span className={`
                                            ${op.capacity === 0 ? "text-green-600" : 
                                              op.capacity <= 0.3 ? "text-green-500" : 
                                              op.capacity <= 0.7 ? "text-amber-500" : 
                                              "text-red-500"
                                            } font-medium
                                          `}>
                                            {getCapacityText(op.capacity)}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="pt-4">
          <h3 className="text-lg font-medium mb-2">Capacity Optimizer Suggestions</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fill Tuesday Morning</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  6 open slots on Tuesday morning. Send recall reminders to 15 patients due for cleaning.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Send Targeted Recalls
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Balance Wednesday</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  Move 2 hygiene appointments from 10-11 AM to open slots at 3-4 PM to optimize flow.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  View Suggested Moves
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Friday Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  8 patients on ASAP list could fill Friday afternoon slots. Send targeted notifications.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Contact ASAP Patients
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
};

export default CapacityPage;