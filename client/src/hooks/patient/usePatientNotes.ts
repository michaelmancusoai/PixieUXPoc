import { useQuery } from '@tanstack/react-query';
import type { Note } from '@shared/schema';

/**
 * Hook to fetch notes for a patient
 * 
 * @param patientId - The ID of the patient
 * @returns Query object with patient notes
 */
export function usePatientNotes(patientId: number) {
  return useQuery<Note[]>({
    queryKey: ['/api/patients', patientId, 'notes'],
    enabled: !!patientId,
  });
}