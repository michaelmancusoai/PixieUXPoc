import { apiRequest } from './queryClient';
import { 
  type Patient, type InsertPatient,
  type Appointment, type InsertAppointment,
  type MedicalAlert, type InsertMedicalAlert,
  type Document, type InsertDocument,
  type Note, type InsertNote,
  type Payment, type InsertPayment,
  type Message, type InsertMessage,
  type Recall, type InsertRecall,
  type Treatment, type InsertTreatment,
  type Claim, type InsertClaim
} from '@shared/schema';

const API_PREFIX = '/api';

// Patient API functions
export const getPatients = async (limit = 20, offset = 0) => {
  return apiRequest(`${API_PREFIX}/patients?limit=${limit}&offset=${offset}`, {
    method: 'GET',
  });
};

export const searchPatients = async (query: string) => {
  return apiRequest(`${API_PREFIX}/patients/search?q=${encodeURIComponent(query)}`, {
    method: 'GET',
  });
};

export const getPatient = async (id: number): Promise<Patient> => {
  return apiRequest(`${API_PREFIX}/patients/${id}`, {
    method: 'GET',
  });
};

export const createPatient = async (patient: InsertPatient): Promise<Patient> => {
  return apiRequest(`${API_PREFIX}/patients`, {
    method: 'POST',
    body: JSON.stringify(patient),
  });
};

export const updatePatient = async (id: number, patient: Partial<InsertPatient>): Promise<Patient> => {
  return apiRequest(`${API_PREFIX}/patients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patient),
  });
};

// Appointment API functions
export const getPatientAppointments = async (patientId: number): Promise<Appointment[]> => {
  return apiRequest(`${API_PREFIX}/patients/${patientId}/appointments`, {
    method: 'GET',
  });
};

export const createAppointment = async (appointment: InsertAppointment): Promise<Appointment> => {
  return apiRequest(`${API_PREFIX}/appointments`, {
    method: 'POST',
    body: JSON.stringify(appointment),
  });
};

// Medical Alert API functions
export const getPatientMedicalAlerts = async (patientId: number): Promise<MedicalAlert[]> => {
  return apiRequest(`${API_PREFIX}/patients/${patientId}/medical-alerts`, {
    method: 'GET',
  });
};

export const createMedicalAlert = async (alert: InsertMedicalAlert): Promise<MedicalAlert> => {
  return apiRequest(`${API_PREFIX}/medical-alerts`, {
    method: 'POST',
    body: JSON.stringify(alert),
  });
};

// Document API functions
export const getPatientDocuments = async (patientId: number): Promise<Document[]> => {
  return apiRequest(`${API_PREFIX}/patients/${patientId}/documents`, {
    method: 'GET',
  });
};

export const createDocument = async (document: InsertDocument): Promise<Document> => {
  return apiRequest(`${API_PREFIX}/documents`, {
    method: 'POST',
    body: JSON.stringify(document),
  });
};

// Note API functions
export const getPatientNotes = async (patientId: number): Promise<Note[]> => {
  return apiRequest(`${API_PREFIX}/patients/${patientId}/notes`, {
    method: 'GET',
  });
};

export const createNote = async (note: InsertNote): Promise<Note> => {
  return apiRequest(`${API_PREFIX}/notes`, {
    method: 'POST',
    body: JSON.stringify(note),
  });
};

// Payment API functions
export const getPatientPayments = async (patientId: number): Promise<Payment[]> => {
  return apiRequest(`${API_PREFIX}/patients/${patientId}/payments`, {
    method: 'GET',
  });
};

export const createPayment = async (payment: InsertPayment): Promise<Payment> => {
  return apiRequest(`${API_PREFIX}/payments`, {
    method: 'POST',
    body: JSON.stringify(payment),
  });
};

// Message API functions
export const getPatientMessages = async (patientId: number): Promise<Message[]> => {
  return apiRequest(`${API_PREFIX}/patients/${patientId}/messages`, {
    method: 'GET',
  });
};

export const createMessage = async (message: InsertMessage): Promise<Message> => {
  return apiRequest(`${API_PREFIX}/messages`, {
    method: 'POST',
    body: JSON.stringify(message),
  });
};

// Recall API functions
export const getPatientRecalls = async (patientId: number): Promise<Recall[]> => {
  return apiRequest(`${API_PREFIX}/patients/${patientId}/recalls`, {
    method: 'GET',
  });
};

export const createRecall = async (recall: InsertRecall): Promise<Recall> => {
  return apiRequest(`${API_PREFIX}/recalls`, {
    method: 'POST',
    body: JSON.stringify(recall),
  });
};

// Treatment API functions
export const getPatientTreatments = async (patientId: number): Promise<Treatment[]> => {
  return apiRequest(`${API_PREFIX}/patients/${patientId}/treatments`, {
    method: 'GET',
  });
};

export const createTreatment = async (treatment: InsertTreatment): Promise<Treatment> => {
  return apiRequest(`${API_PREFIX}/treatments`, {
    method: 'POST',
    body: JSON.stringify(treatment),
  });
};

// Claim API functions
export const getPatientClaims = async (patientId: number): Promise<Claim[]> => {
  return apiRequest(`${API_PREFIX}/patients/${patientId}/claims`, {
    method: 'GET',
  });
};

export const createClaim = async (claim: InsertClaim): Promise<Claim> => {
  return apiRequest(`${API_PREFIX}/claims`, {
    method: 'POST',
    body: JSON.stringify(claim),
  });
};

// Activity Log API function
export const getPatientActivityLog = async (patientId: number): Promise<any[]> => {
  return apiRequest(`${API_PREFIX}/patients/${patientId}/activity`, {
    method: 'GET',
  });
};