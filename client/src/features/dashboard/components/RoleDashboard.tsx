import React, { useState } from 'react';
import { UserRole, ROLE_CONFIGS } from '../types';
import { roleBasedData } from '../mockData';
import RoleSelector from './RoleSelector';
import KPICard from './KPICard';
import ActionItem from './ActionItem';
import FlowRadar from './FlowRadar';
import WinFeed from './WinFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Receipt, 
  Stethoscope, 
  Activity, 
  UserCheck, 
  MessageCircle as MessageCircleIcon, 
  CheckCircle2, 
  LightbulbIcon,
  Plus 
} from 'lucide-react';

const RoleDashboard: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('frontOffice');
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  // Get the dashboard data for the current role
  const dashboardData = roleBasedData[currentRole];
  
  // Get the role config for the current role
  const roleConfig = ROLE_CONFIGS[currentRole];

  // Function to mark an action as complete
  const handleActionComplete = (id: string) => {
    setCompletedActions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Get the appropriate icon for the role
  const getRoleIcon = () => {
    switch (currentRole) {
      case 'frontOffice':
        return <UserCheck className="h-6 w-6 text-blue-600" />;
      case 'hygienist':
        return <Activity className="h-6 w-6 text-teal-600" />;
      case 'provider':
        return <Stethoscope className="h-6 w-6 text-indigo-600" />;
      case 'billing':
        return <Receipt className="h-6 w-6 text-amber-600" />;
      case 'owner':
        return <Building className="h-6 w-6 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Today Screen</h1>
          <p className="text-muted-foreground">
            Welcome to your personalized daily dashboard.
          </p>
        </div>
        <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
      </div>

      {/* Greeting Banner */}
      <Card className={`bg-${roleConfig.accentColor}-50 border-${roleConfig.accentColor}-200`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`bg-${roleConfig.accentColor}-100 p-3 rounded-full`}>
                {getRoleIcon()}
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold flex items-center">
                  {dashboardData.greeting}
                  {currentRole === 'frontOffice' && (
                    <div className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                      <Activity className="h-3 w-3 mr-1" />
                      4-day streak
                    </div>
                  )}
                </h2>
                <p className="text-gray-600">{dashboardData.greetingDetails}</p>
                
                {/* Coaching tip - conditionally shown for front office role */}
                {currentRole === 'frontOffice' && (
                  <div className="mt-2 text-sm bg-blue-50 border border-blue-200 rounded-md p-2 flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-2 flex-shrink-0">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-blue-800">Patients answer texts 3× faster before 8 a.m. — want to send now?</p>
                    </div>
                  </div>
                )}
                
                {/* AI Overnight Wins - conditionally shown for front office role */}
                {currentRole === 'frontOffice' && (
                  <div className="mt-2 text-sm bg-green-50 border border-green-200 rounded-md p-2 flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-2 flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-green-800">Booked 3 waitlist gaps worth $720 while you slept</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Badge className={`mt-4 md:mt-0 bg-${roleConfig.accentColor}-100 text-${roleConfig.accentColor}-800 border-${roleConfig.accentColor}-200`}>
              {roleConfig.title}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Nudge Card - shown only for front office role */}
      {currentRole === 'frontOffice' && (
        <Card className="border-dashed border-2 border-amber-300 bg-amber-50 hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 p-2 rounded-full flex-shrink-0">
                <LightbulbIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-800 flex items-center">
                  Add card-on-file prompt to four patients today
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  Likely to generate extra $1,450 this year in reduced collections effort
                </p>
                <div className="mt-3">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add prompt
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardData.kpis.map((kpi, index) => (
          <KPICard key={index} kpi={kpi} accentColor={roleConfig.accentColor} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Queue and Flow Radar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Impact Queue */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className={`text-${roleConfig.accentColor}-600`}>
                Impact Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {dashboardData.actionItems.map((item) => (
                  <ActionItem
                    key={item.id}
                    item={{
                      ...item,
                      completed: completedActions.has(item.id),
                    }}
                    accentColor={roleConfig.accentColor}
                    onComplete={handleActionComplete}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Flow Radar */}
          <FlowRadar 
            categories={dashboardData.flowCategories}
            accentColor={roleConfig.accentColor}
          />
        </div>

        {/* Win Feed */}
        <div className="lg:col-span-1">
          <WinFeed wins={dashboardData.wins} accentColor={roleConfig.accentColor} />
        </div>
      </div>
    </div>
  );
};

export default RoleDashboard;