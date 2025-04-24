import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FlowCategory } from '../types';
import { 
  Activity, 
  Check, 
  ClipboardCheck, 
  CreditCard, 
  SmilePlus, 
  Bell,
  FileCheck,
  Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowRadarProps {
  categories: FlowCategory[];
  accentColor: string;
}

// Get icon component based on category ID
const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'checkedIn':
      return ClipboardCheck;
    case 'seated':
      return Activity;
    case 'preClinical':
      return Stethoscope;
    case 'doctorReady':
      return Bell;
    case 'inTreatment':
      return SmilePlus;
    case 'wrapUp':
      return FileCheck;
    case 'readyForCheckout':
      return CreditCard;
    case 'checkedOut':
      return Check;
    default:
      return Activity;
  }
};

const FlowRadar: React.FC<FlowRadarProps> = ({ categories, accentColor }) => {
  const getColumnColor = (id: string, isBottleneck?: boolean) => {
    if (isBottleneck) {
      return 'bg-red-500';
    }
    
    switch (id) {
      case 'checkedIn':
        return 'bg-blue-500';
      case 'seated':
        return 'bg-teal-500';
      case 'preClinical':
        return 'bg-indigo-500';
      case 'doctorReady':
        return 'bg-violet-500';
      case 'inTreatment':
        return 'bg-purple-500';
      case 'wrapUp':
        return 'bg-pink-500';
      case 'readyForCheckout':
        return 'bg-orange-500';
      case 'checkedOut':
        return 'bg-green-500';
      default:
        return `bg-${accentColor}-500`;
    }
  };

  // Mapping from simplified to complete category titles
  const getCategoryTitle = (id: string, label: string) => {
    switch (id) {
      case 'checkedIn':
        return 'Checked-In';
      case 'seated':
        return 'Seated';
      case 'preClinical':
        return 'Pre-Clinical';
      case 'doctorReady':
        return 'Doctor Ready';
      case 'inTreatment':
        return 'In Treatment';
      case 'wrapUp':
        return 'Clinical Wrap-Up';
      case 'readyForCheckout':
        return 'Ready for Checkout';
      case 'checkedOut':
        return 'Checked-Out';
      default:
        return label;
    }
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-3 min-w-max">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.id);
          const colorClass = getColumnColor(category.id, category.isBottleneck);
          const fullTitle = getCategoryTitle(category.id, category.label);
          
          return (
            <div 
              key={category.id}
              className="min-w-[140px] w-[180px] flex flex-col cursor-pointer"
            >
              <div className={cn(
                "text-white px-3 py-2 rounded-t-md flex justify-between items-center",
                colorClass
              )}>
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-1" />
                  <h3 className="text-xs font-medium truncate">{fullTitle}</h3>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "bg-white/20 hover:bg-white/20 text-white border-none text-xs",
                    category.isBottleneck && "bg-red-300/30 hover:bg-red-300/30"
                  )}
                >
                  {category.count}
                </Badge>
              </div>
              
              <div className="bg-white border border-t-0 border-muted rounded-b-md p-2 text-center h-14 flex items-center justify-center">
                {category.count === 0 ? (
                  <div className="text-muted-foreground text-xs">
                    No patients
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium">{category.count} Patient{category.count !== 1 ? 's' : ''}</div>
                    <div className="text-xs text-muted-foreground">Click to view</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlowRadar;