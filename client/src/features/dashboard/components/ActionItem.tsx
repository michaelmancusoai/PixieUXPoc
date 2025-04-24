import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  AlertOctagon,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  FileCheck,
  FileSignature,
  FileText,
  FileX,
  Mail,
  MessageSquare,
  Package,
  PackageCheck,
  Phone,
  Send,
  Smile,
  Wrench,
  TrendingUp,
  UserPlus,
  BarChart2,
  Video,
  Activity,
  CircleCheck,
  MessageCircle
} from 'lucide-react';
import { ActionItem as ActionItemType } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface ActionItemProps {
  item: ActionItemType;
  accentColor: string;
  onComplete: (id: string) => void;
}

// Helper function to parse time string like "42 m" to minutes
const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+)\s*m/);
  return match ? parseInt(match[1], 10) : 0;
};

const ActionItem: React.FC<ActionItemProps> = ({ item, accentColor, onComplete }) => {
  // For time-to-pain timer functionality
  const [remainingMinutes, setRemainingMinutes] = useState<number>(() => {
    return item.dueIn ? parseTimeToMinutes(item.dueIn) : 0;
  });
  
  // Timer colors based on urgency
  const getTimerColor = () => {
    if (remainingMinutes <= 0) return 'bg-red-100 text-red-800 border-red-200';
    if (remainingMinutes <= 15) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };
  
  // Update timer every minute
  useEffect(() => {
    if (!item.dueIn || item.completed) return;
    
    const timer = setInterval(() => {
      setRemainingMinutes(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 60000); // 1 minute interval
    
    return () => clearInterval(timer);
  }, [item.dueIn, item.completed]);

  // Get the appropriate icon based on the item type
  const getIcon = () => {
    switch (item.icon) {
      case 'Phone':
        return <Phone className="h-5 w-5" />;
      case 'MessageSquare':
        return <MessageSquare className="h-5 w-5" />;
      case 'ClipboardList':
        return <ClipboardList className="h-5 w-5" />;
      case 'CreditCard':
        return <CreditCard className="h-5 w-5" />;
      case 'Calendar':
        return <Calendar className="h-5 w-5" />;
      case 'FileX':
        return <FileX className="h-5 w-5" />;
      case 'Video':
        return <Video className="h-5 w-5" />;
      case 'Activity':
        return <Activity className="h-5 w-5" />;
      case 'FileText':
        return <FileText className="h-5 w-5" />;
      case 'Tool':
        return <Wrench className="h-5 w-5" />;
      case 'Smile':
        return <Smile className="h-5 w-5" />;
      case 'FileSignature':
        return <FileSignature className="h-5 w-5" />;
      case 'AlertOctagon':
        return <AlertOctagon className="h-5 w-5" />;
      case 'FileCheck':
        return <FileCheck className="h-5 w-5" />;
      case 'Mail':
        return <Mail className="h-5 w-5" />;
      case 'Clock':
        return <Clock className="h-5 w-5" />;
      case 'UserPlus':
        return <UserPlus className="h-5 w-5" />;
      case 'TrendingUp':
        return <TrendingUp className="h-5 w-5" />;
      case 'PackageCheck':
        return <PackageCheck className="h-5 w-5" />;
      case 'BarChart2':
        return <BarChart2 className="h-5 w-5" />;
      case 'Send':
        return <Send className="h-5 w-5" />;
      case 'Package':
        return <Package className="h-5 w-5" />;
      case 'DollarSign':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <ClipboardList className="h-5 w-5" />;
    }
  };

  // Get the icon background color based on the accent color
  const getIconBgColor = () => {
    switch (accentColor) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'teal':
        return 'bg-teal-100 text-teal-600';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-600';
      case 'amber':
        return 'bg-amber-100 text-amber-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Get the priority badge color
  const getPriorityColor = () => {
    switch (item.priority) {
      case 1:
        return 'bg-red-100 text-red-800 border-red-200';
      case 2:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 3:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get the button color based on the accent color
  const getButtonColor = () => {
    switch (accentColor) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'teal':
        return 'bg-teal-600 hover:bg-teal-700';
      case 'indigo':
        return 'bg-indigo-600 hover:bg-indigo-700';
      case 'amber':
        return 'bg-amber-600 hover:bg-amber-700';
      case 'green':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  // Simulate action handlers for inline macro buttons
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Calling ${item.patientName}`);
  };

  const handleSMS = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Sending SMS to ${item.patientName}`);
  };

  const handlePayment = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Collecting payment of $${item.amount} from ${item.patientName}`);
  };

  // Render contextual hint based on type
  const renderContextualHint = () => {
    if (!item.type) return null;
    
    switch (item.type) {
      case 'collection':
        return item.description || "Try collecting this payment today";
      case 'call':
        return item.description || "Call to confirm appointment";
      case 'reminder':
        return item.description || "Send a friendly reminder";
      default:
        return item.description;
    }
  };

  // Determine if clinical item
  const isClinicalItem = item.type === 'clinical';
  
  return (
    <Card 
      className={`border ${item.completed ? 'bg-gray-50 opacity-70' : 'bg-white'} hover:shadow-md transition-shadow duration-200`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className={`rounded-full p-2 flex-shrink-0 ${getIconBgColor()}`}>
            {getIcon()}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-medium flex items-center ${item.completed ? 'line-through text-gray-500' : ''}`}>
                {item.title}
                {isClinicalItem && (
                  <CircleCheck className="h-4 w-4 ml-1 text-indigo-500" />
                )}
              </h3>
              <div className="flex space-x-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPriorityColor()}`}
                >
                  P{item.priority}
                </Badge>
                
                {item.dueIn && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs flex items-center ${getTimerColor()}`}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {remainingMinutes} m
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Timer progress bar for tasks with due times */}
            {item.dueIn && !item.completed && (
              <div className="mb-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <Progress
                          value={remainingMinutes <= 60 ? (remainingMinutes / 60) * 100 : 100}
                          className={`h-full transition-all ${
                            remainingMinutes <= 15 
                              ? 'bg-red-500' 
                              : remainingMinutes <= 30 
                                ? 'bg-amber-500' 
                                : 'bg-green-500'
                          }`}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {remainingMinutes <= 0 
                          ? 'Overdue now' 
                          : `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} remaining`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            
            {renderContextualHint() && (
              <p className={`text-sm mb-2 ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {renderContextualHint()}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2">
                {item.patientName && (
                  <Badge variant="outline" className="text-xs">
                    {item.patientName}
                  </Badge>
                )}
                
                {item.amount && (
                  <Badge variant="outline" className="text-xs flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />${item.amount}
                  </Badge>
                )}
              </div>
              
              {!item.completed ? (
                <div className="flex space-x-2">
                  <TooltipProvider>
                    {/* Only show call button for appropriate tasks */}
                    {item.type === 'call' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-9 h-9 p-0 rounded-full"
                            onClick={handleCall}
                          >
                            <Phone className="h-4 w-4 text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Call patient</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    
                    {/* SMS button for contact tasks */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-9 h-9 p-0 rounded-full"
                          onClick={handleSMS}
                        >
                          <MessageCircle className="h-4 w-4 text-teal-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send SMS</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Payment button for financial tasks */}
                    {item.amount && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-9 h-9 p-0 rounded-full"
                            onClick={handlePayment}
                          >
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Collect payment</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          className={`${getButtonColor()} text-white`}
                          onClick={() => onComplete(item.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark complete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <Badge variant="outline" className="text-xs bg-gray-100">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionItem;