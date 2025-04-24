import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WinItem } from '../types';
import {
  AlertCircle,
  BarChart2,
  Bell,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  FileCheck,
  FileText,
  Package,
  Send,
  TrendingDown,
  Video,
  X,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WinFeedProps {
  wins: WinItem[];
  accentColor: string;
}

const WinFeed: React.FC<WinFeedProps> = ({ wins, accentColor }) => {
  const [visibleWins, setVisibleWins] = useState<Set<string>>(new Set(wins.map(win => win.id)));
  
  const handleDismiss = (winId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setVisibleWins(prevWins => {
      const updatedWins = new Set(prevWins);
      updatedWins.delete(winId);
      return updatedWins;
    });
  };
  
  const handleViewDetails = (winId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // In a real app, this would open a modal or navigate to a detailed view
    alert(`Viewing details for: ${wins.find(w => w.id === winId)?.title}`);
  };
  
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
      case 'CheckCircle2':
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
  
  // Gets border color for AI-generated wins
  const getBorderColor = (isAi?: boolean) => {
    if (!isAi) return '';
    
    switch (accentColor) {
      case 'blue':
        return 'border-l-blue-400';
      case 'teal':
        return 'border-l-teal-400';
      case 'indigo':
        return 'border-l-indigo-400';
      case 'amber':
        return 'border-l-amber-400';
      case 'green':
        return 'border-l-green-400';
      default:
        return 'border-l-gray-400';
    }
  };
  
  const filteredWins = wins.filter(win => visibleWins.has(win.id));
  
  // Show empty state when all wins are dismissed
  if (filteredWins.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className={`text-base ${getAccentColorClass()}`}>
            Pixie AI Agent
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className={`rounded-full p-3 ${getIconBgColor()} mb-2`}>
              <CheckCircle className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-medium">All caught up!</h4>
            <p className="text-xs text-gray-500 mt-1">You're ahead of schedule today.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className={`text-base ${getAccentColorClass()}`}>
          Pixie AI Agent
        </CardTitle>
        <div className="text-xs text-gray-500">
          {filteredWins.length} {filteredWins.length === 1 ? 'win' : 'wins'} today
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-1">
        <div className="space-y-2 pr-1">
          {filteredWins.map((win) => (
            <div 
              key={win.id} 
              className={`flex items-start space-x-3 p-2 rounded-md border-l-4 ${getBorderColor(win.isAi)} hover:bg-gray-50`}
            >
              <div className={`rounded-full p-2 flex-shrink-0 ${getIconBgColor()}`}>
                {getIcon(win.icon)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium">{win.title}</h4>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 rounded-full hover:bg-gray-200"
                      onClick={(e) => handleViewDetails(win.id, e)}
                      title="View details"
                    >
                      <Eye className="h-3 w-3 text-gray-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 rounded-full hover:bg-gray-200"
                      onClick={(e) => handleDismiss(win.id, e)}
                      title="Clear notification"
                    >
                      <Check className="h-3 w-3 text-gray-500" />
                    </Button>
                  </div>
                </div>
                
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
                  
                  {/* Display time saved */}
                  {win.timeSavedMin !== undefined && (
                    <>
                      <span className="mx-2">•</span>
                      <Zap className="h-3 w-3 mr-1" />
                      <span className={win.isAi ? "font-medium text-purple-600" : ""}>
                        Saved {win.timeSavedMin} min
                      </span>
                    </>
                  )}
                  
                  {/* Add an AI badge for AI-generated wins */}
                  {win.isAi && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full text-[10px]">
                        AI
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