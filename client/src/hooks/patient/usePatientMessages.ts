import { useQuery } from '@tanstack/react-query';
import type { Message } from '@shared/schema';

/**
 * Hook to fetch messages for a patient
 * 
 * @param patientId - The ID of the patient
 * @returns Query object with patient messages
 */
export function usePatientMessages(patientId: number) {
  return useQuery<Message[]>({
    queryKey: ['/api/patients', patientId, 'messages'],
    enabled: !!patientId,
  });
}