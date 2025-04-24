import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Footprints, 
  ArrowRight, 
  Check
} from 'lucide-react';

// Simplified version of the perio chart for the exam mode step
const PerioChartingStep = () => {
  // Voice recognition state
  const [voiceActive, setVoiceActive] = useState(false);
  
  // Foot pedal state
  const [footPedalActive, setFootPedalActive] = useState(false);
  
  // Current tooth being examined
  const [currentTooth, setCurrentTooth] = useState(3);
  
  // Current position being examined
  const [currentPosition, setCurrentPosition] = useState<string>('MB');
  
  // Perio data state - structure: { toothNumber: { position: depth } }
  const [perioData, setPerioData] = useState<Record<number, Record<string, { depth: number | null, bleeding: boolean }>>>({});
  
  // Initialize perioData
  useEffect(() => {
    const positions = ['MB', 'B', 'DB', 'ML', 'L', 'DL'];
    const initialData: Record<number, Record<string, { depth: number | null, bleeding: boolean }>> = {};
    
    // Initialize data for just a few teeth to demonstrate
    [3, 4, 5, 12, 13, 14].forEach(toothNumber => {
      initialData[toothNumber] = {};
      positions.forEach(pos => {
        initialData[toothNumber][pos] = { depth: null, bleeding: false };
      });
    });
    
    setPerioData(initialData);
  }, []);
  
  // Completion status
  const [chartCompleted, setChartCompleted] = useState(false);
  
  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    setVoiceActive(!voiceActive);
  };
  
  // Toggle foot pedal
  const toggleFootPedal = () => {
    setFootPedalActive(!footPedalActive);
  };
  
  // Set the depth value for the current tooth and position
  const setDepthValue = (depth: number) => {
    setPerioData(prev => ({
      ...prev,
      [currentTooth]: {
        ...prev[currentTooth],
        [currentPosition]: {
          ...prev[currentTooth][currentPosition],
          depth
        }
      }
    }));
    
    // Automatically move to next position after entry
    moveToNextPosition();
  };
  
  // Toggle bleeding for the current tooth and position
  const toggleBleeding = () => {
    setPerioData(prev => ({
      ...prev,
      [currentTooth]: {
        ...prev[currentTooth],
        [currentPosition]: {
          ...prev[currentTooth][currentPosition],
          bleeding: !prev[currentTooth][currentPosition].bleeding
        }
      }
    }));
  };
  
  // Move to the next position
  const moveToNextPosition = () => {
    const positions = ['MB', 'B', 'DB', 'ML', 'L', 'DL'];
    const currentIndex = positions.indexOf(currentPosition);
    
    if (currentIndex < positions.length - 1) {
      // Move to next position on same tooth
      setCurrentPosition(positions[currentIndex + 1]);
    } else {
      // Move to first position on next tooth
      const nextTooth = getNextTooth();
      setCurrentTooth(nextTooth);
      setCurrentPosition(positions[0]);
      
      // If we've gone through all teeth, mark as completed
      if (nextTooth === 3) {
        setChartCompleted(true);
      }
    }
  };
  
  // Get the next tooth to probe
  const getNextTooth = () => {
    // For simplicity, we'll just cycle through a few teeth
    const teeth = [3, 4, 5, 12, 13, 14];
    const currentIndex = teeth.indexOf(currentTooth);
    
    return teeth[(currentIndex + 1) % teeth.length];
  };
  
  // Get pocket depth color
  const getPocketDepthColor = (depth: number | null): string => {
    if (depth === null) return 'bg-gray-100 text-gray-500';
    if (depth <= 3) return 'bg-green-100 text-green-800';
    if (depth <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    let total = 0;
    let filled = 0;
    
    Object.keys(perioData).forEach(toothNum => {
      const tooth = perioData[parseInt(toothNum)];
      Object.keys(tooth).forEach(pos => {
        total++;
        if (tooth[pos].depth !== null) filled++;
      });
    });
    
    return Math.round((filled / total) * 100);
  };
  
  // Calculate summary stats
  const calculateStats = () => {
    let healthySites = 0;
    let moderateSites = 0;
    let severeSites = 0;
    let bleedingSites = 0;
    let recordedSites = 0;
    
    Object.keys(perioData).forEach(toothNum => {
      const tooth = perioData[parseInt(toothNum)];
      Object.keys(tooth).forEach(pos => {
        const site = tooth[pos];
        if (site.depth !== null) {
          recordedSites++;
          if (site.depth <= 3) healthySites++;
          else if (site.depth <= 5) moderateSites++;
          else severeSites++;
          
          if (site.bleeding) bleedingSites++;
        }
      });
    });
    
    return {
      healthySites,
      moderateSites,
      severeSites,
      bleedingSites,
      bleedingPercentage: recordedSites > 0 ? Math.round((bleedingSites / recordedSites) * 100) : 0
    };
  };
  
  const completionPercentage = calculateCompletion();
  const stats = calculateStats();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Periodontal Charting</h3>
      <p className="text-sm text-gray-600">
        Record pocket depths and bleeding on probing for each tooth.
      </p>
      
      {/* Progress indicator */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-700">
          Completion: {completionPercentage}%
        </div>
        <div className="bg-gray-200 h-2 w-64 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      
      {/* AI-Guided Voice Mode Banner */}
      <div className="relative overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700 opacity-90 rounded-lg"></div>
        
        <div className="relative p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between text-white">
          <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
            <div className="flex-shrink-0 bg-white/20 p-3 rounded-full mb-3 sm:mb-0 sm:mr-4">
              <Mic className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">AI-Guided Periodontal Assistant</h3>
              <p className="text-sm text-purple-100 max-w-md">
                Speak measurements as you probe. The AI assistant will record depths and bleeding automatically.
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-3 text-right">
              <span className="block font-medium">{voiceActive ? 'Active' : 'Inactive'}</span>
              <span className="text-xs text-purple-200">
                {voiceActive ? 'Say numbers 1-9 for depths' : 'Toggle to enable voice control'}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={footPedalActive ? "default" : "outline"}
                className={`bg-white text-purple-700 hover:bg-white/90 ${footPedalActive ? 'border-green-300' : ''}`}
                onClick={toggleFootPedal}
              >
                <Footprints className="w-4 h-4 mr-1" />
                Foot Pedal
              </Button>
              <Button
                size="sm"
                variant={voiceActive ? "default" : "outline"}
                className={`bg-white text-purple-700 hover:bg-white/90 ${voiceActive ? 'border-blue-300' : ''}`}
                onClick={toggleVoiceRecognition}
              >
                {voiceActive ? <Mic className="w-4 h-4 mr-1" /> : <MicOff className="w-4 h-4 mr-1" />}
                Voice Mode
              </Button>
            </div>
          </div>
        </div>
        
        {/* Voice Command Examples */}
        {voiceActive && (
          <div className="relative bg-indigo-800/80 mt-1 p-4 rounded-b-lg text-white flex items-center">
            <div className="text-sm">
              <span className="font-medium">Try saying: </span>
              <span className="bg-white/20 px-2 py-1 rounded text-xs ml-2 mr-3">"3"</span>
              <span className="bg-white/20 px-2 py-1 rounded text-xs mr-3">"Bleeding"</span>
              <span className="bg-white/20 px-2 py-1 rounded text-xs">"Next"</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Current position indicator */}
      <div className="border rounded-md p-4 bg-blue-50 flex items-center justify-between">
        <div>
          <span className="text-sm text-blue-700">Current Position:</span>
          <div className="flex items-center mt-1">
            <div className="bg-white rounded-md px-2 py-1 border border-blue-200 font-medium">
              Tooth #{currentTooth}
            </div>
            <span className="mx-2 text-blue-800">→</span>
            <div className="bg-white rounded-md px-2 py-1 border border-blue-200 font-medium">
              {currentPosition}
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={moveToNextPosition}
          className="text-blue-700 border-blue-200"
        >
          <ArrowRight className="w-4 h-4 mr-1" />
          Next
        </Button>
      </div>
      
      {/* AI Voice Assistant Interface */}
      {voiceActive && (
        <div className="rounded-md overflow-hidden border border-purple-200 my-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 flex justify-between items-center">
            <h4 className="font-medium text-white flex items-center">
              <Mic className="w-5 h-5 mr-2" />
              Live Voice Recognition
            </h4>
          </div>
          
          {/* Voice Interaction Interface */}
          <div className="bg-white p-5">
            <div className="flex mb-4">
              <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full mr-3 self-start">
                <Mic className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-600 mb-1">AI Assistant</div>
                <div className="p-3 bg-purple-50 rounded-lg text-sm">
                  Recording measurement for Tooth #{currentTooth}, position {currentPosition}. 
                  Please say a number from 1-9mm for pocket depth or "bleeding" if bleeding is present.
                </div>
              </div>
            </div>
            
            {/* Simulated User Voice Input */}
            <div className="flex mb-2">
              <div className="flex-shrink-0 bg-gray-100 p-2 rounded-full mr-3 self-start">
                <Footprints className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-600 mb-1">Simulated Voice</div>
                <div className="p-3 rounded-lg text-sm bg-gray-50">
                  <p className="mb-2 text-gray-500">Select a measurement to simulate saying it:</p>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <Button
                        key={num}
                        variant="outline"
                        size="sm"
                        className={`h-9 ${getPocketDepthColor(num)}`}
                        onClick={() => setDepthValue(num)}
                      >
                        {num}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 bg-red-50 text-red-800 border-red-200"
                      onClick={toggleBleeding}
                    >
                      Bleeding
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Response */}
            <div className="flex mt-4">
              <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full mr-3 self-start">
                <Mic className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-600 mb-1">AI Assistant</div>
                <div className="p-3 bg-purple-50 rounded-lg text-sm">
                  {perioData[currentTooth] && perioData[currentTooth][currentPosition].depth !== null
                    ? `Recorded ${perioData[currentTooth][currentPosition].depth}mm for tooth #${currentTooth}, ${currentPosition} position. ${perioData[currentTooth][currentPosition].bleeding ? 'Bleeding noted.' : ''}`
                    : 'Waiting for your measurement...'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Voice Command Help */}
          <div className="bg-gray-50 p-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-xs text-gray-700 block mb-1">Voice Commands:</span>
                <div className="flex space-x-2">
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">1-9</span>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">bleeding</span>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">next</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={moveToNextPosition}
                className="text-purple-700 border-purple-200"
              >
                <ArrowRight className="w-4 h-4 mr-1" />
                Next Position
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Entry summary */}
      <div className="border rounded-md p-4 bg-white">
        <h4 className="text-sm font-medium mb-2">Data Entry Summary</h4>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="p-2 bg-green-50 rounded border border-green-200 text-center">
            <div className="text-xs text-green-700">Healthy</div>
            <div className="font-medium text-green-800">{stats.healthySites}</div>
          </div>
          <div className="p-2 bg-yellow-50 rounded border border-yellow-200 text-center">
            <div className="text-xs text-yellow-700">Moderate</div>
            <div className="font-medium text-yellow-800">{stats.moderateSites}</div>
          </div>
          <div className="p-2 bg-red-50 rounded border border-red-200 text-center">
            <div className="text-xs text-red-700">Severe</div>
            <div className="font-medium text-red-800">{stats.severeSites}</div>
          </div>
        </div>
        <div className="p-2 bg-blue-50 rounded border border-blue-200 flex justify-between items-center">
          <div className="text-sm text-blue-800">Bleeding on Probing:</div>
          <div className="font-medium text-blue-800">{stats.bleedingPercentage}%</div>
        </div>
      </div>
      
      {/* Instructions or completed message */}
      {chartCompleted ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-700 mr-2" />
            <h4 className="font-medium text-green-800">Perio Charting Complete</h4>
          </div>
          <p className="text-sm text-green-700 mt-1">
            You've successfully recorded periodontal measurements for the selected teeth. In a clinical setting, you would complete all teeth.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <ul className="list-disc list-inside space-y-1">
            <li>Use voice commands to record pocket depths (1-9mm)</li>
            <li>Say "bleeding" to mark bleeding on probing</li>
            <li>The system will automatically move to the next probing site</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PerioChartingStep;