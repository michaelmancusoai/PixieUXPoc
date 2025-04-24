import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Gauge, 
  Activity, 
  Droplets, 
  Brain, 
  Stethoscope,
  PenTool,
  FileQuestion,
  LineChart,
  Scale, 
  Thermometer,
  FileText
} from 'lucide-react';

interface CompletedMedicalHistoryProps {
  patient?: {
    id: string;
    name: string;
  };
}

const CompletedMedicalHistory: React.FC<CompletedMedicalHistoryProps> = ({ patient }) => {
  // Mock data - in a real app, this would be fetched from the backend
  const patientName = patient?.name || 'John Doe';

  // Mock vitals data
  const vitals = {
    bloodPressure: '120/80',
    heartRate: 72,
    respiratoryRate: 16,
    temperature: 98.6,
    oxygenSaturation: 98,
    weight: 170,
    height: '5\'10"',
    bmi: 24.4,
    pain: 0,
  };

  // Mock medical conditions data
  const medicalConditions = {
    cardiovascular: {
      hypertension: true,
      heartAttack: false,
      heartMurmur: false,
      arrhythmia: true,
      congestiveHeartFailure: false,
    },
    respiratory: {
      asthma: true,
      copd: false,
      sleepApnea: true,
      tuberculosis: false,
      sinusitis: true,
    },
    endocrine: {
      diabetes: false,
      thyroidDisorder: true,
      adrenalDisorder: false,
      osteoporosis: false,
    },
    neurologicalPsychiatric: {
      anxiety: true,
      depression: false,
      bipolar: false,
      epilepsy: false,
      stroke: false,
      alzheimers: false,
    },
    hematologic: {
      anemia: false,
      bleedingDisorder: false,
      leukemia: false,
      hemophilia: false,
    },
    generalHealth: {
      cancer: false,
      autoimmune: false,
      arthritis: true,
      organ: false,
      other: false,
    }
  };

  // Mock lifestyle risk factors
  const riskFactors = {
    smoker: 'former', // 'never', 'former', 'current'
    alcoholUse: 'moderate', // 'none', 'occasional', 'moderate', 'heavy'
    recreationalDrugs: false,
    exerciseFrequency: 'moderate', // 'none', 'light', 'moderate', 'heavy'
    diet: 'balanced', // 'poor', 'balanced', 'excellent'
  };

  const primaryPhysician = 'Dr. Sarah Johnson';
  const lastExamDate = '2024-02-15';
  const notes = 'Patient reports occasional jaw pain when waking up in the morning. Probable bruxism.';

  const formatConditionName = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Medical History: {patientName}</h2>
      
      <div className="space-y-8">
        {/* Vitals Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Vitals</h3>
          <Card>
            <CardHeader>
              <CardTitle>Patient Vitals</CardTitle>
              <CardDescription>Last recorded: {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-md p-4 border border-blue-100 flex items-start">
                  <LineChart className="w-10 h-10 text-blue-600 mr-3" />
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-semibold">Blood Pressure</p>
                    <p className="text-lg font-medium">{vitals.bloodPressure} mmHg</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-md p-4 border border-blue-100 flex items-start">
                  <Heart className="w-10 h-10 text-red-500 mr-3" />
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-semibold">Heart Rate</p>
                    <p className="text-lg font-medium">{vitals.heartRate} bpm</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-md p-4 border border-blue-100 flex items-start">
                  <Gauge className="w-10 h-10 text-teal-500 mr-3" />
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-semibold">Respiratory Rate</p>
                    <p className="text-lg font-medium">{vitals.respiratoryRate} breaths/min</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-md p-4 border border-blue-100 flex items-start">
                  <Thermometer className="w-10 h-10 text-orange-500 mr-3" />
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-semibold">Temperature</p>
                    <p className="text-lg font-medium">{vitals.temperature} °F</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-md p-4 border border-blue-100 flex items-start">
                  <Droplets className="w-10 h-10 text-blue-400 mr-3" />
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-semibold">Oxygen Saturation</p>
                    <p className="text-lg font-medium">{vitals.oxygenSaturation}%</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-md p-4 border border-blue-100 flex items-start">
                  <Scale className="w-10 h-10 text-purple-500 mr-3" />
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-semibold">Weight / Height / BMI</p>
                    <p className="text-lg font-medium">{vitals.weight} lbs / {vitals.height} / {vitals.bmi}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Medical History Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Medical Conditions</h3>
          <Card>
            <CardHeader>
              <CardTitle>Medical Conditions</CardTitle>
              <CardDescription>Patient's reported medical history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Significant Medical Conditions */}
              <div className="space-y-5">
                {/* Cardiovascular */}
                {Object.entries(medicalConditions.cardiovascular).some(([_, value]) => value) && (
                  <div>
                    <h5 className="text-base font-medium flex items-center mb-2">
                      <Heart className="w-5 h-5 mr-2 text-red-600" />
                      Cardiovascular
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(medicalConditions.cardiovascular)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => (
                          <Badge key={key} variant="outline" className="bg-red-50 text-red-800">
                            {formatConditionName(key)}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                )}
                
                {/* Respiratory */}
                {Object.entries(medicalConditions.respiratory).some(([_, value]) => value) && (
                  <div>
                    <h5 className="text-base font-medium flex items-center mb-2">
                      <Gauge className="w-5 h-5 mr-2 text-blue-600" />
                      Respiratory
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(medicalConditions.respiratory)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => (
                          <Badge key={key} variant="outline" className="bg-blue-50 text-blue-800">
                            {formatConditionName(key)}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                )}
                
                {/* Endocrine */}
                {Object.entries(medicalConditions.endocrine).some(([_, value]) => value) && (
                  <div>
                    <h5 className="text-base font-medium flex items-center mb-2">
                      <Activity className="w-5 h-5 mr-2 text-green-600" />
                      Endocrine
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(medicalConditions.endocrine)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => (
                          <Badge key={key} variant="outline" className="bg-green-50 text-green-800">
                            {formatConditionName(key)}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                )}
                
                {/* Neurological/Psychiatric */}
                {Object.entries(medicalConditions.neurologicalPsychiatric).some(([_, value]) => value) && (
                  <div>
                    <h5 className="text-base font-medium flex items-center mb-2">
                      <Brain className="w-5 h-5 mr-2 text-purple-600" />
                      Neurological/Psychiatric
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(medicalConditions.neurologicalPsychiatric)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => (
                          <Badge key={key} variant="outline" className="bg-purple-50 text-purple-800">
                            {formatConditionName(key)}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                )}
                
                {/* General Health */}
                {Object.entries(medicalConditions.generalHealth).some(([_, value]) => value) && (
                  <div>
                    <h5 className="text-base font-medium flex items-center mb-2">
                      <Stethoscope className="w-5 h-5 mr-2 text-teal-600" />
                      General Health
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(medicalConditions.generalHealth)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => (
                          <Badge key={key} variant="outline" className="bg-teal-50 text-teal-800">
                            {formatConditionName(key)}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
              
              {/* Medical Care Information */}
              <div className="border-t pt-6">
                <h4 className="text-base font-medium mb-3 flex items-center">
                  <FileQuestion className="w-5 h-5 mr-2 text-blue-600" />
                  Medical Care Information
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                    <div className="text-xs text-blue-600 mb-1">Primary Care Physician</div>
                    <div className="text-sm font-medium">
                      {primaryPhysician}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                    <div className="text-xs text-blue-600 mb-1">Last Physical Exam</div>
                    <div className="text-sm font-medium">
                      {new Date(lastExamDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              {notes && (
                <div className="border-t pt-6">
                  <h4 className="text-base font-medium mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-600" />
                    Clinical Notes
                  </h4>
                  
                  <div className="p-3 border rounded-md bg-gray-50">
                    <p className="text-sm">{notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        
        {/* Risk Factors Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Risk Factors & Lifestyle</h3>
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors & Lifestyle</CardTitle>
              <CardDescription>Health-related behaviors and risk factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tobacco Use */}
                <div className="bg-amber-50 rounded-lg border border-amber-100 p-4">
                  <h5 className="text-base font-medium flex items-center mb-3">
                    <PenTool className="w-5 h-5 mr-2 text-amber-600" />
                    Tobacco Use
                  </h5>
                  <div className="text-sm">
                    <p className="mb-2"><span className="font-medium">Status:</span> {riskFactors.smoker === 'never' ? 'Never smoked' : riskFactors.smoker === 'former' ? 'Former smoker' : 'Current smoker'}</p>
                    {riskFactors.smoker !== 'never' && (
                      <div className="pl-4 border-l-2 border-amber-200">
                        <p className="text-amber-800">May have increased risk for oral cancer, periodontal disease, and delayed healing.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Alcohol Use */}
                <div className="bg-purple-50 rounded-lg border border-purple-100 p-4">
                  <h5 className="text-base font-medium flex items-center mb-3">
                    <Droplets className="w-5 h-5 mr-2 text-purple-600" />
                    Alcohol Consumption
                  </h5>
                  <div className="text-sm">
                    <p className="mb-2"><span className="font-medium">Level:</span> {riskFactors.alcoholUse.charAt(0).toUpperCase() + riskFactors.alcoholUse.slice(1)}</p>
                    {(riskFactors.alcoholUse === 'moderate' || riskFactors.alcoholUse === 'heavy') && (
                      <div className="pl-4 border-l-2 border-purple-200">
                        <p className="text-purple-800">May contribute to dry mouth and increased risk of oral cancer.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Exercise */}
                <div className="bg-green-50 rounded-lg border border-green-100 p-4">
                  <h5 className="text-base font-medium flex items-center mb-3">
                    <Activity className="w-5 h-5 mr-2 text-green-600" />
                    Physical Activity
                  </h5>
                  <div className="text-sm">
                    <p className="mb-2"><span className="font-medium">Exercise frequency:</span> {riskFactors.exerciseFrequency.charAt(0).toUpperCase() + riskFactors.exerciseFrequency.slice(1)}</p>
                    {riskFactors.exerciseFrequency === 'none' && (
                      <div className="pl-4 border-l-2 border-green-200">
                        <p className="text-green-800">Sedentary lifestyle may increase inflammatory responses in the body.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Diet */}
                <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
                  <h5 className="text-base font-medium flex items-center mb-3">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Dietary Habits
                  </h5>
                  <div className="text-sm">
                    <p className="mb-2"><span className="font-medium">Diet quality:</span> {riskFactors.diet.charAt(0).toUpperCase() + riskFactors.diet.slice(1)}</p>
                    {riskFactors.diet === 'poor' && (
                      <div className="pl-4 border-l-2 border-blue-200">
                        <p className="text-blue-800">Poor nutrition may impact oral health and healing capacity.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-base font-medium mb-3">Risk Assessment</h4>
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="font-medium">Moderate Risk</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Based on the patient's medical history and lifestyle factors, they are at moderate risk for dental conditions including periodontal disease and decay. Regular 6-month recall appointments recommended.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default CompletedMedicalHistory;