import { useQuery } from '@tanstack/react-query';
import type { Patient } from '@shared/schema';

/**
 * Hook to fetch a single patient's details
 * 
 * @param patientId - The ID of the patient to fetch
 * @returns Query object with patient data
 */
export function usePatientDetails(patientId: number) {
  return useQuery<Patient>({
    queryKey: ['/api/patients', patientId],
    enabled: !!patientId,
  });
}