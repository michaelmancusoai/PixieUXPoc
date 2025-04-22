import { useQuery } from '@tanstack/react-query';
import { Patient } from '@shared/schema';

/**
 * Hook to fetch patient details by ID
 */
export function usePatientDetails(patientId: number) {
  return useQuery<Patient>({
    queryKey: ['/api/patients', patientId],
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch patient medical alerts
 */
export function usePatientMedicalAlerts(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'medical-alerts'],
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch patient appointments
 */
export function usePatientAppointments(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'appointments'],
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch patient documents
 */
export function usePatientDocuments(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'documents'],
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch patient notes
 */
export function usePatientNotes(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'notes'],
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch patient payments
 */
export function usePatientPayments(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'payments'],
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch patient messages
 */
export function usePatientMessages(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'messages'],
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch patient recalls
 */
export function usePatientRecalls(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'recalls'],
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch patient treatments
 */
export function usePatientTreatments(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'treatments'],
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch patient claims
 */
export function usePatientClaims(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'claims'],
    enabled: !!patientId,
  });
}

/**
 * Hook to fetch patient activity log
 */
export function usePatientActivity(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'activity'],
    enabled: !!patientId,
  });
}