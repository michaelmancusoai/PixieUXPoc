import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/dentalSlice';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Mic,
  MicOff,
  MousePointer,
  Keyboard,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CircleDot
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ConsolidatedFindingsStepProps {
  onComplete?: () => void;
}

const ConsolidatedFindingsStep = ({ onComplete }: ConsolidatedFindingsStepProps) => {
  const { teeth } = useSelector((state: RootState) => state.dental);
  
  // State for controlling voice mode
  const [voiceMode, setVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // State for current selected tooth/quadrant
  const [selectedQuadrant, setSelectedQuadrant] = useState<'UR' | 'UL' | 'LL' | 'LR'>('UR');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  
  // Map quadrant to tooth numbers
  const toothRanges = {
    'UR': [1, 2, 3, 4, 5, 6, 7, 8],
    'UL': [9, 10, 11, 12, 13, 14, 15, 16],
    'LL': [24, 23, 22, 21, 20, 19, 18, 17],
    'LR': [32, 31, 30, 29, 28, 27, 26, 25],
  };
  
  // Simulated findings data
  const [findings, setFindings] = useState<Record<number, string[]>>({});
  
  // Toggle voice mode
  const toggleVoiceMode = () => {
    if (voiceMode && isRecording) {
      // Stop recording first if switching off
      setIsRecording(false);
    }
    setVoiceMode(!voiceMode);
  };
  
  // Toggle recording
  const toggleRecording = () => {
    if (!voiceMode) return;
    
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // Here would be where we'd process the voice command
      processVoiceCommand(transcript);
      setTranscript('');
    } else {
      // Start recording
      setIsRecording(true);
      // Simulate voice recognition
      simulateVoiceRecognition();
    }
  };
  
  // Simulate voice recognition (in a real app, this would use the Web Speech API)
  const simulateVoiceRecognition = () => {
    // This is a simulation - in a real app, this would be connected to the Web Speech API
    const sampleCommands = [
      "Tooth 3 MOD caries",
      "Number 14 has existing amalgam DO",
      "Tooth 19 needs crown",
      "Number 30 has mesial and distal caries",
    ];
    
    const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
    
    // Simulate typing effect
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= randomCommand.length) {
        setTranscript(randomCommand.substring(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
        // Automatically stop recording after command is complete
        setTimeout(() => {
          setIsRecording(false);
          processVoiceCommand(randomCommand);
          setTranscript('');
        }, 1000);
      }
    }, 100);
  };
  
  // Process voice command (simplified for demonstration)
  const processVoiceCommand = (command: string) => {
    console.log("Processing voice command:", command);
    
    // Very basic command processing - would be much more sophisticated in a real app
    const lowerCommand = command.toLowerCase();
    
    // Extract tooth number
    const toothMatch = lowerCommand.match(/tooth (\d+)|number (\d+)/i);
    if (!toothMatch) return;
    
    const toothNumber = parseInt(toothMatch[1] || toothMatch[2]);
    
    // Basic condition detection
    let conditions: string[] = [];
    
    if (lowerCommand.includes('caries')) {
      conditions.push('Caries');
    }
    
    if (lowerCommand.includes('amalgam') || lowerCommand.includes('existing')) {
      conditions.push('Existing Restoration');
    }
    
    if (lowerCommand.includes('crown') || lowerCommand.includes('needs')) {
      conditions.push('Needs Crown');
    }
    
    // Surface detection
    if (lowerCommand.includes('mod')) {
      conditions.push('Surfaces: MOD');
    } else if (lowerCommand.includes('do')) {
      conditions.push('Surfaces: DO');
    } else if (lowerCommand.includes('mesial') && lowerCommand.includes('distal')) {
      conditions.push('Surfaces: MD');
    }
    
    // Update findings
    if (toothNumber && conditions.length > 0) {
      setFindings(prev => ({
        ...prev,
        [toothNumber]: conditions
      }));
      
      // Find and select the quadrant containing this tooth
      for (const [quadrant, teeth] of Object.entries(toothRanges)) {
        if (teeth.includes(toothNumber)) {
          setSelectedQuadrant(quadrant as 'UR' | 'UL' | 'LL' | 'LR');
          break;
        }
      }
      
      setSelectedTooth(toothNumber);
    }
  };
  
  // Handle selecting a tooth
  const handleSelectTooth = (toothNumber: number) => {
    setSelectedTooth(selectedTooth === toothNumber ? null : toothNumber);
  };
  
  // Get appropriate background color for a tooth based on findings
  const getToothStyle = (toothNumber: number) => {
    if (selectedTooth === toothNumber) {
      return 'bg-blue-100 border-blue-500 text-blue-800';
    }
    
    if (findings[toothNumber]) {
      const conditions = findings[toothNumber];
      if (conditions.some(c => c.includes('Caries'))) {
        return 'bg-red-100 border-red-300 text-red-800';
      }
      if (conditions.some(c => c.includes('Existing'))) {
        return 'bg-gray-100 border-gray-400 text-gray-800';
      }
      if (conditions.some(c => c.includes('Needs'))) {
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      }
    }
    
    return 'bg-gray-50 border-gray-300 hover:bg-blue-50';
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tooth Findings</h3>
      <p className="text-sm text-gray-600">
        Record caries, existing restorations, and other findings for all teeth.
      </p>
      
      {/* AI-Guided Voice Mode Banner */}
      <div className="relative overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90 rounded-lg"></div>
        
        <div className="relative p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between text-white">
          <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
            <div className="flex-shrink-0 bg-white/20 p-3 rounded-full mb-3 sm:mb-0 sm:mr-4">
              <Mic className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">AI-Guided Voice Mode</h3>
              <p className="text-sm text-blue-100 max-w-md">
                Speak naturally to record findings. The AI assistant will guide you through the process.
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-3 text-right">
              <span className="block font-medium">{voiceMode ? 'Active' : 'Inactive'}</span>
              <span className="text-xs text-blue-200">
                {voiceMode ? 'Click Start to begin dictation' : 'Toggle to enable voice control'}
              </span>
            </div>
            <Switch 
              id="voice-mode" 
              checked={voiceMode} 
              onCheckedChange={toggleVoiceMode}
              className="data-[state=checked]:bg-white data-[state=checked]:text-blue-700"
            />
          </div>
        </div>
        
        {/* Voice Command Examples */}
        {voiceMode && (
          <div className="relative bg-blue-800/80 mt-1 p-4 rounded-b-lg text-white flex items-center">
            <div className="text-sm">
              <span className="font-medium">Try saying: </span>
              <span className="bg-white/20 px-2 py-1 rounded text-xs ml-2 mr-3">"Tooth 3 has MOD caries"</span>
              <span className="bg-white/20 px-2 py-1 rounded text-xs mr-3">"Number 30 existing amalgam"</span>
              <span className="bg-white/20 px-2 py-1 rounded text-xs">"Tooth 19 needs crown"</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Voice Input Controls (visible only in voice mode) */}
      {voiceMode && (
        <div className="rounded-md overflow-hidden border border-blue-200 mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 flex justify-between items-center">
            <h4 className="font-medium text-white flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              AI Voice Assistant
            </h4>
            <Button
              size="sm"
              variant={isRecording ? "destructive" : "default"}
              onClick={toggleRecording}
              className={`flex items-center ${isRecording ? 'bg-white text-red-600 hover:bg-white/90' : 'bg-white text-blue-600 hover:bg-white/90'}`}
            >
              {isRecording ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Start Recording
                </>
              )}
            </Button>
          </div>
          
          {/* Transcript area */}
          <div className="p-5 bg-white">
            <div className="flex mb-4">
              <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-3 self-start">
                <Mic className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-600 mb-1">AI Assistant</div>
                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  {isRecording 
                    ? "I'm listening... Tell me which tooth you're examining and what conditions you observe." 
                    : "Press Start Recording and speak clearly. I'll help document your findings as you examine each tooth."}
                </div>
              </div>
            </div>
            
            {/* User transcript */}
            {(isRecording || transcript) && (
              <div className="flex mb-2">
                <div className="flex-shrink-0 bg-gray-100 p-2 rounded-full mr-3 self-start">
                  <CircleDot className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-600 mb-1">You</div>
                  <div className={`p-3 rounded-lg text-sm ${isRecording ? 'bg-gray-50 border border-gray-200' : 'bg-gray-100'}`}>
                    {transcript || (isRecording ? (
                      <div className="flex items-center text-gray-500">
                        <span>Listening</span>
                        <span className="ml-1 flex space-x-1">
                          <span className="animate-bounce delay-0">.</span>
                          <span className="animate-bounce delay-100">.</span>
                          <span className="animate-bounce delay-200">.</span>
                        </span>
                      </div>
                    ) : "Waiting for input...")}
                    
                    {isRecording && (
                      <div className="mt-2 flex space-x-1 justify-end">
                        <div className="w-2 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                        <div className="w-2 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                        <div className="w-2 h-5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '900ms' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* AI response for recognized speech */}
            {transcript && !isRecording && (
              <div className="flex mt-4">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-3 self-start">
                  <Mic className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-600 mb-1">AI Assistant</div>
                  <div className="p-3 bg-blue-50 rounded-lg text-sm">
                    I've recorded findings for tooth {
                      transcript && transcript.match(/tooth (\d+)|number (\d+)/i) ? 
                      (() => {
                        const match = transcript.match(/tooth (\d+)|number (\d+)/i);
                        return match?.[1] || match?.[2] || '??';
                      })() : 
                      '??'
                    }. What would you like to document next?
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Help section */}
          <div className="bg-gray-50 p-3 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <div className="mr-4">
                <span className="font-medium text-xs text-gray-700 block mb-1">Voice Commands:</span>
                <div className="flex space-x-2">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Tooth [number]</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">caries</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">MOD</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-xs text-gray-700 block mb-1">AI Assistance:</span>
                <span className="text-xs">Recording and interpreting your findings automatically</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Quadrant Tabs */}
      <Tabs defaultValue="UR" value={selectedQuadrant} onValueChange={(v) => setSelectedQuadrant(v as 'UR' | 'UL' | 'LL' | 'LR')}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="UR" className="text-xs sm:text-sm">
            UR Quadrant
            {Object.keys(findings).filter(n => toothRanges['UR'].includes(parseInt(n))).length > 0 && (
              <Badge variant="outline" className="ml-1 bg-blue-100 text-blue-800 text-xs">
                {Object.keys(findings).filter(n => toothRanges['UR'].includes(parseInt(n))).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="UL" className="text-xs sm:text-sm">
            UL Quadrant
            {Object.keys(findings).filter(n => toothRanges['UL'].includes(parseInt(n))).length > 0 && (
              <Badge variant="outline" className="ml-1 bg-blue-100 text-blue-800 text-xs">
                {Object.keys(findings).filter(n => toothRanges['UL'].includes(parseInt(n))).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="LL" className="text-xs sm:text-sm">
            LL Quadrant
            {Object.keys(findings).filter(n => toothRanges['LL'].includes(parseInt(n))).length > 0 && (
              <Badge variant="outline" className="ml-1 bg-blue-100 text-blue-800 text-xs">
                {Object.keys(findings).filter(n => toothRanges['LL'].includes(parseInt(n))).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="LR" className="text-xs sm:text-sm">
            LR Quadrant
            {Object.keys(findings).filter(n => toothRanges['LR'].includes(parseInt(n))).length > 0 && (
              <Badge variant="outline" className="ml-1 bg-blue-100 text-blue-800 text-xs">
                {Object.keys(findings).filter(n => toothRanges['LR'].includes(parseInt(n))).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Content for each quadrant */}
        {(['UR', 'UL', 'LL', 'LR'] as const).map(quadrant => (
          <TabsContent key={quadrant} value={quadrant} className="space-y-4 pt-4">
            {/* Teeth grid */}
            <div className="border rounded-md p-4 bg-white">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {toothRanges[quadrant].map(toothNumber => (
                  <div key={toothNumber} className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-md border flex items-center justify-center cursor-pointer ${getToothStyle(toothNumber)}`}
                      onClick={() => handleSelectTooth(toothNumber)}
                    >
                      <CircleDot className="w-5 h-5 mr-1 opacity-50" />
                      {toothNumber}
                    </div>
                    <div className="text-xs mt-1 flex flex-col items-center">
                      <span>{`Tooth ${toothNumber}`}</span>
                      {findings[toothNumber] && (
                        <Badge variant="outline" className="mt-1 text-[10px] bg-gray-100">
                          {findings[toothNumber].length} finding(s)
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Selected tooth details */}
            {selectedTooth && (
              <div className="border p-4 rounded-md bg-blue-50">
                <h4 className="font-medium flex items-center">
                  <CircleDot className="w-5 h-5 mr-2 text-blue-700" />
                  Tooth {selectedTooth} Details
                </h4>
                
                {findings[selectedTooth] ? (
                  <div className="mt-2 space-y-2">
                    <div className="text-sm font-medium text-blue-800">Findings:</div>
                    <ul className="space-y-1">
                      {findings[selectedTooth].map((finding, idx) => (
                        <li key={idx} className="text-sm flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2 text-xs"
                      onClick={() => {
                        const updatedFindings = { ...findings };
                        delete updatedFindings[selectedTooth];
                        setFindings(updatedFindings);
                      }}
                    >
                      Clear Findings
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-gray-600">
                    No findings recorded for this tooth yet.
                  </div>
                )}
                
                {!voiceMode && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        setFindings(prev => ({
                          ...prev,
                          [selectedTooth]: [...(prev[selectedTooth] || []), 'Caries']
                        }));
                      }}
                    >
                      Add Caries
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        setFindings(prev => ({
                          ...prev,
                          [selectedTooth]: [...(prev[selectedTooth] || []), 'Existing Restoration']
                        }));
                      }}
                    >
                      Add Existing
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        setFindings(prev => ({
                          ...prev,
                          [selectedTooth]: [...(prev[selectedTooth] || []), 'Needs Crown']
                        }));
                      }}
                    >
                      Need Crown
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs"
                      onClick={() => {
                        setFindings(prev => ({
                          ...prev,
                          [selectedTooth]: [...(prev[selectedTooth] || []), 'Surfaces: MOD']
                        }));
                      }}
                    >
                      MOD
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Keyboard shortcuts - visible only in manual mode */}
            {!voiceMode && (
              <div className="bg-gray-50 p-3 rounded-md mt-4">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <Keyboard className="w-4 h-4 mr-2" />
                  Keyboard Shortcuts
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono mr-1">1-5</kbd>
                    <span>Select surface</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono mr-1">C</kbd>
                    <span>Toggle Caries</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono mr-1">R</kbd>
                    <span>Toggle Restoration</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono mr-1">F</kbd>
                    <span>Toggle Fracture</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono mr-1">Space</kbd>
                    <span>Next tooth</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Findings Summary */}
      <div className="mt-6 p-4 border rounded-md bg-green-50">
        <h4 className="font-medium text-green-800">Findings Summary</h4>
        <div className="mt-2">
          <div className="flex justify-between text-sm border-b border-green-200 pb-2 mb-2">
            <span>Total teeth with findings:</span>
            <span className="font-medium">{Object.keys(findings).length} / 32</span>
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Caries:</span>
              <span>{Object.values(findings).flat().filter(f => f.includes('Caries')).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Existing Restorations:</span>
              <span>{Object.values(findings).flat().filter(f => f.includes('Existing')).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Crowns Needed:</span>
              <span>{Object.values(findings).flat().filter(f => f.includes('Crown')).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedFindingsStep;