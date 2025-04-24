import React, { useState, useEffect, useCallback } from 'react';
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
  PartyPopper,
  Award,
  Target,
  Trophy,
  Star,
  Zap,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Clock,
  Medal,
  Sparkles,
  Wallet
} from 'lucide-react';

// Define prompt variants for the daily challenge card
interface PromptVariant {
  name: string;
  prompt: string;
  benefit: string;
}

const promptVariants: PromptVariant[] = [
  {
    name: "Membership Club Feel",
    prompt: "We offer a 'Fast-Track Checkout'—store a card once and skip the desk dash every visit. Shall I enrol you?",
    benefit: "Think express lane, but for happy smiles."
  },
  {
    name: "Friendly Concierge",
    prompt: "While I'm running your card, would you like us to keep it on file for next time?",
    benefit: "It means a faster checkout—no wallet hunt."
  },
  {
    name: "Time-Saver Angle",
    prompt: "We can store this card securely so your future visits take about 30 seconds to pay—shall I do that for you?",
    benefit: "You'll still get a text before any charge."
  },
  {
    name: "Stress-Reducer",
    prompt: "Most patients let us keep a card on record so they never worry about bills stacking up—okay to add yours?",
    benefit: "It only runs after your insurance pays."
  },
  {
    name: "Contactless Convenience",
    prompt: "If you prefer touch-free payments, I can tokenise this card now—want me to switch that on?",
    benefit: "It's encrypted, and you just tap 'okay' on your phone next time."
  }
];

const RoleDashboard: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('frontOffice');
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set([1])); // Start with one already checked
  const [cardsToShow, setCardsToShow] = useState<number>(3); // Initial count of circles to show
  const [extraCompletedCards, setExtraCompletedCards] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showFireworks, setShowFireworks] = useState<boolean>(false);
  const [showGrandFinale, setShowGrandFinale] = useState<boolean>(false);
  const [challengeVisible, setChallengeVisible] = useState<boolean>(true);
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number>(0);

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
  
  // Helper to cycle through prompt variants
  const nextVariant = useCallback(() => {
    setCurrentVariantIndex((prev) => (prev + 1) % promptVariants.length);
  }, []);
  
  const prevVariant = useCallback(() => {
    setCurrentVariantIndex((prev) => (prev - 1 + promptVariants.length) % promptVariants.length);
  }, []);
  
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
      
      // If this completes all currently shown cards
      if (newSet.size === cardsToShow) {
        // Show appropriate celebration based on progress
        if (newSet.size === 5) {
          // Special fireworks for 5th completion
          setShowFireworks(true);
          setTimeout(() => setShowFireworks(false), 3000);
        } else if (newSet.size === 10) {
          // Grand finale for 10th completion
          setShowGrandFinale(true);
          setTimeout(() => setShowGrandFinale(false), 5000);
        } else {
          // Regular confetti for other milestones
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
        }
        
        // Add a new circle if we haven't reached 10 yet
        if (newSet.size < 10) {
          setTimeout(() => {
            setCardsToShow(prevCount => prevCount + 1);
          }, 1000);
        }
      }
      
      // Update extra cards count (purely visual for showing +N more)
      if (newSet.size > 3) {
        setExtraCompletedCards(newSet.size - 3);
      }
      
      return newSet;
    });
  };
  
  // Handle dismissing the challenge card
  const handleDismissChallenge = () => {
    setChallengeVisible(false);
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
      
      {/* Daily Challenge Card - shown only for front office role */}
      {currentRole === 'frontOffice' && challengeVisible && (
        <Card className="border-dashed border-2 border-indigo-300 bg-indigo-50 hover:shadow-md transition-shadow duration-200 relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 p-2 rounded-full flex-shrink-0">
                <Trophy className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-indigo-800 flex items-center">
                    Daily Challenge
                  </h3>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 h-6 p-0 px-2"
                    onClick={handleDismissChallenge}
                  >
                    Dismiss
                  </Button>
                </div>
                <p className="text-sm text-indigo-700 mt-1">
                  Invite patients today to <strong>store a card on file</strong>
                </p>
                <p className="text-xs text-indigo-600 mt-0.5">
                  → unlock faster check-outs & fewer billing calls
                </p>
                
                {/* Prompt Carousel */}
                <div className="mt-2 bg-white p-3 rounded-md border border-indigo-200 text-sm relative">
                  <div className="absolute -top-2 left-3 bg-indigo-100 text-indigo-700 px-2 py-0.5 text-xs rounded-full">
                    {promptVariants[currentVariantIndex].name}
                  </div>
                  
                  <p className="text-gray-700 mt-1">
                    <span className="font-medium block">Prompt Line:</span> 
                    "{promptVariants[currentVariantIndex].prompt}"
                  </p>
                  
                  <p className="text-gray-700 mt-2">
                    <span className="font-medium block">Benefit:</span> 
                    "{promptVariants[currentVariantIndex].benefit}"
                  </p>
                  
                  <div className="flex justify-between mt-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-indigo-600"
                      onClick={prevVariant}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-indigo-600"
                      onClick={nextVariant}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Progress Circles */}
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center space-x-2 flex-wrap">
                    {/* Show circles based on current progress - start with initial 3, then add more as they're completed */}
                    {Array.from({ length: cardsToShow }).map((_, index) => (
                      <button 
                        key={index + 1}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          completedCards.has(index + 1) 
                            ? 'border-indigo-500 bg-indigo-100' 
                            : 'border-indigo-400 bg-white hover:bg-indigo-50'
                        }`}
                        title={`Mark patient ${index + 1} ${completedCards.has(index + 1) ? 'incomplete' : 'complete'}`}
                        onClick={() => handleCardComplete(index + 1)}
                      >
                        {completedCards.has(index + 1) && <Check className="h-3 w-3 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="text-xs text-indigo-700 font-medium">
                    {completedCards.size}/10 saved
                  </div>
                </div>
              </div>
            </div>
            
            {/* Celebrations */}
            {/* Regular confetti celebration */}
            {showConfetti && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                <div className="relative">
                  <PartyPopper className="h-8 w-8 text-indigo-500 animate-bounce" />
                  {/* Simulated confetti particles */}
                  <div className="absolute top-1/2 left-1/2">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div 
                        key={i}
                        className={`absolute w-2 h-2 rounded-full bg-${
                          ['indigo', 'blue', 'green', 'pink', 'purple'][i % 5]
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
            
            {/* Special fireworks for 5th completion */}
            {showFireworks && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                <div className="relative">
                  <Sparkles className="h-12 w-12 text-yellow-500 animate-pulse" />
                  {/* More elaborate fireworks effect */}
                  <div className="absolute top-1/2 left-1/2">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div 
                        key={i}
                        className={`absolute w-3 h-3 rounded-full bg-${
                          ['indigo', 'yellow', 'green', 'pink', 'red', 'blue'][i % 6]
                        }-500 animate-ping`}
                        style={{ 
                          top: `${Math.random() * 200 - 100}px`, 
                          left: `${Math.random() * 200 - 100}px`,
                          animationDuration: `${0.3 + Math.random()}s`,
                          animationDelay: `${Math.random() * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Grand finale for 10th completion */}
            {showGrandFinale && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-50 bg-black/30">
                <div className="relative">
                  <Star className="h-16 w-16 text-yellow-500 animate-bounce" />
                  {/* Huge celebration effect */}
                  <div className="absolute top-1/2 left-1/2">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div 
                        key={i}
                        className={`absolute w-4 h-4 rounded-full bg-${
                          ['yellow', 'indigo', 'green', 'pink', 'red', 'blue', 'purple', 'orange'][i % 8]
                        }-500 animate-ping`}
                        style={{ 
                          top: `${Math.random() * 400 - 200}px`, 
                          left: `${Math.random() * 400 - 200}px`,
                          animationDuration: `${0.2 + Math.random() * 2}s`,
                          animationDelay: `${Math.random() * 0.8}s`
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white/80 p-3 rounded-lg shadow-lg text-center">
                    <h3 className="text-xl font-bold text-indigo-700">Challenge Complete!</h3>
                    <p className="text-indigo-600">You've saved 10 cards on file! Amazing work! 🏆</p>
                  </div>
                </div>
              </div>
            )}
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