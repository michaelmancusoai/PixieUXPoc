import React, { useState, useEffect } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AlertCircle,
  Calendar, 
  CheckCircle,
  Clock, 
  CreditCard, 
  FileText,
  Package, 
  Pause,
  Phone, 
  Play,
  PlayCircle,
  Plus,
  RefreshCw,
  Sun,
  Trash2, 
  UserMinus,
  MessageSquare,
  Stethoscope,
  TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Mock data for the calendar heatmap
const operatories = ['Op 1', 'Op 2', 'Op 3', 'Op 4', 'Hyg 1', 'Hyg 2'];
const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

// Generate mock schedule data
const generateScheduleData = () => {
  const data: Record<string, Record<string, number>> = {};
  
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
const calculatePotentialRevenue = (data: Record<string, Record<string, number>>) => {
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

// Priority Tile Component
interface PriorityTileProps {
  icon: React.ElementType;
  title: string;
  metric: string;
  cta: string;
  color: string;
}

function PriorityTile({ icon: Icon, title, metric, cta, color }: PriorityTileProps) {
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
interface HeatmapCellProps {
  utilization: number;
  operatory: string;
  time: string;
}

function HeatmapCell({ utilization, operatory, time }: HeatmapCellProps) {
  // Color gradient based on utilization
  const getBackgroundColor = (util: number) => {
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

interface Metric {
  label: string;
  value: string;
  target: string;
  status: string;
}

interface Highlight {
  text: string;
  type: string;
}

interface AgendaItemData {
  metrics: Metric[];
  highlights: Highlight[];
}

// Mock data for each agenda item
const agendaItemData: Record<string, AgendaItemData> = {
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
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [huddleActive, setHuddleActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [customItems, setCustomItems] = useState<Record<string, string[]>>({
    'Celebrate Wins': [],
    'Schedule Status': [],
    'Clinical Priorities': [],
    'Resource Needs': [],
    'Action Items': []
  });
  const [newItemText, setNewItemText] = useState('');
  
  // Start the huddle
  const startHuddle = () => {
    setCurrentStep(0);
    setHuddleActive(true);
    resetTimer();
  };
  
  // Select a specific agenda item - works in both preview and huddle mode
  const selectStep = (index: number) => {
    setCurrentStep(index);
    
    // Only reset the timer if we're in active huddle mode
    if (huddleActive) {
      resetTimer();
    }
  };
  
  // Add custom item to a section
  const addCustomItem = (sectionTitle: string) => {
    if (newItemText.trim() === '') return;
    
    setCustomItems(prev => ({
      ...prev,
      [sectionTitle]: [...(prev[sectionTitle] || []), newItemText.trim()]
    }));
    
    setNewItemText('');
  };
  
  // Remove custom item from a section
  const removeCustomItem = (sectionTitle: string, index: number) => {
    setCustomItems(prev => ({
      ...prev,
      [sectionTitle]: prev[sectionTitle].filter((_, i) => i !== index)
    }));
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
              const hasCustomItems = customItems[step.title] && customItems[step.title].length > 0;
              
              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 text-center border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center transition-colors cursor-pointer",
                    isActive 
                      ? "bg-primary text-white" 
                      : "hover:bg-gray-50 bg-white text-gray-700"
                  )}
                  onClick={() => selectStep(index)}
                >
                  <div className="relative">
                    <StepIcon className={cn("h-5 w-5 mb-2", isActive ? "text-white" : "text-gray-500")} />
                    {hasCustomItems && (
                      <Badge 
                        className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-blue-500 text-white text-[10px]"
                      >
                        {customItems[step.title].length}
                      </Badge>
                    )}
                  </div>
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
              );
            })}
          </div>
          
          {/* Agenda Content */}
          <div className="p-4 bg-white">
            <div className="space-y-4">
              {/* Current Selection Indicator - only shown during active huddle */}
              {huddleActive && (
                <div className="bg-primary/10 p-3 rounded-md border border-primary/20">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-primary">Currently Discussing: {agendaSteps[currentStep].title}</h3>
                    <p className="text-sm text-gray-500">{agendaSteps[currentStep].focus}</p>
                  </div>
                </div>
              )}
              
              {/* Huddle Preview Message - only shown before starting */}
              {!huddleActive && (
                <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200 flex items-center gap-4">
                  <PlayCircle className="h-8 w-8 text-primary/60" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Daily Huddle Preview</h3>
                    <p className="text-sm text-gray-500">
                      Click the tabs above to view and prepare each section. Add custom items to discuss and then start the huddle.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Content for the current selected tab */}
              <div className="space-y-4">
                {/* Tab Content */}
                <div>
                  {(() => {
                    const step = agendaSteps[currentStep];
                    const stepData = agendaItemData[step.title];
                    const hasCustomItems = customItems[step.title] && customItems[step.title].length > 0;
                    
                    return (
                      <>
                        {/* Metrics Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                          {stepData.metrics.map((metric, idx) => (
                            <div 
                              key={idx} 
                              className="bg-gray-50 p-3 rounded-md border border-gray-200"
                            >
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
                        
                        {/* System Highlights/Issues */}
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">System Generated Items:</h4>
                            <Badge variant="outline" className="bg-gray-100 text-gray-700">
                              {stepData.highlights.length} items
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {stepData.highlights.map((highlight, idx) => (
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
                        
                        {/* Custom Items Section */}
                        <div className="mt-8 border-t pt-6">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">Custom Items:</h4>
                            {hasCustomItems && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {customItems[step.title].length} custom {customItems[step.title].length === 1 ? 'item' : 'items'}
                              </Badge>
                            )}
                          </div>
                          
                          {/* Add Item Form */}
                          <div className="flex items-center mb-4 gap-2">
                            <input
                              type="text"
                              placeholder="Add custom item to discuss..."
                              value={newItemText}
                              onChange={(e) => setNewItemText(e.target.value)}
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-3 py-2"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  addCustomItem(step.title);
                                }
                              }}
                            />
                            <Button 
                              onClick={() => addCustomItem(step.title)}
                              variant="outline"
                              className="border-primary text-primary hover:bg-primary/5"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Item
                            </Button>
                          </div>
                          
                          {/* List of Custom Items */}
                          <div className="space-y-2">
                            {customItems[step.title]?.length ? (
                              customItems[step.title].map((item, idx) => (
                                <div 
                                  key={idx} 
                                  className="p-3 rounded-md border border-blue-200 bg-blue-50 text-blue-800 text-sm flex items-center justify-between"
                                >
                                  <span>{item}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-blue-700 hover:text-blue-900 hover:bg-blue-100/50"
                                    onClick={() => removeCustomItem(step.title, idx)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 italic">No custom items added yet. Add items above to discuss during the huddle.</p>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}