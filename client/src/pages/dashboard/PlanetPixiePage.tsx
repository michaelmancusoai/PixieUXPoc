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

  return (
    <NavigationWrapper>
      <div className="container py-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Planet Pixie: Daily Challenge</h1>
        <p className="text-muted-foreground mb-8">Capture cards and collect coins to boost your practice efficiency!</p>

        <div className="max-w-3xl mx-auto">
          <div className="relative game-container">
            <div className={`nes-container pixelated is-rounded ${getLevelBackground()} hover:shadow-md transition-shadow duration-200 p-4 font-vt323 overflow-hidden`}>
              <div className="bg-gray-800 text-white p-1 font-press-start text-center mb-3 -mx-3 -mt-3 rounded-t">Planet Pixie: Daily Challenge</div>
              
              {/* Game Header with Office Rank and Surrender */}
              <div className="flex justify-between items-center px-1 mb-3">
                {/* Office Rank - Left */}
                <div className="bg-blue-100 rounded-md px-2 py-1">
                  <span className="text-blue-800 font-press-start text-xs">OFFICE RANK: #{gameState.level === GameLevel.LEVEL_FINAL ? "1" : "2"}</span>
                </div>
                
                {/* Surrender Button - Only shown during active game levels (not in briefing, intro or victory screens) */}
                {(gameState.level === GameLevel.LEVEL_1 || gameState.level === GameLevel.LEVEL_2 || gameState.level === GameLevel.LEVEL_FINAL) && 
                  gameState.level !== GameLevel.VICTORY && 
                  gameState.level !== GameLevel.BRIEFING_1 && (
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