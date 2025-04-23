import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ViewModeType } from "@shared/schema";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";

interface AppHeaderProps {
  selectedDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (viewMode: ViewModeType) => void;
  currentView: ViewModeType;
  utilizationPercentage: number;
  onBookAppointment: () => void;
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
}: AppHeaderProps) {
  
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white border-b">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="border rounded flex items-center h-8">
          <span className="px-3 py-1 text-sm font-medium">
            {format(selectedDate, 'MM/dd/yyyy')}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToday}
          className="text-xs h-8 px-2 text-blue-600"
        >
          Today ({format(new Date(), 'MMM d, yyyy')})
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-3">
        <div className="border rounded-md p-0.5 flex">
          <Button
            variant={currentView === 'OPERATORY' ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange('OPERATORY')}
            className={`text-xs h-7 ${currentView === 'OPERATORY' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
          >
            Op View
          </Button>
          <Button
            variant={currentView === 'PROVIDER' ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange('PROVIDER')}
            className={`text-xs h-7 ${currentView === 'PROVIDER' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
          >
            Provider View
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm">{utilizationPercentage}% filled</span>
          <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${utilizationPercentage}%` }}
            ></div>
          </div>
        </div>

        <Button
          onClick={onBookAppointment}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Schedule Visit
        </Button>
      </div>
    </div>
  );
}
