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
  Pause,
  Phone, 
  Play,
  PlayCircle,
  RefreshCw,
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

// Mock data for each agenda item
const agendaItemData = {
  'Celebrate Wins': {
    metrics: [
      { label: 'Yesterday Production', value: '$4,120', target: '$5,000', status: 'below' },
      { label: 'Completed Treatments', value: '14', target: '16', status: 'below' },
      { label: 'Patient Satisfaction', value: '96%', target: '90%', status: 'above' },
    ],
    highlights: [
      { text: 'Dr. Smith completed 3 complex treatments ahead of schedule', type: 'positive' },
      { text: 'Wait times reduced by 12% compared to last week', type: 'positive' },
      { text: 'Two new patient referrals from existing patients', type: 'positive' },
    ]
  },
  'Schedule Status': {
    metrics: [
      { label: 'Unconfirmed Appointments', value: '5', target: '0', status: 'below' },
      { label: 'Schedule Utilization', value: '87%', target: '90%', status: 'below' },
      { label: 'Revenue at Risk', value: '$2,400', target: '$0', status: 'below' },
    ],
    highlights: [
      { text: '5 patients unconfirmed for today (Johnson, Miller, Davis, Smith, Wilson)', type: 'warning' },
      { text: '3 gaps of 30+ minutes in today\'s schedule', type: 'warning' },
      { text: 'Last-minute cancellation from Roberts family (4 patients)', type: 'negative' },
    ]
  },
  'Clinical Priorities': {
    metrics: [
      { label: 'Lab Cases Due', value: '2', target: '2', status: 'neutral' },
      { label: 'Treatment Plans Pending', value: '7', target: '5', status: 'below' },
      { label: 'Follow-up Required', value: '3', target: '0', status: 'below' },
    ],
    highlights: [
      { text: 'Crown for William Peters not arrived from lab (due today)', type: 'negative' },
      { text: 'Lisa Johnson needs pre-medication verification before procedure', type: 'warning' },
      { text: 'Robert Garcia has history of vasovagal response - prepare accordingly', type: 'warning' },
    ]
  },
  'Resource Needs': {
    metrics: [
      { label: 'Staff Attendance', value: '92%', target: '100%', status: 'below' },
      { label: 'Supplies Below Par', value: '2', target: '0', status: 'below' },
      { label: 'Equipment Maintenance', value: '1', target: '0', status: 'below' },
    ],
    highlights: [
      { text: 'Hygienist Maria called in sick - rescheduling required', type: 'negative' },
      { text: 'Fluoride varnish supply low - reorder required today', type: 'warning' },
      { text: 'Operatory 3 light needs maintenance - scheduled for Thursday', type: 'warning' },
    ]
  },
  'Action Items': {
    metrics: [
      { label: 'Critical Tasks', value: '3', target: '0', status: 'below' },
      { label: 'Follow-ups Required', value: '5', target: '0', status: 'below' },
      { label: 'Team Assignments', value: '8', target: '8', status: 'neutral' },
    ],
    highlights: [
      { text: 'Call lab about Peters crown - Amanda', type: 'action' },
      { text: 'Contact 5 unconfirmed patients ASAP - Front desk', type: 'action' },
      { text: 'Order fluoride varnish - Dr. Carter', type: 'action' },
      { text: 'Reschedule Maria\'s patients - Front desk', type: 'action' },
      { text: 'Schedule Op 3 light maintenance - Office manager', type: 'action' },
    ]
  }
};

export default function DailyHuddlePage() {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [huddleActive, setHuddleActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  
  // Start the huddle
  const startHuddle = () => {
    setCurrentStep(0);
    setHuddleActive(true);
    resetTimer();
  };
  
  // Select a specific agenda item
  const selectStep = (index: number) => {
    setCurrentStep(index);
    resetTimer();
  };
  
  // Reset timer
  const resetTimer = () => {
    setTimeLeft(60);
    setTimerActive(true);
  };
  
  // Pause/resume timer
  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };
  
  // Timer effect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive]);
  
  // Get current agenda item data
  const getCurrentItemData = () => {
    if (currentStep === null) return null;
    
    const stepKey = agendaSteps[currentStep].title;
    return agendaItemData[stepKey];
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'above': return 'text-green-600';
      case 'below': return 'text-red-600';
      case 'neutral': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };
  
  // Get highlight color
  const getHighlightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-50 border-green-300 text-green-800';
      case 'warning': return 'bg-amber-50 border-amber-300 text-amber-800';
      case 'negative': return 'bg-red-50 border-red-300 text-red-800';
      case 'action': return 'bg-blue-50 border-blue-300 text-blue-800';
      default: return 'bg-gray-50 border-gray-300 text-gray-800';
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
        
        {/* Agenda Section */}
        <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
          {/* Huddle Header with Start Button */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Daily Huddle</h2>
              {!huddleActive ? (
                <Button onClick={startHuddle} className="bg-primary hover:bg-primary/90">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Huddle
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xl font-bold">{timeLeft}s</div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleTimer}
                    className="h-8 w-8"
                  >
                    {timerActive ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={resetTimer}
                    className="h-8 w-8"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Agenda Tabs */}
          <div className="grid grid-cols-5 border-b border-gray-200">
            {agendaSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              
              return (
                <button
                  key={index}
                  disabled={!huddleActive}
                  onClick={() => selectStep(index)}
                  className={cn(
                    "p-4 text-center border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center transition-colors",
                    isActive 
                      ? "bg-primary text-white" 
                      : huddleActive 
                        ? "hover:bg-gray-50 bg-white text-gray-700"
                        : "bg-gray-100 text-gray-400"
                  )}
                >
                  <StepIcon className={cn("h-5 w-5 mb-2", isActive ? "text-white" : "text-gray-500")} />
                  <span className="font-medium text-sm">{step.title}</span>
                </button>
              );
            })}
          </div>
          
          {/* Agenda Content */}
          {huddleActive && currentStep !== null && (
            <div className="p-4 bg-white">
              <div className="space-y-4">
                {/* Current Agenda Item Title */}
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{agendaSteps[currentStep].title}</h3>
                  <p className="text-sm text-gray-500">{agendaSteps[currentStep].focus}</p>
                </div>
                
                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-4">
                  {getCurrentItemData()?.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-500">{metric.label}</p>
                      <div className="flex items-end gap-2 mt-1">
                        <span className="text-xl font-bold">{metric.value}</span>
                        <span className={cn("text-sm", getStatusColor(metric.status))}>
                          (Target: {metric.target})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Highlights/Issues */}
                <div>
                  <h4 className="font-medium mb-2">Key Points:</h4>
                  <div className="space-y-2">
                    {getCurrentItemData()?.highlights.map((highlight, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "p-3 rounded-md border text-sm",
                          getHighlightColor(highlight.type)
                        )}
                      >
                        {highlight.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {(!huddleActive || currentStep === null) && (
            <div className="p-8 text-center bg-white">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Daily Huddle Not Started</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start the huddle to view agenda items and coordinate with your team for a successful day.
              </p>
            </div>
          )}
        </div>
      </div>
    </NavigationWrapper>
  );
}