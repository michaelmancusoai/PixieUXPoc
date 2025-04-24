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
  Wrench,
  X,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WinFeedProps {
  wins: WinItem[];
  accentColor: string;
  delegatedTasks?: Map<string, number>; // Map of delegated task IDs to their estimated time
}

const WinFeed: React.FC<WinFeedProps> = ({ wins, accentColor, delegatedTasks = new Map() }) => {
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
  
  // Only show AI-generated wins in the Pixie AI Agent
  const filteredWins = wins.filter(win => visibleWins.has(win.id) && win.isAi === true);
  
  // Calculate time saved from delegated tasks
  const delegatedTasksTime = Array.from(delegatedTasks.values()).reduce((sum, time) => sum + time, 0);
  
  // Calculate total time saved by AI (existing wins + delegated tasks)
  const winsTimeSaved = filteredWins.reduce((total, win) => total + (win.timeSavedMin || 0), 0);
  const totalTimeSaved = winsTimeSaved + delegatedTasksTime;
  
  // Generate dynamic wins for delegated tasks
  const delegatedTaskWins: WinItem[] = [];
  if (delegatedTasks.size > 0) {
    // Get the current timestamp in a readable format
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create a new win for each delegated task
    Array.from(delegatedTasks.entries()).forEach(([taskId, time], index) => {
      delegatedTaskWins.push({
        id: `delegated-${taskId}`,
        title: `Task delegated to Pixie AI`,
        description: `Pixie is handling this task for you`,
        timestamp: timestamp,
        timeSavedMin: time,
        isAi: true,
        icon: 'Zap'
      });
    });
  }
  
  // Combine existing AI wins with new delegated task wins
  const allWins = [...filteredWins, ...delegatedTaskWins];
  
  // Show empty state when no AI wins or delegated tasks found
  if (allWins.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Zap className="h-4 w-4 text-purple-600 mr-2" />
            <CardTitle className={`text-base ${getAccentColorClass()}`}>
              Pixie AI Agent
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="rounded-full p-4 bg-purple-100 text-purple-800 mb-3">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-medium">AI is analyzing your day</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-[220px]">
              You'll see time-saving insights here soon.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Zap className="h-4 w-4 text-purple-600 mr-2" />
          <CardTitle className={`text-base ${getAccentColorClass()}`}>
            Pixie AI Agent
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-4">
        <div className="space-y-3">
          {allWins.map((win) => (
            <div 
              key={win.id} 
              className={`flex items-start space-x-3 p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${getBorderColor(win.isAi)} hover:bg-gray-50`}
            >
              <div className={`rounded-full p-2 flex-shrink-0 ${getIconBgColor()}`}>
                {getIcon(win.icon)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center">
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
                  <p className="text-sm text-gray-600 mt-1">{win.description}</p>
                )}
                
                <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{win.timestamp}</span>
                  </div>
                  
                  {(win.value !== undefined || win.savings !== undefined) && (
                    <div className="flex items-center ml-3">
                      <DollarSign className="h-3 w-3 mr-1" />
                      <span>
                        {win.value !== undefined 
                          ? `$${win.value.toLocaleString()}` 
                          : win.savings !== undefined 
                            ? `Saved $${win.savings.toLocaleString()}` 
                            : ''}
                      </span>
                    </div>
                  )}
                  
                  {/* Display merged AI and time saved pill */}
                  {win.timeSavedMin !== undefined && (
                    <span className="ml-3 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-[10px] flex items-center">
                      <Zap className="h-2.5 w-2.5 mr-1" />
                      AI Saved ~{win.timeSavedMin} min
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* AI Time Saved Summary Banner - at the bottom */}
          {(allWins.length > 0 || delegatedTasksTime > 0) && (
            <div className="mt-5 py-3 px-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-center">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-700">
                Pixie AI Saved me {totalTimeSaved} min Today
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WinFeed;