import React, { useState } from "react";
import { format } from "date-fns";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertCircle,
  BarChart3,
  BellRing,
  DollarSign,
  FileText,
  Package,
  Plus,
  ThumbsUp,
  Timer,
  Trash2,
  UserX,
  Users,
  MessageSquare,
  ArrowRight,
  ArrowRightCircle,
  Sun
} from "lucide-react";

// KPI component with color-coded threshold ticks
interface KpiCardProps {
  title: string;
  value: number;
  target: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, target, prefix = '', suffix = '', icon }) => {
  // Calculate progress and color thresholds
  const progress = Math.min(Math.round((value / target) * 100), 100);
  
  return (
    <Card className="relative overflow-hidden shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="text-2xl font-bold mt-1">
              {prefix}{value.toLocaleString()}{suffix}
            </div>
          </div>
          <div className="text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="relative pt-4">
          {/* Custom progress bar with threshold ticks */}
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full" 
              style={{ 
                width: `${progress}%`,
                background: progress < 80 ? '#ef4444' : progress < 95 ? '#f59e0b' : '#10b981'
              }}
            ></div>
            
            {/* Threshold ticks */}
            <div className="absolute top-0 left-0 w-full h-2 flex items-center">
              <div className="absolute h-3 w-0.5 bg-white" style={{ left: '80%', top: '-2px' }}></div>
              <div className="absolute h-3 w-0.5 bg-white" style={{ left: '95%', top: '-2px' }}></div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <div>0{suffix}</div>
            <div>Target: {prefix}{target.toLocaleString()}{suffix}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Priority tile component
interface PriorityTileProps {
  title: string;
  count: number;
  value: string;
  icon: React.ReactNode;
  actionText: string;
  colorScheme: string;
  onClick?: () => void;
}

const PriorityTile: React.FC<PriorityTileProps> = ({ title, count, value, icon, actionText, colorScheme, onClick }) => {
  const colors = {
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  };
  
  const color = colors[colorScheme as keyof typeof colors] || colors.blue;
  
  return (
    <Card className={`relative overflow-hidden ${color.bg} ${color.border} border shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className={`${color.text} font-medium text-sm`}>{title}</div>
            <div className="text-lg font-bold mt-1 flex items-baseline">
              {count > 0 ? (
                <React.Fragment>
                  <span>{count}</span>
                  {value && <span className="text-sm ml-1 opacity-70">{value}</span>}
                </React.Fragment>
              ) : (
                <span className="text-sm opacity-70">None today</span>
              )}
            </div>
          </div>
          <div className={`${color.text} opacity-80`}>
            {icon}
          </div>
        </div>
        
        {count > 0 && actionText && (
          <Button 
            variant="outline" 
            size="sm" 
            className={`mt-3 w-full ${color.text} border-current hover:bg-white/50 hover:text-current`}
            onClick={onClick}
          >
            {actionText}
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Schedule data types
interface ScheduleDataCell {
  hour: string;
  operatoryId: number;
  utilization: number;
  hasGap?: boolean;
  patientName?: string | null;
  procedure?: string;
}

interface ScheduleOperatory {
  id: number;
  name: string;
}

interface ScheduleData {
  utilization: number;
  potentialRevenue: number;
  operatories: ScheduleOperatory[];
  cells: ScheduleDataCell[];
}

// Schedule heatmap component
interface ScheduleHeatmapProps {
  schedule: ScheduleData;
}

const ScheduleHeatmap: React.FC<ScheduleHeatmapProps> = ({ schedule }) => {
  // Helper to calculate utilization color
  const getUtilizationColor = (percent: number) => {
    if (percent >= 90) return "bg-emerald-500";
    if (percent >= 70) return "bg-emerald-400";
    if (percent >= 50) return "bg-emerald-300";
    if (percent >= 30) return "bg-amber-300";
    return "bg-gray-200";
  };
  
  const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
  
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Today's Schedule</CardTitle>
        <CardDescription>
          Utilization: {schedule.utilization}% booked
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto_1fr] gap-2">
          {/* Time labels */}
          <div className="space-y-2 pr-2 pt-7">
            {hours.map(hour => (
              <div key={hour} className="h-10 flex items-center justify-end text-xs text-gray-500">
                {hour}
              </div>
            ))}
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-5 gap-1">
            {/* Column headers */}
            {schedule.operatories.map(op => (
              <div key={op.id} className="h-7 flex items-center justify-center text-xs font-medium border-b pb-1">
                {op.name}
              </div>
            ))}
            
            {/* Cells */}
            {hours.map(hour => (
              schedule.operatories.map(op => {
                const cellData = schedule.cells.find(
                  cell => cell.hour === hour && cell.operatoryId === op.id
                ) || { utilization: 0, hasGap: false, patientName: null };
                
                return (
                  <div 
                    key={`${hour}-${op.id}`} 
                    className={`h-10 rounded ${getUtilizationColor(cellData.utilization)} 
                              ${cellData.hasGap ? 'border-2 border-dashed border-amber-500' : ''} 
                              relative group`}
                  >
                    {cellData.patientName && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{cellData.patientName}</p>
                            <p className="text-xs text-gray-500">{cellData.procedure}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                );
              })
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Potential Revenue in Gaps</span>
          <span className="text-lg font-bold text-amber-600">${schedule.potentialRevenue.toLocaleString()}</span>
        </div>
        <Button variant="outline" size="sm">
          Fill Gaps <ArrowRightCircle className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Discussion item type
interface DiscussionItemType {
  id: number;
  title: string;
  description?: string;
  color: string; 
  section: string;
  type: 'system' | 'custom';
}

// Discussion topic component
interface DiscussionItemProps {
  item: DiscussionItemType;
  onDelete?: (id: number) => void;
}

const DiscussionItem: React.FC<DiscussionItemProps> = ({ item, onDelete }) => {
  const colors: Record<string, string> = {
    red: 'border-red-200 bg-red-50 text-red-700',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    purple: 'border-purple-200 bg-purple-50 text-purple-700',
    gray: 'border-gray-200 bg-gray-50 text-gray-700'
  };
  
  return (
    <div className={`rounded-lg p-2.5 mb-2 border ${colors[item.color] || colors.gray} flex items-start justify-between`}>
      <div>
        <p className="font-medium">{item.title}</p>
        {item.description && (
          <p className="text-sm mt-0.5 opacity-90">{item.description}</p>
        )}
      </div>
      {onDelete && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full -mt-1 -mr-1 opacity-50 hover:opacity-100"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

// Add Discussion Dialog
interface AddDiscussionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (item: Omit<DiscussionItemType, 'id'>) => void;
  section: string;
}

const AddDiscussionDialog: React.FC<AddDiscussionDialogProps> = ({ open, setOpen, onAdd, section }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('blue');
  
  const handleSubmit = () => {
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        color,
        section,
        type: 'custom'
      });
      setTitle('');
      setDescription('');
      setOpen(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Add Discussion Item
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter topic title" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Enter additional details" 
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex space-x-2">
              {['blue', 'green', 'amber', 'red', 'purple', 'gray'].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-6 h-6 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-black' : ''
                  }`}
                  style={{ backgroundColor: getColorForSwatch(c) }}
                  onClick={() => setColor(c)}
                  aria-label={`Select ${c} color`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper to get color for color swatches
function getColorForSwatch(color: string): string {
  const colors: Record<string, string> = {
    blue: '#2563eb',
    green: '#10b981',
    amber: '#d97706',
    red: '#ef4444',
    purple: '#8b5cf6',
    gray: '#6b7280'
  };
  return colors[color] || colors.blue;
}

export default function DailyHuddlePage() {
  // State for yesterday's performance KPIs
  const [kpis] = useState({
    production: { value: 4120, target: 5000 },
    collection: { value: 87, target: 95 },
    waitTime: { value: 7, target: 5 },
    nps: { value: 74, target: 70 }
  });
  
  // State for today's priorities
  const [priorities] = useState({
    unconfirmed: { count: 5, value: '$2,400', colorScheme: 'amber', icon: <BellRing className="h-5 w-5" />, actionText: 'Send SMS Blast' },
    balances: { count: 3, value: '$780', colorScheme: 'red', icon: <DollarSign className="h-5 w-5" />, actionText: 'View Patients' },
    labCases: { count: 2, value: 'crowns', colorScheme: 'blue', icon: <Package className="h-5 w-5" />, actionText: 'Call Lab' },
    supplies: { count: 1, value: 'fluoride', colorScheme: 'green', icon: <AlertCircle className="h-5 w-5" />, actionText: 'Create PO' },
    staffOut: { count: 1, value: 'hygienist', colorScheme: 'purple', icon: <UserX className="h-5 w-5" />, actionText: 'Adjust Schedule' }
  });
  
  // State for schedule heatmap
  const [schedule] = useState<ScheduleData>({
    utilization: 78,
    potentialRevenue: 3200,
    operatories: [
      { id: 1, name: 'Room 1' },
      { id: 2, name: 'Room 2' },
      { id: 3, name: 'Room 3' },
      { id: 4, name: 'Room 4' },
      { id: 5, name: 'Room 5' }
    ],
    cells: [
      { hour: '9 AM', operatoryId: 1, utilization: 100, patientName: 'Smith, J', procedure: 'Exam & X-Rays' },
      { hour: '9 AM', operatoryId: 2, utilization: 100, patientName: 'Johnson, M', procedure: 'Filling' },
      { hour: '9 AM', operatoryId: 3, utilization: 0, hasGap: true },
      { hour: '9 AM', operatoryId: 4, utilization: 100, patientName: 'Williams, D', procedure: 'Crown' },
      { hour: '9 AM', operatoryId: 5, utilization: 0 },
      
      { hour: '10 AM', operatoryId: 1, utilization: 100, patientName: 'Davis, S', procedure: 'Root Canal' },
      { hour: '10 AM', operatoryId: 2, utilization: 100, patientName: 'Miller, R', procedure: 'Extraction' },
      { hour: '10 AM', operatoryId: 3, utilization: 50, patientName: 'Wilson, J', procedure: 'Filling' },
      { hour: '10 AM', operatoryId: 4, utilization: 100, patientName: 'Moore, P', procedure: 'Implant' },
      { hour: '10 AM', operatoryId: 5, utilization: 0 },
      
      { hour: '11 AM', operatoryId: 1, utilization: 100, patientName: 'Taylor, K', procedure: 'Scaling' },
      { hour: '11 AM', operatoryId: 2, utilization: 0, hasGap: true },
      { hour: '11 AM', operatoryId: 3, utilization: 100, patientName: 'Anderson, L', procedure: 'Filling' },
      { hour: '11 AM', operatoryId: 4, utilization: 100, patientName: 'Thomas, R', procedure: 'Crown' },
      { hour: '11 AM', operatoryId: 5, utilization: 100, patientName: 'Jackson, M', procedure: 'Cleaning' },
      
      { hour: '12 PM', operatoryId: 1, utilization: 0 },
      { hour: '12 PM', operatoryId: 2, utilization: 0 },
      { hour: '12 PM', operatoryId: 3, utilization: 0 },
      { hour: '12 PM', operatoryId: 4, utilization: 0 },
      { hour: '12 PM', operatoryId: 5, utilization: 0 },
      
      { hour: '1 PM', operatoryId: 1, utilization: 100, patientName: 'White, C', procedure: 'Crown' },
      { hour: '1 PM', operatoryId: 2, utilization: 100, patientName: 'Harris, E', procedure: 'Filling' },
      { hour: '1 PM', operatoryId: 3, utilization: 100, patientName: 'Martin, J', procedure: 'Bridges' },
      { hour: '1 PM', operatoryId: 4, utilization: 100, patientName: 'Thompson, S', procedure: 'Veneer' },
      { hour: '1 PM', operatoryId: 5, utilization: 0, hasGap: true },
      
      { hour: '2 PM', operatoryId: 1, utilization: 75, patientName: 'Garcia, J', procedure: 'Check-up' },
      { hour: '2 PM', operatoryId: 2, utilization: 100, patientName: 'Martinez, M', procedure: 'Root Canal' },
      { hour: '2 PM', operatoryId: 3, utilization: 100, patientName: 'Robinson, T', procedure: 'Implant' },
      { hour: '2 PM', operatoryId: 4, utilization: 0, hasGap: true },
      { hour: '2 PM', operatoryId: 5, utilization: 100, patientName: 'Clark, D', procedure: 'Filling' },
      
      { hour: '3 PM', operatoryId: 1, utilization: 100, patientName: 'Rodriguez, L', procedure: 'Crown' },
      { hour: '3 PM', operatoryId: 2, utilization: 100, patientName: 'Lewis, R', procedure: 'Extraction' },
      { hour: '3 PM', operatoryId: 3, utilization: 0 },
      { hour: '3 PM', operatoryId: 4, utilization: 100, patientName: 'Lee, K', procedure: 'Filling' },
      { hour: '3 PM', operatoryId: 5, utilization: 100, patientName: 'Walker, J', procedure: 'Root Canal' },
      
      { hour: '4 PM', operatoryId: 1, utilization: 0, hasGap: true },
      { hour: '4 PM', operatoryId: 2, utilization: 0 },
      { hour: '4 PM', operatoryId: 3, utilization: 100, patientName: 'Hall, S', procedure: 'Cleaning' },
      { hour: '4 PM', operatoryId: 4, utilization: 100, patientName: 'Allen, P', procedure: 'Crown' },
      { hour: '4 PM', operatoryId: 5, utilization: 0 },
      
      { hour: '5 PM', operatoryId: 1, utilization: 0 },
      { hour: '5 PM', operatoryId: 2, utilization: 0 },
      { hour: '5 PM', operatoryId: 3, utilization: 0 },
      { hour: '5 PM', operatoryId: 4, utilization: 0 },
      { hour: '5 PM', operatoryId: 5, utilization: 0 }
    ]
  });
  
  // Discussion items state for each tab
  const [ownerItems, setOwnerItems] = useState<DiscussionItemType[]>([
    { id: 1, title: 'Weekly production exceeded target by 5%', description: 'Great work team!', color: 'green', section: 'owner', type: 'system' },
    { id: 2, title: 'Hygiene department had 100% recare success rate', color: 'green', section: 'owner', type: 'system' }
  ]);
  
  const [frontItems, setFrontItems] = useState<DiscussionItemType[]>([
    { id: 3, title: '5 unconfirmed appointments for today', description: 'Need to call ASAP', color: 'amber', section: 'front', type: 'system' },
    { id: 4, title: '3 patients arriving with outstanding balances', color: 'red', section: 'front', type: 'system' }
  ]);
  
  const [hygieneItems, setHygieneItems] = useState<DiscussionItemType[]>([
    { id: 5, title: '2 recall gaps can be filled today', color: 'blue', section: 'hygiene', type: 'system' },
    { id: 6, title: 'New hygiene forms arrived', description: 'Located in cabinet 3', color: 'gray', section: 'hygiene', type: 'custom' }
  ]);
  
  const [doctorItems, setDoctorItems] = useState<DiscussionItemType[]>([
    { id: 7, title: '2 lab cases due but not received', color: 'amber', section: 'doctor', type: 'system' },
    { id: 8, title: 'Dr. Wilson celebrating work anniversary today', color: 'purple', section: 'doctor', type: 'custom' }
  ]);
  
  const [billingItems, setBillingItems] = useState<DiscussionItemType[]>([
    { id: 9, title: '3 claims denied yesterday', description: 'Need to resubmit with correct codes', color: 'red', section: 'billing', type: 'system' },
    { id: 10, title: 'New EOB processing training next week', color: 'blue', section: 'billing', type: 'custom' }
  ]);
  
  // State for dialog to add discussion items
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  
  // Get the setter function for the current section
  const getSetterForSection = (section: string) => {
    switch(section) {
      case 'owner': return setOwnerItems;
      case 'front': return setFrontItems;
      case 'hygiene': return setHygieneItems;
      case 'doctor': return setDoctorItems;
      case 'billing': return setBillingItems;
      default: return setOwnerItems;
    }
  };
  
  // Add a new discussion item
  const handleAddItem = (item: Omit<DiscussionItemType, 'id'>) => {
    const setter = getSetterForSection(item.section);
    const newItem = {
      ...item,
      id: Date.now()
    };
    
    setter(prev => [...prev, newItem]);
  };
  
  // Delete a discussion item
  const handleDeleteItem = (section: string, id: number) => {
    const setter = getSetterForSection(section);
    setter(prev => prev.filter(item => item.id !== id));
  };
  
  // Open add dialog for a specific section
  const openAddDialog = (section: string) => {
    setCurrentSection(section);
    setAddDialogOpen(true);
  };
  
  return (
    <NavigationWrapper>
      <div className="container max-w-6xl mx-auto pb-8">
        {/* Header with yesterday's KPIs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sun className="h-6 w-6 text-amber-500" />
              <h1 className="text-2xl font-bold">Daily Huddle</h1>
              <span className="text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-sm flex gap-1 items-center">
              <Users className="h-3.5 w-3.5" />
              <span>All staff present</span>
            </Badge>
          </div>
          
          <h2 className="text-lg font-semibold mb-3">Yesterday's Performance</h2>
          <div className="grid grid-cols-4 gap-4">
            <KpiCard 
              title="Production" 
              value={kpis.production.value} 
              target={kpis.production.target} 
              prefix="$" 
              icon={<BarChart3 className="h-5 w-5" />} 
            />
            
            <KpiCard 
              title="Collection %" 
              value={kpis.collection.value} 
              target={kpis.collection.target}
              suffix="%" 
              icon={<DollarSign className="h-5 w-5" />} 
            />
            
            <KpiCard 
              title="Wait Time" 
              value={kpis.waitTime.value} 
              target={kpis.waitTime.target}
              suffix=" min" 
              icon={<Timer className="h-5 w-5" />} 
            />
            
            <KpiCard 
              title="NPS Score" 
              value={kpis.nps.value} 
              target={kpis.nps.target}
              icon={<ThumbsUp className="h-5 w-5" />} 
            />
          </div>
        </div>
        
        {/* Today's schedule and priorities */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          {/* Left column - Schedule heatmap */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Today's Schedule</h2>
            <ScheduleHeatmap schedule={schedule} />
          </div>
          
          {/* Right column - Priority tiles */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Today's Priorities</h2>
            <div className="grid grid-cols-2 gap-3">
              <PriorityTile 
                title="Unconfirmed Appointments" 
                count={priorities.unconfirmed.count} 
                value={priorities.unconfirmed.value} 
                icon={priorities.unconfirmed.icon} 
                colorScheme={priorities.unconfirmed.colorScheme} 
                actionText={priorities.unconfirmed.actionText} 
                onClick={() => {}}
              />
              
              <PriorityTile 
                title="High Balances" 
                count={priorities.balances.count} 
                value={priorities.balances.value} 
                icon={priorities.balances.icon} 
                colorScheme={priorities.balances.colorScheme}
                actionText={priorities.balances.actionText} 
                onClick={() => {}}
              />
              
              <PriorityTile 
                title="Lab Cases Due" 
                count={priorities.labCases.count} 
                value={priorities.labCases.value} 
                icon={priorities.labCases.icon} 
                colorScheme={priorities.labCases.colorScheme}
                actionText={priorities.labCases.actionText} 
                onClick={() => {}}
              />
              
              <PriorityTile 
                title="Supplies Low" 
                count={priorities.supplies.count} 
                value={priorities.supplies.value} 
                icon={priorities.supplies.icon} 
                colorScheme={priorities.supplies.colorScheme}
                actionText={priorities.supplies.actionText} 
                onClick={() => {}}
              />
              
              <div className="col-span-2">
                <PriorityTile 
                  title="Staff Out" 
                  count={priorities.staffOut.count} 
                  value={priorities.staffOut.value} 
                  icon={priorities.staffOut.icon} 
                  colorScheme={priorities.staffOut.colorScheme}
                  actionText={priorities.staffOut.actionText}
                  onClick={() => {}} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Discussion items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Discussion Items</h2>
            <div className="text-sm text-gray-500">Complete in 5 minutes</div>
          </div>
          
          <Tabs defaultValue="owner" className="w-full border rounded-lg">
            <TabsList className="border-b bg-muted/50 w-full rounded-t-lg grid grid-cols-5">
              <TabsTrigger value="owner" className="data-[state=active]:bg-background rounded-none">Owner</TabsTrigger>
              <TabsTrigger value="front" className="data-[state=active]:bg-background rounded-none">Front Office</TabsTrigger>
              <TabsTrigger value="hygiene" className="data-[state=active]:bg-background rounded-none">Hygiene</TabsTrigger>
              <TabsTrigger value="doctor" className="data-[state=active]:bg-background rounded-none">Doctor</TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-background rounded-none">Billing</TabsTrigger>
            </TabsList>
            
            {/* Owner items */}
            <TabsContent value="owner" className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Practice Overview</h3>
                <Button variant="outline" size="sm" className="h-8" onClick={() => openAddDialog('owner')}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-1">
                {ownerItems.map(item => (
                  <DiscussionItem 
                    key={item.id} 
                    item={item} 
                    onDelete={item.type === 'custom' ? (id) => handleDeleteItem('owner', id) : undefined} 
                  />
                ))}
                
                {ownerItems.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No items to discuss yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Front Office items */}
            <TabsContent value="front" className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Front Office Updates</h3>
                <Button variant="outline" size="sm" className="h-8" onClick={() => openAddDialog('front')}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-1">
                {frontItems.map(item => (
                  <DiscussionItem 
                    key={item.id} 
                    item={item} 
                    onDelete={item.type === 'custom' ? (id) => handleDeleteItem('front', id) : undefined} 
                  />
                ))}
                
                {frontItems.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No items to discuss yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Hygiene items */}
            <TabsContent value="hygiene" className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Hygiene Department</h3>
                <Button variant="outline" size="sm" className="h-8" onClick={() => openAddDialog('hygiene')}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-1">
                {hygieneItems.map(item => (
                  <DiscussionItem 
                    key={item.id} 
                    item={item} 
                    onDelete={item.type === 'custom' ? (id) => handleDeleteItem('hygiene', id) : undefined} 
                  />
                ))}
                
                {hygieneItems.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No items to discuss yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Doctor items */}
            <TabsContent value="doctor" className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Doctor's Notes</h3>
                <Button variant="outline" size="sm" className="h-8" onClick={() => openAddDialog('doctor')}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-1">
                {doctorItems.map(item => (
                  <DiscussionItem 
                    key={item.id} 
                    item={item} 
                    onDelete={item.type === 'custom' ? (id) => handleDeleteItem('doctor', id) : undefined}
                  />
                ))}
                
                {doctorItems.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No items to discuss yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Billing items */}
            <TabsContent value="billing" className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Billing & Insurance</h3>
                <Button variant="outline" size="sm" className="h-8" onClick={() => openAddDialog('billing')}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-1">
                {billingItems.map(item => (
                  <DiscussionItem 
                    key={item.id} 
                    item={item} 
                    onDelete={item.type === 'custom' ? (id) => handleDeleteItem('billing', id) : undefined}
                  />
                ))}
                
                {billingItems.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No items to discuss yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Add discussion item dialog */}
      <AddDiscussionDialog 
        open={addDialogOpen} 
        setOpen={setAddDialogOpen} 
        onAdd={handleAddItem} 
        section={currentSection} 
      />
    </NavigationWrapper>
  );
}