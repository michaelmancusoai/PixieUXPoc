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
  patientCounts?: {
    total: number;
    upcoming: number;
    inProgress: number;
    completed: number;
  };
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
  onToggleExpandView,
  patientCounts = { total: 24, upcoming: 8, inProgress: 5, completed: 11 } // Default values for now
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Today Button */}
          <Button variant="outline" size="sm" onClick={onToday} className="mr-1">
            Today
          </Button>
          
          {/* Patient counts - directly next to Today button as in screenshot */}
          <div className="flex items-center gap-1 h-9">
            {/* Total - Dark Gray */}
            <div className="flex items-center w-16 bg-gray-100 border border-gray-300 rounded-md h-full overflow-hidden">
              <div className="flex items-center justify-center w-6 bg-gray-200 h-full mr-1 border-r border-gray-300">
                <span className="text-sm font-bold text-gray-800">{patientCounts.total}</span>
              </div>
              <span className="text-xs text-gray-700">Total</span>
            </div>
            
            {/* Upcoming - Green */}
            <div className="flex items-center w-16 bg-green-50 border border-green-200 rounded-md h-full overflow-hidden">
              <div className="flex items-center justify-center w-6 bg-green-100 h-full mr-1 border-r border-green-200">
                <span className="text-sm font-bold text-green-700">{patientCounts.upcoming}</span>
              </div>
              <span className="text-xs text-green-600">Up</span>
            </div>
            
            {/* In Progress - Orange */}
            <div className="flex items-center w-16 bg-orange-50 border border-orange-200 rounded-md h-full overflow-hidden">
              <div className="flex items-center justify-center w-6 bg-orange-100 h-full mr-1 border-r border-orange-200">
                <span className="text-sm font-bold text-orange-600">{patientCounts.inProgress}</span>
              </div>
              <span className="text-xs text-orange-500">In</span>
            </div>
            
            {/* Completed - Light Gray */}
            <div className="flex items-center w-16 bg-gray-50 border border-gray-200 rounded-md h-full overflow-hidden">
              <div className="flex items-center justify-center w-6 bg-gray-100 h-full mr-1 border-r border-gray-200">
                <span className="text-sm font-bold text-gray-500">{patientCounts.completed}</span>
              </div>
              <span className="text-xs text-gray-400">Done</span>
            </div>
          </div>
        </div>
        
        {/* Date control in center */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-lg font-medium text-center min-w-[200px]">
            {formattedDate}
          </div>
          
          <Button variant="ghost" size="icon" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View mode tabs - on the right side but before the action buttons */}
          <Tabs defaultValue={currentView} onValueChange={(value) => onViewChange(value as ViewModeType)}>
            <TabsList>
              <TabsTrigger value="OPERATORY">Operatory</TabsTrigger>
              <TabsTrigger value="PROVIDER">Provider</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Maximize/Minimize button hidden to match screenshot */}
          {/* <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleExpandView}
            title={expandedView ? "Show sidebars" : "Expand calendar"}
          >
            {expandedView ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          </Button> */}
          
          {/* Book Appointment button */}
          <Button onClick={onBookAppointment} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>Book Appointment</span>
          </Button>
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