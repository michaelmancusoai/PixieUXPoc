import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Heart, 
  Pill, 
  AlertCircle, 
  FileQuestion,
  Activity,
  Droplets,
  Brain,
  Stethoscope,
  PenTool,
  Check,
  Gauge
} from 'lucide-react';

interface MedicalHistoryStepProps {
  onComplete?: () => void;
}

const MedicalHistoryStep = ({ onComplete }: MedicalHistoryStepProps) => {
  // State for each section of medical history
  const [cardiovascular, setCardiovascular] = useState<{[key: string]: boolean}>({
    hypertension: false,
    heartAttack: false,
    angina: false,
    heartMurmur: false,
    arrhythmia: false,
    valveDisease: false,
    congestiveHeartFailure: false,
    pacemaker: false,
    endocarditis: false
  });
  
  const [respiratory, setRespiratory] = useState<{[key: string]: boolean}>({
    asthma: false,
    copd: false,
    sleepApnea: false,
    tuberculosis: false,
    sinusitis: false,
    bronchitis: false
  });
  
  const [endocrine, setEndocrine] = useState<{[key: string]: boolean}>({
    diabetes: false,
    thyroidDisorder: false,
    adrenalDisorder: false,
    osteoporosis: false
  });
  
  const [hematologic, setHematologic] = useState<{[key: string]: boolean}>({
    anemia: false,
    bleedingDisorder: false,
    leukemia: false,
    hemophilia: false
  });
  
  const [neurologicalPsychiatric, setNeurologicalPsychiatric] = useState<{[key: string]: boolean}>({
    anxiety: false,
    depression: false,
    bipolar: false,
    schizophrenia: false,
    parkinsons: false,
    epilepsy: false,
    stroke: false,
    alzheimers: false,
    adhd: false
  });
  
  const [generalHealth, setGeneralHealth] = useState<{[key: string]: boolean}>({
    cancer: false,
    radiationTherapy: false,
    chemotherapy: false,
    organTransplant: false,
    artificalJoint: false,
    implantedDevices: false,
    autoimmune: false
  });
  
  // Smoking status
  const [smoker, setSmoker] = useState<string>('never'); // 'never', 'former', 'current'
  const [alcoholUse, setAlcoholUse] = useState<string>('none'); // 'none', 'occasional', 'moderate', 'heavy'
  
  // General notes
  const [notes, setNotes] = useState<string>('');
  
  // Last medical exam
  const [lastExamDate, setLastExamDate] = useState<string>('');
  const [primaryPhysician, setPrimaryPhysician] = useState<string>('');
  
  // Helper function to count positive responses
  const countPositiveResponses = (): number => {
    let count = 0;
    
    for (const condition of Object.values(cardiovascular)) {
      if (condition) count++;
    }
    
    for (const condition of Object.values(respiratory)) {
      if (condition) count++;
    }
    
    for (const condition of Object.values(endocrine)) {
      if (condition) count++;
    }
    
    for (const condition of Object.values(hematologic)) {
      if (condition) count++;
    }
    
    for (const condition of Object.values(neurologicalPsychiatric)) {
      if (condition) count++;
    }
    
    for (const condition of Object.values(generalHealth)) {
      if (condition) count++;
    }
    
    if (smoker === 'current' || smoker === 'former') count++;
    if (alcoholUse === 'moderate' || alcoholUse === 'heavy') count++;
    
    return count;
  };
  
  // Toggle a condition in any category
  const toggleCondition = (category: string, condition: string, value: boolean) => {
    switch (category) {
      case 'cardiovascular':
        setCardiovascular({
          ...cardiovascular,
          [condition]: value
        });
        break;
      case 'respiratory':
        setRespiratory({
          ...respiratory,
          [condition]: value
        });
        break;
      case 'endocrine':
        setEndocrine({
          ...endocrine,
          [condition]: value
        });
        break;
      case 'hematologic':
        setHematologic({
          ...hematologic,
          [condition]: value
        });
        break;
      case 'neurologicalPsychiatric':
        setNeurologicalPsychiatric({
          ...neurologicalPsychiatric,
          [condition]: value
        });
        break;
      case 'generalHealth':
        setGeneralHealth({
          ...generalHealth,
          [condition]: value
        });
        break;
    }
  };
  
  // Component to render a condition checkbox
  const ConditionCheckbox = ({ 
    category, 
    id, 
    label, 
    checked,
    disabledNote
  }: { 
    category: string; 
    id: string; 
    label: string; 
    checked: boolean;
    disabledNote?: string;
  }) => (
    <div className="flex items-center space-x-2 mb-3">
      <Checkbox 
        id={id} 
        checked={checked}
        onCheckedChange={(checked) => toggleCondition(category, id, checked as boolean)}
        disabled={!!disabledNote}
      />
      <div>
        <Label 
          htmlFor={id} 
          className={`text-sm ${disabledNote ? 'text-gray-400' : ''}`}
        >
          {label}
        </Label>
        {disabledNote && (
          <p className="text-xs text-gray-400 mt-0.5">{disabledNote}</p>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Medical History</h3>
          <p className="text-sm text-gray-600">
            Record patient's medical conditions, lifestyle factors, and past health events.
          </p>
        </div>
        
        <Badge variant="outline" className="bg-blue-50 text-blue-800">
          {countPositiveResponses()} conditions
        </Badge>
      </div>
      
      {/* Summary Section - Always Visible */}
      <Card className="mb-4">
        <CardContent className="pt-6 pb-4">
          <h4 className="text-base font-medium mb-3 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-indigo-600" />
            Medical History Summary
          </h4>
          
          {countPositiveResponses() > 0 ? (
            <div className="space-y-3">
              {/* Cardiovascular */}
              {Object.entries(cardiovascular).some(([_, value]) => value) && (
                <div className="bg-red-50 p-2 rounded-md border border-red-100">
                  <h5 className="text-sm font-medium flex items-center mb-1">
                    <Heart className="w-4 h-4 mr-1 text-red-600" />
                    Cardiovascular
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(cardiovascular)
                      .filter(([_, value]) => value)
                      .map(([key, _]) => (
                        <Badge key={key} variant="outline" className="bg-white text-red-700 border-red-200 text-xs">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              )}
              
              {/* Respiratory */}
              {Object.entries(respiratory).some(([_, value]) => value) && (
                <div className="bg-blue-50 p-2 rounded-md border border-blue-100">
                  <h5 className="text-sm font-medium flex items-center mb-1">
                    <Gauge className="w-4 h-4 mr-1 text-blue-600" />
                    Respiratory
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(respiratory)
                      .filter(([_, value]) => value)
                      .map(([key, _]) => (
                        <Badge key={key} variant="outline" className="bg-white text-blue-700 border-blue-200 text-xs">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              )}
              
              {/* Endocrine */}
              {Object.entries(endocrine).some(([_, value]) => value) && (
                <div className="bg-green-50 p-2 rounded-md border border-green-100">
                  <h5 className="text-sm font-medium flex items-center mb-1">
                    <Activity className="w-4 h-4 mr-1 text-green-600" />
                    Endocrine
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(endocrine)
                      .filter(([_, value]) => value)
                      .map(([key, _]) => (
                        <Badge key={key} variant="outline" className="bg-white text-green-700 border-green-200 text-xs">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              )}
              
              {/* Other categories can be expanded here */}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              No medical conditions have been selected yet. Use the sections below to record patient's medical history.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="categories">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cardiovascular Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-600" />
                  <CardTitle className="text-base">Cardiovascular</CardTitle>
                </div>
                <CardDescription>Heart and circulation conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ConditionCheckbox 
                    category="cardiovascular" 
                    id="hypertension" 
                    label="Hypertension" 
                    checked={cardiovascular.hypertension} 
                  />
                  <ConditionCheckbox 
                    category="cardiovascular" 
                    id="heartAttack" 
                    label="Heart Attack" 
                    checked={cardiovascular.heartAttack} 
                  />
                  <ConditionCheckbox 
                    category="cardiovascular" 
                    id="angina" 
                    label="Angina/Chest Pain" 
                    checked={cardiovascular.angina} 
                  />
                  <ConditionCheckbox 
                    category="cardiovascular" 
                    id="heartMurmur" 
                    label="Heart Murmur" 
                    checked={cardiovascular.heartMurmur} 
                  />
                  <ConditionCheckbox 
                    category="cardiovascular" 
                    id="arrhythmia" 
                    label="Arrhythmia" 
                    checked={cardiovascular.arrhythmia} 
                  />
                  <ConditionCheckbox 
                    category="cardiovascular" 
                    id="valveDisease" 
                    label="Heart Valve Disease" 
                    checked={cardiovascular.valveDisease} 
                  />
                  <ConditionCheckbox 
                    category="cardiovascular" 
                    id="congestiveHeartFailure" 
                    label="Congestive Heart Failure" 
                    checked={cardiovascular.congestiveHeartFailure} 
                  />
                  <ConditionCheckbox 
                    category="cardiovascular" 
                    id="pacemaker" 
                    label="Pacemaker" 
                    checked={cardiovascular.pacemaker} 
                  />
                  <ConditionCheckbox 
                    category="cardiovascular" 
                    id="endocarditis" 
                    label="Endocarditis" 
                    checked={cardiovascular.endocarditis} 
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Respiratory Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Gauge className="w-5 h-5 mr-2 text-blue-600" />
                  <CardTitle className="text-base">Respiratory</CardTitle>
                </div>
                <CardDescription>Lung and breathing conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ConditionCheckbox 
                    category="respiratory" 
                    id="asthma" 
                    label="Asthma" 
                    checked={respiratory.asthma} 
                  />
                  <ConditionCheckbox 
                    category="respiratory" 
                    id="copd" 
                    label="COPD/Emphysema" 
                    checked={respiratory.copd} 
                  />
                  <ConditionCheckbox 
                    category="respiratory" 
                    id="sleepApnea" 
                    label="Sleep Apnea" 
                    checked={respiratory.sleepApnea} 
                  />
                  <ConditionCheckbox 
                    category="respiratory" 
                    id="tuberculosis" 
                    label="Tuberculosis" 
                    checked={respiratory.tuberculosis} 
                  />
                  <ConditionCheckbox 
                    category="respiratory" 
                    id="sinusitis" 
                    label="Chronic Sinusitis" 
                    checked={respiratory.sinusitis} 
                  />
                  <ConditionCheckbox 
                    category="respiratory" 
                    id="bronchitis" 
                    label="Chronic Bronchitis" 
                    checked={respiratory.bronchitis} 
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Endocrine Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  <CardTitle className="text-base">Endocrine</CardTitle>
                </div>
                <CardDescription>Hormone and metabolic conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ConditionCheckbox 
                    category="endocrine" 
                    id="diabetes" 
                    label="Diabetes" 
                    checked={endocrine.diabetes} 
                  />
                  <ConditionCheckbox 
                    category="endocrine" 
                    id="thyroidDisorder" 
                    label="Thyroid Disorder" 
                    checked={endocrine.thyroidDisorder} 
                  />
                  <ConditionCheckbox 
                    category="endocrine" 
                    id="adrenalDisorder" 
                    label="Adrenal Disorder" 
                    checked={endocrine.adrenalDisorder} 
                  />
                  <ConditionCheckbox 
                    category="endocrine" 
                    id="osteoporosis" 
                    label="Osteoporosis" 
                    checked={endocrine.osteoporosis} 
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Hematologic Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Droplets className="w-5 h-5 mr-2 text-red-500" />
                  <CardTitle className="text-base">Hematologic</CardTitle>
                </div>
                <CardDescription>Blood and bleeding conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ConditionCheckbox 
                    category="hematologic" 
                    id="anemia" 
                    label="Anemia" 
                    checked={hematologic.anemia} 
                  />
                  <ConditionCheckbox 
                    category="hematologic" 
                    id="bleedingDisorder" 
                    label="Bleeding Disorder" 
                    checked={hematologic.bleedingDisorder} 
                  />
                  <ConditionCheckbox 
                    category="hematologic" 
                    id="leukemia" 
                    label="Leukemia" 
                    checked={hematologic.leukemia} 
                  />
                  <ConditionCheckbox 
                    category="hematologic" 
                    id="hemophilia" 
                    label="Hemophilia" 
                    checked={hematologic.hemophilia} 
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Neurological/Psychiatric Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  <CardTitle className="text-base">Neurological/Psychiatric</CardTitle>
                </div>
                <CardDescription>Mental and nervous system conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ConditionCheckbox 
                    category="neurologicalPsychiatric" 
                    id="anxiety" 
                    label="Anxiety" 
                    checked={neurologicalPsychiatric.anxiety} 
                  />
                  <ConditionCheckbox 
                    category="neurologicalPsychiatric" 
                    id="depression" 
                    label="Depression" 
                    checked={neurologicalPsychiatric.depression} 
                  />
                  <ConditionCheckbox 
                    category="neurologicalPsychiatric" 
                    id="bipolar" 
                    label="Bipolar Disorder" 
                    checked={neurologicalPsychiatric.bipolar} 
                  />
                  <ConditionCheckbox 
                    category="neurologicalPsychiatric" 
                    id="schizophrenia" 
                    label="Schizophrenia" 
                    checked={neurologicalPsychiatric.schizophrenia} 
                  />
                  <ConditionCheckbox 
                    category="neurologicalPsychiatric" 
                    id="parkinsons" 
                    label="Parkinson's Disease" 
                    checked={neurologicalPsychiatric.parkinsons} 
                  />
                  <ConditionCheckbox 
                    category="neurologicalPsychiatric" 
                    id="epilepsy" 
                    label="Epilepsy/Seizures" 
                    checked={neurologicalPsychiatric.epilepsy} 
                  />
                  <ConditionCheckbox 
                    category="neurologicalPsychiatric" 
                    id="stroke" 
                    label="Stroke/TIA" 
                    checked={neurologicalPsychiatric.stroke} 
                  />
                  <ConditionCheckbox 
                    category="neurologicalPsychiatric" 
                    id="alzheimers" 
                    label="Alzheimer's/Dementia" 
                    checked={neurologicalPsychiatric.alzheimers} 
                  />
                  <ConditionCheckbox 
                    category="neurologicalPsychiatric" 
                    id="adhd" 
                    label="ADHD" 
                    checked={neurologicalPsychiatric.adhd} 
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* General Health Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2 text-teal-600" />
                  <CardTitle className="text-base">General Health</CardTitle>
                </div>
                <CardDescription>Other significant health conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ConditionCheckbox 
                    category="generalHealth" 
                    id="cancer" 
                    label="Cancer" 
                    checked={generalHealth.cancer} 
                  />
                  <ConditionCheckbox 
                    category="generalHealth" 
                    id="radiationTherapy" 
                    label="Radiation Therapy" 
                    checked={generalHealth.radiationTherapy} 
                  />
                  <ConditionCheckbox 
                    category="generalHealth" 
                    id="chemotherapy" 
                    label="Chemotherapy" 
                    checked={generalHealth.chemotherapy} 
                  />
                  <ConditionCheckbox 
                    category="generalHealth" 
                    id="organTransplant" 
                    label="Organ Transplant" 
                    checked={generalHealth.organTransplant} 
                  />
                  <ConditionCheckbox 
                    category="generalHealth" 
                    id="artificalJoint" 
                    label="Artificial Joints/Implants" 
                    checked={generalHealth.artificalJoint} 
                  />
                  <ConditionCheckbox 
                    category="generalHealth" 
                    id="implantedDevices" 
                    label="Other Implanted Devices" 
                    checked={generalHealth.implantedDevices} 
                  />
                  <ConditionCheckbox 
                    category="generalHealth" 
                    id="autoimmune" 
                    label="Autoimmune Disease" 
                    checked={generalHealth.autoimmune} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Lifestyle Factors */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <PenTool className="w-5 h-5 mr-2 text-amber-600" />
                <CardTitle className="text-base">Lifestyle Factors</CardTitle>
              </div>
              <CardDescription>Habits and lifestyle information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Smoking Status */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Smoking/Tobacco Use</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="never-smoked" 
                        name="smoking-status" 
                        checked={smoker === 'never'} 
                        onChange={() => setSmoker('never')}
                      />
                      <Label htmlFor="never-smoked" className="text-sm">Never smoked/used tobacco</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="former-smoker" 
                        name="smoking-status" 
                        checked={smoker === 'former'} 
                        onChange={() => setSmoker('former')}
                      />
                      <Label htmlFor="former-smoker" className="text-sm">Former smoker/tobacco user</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="current-smoker" 
                        name="smoking-status" 
                        checked={smoker === 'current'} 
                        onChange={() => setSmoker('current')}
                      />
                      <Label htmlFor="current-smoker" className="text-sm">Current smoker/tobacco user</Label>
                    </div>
                  </div>
                </div>
                
                {/* Alcohol Use */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Alcohol Consumption</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="none-alcohol" 
                        name="alcohol-use" 
                        checked={alcoholUse === 'none'} 
                        onChange={() => setAlcoholUse('none')}
                      />
                      <Label htmlFor="none-alcohol" className="text-sm">None</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="occasional-alcohol" 
                        name="alcohol-use" 
                        checked={alcoholUse === 'occasional'} 
                        onChange={() => setAlcoholUse('occasional')}
                      />
                      <Label htmlFor="occasional-alcohol" className="text-sm">Occasional (less than 1 drink/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="moderate-alcohol" 
                        name="alcohol-use" 
                        checked={alcoholUse === 'moderate'} 
                        onChange={() => setAlcoholUse('moderate')}
                      />
                      <Label htmlFor="moderate-alcohol" className="text-sm">Moderate (1-7 drinks/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="heavy-alcohol" 
                        name="alcohol-use" 
                        checked={alcoholUse === 'heavy'} 
                        onChange={() => setAlcoholUse('heavy')}
                      />
                      <Label htmlFor="heavy-alcohol" className="text-sm">Heavy (more than 7 drinks/week)</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Medical Provider Information */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <FileQuestion className="w-5 h-5 mr-2 text-blue-600" />
                <CardTitle className="text-base">Medical Care Information</CardTitle>
              </div>
              <CardDescription>Details about medical providers and exams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="primary-physician" className="text-sm">Primary Care Physician</Label>
                    <Input 
                      id="primary-physician" 
                      value={primaryPhysician} 
                      onChange={(e) => setPrimaryPhysician(e.target.value)}
                      placeholder="Dr. Name"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="last-exam-date" className="text-sm">Date of Last Physical Exam</Label>
                    <Input 
                      id="last-exam-date" 
                      type="date" 
                      value={lastExamDate} 
                      onChange={(e) => setLastExamDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Notes Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <PenTool className="w-5 h-5 mr-2 text-gray-600" />
                <CardTitle className="text-base">Additional Notes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Enter any additional information about the patient's medical history here..." 
                className="min-h-[120px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questionnaire" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History Questionnaire</CardTitle>
              <CardDescription>
                Please answer the following questions about your medical history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="cardiovascular">
                  <AccordionTrigger className="text-base font-medium">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-600" />
                      <span>Heart & Cardiovascular</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="border-b pb-2">
                      <p className="font-medium text-sm mb-2">Have you ever had or do you currently have any of the following?</p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">High blood pressure (hypertension)</span>
                          <Switch 
                            checked={cardiovascular.hypertension} 
                            onCheckedChange={(checked) => toggleCondition('cardiovascular', 'hypertension', checked)}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Heart attack (myocardial infarction)</span>
                          <Switch 
                            checked={cardiovascular.heartAttack} 
                            onCheckedChange={(checked) => toggleCondition('cardiovascular', 'heartAttack', checked)}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Chest pain (angina)</span>
                          <Switch 
                            checked={cardiovascular.angina} 
                            onCheckedChange={(checked) => toggleCondition('cardiovascular', 'angina', checked)}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Heart murmur</span>
                          <Switch 
                            checked={cardiovascular.heartMurmur} 
                            onCheckedChange={(checked) => toggleCondition('cardiovascular', 'heartMurmur', checked)}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Irregular heartbeat (arrhythmia)</span>
                          <Switch 
                            checked={cardiovascular.arrhythmia} 
                            onCheckedChange={(checked) => toggleCondition('cardiovascular', 'arrhythmia', checked)}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Heart valve disease/replacement</span>
                          <Switch 
                            checked={cardiovascular.valveDisease} 
                            onCheckedChange={(checked) => toggleCondition('cardiovascular', 'valveDisease', checked)}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Congestive heart failure</span>
                          <Switch 
                            checked={cardiovascular.congestiveHeartFailure} 
                            onCheckedChange={(checked) => toggleCondition('cardiovascular', 'congestiveHeartFailure', checked)}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Pacemaker or implanted defibrillator</span>
                          <Switch 
                            checked={cardiovascular.pacemaker} 
                            onCheckedChange={(checked) => toggleCondition('cardiovascular', 'pacemaker', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="respiratory">
                  <AccordionTrigger className="text-base font-medium">
                    <div className="flex items-center">
                      <Gauge className="w-5 h-5 mr-2 text-blue-600" />
                      <span>Respiratory System</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="border-b pb-2">
                      <p className="font-medium text-sm mb-2">Do you have or have you had any of these respiratory conditions?</p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="respiratory-asthma"
                            checked={respiratory.asthma} 
                            onCheckedChange={(checked) => toggleCondition('respiratory', 'asthma', checked as boolean)}
                          />
                          <Label htmlFor="respiratory-asthma" className="text-sm">Asthma</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="respiratory-copd"
                            checked={respiratory.copd} 
                            onCheckedChange={(checked) => toggleCondition('respiratory', 'copd', checked as boolean)}
                          />
                          <Label htmlFor="respiratory-copd" className="text-sm">COPD/Emphysema</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="respiratory-sleepApnea"
                            checked={respiratory.sleepApnea} 
                            onCheckedChange={(checked) => toggleCondition('respiratory', 'sleepApnea', checked as boolean)}
                          />
                          <Label htmlFor="respiratory-sleepApnea" className="text-sm">Sleep Apnea</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="respiratory-tuberculosis"
                            checked={respiratory.tuberculosis} 
                            onCheckedChange={(checked) => toggleCondition('respiratory', 'tuberculosis', checked as boolean)}
                          />
                          <Label htmlFor="respiratory-tuberculosis" className="text-sm">Tuberculosis</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="respiratory-sinusitis"
                            checked={respiratory.sinusitis} 
                            onCheckedChange={(checked) => toggleCondition('respiratory', 'sinusitis', checked as boolean)}
                          />
                          <Label htmlFor="respiratory-sinusitis" className="text-sm">Chronic Sinusitis</Label>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="endocrine">
                  <AccordionTrigger className="text-base font-medium">
                    <div className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-green-600" />
                      <span>Endocrine System</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="border-b pb-2">
                      <p className="font-medium text-sm mb-2">Do you have any of the following endocrine disorders?</p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="endocrine-diabetes"
                            checked={endocrine.diabetes} 
                            onCheckedChange={(checked) => toggleCondition('endocrine', 'diabetes', checked as boolean)}
                          />
                          <Label htmlFor="endocrine-diabetes" className="text-sm">Diabetes (Type 1 or Type 2)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="endocrine-thyroid"
                            checked={endocrine.thyroidDisorder} 
                            onCheckedChange={(checked) => toggleCondition('endocrine', 'thyroidDisorder', checked as boolean)}
                          />
                          <Label htmlFor="endocrine-thyroid" className="text-sm">Thyroid Disorder</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="endocrine-adrenal"
                            checked={endocrine.adrenalDisorder} 
                            onCheckedChange={(checked) => toggleCondition('endocrine', 'adrenalDisorder', checked as boolean)}
                          />
                          <Label htmlFor="endocrine-adrenal" className="text-sm">Adrenal Disorder</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="endocrine-osteoporosis"
                            checked={endocrine.osteoporosis} 
                            onCheckedChange={(checked) => toggleCondition('endocrine', 'osteoporosis', checked as boolean)}
                          />
                          <Label htmlFor="endocrine-osteoporosis" className="text-sm">Osteoporosis</Label>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="nervous">
                  <AccordionTrigger className="text-base font-medium">
                    <div className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-600" />
                      <span>Neurological & Mental Health</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="border-b pb-2">
                      <p className="font-medium text-sm mb-2">Have you been diagnosed with any of the following?</p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="neuro-anxiety"
                            checked={neurologicalPsychiatric.anxiety} 
                            onCheckedChange={(checked) => toggleCondition('neurologicalPsychiatric', 'anxiety', checked as boolean)}
                          />
                          <Label htmlFor="neuro-anxiety" className="text-sm">Anxiety</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="neuro-depression"
                            checked={neurologicalPsychiatric.depression} 
                            onCheckedChange={(checked) => toggleCondition('neurologicalPsychiatric', 'depression', checked as boolean)}
                          />
                          <Label htmlFor="neuro-depression" className="text-sm">Depression</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="neuro-bipolar"
                            checked={neurologicalPsychiatric.bipolar} 
                            onCheckedChange={(checked) => toggleCondition('neurologicalPsychiatric', 'bipolar', checked as boolean)}
                          />
                          <Label htmlFor="neuro-bipolar" className="text-sm">Bipolar Disorder</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="neuro-epilepsy"
                            checked={neurologicalPsychiatric.epilepsy} 
                            onCheckedChange={(checked) => toggleCondition('neurologicalPsychiatric', 'epilepsy', checked as boolean)}
                          />
                          <Label htmlFor="neuro-epilepsy" className="text-sm">Epilepsy/Seizures</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="neuro-stroke"
                            checked={neurologicalPsychiatric.stroke} 
                            onCheckedChange={(checked) => toggleCondition('neurologicalPsychiatric', 'stroke', checked as boolean)}
                          />
                          <Label htmlFor="neuro-stroke" className="text-sm">Stroke/TIA</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="neuro-alzheimers"
                            checked={neurologicalPsychiatric.alzheimers} 
                            onCheckedChange={(checked) => toggleCondition('neurologicalPsychiatric', 'alzheimers', checked as boolean)}
                          />
                          <Label htmlFor="neuro-alzheimers" className="text-sm">Alzheimer's/Dementia</Label>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="lifestyle">
                  <AccordionTrigger className="text-base font-medium">
                    <div className="flex items-center">
                      <PenTool className="w-5 h-5 mr-2 text-amber-600" />
                      <span>Lifestyle Factors</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="space-y-6">
                      <div>
                        <p className="font-medium text-sm mb-2">Do you smoke or use tobacco products?</p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="never-smoked-q" 
                              name="smoking-status-q" 
                              checked={smoker === 'never'} 
                              onChange={() => setSmoker('never')}
                            />
                            <label htmlFor="never-smoked-q" className="text-sm">Never smoked/used tobacco</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="former-smoker-q" 
                              name="smoking-status-q" 
                              checked={smoker === 'former'} 
                              onChange={() => setSmoker('former')}
                            />
                            <label htmlFor="former-smoker-q" className="text-sm">Former smoker/tobacco user</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="current-smoker-q" 
                              name="smoking-status-q" 
                              checked={smoker === 'current'} 
                              onChange={() => setSmoker('current')}
                            />
                            <label htmlFor="current-smoker-q" className="text-sm">Current smoker/tobacco user</label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium text-sm mb-2">How would you describe your alcohol consumption?</p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="none-alcohol-q" 
                              name="alcohol-use-q" 
                              checked={alcoholUse === 'none'} 
                              onChange={() => setAlcoholUse('none')}
                            />
                            <label htmlFor="none-alcohol-q" className="text-sm">None</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="occasional-alcohol-q" 
                              name="alcohol-use-q" 
                              checked={alcoholUse === 'occasional'} 
                              onChange={() => setAlcoholUse('occasional')}
                            />
                            <label htmlFor="occasional-alcohol-q" className="text-sm">Occasional (less than 1 drink/week)</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="moderate-alcohol-q" 
                              name="alcohol-use-q" 
                              checked={alcoholUse === 'moderate'} 
                              onChange={() => setAlcoholUse('moderate')}
                            />
                            <label htmlFor="moderate-alcohol-q" className="text-sm">Moderate (1-7 drinks/week)</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              id="heavy-alcohol-q" 
                              name="alcohol-use-q" 
                              checked={alcoholUse === 'heavy'} 
                              onChange={() => setAlcoholUse('heavy')}
                            />
                            <label htmlFor="heavy-alcohol-q" className="text-sm">Heavy (more than 7 drinks/week)</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="additional">
                  <AccordionTrigger className="text-base font-medium">
                    <div className="flex items-center">
                      <FileQuestion className="w-5 h-5 mr-2 text-gray-600" />
                      <span>Additional Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <Label htmlFor="primary-physician-q" className="text-sm">Primary Care Physician</Label>
                      <Input 
                        id="primary-physician-q" 
                        value={primaryPhysician} 
                        onChange={(e) => setPrimaryPhysician(e.target.value)}
                        placeholder="Dr. Name"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="last-exam-date-q" className="text-sm">Date of Last Physical Exam</Label>
                      <Input 
                        id="last-exam-date-q" 
                        type="date" 
                        value={lastExamDate} 
                        onChange={(e) => setLastExamDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes-q" className="text-sm">Additional Notes or Information</Label>
                      <Textarea 
                        id="notes-q"
                        placeholder="Please add any additional information about your medical history here..." 
                        className="min-h-[120px] mt-1"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History Summary</CardTitle>
              <CardDescription>
                Overview of patient's medical conditions and health factors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Positive Findings */}
              <div>
                <h4 className="text-base font-medium mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                  Significant Medical Conditions
                </h4>
                
                {countPositiveResponses() > 0 ? (
                  <div className="space-y-4">
                    {/* Cardiovascular */}
                    {Object.entries(cardiovascular).some(([_, value]) => value) && (
                      <div>
                        <h5 className="text-sm font-medium flex items-center mb-1">
                          <Heart className="w-4 h-4 mr-1 text-red-600" />
                          Cardiovascular
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(cardiovascular)
                            .filter(([_, value]) => value)
                            .map(([key, _]) => (
                              <Badge key={key} variant="outline" className="bg-red-50 text-red-800">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Badge>
                            ))
                          }
                        </div>
                      </div>
                    )}
                    
                    {/* Respiratory */}
                    {Object.entries(respiratory).some(([_, value]) => value) && (
                      <div>
                        <h5 className="text-sm font-medium flex items-center mb-1">
                          <Gauge className="w-4 h-4 mr-1 text-blue-600" />
                          Respiratory
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(respiratory)
                            .filter(([_, value]) => value)
                            .map(([key, _]) => (
                              <Badge key={key} variant="outline" className="bg-blue-50 text-blue-800">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Badge>
                            ))
                          }
                        </div>
                      </div>
                    )}
                    
                    {/* Endocrine */}
                    {Object.entries(endocrine).some(([_, value]) => value) && (
                      <div>
                        <h5 className="text-sm font-medium flex items-center mb-1">
                          <Activity className="w-4 h-4 mr-1 text-green-600" />
                          Endocrine
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(endocrine)
                            .filter(([_, value]) => value)
                            .map(([key, _]) => (
                              <Badge key={key} variant="outline" className="bg-green-50 text-green-800">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Badge>
                            ))
                          }
                        </div>
                      </div>
                    )}
                    
                    {/* Hematologic */}
                    {Object.entries(hematologic).some(([_, value]) => value) && (
                      <div>
                        <h5 className="text-sm font-medium flex items-center mb-1">
                          <Droplets className="w-4 h-4 mr-1 text-red-500" />
                          Hematologic
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(hematologic)
                            .filter(([_, value]) => value)
                            .map(([key, _]) => (
                              <Badge key={key} variant="outline" className="bg-red-50 text-red-800">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Badge>
                            ))
                          }
                        </div>
                      </div>
                    )}
                    
                    {/* Neurological/Psychiatric */}
                    {Object.entries(neurologicalPsychiatric).some(([_, value]) => value) && (
                      <div>
                        <h5 className="text-sm font-medium flex items-center mb-1">
                          <Brain className="w-4 h-4 mr-1 text-purple-600" />
                          Neurological/Psychiatric
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(neurologicalPsychiatric)
                            .filter(([_, value]) => value)
                            .map(([key, _]) => (
                              <Badge key={key} variant="outline" className="bg-purple-50 text-purple-800">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Badge>
                            ))
                          }
                        </div>
                      </div>
                    )}
                    
                    {/* General Health */}
                    {Object.entries(generalHealth).some(([_, value]) => value) && (
                      <div>
                        <h5 className="text-sm font-medium flex items-center mb-1">
                          <Stethoscope className="w-4 h-4 mr-1 text-teal-600" />
                          General Health
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(generalHealth)
                            .filter(([_, value]) => value)
                            .map(([key, _]) => (
                              <Badge key={key} variant="outline" className="bg-teal-50 text-teal-800">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Badge>
                            ))
                          }
                        </div>
                      </div>
                    )}
                    
                    {/* Lifestyle Factors */}
                    {(smoker !== 'never' || alcoholUse === 'moderate' || alcoholUse === 'heavy') && (
                      <div>
                        <h5 className="text-sm font-medium flex items-center mb-1">
                          <PenTool className="w-4 h-4 mr-1 text-amber-600" />
                          Lifestyle Factors
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {smoker === 'current' && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-800">
                              Current Smoker
                            </Badge>
                          )}
                          {smoker === 'former' && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-800">
                              Former Smoker
                            </Badge>
                          )}
                          {alcoholUse === 'moderate' && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-800">
                              Moderate Alcohol Use
                            </Badge>
                          )}
                          {alcoholUse === 'heavy' && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-800">
                              Heavy Alcohol Use
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
                    <p className="text-gray-500 text-sm">No significant medical conditions reported</p>
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
                      {primaryPhysician || 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                    <div className="text-xs text-blue-600 mb-1">Last Physical Exam</div>
                    <div className="text-sm font-medium">
                      {lastExamDate ? new Date(lastExamDate).toLocaleDateString() : 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              {notes && (
                <div className="border-t pt-6">
                  <h4 className="text-base font-medium mb-3 flex items-center">
                    <PenTool className="w-5 h-5 mr-2 text-gray-600" />
                    Additional Notes
                  </h4>
                  
                  <div className="p-3 border rounded-md bg-gray-50">
                    <p className="text-sm">{notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-1 text-green-600" />
                Medical history recorded: {new Date().toLocaleDateString()}
              </div>
              <Button
                onClick={onComplete}
                variant="default"
              >
                Update Medical History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalHistoryStep;