import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PlusCircle, Calendar as CalendarIcon, Expand, Minimize } from 'lucide-react';
import { ViewModeType } from '@/lib/scheduling-constants';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface AppHeaderProps {
  selectedDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (mode: ViewModeType) => void;
  currentView: ViewModeType;
  utilizationPercentage: number;
  onBookAppointment: () => void;
  expandedView: boolean;
  onToggleExpandView: () => void;
}

export default function AppHeader({
  selectedDate,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  currentView,
  utilizationPercentage,
  onBookAppointment,
  expandedView,
  onToggleExpandView
}: AppHeaderProps) {
  // Format date display
  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');
  
  // Determine utilization color based on percentage
  const getUtilizationColor = (percent: number) => {
    if (percent < 50) return 'bg-blue-500';
    if (percent < 75) return 'bg-green-500';
    if (percent < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const utilizationColor = getUtilizationColor(utilizationPercentage);
  
  return (
    <div className="bg-white border-b p-4 flex flex-col gap-4">
      <div className="grid grid-cols-3 items-center">
        {/* Left column */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>
        </div>
        
        {/* Center column - Date control stays in center */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="icon" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-lg font-medium">{formattedDate}</div>
          
          <Button variant="ghost" size="icon" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Right column - Tabs and action buttons */}
        <div className="flex items-center justify-end gap-4">
          {/* View mode tabs */}
          <Tabs defaultValue={currentView} onValueChange={(value) => onViewChange(value as ViewModeType)}>
            <TabsList>
              <TabsTrigger value="OPERATORY">Operatory</TabsTrigger>
              <TabsTrigger value="PROVIDER">Provider</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleExpandView}
              title={expandedView ? "Show sidebars" : "Expand calendar"}
            >
              {expandedView ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
            </Button>
            <Button onClick={onBookAppointment} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Book Appointment</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Chair Utilization:</span>
          <Progress value={utilizationPercentage} className="w-32 h-2" indicatorClassName={utilizationColor} />
          <span className="text-sm">{utilizationPercentage}%</span>
        </div>
      </div>
    </div>
  );
}