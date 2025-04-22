import { useQuery } from '@tanstack/react-query';
import type { Appointment } from '@shared/schema';

/**
 * Hook to fetch appointments for a patient
 * 
 * @param patientId - The ID of the patient
 * @returns Query object with patient appointments
 */
export function usePatientAppointments(patientId: number) {
  return useQuery<Appointment[]>({
    queryKey: ['/api/patients', patientId, 'appointments'],
    enabled: !!patientId,
  });
}