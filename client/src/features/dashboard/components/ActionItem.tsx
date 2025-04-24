import React from 'react';
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
  Activity
} from 'lucide-react';
import { ActionItem as ActionItemType } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ActionItemProps {
  item: ActionItemType;
  accentColor: string;
  onComplete: (id: string) => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ item, accentColor, onComplete }) => {
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

  return (
    <Card 
      className={`border ${item.completed ? 'bg-gray-50 opacity-70' : 'bg-white'}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className={`rounded-full p-2 flex-shrink-0 ${getIconBgColor()}`}>
            {getIcon()}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                {item.title}
              </h3>
              <Badge 
                variant="outline" 
                className={`text-xs ${getPriorityColor()}`}
              >
                P{item.priority}
              </Badge>
            </div>
            
            {item.description && (
              <p className={`text-sm mb-2 ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.description}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex space-x-2">
                {item.patientName && (
                  <Badge variant="outline" className="text-xs">
                    {item.patientName}
                  </Badge>
                )}
                
                {item.dueIn && (
                  <Badge variant="outline" className="text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" />{item.dueIn}
                  </Badge>
                )}
                
                {item.amount && (
                  <Badge variant="outline" className="text-xs flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />${item.amount}
                  </Badge>
                )}
              </div>
              
              <Button
                size="sm"
                className={`${item.completed ? 'bg-gray-400' : getButtonColor()} text-white`}
                onClick={() => onComplete(item.id)}
                disabled={item.completed}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                {item.completed ? 'Completed' : 'Complete'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionItem;