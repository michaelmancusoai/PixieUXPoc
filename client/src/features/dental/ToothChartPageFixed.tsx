import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/dentalSlice';
import { NavigationWrapper } from '@/components/NavigationWrapper';
import PatientHeader from './components/PatientHeader';
import ToothChart from './components/ToothChart';
import ProcedurePalette from './components/ProcedurePalette';
import TreatmentPlanDrawer from './components/TreatmentPlanDrawer';
import ExamMode from './components/ExamMode';
import PerioChart from './components/PerioChart';
import CompletedMedicalHistory from './components/CompletedMedicalHistory';
import PatientImagingMUI from './components/PatientImagingMUI';
import ToothDetails from './components/ToothDetails';
import { useToast } from '@/hooks/use-toast';

const ToothChartPageFixed = () => {
  const dispatch = useDispatch();
  const { patient } = useSelector((state: RootState) => state.dental);
  const [activeTab, setActiveTab] = useState("toothChart");
  const [showPalette, setShowPalette] = useState(false);
  const [showTreatmentPlan, setShowTreatmentPlan] = useState(false);
  const [showToothDetails, setShowToothDetails] = useState(false);
  const [examModeActive, setExamModeActive] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState<any>(null);
  const { toast } = useToast();
  
  // For keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process when not in exam mode
      if (examModeActive) return;
      
      switch (e.key.toUpperCase()) {
        case 'P':
          handleTogglePalette();
          break;
        case 'ARROWRIGHT':
          handleNextTooth();
          break;
        case 'L':
          handleLastUsed();
          break;
        case 'T':
          handleToggleTreatmentPlan();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [examModeActive, selectedTooth, showPalette, showTreatmentPlan]);
  
  // Tab change handler
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Just deactivate the UI, no dispatch needed
    setSelectedTooth(null);
    setShowToothDetails(false);
  };
  
  // Toggle procedures palette
  const handleTogglePalette = () => {
    setShowPalette(prev => !prev);
  };
  
  // Next tooth
  const handleNextTooth = () => {
    if (selectedTooth) {
      const next = selectedTooth === 32 ? 1 : selectedTooth + 1;
      setSelectedTooth(next);
    } else {
      // If no tooth is selected, start with tooth 1
      setSelectedTooth(1);
    }
  };
  
  // Last used procedure
  const handleLastUsed = () => {
    toast({
      title: "Last Used",
      description: "Applying last used procedure",
      duration: 1500,
    });
  };
  
  // Toggle treatment plan drawer
  const handleToggleTreatmentPlan = () => {
    setShowTreatmentPlan(prev => !prev);
  };
  
  // Toggle exam mode
  const toggleExamMode = () => {
    setExamModeActive(true);
    if (showPalette) {
      setShowPalette(false);
    }
  };

  return (
    <>
      <NavigationWrapper>
        {/* Patient Header - Full width edge-to-edge, sticky, and no gap with navigation */}
        <div className="fixed top-[96px] left-0 right-0 w-full z-10 bg-white shadow-md">
          <PatientHeader 
            onTabChange={handleTabChange}
            currentTab={activeTab}
            onStartExamMode={toggleExamMode}
          />
        </div>
        {/* Spacer to prevent content from appearing under the header */}
        <div className="h-[100px] mb-4"></div>
        
        <div className="h-full flex flex-col">
          {examModeActive ? (
            /* Exam Mode */
            <div className="flex-1 relative">
              <ExamMode onClose={() => setExamModeActive(false)} />
            </div>
          ) : (
            <>
              {/* Main Content Area based on active tab */}
              {activeTab === "toothChart" && (
                <>
                  <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel - Tooth Chart */}
                    <div className={showPalette ? "w-3/5" : "w-full"} style={{ height: "100%" }}>
                      <ToothChart 
                        onTogglePalette={handleTogglePalette}
                        onNextTooth={handleNextTooth}
                        onLastUsed={handleLastUsed}
                        onToggleTreatmentPlan={handleToggleTreatmentPlan}
                      />
                    </div>
                    
                    {/* Right Panel - Procedure Palette */}
                    {showPalette && (
                      <div className="w-2/5 h-full relative">
                        <ProcedurePalette />
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom Drawer - Treatment Plan Table */}
                  {showTreatmentPlan && (
                    <div className="h-auto">
                      <TreatmentPlanDrawer />
                    </div>
                  )}
                </>
              )}
              
              {/* Perio Chart Tab */}
              {activeTab === "perioChart" && (
                <div className="flex-1 relative">
                  <PerioChart />
                </div>
              )}
              
              {/* Medical History Tab */}
              {activeTab === "medicalHistory" && (
                <div className="flex-1 overflow-y-auto">
                  <CompletedMedicalHistory patient={{id: String(patient.id), name: patient.name}} />
                </div>
              )}
              
              {/* Images Tab */}
              {activeTab === "images" && (
                <div className="flex-1 overflow-y-auto">
                  <PatientImagingMUI patient={{id: String(patient.id), name: patient.name}} />
                </div>
              )}
            </>
          )}
          
          {/* Tooth Details Modal */}
          <ToothDetails 
            open={showToothDetails} 
            onClose={() => setShowToothDetails(false)} 
            tooth={selectedTooth}
          />
        </div>
      </NavigationWrapper>
    </>
  );
};

export default ToothChartPageFixed;