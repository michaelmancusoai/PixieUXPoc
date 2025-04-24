import { useSelector, useDispatch } from 'react-redux';
import { RootState, setActiveTreatmentPlanTab } from '../store/dentalSlice';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import TreatmentPlanTable from './TreatmentPlanTable';
import { useToast } from '@/hooks/use-toast';

const TreatmentPlanDrawer = () => {
  const { treatmentPlan, activeTreatmentPlanTab } = useSelector((state: RootState) => state.dental);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // Calculate insurance and patient totals
  const calculateTotals = () => {
    const items = treatmentPlan.items;
    
    const insuranceTotal = items.reduce((sum, item) => sum + item.insuranceAmount, 0);
    const patientTotal = items.reduce((sum, item) => sum + item.patientAmount, 0);
    
    return { insuranceTotal, patientTotal };
  };
  
  const { insuranceTotal, patientTotal } = calculateTotals();
  
  const handlePrintPlan = () => {
    toast({
      title: "Printing Treatment Plan",
      description: "The treatment plan is being sent to the printer.",
    });
  };
  
  return (
    <div className="border-t shadow-inner bg-white" aria-label="Treatment Plan">
      {/* Treatment plan tabs */}
      <div className="flex border-b">
        <Tabs 
          value={activeTreatmentPlanTab} 
          onValueChange={(value) => dispatch(setActiveTreatmentPlanTab(value))}
        >
          <TabsList className="bg-transparent h-auto p-0">
            <TabsTrigger 
              value="master" 
              className="px-4 py-2 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              Master Treatment Plan
            </TabsTrigger>
            <TabsTrigger 
              value="alternate" 
              className="px-4 py-2 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              Alternate Plan
            </TabsTrigger>
            <TabsTrigger 
              value="archived" 
              className="px-4 py-2 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="ml-auto flex items-center px-4">
          <div className="flex items-center mr-4">
            <div className="text-xs text-gray-500 mr-2">Insurance Portion:</div>
            <div className="text-sm font-medium">${insuranceTotal.toFixed(2)}</div>
          </div>
          <div className="flex items-center">
            <div className="text-xs text-gray-500 mr-2">Patient Portion:</div>
            <div className="text-sm font-medium text-primary-dark">${patientTotal.toFixed(2)}</div>
          </div>
          <Button 
            size="sm" 
            className="ml-4"
            onClick={handlePrintPlan}
          >
            Print Plan
          </Button>
        </div>
      </div>
      
      {/* Treatment plan table */}
      <div className="h-52">
        <TreatmentPlanTable planType={activeTreatmentPlanTab} />
      </div>
    </div>
  );
};

export default TreatmentPlanDrawer;
