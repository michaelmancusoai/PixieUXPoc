import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Pill, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  MessageSquareWarning,
  Check
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes: string;
}

interface Allergy {
  id: string;
  name: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  reaction: string;
}

const MedicationsAllergiesStep = () => {
  // Medications state
  const [medications, setMedications] = useState<Medication[]>([
    { 
      id: '1', 
      name: 'Lisinopril', 
      dosage: '10mg', 
      frequency: 'Once daily', 
      notes: 'For hypertension' 
    }
  ]);
  
  // Allergies state
  const [allergies, setAllergies] = useState<Allergy[]>([
    { 
      id: '1', 
      name: 'Penicillin', 
      severity: 'Moderate', 
      reaction: 'Rash, hives' 
    }
  ]);
  
  // Form state for new entries
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: '',
    dosage: '',
    frequency: '',
    notes: ''
  });
  
  const [newAllergy, setNewAllergy] = useState<Omit<Allergy, 'id'>>({
    name: '',
    severity: 'Mild',
    reaction: ''
  });
  
  // Add new medication
  const addMedication = () => {
    if (newMedication.name.trim() === '') return;
    
    const medication: Medication = {
      id: Date.now().toString(),
      ...newMedication
    };
    
    setMedications([...medications, medication]);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      notes: ''
    });
  };
  
  // Remove medication
  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };
  
  // Add new allergy
  const addAllergy = () => {
    if (newAllergy.name.trim() === '') return;
    
    const allergy: Allergy = {
      id: Date.now().toString(),
      ...newAllergy
    };
    
    setAllergies([...allergies, allergy]);
    setNewAllergy({
      name: '',
      severity: 'Mild',
      reaction: ''
    });
  };
  
  // Remove allergy
  const removeAllergy = (id: string) => {
    setAllergies(allergies.filter(allergy => allergy.id !== id));
  };
  
  // Severity color mapping
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Severe':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Calculate completion status
  const isComplete = medications.length > 0 || allergies.length > 0;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Medications & Allergies</h3>
      <p className="text-sm text-gray-600">
        Record the patient's current medications and known allergies.
      </p>
      
      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medications" className="flex items-center">
            <Pill className="w-4 h-4 mr-2" />
            Medications
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
              {medications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="allergies" className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Allergies
            <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">
              {allergies.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="medications" className="space-y-4 pt-4">
          {/* Existing medications list */}
          <div className="space-y-3">
            {medications.length === 0 ? (
              <div className="text-center p-4 border border-dashed rounded-md bg-gray-50">
                <p className="text-gray-500">No medications recorded</p>
              </div>
            ) : (
              medications.map(med => (
                <div key={med.id} className="p-3 border rounded-md bg-white flex items-start justify-between group hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium">{med.name}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2">
                        {med.dosage}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{med.frequency}</div>
                    {med.notes && <div className="text-sm text-gray-500 mt-1 italic">{med.notes}</div>}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={() => removeMedication(med.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              ))
            )}
          </div>
          
          {/* Add new medication form */}
          <div className="p-4 border rounded-md bg-gray-50">
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Medication Name*</label>
                <Input 
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter medication name"
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Dosage</label>
                <Input 
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 10mg"
                  className="h-9"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">Frequency</label>
              <Input 
                value={newMedication.frequency}
                onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                placeholder="e.g., Once daily, Twice daily"
                className="h-9"
              />
            </div>
            
            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">Notes</label>
              <Textarea 
                value={newMedication.notes}
                onChange={(e) => setNewMedication(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Reason for medication, etc."
                className="h-20 min-h-[80px]"
              />
            </div>
            
            <Button 
              onClick={addMedication}
              disabled={!newMedication.name.trim()}
              className="w-full"
            >
              Add Medication
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="allergies" className="space-y-4 pt-4">
          {/* Existing allergies list */}
          <div className="space-y-3">
            {allergies.length === 0 ? (
              <div className="text-center p-4 border border-dashed rounded-md bg-gray-50">
                <p className="text-gray-500">No allergies recorded</p>
              </div>
            ) : (
              allergies.map(allergy => (
                <div key={allergy.id} className="p-3 border rounded-md bg-white flex items-start justify-between group hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium">{allergy.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ml-2 ${getSeverityColor(allergy.severity)}`}>
                        {allergy.severity}
                      </span>
                    </div>
                    {allergy.reaction && (
                      <div className="text-sm text-gray-600 mt-1">
                        Reaction: {allergy.reaction}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={() => removeAllergy(allergy.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              ))
            )}
          </div>
          
          {/* Add new allergy form */}
          <div className="p-4 border rounded-md bg-gray-50">
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Allergy
            </h4>
            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">Allergy*</label>
              <Input 
                value={newAllergy.name}
                onChange={(e) => setNewAllergy(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Penicillin, Latex, etc."
                className="h-9"
              />
            </div>
            
            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">Severity</label>
              <div className="flex space-x-2">
                {['Mild', 'Moderate', 'Severe'].map((severity) => (
                  <Button
                    key={severity}
                    type="button"
                    variant={newAllergy.severity === severity ? "default" : "outline"}
                    className={`flex-1 ${newAllergy.severity === severity ? 
                      severity === 'Mild' ? 'bg-green-600 hover:bg-green-700' : 
                      severity === 'Moderate' ? 'bg-yellow-600 hover:bg-yellow-700' : 
                      'bg-red-600 hover:bg-red-700' : ''}`}
                    onClick={() => setNewAllergy(prev => ({ ...prev, severity: severity as 'Mild' | 'Moderate' | 'Severe' }))}
                  >
                    {severity}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">Reaction</label>
              <Textarea 
                value={newAllergy.reaction}
                onChange={(e) => setNewAllergy(prev => ({ ...prev, reaction: e.target.value }))}
                placeholder="Describe reaction symptoms"
                className="h-20 min-h-[80px]"
              />
            </div>
            
            <Button 
              onClick={addAllergy}
              disabled={!newAllergy.name.trim()}
              className="w-full"
            >
              Add Allergy
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Confirmation section */}
      {isComplete && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <Check className="text-green-600 w-5 h-5 mr-2" />
            <h4 className="font-medium text-green-800">Information Recorded</h4>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Patient's medications and allergies have been recorded successfully.
          </p>
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 flex items-start">
            <MessageSquareWarning className="w-5 h-5 mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              Remember to verify all medications and allergies with the patient and document any changes since their last visit. This information is critical for preventing adverse drug reactions and interactions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationsAllergiesStep;