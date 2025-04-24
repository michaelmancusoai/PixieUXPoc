import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlowCategory } from '../types';

interface FlowRadarProps {
  categories: FlowCategory[];
  accentColor: string;
}

const FlowRadar: React.FC<FlowRadarProps> = ({ categories, accentColor }) => {
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

  const getBackgroundColorClass = (isBottleneck: boolean = false) => {
    if (isBottleneck) {
      return 'bg-red-50 border-red-200';
    }

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className={`text-base ${getAccentColorClass()}`}>
          Flow Radar
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`${getBackgroundColorClass(category.isBottleneck)} 
                          border rounded-md p-3 flex justify-between items-center`}
            >
              <span className="text-sm font-medium">{category.label}</span>
              <div className={`${category.isBottleneck ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'} 
                               rounded-full w-8 h-8 flex items-center justify-center font-medium`}>
                {category.count}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowRadar;