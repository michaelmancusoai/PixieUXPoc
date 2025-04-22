import { useQuery } from '@tanstack/react-query';
import type { Payment } from '@shared/schema';

/**
 * Hook to fetch payments for a patient
 * 
 * @param patientId - The ID of the patient
 * @returns Query object with patient payments
 */
export function usePatientPayments(patientId: number) {
  return useQuery<Payment[]>({
    queryKey: ['/api/patients', patientId, 'payments'],
    enabled: !!patientId,
  });
}