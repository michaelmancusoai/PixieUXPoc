import { useQuery } from "@tanstack/react-query";
import { MedicalAlert } from "@shared/schema";

/**
 * Hook to fetch patient medical alerts
 */
export function useMedicalAlerts(patientId: number) {
  return useQuery<MedicalAlert[]>({
    queryKey: ['/api/patients', patientId, 'medical-alerts'],
    enabled: !!patientId, // Only run if we have a patientId
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}