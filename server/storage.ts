import {
  users, patients, appointments, medicalAlerts, documents, notes, payments, messages, recalls, treatments, insuranceClaims, activityLog,
  type User, type InsertUser,
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
} from "@shared/schema";

import { db } from "./db";
import { eq, and, desc, asc, sql, like } from "drizzle-orm";

// Define the type for upsertUser method
export type UpsertUser = {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageUrl?: string;
};

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Patient methods
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByChartNumber(chartNumber: string): Promise<Patient | undefined>;
  listPatients(limit?: number, offset?: number): Promise<Patient[]>;
  searchPatients(query: string): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined>;
  
  // Medical Alert methods
  listPatientMedicalAlerts(patientId: number): Promise<MedicalAlert[]>;
  createMedicalAlert(alert: InsertMedicalAlert): Promise<MedicalAlert>;
  
  // Appointment methods
  getPatientAppointments(patientId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  
  // Document methods
  getPatientDocuments(patientId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  // Note methods
  getPatientNotes(patientId: number): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  
  // Payment methods
  getPatientPayments(patientId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  
  // Message methods
  getPatientMessages(patientId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Recall methods
  getPatientRecalls(patientId: number): Promise<Recall[]>;
  createRecall(recall: InsertRecall): Promise<Recall>;
  
  // Treatment methods
  getPatientTreatments(patientId: number): Promise<Treatment[]>;
  createTreatment(treatment: InsertTreatment): Promise<Treatment>;
  
  // Insurance Claim methods
  getPatientClaims(patientId: number): Promise<Claim[]>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  
  // Activity methods
  logActivity(patientId: number | null, userId: string | null, actionType: string, description: string, metadata?: any): Promise<void>;
  getPatientActivityLog(patientId: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Patient methods
  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }
  
  async getPatientByChartNumber(chartNumber: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.chartNumber, chartNumber));
    return patient;
  }
  
  async listPatients(limit = 20, offset = 0): Promise<Patient[]> {
    return db.select().from(patients).limit(limit).offset(offset);
  }
  
  async searchPatients(query: string): Promise<Patient[]> {
    return db.select().from(patients).where(
      sql`CONCAT(${patients.firstName}, ' ', ${patients.lastName}) ILIKE ${`%${query}%`}`
    );
  }
  
  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db.insert(patients).values(patient).returning();
    return newPatient;
  }
  
  async updatePatient(id: number, patientData: Partial<InsertPatient>): Promise<Patient | undefined> {
    const [updatedPatient] = await db
      .update(patients)
      .set({ ...patientData, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    
    return updatedPatient;
  }
  
  // Medical Alert methods
  async listPatientMedicalAlerts(patientId: number): Promise<MedicalAlert[]> {
    return db
      .select()
      .from(medicalAlerts)
      .where(eq(medicalAlerts.patientId, patientId))
      .orderBy(desc(medicalAlerts.createdAt));
  }
  
  async createMedicalAlert(alert: InsertMedicalAlert): Promise<MedicalAlert> {
    const [newAlert] = await db.insert(medicalAlerts).values(alert).returning();
    return newAlert;
  }
  
  // Appointment methods
  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    return db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, patientId))
      .orderBy(desc(appointments.startTime));
  }
  
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }
  
  // Document methods
  async getPatientDocuments(patientId: number): Promise<Document[]> {
    return db
      .select()
      .from(documents)
      .where(eq(documents.patientId, patientId))
      .orderBy(desc(documents.uploadedAt));
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db.insert(documents).values(document).returning();
    return newDocument;
  }
  
  // Note methods
  async getPatientNotes(patientId: number): Promise<Note[]> {
    return db
      .select()
      .from(notes)
      .where(eq(notes.patientId, patientId))
      .orderBy(desc(notes.createdAt));
  }
  
  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }
  
  // Payment methods
  async getPatientPayments(patientId: number): Promise<Payment[]> {
    return db
      .select()
      .from(payments)
      .where(eq(payments.patientId, patientId))
      .orderBy(desc(payments.paymentDate));
  }
  
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }
  
  // Message methods
  async getPatientMessages(patientId: number): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.patientId, patientId))
      .orderBy(desc(messages.sentAt));
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }
  
  // Recall methods
  async getPatientRecalls(patientId: number): Promise<Recall[]> {
    return db
      .select()
      .from(recalls)
      .where(eq(recalls.patientId, patientId))
      .orderBy(asc(recalls.dueDate));
  }
  
  async createRecall(recall: InsertRecall): Promise<Recall> {
    const [newRecall] = await db.insert(recalls).values(recall).returning();
    return newRecall;
  }
  
  // Treatment methods
  async getPatientTreatments(patientId: number): Promise<Treatment[]> {
    return db
      .select()
      .from(treatments)
      .where(eq(treatments.patientId, patientId))
      .orderBy(desc(treatments.treatmentDate));
  }
  
  async createTreatment(treatment: InsertTreatment): Promise<Treatment> {
    const [newTreatment] = await db.insert(treatments).values(treatment).returning();
    return newTreatment;
  }
  
  // Insurance Claim methods
  async getPatientClaims(patientId: number): Promise<Claim[]> {
    return db
      .select()
      .from(insuranceClaims)
      .where(eq(insuranceClaims.patientId, patientId))
      .orderBy(desc(insuranceClaims.dateOfService));
  }
  
  async createClaim(claim: InsertClaim): Promise<Claim> {
    const [newClaim] = await db.insert(insuranceClaims).values(claim).returning();
    return newClaim;
  }
  
  // Activity Log methods
  async logActivity(
    patientId: number | null,
    userId: string | null,
    actionType: string,
    description: string,
    metadata: any = {}
  ): Promise<void> {
    await db.insert(activityLog).values({
      patientId,
      userId,
      actionType,
      description,
      metadata
    });
  }
  
  async getPatientActivityLog(patientId: number): Promise<any[]> {
    return db
      .select()
      .from(activityLog)
      .where(eq(activityLog.patientId, patientId))
      .orderBy(desc(activityLog.createdAt));
  }
}

export const storage = new DatabaseStorage();
