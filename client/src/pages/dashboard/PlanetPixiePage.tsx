import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

// Copy the GameLevel enum from RoleDashboard.tsx
enum GameLevel {
  INTRO = 'INTRO',
  BRIEFING_1 = 'BRIEFING_1',
  LEVEL_1 = 'LEVEL_1',
  COMPLETED_1 = 'COMPLETED_1',
  BRIEFING_2 = 'BRIEFING_2',
  LEVEL_2 = 'LEVEL_2',
  COMPLETED_2 = 'COMPLETED_2',
  BRIEFING_FINAL = 'BRIEFING_FINAL',
  LEVEL_FINAL = 'LEVEL_FINAL',
  VICTORY = 'VICTORY',
  SURRENDERED = 'SURRENDERED',
  LEVEL_1_COMPLETE = 'LEVEL_1_COMPLETE',
  LEVEL_2_COMPLETE = 'LEVEL_2_COMPLETE',
  FINAL_LEVEL_COMPLETE = 'FINAL_LEVEL_COMPLETE'
}

// Sample prompt variants for our game
const promptVariants = [
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
    character: "nes-charmander"
  },
  {
    name: "Future Convenience",
    prompt: "Would you like me to securely save this card for easier payment next time you visit?",
    benefit: "You can always update it anytime.",
    character: "nes-squirtle"
  }
];

