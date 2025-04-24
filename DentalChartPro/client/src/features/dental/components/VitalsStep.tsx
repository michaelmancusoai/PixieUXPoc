import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Heart, 
  Thermometer, 
  Gauge, 
  Wind, 
  BarChart, 
  Check
} from 'lucide-react';

interface Vitals {
  bloodPressure: {
    systolic: string;
    diastolic: string;
  };
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
  height: string;
  weight: string;
  bmi: string;
  o2Saturation: string;
}

const VitalsStep = () => {
  // Initialize vitals with empty values
  const [vitals, setVitals] = useState<Vitals>({
    bloodPressure: {
      systolic: '',
      diastolic: ''
    },
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    height: '',
    weight: '',
    bmi: '',
    o2Saturation: ''
  });
  
  // Handle change for most form fields
  const handleChange = (field: keyof Omit<Vitals, 'bloodPressure' | 'bmi'>, value: string) => {
    setVitals(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Automatically calculate BMI if both height and weight are present
    if ((field === 'height' || field === 'weight') && 
        vitals.height !== '' && 
        vitals.weight !== '' && 
        value !== '') {
      const height = field === 'height' ? parseFloat(value) : parseFloat(vitals.height);
      const weight = field === 'weight' ? parseFloat(value) : parseFloat(vitals.weight);
      
      if (!isNaN(height) && !isNaN(weight) && height > 0) {
        // BMI = weight(kg) / height(m)^2
        const heightInMeters = height / 100; // assuming height is in cm
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        setVitals(prev => ({
          ...prev,
          bmi
        }));
      }
    }
  };
  
  // Handle blood pressure change
  const handleBPChange = (field: 'systolic' | 'diastolic', value: string) => {
    setVitals(prev => ({
      ...prev,
      bloodPressure: {
        ...prev.bloodPressure,
        [field]: value
      }
    }));
  };
  
  // Check if all required fields are filled
  const isComplete = () => {
    return (
      vitals.bloodPressure.systolic.trim() !== '' &&
      vitals.bloodPressure.diastolic.trim() !== '' &&
      vitals.heartRate.trim() !== '' &&
      vitals.temperature.trim() !== ''
    );
  };
  
  // Get background color for BMI
  const getBMIColor = () => {
    const bmi = parseFloat(vitals.bmi);
    if (isNaN(bmi)) return '';
    
    if (bmi < 18.5) return 'bg-blue-100 text-blue-800';
    if (bmi < 25) return 'bg-green-100 text-green-800';
    if (bmi < 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Get BMI classification
  const getBMIClassification = () => {
    const bmi = parseFloat(vitals.bmi);
    if (isNaN(bmi)) return '';
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Patient Vitals</h3>
      <p className="text-sm text-gray-600">
        Record current vital signs for the patient.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Blood Pressure */}
          <div className="p-4 border rounded-md space-y-3">
            <div className="flex items-center space-x-2 text-red-600">
              <Gauge className="h-5 w-5" />
              <Label className="font-medium">Blood Pressure*</Label>
            </div>
            <div className="flex space-x-2 items-center">
              <Input
                value={vitals.bloodPressure.systolic}
                onChange={(e) => handleBPChange('systolic', e.target.value)}
                placeholder="Systolic"
                type="number"
                className="w-24"
              />
              <span className="text-lg">/</span>
              <Input
                value={vitals.bloodPressure.diastolic}
                onChange={(e) => handleBPChange('diastolic', e.target.value)}
                placeholder="Diastolic"
                type="number"
                className="w-24"
              />
              <span className="text-sm text-gray-500">mmHg</span>
            </div>
            
            {/* BP Classification */}
            {vitals.bloodPressure.systolic !== '' && vitals.bloodPressure.diastolic !== '' && (
              <div className="flex space-x-3 text-sm">
                <span className="text-gray-500">Classification:</span>
                <span className={`font-medium ${
                  parseInt(vitals.bloodPressure.systolic) < 120 && parseInt(vitals.bloodPressure.diastolic) < 80
                    ? 'text-green-600'
                    : parseInt(vitals.bloodPressure.systolic) < 130 && parseInt(vitals.bloodPressure.diastolic) < 80
                    ? 'text-blue-600'
                    : parseInt(vitals.bloodPressure.systolic) < 140 || parseInt(vitals.bloodPressure.diastolic) < 90
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {parseInt(vitals.bloodPressure.systolic) < 120 && parseInt(vitals.bloodPressure.diastolic) < 80
                    ? 'Normal'
                    : parseInt(vitals.bloodPressure.systolic) < 130 && parseInt(vitals.bloodPressure.diastolic) < 80
                    ? 'Elevated'
                    : parseInt(vitals.bloodPressure.systolic) < 140 || parseInt(vitals.bloodPressure.diastolic) < 90
                    ? 'Stage 1 Hypertension'
                    : 'Stage 2 Hypertension'}
                </span>
              </div>
            )}
          </div>
          
          {/* Heart Rate */}
          <div className="p-4 border rounded-md space-y-3">
            <div className="flex items-center space-x-2 text-red-600">
              <Heart className="h-5 w-5" />
              <Label className="font-medium">Heart Rate*</Label>
            </div>
            <div className="flex space-x-2 items-center">
              <Input
                value={vitals.heartRate}
                onChange={(e) => handleChange('heartRate', e.target.value)}
                placeholder="Heart Rate"
                type="number"
                className="w-24"
              />
              <span className="text-sm text-gray-500">bpm</span>
            </div>
            
            {/* Heart Rate Classification */}
            {vitals.heartRate !== '' && (
              <div className="flex space-x-3 text-sm">
                <span className="text-gray-500">Classification:</span>
                <span className={`font-medium ${
                  parseInt(vitals.heartRate) < 60
                    ? 'text-blue-600'
                    : parseInt(vitals.heartRate) <= 100
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {parseInt(vitals.heartRate) < 60
                    ? 'Bradycardia'
                    : parseInt(vitals.heartRate) <= 100
                    ? 'Normal'
                    : 'Tachycardia'}
                </span>
              </div>
            )}
          </div>
          
          {/* Temperature */}
          <div className="p-4 border rounded-md space-y-3">
            <div className="flex items-center space-x-2 text-red-600">
              <Thermometer className="h-5 w-5" />
              <Label className="font-medium">Temperature*</Label>
            </div>
            <div className="flex space-x-2 items-center">
              <Input
                value={vitals.temperature}
                onChange={(e) => handleChange('temperature', e.target.value)}
                placeholder="Temperature"
                type="number"
                step="0.1"
                className="w-24"
              />
              <span className="text-sm text-gray-500">°F</span>
            </div>
            
            {/* Temperature Classification */}
            {vitals.temperature !== '' && (
              <div className="flex space-x-3 text-sm">
                <span className="text-gray-500">Classification:</span>
                <span className={`font-medium ${
                  parseFloat(vitals.temperature) < 97.0
                    ? 'text-blue-600'
                    : parseFloat(vitals.temperature) <= 99.0
                    ? 'text-green-600'
                    : parseFloat(vitals.temperature) <= 100.4
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {parseFloat(vitals.temperature) < 97.0
                    ? 'Hypothermia'
                    : parseFloat(vitals.temperature) <= 99.0
                    ? 'Normal'
                    : parseFloat(vitals.temperature) <= 100.4
                    ? 'Low-grade Fever'
                    : 'Fever'}
                </span>
              </div>
            )}
          </div>
          
          {/* Respiratory Rate */}
          <div className="p-4 border rounded-md space-y-3">
            <div className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-gray-700" />
              <Label className="font-medium">Respiratory Rate</Label>
            </div>
            <div className="flex space-x-2 items-center">
              <Input
                value={vitals.respiratoryRate}
                onChange={(e) => handleChange('respiratoryRate', e.target.value)}
                placeholder="Breaths per minute"
                type="number"
                className="w-24"
              />
              <span className="text-sm text-gray-500">breaths/min</span>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-4">
          {/* Height & Weight */}
          <div className="p-4 border rounded-md space-y-3">
            <div className="flex items-center space-x-2">
              <BarChart className="h-5 w-5 text-gray-700" />
              <Label className="font-medium">Height & Weight</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs block mb-1 text-gray-500">Height</Label>
                <div className="flex space-x-2 items-center">
                  <Input
                    value={vitals.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    placeholder="Height"
                    type="number"
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">cm</span>
                </div>
              </div>
              <div>
                <Label className="text-xs block mb-1 text-gray-500">Weight</Label>
                <div className="flex space-x-2 items-center">
                  <Input
                    value={vitals.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    placeholder="Weight"
                    type="number"
                    step="0.1"
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">kg</span>
                </div>
              </div>
            </div>
            
            {/* BMI */}
            {vitals.bmi && (
              <div className="mt-3 p-2 rounded-md flex justify-between items-center text-sm font-medium border-t pt-3">
                <span>BMI:</span>
                <div className={`px-2 py-1 rounded ${getBMIColor()}`}>
                  {vitals.bmi} ({getBMIClassification()})
                </div>
              </div>
            )}
          </div>
          
          {/* Oxygen Saturation */}
          <div className="p-4 border rounded-md space-y-3">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                <path d="M12 22s9-4 9-10.4V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v5.6C3 18 12 22 12 22Z"></path>
                <path d="M8 15h8"></path>
                <path d="M8 10h8"></path>
              </svg>
              <Label className="font-medium">Oxygen Saturation</Label>
            </div>
            <div className="flex space-x-2 items-center">
              <Input
                value={vitals.o2Saturation}
                onChange={(e) => handleChange('o2Saturation', e.target.value)}
                placeholder="O2 Saturation"
                type="number"
                max="100"
                className="w-24"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
            
            {/* O2 Classification */}
            {vitals.o2Saturation !== '' && (
              <div className="flex space-x-3 text-sm">
                <span className="text-gray-500">Classification:</span>
                <span className={`font-medium ${
                  parseInt(vitals.o2Saturation) >= 95
                    ? 'text-green-600'
                    : parseInt(vitals.o2Saturation) >= 90
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {parseInt(vitals.o2Saturation) >= 95
                    ? 'Normal'
                    : parseInt(vitals.o2Saturation) >= 90
                    ? 'Mild Hypoxemia'
                    : 'Hypoxemia'}
                </span>
              </div>
            )}
          </div>
          
          {/* Completion Status */}
          {isComplete() && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-medium text-green-800">Vitals Recorded</h4>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Essential vitals have been recorded successfully.
              </p>
            </div>
          )}
          
          {/* Required Fields Note */}
          <div className="text-xs text-gray-500 italic">
            * Required fields
          </div>
          
          {/* Values Reference */}
          <div className="text-xs text-gray-500 border-t pt-2 mt-2">
            <div className="font-medium mb-1">Reference Values:</div>
            <ul className="space-y-1">
              <li>Blood Pressure: &lt;120/80 mmHg (Normal)</li>
              <li>Heart Rate: 60-100 bpm (Adult)</li>
              <li>Temperature: 97.0-99.0°F (Normal)</li>
              <li>Respiratory Rate: 12-20 breaths/min (Adult)</li>
              <li>O2 Saturation: ≥95% (Normal)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsStep;