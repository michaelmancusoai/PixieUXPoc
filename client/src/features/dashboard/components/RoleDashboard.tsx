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
  character?: string; // Optional character type for the different Pokemon
}

const promptVariants: PromptVariant[] = [
  {
    name: "Friendly Concierge",
    prompt: "While I'm running your card, would you like us to keep it on file for next time?",
    benefit: "It means a faster checkout—no wallet hunt.",
    character: "nes-bulbasaur"
  },
  {
    name: "Time-Saver Angle",
    prompt: "We can store this card securely so your future visits take about 30 seconds to pay—shall I do that for you?",
    benefit: "You'll still get a text before any charge.",
    character: "nes-squirtle"
  },
  {
    name: "Stress-Reducer",
    prompt: "Most patients let us keep a card on record so they never worry about bills stacking up—okay to add yours?",
    benefit: "It only runs after your insurance pays.",
    character: "nes-kirby"
  },
  {
    name: "Contactless Convenience",
    prompt: "If you prefer touch-free payments, I can tokenise this card now—want me to switch that on?",
    benefit: "It's encrypted, and you just tap 'okay' on your phone next time.",
    character: "nes-mario"
  },
  {
    name: "Membership Club Feel",
    prompt: "We offer a 'Fast-Track Checkout'—store a card once and skip the desk dash every visit. Shall I enrol you?",
    benefit: "Think express lane, but for happy smiles.",
    character: "nes-ash"
  }
];