const PlanetPixiePage = () => {
  // State for our game
  const [level, setLevel] = useState<GameLevel>(GameLevel.INTRO); // Start with intro screen
  const [streak, setStreak] = useState(5); // Default streak value
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [completedCoins, setCompletedCoins] = useState<Set<number>>(new Set([])); // Start with no coins collected

  // Functions for game control
  const nextVariant = () => {
    setCurrentVariantIndex((prev) => (prev + 1) % promptVariants.length);
  };

  const prevVariant = () => {
    setCurrentVariantIndex((prev) => (prev - 1 + promptVariants.length) % promptVariants.length);
  };

  const renderCoin = (index: number) => {
    const isCollected = completedCoins.has(index);
    return (
      <div 
        key={index} 
        className={`relative ${isCollected ? 'cursor-default' : 'cursor-pointer animate-pulse'}`}
        onClick={() => {
          if (!isCollected) {
            const newCompletedCoins = new Set(completedCoins);
            newCompletedCoins.add(index);
            setCompletedCoins(newCompletedCoins);
            
            // Check if all coins are collected to show level complete screen
            if (level === GameLevel.LEVEL_1 && newCompletedCoins.size >= 3) {
              // Show level complete celebration
              setLevel(GameLevel.LEVEL_1_COMPLETE);
            } else if (level === GameLevel.LEVEL_2 && newCompletedCoins.size >= 5) {
              setLevel(GameLevel.LEVEL_2_COMPLETE);
            } else if (level === GameLevel.LEVEL_FINAL && newCompletedCoins.size >= 10) {
              setLevel(GameLevel.FINAL_LEVEL_COMPLETE);
            }
          }
        }}
      >
        <i className="nes-icon coin"></i>
        {isCollected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
            <i className="nes-icon is-small star"></i>
          </div>
        )}
      </div>
    );
  };

  // Function to get background color based on level
  const getLevelBackground = () => {
    switch (level) {
      case GameLevel.LEVEL_1:
        return "border-blue-500 bg-blue-100";
      case GameLevel.LEVEL_2:
        return "border-amber-500 bg-amber-100";
      case GameLevel.LEVEL_FINAL:
        return "border-orange-500 bg-orange-100";
      case GameLevel.VICTORY:
        return "is-dark";
      default:
        return "border-blue-500 bg-blue-100";
    }
  };

  // Additional state variables for game effects and UI
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);
  const [showWhiteFlag, setShowWhiteFlag] = useState(false);
  const [levelCompleteMessage, setLevelCompleteMessage] = useState<string | null>(null);
  
  // Function to advance to next level
  const advanceLevel = () => {
    if (level === GameLevel.LEVEL_1) {
      setLevel(GameLevel.LEVEL_2);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (level === GameLevel.LEVEL_2) {
      setLevel(GameLevel.LEVEL_FINAL);
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 3000);
    } else if (level === GameLevel.LEVEL_FINAL) {
      setLevel(GameLevel.VICTORY);
      setShowGrandFinale(true);
      setStreak(streak + 1);
    }
  };
  
  // Function to surrender the game
  const surrenderGame = () => {
    setShowWhiteFlag(true);
    setTimeout(() => {
      setShowWhiteFlag(false);
      setLevel(GameLevel.SURRENDERED);
    }, 2000);
  };
  
  // Function to restart the game
  const restartGame = () => {
    setLevel(GameLevel.LEVEL_1);
    setCompletedCoins(new Set<number>([0, 1]));
  };
  
  // Accept mission - move to next level
  const acceptMission = () => {
    if (level === GameLevel.LEVEL_1_COMPLETE) {
      setLevel(GameLevel.LEVEL_2);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (level === GameLevel.LEVEL_2_COMPLETE) {
      setLevel(GameLevel.LEVEL_FINAL);
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 3000);
    } else if (level === GameLevel.FINAL_LEVEL_COMPLETE) {
      setLevel(GameLevel.VICTORY);
      setShowGrandFinale(true);
      setStreak(streak + 1);
    } else {
      advanceLevel();
    }
  };
  
  // Render game content based on level
  const renderGameContent = () => {
    const currentVariant = promptVariants[currentVariantIndex];
    
    switch (level) {
      case GameLevel.INTRO:
        return (
          <div className="py-2 font-vt323">
            <div className="nes-container is-rounded pixelated border-blue-500 bg-blue-100 min-h-[350px] relative flex flex-col items-center justify-center">
              <div className="bg-blue-500 text-white font-press-start text-xs text-center py-1 -mx-4 -mt-4 mb-4">PLANET PIXIE</div>
              <i className="nes-octocat animate-pulse mb-4"></i>
              <h1 className="text-2xl font-press-start mb-3 text-center">Daily Challenge</h1>
              <p className="text-center mb-6 max-w-md">Collect coins by completing these small activities. Build your streak and unlock special abilities!</p>
              
              <div className="mt-3 inline-block bg-blue-100 px-4 py-2 rounded-lg border border-blue-500">
                <p className="flex items-center text-blue-800">
                  <i className="nes-icon star is-small mr-2"></i>
                  Current Streak: {streak} days
                </p>
              </div>
              
              <button 
                className="nes-btn is-primary font-press-start text-xs px-4 py-1 mt-6"
                onClick={() => setLevel(GameLevel.LEVEL_1)}
              >
                START TODAY'S CHALLENGE
              </button>
            </div>
          </div>
        );
      
      case GameLevel.LEVEL_1:
        return (
          <div className="py-2 font-vt323">
            <div className="nes-container is-rounded pixelated border-blue-500 bg-blue-100 overflow-hidden min-h-[350px]">
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
                    "{currentVariant.prompt}"<br/>
                    <span className="text-blue-600 font-bold mt-1 block">{currentVariant.benefit}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                {/* Character on left */}
                <div className="flex flex-col items-center">
                  <i className={currentVariant.character || "nes-bulbasaur"}></i>
                  <div className="text-xs text-center text-blue-600 font-press-start mt-1 w-32 leading-tight">
                    {currentVariant.name}
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
      
      case GameLevel.LEVEL_2:
        return (
          <div className="py-2 font-vt323">
            <div className="nes-container is-rounded pixelated border-amber-500 bg-amber-100 overflow-hidden min-h-[350px]">
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
                    "{currentVariant.prompt}"<br/>
                    <span className="text-amber-600 font-bold mt-1 block">{currentVariant.benefit}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                {/* Character on left */}
                <div className="flex flex-col items-center">
                  <i className={currentVariant.character || "nes-charmander"}></i>
                  <div className="text-xs text-center text-amber-600 font-press-start mt-1 w-32 leading-tight">
                    {currentVariant.name}
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
      
      case GameLevel.LEVEL_FINAL:
        return (
          <div className="py-2 font-vt323">
            <div className="nes-container is-rounded pixelated border-orange-500 bg-orange-100 overflow-hidden min-h-[350px]">
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
                    "{currentVariant.prompt}"<br/>
                    <span className="text-orange-600 font-bold mt-1 block">{currentVariant.benefit}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                {/* Character on left */}
                <div className="flex flex-col items-center">
                  <i className={currentVariant.character || "nes-charizard"}></i>
                  <div className="text-xs text-center text-orange-600 font-press-start mt-1 w-32 leading-tight">
                    {currentVariant.name}
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
      
      case GameLevel.VICTORY:
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
      
      case GameLevel.LEVEL_1_COMPLETE:
        return (
          <div className="text-center py-2 font-vt323">
            <div className="nes-container is-rounded pixelated border-blue-500 bg-blue-100 overflow-hidden min-h-[350px] relative flex flex-col items-center justify-center">
              <div className="bg-blue-500 text-white font-press-start text-xs text-center py-1 -mx-4 -mt-4 mb-4">LEVEL 1 COMPLETE!</div>
              <i className="nes-icon trophy is-large mb-4 animate-pulse"></i>
              <p className="text-xl font-bold mb-3">Congratulations, Brave Explorer!</p>
              <p className="mb-4 text-blue-600 font-bold">You've collected all 3 coins!</p>
              
              <div className="flex items-center justify-center mb-4">
                <div className="flex">
                  {[0, 1, 2].map(index => (
                    <div key={index} className="relative mx-1">
                      <i className="nes-icon coin"></i>
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
                        <i className="nes-icon is-small star"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-md mb-6 max-w-md text-center">Are you brave enough to face the challenges of Level 2?</p>
              
              <div className="flex gap-4">
                <button 
                  className="nes-btn is-primary font-press-start text-xs"
                  onClick={acceptMission}
                >
                  ACCEPT
                </button>
                <button 
                  className="nes-btn is-error font-press-start text-xs"
                  onClick={surrenderGame}
                >
                  SURRENDER
                </button>
              </div>
            </div>
          </div>
        );
        
      case GameLevel.LEVEL_2_COMPLETE:
        return (
          <div className="text-center py-2 font-vt323">
            <div className="nes-container is-rounded pixelated border-amber-500 bg-amber-100 overflow-hidden min-h-[350px] relative flex flex-col items-center justify-center">
              <div className="bg-amber-500 text-white font-press-start text-xs text-center py-1 -mx-4 -mt-4 mb-4">LEVEL 2 COMPLETE!</div>
              <i className="nes-icon trophy is-large mb-4 animate-pulse"></i>
              <p className="text-xl font-bold mb-3">Outstanding Achievement!</p>
              <p className="mb-4 text-amber-600 font-bold">You've collected all 5 coins!</p>
              
              <div className="flex items-center justify-center mb-4">
                <div className="flex flex-wrap justify-center" style={{ maxWidth: '180px' }}>
                  {[0, 1, 2, 3, 4].map(index => (
                    <div key={index} className="relative mx-1 mb-2">
                      <i className="nes-icon coin"></i>
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
                        <i className="nes-icon is-small star"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-md mb-6 max-w-md text-center">The final challenge awaits! Do you dare to continue?</p>
              
              <div className="flex gap-4">
                <button 
                  className="nes-btn is-warning font-press-start text-xs"
                  onClick={acceptMission}
                >
                  ACCEPT
                </button>
                <button 
                  className="nes-btn is-error font-press-start text-xs"
                  onClick={surrenderGame}
                >
                  SURRENDER
                </button>
              </div>
            </div>
          </div>
        );
        
      case GameLevel.FINAL_LEVEL_COMPLETE:
        return (
          <div className="text-center py-2 font-vt323">
            <div className="nes-container is-rounded pixelated border-orange-500 bg-orange-100 overflow-hidden min-h-[350px] relative flex flex-col items-center justify-center">
              <div className="bg-orange-600 text-white font-press-start text-xs text-center py-1 -mx-4 -mt-4 mb-4">FINAL LEVEL COMPLETE!</div>
              <i className="nes-icon trophy is-large mb-4 animate-pulse"></i>
              <p className="text-xl font-bold mb-3">LEGENDARY VICTORY!</p>
              <p className="mb-4 text-orange-600 font-bold">You've collected all 10 coins!</p>
              
              <div className="flex items-center justify-center mb-4">
                <div className="flex flex-wrap justify-center" style={{ maxWidth: '200px' }}>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="relative mx-1 mb-2">
                      <i className="nes-icon coin"></i>
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
                        <i className="nes-icon is-small star"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-md mb-6 max-w-md text-center">Claim your reward and receive eternal glory!</p>
              
              <div className="flex gap-4">
                <button 
                  className="nes-btn is-success font-press-start text-xs"
                  onClick={acceptMission}
                >
                  CLAIM VICTORY
                </button>
              </div>
            </div>
          </div>
        );
        
      case GameLevel.SURRENDERED:
        return (
          <div className="text-center py-2 font-vt323">
            <div className="nes-container is-rounded is-dark pixelated">
              <p className="mb-3 mt-1 text-error">QUEST PAUSED</p>
              <div className="flex justify-center mb-3">
                <i className="nes-icon close is-medium"></i>
              </div>
              <p className="text-white mb-3">COINS BANKED: {completedCoins.size}/{10}</p>
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
      
      default:
        return (
          <div className="text-center py-8">
            <p>Loading challenge...</p>
          </div>
        );
    }
  };
  
  return (
    <NavigationWrapper>
      <div className="container py-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Planet Pixie: Daily Challenge</h1>
        <p className="text-muted-foreground mb-8">Capture cards and collect coins to boost your practice efficiency!</p>

        <div className="game-container">
          <div className="relative">
            <div className={`nes-container pixelated is-rounded ${getLevelBackground()} hover:shadow-md transition-shadow duration-200 p-4 font-vt323 overflow-hidden`}>
              <div className="bg-gray-800 text-white p-1 font-press-start text-center mb-3 -mx-3 -mt-3 rounded-t">Planet Pixie: Daily Challenge</div>
              
              {/* Game Header with Office Rank and Surrender */}
              <div className="flex justify-between items-center px-1 mb-3">
                {/* Office Rank - Left */}
                <div className="bg-blue-100 rounded-md px-2 py-1">
                  <span className="text-blue-800 font-press-start text-xs">OFFICE RANK: #{level === GameLevel.LEVEL_FINAL ? "1" : "2"}</span>
                </div>
                
                {/* Surrender Button - Only shown during active game levels (not in intro, victory or surrendered screens) */}
                {(level === GameLevel.LEVEL_1 || level === GameLevel.LEVEL_2 || level === GameLevel.LEVEL_FINAL) && (
                  <button 
                    onClick={surrenderGame}
                    className="nes-btn is-error is-small px-2 py-0 text-[10px] font-press-start"
                  >
                    SURRENDER
                  </button>
                )}
              </div>
              
              <div className="relative mb-4">
                {renderGameContent()}
                
                {/* Level Complete Dialog */}
                {levelCompleteMessage && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                    <div className="nes-container is-rounded is-dark pixelated max-w-md mx-auto p-4 font-press-start text-center">
                      <p className="text-warning text-xl mb-4">{levelCompleteMessage}</p>
                      <i className="nes-icon trophy is-large animate-pulse"></i>
                    </div>
                  </div>
                )}
                
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
              {(level === GameLevel.LEVEL_1 || level === GameLevel.LEVEL_2 || level === GameLevel.LEVEL_FINAL) && (
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-700 font-bold">
                    <i className="nes-icon star is-small"></i>
                    STREAK: {streak} DAYS
                  </div>
                  <div className="text-xs text-gray-700 font-bold">
                    <i className="nes-icon heart is-small"></i>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Daily Leaderboard */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <i className="nes-icon trophy is-small mr-2"></i> Daily Leaderboard
            </h2>
            <div className="nes-container is-rounded pixelated">
              <div className="nes-table-responsive">
                <table className="nes-table is-bordered is-centered">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Staff</th>
                      <th>Streak</th>
                      <th>Coins</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Jessica (You)</td>
                      <td>{streak} days</td>
                      <td>{completedCoins.size}</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Alex</td>
                      <td>5 days</td>
                      <td>8</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Taylor</td>
                      <td>3 days</td>
                      <td>7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Game Instructions */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">How to Play</h2>
            <div className="nes-container is-rounded is-dark pixelated">
              <p className="mb-3">
                <i className="nes-icon star is-small mr-2"></i>
                Complete daily challenges to earn coins and increase your streak
              </p>
              <p className="mb-3">
                <i className="nes-icon coin is-small mr-2"></i>
                Each coin you collect boosts chair turnover speed by 2%
              </p>
              <p className="mb-3">
                <i className="nes-icon trophy is-small mr-2"></i>
                Complete all 3 levels to earn a special bonus for your practice
              </p>
              <p>
                <i className="nes-icon heart is-small mr-2"></i>
                Keep your streak alive for practice-wide rewards
              </p>
            </div>
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
};

export default PlanetPixiePage;