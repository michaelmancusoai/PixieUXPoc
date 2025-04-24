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
  Wallet,
  Flag
} from 'lucide-react';

// Define game state and levels for the daily challenge card
enum GameLevel {
  BRIEFING_1 = 'BRIEFING_1',
  LEVEL_1 = 'LEVEL_1',
  COMPLETED_1 = 'COMPLETED_1',
  BRIEFING_2 = 'BRIEFING_2',
  LEVEL_2 = 'LEVEL_2',
  COMPLETED_2 = 'COMPLETED_2',
  BRIEFING_FINAL = 'BRIEFING_FINAL',
  LEVEL_FINAL = 'LEVEL_FINAL',
  VICTORY = 'VICTORY',
  SURRENDERED = 'SURRENDERED'
}

interface GameState {
  level: GameLevel;
  coins: number;
  targetCoins: number;
  streak: number;
  surrendered: boolean;
  lastCompletedLevel: GameLevel | null;
  streakInPeril: boolean;
}

// Card on file prompting options for staff
interface PromptVariant {
  name: string;
  prompt: string;
  benefit: string;
}

const promptVariants: PromptVariant[] = [
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
  },
  {
    name: "Membership Club Feel",
    prompt: "We offer a 'Fast-Track Checkout'—store a card once and skip the desk dash every visit. Shall I enrol you?",
    benefit: "Think express lane, but for happy smiles."
  }
];

