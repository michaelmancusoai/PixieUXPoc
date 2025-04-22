import { useQuery } from '@tanstack/react-query';
import type { Claim } from '@shared/schema';

/**
 * Hook to fetch insurance claims for a patient
 * 
 * @param patientId - The ID of the patient
 * @returns Query object with patient insurance claims
 */
export function usePatientClaims(patientId: number) {
  return useQuery<Claim[]>({
    queryKey: ['/api/patients', patientId, 'claims'],
    enabled: !!patientId,
  });
}