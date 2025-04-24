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
  FileText,
  AlertTriangle
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
    <div className="p-4">
      <div className="flex items-center mb-6">
        <Stethoscope className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold">Medical History: {patientName}</h2>
      </div>
      
      <div className="space-y-5">
        {/* Vitals Section */}
        <section>
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <LineChart className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium mb-0">Patient Vitals</CardTitle>
                  <div className="text-sm text-muted-foreground">Last recorded: {new Date().toLocaleDateString()}</div>
                </div>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-indigo-50 rounded-md p-3 border border-indigo-100 flex items-center">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <LineChart className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-medium">Blood Pressure</p>
                    <p className="text-sm font-medium">{vitals.bloodPressure} mmHg</p>
                  </div>
                </div>
                
                <div className="bg-indigo-50 rounded-md p-3 border border-indigo-100 flex items-center">
                  <div className="bg-red-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <Heart className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-medium">Heart Rate</p>
                    <p className="text-sm font-medium">{vitals.heartRate} bpm</p>
                  </div>
                </div>
                
                <div className="bg-indigo-50 rounded-md p-3 border border-indigo-100 flex items-center">
                  <div className="bg-teal-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <Gauge className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-medium">Respiratory Rate</p>
                    <p className="text-sm font-medium">{vitals.respiratoryRate} breaths/min</p>
                  </div>
                </div>
                
                <div className="bg-indigo-50 rounded-md p-3 border border-indigo-100 flex items-center">
                  <div className="bg-orange-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <Thermometer className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-medium">Temperature</p>
                    <p className="text-sm font-medium">{vitals.temperature} °F</p>
                  </div>
                </div>
                
                <div className="bg-indigo-50 rounded-md p-3 border border-indigo-100 flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <Droplets className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-medium">Oxygen Saturation</p>
                    <p className="text-sm font-medium">{vitals.oxygenSaturation}%</p>
                  </div>
                </div>
                
                <div className="bg-indigo-50 rounded-md p-3 border border-indigo-100 flex items-center">
                  <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <Scale className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-medium">Weight / Height / BMI</p>
                    <p className="text-sm font-medium">{vitals.weight} lbs / {vitals.height} / {vitals.bmi}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Medical History Section */}
        <section>
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium mb-0">Medical Conditions</CardTitle>
                  <div className="text-sm text-muted-foreground">Patient's reported medical history</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Significant Medical Conditions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Cardiovascular */}
                  {Object.entries(medicalConditions.cardiovascular).some(([_, value]) => value) && (
                    <div className="bg-red-50 p-3 rounded-md border border-red-100">
                      <h5 className="text-sm font-medium flex items-center mb-2">
                        <div className="bg-red-100 rounded-full p-1.5 mr-2">
                          <Heart className="w-3.5 h-3.5 text-red-600" />
                        </div>
                        Cardiovascular
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(medicalConditions.cardiovascular)
                          .filter(([_, value]) => value)
                          .map(([key, _]) => (
                            <Badge key={key} variant="outline" className="bg-white text-red-700 border-red-200 text-xs">
                              {formatConditionName(key)}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  
                  {/* Respiratory */}
                  {Object.entries(medicalConditions.respiratory).some(([_, value]) => value) && (
                    <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                      <h5 className="text-sm font-medium flex items-center mb-2">
                        <div className="bg-indigo-100 rounded-full p-1.5 mr-2">
                          <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        Respiratory
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(medicalConditions.respiratory)
                          .filter(([_, value]) => value)
                          .map(([key, _]) => (
                            <Badge key={key} variant="outline" className="bg-white text-indigo-700 border-indigo-200 text-xs">
                              {formatConditionName(key)}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  
                  {/* Endocrine */}
                  {Object.entries(medicalConditions.endocrine).some(([_, value]) => value) && (
                    <div className="bg-green-50 p-3 rounded-md border border-green-100">
                      <h5 className="text-sm font-medium flex items-center mb-2">
                        <div className="bg-green-100 rounded-full p-1.5 mr-2">
                          <Activity className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        Endocrine
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(medicalConditions.endocrine)
                          .filter(([_, value]) => value)
                          .map(([key, _]) => (
                            <Badge key={key} variant="outline" className="bg-white text-green-700 border-green-200 text-xs">
                              {formatConditionName(key)}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  
                  {/* Neurological/Psychiatric */}
                  {Object.entries(medicalConditions.neurologicalPsychiatric).some(([_, value]) => value) && (
                    <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
                      <h5 className="text-sm font-medium flex items-center mb-2">
                        <div className="bg-purple-100 rounded-full p-1.5 mr-2">
                          <Brain className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        Neurological/Psychiatric
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(medicalConditions.neurologicalPsychiatric)
                          .filter(([_, value]) => value)
                          .map(([key, _]) => (
                            <Badge key={key} variant="outline" className="bg-white text-purple-700 border-purple-200 text-xs">
                              {formatConditionName(key)}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  
                  {/* General Health */}
                  {Object.entries(medicalConditions.generalHealth).some(([_, value]) => value) && (
                    <div className="bg-teal-50 p-3 rounded-md border border-teal-100">
                      <h5 className="text-sm font-medium flex items-center mb-2">
                        <div className="bg-teal-100 rounded-full p-1.5 mr-2">
                          <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        </div>
                        General Health
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(medicalConditions.generalHealth)
                          .filter(([_, value]) => value)
                          .map(([key, _]) => (
                            <Badge key={key} variant="outline" className="bg-white text-teal-700 border-teal-200 text-xs">
                              {formatConditionName(key)}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Medical Care Information */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <div className="bg-indigo-100 rounded-full p-1.5 mr-2">
                      <FileQuestion className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    Medical Care Information
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-indigo-50 rounded-md p-3 border border-indigo-100">
                      <div className="text-xs text-muted-foreground mb-1">Primary Care Physician</div>
                      <div className="text-sm font-medium">
                        {primaryPhysician}
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-md p-3 border border-indigo-100">
                      <div className="text-xs text-muted-foreground mb-1">Last Physical Exam</div>
                      <div className="text-sm font-medium">
                        {new Date(lastExamDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notes */}
                {notes && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <div className="bg-gray-100 rounded-full p-1.5 mr-2">
                        <FileText className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                      Clinical Notes
                    </h4>
                    
                    <div className="p-3 border rounded-md bg-gray-50">
                      <p className="text-sm">{notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Risk Factors Section */}
        <section>
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <div className="bg-amber-100 rounded-full p-2 mr-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium mb-0">Risk Factors & Lifestyle</CardTitle>
                  <div className="text-sm text-muted-foreground">Health-related behaviors and risk factors</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Tobacco Use */}
                <div className="bg-amber-50 rounded-md border border-amber-100 p-3">
                  <h5 className="text-sm font-medium flex items-center mb-2">
                    <div className="bg-amber-100 rounded-full p-1.5 mr-2">
                      <PenTool className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    Tobacco Use
                  </h5>
                  <div className="text-sm">
                    <p className="mb-1.5 text-sm"><span className="font-medium">Status:</span> {riskFactors.smoker === 'never' ? 'Never smoked' : riskFactors.smoker === 'former' ? 'Former smoker' : 'Current smoker'}</p>
                    {riskFactors.smoker !== 'never' && (
                      <div className="pl-3 border-l-2 border-amber-200 text-xs">
                        <p className="text-amber-800">May have increased risk for oral cancer, periodontal disease, and delayed healing.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Alcohol Use */}
                <div className="bg-purple-50 rounded-md border border-purple-100 p-3">
                  <h5 className="text-sm font-medium flex items-center mb-2">
                    <div className="bg-purple-100 rounded-full p-1.5 mr-2">
                      <Droplets className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    Alcohol Consumption
                  </h5>
                  <div className="text-sm">
                    <p className="mb-1.5 text-sm"><span className="font-medium">Level:</span> {riskFactors.alcoholUse.charAt(0).toUpperCase() + riskFactors.alcoholUse.slice(1)}</p>
                    {(riskFactors.alcoholUse === 'moderate' || riskFactors.alcoholUse === 'heavy') && (
                      <div className="pl-3 border-l-2 border-purple-200 text-xs">
                        <p className="text-purple-800">May contribute to dry mouth and increased risk of oral cancer.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Exercise */}
                <div className="bg-green-50 rounded-md border border-green-100 p-3">
                  <h5 className="text-sm font-medium flex items-center mb-2">
                    <div className="bg-green-100 rounded-full p-1.5 mr-2">
                      <Activity className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    Physical Activity
                  </h5>
                  <div className="text-sm">
                    <p className="mb-1.5 text-sm"><span className="font-medium">Exercise frequency:</span> {riskFactors.exerciseFrequency.charAt(0).toUpperCase() + riskFactors.exerciseFrequency.slice(1)}</p>
                    {riskFactors.exerciseFrequency === 'none' && (
                      <div className="pl-3 border-l-2 border-green-200 text-xs">
                        <p className="text-green-800">Sedentary lifestyle may increase inflammatory responses in the body.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Diet */}
                <div className="bg-indigo-50 rounded-md border border-indigo-100 p-3">
                  <h5 className="text-sm font-medium flex items-center mb-2">
                    <div className="bg-indigo-100 rounded-full p-1.5 mr-2">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    Dietary Habits
                  </h5>
                  <div className="text-sm">
                    <p className="mb-1.5 text-sm"><span className="font-medium">Diet quality:</span> {riskFactors.diet.charAt(0).toUpperCase() + riskFactors.diet.slice(1)}</p>
                    {riskFactors.diet === 'poor' && (
                      <div className="pl-3 border-l-2 border-indigo-200 text-xs">
                        <p className="text-indigo-800">Poor nutrition may impact oral health and healing capacity.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <div className="bg-amber-100 rounded-full p-1.5 mr-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  Risk Assessment
                </h4>
                <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                  <div className="flex items-center mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="font-medium text-sm">Moderate Risk</span>
                  </div>
                  <p className="text-xs text-gray-700">
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