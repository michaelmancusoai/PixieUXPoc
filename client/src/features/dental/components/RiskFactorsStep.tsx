import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Cigarette, 
  Droplets, 
  Pill, 
  Heart, 
  Skull, 
  Coffee, 
  ArrowRight, 
  Info
} from 'lucide-react';

interface RiskFactor {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  selected: boolean | null;
}

const RiskFactorsStep = () => {
  // State for risk factors
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    {
      id: 'smoking',
      name: 'Smoking',
      icon: <Cigarette className="w-5 h-5" />,
      description: 'Smoking reduces blood flow to the gums, increasing risk of periodontal disease and delayed healing. Quitting improves outcomes significantly within 1 year.',
      selected: null
    },
    {
      id: 'diabetes',
      name: 'Diabetes',
      icon: <Droplets className="w-5 h-5" />,
      description: 'Uncontrolled diabetes impairs immune response and increases inflammation. Well-controlled diabetic patients show similar healing to non-diabetic patients.',
      selected: null
    },
    {
      id: 'medications',
      name: 'Medications',
      icon: <Pill className="w-5 h-5" />,
      description: 'Certain medications like anticonvulsants, immunosuppressants, and some blood pressure medications can affect gum health and healing response.',
      selected: null
    },
    {
      id: 'cardiovascular',
      name: 'Cardiovascular Disease',
      icon: <Heart className="w-5 h-5" />,
      description: 'There is a bidirectional relationship between periodontal disease and cardiovascular conditions. Treatment of one can positively impact the other.',
      selected: null
    },
    {
      id: 'bruxism',
      name: 'Bruxism/Grinding',
      icon: <Skull className="w-5 h-5" />,
      description: 'Excessive grinding creates microfractures and accelerates enamel wear. Night guards can prevent further damage and reduce symptoms.',
      selected: null
    },
    {
      id: 'xerostomia',
      name: 'Dry Mouth',
      icon: <Coffee className="w-5 h-5" />,
      description: 'Reduced saliva flow increases caries risk and impairs remineralization. Recommend saliva substitutes and frequent water consumption.',
      selected: null
    }
  ]);
  
  // State for flipped cards
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  
  // Toggle risk factor selection
  const toggleRiskFactor = (id: string, value: boolean) => {
    setRiskFactors(prev => 
      prev.map(factor => 
        factor.id === id ? { ...factor, selected: value } : factor
      )
    );
  };
  
  // Toggle card flip
  const toggleCardFlip = (id: string) => {
    setFlippedCard(flippedCard === id ? null : id);
  };
  
  // Check if all risk factors have been answered
  const allAnswered = riskFactors.every(factor => factor.selected !== null);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Risk Factor Assessment</h3>
      <p className="text-sm text-gray-600">
        Identify patient risk factors that may affect treatment planning and outcomes.
      </p>
      
      {/* Progress indicator */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium">
          {riskFactors.filter(f => f.selected !== null).length} of {riskFactors.length} factors assessed
        </div>
        <div className="bg-gray-200 h-2 w-32 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-500 ease-in-out"
            style={{ width: `${(riskFactors.filter(f => f.selected !== null).length / riskFactors.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Risk factor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {riskFactors.map(factor => (
          <div 
            key={factor.id}
            className={`relative border rounded-lg shadow-sm h-40 ${
              flippedCard === factor.id ? 'bg-blue-50' : 'bg-white'
            } transition-colors duration-300 ease-in-out`}
          >
            {/* Front of card */}
            <div className={`absolute inset-0 p-4 flex flex-col ${flippedCard === factor.id ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-full bg-gray-100">
                    {factor.icon}
                  </div>
                  <h4 className="font-medium">{factor.name}</h4>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => toggleCardFlip(factor.id)}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-grow"></div>
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  variant={factor.selected === true ? "default" : "outline"}
                  className={`flex-1 ${factor.selected === true ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => toggleRiskFactor(factor.id, true)}
                >
                  Yes
                </Button>
                <Button 
                  variant={factor.selected === false ? "default" : "outline"} 
                  className={`flex-1 ${factor.selected === false ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  onClick={() => toggleRiskFactor(factor.id, false)}
                >
                  No
                </Button>
              </div>
            </div>
            
            {/* Back of card with description */}
            <div className={`absolute inset-0 p-4 flex flex-col ${flippedCard === factor.id ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{factor.name}</h4>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => toggleCardFlip(factor.id)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-sm text-gray-700 flex-grow">{factor.description}</p>
              
              {/* Still show selection on the back */}
              <div className="text-sm text-gray-500 mt-2">
                Status: {factor.selected === null ? 'Not assessed' : factor.selected ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary section */}
      {allAnswered && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Risk Assessment Complete</h4>
          <p className="text-sm text-green-700">
            You've completed the risk factor assessment. Identified risk factors will be incorporated into the treatment plan recommendations.
          </p>
          
          {/* Risk summary */}
          {riskFactors.some(f => f.selected === true) && (
            <div className="mt-3">
              <h5 className="text-sm font-medium text-green-800 mb-1">Identified Risk Factors:</h5>
              <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                {riskFactors.filter(f => f.selected === true).map(factor => (
                  <li key={factor.id}>{factor.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskFactorsStep;