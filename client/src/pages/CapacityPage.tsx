import React, { useState, useEffect } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertTriangle, BarChart3, Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Clock, Info, LayoutGrid, Timer, Users, RefreshCcw, Activity, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, subDays, startOfWeek, endOfWeek, 
  eachDayOfInterval, addWeeks, isBefore, isAfter, isSameDay } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import JSConfetti from "js-confetti";

// Provider data
const providers = [
  { id: 1, name: "Dr. Nguyen", type: "dentist", color: "#C2E0FF", utilization: 0.65 },
  { id: 2, name: "Dr. Sisko", type: "dentist", color: "#FFD6D6", utilization: 0.89 },
  { id: 3, name: "Dr. Picard", type: "dentist", color: "#D6EEDA", utilization: 0.76 },
  { id: 4, name: "RDH Adams", type: "hygienist", color: "#E6E6FA", utilization: 0.78 },
  { id: 5, name: "RDH Bashir", type: "hygienist", color: "#FFE4B5", utilization: 0.72 },
];

// Operatories for the heatmap
const operatories = [
  { id: 1, name: "Op 1", color: "#C2E0FF" },
  { id: 2, name: "Op 2", color: "#FFD6D6" },
  { id: 3, name: "Op 3", color: "#D7CCC8" },
  { id: 4, name: "Op 4", color: "#D6EEDA" },
];

// Waitlist data for Gap Actions panel
const waitlistPatients = [
  { id: 1, name: "Eleanor Rodriguez", waitDays: 11, productionValue: 850, reasonCode: "Crown #14", requestDetails: "ASAP - experiencing sensitivity" },
  { id: 2, name: "Vernon Thompson", waitDays: 8, productionValue: 1200, reasonCode: "Bridge Prep", requestDetails: "Flexible availability" },
  { id: 3, name: "Kathryn Murphy", waitDays: 7, productionValue: 520, reasonCode: "Filling #19", requestDetails: "Prefers morning" },
  { id: 4, name: "Jerome Bell", waitDays: 5, productionValue: 320, reasonCode: "Prophy", requestDetails: "Any hygienist" },
  { id: 5, name: "Courtney Henry", waitDays: 4, productionValue: 750, reasonCode: "Root Canal", requestDetails: "Need to coordinate w/ endo" },
  { id: 6, name: "Bessie Cooper", waitDays: 3, productionValue: 420, reasonCode: "Filling #30", requestDetails: "After work hours only" },
  { id: 7, name: "Robert Fox", waitDays: 2.5, productionValue: 950, reasonCode: "Crown #3", requestDetails: "Can come anytime" },
  { id: 8, name: "Jacob Jones", waitDays: 2, productionValue: 380, reasonCode: "Prophy", requestDetails: "Prefers RDH Adams" },
];

// Online request data for Gap Actions panel
const onlineRequests = [
  { id: 101, name: "Cody Fisher", requestType: "New Patient", requestDate: "2025-04-23", preferredTimes: "Morning", productionValue: 320 },
  { id: 102, name: "Kristin Watson", requestType: "Cleaning", requestDate: "2025-04-24", preferredTimes: "Afternoon", productionValue: 180 },
  { id: 103, name: "Dianne Russell", requestType: "Emergency", requestDate: "2025-04-25", preferredTimes: "ASAP", productionValue: 450 },
  { id: 104, name: "Marvin McKinney", requestType: "Consult", requestDate: "2025-04-26", preferredTimes: "Late afternoon", productionValue: 280 },
];

// Unscheduled treatment plans
const unscheduledTreatments = [
  { id: 201, patientName: "Devon Lane", planDate: "2025-04-10", description: "Crown #12", productionValue: 1200, accepted: true },
  { id: 202, patientName: "Cameron Williamson", planDate: "2025-04-15", description: "Bridge #4-6", productionValue: 3400, accepted: true },
  { id: 203, patientName: "Brooklyn Simmons", planDate: "2025-04-18", description: "4 Fillings", productionValue: 960, accepted: true },
  { id: 204, patientName: "Wade Warren", planDate: "2025-04-20", description: "Crown #18", productionValue: 1250, accepted: true },
  { id: 205, patientName: "Esther Howard", planDate: "2025-04-21", description: "Veneer #8,9", productionValue: 2600, accepted: true },
];

