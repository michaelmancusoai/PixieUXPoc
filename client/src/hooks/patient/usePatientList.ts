import { useQuery } from "@tanstack/react-query";
import { Patient } from "@shared/schema";

/**
 * Hook to fetch patient list
 */
export function usePatientList() {
  return useQuery<Patient[]>({
    queryKey: ['/api/patients'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}