import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PlusCircle, Calendar as CalendarIcon, Expand, Minimize, CalendarDays } from 'lucide-react';
import { ViewModeType } from '@/lib/scheduling-constants';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';


interface AppHeaderProps {
  selectedDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (mode: ViewModeType) => void;
  currentView: ViewModeType;
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
  onBookAppointment,
  expandedView,
  onToggleExpandView,
  patientCounts = { total: 24, upcoming: 8, inProgress: 5, completed: 11 } // Default values for now
}: AppHeaderProps) {
  // Format date display
  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');
  
  return (
    <div className="bg-white border-b p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Today button */}
          <Button variant="outline" size="sm" onClick={onToday} className="h-8 flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Today</span>
          </Button>
          
          {/* Patient counts */}
          <div className="flex items-center gap-1.5 h-8">
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onPrevious} className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-base font-medium text-gray-800 min-w-[220px] text-center">{formattedDate}</div>
          <Button variant="ghost" size="icon" onClick={onNext} className="text-gray-500 hover:text-gray-700">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* View mode and actions */}
        <div className="flex items-center gap-4">
          <Tabs 
            value={currentView} 
            onValueChange={(value) => {
              console.log("View changed to:", value);
              onViewChange(value as ViewModeType);
            }} 
            className="mr-2"
          >
            <TabsList className="h-8">
              <TabsTrigger value="OPERATORY" className="text-xs px-3">Operatory</TabsTrigger>
              <TabsTrigger value="PROVIDER" className="text-xs px-3">Provider</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleExpandView}
              title={expandedView ? "Show sidebars" : "Expand calendar"}
              className="h-8 w-8"
            >
              {expandedView ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
            </Button>
            <Button onClick={onBookAppointment} className="flex items-center gap-1 h-8 text-xs" size="sm">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Book Appointment</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}