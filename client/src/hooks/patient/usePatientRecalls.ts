import { useQuery } from '@tanstack/react-query';
import type { Recall } from '@shared/schema';

/**
 * Hook to fetch recalls for a patient
 * 
 * @param patientId - The ID of the patient
 * @returns Query object with patient recalls
 */
export function usePatientRecalls(patientId: number) {
  return useQuery<Recall[]>({
    queryKey: ['/api/patients', patientId, 'recalls'],
    enabled: !!patientId,
  });
}