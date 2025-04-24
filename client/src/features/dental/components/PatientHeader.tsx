import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, togglePatientViewMode } from '../store/dentalSlice';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, User, AlertTriangle } from 'lucide-react';

type PatientHeaderProps = {
  onTabChange?: (tab: string) => void;
  currentTab?: string;
  onStartExamMode?: () => void;
};

const PatientHeader = ({ onTabChange, currentTab = "toothChart", onStartExamMode }: PatientHeaderProps) => {
  const { patient, patientViewMode } = useSelector((state: RootState) => state.dental);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const handleStartExamMode = () => {
    if (onStartExamMode) {
      onStartExamMode();
      toast({
        title: "Exam Mode Started",
        description: "Now entering examination mode.",
        duration: 3000,
      });
    }
  };
  
  return (
    <div className="bg-white shadow-md w-full" role="banner">
      <div className="w-full px-6 py-2 flex items-center justify-between border-b">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <User className="text-primary h-5 w-5" />
            <div className="ml-2">
              <h1 className="text-lg font-medium">{patient.name}</h1>
              <div className="text-xs text-gray-500">
                ID: {patient.id} • {patient.age}y • Last Visit: {patient.lastVisit}
              </div>
            </div>
          </div>
          
          {patient.alerts.map((alert, index) => (
            <div key={index} className="flex items-center bg-amber-50 text-amber-800 px-2 py-1 rounded text-xs">
              <AlertTriangle className="text-amber-800 h-3 w-3 mr-1" />
              <span>{alert}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium">{patient.insuranceName}</div>
            <div className="text-xs text-gray-500">{patient.insuranceDetails}</div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white" 
              onClick={handleStartExamMode}
              aria-label="Start Exam Mode"
            >
              <ClipboardList className="h-4 w-4" /> Start Exam Mode
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs 
        value={currentTab} 
        onValueChange={(value) => onTabChange && onTabChange(value)}
        className="border-b"
      >
        <div className="w-full">
          <TabsList className="bg-transparent h-auto p-0">
          <TabsTrigger 
            value="toothChart" 
            className="px-4 py-2 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
          >
            Tooth Chart
          </TabsTrigger>
          <TabsTrigger 
            value="perioChart" 
            className="px-4 py-2 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
          >
            Perio Chart
          </TabsTrigger>
          <TabsTrigger 
            value="medicalHistory" 
            className="px-4 py-2 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
          >
            Medical History
          </TabsTrigger>
          <TabsTrigger 
            value="images" 
            className="px-4 py-2 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
          >
            Images
          </TabsTrigger>
        </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default PatientHeader;
