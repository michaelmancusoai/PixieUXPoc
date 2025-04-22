import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getPatients, getPatient, searchPatients, 
  createPatient, updatePatient 
} from '@/lib/api';
import { InsertPatient } from '@shared/schema';

// Get a list of patients with pagination
export function usePatients(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['/api/patients', limit, offset],
    queryFn: () => getPatients(limit, offset)
  });
}

// Get a single patient by ID
export function usePatient(id: number) {
  return useQuery({
    queryKey: ['/api/patients', id],
    queryFn: () => getPatient(id),
    enabled: !!id, // Only run if id is provided
  });
}

// Search for patients by query
export function useSearchPatients(query: string) {
  return useQuery({
    queryKey: ['/api/patients/search', query],
    queryFn: () => searchPatients(query),
    enabled: query.length > 0, // Only run if query is not empty
  });
}

// Create a new patient
export function useCreatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patient: InsertPatient) => createPatient(patient),
    onSuccess: () => {
      // Invalidate patients list to refetch with new data
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
    },
  });
}

// Update an existing patient
export function useUpdatePatient(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (patientData: Partial<InsertPatient>) => updatePatient(id, patientData),
    onSuccess: (data) => {
      // Update the specific patient query and the patient list
      queryClient.invalidateQueries({ queryKey: ['/api/patients', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
    },
  });
}