import React, { useState, useEffect } from 'react';
import { UserRole, ROLE_CONFIGS } from '../types';
import { roleBasedData } from '../mockData';
import RoleSelector from './RoleSelector';
import KPICard from './KPICard';
import ActionItem from './ActionItem';
import FlowRadar from './FlowRadar';
import WinFeed from './WinFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Receipt, 
  Stethoscope, 
  Activity, 
  UserCheck, 
  MessageCircle, 
  CheckCircle2, 
  Lightbulb,
  Plus,
  Check,
  PartyPopper
} from 'lucide-react';

const RoleDashboard: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('frontOffice');
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [extraCompletedCards, setExtraCompletedCards] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [quickWinVisible, setQuickWinVisible] = useState<boolean>(true);

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
  
  // Function to mark a card-on-file action as complete
  const handleCardComplete = (cardNumber: number) => {
    setCompletedCards((prev) => {
      const newSet = new Set(prev);
      
      // If already completed, do nothing
      if (newSet.has(cardNumber)) {
        return newSet;
      }
      
      // Add the new card
      newSet.add(cardNumber);
      
      // Check if all 3 are now complete
      if (newSet.size === 3 && !showConfetti) {
        setShowConfetti(true);
        // Hide confetti after 3 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }
      
      // If more than 3 cards are completed
      if (newSet.size > 3) {
        setExtraCompletedCards(newSet.size - 3);
      }
      
      return newSet;
    });
  };
  
  // Handle dismissing the quick win card
  const handleDismissQuickWin = () => {
    setQuickWinVisible(false);
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
          {currentRole === 'frontOffice' ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight">Front Desk Command Centre</h1>
              <p className="text-muted-foreground">
                Your morning snapshot & next best moves.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">Today Screen</h1>
              <p className="text-muted-foreground">
                Welcome to your personalized daily dashboard.
              </p>
            </>
          )}
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
                      4-day streak of 95% confirmations – keep it alive!
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

          </div>
        </CardContent>
      </Card>
      
      {/* Quick Win Card - shown only for front office role */}
      {currentRole === 'frontOffice' && quickWinVisible && (
        <Card className="border-dashed border-2 border-amber-300 bg-amber-50 hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 p-2 rounded-full flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-amber-800 flex items-center">
                    💡 Quick Win
                  </h3>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 h-6 p-0 px-2"
                    onClick={handleDismissQuickWin}
                  >
                    Dismiss
                  </Button>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  Invite 3 patients today to <strong>store a card on file</strong>
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  → unlock faster check-outs & fewer billing calls
                </p>
                <div className="mt-2 bg-white p-2 rounded-md border border-amber-200 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Try saying:</span> "While I'm processing this, would you like us to keep the card on file? It's encrypted, and we always text you before any charge."
                  </p>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {/* Progress circles */}
                    {[1, 2, 3].map((item) => (
                      <button 
                        key={item}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          completedCards.has(item) 
                            ? 'border-amber-500 bg-amber-100' 
                            : 'border-amber-400 bg-white hover:bg-amber-50'
                        }`}
                        title={`Mark patient ${item} ${completedCards.has(item) ? 'incomplete' : 'complete'}`}
                        onClick={() => handleCardComplete(item)}
                      >
                        {completedCards.has(item) && <Check className="h-3 w-3 text-amber-600" />}
                      </button>
                    ))}
                    
                    {/* Show count if more than 3 are completed */}
                    {extraCompletedCards > 0 && (
                      <div className="text-xs font-semibold text-amber-700">
                        +{extraCompletedCards} more
                      </div>
                    )}
                  </div>
                  
                  {/* Confetti celebration */}
                  {showConfetti && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                      <div className="relative">
                        <PartyPopper className="h-8 w-8 text-amber-500 animate-bounce" />
                        {/* Simulated confetti particles */}
                        <div className="absolute top-1/2 left-1/2">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div 
                              key={i}
                              className={`absolute w-2 h-2 rounded-full bg-${
                                ['amber', 'blue', 'green', 'pink', 'purple'][i % 5]
                              }-500 animate-ping`}
                              style={{ 
                                top: `${Math.random() * 100 - 50}px`, 
                                left: `${Math.random() * 100 - 50}px`,
                                animationDuration: `${0.5 + Math.random()}s`,
                                animationDelay: `${Math.random() * 0.5}s`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Progress Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dashboardData.kpis.map((kpi, index) => (
          <KPICard key={index} kpi={kpi} accentColor={roleConfig.accentColor} />
        ))}
        {currentRole === 'frontOffice' && (
          <div className="col-span-full text-xs text-center text-muted-foreground mt-0">
            Progress updates every 2 min
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Queue and Flow Radar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Impact Queue */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className={`text-${roleConfig.accentColor}-600`}>
                {currentRole === 'frontOffice' ? 
                  'Impact Queue — Highest-impact actions first' : 
                  'Impact Queue'}
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
              {/* Empty-Impact State */}
              {dashboardData.actionItems.every(item => completedActions.has(item.id)) && (
                <div className="mt-6 text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">When the list is clear, your magic is invisible to patients</h3>
                  <p className="text-gray-600 mt-2">— exactly as it should be.</p>
                  <div className="mt-4 flex justify-center space-x-3">
                    <Button 
                      variant="outline" 
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    >
                      Preview Tomorrow
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    >
                      Grab a Coffee ☕
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flow Radar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className={`text-${roleConfig.accentColor}-600`}>
                {currentRole === 'frontOffice' ? 'Live Patient Flow' : 'Patient Flow'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <FlowRadar 
                categories={dashboardData.flowCategories}
                accentColor={roleConfig.accentColor}
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Click column to jump to those patients in Mission Control
              </p>
            </CardContent>
          </Card>
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