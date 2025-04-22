import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  // Medical Alerts
  getPatientMedicalAlerts, createMedicalAlert,
  // Appointments
  getPatientAppointments, createAppointment,
  // Documents
  getPatientDocuments, createDocument,
  // Notes
  getPatientNotes, createNote,
  // Payments
  getPatientPayments, createPayment,
  // Messages
  getPatientMessages, createMessage,
  // Recalls
  getPatientRecalls, createRecall,
  // Treatments
  getPatientTreatments, createTreatment,
  // Insurance Claims
  getPatientClaims, createClaim,
  // Activity Log
  getPatientActivityLog
} from '@/lib/api';
import {
  InsertMedicalAlert, InsertAppointment, 
  InsertDocument, InsertNote, InsertPayment,
  InsertMessage, InsertRecall, InsertTreatment, InsertClaim
} from '@shared/schema';

// Medical Alerts Hooks
export function usePatientMedicalAlerts(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'medical-alerts'],
    queryFn: () => getPatientMedicalAlerts(patientId),
    enabled: !!patientId,
  });
}

export function useCreateMedicalAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (alert: InsertMedicalAlert) => createMedicalAlert(alert),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients', variables.patientId, 'medical-alerts'] });
    },
  });
}

// Appointments Hooks
export function usePatientAppointments(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'appointments'],
    queryFn: () => getPatientAppointments(patientId),
    enabled: !!patientId,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (appointment: InsertAppointment) => createAppointment(appointment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients', variables.patientId, 'appointments'] });
    },
  });
}

// Documents Hooks
export function usePatientDocuments(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'documents'],
    queryFn: () => getPatientDocuments(patientId),
    enabled: !!patientId,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (document: InsertDocument) => createDocument(document),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients', variables.patientId, 'documents'] });
    },
  });
}

// Notes Hooks
export function usePatientNotes(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'notes'],
    queryFn: () => getPatientNotes(patientId),
    enabled: !!patientId,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (note: InsertNote) => createNote(note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients', variables.patientId, 'notes'] });
    },
  });
}

// Payments Hooks
export function usePatientPayments(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'payments'],
    queryFn: () => getPatientPayments(patientId),
    enabled: !!patientId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payment: InsertPayment) => createPayment(payment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients', variables.patientId, 'payments'] });
    },
  });
}

// Messages Hooks
export function usePatientMessages(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'messages'],
    queryFn: () => getPatientMessages(patientId),
    enabled: !!patientId,
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (message: InsertMessage) => createMessage(message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients', variables.patientId, 'messages'] });
    },
  });
}

// Recalls Hooks
export function usePatientRecalls(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'recalls'],
    queryFn: () => getPatientRecalls(patientId),
    enabled: !!patientId,
  });
}

export function useCreateRecall() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recall: InsertRecall) => createRecall(recall),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients', variables.patientId, 'recalls'] });
    },
  });
}

// Treatments Hooks
export function usePatientTreatments(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'treatments'],
    queryFn: () => getPatientTreatments(patientId),
    enabled: !!patientId,
  });
}

export function useCreateTreatment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (treatment: InsertTreatment) => createTreatment(treatment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients', variables.patientId, 'treatments'] });
    },
  });
}

// Insurance Claims Hooks
export function usePatientClaims(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'claims'],
    queryFn: () => getPatientClaims(patientId),
    enabled: !!patientId,
  });
}

export function useCreateClaim() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (claim: InsertClaim) => createClaim(claim),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients', variables.patientId, 'claims'] });
    },
  });
}

// Activity Log Hooks
export function usePatientActivityLog(patientId: number) {
  return useQuery({
    queryKey: ['/api/patients', patientId, 'activity'],
    queryFn: () => getPatientActivityLog(patientId),
    enabled: !!patientId,
  });
}