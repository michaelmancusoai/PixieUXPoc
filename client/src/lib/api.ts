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
export const getPatients = async (limit = 20, offset = 0): Promise<Patient[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients?limit=${limit}&offset=${offset}`
  );
  return res.json();
};

export const searchPatients = async (query: string): Promise<Patient[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/search?q=${encodeURIComponent(query)}`
  );
  return res.json();
};

export const getPatient = async (id: number): Promise<Patient> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/${id}`
  );
  return res.json();
};

export const createPatient = async (patient: InsertPatient): Promise<Patient> => {
  const res = await apiRequest(
    'POST',
    `${API_PREFIX}/patients`,
    patient
  );
  return res.json();
};

export const updatePatient = async (id: number, patient: Partial<InsertPatient>): Promise<Patient> => {
  const res = await apiRequest(
    'PATCH',
    `${API_PREFIX}/patients/${id}`,
    patient
  );
  return res.json();
};

// Appointment API functions
export const getPatientAppointments = async (patientId: number): Promise<Appointment[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/${patientId}/appointments`
  );
  return res.json();
};

export const createAppointment = async (appointment: InsertAppointment): Promise<Appointment> => {
  const res = await apiRequest(
    'POST',
    `${API_PREFIX}/appointments`,
    appointment
  );
  return res.json();
};

// Medical Alert API functions
export const getPatientMedicalAlerts = async (patientId: number): Promise<MedicalAlert[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/${patientId}/medical-alerts`
  );
  return res.json();
};

export const createMedicalAlert = async (alert: InsertMedicalAlert): Promise<MedicalAlert> => {
  const res = await apiRequest(
    'POST',
    `${API_PREFIX}/medical-alerts`,
    alert
  );
  return res.json();
};

// Document API functions
export const getPatientDocuments = async (patientId: number): Promise<Document[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/${patientId}/documents`
  );
  return res.json();
};

export const createDocument = async (document: InsertDocument): Promise<Document> => {
  const res = await apiRequest(
    'POST',
    `${API_PREFIX}/documents`,
    document
  );
  return res.json();
};

// Note API functions
export const getPatientNotes = async (patientId: number): Promise<Note[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/${patientId}/notes`
  );
  return res.json();
};

export const createNote = async (note: InsertNote): Promise<Note> => {
  const res = await apiRequest(
    'POST',
    `${API_PREFIX}/notes`,
    note
  );
  return res.json();
};

// Payment API functions
export const getPatientPayments = async (patientId: number): Promise<Payment[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/${patientId}/payments`
  );
  return res.json();
};

export const createPayment = async (payment: InsertPayment): Promise<Payment> => {
  const res = await apiRequest(
    'POST',
    `${API_PREFIX}/payments`,
    payment
  );
  return res.json();
};

// Message API functions
export const getPatientMessages = async (patientId: number): Promise<Message[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/${patientId}/messages`
  );
  return res.json();
};

export const createMessage = async (message: InsertMessage): Promise<Message> => {
  const res = await apiRequest(
    'POST',
    `${API_PREFIX}/messages`,
    message
  );
  return res.json();
};

// Recall API functions
export const getPatientRecalls = async (patientId: number): Promise<Recall[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/${patientId}/recalls`
  );
  return res.json();
};

export const createRecall = async (recall: InsertRecall): Promise<Recall> => {
  const res = await apiRequest(
    'POST',
    `${API_PREFIX}/recalls`,
    recall
  );
  return res.json();
};

// Treatment API functions
export const getPatientTreatments = async (patientId: number): Promise<Treatment[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/${patientId}/treatments`
  );
  return res.json();
};

export const createTreatment = async (treatment: InsertTreatment): Promise<Treatment> => {
  const res = await apiRequest(
    'POST',
    `${API_PREFIX}/treatments`,
    treatment
  );
  return res.json();
};

// Claim API functions
export const getPatientClaims = async (patientId: number): Promise<Claim[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/${patientId}/claims`
  );
  return res.json();
};

export const createClaim = async (claim: InsertClaim): Promise<Claim> => {
  const res = await apiRequest(
    'POST',
    `${API_PREFIX}/claims`,
    claim
  );
  return res.json();
};

// Activity Log API function
export const getPatientActivityLog = async (patientId: number): Promise<any[]> => {
  const res = await apiRequest(
    'GET',
    `${API_PREFIX}/patients/${patientId}/activity`
  );
  return res.json();
};