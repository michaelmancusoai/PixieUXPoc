import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addNote } from '../store/dentalSlice';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  CheckCircle2, 
  XCircle,
  ClipboardCheck,
  Clipboard,
  FileText
} from 'lucide-react';
import PerioChartingStep from './PerioChartingStep';
import RiskFactorsStep from './RiskFactorsStep';
import AISummaryStep from './AISummaryStep';
import MedicationsAllergiesStep from './MedicationsAllergiesStep';
import VitalsStep from './VitalsStep';
import ConsolidatedFindingsStep from './ConsolidatedFindingsStep';
import MedicalHistoryStep from './MedicalHistoryStep';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Step interface
interface ExamStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  isCompleted: boolean;
}

interface ExamModeProps {
  onClose?: () => void;
}

const ExamMode = ({ onClose }: ExamModeProps) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { teeth, patient } = useSelector((state: RootState) => state.dental);
  
  // State for tracking current step
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // State for completion dialog
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  // State for AI summary to save as a note
  const [aiSummary, setAiSummary] = useState("");
  
  // Pre-check step component
  const PreCheckStep = () => {
    const [checks, setChecks] = useState({
      insurance: false,
      xrays: false,
      photos: false
    });
    
    const toggleCheck = (key: keyof typeof checks) => {
      setChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    const allChecked = Object.values(checks).every(Boolean);
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pre-Exam Checklist</h3>
        <p className="text-sm text-gray-600">
          Verify that all required information is available before beginning the exam.
        </p>
        
        <div className="space-y-2">
          <div 
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => toggleCheck('insurance')}
          >
            <div className={`flex items-center justify-center w-5 h-5 border rounded ${checks.insurance ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
              {checks.insurance && <Check className="w-4 h-4" />}
            </div>
            <span>Insurance verification complete</span>
          </div>
          
          <div 
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => toggleCheck('xrays')}
          >
            <div className={`flex items-center justify-center w-5 h-5 border rounded ${checks.xrays ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
              {checks.xrays && <Check className="w-4 h-4" />}
            </div>
            <span>X-rays available and reviewed</span>
          </div>
          
          <div 
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => toggleCheck('photos')}
          >
            <div className={`flex items-center justify-center w-5 h-5 border rounded ${checks.photos ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
              {checks.photos && <Check className="w-4 h-4" />}
            </div>
            <span>Intraoral photos taken</span>
          </div>
        </div>
        
        {allChecked && (
          <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span>All pre-exam checks complete. Ready to proceed!</span>
          </div>
        )}
      </div>
    );
  };
  
  // Findings step component for a specific quadrant
  const FindingsStep = ({ quadrant }: { quadrant: 'UR' | 'UL' | 'LL' | 'LR' }) => {
    // Map quadrant to tooth numbers
    const toothRanges = {
      'UR': [1, 2, 3, 4, 5, 6, 7, 8],
      'UL': [9, 10, 11, 12, 13, 14, 15, 16],
      'LL': [24, 23, 22, 21, 20, 19, 18, 17],
      'LR': [32, 31, 30, 29, 28, 27, 26, 25],
    };
    
    const quadrantTeeth = toothRanges[quadrant].map(num => teeth.find(t => t.number === num));
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Findings: {quadrant} Quadrant</h3>
        <p className="text-sm text-gray-600">
          Mark caries, fractures, and existing work for this quadrant.
        </p>
        
        <div className="bg-blue-50 p-3 rounded-md text-sm">
          <ul className="space-y-1 text-blue-800">
            <li className="flex items-center">
              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">1</span> 
              <span>Click on a tooth to select it</span>
            </li>
            <li className="flex items-center">
              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">2</span>
              <span>Use keys 1-5 to select surfaces (O, M, D, B, L)</span>
            </li>
            <li className="flex items-center">
              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">3</span>
              <span>Use C (Caries), R (Restoration), F (Fracture) to mark findings</span>
            </li>
          </ul>
        </div>
        
        <div className="border rounded-md p-4 bg-white">
          <div className="grid grid-cols-8 gap-2">
            {/* This is a placeholder for the actual interactive tooth chart */}
            {toothRanges[quadrant].map(toothNumber => (
              <div key={toothNumber} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-md border border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-blue-50 cursor-pointer">
                  {toothNumber}
                </div>
                <span className="text-xs mt-1">{`Tooth ${toothNumber}`}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md mt-4">
          <h4 className="font-medium text-sm mb-2">Keyboard Shortcuts</h4>
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
      </div>
    );
  };
  
  // Define the steps
  const steps: ExamStep[] = [
    {
      id: 'pre-check',
      title: 'Pre-Check',
      description: 'Verify information is available for exam',
      component: <PreCheckStep />,
      isCompleted: false
    },
    {
      id: 'vitals',
      title: 'Vitals',
      description: 'Record patient vital signs',
      component: <VitalsStep />,
      isCompleted: false
    },
    {
      id: 'risk-factors',
      title: 'Risk Factors',
      description: 'Smoking, diabetes, bruxism, medications',
      component: <RiskFactorsStep />,
      isCompleted: false
    },
    {
      id: 'medical-history',
      title: 'Medical History',
      description: 'Record patient medical conditions and health factors',
      component: <MedicalHistoryStep />,
      isCompleted: false
    },
    {
      id: 'medications-allergies',
      title: 'Med & Allergies',
      description: 'Record medications and allergies information',
      component: <MedicationsAllergiesStep />,
      isCompleted: false
    },
    {
      id: 'findings',
      title: 'Tooth Findings',
      description: 'Record findings for all teeth with voice control',
      component: <ConsolidatedFindingsStep />,
      isCompleted: false
    },
    {
      id: 'perio-charting',
      title: 'Perio Charting',
      description: '6-pt probing, bleeding on probing, recession',
      component: <PerioChartingStep />,
      isCompleted: false
    },
    {
      id: 'ai-summary',
      title: 'AI Summary',
      description: 'Auto-generated findings summary',
      component: <AISummaryStep onSummaryChange={(summary) => setAiSummary(summary)} />,
      isCompleted: false
    }
  ];
  
  // Handle exam completion
  const handleExamCompletion = () => {
    // Mark the current step as completed
    steps[currentStepIndex].isCompleted = true;
    
    // Show completion dialog
    setShowCompletionDialog(true);
  };
  
  // Add note with AI summary and close exam mode
  const completeExam = () => {
    // Add note with AI summary
    if (aiSummary && aiSummary.trim() !== "") {
      dispatch(addNote({
        content: aiSummary,
        type: 'exam'
      }));
    }
    
    // Show success toast
    toast({
      title: "Exam Completed Successfully",
      description: "The exam has been finalized and the summary has been saved to patient notes.",
      variant: "default"
    });
    
    // Close completion dialog
    setShowCompletionDialog(false);
    
    // Close exam mode
    if (onClose) onClose();
  };

  // Navigation functions
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // If we're at the last step, prompt for completion
      handleExamCompletion();
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const jumpToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with progress bar */}
      <div className="border-b p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Exam Mode</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "Exam Mode Closed",
                description: "Your progress has been saved.",
              });
              if (onClose) onClose();
            }}
          >
            Exit
          </Button>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
          <span>Start</span>
          <span>{`Step ${currentStepIndex + 1} of ${steps.length}`}</span>
          <span>Complete</span>
        </div>
      </div>
      
      {/* Main content area with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with step navigation */}
        <div className="w-64 border-r overflow-y-auto bg-gray-50 p-2">
          <div className="space-y-1">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-2 rounded-md cursor-pointer transition-colors ${
                  index === currentStepIndex
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => jumpToStep(index)}
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 ${
                      step.isCompleted
                        ? 'bg-green-100 text-green-700'
                        : index === currentStepIndex
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {step.isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          {steps[currentStepIndex].component}
        </div>
      </div>
      
      {/* Footer with navigation buttons */}
      <div className="border-t p-4 flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Step Skipped",
                description: "You can always come back to this step later.",
                variant: "destructive"
              });
              goToNextStep();
            }}
          >
            Skip
            <XCircle className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            onClick={() => {
              // Mark current step as completed
              steps[currentStepIndex].isCompleted = true;
              
              // Show success toast
              toast({
                title: "Step Completed",
                description: steps[currentStepIndex].title + " has been completed.",
                variant: "default"
              });
              
              // Move to next step
              goToNextStep();
            }}
          >
            {currentStepIndex === steps.length - 1 ? 'Complete Exam' : 'Next'}
            {currentStepIndex === steps.length - 1 ? (
              <ClipboardCheck className="w-4 h-4 ml-2" />
            ) : (
              <ChevronRight className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle2 className="h-6 w-6 text-indigo-600 mr-2" />
              Exam Completed
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="rounded-lg bg-indigo-50 p-4 mb-4">
              <h3 className="font-medium text-indigo-800 mb-2">Examination Summary</h3>
              <p className="text-sm text-indigo-700">
                All examination steps have been completed successfully. The exam findings and AI summary will be saved to the patient's record.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Tooth Findings</h4>
                  <p className="text-sm text-gray-600">Caries, fractures, and existing restorations have been documented</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Periodontal Evaluation</h4>
                  <p className="text-sm text-gray-600">Probing depths, recession, and mobility recorded</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">AI-Generated Summary</h4>
                  <p className="text-sm text-gray-600">Clinical findings summary created to be added to patient notes</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowCompletionDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={completeExam}
            >
              <FileText className="w-4 h-4 mr-2" />
              Save & Exit Exam Mode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamMode;