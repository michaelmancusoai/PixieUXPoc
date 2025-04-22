import { queryClient } from '@/lib/queryClient';

/**
 * Invalidate all queries for a specific patient
 */
export function invalidatePatientQueries(patientId: number) {
  // Invalidate the specific patient
  queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId] });
  
  // Invalidate all related patient data
  queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId, 'medical-alerts'] });
  queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId, 'appointments'] });
  queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId, 'documents'] });
  queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId, 'notes'] });
  queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId, 'payments'] });
  queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId, 'messages'] });
  queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId, 'recalls'] });
  queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId, 'treatments'] });
  queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId, 'claims'] });
  queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId, 'activity'] });
}

/**
 * Invalidate the entire patient list
 */
export function invalidatePatientList() {
  queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
}