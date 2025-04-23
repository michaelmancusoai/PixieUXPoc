import { pgTable, text, serial, integer, boolean, timestamp, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Scheduling-specific schemas
export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // "DENTIST", "HYGIENIST", etc.
  color: text("color"), // Color for the provider's appointments
});

export const insertProviderSchema = createInsertSchema(providers).pick({
  name: true,
  role: true,
  color: true,
});

export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Provider = typeof providers.$inferSelect;

export const operatories = pgTable("operatories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Op 1", "Op 2", etc.
  color: text("color"),
});

export const insertOperatorySchema = createInsertSchema(operatories).pick({
  name: true,
  color: true,
});

export type InsertOperatory = z.infer<typeof insertOperatorySchema>;
export type Operatory = typeof operatories.$inferSelect;

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  avatarInitials: text("avatar_initials"), // Initials for avatar display
  insuranceProvider: text("insurance_provider"), // Name of insurance company
  allergies: text("allergies"), // Patient allergies
  balanceDue: integer("balance_due").default(0), // Amount due in cents
});

export const insertPatientSchema = createInsertSchema(patients).pick({
  firstName: true,
  lastName: true,
  avatarInitials: true,
  insuranceProvider: true,
  balanceDue: true,
});

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  providerId: integer("provider_id"),
  operatoryId: integer("operatory_id"),
  date: timestamp("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time"), // End time of appointment
  duration: integer("duration").notNull(), // Duration in minutes
  durationMinutes: integer("duration_minutes").default(30), // Duration in minutes (for display) 
  cdtCode: text("cdt_code"), // Dental procedure code
  procedure: text("procedure"), // Human-readable procedure name
  status: text("status").notNull().default("SCHEDULED"),
  notes: text("notes"),
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
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  requestedProcedure: text("requested_procedure"),
  propensityScore: integer("propensity_score"), // 0-100 match score
  requestDate: timestamp("request_date").notNull().defaultNow(),
  notes: text("notes"),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
});

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

// Combined types for frontend use
export type AppointmentWithDetails = Appointment & {
  patient: Patient;
  provider?: Provider;
  operatory?: Operatory;
};

export type WaitlistWithPatient = Waitlist & {
  patient: Patient;
};

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
