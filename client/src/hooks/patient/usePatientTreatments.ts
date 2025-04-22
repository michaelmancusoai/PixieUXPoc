import { useQuery } from '@tanstack/react-query';
import type { Treatment } from '@shared/schema';

/**
 * Hook to fetch treatments for a patient
 * 
 * @param patientId - The ID of the patient
 * @returns Query object with patient treatments
 */
export function usePatientTreatments(patientId: number) {
  return useQuery<Treatment[]>({
    queryKey: ['/api/patients', patientId, 'treatments'],
    enabled: !!patientId,
  });
}