import { useQuery } from '@tanstack/react-query';
import type { Document } from '@shared/schema';

/**
 * Hook to fetch documents for a patient
 * 
 * @param patientId - The ID of the patient
 * @returns Query object with patient documents
 */
export function usePatientDocuments(patientId: number) {
  return useQuery<Document[]>({
    queryKey: ['/api/patients', patientId, 'documents'],
    enabled: !!patientId,
  });
}