import { useQuery } from '@tanstack/react-query';
import { Patient } from '@shared/schema';

/**
 * Hook to fetch a list of patients
 */
export function usePatientList(options?: { limit?: number; offset?: number }) {
  return useQuery<Patient[]>({
    queryKey: ['/api/patients', options?.limit, options?.offset],
  });
}

/**
 * Hook to search for patients by query
 */
export function usePatientSearch(query: string) {
  return useQuery<Patient[]>({
    queryKey: ['/api/patients/search', query],
    enabled: !!query && query.length > 1, // Only run if query has at least 2 characters
  });
}