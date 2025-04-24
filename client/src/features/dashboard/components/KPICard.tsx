import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { KPI } from '../types';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface KPICardProps {
  kpi: KPI;
  accentColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ kpi, accentColor }) => {
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
    <Card className={`${getBgColor()} border shadow-sm`}>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;