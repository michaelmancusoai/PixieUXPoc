import { useQuery } from '@tanstack/react-query';

interface ActivityLogItem {
  id: number;
  patientId: number | null;
  userId: number | null;
  actionType: string;
  description: string;
  timestamp: string;
  metadata: any;
}

/**
 * Hook to fetch activity logs for a patient
 * 
 * @param patientId - The ID of the patient
 * @returns Query object with patient activity logs
 */
export function usePatientActivity(patientId: number) {
  return useQuery<ActivityLogItem[]>({
    queryKey: ['/api/patients', patientId, 'activity'],
    enabled: !!patientId,
  });
}