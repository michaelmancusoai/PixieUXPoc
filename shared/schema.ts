import { pgTable, text, serial, integer, boolean, timestamp, date, decimal, json, varchar, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Basic user authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("staff").notNull(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  patients: many(patients),
}));

// Patients
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  chartNumber: text("chart_number").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  insuranceProvider: text("insurance_provider"),
  policyNumber: text("policy_number"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const patientsRelations = relations(patients, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [patients.createdBy],
    references: [users.id],
  }),
  appointments: many(appointments),
  medicalAlerts: many(medicalAlerts),
  recalls: many(recalls),
  treatments: many(treatments),
  documents: many(documents),
  notes: many(notes),
  claims: many(insuranceClaims),
}));

// Medical Alerts
export const medicalAlerts = pgTable("medical_alerts", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  type: text("type").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const medicalAlertsRelations = relations(medicalAlerts, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalAlerts.patientId],
    references: [patients.id],
  }),
}));

// Appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  providerId: integer("provider_id").references(() => users.id),
  operatoryId: integer("operatory_id"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  appointmentType: text("appointment_type").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  date: date("date").notNull().default(new Date()),
  duration: integer("duration").notNull().default(30), // Duration in minutes
  cdtCode: text("cdt_code"), // Dental procedure code
  procedure: text("procedure"), // Human-readable procedure name
  confirmedAt: timestamp("confirmed_at"),
  arrivedAt: timestamp("arrived_at"),
  seatedAt: timestamp("seated_at"),
  preClinicalAt: timestamp("pre_clinical_at"),
  doctorReadyAt: timestamp("doctor_ready_at"),
  chairStartedAt: timestamp("chair_started_at"),
  wrapUpAt: timestamp("wrap_up_at"),
  readyCheckoutAt: timestamp("ready_checkout_at"),
  completedAt: timestamp("completed_at"),
  statusUpdatedAt: timestamp("status_updated_at"), // Last time status was updated
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  provider: one(users, {
    fields: [appointments.providerId],
    references: [users.id],
  }),
  operatory: one(operatories, {
    fields: [appointments.operatoryId],
    references: [operatories.id],
  }),
}));

// Insurance Claims
export const insuranceClaims = pgTable("insurance_claims", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  claimNumber: text("claim_number").notNull().unique(),
  dateOfService: date("date_of_service").notNull(),
  submittedDate: date("submitted_date"),
  status: text("status").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insuranceClaimsRelations = relations(insuranceClaims, ({ one }) => ({
  patient: one(patients, {
    fields: [insuranceClaims.patientId],
    references: [patients.id],
  }),
}));

// Recalls
export const recalls = pgTable("recalls", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  type: text("type").notNull(),
  dueDate: date("due_date").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const recallsRelations = relations(recalls, ({ one }) => ({
  patient: one(patients, {
    fields: [recalls.patientId],
    references: [patients.id],
  }),
}));

// Treatments
export const treatments = pgTable("treatments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  providerId: integer("provider_id").references(() => users.id),
  treatmentDate: date("treatment_date").notNull(),
  procedure: text("procedure").notNull(),
  toothNumber: integer("tooth_number"),
  status: text("status").notNull(),
  notes: text("notes"),
  fee: decimal("fee", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const treatmentsRelations = relations(treatments, ({ one }) => ({
  patient: one(patients, {
    fields: [treatments.patientId],
    references: [patients.id],
  }),
  provider: one(users, {
    fields: [treatments.providerId],
    references: [users.id],
  }),
}));

// Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  title: text("title").notNull(),
  documentType: text("document_type").notNull(),
  filePath: text("file_path").notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  patient: one(patients, {
    fields: [documents.patientId],
    references: [patients.id],
  }),
  uploader: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));

// Clinical Notes
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  authorId: integer("author_id").references(() => users.id),
  noteType: text("note_type").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull(), // e.g., "draft", "signed"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notesRelations = relations(notes, ({ one }) => ({
  patient: one(patients, {
    fields: [notes.patientId],
    references: [patients.id],
  }),
  author: one(users, {
    fields: [notes.authorId],
    references: [users.id],
  }),
}));

// Payment Transactions
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  paymentMethod: text("payment_method").notNull(),
  reference: text("reference"),
  description: text("description"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  patient: one(patients, {
    fields: [payments.patientId],
    references: [patients.id],
  }),
  createdByUser: one(users, {
    fields: [payments.createdBy],
    references: [users.id],
  }),
}));

// Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  senderId: integer("sender_id").references(() => users.id),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  messageType: text("message_type").notNull(), // e.g., "email", "sms", "portal"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  patient: one(patients, {
    fields: [messages.patientId],
    references: [patients.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

// Activity Log
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  userId: integer("user_id").references(() => users.id),
  actionType: text("action_type").notNull(),
  description: text("description").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  patient: one(patients, {
    fields: [activityLog.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [activityLog.userId],
    references: [users.id],
  }),
}));

// Scheduling-specific schemas
export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // "DENTIST", "HYGIENIST", etc.
  color: text("color"), // Color for the provider's appointments
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const providersRelations = relations(providers, ({ many }) => ({
  appointments: many(appointments),
}));

export const operatories = pgTable("operatories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Op 1", "Op 2", etc.
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const operatoriesRelations = relations(operatories, ({ many }) => ({
  appointments: many(appointments),
}));

// Waitlist for scheduling
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  requestedProcedure: text("requested_procedure"),
  propensityScore: integer("propensity_score"), // 0-100 match score
  requestDate: timestamp("request_date").notNull().defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const waitlistRelations = relations(waitlist, ({ one }) => ({
  patient: one(patients, {
    fields: [waitlist.patientId],
    references: [patients.id],
  }),
}));

// Create schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicalAlertSchema = createInsertSchema(medicalAlerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecallSchema = createInsertSchema(recalls).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProviderSchema = createInsertSchema(providers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOperatorySchema = createInsertSchema(operatories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Scheduling specific enums
export const AppointmentStatus = {
  SCHEDULED: "SCHEDULED",
  CONFIRMED: "CONFIRMED",
  CHECKED_IN: "CHECKED_IN",
  SEATED: "SEATED",
  PRE_CLINICAL: "PRE_CLINICAL",
  DOCTOR_READY: "DOCTOR_READY",
  IN_CHAIR: "IN_CHAIR",
  WRAP_UP: "WRAP_UP",
  READY_CHECKOUT: "READY_CHECKOUT",
  COMPLETED: "COMPLETED",
  LATE: "LATE",
  NO_SHOW: "NO_SHOW",
  CANCELLED: "CANCELLED",
} as const;

export type AppointmentStatusType = keyof typeof AppointmentStatus;

export const ProviderRole = {
  DENTIST: "DENTIST",
  HYGIENIST: "HYGIENIST",
  ASSISTANT: "ASSISTANT",
} as const;

export type ProviderRoleType = keyof typeof ProviderRole;

export const ViewMode = {
  DAY: "DAY",
  WEEK: "WEEK",
  OPERATORY: "OPERATORY",
  PROVIDER: "PROVIDER",
} as const;

export type ViewModeType = keyof typeof ViewMode;

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type InsertMedicalAlert = z.infer<typeof insertMedicalAlertSchema>;
export type MedicalAlert = typeof medicalAlerts.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertRecall = z.infer<typeof insertRecallSchema>;
export type Recall = typeof recalls.$inferSelect;

export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Provider = typeof providers.$inferSelect;

export type InsertOperatory = z.infer<typeof insertOperatorySchema>;
export type Operatory = typeof operatories.$inferSelect;

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

// Combined types for frontend use
export type AppointmentWithDetails = Appointment & {
  patient: Patient;
  provider?: User;
  operatory?: Operatory;
};

export const insertTreatmentSchema = createInsertSchema(treatments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTreatment = z.infer<typeof insertTreatmentSchema>;
export type Treatment = typeof treatments.$inferSelect;

export const insertClaimSchema = createInsertSchema(insuranceClaims).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Claim = typeof insuranceClaims.$inferSelect;
