import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  RootState, 
  selectProcedure, 
  setActiveProcedureCategory, 
  addTreatmentPlanItem
} from '../store/dentalSlice';
import { Procedure, ProcedureCategory, Surface } from '@/types/dental';
import { Button } from '@/components/ui/button';
import { PlusCircle, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProcedurePalette = () => {
  const { 
    procedures, 
    selectedProcedure, 
    activeProcedureCategory, 
    selectedTeeth,
    selectedSurface
  } = useSelector((state: RootState) => state.dental);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const handleSelectProcedure = (procedure: Procedure) => {
    dispatch(selectProcedure(procedure));
  };
  
  const handleAddToTreatmentPlan = () => {
    if (!selectedProcedure) {
      toast({
        title: "No Procedure Selected",
        description: "Please select a procedure first.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedTeeth.length === 0) {
      toast({
        title: "No Teeth Selected",
        description: "Please select at least one tooth first.",
        variant: "destructive",
      });
      return;
    }
    
    // For simplicity, if no surface is selected, default to Occlusal
    const surfaceToUse = selectedSurface || Surface.Occlusal;
    
    dispatch(addTreatmentPlanItem({
      toothNumbers: selectedTeeth,
      surfaces: [surfaceToUse],
      procedure: selectedProcedure,
      provider: 'Dr. Arlene McCoy'
    }));
    
    // Improve feedback with better tooth descriptions
    const toothDescription = selectedTeeth.length === 1 
      ? `tooth ${selectedTeeth[0]}` 
      : `teeth ${selectedTeeth.join(', ')}`;
    
    toast({
      title: "Added to Treatment Plan",
      description: `${selectedProcedure.code} - ${selectedProcedure.description} added for ${toothDescription}.`,
      variant: "default",
    });
    
    // Reset procedure selection but keep tooth/surface for possible additional treatments
    dispatch(selectProcedure(null));
  };
  
  // Track expanded or collapsed state for procedure groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'direct': false,
    'fixed': false,
    'removable': false
  });
  
  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  // Get quick select options based on selected category
  const getQuickSelectOptions = () => {
    switch(activeProcedureCategory) {
      case 'Diag / Img':
        return [
          { label: "Comp Exam + FMX", code: "D0150", subcodes: ["D0210"] },
          { label: "Periodic + BW4", code: "D0120", subcodes: ["D0274"] },
          { label: "Limited + PA", code: "D0140", subcodes: ["D0220"] },
          { label: "FMX Only", code: "D0210" },
          { label: "Pano", code: "D0330" },
          { label: "BW 4-Films", code: "D0274" }
        ];
        
      case 'Prev':
        return [
          { label: "Adult Prophy", code: "D1110" },
          { label: "Child Prophy", code: "D1120" },
          { label: "Gingiv Scale", code: "D4346" },
          { label: "Fl-Varnish", code: "D1206" },
          { label: "Sealant 1T", code: "D1351" },
          { label: "Space-Maint", code: "D1510" }
        ];
        
      case 'Rest / Prosth':
        return [
          // Show main options first
          { label: "Comp Post 1S", code: "D2391", group: "direct" },
          { label: "Zirc Crown", code: "D2740", group: "fixed" },
          { label: "Core Buildup", code: "D2950", group: "direct" },
          { label: "CD U", code: "D5110", group: "removable" },
          { label: "CD L", code: "D5120", group: "removable" },
          { label: "PFM Crown", code: "D2752", group: "fixed" }
        ];
        
      case 'Endo':
        return [
          { label: "RCT Ant", code: "D3310" },
          { label: "RCT Premol", code: "D3320" },
          { label: "RCT Molar", code: "D3330" },
          { label: "Pulpotomy", code: "D3220" },
          { label: "Debridement", code: "D3221" },
          { label: "Apicoectomy", code: "D3410" }
        ];
        
      case 'Perio':
        return [
          { label: "FMD", code: "D4355" },
          { label: "SRP Quad", code: "D4341" },
          { label: "SRP 1-3T", code: "D4342" },
          { label: "Perio Maint", code: "D4910" },
          { label: "Gingivect", code: "D4211" },
          { label: "Bone Graft", code: "D4263" }
        ];
        
      case 'Implants':
        return [
          { label: "Implant Plc", code: "D6010" },
          { label: "Abutment", code: "D6056" },
          { label: "Implant Crn", code: "D6065" },
          { label: "Impl+Ab+Crn", code: "D6010", subcodes: ["D6056", "D6065"] },
          { label: "Mini Implant", code: "D6051" },
          { label: "Impl Remove", code: "D6100" }
        ];
        
      case 'Surgery':
        return [
          { label: "Simple Ext", code: "D7140" },
          { label: "Surg Ext", code: "D7210" },
          { label: "Soft Imp 3M", code: "D7240" },
          { label: "Full-Bony 3M", code: "D7241" },
          { label: "Frenectomy", code: "D7960" },
          { label: "I&D Abscess", code: "D7510" }
        ];
        
      case 'Ortho':
        return [
          { label: "Records", code: "D8660" },
          { label: "Limited Ch", code: "D8070" },
          { label: "Limited Ad", code: "D8670" },
          { label: "Comp Child", code: "D8080" },
          { label: "Comp Adult", code: "D8090" },
          { label: "Aligner Case", code: "D8090" }
        ];
        
      case 'Adjunct':
        return [
          { label: "Nitrous", code: "D9230" },
          { label: "IV Sed (15)", code: "D9223" },
          { label: "Palliative", code: "D9110" },
          { label: "Occl Guard H", code: "D9944" },
          { label: "Bleach Tray", code: "D9975" },
          { label: "Desensitize", code: "D9910" }
        ];
        
      case 'Sleep':
        return [
          { label: "MAD Device", code: "D9947" },
          { label: "MAD Adj", code: "D9948" },
          { label: "MAD Repair", code: "D9949" },
          { label: "Home Sleep", code: "D9956" },
          { label: "SDB Screen", code: "D9957" }
        ];
        
      default:
        return [
          { label: "Comp Post 1S", code: "D2391" },
          { label: "Zirc Crown", code: "D2740" },
          { label: "Simple Ext", code: "D7140" },
          { label: "RCT Molar", code: "D3330" }
        ];
    }
  };
  
  // Additional menu items for groups in Rest / Prosth category
  const getRestProsthSubGroups = () => {
    const directOptions = [
      { label: "Comp Ant 1S", code: "D2330" },
      { label: "Comp Ant 2S", code: "D2331" },
      { label: "Comp Ant 3S", code: "D2332" },
      { label: "Comp Ant 4+", code: "D2335" },
      { label: "Comp Post 2S", code: "D2392" },
      { label: "Comp Post 3S", code: "D2393" },
      { label: "Comp Post 4+", code: "D2394" }
    ];
    
    const fixedOptions = [
      { label: "Full-Cast Crn", code: "D2792" },
      { label: "Onlay", code: "D2644" },
      { label: "Veneer", code: "D2962" },
      { label: "3-Unit Bridge", code: "D6740", subcodes: ["D6750", "D6750"] }
    ];
    
    const removableOptions = [
      { label: "Partial U", code: "D5213" },
      { label: "Partial L", code: "D5214" },
      { label: "Imm Dent U", code: "D5130" },
      { label: "Reline Ch", code: "D5730" },
      { label: "Denture Rpr", code: "D5520" }
    ];
    
    return {
      direct: directOptions,
      fixed: fixedOptions,
      removable: removableOptions
    };
  };
  
  return (
    <div className="bg-white border-l h-full flex flex-col" aria-label="Procedure Palette">
      {/* Header - More compact */}
      <div className="p-2.5 border-b flex justify-between items-center">
        <h2 className="text-base font-medium">Add Procedures</h2>
        <Button variant="ghost" size="sm" className="text-xs p-1.5 h-7" title="Expand/Collapse">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="p-3 space-y-3 flex-grow overflow-auto">
        {/* Treatment Type & Provider Row - Compact */}
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Treatment Type <span className="text-red-500">*</span>
            </label>
            <Select>
              <SelectTrigger className="h-9 text-sm w-full border border-gray-300 rounded">
                <SelectValue placeholder="Planned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="completed">Completed (This Office)</SelectItem>
                <SelectItem value="existing">Existing (Other Provider)</SelectItem>
                <SelectItem value="condition">Condition / Diagnosis</SelectItem>
                <SelectItem value="referred">Referred-Out</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Provider <span className="text-red-500">*</span>
            </label>
            <Select>
              <SelectTrigger className="h-9 text-sm w-full border border-gray-300 rounded">
                <SelectValue placeholder="Dr. Arlene McCoy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mccoy">Dr. Arlene McCoy</SelectItem>
                <SelectItem value="scott">Dr. M Scott</SelectItem>
                <SelectItem value="bernard">Dr. A Bernard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Selected Procedure Display */}
        {selectedProcedure && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-md p-2 text-xs flex items-center">
            <div className="mr-2 font-bold">{selectedProcedure.code}</div>
            <div className="text-gray-700 flex-grow">{selectedProcedure.description}</div>
            <div className="text-indigo-700 font-medium ml-1">${selectedProcedure.fee}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 ml-1 p-0 text-gray-400 hover:text-gray-700" 
              onClick={() => dispatch(selectProcedure(null))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          </div>
        )}
        
        {/* Selection Status */}
        {(selectedTeeth.length > 0 || selectedSurface) && (
          <div className="text-xs text-gray-600 flex items-center bg-gray-50 p-2 rounded-md">
            <span className="font-medium">Selected: </span>
            {selectedTeeth.length > 0 && (
              <span className="ml-1">
                {selectedTeeth.length === 1 ? `Tooth ${selectedTeeth[0]}` : `Teeth ${selectedTeeth.join(', ')}`}
              </span>
            )}
            {selectedSurface && (
              <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                {selectedSurface}
              </span>
            )}
          </div>
        )}
        
        {/* Categories and Quick Select - Optimized Layout */}
        <div className="grid grid-cols-[35%_65%] gap-3">
          {/* Category List - More Compact */}
          <div>
            <div className="border rounded-md overflow-hidden">
              <div className="px-3 py-1.5 bg-gray-50 border-b">
                <label className="block text-xs font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                {Object.values(ProcedureCategory).map(category => (
                  <button
                    key={category}
                    className={`w-full px-2.5 py-2.5 text-sm text-left border-b last:border-b-0 transition-colors ${
                      activeProcedureCategory === category 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => dispatch(setActiveProcedureCategory(category))}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Select Grid - More Densely Packed */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-xs font-medium text-gray-700">Quick Select</p>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-[calc(100vh-350px)] overflow-y-auto pr-1">
              {getQuickSelectOptions().map((option, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="h-10 text-xs py-0 normal-case font-normal justify-center border-gray-300 hover:bg-gray-50"
                  onClick={() => handleSelectProcedure(procedures.find(p => p.code === option.code)!)}
                >
                  {option.label}
                </Button>
              ))}
              
              {/* Display group expanders for Rest/Prosth - Optimized */}
              {activeProcedureCategory === 'Rest / Prosth' && (
                <>
                  {/* Direct Restorations Group */}
                  <Button
                    variant="outline"
                    className="h-10 text-xs normal-case font-normal justify-between border-gray-300 hover:bg-gray-50 col-span-2 mt-1"
                    onClick={() => toggleGroup('direct')}
                  >
                    <span className="flex items-center">
                      <span className="text-gray-500 mr-1">—</span> Direct
                    </span>
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expandedGroups.direct ? 'rotate-90' : ''}`} />
                  </Button>
                  
                  {/* Direct Options (when expanded) */}
                  {expandedGroups.direct && (
                    <div className="col-span-2 grid grid-cols-2 gap-1.5">
                      {getRestProsthSubGroups().direct.map((option, idx) => (
                        <Button
                          key={`direct-${idx}`}
                          variant="outline"
                          className="h-10 text-xs py-0 normal-case font-normal justify-center border-gray-300 hover:bg-gray-50 ml-2"
                          onClick={() => handleSelectProcedure(procedures.find(p => p.code === option.code) || {
                            id: `temp-${option.code}`,
                            code: option.code,
                            description: option.label,
                            fee: 0,
                            category: 'Rest / Prosth'
                          } as Procedure)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {/* Fixed Prosthetics Group */}
                  <Button
                    variant="outline"
                    className="h-10 text-xs normal-case font-normal justify-between border-gray-300 hover:bg-gray-50 col-span-2 mt-1"
                    onClick={() => toggleGroup('fixed')}
                  >
                    <span className="flex items-center">
                      <span className="text-gray-500 mr-1">—</span> Fixed
                    </span>
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expandedGroups.fixed ? 'rotate-90' : ''}`} />
                  </Button>
                  
                  {/* Fixed Options (when expanded) */}
                  {expandedGroups.fixed && (
                    <div className="col-span-2 grid grid-cols-2 gap-1.5">
                      {getRestProsthSubGroups().fixed.map((option, idx) => (
                        <Button
                          key={`fixed-${idx}`}
                          variant="outline"
                          className="h-10 text-xs py-0 normal-case font-normal justify-center border-gray-300 hover:bg-gray-50 ml-2"
                          onClick={() => handleSelectProcedure(procedures.find(p => p.code === option.code) || {
                            id: `temp-${option.code}`,
                            code: option.code,
                            description: option.label,
                            fee: 0,
                            category: 'Rest / Prosth'
                          } as Procedure)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {/* Removable Prosthetics Group */}
                  <Button
                    variant="outline"
                    className="h-10 text-xs normal-case font-normal justify-between border-gray-300 hover:bg-gray-50 col-span-2 mt-1"
                    onClick={() => toggleGroup('removable')}
                  >
                    <span className="flex items-center">
                      <span className="text-gray-500 mr-1">—</span> Removable
                    </span>
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expandedGroups.removable ? 'rotate-90' : ''}`} />
                  </Button>
                  
                  {/* Removable Options (when expanded) */}
                  {expandedGroups.removable && (
                    <div className="col-span-2 grid grid-cols-2 gap-1.5">
                      {getRestProsthSubGroups().removable.map((option, idx) => (
                        <Button
                          key={`removable-${idx}`}
                          variant="outline"
                          className="h-10 text-xs py-0 normal-case font-normal justify-center border-gray-300 hover:bg-gray-50 ml-2"
                          onClick={() => handleSelectProcedure(procedures.find(p => p.code === option.code) || {
                            id: `temp-${option.code}`,
                            code: option.code,
                            description: option.label,
                            fee: 0,
                            category: 'Rest / Prosth'
                          } as Procedure)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with Action Buttons - Compact */}
      <div className="p-2.5 border-t mt-auto bg-white">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 border-gray-300 text-xs h-9"
            disabled={!selectedProcedure}
          >
            Add to Alternate
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-xs h-9"
            onClick={handleAddToTreatmentPlan}
            disabled={selectedTeeth.length === 0 || !selectedProcedure}
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" /> Add to Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProcedurePalette;