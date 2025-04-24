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
        className={`transition-all mx-1 ${isFilled ? '' : 'opacity-60'}`}
        title={isFilled ? "Coin collected!" : "Collect a coin by storing a card on file"}
        onClick={handleCoinCollected}
      >
        <i className={`nes-icon coin ${isFilled ? 'is-medium' : 'is-medium is-transparent'}`}></i>
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
              MISSION ACCEPTED
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
          <div className="nes-container is-rounded pixelated border-blue-500 bg-blue-100 overflow-hidden">
            <div className="bg-blue-500 text-white font-press-start text-xs text-center py-1 -mx-4 -mt-4 mb-4">LEVEL 1: SKY QUEST</div>
            
            {/* Coin Counter */}
            <div className="absolute top-2 left-2">
              <i className="nes-icon coin is-small"></i> <span className="text-blue-800 font-bold">{coins}/{targetCoins}</span>
            </div>
            
            {/* Nav Buttons - Right Side */}
            <div className="absolute right-2 top-1/3 flex flex-col space-y-2">
              <button 
                className="nes-btn is-primary px-2 py-0"
                onClick={prevVariant}
              >
                ◀
              </button>
              <button 
                className="nes-btn is-primary px-2 py-0"
                onClick={nextVariant}
              >
                ▶
              </button>
            </div>
            
            {/* Main Content */}
            <div className="mt-16 flex items-start">
              {/* Pokemon on left */}
              <div className="flex flex-col items-center mr-2 mt-12">
                <i className={promptVariants[currentVariantIndex].character || "nes-bulbasaur"}></i>
                <div className="text-xs text-center text-blue-600 font-press-start mt-1 w-24 leading-tight">
                  {promptVariants[currentVariantIndex].name}
                </div>
              </div>
              
              {/* Speech bubble next to pokemon */}
              <div className="flex-1">
                <div className="nes-balloon from-left mt-0">
                  <p className="text-sm sm:text-base font-medium">
                    "{promptVariants[currentVariantIndex].prompt}"<br/><br/>
                    <span className="text-blue-600 font-bold">Benefit: </span>
                    "{promptVariants[currentVariantIndex].benefit}"
                  </p>
                </div>
              </div>
            </div>
            
            {/* Coins at bottom */}
            <div className="flex justify-center my-3 mt-6">
              {[0, 1, 2].map(index => renderCoin(index))}
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
          <div className="nes-container is-rounded pixelated border-amber-500 bg-amber-100 overflow-hidden">
            <div className="bg-amber-500 text-white font-press-start text-xs text-center py-1 -mx-4 -mt-4 mb-4">LEVEL 2: DESERT QUEST</div>
            
            {/* Coin Counter */}
            <div className="absolute top-2 left-2">
              <i className="nes-icon coin is-small"></i> <span className="text-amber-800 font-bold">{coins}/{targetCoins}</span>
            </div>
            
            {/* Nav Buttons - Right Side */}
            <div className="absolute right-2 top-1/3 flex flex-col space-y-2">
              <button 
                className="nes-btn is-warning px-2 py-0"
                onClick={prevVariant}
              >
                ◀
              </button>
              <button 
                className="nes-btn is-warning px-2 py-0"
                onClick={nextVariant}
              >
                ▶
              </button>
            </div>
            
            {/* Main Content */}
            <div className="mt-16 flex items-start">
              {/* Pokemon on left */}
              <div className="flex flex-col items-center mr-2 mt-12">
                <i className={promptVariants[currentVariantIndex].character || "nes-charmander"}></i>
                <div className="text-xs text-center text-amber-600 font-press-start mt-1 w-24 leading-tight">
                  {promptVariants[currentVariantIndex].name}
                </div>
              </div>
              
              {/* Speech bubble next to pokemon */}
              <div className="flex-1">
                <div className="nes-balloon from-left mt-0">
                  <p className="text-sm sm:text-base font-medium">
                    "{promptVariants[currentVariantIndex].prompt}"<br/><br/>
                    <span className="text-amber-600 font-bold">Benefit: </span>
                    "{promptVariants[currentVariantIndex].benefit}"
                  </p>
                </div>
              </div>
            </div>
            
            {/* Coins at bottom */}
            <div className="flex justify-center my-3 mt-6">
              {[0, 1, 2, 3, 4].map(index => renderCoin(index))}
            </div>
            

          </div>
        </div>
      );
    }
    
    if (level === GameLevel.LEVEL_FINAL) {
      return (
        <div className="py-2 font-vt323">
          <div className="nes-container is-rounded pixelated border-orange-500 bg-orange-100 overflow-hidden">
            <div className="bg-orange-600 text-white font-press-start text-xs text-center py-1 -mx-4 -mt-4 mb-4">FINAL LEVEL: LAVA QUEST</div>
            
            {/* Coin Counter */}
            <div className="absolute top-2 left-2">
              <i className="nes-icon coin is-small"></i> <span className="text-orange-800 font-bold">{coins}/{targetCoins}</span>
            </div>
            
            {/* Nav Buttons - Right Side */}
            <div className="absolute right-2 top-1/3 flex flex-col space-y-2">
              <button 
                className="nes-btn is-error px-2 py-0"
                onClick={prevVariant}
              >
                ◀
              </button>
              <button 
                className="nes-btn is-error px-2 py-0"
                onClick={nextVariant}
              >
                ▶
              </button>
            </div>
            
            {/* Main Content */}
            <div className="mt-16 flex items-start">
              {/* Pokemon on left */}
              <div className="flex flex-col items-center mr-2 mt-12">
                <i className={promptVariants[currentVariantIndex].character || "nes-charizard"}></i>
                <div className="text-xs text-center text-orange-600 font-press-start mt-1 w-24 leading-tight">
                  {promptVariants[currentVariantIndex].name}
                </div>
              </div>
              
              {/* Speech bubble next to pokemon */}
              <div className="flex-1">
                <div className="nes-balloon from-left mt-0">
                  <p className="text-sm sm:text-base font-medium">
                    "{promptVariants[currentVariantIndex].prompt}"<br/><br/>
                    <span className="text-orange-600 font-bold">Benefit: </span>
                    "{promptVariants[currentVariantIndex].benefit}"
                  </p>
                </div>
              </div>
            </div>
            
            {/* Coins at bottom */}
            <div className="flex justify-center my-3 mt-6 flex-wrap gap-y-2">
              {Array.from({ length: 10 }).map((_, index) => renderCoin(index))}
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
        <div className="relative game-container">
          <div className={`nes-container pixelated is-rounded ${getLevelBackground()} hover:shadow-md transition-shadow duration-200 p-4 font-vt323 overflow-hidden`}>
            <div className="bg-gray-800 text-white p-1 font-press-start text-center mb-3 -mx-3 -mt-3 rounded-t">Planet Pixie: Daily Challenge</div>
            
            {/* Game Header with Office Rank and Surrender */}
            <div className="flex justify-between items-center px-1 mb-3">
              {/* Office Rank - Left */}
              <div className="bg-blue-100 rounded-md px-2 py-1">
                <span className="text-blue-800 font-press-start text-xs">OFFICE RANK: #{gameState.level === GameLevel.LEVEL_FINAL ? "1" : "2"}</span>
              </div>
              
              {/* Surrender Button - Right */}
              <button 
                onClick={surrenderGame}
                className="nes-btn is-error is-small px-2 py-0 text-[10px] font-press-start"
              >
                SURRENDER
              </button>
            </div>
            
            <div className="relative mb-4">
              {renderGameContent()}
              
              {/* Celebrations */}
              {/* Regular confetti celebration */}
              {showConfetti && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <i className="nes-icon coin is-large animate-bounce"></i>
                    {/* Simulated confetti particles */}
                    <div className="absolute top-1/2 left-1/2">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                          key={i}
                          className="absolute w-2 h-2 pixelated rounded-none animate-ping"
                          style={{ 
                            top: `${Math.random() * 100 - 50}px`, 
                            left: `${Math.random() * 100 - 50}px`,
                            backgroundColor: ['#5E9CEA', '#FFCD4D', '#78E067', '#FF6868', '#9C8AFF'][i % 5],
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
                    <i className="nes-icon star is-large animate-pulse"></i>
                    {/* More elaborate fireworks effect */}
                    <div className="absolute top-1/2 left-1/2">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div 
                          key={i}
                          className="absolute w-3 h-3 pixelated rounded-none animate-ping"
                          style={{ 
                            top: `${Math.random() * 200 - 100}px`, 
                            left: `${Math.random() * 200 - 100}px`,
                            backgroundColor: ['#FFB627', '#FFF054', '#FF8A54', '#FF6B6B', '#FF54A4', '#FF7EB9'][i % 6],
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
                    <i className="nes-icon trophy is-large animate-bounce"></i>
                    {/* Huge celebration effect */}
                    <div className="absolute top-1/2 left-1/2">
                      {Array.from({ length: 100 }).map((_, i) => (
                        <div 
                          key={i}
                          className="absolute w-4 h-4 pixelated rounded-none animate-ping"
                          style={{ 
                            top: `${Math.random() * 400 - 200}px`, 
                            left: `${Math.random() * 400 - 200}px`,
                            backgroundColor: ['#FFD700', '#FF8C00', '#FF0000', '#FF69B4', '#8A2BE2', '#4169E1', '#1E90FF', '#00FFFF'][i % 8],
                            animationDuration: `${0.2 + Math.random() * 2}s`,
                            animationDelay: `${Math.random() * 0.8}s`
                          }}
                        />
                      ))}
                    </div>
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 nes-container is-dark with-title p-3 text-center pixelated">
                      <p className="title">VICTORY!</p>
                      <p className="nes-text is-success">10 COINS COLLECTED!</p>
                      <i className="nes-icon is-large heart"></i>
                    </div>
                  </div>
                </div>
              )}
              
              {/* White flag surrender animation */}
              {showWhiteFlag && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <i className="nes-icon close is-large animate-bounce"></i>
                  </div>
                </div>
              )}
            </div>
            
            {/* Status bar at bottom of main container */}
            {(gameState.level === GameLevel.LEVEL_1 || gameState.level === GameLevel.LEVEL_2 || gameState.level === GameLevel.LEVEL_FINAL) && (
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-700 font-bold">
                  <i className="nes-icon star is-small"></i>
                  STREAK: {gameState.streak} DAYS
                </div>
                <div className="text-xs text-gray-700 font-bold">
                  <i className="nes-icon heart is-small"></i>
                </div>
              </div>
            )}
          </div>
        </div>
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