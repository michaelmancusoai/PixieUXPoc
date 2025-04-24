import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { KPI } from '../types';
import { Bell, TrendingDown, TrendingUp } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KPICardProps {
  kpi: KPI;
  accentColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ kpi, accentColor }) => {
  // For progress bar animation
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Calculate progress percentage for the bar if target exists
  const getProgressPercentage = (): number => {
    if (!kpi.target || typeof kpi.value !== 'number' || typeof kpi.target !== 'number') {
      return 0;
    }
    
    const percentage = (kpi.value / kpi.target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };
  
  // Determine if we've hit/exceeded target
  const isTargetReached = (): boolean => {
    if (!kpi.target || typeof kpi.value !== 'number' || typeof kpi.target !== 'number') {
      return false;
    }
    return kpi.value >= kpi.target;
  };
  
  // Handle progress bar animation
  useEffect(() => {
    const progressValue = getProgressPercentage();
    const timer = setTimeout(() => setProgress(progressValue), 500);
    
    // Celebration effect when reaching target
    if (isTargetReached()) {
      const celebrationTimer = setTimeout(() => {
        setShowCelebration(true);
        
        // Hide celebration after 3 seconds
        setTimeout(() => setShowCelebration(false), 3000);
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(celebrationTimer);
      };
    }
    
    return () => clearTimeout(timer);
  }, [kpi.value, kpi.target]);
  
  const getStatusColor = () => {
    switch (kpi.status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBgColor = () => {
    switch (accentColor) {
      case 'blue':
        return 'bg-blue-50 border-blue-200';
      case 'teal':
        return 'bg-teal-50 border-teal-200';
      case 'indigo':
        return 'bg-indigo-50 border-indigo-200';
      case 'amber':
        return 'bg-amber-50 border-amber-200';
      case 'green':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  const getProgressColor = () => {
    if (isTargetReached()) return 'bg-green-600';
    
    switch (accentColor) {
      case 'blue':
        return 'bg-blue-600';
      case 'teal':
        return 'bg-teal-600';
      case 'indigo':
        return 'bg-indigo-600';
      case 'amber':
        return 'bg-amber-600';
      case 'green':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      if (kpi.isPercentage) {
        return value.toFixed(1) + '%';
      } else if (kpi.unit === '$') {
        return '$' + value.toLocaleString();
      } else {
        return value.toLocaleString() + (kpi.unit ? ` ${kpi.unit}` : '');
      }
    }
    return value;
  };

  const formatTarget = (target: string | number | undefined) => {
    if (target === undefined) return '';
    if (typeof target === 'number') {
      if (kpi.isPercentage) {
        return target.toFixed(1) + '%';
      } else if (kpi.unit === '$') {
        return '$' + target.toLocaleString();
      } else {
        return target.toLocaleString() + (kpi.unit ? ` ${kpi.unit}` : '');
      }
    }
    return target;
  };

  return (
    <Card className={`${getBgColor()} border shadow-sm relative overflow-hidden`}>
      {showCelebration && (
        <div className="absolute top-0 right-0 p-2 animate-bounce">
          <Bell className="h-5 w-5 text-green-600" />
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="text-sm text-gray-600 mb-1">{kpi.label}</div>
          <div className="flex items-end justify-between">
            <div className={`text-2xl font-semibold ${getStatusColor()}`}>
              {formatValue(kpi.value)}
            </div>
            <div className="flex items-center">
              {kpi.target && (
                <div className="text-xs text-gray-500 mr-2">
                  Target: {formatTarget(kpi.target)}
                </div>
              )}
              {kpi.trend && (
                <div 
                  className={`flex items-center text-xs font-medium ${
                    kpi.trend === 'up' 
                      ? kpi.status === 'danger' ? 'text-red-600' : 'text-green-600' 
                      : kpi.status === 'danger' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {kpi.trend === 'up' ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {kpi.delta ? `+${kpi.delta}%` : ''}
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {kpi.delta ? `-${kpi.delta}%` : ''}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Progress bar for goal-based KPIs */}
          {kpi.target && typeof kpi.value === 'number' && typeof kpi.target === 'number' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mt-3">
                    <Progress 
                      value={progress} 
                      className="h-2 bg-gray-200" 
                      indicatorClassName={getProgressColor()}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isTargetReached() 
                      ? "Target reached! 🎉" 
                      : `${progress.toFixed(1)}% to target`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;