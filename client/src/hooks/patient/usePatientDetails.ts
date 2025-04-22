import { useQuery } from "@tanstack/react-query";
import { Patient } from "@shared/schema";

/**
 * Hook to fetch patient details
 */
export function usePatientDetails(patientId: number) {
  return useQuery<Patient>({
    queryKey: ['/api/patients', patientId],
    enabled: !!patientId, // Only run if we have a patientId
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}