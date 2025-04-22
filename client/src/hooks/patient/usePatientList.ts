import { useQuery } from '@tanstack/react-query';
import type { Patient } from '@shared/schema';

/**
 * Hook to fetch a list of all patients
 * 
 * @returns Query object with patient list
 */
export function usePatientList() {
  return useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });
}

/**
 * Hook to search for patients
 * 
 * @param query - The search query string
 * @returns Query object with search results
 */
export function usePatientSearch(query: string) {
  return useQuery<Patient[]>({
    queryKey: ['/api/patients/search', query],
    enabled: !!query && query.length > 1,
  });
}