import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooth, ToothStatus } from '@/types/dental';
import { useState } from 'react';

interface ToothDetailsProps {
  open: boolean;
  onClose: () => void;
  tooth: Tooth | null;
}

const ToothDetails = ({ open, onClose, tooth }: ToothDetailsProps) => {
  const [notes, setNotes] = useState('');
  
  if (!tooth) return null;
  
  // Get all conditions for this tooth
  const hasCaries = tooth.surfaces.some(s => s.status === ToothStatus.Caries);
  const hasExistingRestoration = tooth.surfaces.some(s => s.status === ToothStatus.ExistingRestoration);
  const hasPlannedProcedure = tooth.surfaces.some(s => s.status === ToothStatus.Planned);
  const hasCompletedProcedure = tooth.surfaces.some(s => s.status === ToothStatus.Completed);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tooth #{tooth.number} Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Conditions</h3>
            <div className="space-y-2">
              {hasCaries && (
                <div className="p-2 bg-red-50 text-red-800 rounded border border-red-200 text-sm">
                  <div className="font-medium">Caries</div>
                  <div className="text-xs">Occlusal surface - Diagnosed: 06/15/2023</div>
                </div>
              )}
              {hasExistingRestoration && (
                <div className="p-2 bg-blue-50 text-blue-800 rounded border border-blue-200 text-sm">
                  <div className="font-medium">Existing Restoration</div>
                  <div className="text-xs">Amalgam - Placed: 01/12/2022</div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">History</h3>
            <div className="space-y-2">
              <div className="p-2 bg-gray-50 rounded border text-sm">
                <div className="font-medium">Examination</div>
                <div className="text-xs">06/15/2023 - Dr. Anderson</div>
              </div>
              {hasCompletedProcedure && (
                <div className="p-2 bg-green-50 rounded border border-green-200 text-sm">
                  <div className="font-medium">Completed Procedure</div>
                  <div className="text-xs">Composite - 03/22/2023</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Treatment Options</h3>
          <div className="space-y-2">
            <div className="p-2 bg-green-50 rounded border border-green-200 text-sm flex justify-between items-center">
              <div>
                <div className="font-medium">Porcelain Crown (D2740)</div>
                <div className="text-xs">Recommended for extensive decay</div>
              </div>
              <div className="text-sm font-medium">$1,250.00</div>
            </div>
            <div className="p-2 bg-green-50 rounded border border-green-200 text-sm flex justify-between items-center">
              <div>
                <div className="font-medium">Resin Composite (D2391)</div>
                <div className="text-xs">Alternative with less structure removal</div>
              </div>
              <div className="text-sm font-medium">$210.00</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Notes</h3>
          <Textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded p-2 text-sm" 
            rows={3} 
            placeholder="Add clinical notes..."
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Apply Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToothDetails;
