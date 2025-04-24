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
  SURRENDERED = 'SURRENDERED'
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
  const [level, setLevel] = useState(GameLevel.LEVEL_1);
  const [streak, setStreak] = useState(5); // Default streak value
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [completedCoins, setCompletedCoins] = useState(new Set([0, 1])); // 2 coins collected by default

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
        className={`${isCollected ? 'opacity-50' : 'opacity-100 cursor-pointer animate-pulse'}`}
        onClick={() => {
          if (!isCollected) {
            const newCompletedCoins = new Set(completedCoins);
            newCompletedCoins.add(index);
            setCompletedCoins(newCompletedCoins);
          }
        }}
      >
        <i className="nes-icon coin"></i>
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

  // Additional state variables for game effects
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showGrandFinale, setShowGrandFinale] = useState(false);
  const [showWhiteFlag, setShowWhiteFlag] = useState(false);
  
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
    setCompletedCoins(new Set([0, 1]));
  };
  
  // Accept mission - move to next level
  const acceptMission = () => {
    advanceLevel();
  };
  
  // Render game content based on level
  const renderGameContent = () => {
    const currentVariant = promptVariants[currentVariantIndex];
    
    switch (level) {
      case GameLevel.LEVEL_1:
        return (
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative overflow-hidden level-container">
              <h3 className="font-bold text-blue-800 text-lg mb-2">Capture the Cards</h3>
              <p className="text-blue-600 mb-4 text-base">Level 1: Mastering Card Prompts</p>
              
              <div className="flex items-end gap-6 mt-6 relative">
                {/* Character */}
                <div className="flex-none">
                  <i className={`${currentVariant.character} transform scale-150`}></i>
                </div>
                
                {/* Speech bubble with prompt */}
                <div className="ml-24 bg-white border-2 border-gray-800 rounded-xl p-3 relative before:content-[''] before:absolute before:left-[-10px] before:bottom-[20px] before:w-[0] before:h-[0] before:border-[10px] before:border-transparent before:border-r-gray-800">
                  <p className="font-bold mb-1 text-lg">{currentVariant.name}</p>
                  <p className="text-base mb-1">{currentVariant.prompt}</p>
                  <p className="text-sm text-blue-600">{currentVariant.benefit}</p>
                </div>
              </div>
              
              {/* Coins at bottom */}
              <div className="flex justify-end gap-2 mt-4">
                {[...Array(3)].map((_, index) => renderCoin(index))}
              </div>
              
              {/* Navigation controls */}
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm" onClick={prevVariant} className="border-gray-500">
                  <i className="nes-icon arrow-left is-small"></i>
                </Button>
                <Button variant="default" size="sm" onClick={acceptMission} className="bg-blue-600 hover:bg-blue-700">
                  Accept Mission
                </Button>
                <Button variant="outline" size="sm" onClick={nextVariant} className="border-gray-500">
                  <i className="nes-icon arrow-right is-small"></i>
                </Button>
              </div>
            </div>
          </div>
        );
      
      case GameLevel.LEVEL_2:
        return (
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 relative overflow-hidden level-container">
              <h3 className="font-bold text-amber-800 text-lg mb-2">Capture the Cards</h3>
              <p className="text-amber-600 mb-4 text-base">Level 2: Finding the Perfect Moment</p>
              
              <div className="flex items-end gap-6 mt-6 relative">
                {/* Different character for level 2 */}
                <div className="flex-none">
                  <i className="nes-squirtle transform scale-150"></i>
                </div>
                
                {/* Speech bubble with level 2 content */}
                <div className="ml-24 bg-white border-2 border-gray-800 rounded-xl p-3 relative before:content-[''] before:absolute before:left-[-10px] before:bottom-[20px] before:w-[0] before:h-[0] before:border-[10px] before:border-transparent before:border-r-gray-800">
                  <p className="font-bold mb-1 text-lg">Perfect Timing</p>
                  <p className="text-base mb-1">Ask when the patient is happy—right after completing treatment or getting good news.</p>
                  <p className="text-sm text-amber-600">Patients are 65% more likely to say yes when they're feeling good.</p>
                </div>
              </div>
              
              {/* Coins at bottom */}
              <div className="flex justify-end gap-2 mt-4">
                {[...Array(3)].map((_, index) => renderCoin(index + 3))}
              </div>
              
              {/* Navigation controls */}
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm" className="border-gray-500" disabled>
                  <i className="nes-icon arrow-left is-small"></i>
                </Button>
                <Button variant="default" size="sm" onClick={acceptMission} className="bg-amber-600 hover:bg-amber-700">
                  Accept Mission
                </Button>
                <Button variant="outline" size="sm" className="border-gray-500" disabled>
                  <i className="nes-icon arrow-right is-small"></i>
                </Button>
              </div>
            </div>
          </div>
        );
      
      case GameLevel.LEVEL_FINAL:
        return (
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 relative overflow-hidden level-container">
              <h3 className="font-bold text-orange-800 text-lg mb-2">Capture the Cards</h3>
              <p className="text-orange-600 mb-4 text-base">Final Level: Security Reassurance</p>
              
              <div className="flex items-end gap-6 mt-6 relative">
                {/* Character for final level */}
                <div className="flex-none">
                  <i className="nes-charmander transform scale-150"></i>
                </div>
                
                {/* Speech bubble with final level content */}
                <div className="ml-24 bg-white border-2 border-gray-800 rounded-xl p-3 relative before:content-[''] before:absolute before:left-[-10px] before:bottom-[20px] before:w-[0] before:h-[0] before:border-[10px] before:border-transparent before:border-r-gray-800">
                  <p className="font-bold mb-1 text-lg">Security First</p>
                  <p className="text-base mb-1">All card info is stored in our encrypted system. You can remove it anytime with one click.</p>
                  <p className="text-sm text-orange-600">Mentioning security increases enrollment by 40%.</p>
                </div>
              </div>
              
              {/* Coins at bottom */}
              <div className="flex justify-end gap-2 mt-4">
                {[...Array(4)].map((_, index) => renderCoin(index + 6))}
              </div>
              
              {/* Navigation controls */}
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm" className="border-gray-500" disabled>
                  <i className="nes-icon arrow-left is-small"></i>
                </Button>
                <Button variant="default" size="sm" onClick={acceptMission} className="bg-orange-600 hover:bg-orange-700">
                  Complete Mission
                </Button>
                <Button variant="outline" size="sm" className="border-gray-500" disabled>
                  <i className="nes-icon arrow-right is-small"></i>
                </Button>
              </div>
            </div>
          </div>
        );
      
      case GameLevel.VICTORY:
        return (
          <div className="text-center py-8 level-container">
            <i className="nes-icon trophy is-large"></i>
            <h2 className="font-bold text-2xl text-green-600 mt-4">MISSION COMPLETE!</h2>
            <p className="text-lg mb-6">You've conquered all levels of card capture training!</p>
            <div className="nes-container is-rounded with-title is-centered">
              <p className="title">REWARDS EARNED</p>
              <div className="flex justify-center gap-4 mb-4">
                <div className="flex items-center">
                  <i className="nes-icon coin is-small mr-2"></i>
                  <span className="font-bold">{completedCoins.size} Coins</span>
                </div>
                <div className="flex items-center">
                  <i className="nes-icon star is-small mr-2"></i>
                  <span className="font-bold">{streak} Day Streak</span>
                </div>
              </div>
              <p className="text-sm mb-4">Your practice will see increased card collection rates by {completedCoins.size * 2}%!</p>
              <Button onClick={restartGame} variant="default" className="mt-4">
                Play Again
              </Button>
            </div>
          </div>
        );
      
      case GameLevel.SURRENDERED:
        return (
          <div className="text-center py-8 level-container">
            <i className="nes-icon close is-large"></i>
            <h2 className="font-bold text-2xl text-red-600 mt-4">MISSION ABANDONED</h2>
            <p className="text-lg mb-6">You've surrendered this challenge.</p>
            <div className="nes-container is-rounded with-title is-centered">
              <p className="title">CURRENT STATUS</p>
              <div className="flex justify-center gap-4 mb-4">
                <div className="flex items-center">
                  <i className="nes-icon coin is-small mr-2"></i>
                  <span className="font-bold">{completedCoins.size} Coins</span>
                </div>
                <div className="flex items-center">
                  <i className="nes-icon star is-small mr-2"></i>
                  <span className="font-bold">{streak} Day Streak</span>
                </div>
              </div>
              <p className="text-sm mb-4">Better luck tomorrow!</p>
              <Button onClick={restartGame} variant="default" className="mt-4">
                Try Again
              </Button>
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
                
                {/* Surrender Button - Only shown during active game levels (not in briefing, intro or victory screens) */}
                {(level === GameLevel.LEVEL_1 || level === GameLevel.LEVEL_2 || level === GameLevel.LEVEL_FINAL) && 
                  level !== GameLevel.VICTORY && 
                  level !== GameLevel.BRIEFING_1 && (
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