// Recalls due data
const recallsDue = [
  { id: 301, patientName: "Jenny Wilson", dueDate: "2025-04-20", lastVisit: "2024-10-20", type: "6 Month", lastProvider: "RDH Adams" },
  { id: 302, patientName: "Darrell Steward", dueDate: "2025-04-22", lastVisit: "2024-10-22", type: "6 Month", lastProvider: "RDH Bashir" },
  { id: 303, patientName: "Ralph Edwards", dueDate: "2025-04-24", lastVisit: "2024-10-24", type: "6 Month", lastProvider: "RDH Adams" },
  { id: 304, patientName: "Ronald Richards", dueDate: "2025-04-25", lastVisit: "2024-10-25", type: "6 Month", lastProvider: "RDH Bashir" },
  { id: 305, patientName: "Darlene Robertson", dueDate: "2025-04-28", lastVisit: "2024-10-28", type: "6 Month", lastProvider: "RDH Adams" },
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
        
        // Adjust for time of day patterns
        // Morning and afternoon are busier
        if (hour >= 9 && hour <= 11) capacity = Math.min(capacity + 0.3, 1);
        if (hour >= 13 && hour <= 15) capacity = Math.min(capacity + 0.2, 1);
        
        // Lunch hour and early morning/late afternoon are usually less booked
        if (hour === 12) capacity = Math.max(capacity - 0.2, 0);
        if (hour < 8 || hour > 17) capacity = Math.max(capacity - 0.3, 0);
        
        // Ensure some consistent patterns for the demo
        // Tuesday morning is more open (seed to determine)
        if (format(day, "EEEE") === "Tuesday" && hour < 12 && (op.id % 2 === 0)) {
          capacity = Math.max(capacity - 0.5, 0);
        }
        
        // Wednesday afternoon has an imbalance
        if (format(day, "EEEE") === "Wednesday" && hour > 13 && op.id === 2) {
          capacity = 0; // Op 2 is always open on Wednesday afternoon
        }
        
        // Friday afternoon has several openings
        if (format(day, "EEEE") === "Friday" && hour >= 15) {
          capacity = Math.max(capacity - 0.4, 0);
        }
        
        // Add some slots that are completely free or completely booked
        if (capacity < 0.15) capacity = 0;
        if (capacity > 0.85) capacity = 1;
        
        return {
          operatoryId: op.id,
          capacity,
          provider: providers[Math.floor((seed * op.id) % providers.length)],
          minutesAvailable: Math.round((1 - capacity) * 60),
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 3, 29)); // April 29, 2025 - start of week in mockup
  const [viewMode, setViewMode] = useState<"week" | "fortnight">("week");
  const [selectedProviderType, setSelectedProviderType] = useState<string>("all");
  const [granularity, setGranularity] = useState<"15" | "30" | "60">("30");
  const [highValueThreshold] = useState(600); // Threshold for high-value treatments
  
  // State for interactive elements
  const [draggedPatient, setDraggedPatient] = useState<any>(null);
  const [targetCell, setTargetCell] = useState<string | null>(null);
  const [confettiInstance, setConfettiInstance] = useState<any>(null);
  const [hoveredKpi, setHoveredKpi] = useState<string | null>(null);
  
  // Generate heatmap data
  const heatmapData = generateHeatmapData(selectedDate);
  
  // Calculate capacity stats
  const calculateStatistics = () => {
    let totalMinutes = 0;
    let bookedMinutes = 0;
    let primeTimeMinutes = 0;
    let primeTimeBooked = 0;
    
    // Calculate provider utilization 
    const providerUtilization = providers.map(p => p.utilization);
    const avgUtilization = providerUtilization.reduce((sum, val) => sum + val, 0) / providerUtilization.length;
    const imbalance = Math.sqrt(
      providerUtilization.reduce((sum, val) => sum + Math.pow(val - avgUtilization, 2), 0) / providerUtilization.length
    );
    
    // Determine lowest and highest utilized providers
    const lowProvider = [...providers].sort((a, b) => a.utilization - b.utilization)[0];
    const highProvider = [...providers].sort((a, b) => b.utilization - a.utilization)[0];
    
    // Calculate time slot statistics
    heatmapData.forEach(day => {
      day.hours.forEach(hour => {
        // Each hour slot has 60 minutes multiplied by number of operatories
        const slotMinutes = 60 * operatories.length;
        totalMinutes += slotMinutes;
        
        // Calculate booked minutes for this slot
        const slotBookedMinutes = hour.operatories.reduce(
          (sum, op) => sum + (op.capacity * 60), 0
        );
        bookedMinutes += slotBookedMinutes;
        
        // Check if this is prime time (8am-12pm and 3pm-5pm)
        const isPrimeTime = (hour.hour >= 8 && hour.hour <= 11) || (hour.hour >= 15 && hour.hour <= 16);
        if (isPrimeTime) {
          primeTimeMinutes += slotMinutes;
          primeTimeBooked += slotBookedMinutes;
        }
      });
    });
    
    // Calculate open minutes for the next 2 weeks
    const open = totalMinutes - bookedMinutes;
    const utilization = Math.round((bookedMinutes / totalMinutes) * 100);
    const primeTimeUtilization = Math.round((primeTimeBooked / primeTimeMinutes) * 100);
    
    // Add unscheduled treatment value
    const unscheduledValue = unscheduledTreatments.reduce((sum, tx) => sum + tx.productionValue, 0);
    
    return {
      totalMinutes,
      bookedMinutes,
      openMinutes: open,
      utilization,
      primeTimeMinutes: primeTimeMinutes - primeTimeBooked,
      primeTimeUtilization,
      providerImbalance: Math.round(imbalance * 100),
      lowProvider,
      highProvider,
      unscheduledValue
    };
  };
  
  const stats = calculateStatistics();
  
  // Initialize confetti instance on component mount
  useEffect(() => {
    setConfettiInstance(new JSConfetti());
    return () => {
      // Clean up if needed
    };
  }, []);
  
  // Function to trigger confetti animation
  const triggerConfetti = () => {
    if (confettiInstance) {
      confettiInstance.addConfetti({
        emojis: ['✅'],
        confettiNumber: 30,
      });
    }
  };
  
  // Navigation handlers
  const goToPreviousWeek = () => {
    setSelectedDate(date => subDays(date, 7));
  };
  
  const goToNextWeek = () => {
    setSelectedDate(date => addDays(date, 7));
  };
  
  const goToToday = () => {
    setSelectedDate(new Date(2025, 3, 29)); // Reset to April 29, 2025 for demo
  };
  
  // Determine color coding for utilization based on goal
  const getUtilizationColorClass = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 70) return "text-amber-600";
    return "text-red-600";
  };
  
  // Get the capacity color based on the value (0-1)
  const getCapacityColor = (capacity: number) => {
    if (capacity === 0) return "bg-white border-dashed border-green-200";
    if (capacity <= 0.3) return "bg-green-50";
    if (capacity <= 0.7) return "bg-amber-50";
    return "bg-blue-100";
  };
  
  // Get capacity text/status
  const getCapacityText = (capacity: number) => {
    if (capacity === 0) return "Open";
    if (capacity <= 0.3) return "Low";
    if (capacity <= 0.7) return "Medium";
    return "High";
  };
  
  // Handle drag start for gap actions
  const handleDragStart = (patient: any) => {
    setDraggedPatient(patient);
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDraggedPatient(null);
    setTargetCell(null);
  };
  
  // Handle drag over 
  const handleDragOver = (key: string) => {
    if (draggedPatient) {
      setTargetCell(key);
    }
  };
  
  // Handle drop
  const handleDrop = (key: string) => {
    if (draggedPatient) {
      // In a real app, we would update the state to show the appointment
      // For demo, just trigger the confetti
      triggerConfetti();
      
      // Reset states
      setDraggedPatient(null);
      setTargetCell(null);
    }
  };
  
  return (
    <NavigationWrapper>
      <div className="space-y-4 p-4">
        {/* Page header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Capacity Planner</h1>
            <p className="text-sm text-muted-foreground">
              Turn blank chair-time into booked revenue
            </p>
          </div>
          
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
        
        {/* Date display */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">
              Week of {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "MMMM d")} - 
              {format(endOfWeek(selectedDate, { weekStartsOn: 1 }), "MMMM d, yyyy")}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Tabs defaultValue="week" onValueChange={(value) => setViewMode(value as "week" | "fortnight")}>
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="fortnight">Fortnight</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Hero KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Chair Utilization */}
          <Card className="shadow-sm border-t-4 border-t-blue-400 flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-blue-50/30">
              <div className="flex justify-between">
                <CardTitle className="text-base font-medium flex items-center">
                  <LayoutGrid className="h-4 w-4 mr-2 text-slate-600" />
                  Chair Utilisation
                </CardTitle>
                {stats.utilization >= 80 && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    On Target
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="py-5 px-5 flex-1 flex flex-col">
              <div>
                <div className="text-2xl font-bold flex items-center justify-between mb-1">
                  <span className={getUtilizationColorClass(stats.utilization)}>
                    {stats.utilization}% booked
                  </span>
                  <ChevronRight className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  Booked vs possible chair-time next 2 weeks
                </div>
                
                <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4">
                  <div 
                    className={`h-full ${stats.utilization >= 80 ? 'bg-green-500' : stats.utilization >= 70 ? 'bg-amber-500' : 'bg-red-500'} rounded-full transition-all duration-1000`} 
                    style={{ width: `${stats.utilization}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Goal: 80%</span>
                  <span>{stats.openMinutes / 60} hours available</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <Button 
                  variant="default"
                  size="sm"
                  className="w-full"
                >
                  View Free Slots
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Prime-Time Gaps */}
          <Card className="shadow-sm border-t-4 border-t-amber-400 flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-amber-50/30">
              <div className="flex justify-between">
                <CardTitle className="text-base font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-slate-600" />
                  Prime-Time Gaps
                </CardTitle>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                  4 slots left
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="py-5 px-5 flex-1 flex flex-col">
              <div>
                <div className="text-2xl font-bold flex items-center justify-between mb-1">
                  <span className="text-amber-600">
                    {stats.primeTimeMinutes} min open
                  </span>
                  <ChevronRight className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  Unused peak hours patients actually want
                </div>
                
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-xs">
                    <span>Morning (8a-12p)</span>
                    <span className="font-medium">{Math.round(stats.primeTimeMinutes * 0.6)} mins</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Afternoon (3p-5p)</span>
                    <span className="font-medium">{Math.round(stats.primeTimeMinutes * 0.4)} mins</span>
                  </div>
                </div>
                <div className="text-xs text-amber-700 mb-1">
                  Patient-preferred times are 2× more likely to convert
                </div>
              </div>
              
              <div className="mt-auto">
                <Button 
                  variant="default"
                  size="sm"
                  className="w-full"
                >
                  Fill With Waitlist
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Provider Imbalance */}
          <Card className="shadow-sm border-t-4 border-t-orange-400 flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-orange-50/30">
              <CardTitle className="text-base font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-slate-600" />
                Provider Imbalance
              </CardTitle>
            </CardHeader>
            <CardContent className="py-5 px-5 flex-1 flex flex-col">
              <div>
                <div className="flex items-end space-x-1 mb-1">
                  <div className="text-2xl font-bold text-orange-600">{stats.providerImbalance}%</div>
                  <div className="text-sm text-muted-foreground mb-1">variance</div>
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  <span className="text-green-600 font-medium">{stats.lowProvider.name}</span> light · 
                  <span className="text-red-600 font-medium ml-1">{stats.highProvider.name}</span> heavy
                </div>
                
                <div className="space-y-2 mb-3">
                  {providers.map(provider => (
                    <div key={provider.id} className="flex items-center space-x-2">
                      <div className="w-20 text-xs truncate">{provider.name}</div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div 
                          className={`h-full rounded-full ${
                            provider.utilization >= 0.85 ? "bg-red-500" : 
                            provider.utilization >= 0.75 ? "bg-amber-500" : 
                            "bg-green-500"
                          }`}
                          style={{ width: `${provider.utilization * 100}%` }}
                        />
                      </div>
                      <div className="text-xs w-8 text-right">{Math.round(provider.utilization * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto">
                <Button 
                  variant="default"
                  size="sm"
                  className="w-full"
                >
                  Rebalance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Unbooked High-Value Treatment Plans */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center">
              <Banknote className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                ${stats.unscheduledValue.toLocaleString()} waiting
              </span>
              <span className="text-xs text-blue-600 ml-2">
                in accepted treatment plans without appointments
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-blue-700 flex items-center mt-1 md:mt-0">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>Every week delay ≈ $900 unrecovered</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    Patients who delay treatment often end up cancelling or seeking care elsewhere
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" size="sm" className="bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800 ml-auto mt-2 md:mt-0 h-7">
              Schedule Plans
            </Button>
          </div>
        </div>
        
        {/* Main content grid - Heatmap and Gap Actions */}
        <div className="grid grid-cols-12 gap-4">
          {/* Heat Map - 9 columns */}
          <div className="col-span-12 lg:col-span-9">
            <Card className="overflow-x-auto h-full">
              <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
                <div className="flex space-x-2 items-center">
                  <div className="text-sm font-medium">Granularity:</div>
                  <Tabs value={granularity} onValueChange={(val: any) => setGranularity(val)} className="h-7">
                    <TabsList className="h-7">
                      <TabsTrigger value="15" className="px-2 h-5 text-xs">15 min</TabsTrigger>
                      <TabsTrigger value="30" className="px-2 h-5 text-xs">30 min</TabsTrigger>
                      <TabsTrigger value="60" className="px-2 h-5 text-xs">60 min</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Tabs defaultValue="all" onValueChange={(val) => setSelectedProviderType(val)} className="h-7">
                    <TabsList className="h-7">
                      <TabsTrigger value="all" className="h-5 px-3 text-xs">All</TabsTrigger>
                      <TabsTrigger value="dentists" className="h-5 px-3 text-xs">Dentists</TabsTrigger>
                      <TabsTrigger value="hygienists" className="h-5 px-3 text-xs">Hygienists</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              
              <CardContent className="p-2">
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
                          
                          // Cell key for drag and drop
                          const cellKey = `${day.date.toISOString()}-${hour}`;
                          const isTargeted = targetCell === cellKey;
                          
                          return (
                            <div 
                              key={cellKey} 
                              className={`relative border rounded-md p-2 transition-all duration-200 ${
                                isTargeted ? 'border-green-500 shadow-lg ring-2 ring-green-200' : 'border-gray-200'
                              }`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                handleDragOver(cellKey);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                handleDrop(cellKey);
                              }}
                            >
                              <div 
                                className={`absolute inset-0 ${getCapacityColor(avgCapacity)} rounded-md opacity-90`}
                              />
                              <div className="relative z-10 flex flex-col h-full">
                                <div className="text-xs font-medium">{getCapacityText(avgCapacity)}</div>
                                <div className="flex-1 flex items-end justify-end">
                                  <Badge variant="outline" className="text-xs bg-white/70">
                                    {hourData.operatories.reduce((sum, op) => sum + op.minutesAvailable, 0)} min
                                  </Badge>
                                </div>
                                
                                {avgCapacity === 0 && !isTargeted && (
                                  <div className="absolute inset-0 flex items-center justify-center text-xs text-green-600 font-medium opacity-50">
                                    Drag patient here
                                  </div>
                                )}
                                
                                {/* Show operatory breakdown on hover */}
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="absolute inset-0 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="w-64">
                                      <div className="text-xs p-1">
                                        <div className="font-medium mb-2">
                                          {format(day.date, "EEEE, MMMM d")} at {hour === 12 ? "12 PM" : (hour < 12 ? `${hour} AM` : `${hour - 12} PM`)}
                                        </div>
                                        <div className="space-y-1">
                                          {hourData.operatories.map(op => {
                                            const operatory = operatories.find(o => o.id === op.operatoryId);
                                            return (
                                              <div key={op.operatoryId} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                  <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: operatory?.color || '#ccc' }} />
                                                  <span>{operatory?.name}: </span>
                                                </div>
                                                <div className="flex items-center">
                                                  <span className={`
                                                    ${op.capacity === 0 ? "text-green-600" : 
                                                      op.capacity <= 0.3 ? "text-green-500" : 
                                                      op.capacity <= 0.7 ? "text-amber-500" : 
                                                      "text-blue-700"
                                                    } font-medium
                                                  `}>
                                                    {op.minutesAvailable} min {op.capacity === 0 ? "free" : "available"}
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                        {avgCapacity === 0 && (
                                          <Button size="sm" className="w-full mt-2 h-7">Add Appointment</Button>
                                        )}
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
          </div>
          
          {/* Gap Actions Panel - 3 columns */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-sm font-medium">Gap Actions</CardTitle>
              </CardHeader>
              
              <Tabs defaultValue="waitlist" className="h-full">
                <div className="px-4">
                  <TabsList className="w-full grid grid-cols-4 h-8">
                    <TabsTrigger value="waitlist" className="text-xs">Waitlist</TabsTrigger>
                    <TabsTrigger value="online" className="text-xs">Online</TabsTrigger>
                    <TabsTrigger value="treatment" className="text-xs">Tx Plans</TabsTrigger>
                    <TabsTrigger value="recalls" className="text-xs">Recalls</TabsTrigger>
                  </TabsList>
                </div>
                
                <ScrollArea className="h-[calc(100vh-380px)]">
                  <TabsContent value="waitlist" className="m-0 p-0">
                    <div className="p-4 space-y-2">
                      {waitlistPatients.map((patient) => (
                        <div 
                          key={patient.id}
                          className="border rounded-md p-2 bg-white cursor-grab hover:shadow-md transition-shadow"
                          draggable
                          onDragStart={() => handleDragStart(patient)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="flex justify-between">
                            <div className="font-medium text-sm">{patient.name}</div>
                            <Badge variant="outline" className={`text-xs ${patient.productionValue > highValueThreshold ? 'bg-green-50 text-green-700 border-green-200' : ''}`}>
                              ${patient.productionValue}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">{patient.reasonCode}</div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-amber-600 font-medium flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Waiting {patient.waitDays} days
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="online" className="m-0 p-0">
                    <div className="p-4 space-y-2">
                      {onlineRequests.map((request) => (
                        <div 
                          key={request.id}
                          className="border rounded-md p-2 bg-white cursor-grab hover:shadow-md transition-shadow"
                          draggable
                          onDragStart={() => handleDragStart(request)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="flex justify-between">
                            <div className="font-medium text-sm">{request.name}</div>
                            <Badge variant="outline" className="text-xs">
                              ${request.productionValue}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">{request.requestType}</div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-blue-600 font-medium">
                              Prefers: {request.preferredTimes}
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="treatment" className="m-0 p-0">
                    <div className="p-4 space-y-2">
                      {unscheduledTreatments.map((tx) => (
                        <div 
                          key={tx.id}
                          className="border rounded-md p-2 bg-white cursor-grab hover:shadow-md transition-shadow"
                          draggable
                          onDragStart={() => handleDragStart(tx)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="flex justify-between">
                            <div className="font-medium text-sm">{tx.patientName}</div>
                            <Badge variant="outline" className={`text-xs ${tx.productionValue > highValueThreshold ? 'bg-green-50 text-green-700 border-green-200' : ''}`}>
                              ${tx.productionValue}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">{tx.description}</div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-green-600 font-medium flex items-center">
                              <Activity className="h-3 w-3 mr-1" />
                              Plan accepted {format(new Date(tx.planDate), "MMM d")}
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recalls" className="m-0 p-0">
                    <div className="p-4 space-y-2">
                      {recallsDue.map((recall) => (
                        <div 
                          key={recall.id}
                          className="border rounded-md p-2 bg-white cursor-grab hover:shadow-md transition-shadow"
                          draggable
                          onDragStart={() => handleDragStart(recall)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="flex justify-between">
                            <div className="font-medium text-sm">{recall.patientName}</div>
                            <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
                              {recall.type}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">Due: {format(new Date(recall.dueDate), "MMM d, yyyy")}</div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-slate-600 font-medium flex items-center">
                              <RefreshCcw className="h-3 w-3 mr-1" />
                              Last provider: {recall.lastProvider}
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                              Call
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </Card>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="text-xs text-muted-foreground mt-4 border-t pt-4">
          <div className="font-medium mb-1">Drag-and-drop Usage:</div>
          <ol className="list-decimal list-inside space-y-1 pl-2">
            <li>Drag a patient card from any tab in the Gap Actions panel</li>
            <li>Drop onto any open (white) or low (green) capacity cell in the heatmap</li>
            <li>The cell will highlight when you hover over it with a dragged card</li>
            <li>Release to schedule the patient in that time slot</li>
          </ol>
          <div className="mt-2 text-sm italic">
            <span className="text-amber-600 font-medium">Pro tip:</span> Hover any KPI card or heatmap cell for more detailed information
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
};

export default CapacityPage;