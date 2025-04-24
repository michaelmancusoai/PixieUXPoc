import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/dentalSlice';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Printer, 
  Mic, 
  MicOff,
  Footprints,
  XCircle,
  Download
} from 'lucide-react';

// Pocket depth color mapping
const getPocketDepthColor = (depth: number | null): string => {
  if (depth === null) return 'bg-gray-100 text-gray-400';
  if (depth <= 3) return 'bg-green-100 text-green-800';
  if (depth <= 5) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const PerioChart = () => {
  const { teeth } = useSelector((state: RootState) => state.dental);
  
  // State for voice recognition active status
  const [voiceActive, setVoiceActive] = useState(false);
  
  // State for foot pedal active status
  const [footPedalActive, setFootPedalActive] = useState(false);
  
  // State for current quadrant
  const [currentQuadrant, setCurrentQuadrant] = useState<'upper' | 'lower'>('upper');
  
  // Mock data for perio measurements
  // We'll structure this as:
  // { toothNumber: { position: { pocket: number, recession: number, bleeding: boolean } } }
  const [perioData, setPerioData] = useState<Record<number, Record<string, { pocket: number | null, recession: number | null, bleeding: boolean }>>>({});
  
  // Initialize empty perio data for all teeth
  useEffect(() => {
    const initialData: Record<number, Record<string, { pocket: number | null, recession: number | null, bleeding: boolean }>> = {};
    
    // For each tooth (1-32)
    for (let i = 1; i <= 32; i++) {
      initialData[i] = {
        'MB': { pocket: null, recession: null, bleeding: false },
        'B': { pocket: null, recession: null, bleeding: false },
        'DB': { pocket: null, recession: null, bleeding: false },
        'ML': { pocket: null, recession: null, bleeding: false },
        'L': { pocket: null, recession: null, bleeding: false },
        'DL': { pocket: null, recession: null, bleeding: false },
      };
    }
    
    // Pre-populate with some sample data for demonstration
    initialData[3]['MB'] = { pocket: 3, recession: 0, bleeding: false };
    initialData[3]['B'] = { pocket: 2, recession: 0, bleeding: false };
    initialData[3]['DB'] = { pocket: 3, recession: 0, bleeding: false };
    initialData[3]['ML'] = { pocket: 4, recession: 1, bleeding: true };
    initialData[3]['L'] = { pocket: 5, recession: 2, bleeding: true };
    initialData[3]['DL'] = { pocket: 3, recession: 0, bleeding: false };
    
    initialData[14]['MB'] = { pocket: 4, recession: 0, bleeding: true };
    initialData[14]['B'] = { pocket: 3, recession: 0, bleeding: false };
    initialData[14]['DB'] = { pocket: 5, recession: 1, bleeding: true };
    initialData[14]['ML'] = { pocket: 6, recession: 2, bleeding: true };
    initialData[14]['L'] = { pocket: 5, recession: 1, bleeding: true };
    initialData[14]['DL'] = { pocket: 4, recession: 0, bleeding: true };
    
    initialData[19]['MB'] = { pocket: 3, recession: 0, bleeding: false };
    initialData[19]['B'] = { pocket: 4, recession: 1, bleeding: false };
    initialData[19]['DB'] = { pocket: 3, recession: 0, bleeding: false };
    initialData[19]['ML'] = { pocket: 3, recession: 0, bleeding: false };
    initialData[19]['L'] = { pocket: 2, recession: 0, bleeding: false };
    initialData[19]['DL'] = { pocket: 3, recession: 0, bleeding: false };
    
    initialData[30]['MB'] = { pocket: 5, recession: 2, bleeding: true };
    initialData[30]['B'] = { pocket: 6, recession: 3, bleeding: true };
    initialData[30]['DB'] = { pocket: 7, recession: 4, bleeding: true };
    initialData[30]['ML'] = { pocket: 4, recession: 1, bleeding: true };
    initialData[30]['L'] = { pocket: 5, recession: 2, bleeding: true };
    initialData[30]['DL'] = { pocket: 4, recession: 1, bleeding: true };
    
    setPerioData(initialData);
  }, []);
  
  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    setVoiceActive(!voiceActive);
  };
  
  // Toggle foot pedal
  const toggleFootPedal = () => {
    setFootPedalActive(!footPedalActive);
  };
  
  // Handler for setting pocket depth on a specific tooth and position
  const setPocketDepth = (toothNumber: number, position: string, depth: number | null) => {
    setPerioData(prev => ({
      ...prev,
      [toothNumber]: {
        ...prev[toothNumber],
        [position]: {
          ...prev[toothNumber][position],
          pocket: depth
        }
      }
    }));
  };
  
  // Handler for setting recession on a specific tooth and position
  const setRecession = (toothNumber: number, position: string, recession: number | null) => {
    setPerioData(prev => ({
      ...prev,
      [toothNumber]: {
        ...prev[toothNumber],
        [position]: {
          ...prev[toothNumber][position],
          recession
        }
      }
    }));
  };
  
  // Handler for toggling bleeding on a specific tooth and position
  const toggleBleeding = (toothNumber: number, position: string) => {
    setPerioData(prev => ({
      ...prev,
      [toothNumber]: {
        ...prev[toothNumber],
        [position]: {
          ...prev[toothNumber][position],
          bleeding: !prev[toothNumber][position].bleeding
        }
      }
    }));
  };
  
  // Get teeth for current quadrant
  const getTeethForQuadrant = () => {
    if (currentQuadrant === 'upper') {
      // Upper teeth (1-16)
      return Array.from({ length: 16 }, (_, i) => i + 1);
    } else {
      // Lower teeth (17-32) - display in reverse order for lower arch
      return Array.from({ length: 16 }, (_, i) => 32 - i);
    }
  };
  
  // Calculate stats
  const calculateStats = () => {
    let totalSites = 0;
    let recordedSites = 0;
    let healthySites = 0;
    let moderateSites = 0;
    let severeSites = 0;
    let bleedingSites = 0;
    
    Object.keys(perioData).forEach(toothNum => {
      const tooth = perioData[parseInt(toothNum)];
      Object.keys(tooth).forEach(position => {
        totalSites++;
        const site = tooth[position];
        if (site.pocket !== null) {
          recordedSites++;
          if (site.pocket <= 3) healthySites++;
          else if (site.pocket <= 5) moderateSites++;
          else severeSites++;
          
          if (site.bleeding) bleedingSites++;
        }
      });
    });
    
    return {
      totalSites,
      recordedSites,
      healthySites,
      moderateSites,
      severeSites,
      bleedingSites,
      completionRate: Math.round((recordedSites / totalSites) * 100),
      bleedingPercentage: recordedSites ? Math.round((bleedingSites / recordedSites) * 100) : 0
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-indigo-900">Periodontal Chart</h2>
          <Tabs defaultValue="pocket" className="w-auto">
            <TabsList className="bg-indigo-50">
              <TabsTrigger 
                value="pocket" 
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Pocket Depths
              </TabsTrigger>
              <TabsTrigger 
                value="recession"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Recession
              </TabsTrigger>
              <TabsTrigger 
                value="bleeding"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Bleeding
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
          >
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Stats summary */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm text-gray-500">Completion</div>
            <div className="text-2xl font-semibold">{stats.completionRate}%</div>
            <div className="text-xs text-gray-500">{stats.recordedSites}/{stats.totalSites} sites</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm text-gray-500">BOP Index</div>
            <div className="text-2xl font-semibold">{stats.bleedingPercentage}%</div>
            <div className="text-xs text-gray-500">{stats.bleedingSites} bleeding sites</div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-700">Healthy (1-3mm)</div>
            <div className="text-2xl font-semibold text-green-700">{stats.healthySites}</div>
            <div className="text-xs text-green-600">sites</div>
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm text-yellow-700">Moderate (4-5mm)</div>
            <div className="text-2xl font-semibold text-yellow-700">{stats.moderateSites}</div>
            <div className="text-xs text-yellow-600">sites</div>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-sm text-red-700">Severe (6+mm)</div>
            <div className="text-2xl font-semibold text-red-700">{stats.severeSites}</div>
            <div className="text-xs text-red-600">sites</div>
          </div>
          
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="text-sm text-indigo-700">Furcation</div>
            <div className="text-2xl font-semibold text-indigo-700">0</div>
            <div className="text-xs text-indigo-600">sites</div>
          </div>
        </div>
        
        {/* Capture controls */}
        <div className="flex justify-between mb-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className={`${currentQuadrant === 'upper' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}
              onClick={() => setCurrentQuadrant('upper')}
            >
              Upper Arch
            </Button>
            <Button
              variant="outline"
              className={`${currentQuadrant === 'lower' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}
              onClick={() => setCurrentQuadrant('lower')}
            >
              Lower Arch
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={voiceActive ? "default" : "outline"}
              className={voiceActive ? "bg-indigo-600 hover:bg-indigo-700" : "border-indigo-300 text-indigo-700 hover:bg-indigo-50"}
              onClick={toggleVoiceRecognition}
              size="sm"
            >
              {voiceActive ? <Mic className="w-4 h-4 mr-1" /> : <MicOff className="w-4 h-4 mr-1" />}
              {voiceActive ? "Voice Active" : "Voice Capture"}
            </Button>
            
            <Button
              variant={footPedalActive ? "default" : "outline"}
              className={footPedalActive ? "bg-indigo-600 hover:bg-indigo-700" : "border-indigo-300 text-indigo-700 hover:bg-indigo-50"}
              onClick={toggleFootPedal}
              size="sm"
            >
              <Footprints className="w-4 h-4 mr-1" />
              {footPedalActive ? "Pedal Active" : "Foot Pedal"}
            </Button>
          </div>
        </div>
        
        {/* Perio Chart Table */}
        <div className="border rounded-md overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-2 text-sm font-medium text-gray-600 text-center">Tooth</th>
                <th colSpan={3} className="p-2 text-sm font-medium text-gray-600 text-center border-l">Facial</th>
                <th colSpan={3} className="p-2 text-sm font-medium text-gray-600 text-center border-l">Lingual</th>
              </tr>
              <tr className="bg-gray-50 border-b">
                <th className="p-2 text-xs text-gray-600 text-center">#</th>
                <th className="p-2 text-xs text-gray-600 text-center border-l">Mesial</th>
                <th className="p-2 text-xs text-gray-600 text-center">Middle</th>
                <th className="p-2 text-xs text-gray-600 text-center">Distal</th>
                <th className="p-2 text-xs text-gray-600 text-center border-l">Mesial</th>
                <th className="p-2 text-xs text-gray-600 text-center">Middle</th>
                <th className="p-2 text-xs text-gray-600 text-center">Distal</th>
              </tr>
            </thead>
            <tbody>
              {getTeethForQuadrant().map(toothNumber => (
                <tr key={toothNumber} className="border-b hover:bg-gray-50">
                  {/* Tooth number */}
                  <td className="p-0 text-center">
                    <div className="p-1.5 font-medium">{toothNumber}</div>
                  </td>
                  
                  {/* Facial - Mesial */}
                  <td className="p-0 text-center border-l">
                    <div className="relative">
                      {/* Recession */}
                      <div className={`text-xs py-1 ${perioData[toothNumber]?.MB?.recession ? 'bg-amber-50 text-amber-800' : 'bg-gray-50 text-gray-400'}`}>
                        {perioData[toothNumber]?.MB?.recession ?? '-'}
                      </div>
                      
                      {/* Pocket Depth */}
                      <div 
                        className={`text-sm py-1.5 font-medium relative ${getPocketDepthColor(perioData[toothNumber]?.MB?.pocket)}`}
                        onClick={() => setPocketDepth(toothNumber, 'MB', perioData[toothNumber]?.MB?.pocket === null ? 3 : (perioData[toothNumber]?.MB?.pocket || 0) + 1 > 9 ? null : (perioData[toothNumber]?.MB?.pocket || 0) + 1)}
                      >
                        {perioData[toothNumber]?.MB?.pocket ?? '-'}
                        {perioData[toothNumber]?.MB?.bleeding && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          </span>
                        )}
                      </div>
                      
                      {/* Bleeding control */}
                      <div 
                        className={`text-xs py-1 cursor-pointer ${perioData[toothNumber]?.MB?.bleeding ? 'bg-red-100 text-red-800' : 'bg-gray-50 text-gray-400'}`}
                        onClick={() => toggleBleeding(toothNumber, 'MB')}
                      >
                        {perioData[toothNumber]?.MB?.bleeding ? 'BOP +' : 'BOP -'}
                      </div>
                    </div>
                  </td>
                  
                  {/* Facial - Middle */}
                  <td className="p-0 text-center">
                    <div className="relative">
                      {/* Recession */}
                      <div className={`text-xs py-1 ${perioData[toothNumber]?.B?.recession ? 'bg-amber-50 text-amber-800' : 'bg-gray-50 text-gray-400'}`}>
                        {perioData[toothNumber]?.B?.recession ?? '-'}
                      </div>
                      
                      {/* Pocket Depth */}
                      <div 
                        className={`text-sm py-1.5 font-medium relative ${getPocketDepthColor(perioData[toothNumber]?.B?.pocket)}`}
                        onClick={() => setPocketDepth(toothNumber, 'B', perioData[toothNumber]?.B?.pocket === null ? 3 : (perioData[toothNumber]?.B?.pocket || 0) + 1 > 9 ? null : (perioData[toothNumber]?.B?.pocket || 0) + 1)}
                      >
                        {perioData[toothNumber]?.B?.pocket ?? '-'}
                        {perioData[toothNumber]?.B?.bleeding && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          </span>
                        )}
                      </div>
                      
                      {/* Bleeding control */}
                      <div 
                        className={`text-xs py-1 cursor-pointer ${perioData[toothNumber]?.B?.bleeding ? 'bg-red-100 text-red-800' : 'bg-gray-50 text-gray-400'}`}
                        onClick={() => toggleBleeding(toothNumber, 'B')}
                      >
                        {perioData[toothNumber]?.B?.bleeding ? 'BOP +' : 'BOP -'}
                      </div>
                    </div>
                  </td>
                  
                  {/* Facial - Distal */}
                  <td className="p-0 text-center">
                    <div className="relative">
                      {/* Recession */}
                      <div className={`text-xs py-1 ${perioData[toothNumber]?.DB?.recession ? 'bg-amber-50 text-amber-800' : 'bg-gray-50 text-gray-400'}`}>
                        {perioData[toothNumber]?.DB?.recession ?? '-'}
                      </div>
                      
                      {/* Pocket Depth */}
                      <div 
                        className={`text-sm py-1.5 font-medium relative ${getPocketDepthColor(perioData[toothNumber]?.DB?.pocket)}`}
                        onClick={() => setPocketDepth(toothNumber, 'DB', perioData[toothNumber]?.DB?.pocket === null ? 3 : (perioData[toothNumber]?.DB?.pocket || 0) + 1 > 9 ? null : (perioData[toothNumber]?.DB?.pocket || 0) + 1)}
                      >
                        {perioData[toothNumber]?.DB?.pocket ?? '-'}
                        {perioData[toothNumber]?.DB?.bleeding && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          </span>
                        )}
                      </div>
                      
                      {/* Bleeding control */}
                      <div 
                        className={`text-xs py-1 cursor-pointer ${perioData[toothNumber]?.DB?.bleeding ? 'bg-red-100 text-red-800' : 'bg-gray-50 text-gray-400'}`}
                        onClick={() => toggleBleeding(toothNumber, 'DB')}
                      >
                        {perioData[toothNumber]?.DB?.bleeding ? 'BOP +' : 'BOP -'}
                      </div>
                    </div>
                  </td>
                  
                  {/* Lingual - Mesial */}
                  <td className="p-0 text-center border-l">
                    <div className="relative">
                      {/* Recession */}
                      <div className={`text-xs py-1 ${perioData[toothNumber]?.ML?.recession ? 'bg-amber-50 text-amber-800' : 'bg-gray-50 text-gray-400'}`}>
                        {perioData[toothNumber]?.ML?.recession ?? '-'}
                      </div>
                      
                      {/* Pocket Depth */}
                      <div 
                        className={`text-sm py-1.5 font-medium relative ${getPocketDepthColor(perioData[toothNumber]?.ML?.pocket)}`}
                        onClick={() => setPocketDepth(toothNumber, 'ML', perioData[toothNumber]?.ML?.pocket === null ? 3 : (perioData[toothNumber]?.ML?.pocket || 0) + 1 > 9 ? null : (perioData[toothNumber]?.ML?.pocket || 0) + 1)}
                      >
                        {perioData[toothNumber]?.ML?.pocket ?? '-'}
                        {perioData[toothNumber]?.ML?.bleeding && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          </span>
                        )}
                      </div>
                      
                      {/* Bleeding control */}
                      <div 
                        className={`text-xs py-1 cursor-pointer ${perioData[toothNumber]?.ML?.bleeding ? 'bg-red-100 text-red-800' : 'bg-gray-50 text-gray-400'}`}
                        onClick={() => toggleBleeding(toothNumber, 'ML')}
                      >
                        {perioData[toothNumber]?.ML?.bleeding ? 'BOP +' : 'BOP -'}
                      </div>
                    </div>
                  </td>
                  
                  {/* Lingual - Middle */}
                  <td className="p-0 text-center">
                    <div className="relative">
                      {/* Recession */}
                      <div className={`text-xs py-1 ${perioData[toothNumber]?.L?.recession ? 'bg-amber-50 text-amber-800' : 'bg-gray-50 text-gray-400'}`}>
                        {perioData[toothNumber]?.L?.recession ?? '-'}
                      </div>
                      
                      {/* Pocket Depth */}
                      <div 
                        className={`text-sm py-1.5 font-medium relative ${getPocketDepthColor(perioData[toothNumber]?.L?.pocket)}`}
                        onClick={() => setPocketDepth(toothNumber, 'L', perioData[toothNumber]?.L?.pocket === null ? 3 : (perioData[toothNumber]?.L?.pocket || 0) + 1 > 9 ? null : (perioData[toothNumber]?.L?.pocket || 0) + 1)}
                      >
                        {perioData[toothNumber]?.L?.pocket ?? '-'}
                        {perioData[toothNumber]?.L?.bleeding && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          </span>
                        )}
                      </div>
                      
                      {/* Bleeding control */}
                      <div 
                        className={`text-xs py-1 cursor-pointer ${perioData[toothNumber]?.L?.bleeding ? 'bg-red-100 text-red-800' : 'bg-gray-50 text-gray-400'}`}
                        onClick={() => toggleBleeding(toothNumber, 'L')}
                      >
                        {perioData[toothNumber]?.L?.bleeding ? 'BOP +' : 'BOP -'}
                      </div>
                    </div>
                  </td>
                  
                  {/* Lingual - Distal */}
                  <td className="p-0 text-center">
                    <div className="relative">
                      {/* Recession */}
                      <div className={`text-xs py-1 ${perioData[toothNumber]?.DL?.recession ? 'bg-amber-50 text-amber-800' : 'bg-gray-50 text-gray-400'}`}>
                        {perioData[toothNumber]?.DL?.recession ?? '-'}
                      </div>
                      
                      {/* Pocket Depth */}
                      <div 
                        className={`text-sm py-1.5 font-medium relative ${getPocketDepthColor(perioData[toothNumber]?.DL?.pocket)}`}
                        onClick={() => setPocketDepth(toothNumber, 'DL', perioData[toothNumber]?.DL?.pocket === null ? 3 : (perioData[toothNumber]?.DL?.pocket || 0) + 1 > 9 ? null : (perioData[toothNumber]?.DL?.pocket || 0) + 1)}
                      >
                        {perioData[toothNumber]?.DL?.pocket ?? '-'}
                        {perioData[toothNumber]?.DL?.bleeding && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          </span>
                        )}
                      </div>
                      
                      {/* Bleeding control */}
                      <div 
                        className={`text-xs py-1 cursor-pointer ${perioData[toothNumber]?.DL?.bleeding ? 'bg-red-100 text-red-800' : 'bg-gray-50 text-gray-400'}`}
                        onClick={() => toggleBleeding(toothNumber, 'DL')}
                      >
                        {perioData[toothNumber]?.DL?.bleeding ? 'BOP +' : 'BOP -'}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Instructions */}
        <div className="mt-6 p-4 border rounded-md bg-blue-50 text-blue-800 text-sm space-y-2">
          <h4 className="font-medium">Interactive Chart Instructions</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Click on any pocket depth measurement cell to increase the value. After 9mm, it will reset.</li>
            <li>Click on any "BOP" cell to toggle bleeding on/off for that site.</li>
            <li>Switch between upper and lower arch using the buttons above.</li>
            <li>Toggle between pocket depths, recession, and bleeding views using the tabs at the top.</li>
          </ul>
          <p>In a clinical setting, voice commands or foot pedal would be used for hands-free recording.</p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t p-3 bg-gray-50 flex justify-between">
        <div className="text-sm text-gray-600">
          {stats.completionRate}% Complete ({stats.recordedSites}/{stats.totalSites} sites)
        </div>
        <div className="text-sm font-medium">
          {stats.bleedingPercentage}% Bleeding on Probing
        </div>
      </div>
    </div>
  );
};

export default PerioChart;