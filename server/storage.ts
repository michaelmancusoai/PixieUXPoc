import {
  users, patients, appointments, medicalAlerts, documents, notes, payments, messages, recalls, treatments, insuranceClaims, activityLog,
  providers, operatories, waitlist,
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
  type Claim, type InsertClaim,
  type Provider, type InsertProvider,
  type Operatory, type InsertOperatory,
  type Waitlist, type InsertWaitlist,
  type AppointmentWithDetails
} from "@shared/schema";

import { db } from "./db";
import { eq, and, desc, asc, sql, like } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  logActivity(patientId: number | null, userId: number | null, actionType: string, description: string, metadata?: any): Promise<void>;
  getPatientActivityLog(patientId: number): Promise<any[]>;
  
  // Provider methods
  getProviders(): Promise<Provider[]>;
  getProvider(id: number): Promise<Provider | undefined>;
  createProvider(provider: InsertProvider): Promise<Provider>;
  updateProvider(id: number, data: Partial<InsertProvider>): Promise<Provider | undefined>;
  
  // Operatory methods
  getOperatories(): Promise<Operatory[]>;
  getOperatory(id: number): Promise<Operatory | undefined>;
  createOperatory(operatory: InsertOperatory): Promise<Operatory>;
  updateOperatory(id: number, data: Partial<InsertOperatory>): Promise<Operatory | undefined>;
  
  // Scheduling specific methods
  getAppointmentsByDate(date: string): Promise<AppointmentWithDetails[]>;
  getAppointmentsByDateRange(startDate: string, endDate: string): Promise<AppointmentWithDetails[]>;
  getAllAppointments(): Promise<AppointmentWithDetails[]>;
  updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;
  
  // Waitlist methods
  getWaitlist(): Promise<Waitlist[]>;
  addToWaitlist(waitlistItem: InsertWaitlist): Promise<Waitlist>;
  removeFromWaitlist(id: number): Promise<boolean>;
  
  // Scheduling utilities
  getUtilizationByDate(date: string): Promise<{ percentage: number, totalSlots: number, bookedSlots: number }>;
  getGapsByDate(date: string): Promise<{ startTime: string, endTime: string, duration: number, operatoryId?: number, providerId?: number }[]>;
  getArrivedPatients(date: string): Promise<AppointmentWithDetails[]>;
  getPendingCheckout(date: string): Promise<AppointmentWithDetails[]>;
  getBenefitsVerification(): Promise<{ patientId: number, patientName: string, insuranceProvider: string, status: string, lastChecked: string }[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
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
    userId: number | null,
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

  // Provider methods
  async getProviders(): Promise<Provider[]> {
    return db.select().from(providers);
  }

  async getProvider(id: number): Promise<Provider | undefined> {
    const [provider] = await db.select().from(providers).where(eq(providers.id, id));
    return provider;
  }

  async createProvider(provider: InsertProvider): Promise<Provider> {
    const [newProvider] = await db.insert(providers).values(provider).returning();
    return newProvider;
  }

  async updateProvider(id: number, data: Partial<InsertProvider>): Promise<Provider | undefined> {
    const [updatedProvider] = await db
      .update(providers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(providers.id, id))
      .returning();
    
    return updatedProvider;
  }

  // Operatory methods
  async getOperatories(): Promise<Operatory[]> {
    return db.select().from(operatories);
  }

  async getOperatory(id: number): Promise<Operatory | undefined> {
    const [operatory] = await db.select().from(operatories).where(eq(operatories.id, id));
    return operatory;
  }

  async createOperatory(operatory: InsertOperatory): Promise<Operatory> {
    const [newOperatory] = await db.insert(operatories).values(operatory).returning();
    return newOperatory;
  }

  async updateOperatory(id: number, data: Partial<InsertOperatory>): Promise<Operatory | undefined> {
    const [updatedOperatory] = await db
      .update(operatories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(operatories.id, id))
      .returning();
    
    return updatedOperatory;
  }

  // Scheduling specific methods
  async getAppointmentsByDate(date: string): Promise<AppointmentWithDetails[]> {
    const results = await db
      .select({
        appointment: appointments,
        patient: patients,
        provider: users,
        operatory: operatories
      })
      .from(appointments)
      .where(eq(appointments.date, new Date(date)))
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(users, eq(appointments.providerId, users.id))
      .leftJoin(operatories, eq(appointments.operatoryId, operatories.id))
      .orderBy(appointments.startTime);

    return results.map(({appointment, patient, provider, operatory}) => ({
      ...appointment,
      patient,
      provider,
      operatory
    }));
  }

  async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<AppointmentWithDetails[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const results = await db
      .select({
        appointment: appointments,
        patient: patients,
        provider: users,
        operatory: operatories
      })
      .from(appointments)
      .where(
        and(
          sql`${appointments.date} >= ${start}`,
          sql`${appointments.date} <= ${end}`
        )
      )
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(users, eq(appointments.providerId, users.id))
      .leftJoin(operatories, eq(appointments.operatoryId, operatories.id))
      .orderBy(appointments.startTime);

    return results.map(({appointment, patient, provider, operatory}) => ({
      ...appointment,
      patient,
      provider,
      operatory
    }));
  }

  async getAllAppointments(): Promise<AppointmentWithDetails[]> {
    const results = await db
      .select({
        appointment: appointments,
        patient: patients,
        provider: users,
        operatory: operatories
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(users, eq(appointments.providerId, users.id))
      .leftJoin(operatories, eq(appointments.operatoryId, operatories.id))
      .orderBy(appointments.startTime);

    return results.map(({appointment, patient, provider, operatory}) => ({
      ...appointment,
      patient,
      provider,
      operatory
    }));
  }

  async updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    
    return updatedAppointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const now = new Date();
    
    // Determine which status timestamp to update
    const statusTimestamps: Record<string, any> = {
      'CONFIRMED': { confirmedAt: now },
      'CHECKED_IN': { arrivedAt: now },
      'SEATED': { seatedAt: now },
      'PRE_CLINICAL': { preClinicalAt: now },
      'DOCTOR_READY': { doctorReadyAt: now },
      'IN_CHAIR': { chairStartedAt: now },
      'WRAP_UP': { wrapUpAt: now },
      'READY_CHECKOUT': { readyCheckoutAt: now },
      'COMPLETED': { completedAt: now }
    };

    const timestampUpdate = statusTimestamps[status] || {};

    const [updatedAppointment] = await db
      .update(appointments)
      .set({ 
        status, 
        statusUpdatedAt: now,
        ...timestampUpdate,
        updatedAt: now 
      })
      .where(eq(appointments.id, id))
      .returning();
    
    return updatedAppointment;
  }

  // Waitlist methods
  async getWaitlist(): Promise<Waitlist[]> {
    return db
      .select()
      .from(waitlist)
      .orderBy(asc(waitlist.requestDate));
  }

  async addToWaitlist(waitlistItem: InsertWaitlist): Promise<Waitlist> {
    const [newWaitlistItem] = await db.insert(waitlist).values(waitlistItem).returning();
    return newWaitlistItem;
  }

  async removeFromWaitlist(id: number): Promise<boolean> {
    const result = await db
      .delete(waitlist)
      .where(eq(waitlist.id, id))
      .returning();
    
    return result.length > 0;
  }

  // Scheduling utilities
  async getUtilizationByDate(date: string): Promise<{ percentage: number, totalSlots: number, bookedSlots: number }> {
    // This is a simplified implementation
    // In a real-world scenario, you would need to account for provider schedules, working hours, etc.
    
    const targetDate = new Date(date);
    
    // Count booked appointments for the date
    const bookedAppointments = await db
      .select({ count: sql<number>`count(*)` })
      .from(appointments)
      .where(eq(appointments.date, targetDate));
    
    const bookedSlots = bookedAppointments[0].count || 0;
    
    // For this example, assume 8 hours of availability with 30-minute slots per provider
    const providersCount = (await this.getProviders()).length || 1;
    const totalSlots = providersCount * 16; // 8 hours with 30-minute slots = 16 slots per provider
    
    const percentage = Math.min(100, Math.round((bookedSlots / totalSlots) * 100));
    
    return {
      percentage,
      totalSlots,
      bookedSlots
    };
  }

  async getGapsByDate(date: string): Promise<{ startTime: string, endTime: string, duration: number, operatoryId?: number, providerId?: number }[]> {
    // This method would identify available gaps in the schedule
    // For simplicity, we'll return a mock response
    // In a real implementation, this would analyze the existing appointments and find gaps
    
    return [
      {
        startTime: `${date}T09:30:00.000Z`,
        endTime: `${date}T10:00:00.000Z`,
        duration: 30
      },
      {
        startTime: `${date}T14:00:00.000Z`,
        endTime: `${date}T15:00:00.000Z`,
        duration: 60
      }
    ];
  }

  async getArrivedPatients(date: string): Promise<AppointmentWithDetails[]> {
    const results = await db
      .select({
        appointment: appointments,
        patient: patients,
        provider: users,
        operatory: operatories
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.date, new Date(date)),
          sql`${appointments.status} IN ('CHECKED_IN', 'SEATED', 'PRE_CLINICAL', 'DOCTOR_READY', 'IN_CHAIR', 'WRAP_UP')`
        )
      )
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(users, eq(appointments.providerId, users.id))
      .leftJoin(operatories, eq(appointments.operatoryId, operatories.id))
      .orderBy(appointments.arrivedAt);

    return results.map(({appointment, patient, provider, operatory}) => ({
      ...appointment,
      patient,
      provider,
      operatory
    }));
  }

  async getPendingCheckout(date: string): Promise<AppointmentWithDetails[]> {
    const results = await db
      .select({
        appointment: appointments,
        patient: patients,
        provider: users,
        operatory: operatories
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.date, new Date(date)),
          eq(appointments.status, 'READY_CHECKOUT')
        )
      )
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(users, eq(appointments.providerId, users.id))
      .leftJoin(operatories, eq(appointments.operatoryId, operatories.id))
      .orderBy(appointments.readyCheckoutAt);

    return results.map(({appointment, patient, provider, operatory}) => ({
      ...appointment,
      patient,
      provider,
      operatory
    }));
  }

  async getBenefitsVerification(): Promise<{ patientId: number, patientName: string, insuranceProvider: string, status: string, lastChecked: string }[]> {
    // This would typically query pending insurance verifications
    // For demonstration, returning a mock response
    
    const patientResults = await db
      .select()
      .from(patients)
      .where(sql`${patients.insuranceProvider} IS NOT NULL`)
      .limit(5);
    
    return patientResults.map(patient => ({
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      insuranceProvider: patient.insuranceProvider || 'Unknown',
      status: 'PENDING',
      lastChecked: new Date().toISOString().split('T')[0]
    }));
  }
}

export const storage = new DatabaseStorage();
