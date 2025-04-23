import React, { useState, useEffect, Fragment } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle,
  Clock, 
  CreditCard, 
  FileText, 
  MoreHorizontal, 
  Package, 
  Phone, 
  Sun, 
  UserMinus,
  User,
  MessageSquare,
  Stethoscope,
  Wallet,
  TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Mock data for the calendar heatmap
const operatories = ['Op 1', 'Op 2', 'Op 3', 'Op 4', 'Hyg 1', 'Hyg 2'];
const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

// Generate mock schedule data
const generateScheduleData = () => {
  const data = {};
  
  operatories.forEach(op => {
    data[op] = {};
    hours.forEach(hour => {
      // Random utilization between 0-100%
      data[op][hour] = Math.random();
      
      // Create some gaps
      if (Math.random() > 0.8) {
        data[op][hour] = 0;
      }
    });
  });
  
  return data;
};

const scheduleData = generateScheduleData();

// Calculate potential revenue from gaps
const calculatePotentialRevenue = (data) => {
  let gapCount = 0;
  
  Object.values(data).forEach(opData => {
    Object.values(opData).forEach(utilization => {
      if (utilization === 0) gapCount++;
    });
  });
  
  // Assume average revenue per appointment slot
  return gapCount * 400;
};

const gapPotential = calculatePotentialRevenue(scheduleData);

// Create countdown timer
function CountdownTimer({ seconds, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      if (onComplete) onComplete();
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);
  
  return (
    <div className="font-mono text-xl font-bold">
      {timeLeft}s
    </div>
  );
}

// Priority Tile Component
function PriorityTile({ icon: Icon, title, metric, cta, color }) {
  return (
    <Card className={cn("border-l-4", color)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-full", color.replace('border', 'bg'))}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{title}</h3>
              <p className="text-sm font-semibold mt-1">{metric}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-xs mt-1">
            {cta}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Schedule Heatmap Cell
function HeatmapCell({ utilization, operatory, time }) {
  // Color gradient based on utilization
  const getBackgroundColor = (util) => {
    if (util === 0) return 'bg-gray-100';
    if (util < 0.3) return 'bg-blue-100';
    if (util < 0.7) return 'bg-blue-300';
    return 'bg-blue-500';
  };
  
  // Determine if this is a gap that should be highlighted
  const isGap = utilization === 0;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "w-full h-10 border border-gray-200",
              getBackgroundColor(utilization),
              isGap && "border-amber-500 border-dashed"
            )}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-medium">{operatory} - {time}</p>
            {isGap ? (
              <p className="text-amber-600">Open slot - Potential revenue</p>
            ) : (
              <p>Utilization: {Math.round(utilization * 100)}%</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Agenda Steps for the huddle - focused on topics rather than roles
const agendaSteps = [
  { title: 'Celebrate Wins', focus: 'Yesterday\'s achievements, positive outcomes', icon: TrendingUp },
  { title: 'Schedule Status', focus: 'Confirmations, gaps, balances due', icon: Calendar },
  { title: 'Clinical Priorities', focus: 'Special cases, treatment notes, lab status', icon: Stethoscope },
  { title: 'Resource Needs', focus: 'Supplies, staffing, equipment readiness', icon: Package },
  { title: 'Action Items', focus: 'Tasks, follow-ups, communications', icon: CheckCircle }
];

export default function DailyHuddlePage() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const nextStep = () => {
    if (currentStep < agendaSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  return (
    <NavigationWrapper>
      <div className="space-y-4">
        {/* Header Bar with Yesterday's KPIs */}
        <div className="bg-primary text-white p-4 rounded-md">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <h2 className="font-medium">April 22, 2025</h2>
              <div className="ml-2 flex items-center gap-1">
                <Sun className="h-4 w-4 text-yellow-300" />
                <span className="text-sm">68°F</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div>
                <span className="text-xs block">Production</span>
                <span className="font-bold">$4,120</span>
                <span className="text-xs text-red-300 ml-1">(-18%)</span>
              </div>
              <div>
                <span className="text-xs block">Collection</span>
                <span className="font-bold">87%</span>
                <span className="text-xs text-amber-300 ml-1">(-3%)</span>
              </div>
              <div>
                <span className="text-xs block">Wait Time</span>
                <span className="font-bold">4.8 min</span>
                <span className="text-xs text-green-300 ml-1">(+12%)</span>
              </div>
              <div>
                <span className="text-xs block">NPS</span>
                <span className="font-bold">72</span>
                <span className="text-xs text-green-300 ml-1">(+5)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Schedule Heatmap */}
          <div className="lg:col-span-6 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Today's Schedule</h2>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Fill ${gapPotential} potential
              </Badge>
            </div>
            
            <div className="flex overflow-x-auto">
              <div className="sticky left-0 bg-white z-10 pr-2">
                <div className="h-10"></div> {/* Empty space for alignment */}
                {hours.map((hour, i) => (
                  <div key={i} className="h-10 flex items-center justify-end pr-2 text-sm font-medium">
                    {hour}
                  </div>
                ))}
              </div>
              
              <div className="grid" style={{ gridTemplateColumns: `repeat(${operatories.length}, minmax(80px, 1fr))` }}>
                {/* Header row with operatory names */}
                {operatories.map((op, i) => (
                  <div key={i} className="h-10 border-b border-gray-300 px-2 flex items-center justify-center font-medium text-sm">
                    {op}
                  </div>
                ))}
                
                {/* Time slots grid */}
                {hours.map((hour, rowIndex) => (
                  <div key={rowIndex} className="contents">
                    {operatories.map((op, colIndex) => (
                      <HeatmapCell 
                        key={`${rowIndex}-${colIndex}`}
                        utilization={scheduleData[op][hour]}
                        operatory={op}
                        time={hour}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Priority Tiles */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-lg font-bold">Today's Priorities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <PriorityTile 
                icon={Phone}
                title="Unconfirmed Patients"
                metric="5 unconfirmed / $2,400 prod"
                cta="Send SMS Blast"
                color="border-amber-500 bg-amber-100/30"
              />
              
              <PriorityTile 
                icon={CreditCard}
                title="High Balances Arriving"
                metric="3 patients owe $780"
                cta="Collect at check-in"
                color="border-blue-500 bg-blue-100/30"
              />
              
              <PriorityTile 
                icon={FileText}
                title="Lab Cases Due Today"
                metric="2 crowns not arrived"
                cta="Call Lab"
                color="border-red-500 bg-red-100/30"
              />
              
              <PriorityTile 
                icon={Package}
                title="Low Stock"
                metric="Fluoride Varnish below par"
                cta="Create PO"
                color="border-purple-500 bg-purple-100/30"
              />
              
              <PriorityTile 
                icon={UserMinus}
                title="Staff Out"
                metric="RDH Maria sick"
                cta="Shift hygiene gaps"
                color="border-red-500 bg-red-100/30"
              />
            </div>
          </div>
        </div>
        
        {/* Agenda Footer */}
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">Huddle Agenda</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Step {currentStep + 1} of {agendaSteps.length}</span>
              <CountdownTimer seconds={60} onComplete={nextStep} />
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {agendaSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div 
                  key={index}
                  className={cn(
                    "p-3 rounded-md text-center",
                    index === currentStep 
                      ? "bg-primary text-white ring-2 ring-primary ring-offset-2" 
                      : index < currentStep 
                        ? "bg-gray-300 text-gray-700" 
                        : "bg-white border border-gray-300"
                  )}
                >
                  <div className="flex justify-center mb-2">
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className={cn("text-xs mt-1", index === currentStep ? "text-white/80" : "text-gray-500")}>{step.focus}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}