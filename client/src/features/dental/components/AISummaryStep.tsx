import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/dentalSlice';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Edit, Copy, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SurfaceStatus } from '@/types/dental';

// Helper function to generate a simulated AI summary based on tooth status
const generateAISummary = (teeth: any[], riskFactors: string[] = []) => {
  // Count teeth with different statuses
  const cariesCount = teeth.filter(tooth => 
    tooth.surfaces && Object.values(tooth.surfaces).includes(SurfaceStatus.Caries)
  ).length;
  
  const existingRestCount = teeth.filter(tooth => 
    tooth.surfaces && Object.values(tooth.surfaces).includes(SurfaceStatus.Restoration)
  ).length;
  
  // Generate clinical findings section
  let clinicalFindings = "Comprehensive oral examination reveals ";
  
  if (cariesCount === 0 && existingRestCount === 0) {
    clinicalFindings += "healthy dentition with no active caries or restorative needs. ";
  } else {
    if (cariesCount > 0) {
      clinicalFindings += `${cariesCount} teeth with active carious lesions, predominantly`;
      
      if (cariesCount > 5) {
        clinicalFindings += " affecting posterior teeth with occlusal and interproximal surfaces. ";
      } else {
        clinicalFindings += " localized to specific teeth requiring prompt treatment. ";
      }
    }
    
    if (existingRestCount > 0) {
      clinicalFindings += `Patient presents with ${existingRestCount} existing restorations`;
      
      if (existingRestCount > 8) {
        clinicalFindings += ", including extensive work throughout the dentition. ";
      } else {
        clinicalFindings += " that appear to be in good condition. ";
      }
    }
  }
  
  // Add perio section
  clinicalFindings += "Periodontal probing reveals generally healthy tissues with isolated areas of bleeding on probing. ";
  
  // Add risk factors section if applicable
  if (riskFactors.length > 0) {
    clinicalFindings += "Notable risk factors include " + riskFactors.join(", ") + ", which may impact treatment planning and long-term prognosis. ";
  }
  
  // Generate assessment section
  let assessment = "ASSESSMENT: ";
  
  if (cariesCount === 0) {
    assessment += "Healthy dentition with good oral hygiene. ";
  } else if (cariesCount > 5) {
    assessment += "High caries risk patient with active disease requiring aggressive intervention. ";
  } else {
    assessment += "Moderate caries risk with localized restorative needs. ";
  }
  
  // Add perio classification
  assessment += "Periodontal classification: Gingivitis or early periodontitis. ";
  
  // Generate plan section
  let plan = "PLAN: ";
  
  if (cariesCount > 0) {
    plan += `Restore ${cariesCount} carious lesions with appropriate restorative materials. `;
  }
  
  plan += "Recommend standard periodontal maintenance with 6-month recall. ";
  
  if (riskFactors.includes("Smoking")) {
    plan += "Smoking cessation counseling provided. ";
  }
  
  if (riskFactors.includes("Diabetes")) {
    plan += "Coordinate with primary care regarding diabetes management. ";
  }
  
  return `FINDINGS: ${clinicalFindings}\n\n${assessment}\n\n${plan}`;
};