const RoleDashboard: React.FC = () => {
  // Basic dashboard state
  const [currentRole, setCurrentRole] = useState<UserRole>('frontOffice');
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number>(0);
  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    level: GameLevel.BRIEFING_1,
    coins: 0,
    targetCoins: 3, // Level 1 starts with 3 coins target
    streak: 4, // Initial streak
    surrendered: false,
    lastCompletedLevel: null,
    streakInPeril: false
  });
  
  // Animation states
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showFireworks, setShowFireworks] = useState<boolean>(false);
  const [showGrandFinale, setShowGrandFinale] = useState<boolean>(false);
  const [showWhiteFlag, setShowWhiteFlag] = useState<boolean>(false);
  const [gameVisible, setGameVisible] = useState<boolean>(true);

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

  // Game action handlers
  const handleCoinCollected = () => {
    setGameState(prev => {
      // Don't increment if we've already hit the target
      if (prev.coins >= prev.targetCoins) return prev;
      
      const newCoins = prev.coins + 1;
      const levelCompleted = newCoins >= prev.targetCoins;
      
      let newLevel = prev.level;
      let newLastCompletedLevel = prev.lastCompletedLevel;
      
      // Check if we've completed a level
      if (levelCompleted) {
        if (prev.level === GameLevel.LEVEL_1) {
          newLevel = GameLevel.COMPLETED_1;
          newLastCompletedLevel = GameLevel.LEVEL_1;
          // Show confetti animation
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 1500);
        } else if (prev.level === GameLevel.LEVEL_2) {
          newLevel = GameLevel.COMPLETED_2;
          newLastCompletedLevel = GameLevel.LEVEL_2;
          // Show fireworks animation
          setShowFireworks(true);
          setTimeout(() => setShowFireworks(false), 2000);
        } else if (prev.level === GameLevel.LEVEL_FINAL) {
          newLevel = GameLevel.VICTORY;
          newLastCompletedLevel = GameLevel.LEVEL_FINAL;
          // Show grand finale animation
          setShowGrandFinale(true);
          setTimeout(() => setShowGrandFinale(false), 3000);
        }
      }
      
      return {
        ...prev,
        coins: newCoins,
        level: newLevel,
        lastCompletedLevel: newLastCompletedLevel,
        streakInPeril: false
      };
    });
  };

  const acceptMission = () => {
    setGameState(prev => {
      let newLevel = prev.level;
      let newTargetCoins = prev.targetCoins;
      
      if (prev.level === GameLevel.BRIEFING_1) {
        newLevel = GameLevel.LEVEL_1;
      } else if (prev.level === GameLevel.COMPLETED_1) {
        newLevel = GameLevel.LEVEL_2;
        newTargetCoins = 5; // Level 2 has 5 coins target
      } else if (prev.level === GameLevel.COMPLETED_2) {
        newLevel = GameLevel.LEVEL_FINAL;
        newTargetCoins = 10; // Final level has 10 coins target
      } else if (prev.level === GameLevel.SURRENDERED) {
        // Resume from where we left off
        if (prev.lastCompletedLevel === GameLevel.LEVEL_1) {
          newLevel = GameLevel.LEVEL_2;
          newTargetCoins = 5;
        } else if (prev.lastCompletedLevel === GameLevel.LEVEL_2) {
          newLevel = GameLevel.LEVEL_FINAL;
          newTargetCoins = 10;
        } else {
          newLevel = GameLevel.LEVEL_1;
          newTargetCoins = 3;
        }
      }
      
      return {
        ...prev,
        level: newLevel,
        targetCoins: newTargetCoins,
        surrendered: false
      };
    });
  };

  const surrenderGame = () => {
    // Show white flag animation
    setShowWhiteFlag(true);
    setTimeout(() => {
      setShowWhiteFlag(false);
      // Update game state to surrendered
      setGameState(prev => ({
        ...prev,
        surrendered: true,
        level: GameLevel.SURRENDERED
      }));
    }, 1000);
  };

  // Get the appropriate level background color
  const getLevelBackground = () => {
    const { level } = gameState;
    if (level === GameLevel.BRIEFING_1 || level === GameLevel.LEVEL_1 || level === GameLevel.COMPLETED_1) {
      return 'bg-sky-50 border-sky-200'; // Sky blue for level 1
    } else if (level === GameLevel.BRIEFING_2 || level === GameLevel.LEVEL_2 || level === GameLevel.COMPLETED_2) {
      return 'bg-amber-50 border-amber-200'; // Desert tan for level 2
    } else if (level === GameLevel.BRIEFING_FINAL || level === GameLevel.LEVEL_FINAL || level === GameLevel.VICTORY) {
      return 'bg-orange-50 border-orange-200'; // Lava-orange for final level
    } else if (level === GameLevel.SURRENDERED) {
      return 'bg-gray-50 border-gray-200'; // Gray for surrendered
    }
    return 'bg-sky-50 border-sky-200'; // Default
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

  // Render game coin
  const renderCoin = (index: number) => {
    const { coins } = gameState;
    const isFilled = index < coins;
    
    return (
      <button 
        key={index}
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
          isFilled 
            ? 'border-yellow-500 bg-yellow-100 hover:bg-yellow-200' 
            : 'border-gray-300 bg-white hover:bg-gray-50'
        }`}
        title={isFilled ? "Coin collected!" : "Collect a coin by storing a card on file"}
        onClick={handleCoinCollected}
      >
        {isFilled && (
          <div className="w-6 h-6 rounded-full bg-yellow-400 shadow-inner flex items-center justify-center">
            <CreditCard className="h-3 w-3 text-yellow-800" />
          </div>
        )}
      </button>
    );
  };

  // Render game card content based on current state
  const renderGameContent = () => {
    const { level, coins, targetCoins, streak, surrendered } = gameState;
    
    if (surrendered) {
      return (
        <div className="text-center py-2">
          <div className="flex justify-center mb-2">
            <Flag className="h-5 w-5 text-gray-500" />
          </div>
          <p className="text-gray-700 font-medium">Paused: {coins}/{targetCoins} coins banked.</p>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2 bg-blue-50 text-blue-700 border-blue-200"
            onClick={acceptMission}
          >
            Resume Game
          </Button>
          <p className="text-xs text-gray-500 mt-1">Do you dare to resume your quest?</p>
        </div>
      );
    }
    
    if (level === GameLevel.BRIEFING_1) {
      return (
        <div className="text-center py-2">
          <h3 className="font-medium text-sky-800">Daily Challenge!</h3>
          <p className="text-sm text-sky-700 mt-1">
            Collect 3 coins by asking patients to save a card on file.
          </p>
          
          <div className="flex justify-center space-x-2 my-3">
            {[0, 1, 2].map(index => (
              <div 
                key={index}
                className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white"
              />
            ))}
          </div>
          
          <div className="space-x-2">
            <Button 
              variant="default" 
              size="sm"
              className="bg-sky-600 hover:bg-sky-700"
              onClick={acceptMission}
            >
              Mission Accepted
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-600"
              onClick={surrenderGame}
            >
              Quit Game
            </Button>
          </div>
        </div>
      );
    }
    
    if (level === GameLevel.COMPLETED_1) {
      return (
        <div className="text-center py-2">
          <h3 className="font-medium text-sky-800">Level 1 complete! Checkout speed +1.</h3>
          <p className="text-sm text-sky-700 mt-1">
            Ready to tackle <strong>Level 2</strong> and collect 5 coins?
          </p>
          
          <div className="flex justify-center space-x-2 my-3">
            {[0, 1, 2].map(index => renderCoin(index))}
          </div>
          
          <div className="space-x-2">
            <Button 
              variant="default" 
              size="sm"
              className="bg-amber-600 hover:bg-amber-700"
              onClick={acceptMission}
            >
              Mission Accepted
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-600"
              onClick={surrenderGame}
            >
              I Surrender
            </Button>
          </div>
        </div>
      );
    }
    
    if (level === GameLevel.LEVEL_1) {
      return (
        <div className="py-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sky-800">Level 1: First 3 Cards</h3>
            <button 
              onClick={surrenderGame}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Cancel Quest
            </button>
          </div>
          
          <div className="flex justify-center space-x-2 my-3">
            {[0, 1, 2].map(index => renderCoin(index))}
          </div>
          
          {/* Prompt Carousel */}
          <div className="mt-2 bg-white p-3 rounded-md border border-sky-200 text-sm relative">
            <div className="absolute -top-2 left-3 bg-sky-100 text-sky-700 px-2 py-0.5 text-xs rounded-full">
              {promptVariants[currentVariantIndex].name}
            </div>
            
            <p className="text-gray-700 mt-1 text-sm">
              <span className="font-medium block">Prompt Line:</span> 
              "{promptVariants[currentVariantIndex].prompt}"
            </p>
            
            <p className="text-gray-700 mt-2 text-sm">
              <span className="font-medium block">Benefit:</span> 
              "{promptVariants[currentVariantIndex].benefit}"
            </p>
            
            <div className="flex justify-between mt-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-sky-600"
                onClick={prevVariant}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-sky-600"
                onClick={nextVariant}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-sky-700 font-medium">
              <Clock className="h-3 w-3 inline mr-1" />
              Streak: {streak} days
            </span>
            <span className="text-xs text-sky-700 font-medium">
              {coins}/{targetCoins} coins
            </span>
          </div>
        </div>
      );
    }
    
    if (level === GameLevel.COMPLETED_2) {
      return (
        <div className="text-center py-2">
          <h3 className="font-medium text-amber-800">Level 2 complete! Checkout speed +1.</h3>
          <p className="text-sm text-amber-700 mt-1">
            Too easy... Dare to face the <strong>Final Level</strong> for 10 coins?
          </p>
          
          <div className="flex justify-center space-x-2 my-3 flex-wrap">
            {[0, 1, 2, 3, 4].map(index => renderCoin(index))}
          </div>
          
          <div className="space-x-2">
            <Button 
              variant="default" 
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
              onClick={acceptMission}
            >
              Mission Accepted
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-600"
              onClick={surrenderGame}
            >
              I Surrender
            </Button>
          </div>
        </div>
      );
    }
    
    if (level === GameLevel.LEVEL_2) {
      return (
        <div className="py-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-amber-800">Level 2: Desert Trail</h3>
            <button 
              onClick={surrenderGame}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Cancel Quest
            </button>
          </div>
          
          <div className="flex justify-center space-x-2 my-3 flex-wrap">
            {[0, 1, 2, 3, 4].map(index => renderCoin(index))}
          </div>
          
          {/* Prompt Carousel */}
          <div className="mt-2 bg-white p-3 rounded-md border border-amber-200 text-sm relative">
            <div className="absolute -top-2 left-3 bg-amber-100 text-amber-700 px-2 py-0.5 text-xs rounded-full">
              {promptVariants[currentVariantIndex].name}
            </div>
            
            <p className="text-gray-700 mt-1 text-sm">
              <span className="font-medium block">Prompt Line:</span> 
              "{promptVariants[currentVariantIndex].prompt}"
            </p>
            
            <p className="text-gray-700 mt-2 text-sm">
              <span className="font-medium block">Benefit:</span> 
              "{promptVariants[currentVariantIndex].benefit}"
            </p>
            
            <div className="flex justify-between mt-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-amber-600"
                onClick={prevVariant}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-amber-600"
                onClick={nextVariant}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-amber-700 font-medium">
              <Clock className="h-3 w-3 inline mr-1" />
              Streak: {streak} days
            </span>
            <span className="text-xs text-amber-700 font-medium">
              {coins}/{targetCoins} coins
            </span>
          </div>
        </div>
      );
    }
    
    if (level === GameLevel.LEVEL_FINAL) {
      return (
        <div className="py-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-orange-800">Final Level: Lava Challenge</h3>
            <button 
              onClick={surrenderGame}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Cancel Quest
            </button>
          </div>
          
          <div className="flex justify-center space-x-2 my-3 flex-wrap gap-y-2">
            {Array.from({ length: 10 }).map((_, index) => renderCoin(index))}
          </div>
          
          {/* Prompt Carousel */}
          <div className="mt-2 bg-white p-3 rounded-md border border-orange-200 text-sm relative">
            <div className="absolute -top-2 left-3 bg-orange-100 text-orange-700 px-2 py-0.5 text-xs rounded-full">
              {promptVariants[currentVariantIndex].name}
            </div>
            
            <p className="text-gray-700 mt-1 text-sm">
              <span className="font-medium block">Prompt Line:</span> 
              "{promptVariants[currentVariantIndex].prompt}"
            </p>
            
            <p className="text-gray-700 mt-2 text-sm">
              <span className="font-medium block">Benefit:</span> 
              "{promptVariants[currentVariantIndex].benefit}"
            </p>
            
            <div className="flex justify-between mt-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-orange-600"
                onClick={prevVariant}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-orange-600"
                onClick={nextVariant}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-orange-700 font-medium">
              <Clock className="h-3 w-3 inline mr-1" />
              Streak: {streak} days
            </span>
            <span className="text-xs text-orange-700 font-medium">
              {coins}/{targetCoins} coins
            </span>
          </div>
        </div>
      );
    }
    
    if (level === GameLevel.VICTORY) {
      return (
        <div className="text-center py-2">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="font-medium text-orange-800">Challenge conquered!</h3>
          </div>
          <p className="text-sm text-orange-700">10 coins collected</p>
          
          <div className="flex items-center justify-center mt-2">
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center">
              <Medal className="h-3 w-3 mr-1" />
              Streak: {streak} days
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="mt-3 text-gray-400 border-gray-200"
            disabled
          >
            Resume game tomorrow
          </Button>
        </div>
      );
    }
    
    // Default fallback
    return (
      <div className="text-center py-2">
        <p className="text-sm text-gray-700">Loading challenge...</p>
      </div>
    );
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
      
      {/* Card-on-File Daily Challenge Card - shown only for front office role */}
      {currentRole === 'frontOffice' && gameVisible && (
        <Card className={`border-dashed border-2 ${getLevelBackground()} hover:shadow-md transition-shadow duration-200 relative overflow-hidden`}>
          <CardContent className="p-4">
            <div className="relative">
              {renderGameContent()}
              
              {/* Celebrations */}
              {/* Regular confetti celebration */}
              {showConfetti && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <PartyPopper className="h-8 w-8 text-sky-500 animate-bounce" />
                    {/* Simulated confetti particles */}
                    <div className="absolute top-1/2 left-1/2">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`absolute w-2 h-2 rounded-full bg-${
                            ['sky', 'blue', 'indigo', 'teal', 'cyan'][i % 5]
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
              
              {/* Level 2 fireworks celebration */}
              {showFireworks && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <Sparkles className="h-12 w-12 text-amber-500 animate-pulse" />
                    {/* More elaborate fireworks effect */}
                    <div className="absolute top-1/2 left-1/2">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`absolute w-3 h-3 rounded-full bg-${
                            ['amber', 'yellow', 'orange', 'red', 'pink', 'rose'][i % 6]
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
              
              {/* Grand finale for completing all levels */}
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
                            ['yellow', 'orange', 'red', 'pink', 'purple', 'indigo', 'blue', 'cyan'][i % 8]
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
                      <h3 className="text-xl font-bold text-orange-700">Challenge Complete!</h3>
                      <p className="text-orange-600">You've saved 10 cards on file! Amazing work! 🏆</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* White flag surrender animation */}
              {showWhiteFlag && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <Flag className="h-10 w-10 text-white animate-bounce" />
                  </div>
                </div>
              )}
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