const RoleDashboard: React.FC = () => {
  // Basic dashboard state
  const [currentRole, setCurrentRole] = useState<UserRole>('frontOffice');
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [delegatedActions, setDelegatedActions] = useState<Set<string>>(new Set());
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
  
  // Function to delegate an action to Pixie AI
  const handleDelegateAction = (id: string) => {
    // Mark the task as delegated
    setDelegatedActions((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    
    // Also mark it as completed since Pixie AI will handle it
    setCompletedActions((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    
    // Add this task to Pixie AI Agent as a win
    // (Note: In a real application, this would be handled by the backend)
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
        className={`transition-all mx-1 ${isFilled ? 'opacity-70' : 'opacity-40'} hover:opacity-100`}
        title={isFilled ? "Coin collected!" : "Collect a coin by storing a card on file"}
        onClick={handleCoinCollected}
      >
        <i className={`nes-icon coin ${isFilled ? 'is-small' : 'is-small is-transparent'}`}></i>
      </button>
    );
  };

  // Render game card content based on current state
  const renderGameContent = () => {
    const { level, coins, targetCoins, streak, surrendered } = gameState;
    
    if (surrendered) {
      return (
        <div className="text-center py-2 font-vt323">
          <div className="nes-container is-rounded is-dark pixelated">
            <p className="mb-3 mt-1 text-error">QUEST PAUSED</p>
            <div className="flex justify-center mb-3">
              <i className="nes-icon close is-medium"></i>
            </div>
            <p className="text-white mb-3">COINS BANKED: {coins}/{targetCoins}</p>
            <button 
              className="nes-btn is-primary font-press-start text-xs px-2 py-1"
              onClick={acceptMission}
            >
              RESUME QUEST
            </button>
            <p className="text-xs text-warning mt-3">DO YOU DARE CONTINUE?</p>
          </div>
        </div>
      );
    }
    
    if (level === GameLevel.BRIEFING_1) {
      return (
        <div className="text-center py-2 font-vt323">
          <h3 className="font-press-start text-xl text-sky-800 mb-2">Capture the Cards</h3>
          <p className="text-lg text-sky-700 mb-3">
            Today's Daily Challenge
          </p>
          
          <div className="flex justify-center my-3">
            {[0, 1, 2].map(index => (
              <i key={index} className="nes-icon coin is-medium is-transparent mx-1"></i>
            ))}
          </div>
          
          <div className="flex justify-center mt-4 space-x-4">
            <button 
              className="nes-btn is-primary font-press-start text-xs px-2 py-1"
              onClick={acceptMission}
            >
              ACCEPT MISSION
            </button>
          </div>
        </div>
      );
    }
    
    if (level === GameLevel.COMPLETED_1) {
      return (
        <div className="text-center py-2 font-vt323">
          <div className="nes-container is-rounded is-dark with-title">
            <p className="title font-press-start text-sm">LEVEL 1 COMPLETE!</p>
            <i className="nes-icon star is-medium mb-2"></i>
            <p className="text-md mb-3">
              CHECKOUT SPEED +1<br/>
              Ready to tackle <strong>LEVEL 2</strong> and collect 5 coins?
            </p>
            
            <div className="flex justify-center my-3">
              {[0, 1, 2].map(index => renderCoin(index))}
            </div>
            
            <div className="flex justify-center mt-4 space-x-4">
              <button 
                className="nes-btn is-warning font-press-start text-xs px-2 py-1"
                onClick={acceptMission}
              >
                CONTINUE QUEST
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (level === GameLevel.LEVEL_1) {
      return (
        <div className="py-2 font-vt323">
          <div className="nes-container is-rounded pixelated border-blue-500 bg-blue-100 overflow-hidden h-[340px]">
            <div className="bg-blue-500 text-white font-press-start text-xs text-center py-1 -mx-4 -mt-4 mb-4">LEVEL 1: SKY QUEST</div>
            

            
            {/* Nav Buttons - Left and Right Sides */}
            <div className="absolute left-2 top-1/3">
              <button 
                className="nes-btn is-primary px-2 py-0"
                onClick={prevVariant}
              >
                ◀
              </button>
            </div>
            <div className="absolute right-2 top-1/3">
              <button 
                className="nes-btn is-primary px-2 py-0"
                onClick={nextVariant}
              >
                ▶
              </button>
            </div>
            
            {/* Speech bubble at top */}
            <div className="flex-1 pr-10 mb-6">
              <div className="nes-balloon from-left mt-0 mb-0" style={{ marginLeft: '100px' }}>
                <p className="text-lg sm:text-xl font-medium leading-tight">
                  "{promptVariants[currentVariantIndex].prompt}"<br/>
                  <span className="text-blue-600 font-bold mt-1 block">{promptVariants[currentVariantIndex].benefit}</span>
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              {/* Pokemon on left */}
              <div className="flex flex-col items-center">
                <i className={promptVariants[currentVariantIndex].character || "nes-bulbasaur"}></i>
                <div className="text-xs text-center text-blue-600 font-press-start mt-1 w-32 leading-tight">
                  {promptVariants[currentVariantIndex].name}
                </div>
              </div>
              
              {/* Coins at right */}
              <div className="flex justify-end pr-2">
                {[0, 1, 2].map(index => renderCoin(index))}
              </div>
            </div>
            

          </div>
        </div>
      );
    }
    
    if (level === GameLevel.COMPLETED_2) {
      return (
        <div className="text-center py-2 font-vt323">
          <div className="nes-container is-rounded is-warning pixelated overflow-hidden">
            <div className="bg-yellow-500 font-press-start text-sm text-white py-1 -mx-4 -mt-4 mb-4">LEVEL 2 COMPLETE!</div>
            <i className="nes-icon medal is-large mb-2"></i>
            <p className="text-md mb-3">
              CHECKOUT SPEED +2<br/>
              Ready for the <strong>FINAL CHALLENGE?</strong><br />
              Collect 10 coins to win!
            </p>
            
            <div className="flex justify-center my-3 flex-wrap">
              {[0, 1, 2, 3, 4].map(index => renderCoin(index))}
            </div>
            
            <div className="flex justify-center mt-4 space-x-4">
              <button 
                className="nes-btn is-error font-press-start text-xs px-2 py-1"
                onClick={acceptMission}
              >
                FINAL QUEST
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (level === GameLevel.LEVEL_2) {
      return (
        <div className="py-2 font-vt323">
          <div className="nes-container is-rounded pixelated border-amber-500 bg-amber-100 overflow-hidden h-[340px]">
            <div className="bg-amber-500 text-white font-press-start text-xs text-center py-1 -mx-4 -mt-4 mb-4">LEVEL 2: DESERT QUEST</div>
            

            
            {/* Nav Buttons - Left and Right Sides */}
            <div className="absolute left-2 top-1/3">
              <button 
                className="nes-btn is-warning px-2 py-0"
                onClick={prevVariant}
              >
                ◀
              </button>
            </div>
            <div className="absolute right-2 top-1/3">
              <button 
                className="nes-btn is-warning px-2 py-0"
                onClick={nextVariant}
              >
                ▶
              </button>
            </div>
            
            {/* Speech bubble at top */}
            <div className="flex-1 pr-10 mb-6">
              <div className="nes-balloon from-left mt-0 mb-0" style={{ marginLeft: '100px' }}>
                <p className="text-lg sm:text-xl font-medium leading-tight">
                  "{promptVariants[currentVariantIndex].prompt}"<br/>
                  <span className="text-amber-600 font-bold mt-1 block">{promptVariants[currentVariantIndex].benefit}</span>
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              {/* Pokemon on left */}
              <div className="flex flex-col items-center">
                <i className={promptVariants[currentVariantIndex].character || "nes-charmander"}></i>
                <div className="text-xs text-center text-amber-600 font-press-start mt-1 w-32 leading-tight">
                  {promptVariants[currentVariantIndex].name}
                </div>
              </div>
              
              {/* Coins at right */}
              <div className="flex justify-end pr-2">
                {[0, 1, 2, 3, 4].map(index => renderCoin(index))}
              </div>
            </div>
            

          </div>
        </div>
      );
    }
    
    if (level === GameLevel.LEVEL_FINAL) {
      return (
        <div className="py-2 font-vt323">
          <div className="nes-container is-rounded pixelated border-orange-500 bg-orange-100 overflow-hidden h-[340px]">
            <div className="bg-orange-600 text-white font-press-start text-xs text-center py-1 -mx-4 -mt-4 mb-4">FINAL LEVEL: LAVA QUEST</div>
            

            
            {/* Nav Buttons - Left and Right Sides */}
            <div className="absolute left-2 top-1/3">
              <button 
                className="nes-btn is-error px-2 py-0"
                onClick={prevVariant}
              >
                ◀
              </button>
            </div>
            <div className="absolute right-2 top-1/3">
              <button 
                className="nes-btn is-error px-2 py-0"
                onClick={nextVariant}
              >
                ▶
              </button>
            </div>
            
            {/* Speech bubble at top */}
            <div className="flex-1 pr-10 mb-6">
              <div className="nes-balloon from-left mt-0 mb-0" style={{ marginLeft: '100px' }}>
                <p className="text-lg sm:text-xl font-medium leading-tight">
                  "{promptVariants[currentVariantIndex].prompt}"<br/>
                  <span className="text-orange-600 font-bold mt-1 block">{promptVariants[currentVariantIndex].benefit}</span>
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              {/* Pokemon on left */}
              <div className="flex flex-col items-center">
                <i className={promptVariants[currentVariantIndex].character || "nes-charizard"}></i>
                <div className="text-xs text-center text-orange-600 font-press-start mt-1 w-32 leading-tight">
                  {promptVariants[currentVariantIndex].name}
                </div>
              </div>
              
              {/* Coins at right */}
              <div className="flex justify-end pr-2 flex-wrap gap-y-2">
                {Array.from({ length: 10 }).map((_, index) => renderCoin(index))}
              </div>
            </div>
            

          </div>
        </div>
      );
    }
    
    if (level === GameLevel.VICTORY) {
      return (
        <div className="text-center py-2 font-vt323">
          <div className="nes-container is-rounded is-dark pixelated overflow-hidden">
            <div className="font-press-start text-sm text-white bg-black py-1 -mx-4 -mt-4 mb-4">VICTORY!</div>
            <i className="nes-icon trophy is-large mb-3"></i>
            <p className="text-xl text-success mb-2">CHALLENGE CONQUERED!</p>
            <p className="text-md text-warning mb-3">10 COINS COLLECTED</p>
            
            <div className="mt-3 inline-block bg-black px-4 py-1 rounded">
              <p className="text-sm text-white flex items-center">
                <i className="nes-icon star is-small mr-2"></i>
                STREAK: {streak} DAYS
              </p>
            </div>
            
            <div className="mt-4">
              <button 
                className="nes-btn is-disabled font-press-start text-xs"
                disabled
              >
                NEW QUEST TOMORROW
              </button>
            </div>
            
            <p className="mt-4 text-xs text-success">CHECKOUT SPEED MAXIMIZED!</p>
          </div>
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
                    <div className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                      <Activity className="h-3 w-3 mr-1" />
                      <span className="inline-block leading-tight">4-day streak of 95% confirmations – keep it alive!</span>
                    </div>
                  )}
                </h2>
                <p className="text-gray-600">{dashboardData.greetingDetails}</p>
                
                {/* Coaching tip has been removed */}
                
                {/* AI Overnight Wins notification has been removed */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Planet Pixie game has been moved to its own dedicated page */}

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
          {/* Today's Action Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className={`text-${roleConfig.accentColor}-600`}>
                Today's Action Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* High Priority Group */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">High Priority</h3>
                <div className="space-y-4">
                  {dashboardData.actionItems
                    .filter(item => item.priority === 1)
                    .map((item) => (
                      <ActionItem
                        key={item.id}
                        item={{
                          ...item,
                          completed: completedActions.has(item.id),
                          delegated: delegatedActions.has(item.id),
                        }}
                        accentColor={roleConfig.accentColor}
                        onComplete={handleActionComplete}
                        onDelegate={handleDelegateAction}
                      />
                    ))}
                </div>
                {dashboardData.actionItems.filter(item => item.priority === 1).length === 0 && (
                  <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-md text-center">
                    No high priority items at the moment
                  </div>
                )}
              </div>
              
              {/* What's Next Group */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">What's Next</h3>
                <div className="space-y-4">
                  {dashboardData.actionItems
                    .filter(item => item.priority !== 1)
                    .map((item) => (
                      <ActionItem
                        key={item.id}
                        item={{
                          ...item,
                          completed: completedActions.has(item.id),
                          delegated: delegatedActions.has(item.id),
                        }}
                        accentColor={roleConfig.accentColor}
                        onComplete={handleActionComplete}
                        onDelegate={handleDelegateAction}
                      />
                    ))}
                </div>
                {dashboardData.actionItems.filter(item => item.priority !== 1).length === 0 && (
                  <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-md text-center">
                    No upcoming items at the moment
                  </div>
                )}
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

          {/* Live Patient Flow - Mission Control Style */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className={`text-${roleConfig.accentColor}-600`}>
                {currentRole === 'frontOffice' ? 'Live Patient Flow' : 'Patient Flow'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Real-time view of patient movement through the practice
              </p>
            </CardHeader>
            <CardContent className="pt-0 px-2">
              <FlowRadar 
                categories={dashboardData.flowCategories}
                accentColor={roleConfig.accentColor}
              />
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Click any column to jump to those patients in Mission Control
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