const AISummaryStep = () => {
  const { teeth } = useSelector((state: RootState) => state.dental);
  const { toast } = useToast();
  
  // Simulate risk factors that would have been collected in previous step
  const simulatedRiskFactors = ["Smoking", "Bruxism"];
  
  // State for the AI-generated summary
  const [summary, setSummary] = useState<string>(generateAISummary(teeth, simulatedRiskFactors));
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for edited summary
  const [editedSummary, setEditedSummary] = useState(summary);
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Save changes
      setSummary(editedSummary);
      toast({
        title: "Summary Updated",
        description: "Your edits have been saved successfully.",
      });
    }
    
    setIsEditing(!isEditing);
  };
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: "The summary has been copied to your clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Could not copy to clipboard. Please try again.",
          variant: "destructive",
        });
      });
  };
  
  // Handle regenerate summary
  const handleRegenerate = () => {
    const newSummary = generateAISummary(teeth, simulatedRiskFactors);
    setSummary(newSummary);
    setEditedSummary(newSummary);
    
    toast({
      title: "Summary Regenerated",
      description: "A new AI summary has been generated based on the current findings.",
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">AI-Generated Summary</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={toggleEditMode}
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600">
        This AI-generated summary is based on your examination findings, periodontal measurements, and risk assessments.
      </p>
      
      <Tabs defaultValue="clinical">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="clinical">Clinical Notes</TabsTrigger>
          <TabsTrigger value="patient">Patient-Friendly</TabsTrigger>
          <TabsTrigger value="insurance">Insurance Narrative</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clinical" className="mt-0">
          {isEditing ? (
            <Textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              className="font-mono text-sm h-64 w-full"
            />
          ) : (
            <div className="border rounded-md p-4 bg-white font-mono text-sm whitespace-pre-wrap h-64 overflow-y-auto">
              {summary}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="patient" className="mt-0">
          <div className="border rounded-md p-4 bg-white h-64 overflow-y-auto">
            <h4 className="font-medium mb-2">Your Dental Health Summary</h4>
            <p className="mb-4 text-sm">
              Based on today's examination, we found the following about your oral health:
            </p>
            
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <div className="rounded-full bg-indigo-100 text-indigo-800 p-1 mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 12a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z"></path>
                    <path d="M9 9h.01"></path>
                    <path d="M15 9h.01"></path>
                    <path d="M8 13h8"></path>
                  </svg>
                </div>
                <div>
                  <span className="font-medium">Teeth Health:</span> We found several teeth that need attention. Some have cavities that should be treated soon to prevent further damage.
                </div>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-indigo-100 text-indigo-800 p-1 mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"></path>
                    <path d="M3 13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2"></path>
                    <path d="M8 21h8"></path>
                    <path d="M12 17v4"></path>
                    <path d="M12 13v-2"></path>
                    <path d="M9 13H3"></path>
                    <path d="M21 13h-6"></path>
                  </svg>
                </div>
                <div>
                  <span className="font-medium">Gum Health:</span> Your gums show some signs of inflammation in certain areas. This is treatable with improved brushing and flossing.
                </div>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-indigo-100 text-indigo-800 p-1 mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V9.643c0-.698-.456-1.3-1.152-1.5a2.3 2.3 0 0 0-2.664.786L8.8 9.2"></path>
                    <path d="M6 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"></path>
                    <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2 2 6.5 2 12Z"></path>
                  </svg>
                </div>
                <div>
                  <span className="font-medium">Risk Factors:</span> Smoking and teeth grinding (bruxism) are affecting your oral health. We'll discuss strategies to address these.
                </div>
              </li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="insurance" className="mt-0">
          <div className="border rounded-md p-4 bg-white font-mono text-sm h-64 overflow-y-auto">
            <h4 className="font-medium mb-2">INSURANCE NARRATIVE</h4>
            <p className="mb-2">
              Patient presents with multiple carious lesions requiring restoration. Radiographic evaluation confirms Class II carious lesions on teeth #3, #14, and #19 extending into dentin.
            </p>
            <p className="mb-2">
              Periodontal evaluation reveals localized 4-5mm pockets with BOP in posterior sextants. Patient exhibits risk factors including tobacco use and parafunctional habits (bruxism).
            </p>
            <p>
              Treatment plan necessitates restorative intervention for carious lesions and periodontal therapy to address inflammatory response. Proposed treatment is the most conservative approach to address active disease and prevent further deterioration of oral health.
            </p>
            <p className="mt-4 font-bold">
              PROCEDURE CODES: D0120, D0274, D2391 (x3), D4341, D4342
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Acceptance section */}
      <div className="flex items-center justify-center space-x-3 mt-6">
        <Button className="w-40 bg-indigo-600 hover:bg-indigo-700">
          <Check className="w-4 h-4 mr-2" />
          Accept Summary
        </Button>
      </div>
    </div>
  );
};

export default AISummaryStep;