import { useState, useEffect } from 'react';
import PatientHeader from './components/PatientHeader';
import ToothChart from './components/ToothChart';
import ProcedurePalette from './components/ProcedurePalette';
import TreatmentPlanDrawer from './components/TreatmentPlanDrawer';
import ToothDetails from './components/ToothDetails';
import ExamMode from './components/ExamMode';
import PerioChart from './components/PerioChart';
import CompletedMedicalHistory from './components/CompletedMedicalHistory';
import PatientImagingMUI from './components/PatientImagingMUI2';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, selectProcedure, clearSelectedTeeth, selectTooth, selectSurface } from './store/dentalSlice';
import { Surface } from '@/types/dental';
import { NavigationWrapper } from '@/components/NavigationWrapper';
import { Button } from '@/components/ui/button';
import { ClipboardList, X, BarChart3 } from 'lucide-react';

const ToothChartPage = () => {
  const [showToothDetails, setShowToothDetails] = useState(false);
  const [selectedToothForDetails, setSelectedToothForDetails] = useState<number | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const [showTreatmentPlan, setShowTreatmentPlan] = useState(true);
  const [examModeActive, setExamModeActive] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("toothChart");
  
  const { teeth, selectedTeeth, patientViewMode, procedures, patient } = useSelector((state: RootState) => state.dental);
  const dispatch = useDispatch();
  
  // Toggle procedure palette visibility
  const handleTogglePalette = () => {
    setShowPalette(prev => !prev);
    console.log('Toggle procedure palette');
  };
  
  // Handle next tooth selection
  const handleNextTooth = () => {
    if (selectedTeeth.length === 0) {
      // If no tooth is selected, select the first tooth
      dispatch(clearSelectedTeeth());
      dispatch(selectTooth(1));
    } else {
      const lastSelectedTooth = selectedTeeth[selectedTeeth.length - 1];
      if (lastSelectedTooth < 32) {
        // Select next tooth
        const nextTooth = lastSelectedTooth + 1;
        dispatch(clearSelectedTeeth());
        dispatch(selectTooth(nextTooth));
        // Also select default surface
        dispatch(selectSurface(Surface.Occlusal));
      }
    }
  };
  
  // Handle using the last procedure
  const handleLastUsed = () => {
    // Find the most recently used procedure (for simplicity, just use the first favorite)
    const lastUsedProcedure = procedures.find(p => p.isFavorite);
    if (lastUsedProcedure) {
      dispatch(selectProcedure(lastUsedProcedure));
      console.log('Add last used procedure');
    }
  };
  
  // Toggle treatment plan visibility
  const handleToggleTreatmentPlan = () => {
    setShowTreatmentPlan(prev => !prev);
    console.log('Toggle treatment plan');
  };
  
  // Open tooth details modal for the selected tooth
  const handleOpenToothDetails = (toothNumber: number) => {
    setSelectedToothForDetails(toothNumber);
    setShowToothDetails(true);
  };
  
  const selectedTooth = selectedToothForDetails !== null ? teeth[selectedToothForDetails - 1] : null;
  
  // Toggle exam mode
  const toggleExamMode = () => {
    setExamModeActive(prev => !prev);
    // When entering exam mode, hide the palette
    if (!examModeActive) {
      setShowPalette(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // If switching to perio chart, hide the palette
    if (tab === "perioChart") {
      setShowPalette(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Sticky Patient Header */}
      <PatientHeader 
        onTabChange={handleTabChange}
        currentTab={activeTab}
        onStartExamMode={toggleExamMode}
      />
      
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
              <CompletedMedicalHistory patient={patient} />
            </div>
          )}
          
          {/* Images Tab */}
          {activeTab === "images" && (
            <div className="flex-1 overflow-y-auto">
              <PatientImagingMUI patient={patient} />
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
  );
};

export default ToothChartPage;
