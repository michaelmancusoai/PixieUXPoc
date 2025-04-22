import { useQuery } from '@tanstack/react-query';
import type { MedicalAlert } from '@shared/schema';

/**
 * Hook to fetch medical alerts for a patient
 * 
 * @param patientId - The ID of the patient
 * @returns Query object with medical alerts
 */
export function useMedicalAlerts(patientId: number) {
  return useQuery<MedicalAlert[]>({
    queryKey: ['/api/patients', patientId, 'medical-alerts'],
    enabled: !!patientId,
  });
}