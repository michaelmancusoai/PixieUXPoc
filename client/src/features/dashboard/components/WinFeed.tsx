import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WinItem } from '../types';
import {
  AlertCircle,
  BarChart2,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  FileCheck,
  FileText,
  Package,
  Send,
  TrendingDown,
  Video,
  Zap
} from 'lucide-react';

interface WinFeedProps {
  wins: WinItem[];
  accentColor: string;
}

const WinFeed: React.FC<WinFeedProps> = ({ wins, accentColor }) => {
  const getAccentColorClass = () => {
    switch (accentColor) {
      case 'blue':
        return 'text-blue-600';
      case 'teal':
        return 'text-teal-600';
      case 'indigo':
        return 'text-indigo-600';
      case 'amber':
        return 'text-amber-600';
      case 'green':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'CheckCircle':
        return <CheckCircle className="h-5 w-5" />;
      case 'Calendar':
        return <Calendar className="h-5 w-5" />;
      case 'Bell':
        return <Bell className="h-5 w-5" />;
      case 'FileText':
        return <FileText className="h-5 w-5" />;
      case 'FileCheck':
        return <FileCheck className="h-5 w-5" />;
      case 'Video':
        return <Video className="h-5 w-5" />;
      case 'DollarSign':
        return <DollarSign className="h-5 w-5" />;
      case 'Send':
        return <Send className="h-5 w-5" />;
      case 'CreditCard':
        return <CreditCard className="h-5 w-5" />;
      case 'TrendingDown':
        return <TrendingDown className="h-5 w-5" />;
      case 'Package':
        return <Package className="h-5 w-5" />;
      case 'BarChart2':
        return <BarChart2 className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className={`text-base ${getAccentColorClass()}`}>
          AI Win Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {wins.map((win) => (
            <div key={win.id} className="flex items-start space-x-3">
              <div className={`rounded-full p-2 flex-shrink-0 ${getIconBgColor()}`}>
                {getIcon(win.icon)}
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-medium">{win.title}</h4>
                {win.description && (
                  <p className="text-sm text-gray-600">{win.description}</p>
                )}
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{win.timestamp}</span>
                  
                  {(win.value !== undefined || win.savings !== undefined) && (
                    <>
                      <span className="mx-2">•</span>
                      <DollarSign className="h-3 w-3 mr-1" />
                      <span>
                        {win.value !== undefined 
                          ? `$${win.value.toLocaleString()}` 
                          : win.savings !== undefined 
                            ? `Saved $${win.savings.toLocaleString()}` 
                            : ''}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WinFeed;