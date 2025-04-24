import { useSelector, useDispatch } from 'react-redux';
import { RootState, updateTreatmentPlanItemStatus, reorderTreatmentPlanItems } from '../store/dentalSlice';
import { TreatmentPlanItem, TreatmentPlanStatus, Surface } from '@/types';
import { MoreVertical, ArrowUp, ArrowDown, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface TreatmentPlanTableProps {
  planType: string;
}

const TreatmentPlanTable = ({ planType }: TreatmentPlanTableProps) => {
  const { treatmentPlan } = useSelector((state: RootState) => state.dental);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // Filter items based on plan type
  const items = treatmentPlan.items.filter(item => 
    planType === 'master' || 
    (planType === 'alternate' && false) || // No alternate plans in this demo
    (planType === 'archived' && false)     // No archived plans in this demo
  );
  
  // Format surfaces array into a string (e.g., "O-M-D")
  const formatSurfaces = (surfaces: Surface[]) => {
    if (surfaces.length === 0) return 'Full';
    return surfaces.join('-');
  };
  
  // Get status badge based on status
  const getStatusBadge = (status: TreatmentPlanStatus) => {
    switch (status) {
      case TreatmentPlanStatus.Planned:
        return (
          <Badge variant="outline" className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
            Planned
          </Badge>
        );
      case TreatmentPlanStatus.Approved:
        return (
          <Badge variant="outline" className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Approved
          </Badge>
        );
      case TreatmentPlanStatus.Pending:
        return (
          <Badge variant="outline" className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
            Pending Auth
          </Badge>
        );
      case TreatmentPlanStatus.Denied:
        return (
          <Badge variant="outline" className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
            Denied
          </Badge>
        );
      case TreatmentPlanStatus.Completed:
        return (
          <Badge variant="outline" className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Completed
          </Badge>
        );
    }
  };
  
  // Handle changing item status
  const handleChangeStatus = (itemId: string, newStatus: TreatmentPlanStatus) => {
    dispatch(updateTreatmentPlanItemStatus({ itemId, newStatus }));
    
    toast({
      title: "Status Updated",
      description: `Treatment plan item status updated to ${newStatus}.`,
    });
  };
  
  // Handle reordering items
  const handleReorder = (itemId: string, direction: 'up' | 'down') => {
    const item = items.find(item => item.id === itemId);
    if (!item) return;
    
    const newPriority = direction === 'up' 
      ? Math.max(1, item.priority - 1)
      : Math.min(items.length, item.priority + 1);
    
    dispatch(reorderTreatmentPlanItems({ itemId, newPriority }));
  };
  
  return (
    <div className="h-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tooth
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CDT Code
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Provider
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fee
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ins Amt
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pt Amt
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => {
            // Define conditional styles based on status
            const isCompleted = item.status === TreatmentPlanStatus.Completed;
            const isDenied = item.status === TreatmentPlanStatus.Denied;
            const bgColorClass = isCompleted ? 'hover:bg-green-50 bg-green-50/30' : 
                                isDenied ? 'hover:bg-red-50 bg-red-50/30' : 
                                'hover:bg-blue-50/40';
            
            return (
              <tr 
                key={item.id} 
                className={`cursor-pointer transition-colors ${bgColorClass}`}
              >
                <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-100">
                  <div className="flex items-center">
                    <span className="font-medium">{item.priority}</span>
                    <div className="ml-1.5 flex flex-col space-y-px">
                      <button 
                        className="text-gray-400 hover:text-blue-500 disabled:text-gray-200"
                        onClick={() => handleReorder(item.id, 'up')}
                        disabled={item.priority === 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                      </button>
                      <button 
                        className="text-gray-400 hover:text-blue-500 disabled:text-gray-200"
                        onClick={() => handleReorder(item.id, 'down')}
                        disabled={item.priority === items.length}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-sm font-medium">
                  {item.toothNumber > 0 ? (
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded mr-1">{item.toothNumber}</span>
                      <span className="text-xs text-gray-500">{formatSurfaces(item.surfaces)}</span>
                    </div>
                  ) : 'UR'}
                </td>
                <td className="px-3 py-2 text-sm font-mono text-blue-700">
                  {item.procedure.code}
                </td>
                <td className="px-3 py-2 text-sm font-medium">
                  {item.procedure.description}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {item.provider}
                </td>
                <td className="px-3 py-2 text-sm font-medium">
                  ${item.fee.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-sm text-green-700 font-medium">
                  ${item.insuranceAmount.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-sm text-blue-700 font-medium">
                  ${item.patientAmount.toFixed(2)}
                </td>
                <td className="px-3 py-2">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-3 py-2 text-sm">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        onClick={() => handleChangeStatus(item.id, TreatmentPlanStatus.Approved)}
                        className="text-sm"
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Mark Approved</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleChangeStatus(item.id, TreatmentPlanStatus.Completed)}
                        className="text-sm"
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        <span>Mark Completed</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleChangeStatus(item.id, TreatmentPlanStatus.Pending)}
                        className="text-sm"
                      >
                        <Clock className="mr-2 h-4 w-4 text-amber-500" />
                        <span>Mark Pending Auth</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleChangeStatus(item.id, TreatmentPlanStatus.Denied)}
                        className="text-sm"
                      >
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        <span>Mark Denied</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={10} className="px-3 py-8 text-sm text-center text-gray-500 border-b border-gray-200">
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-gray-400">
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                  </svg>
                  <p>No treatment plan items</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Add procedures by selecting teeth and surfaces from the chart above
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TreatmentPlanTable;
