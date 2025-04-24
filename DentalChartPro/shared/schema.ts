import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Dental schema
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  lastVisit: text("last_visit"),
  insuranceName: text("insurance_name"),
  insuranceDetails: text("insurance_details"),
  alerts: json("alerts").$type<string[]>(),
});

export const procedures = pgTable("procedures", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  fee: integer("fee").notNull(),
  category: text("category").notNull(),
  isFavorite: boolean("is_favorite").default(false),
});

export const teeth = pgTable("teeth", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  number: integer("number").notNull(),
  surfaces: json("surfaces").$type<{
    surface: string;
    status: string;
  }[]>(),
});

export const treatmentPlans = pgTable("treatment_plans", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  planType: text("plan_type").notNull(),
});

export const treatmentPlanItems = pgTable("treatment_plan_items", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull(),
  priority: integer("priority").notNull(),
  toothNumber: integer("tooth_number").notNull(),
  surfaces: json("surfaces").$type<string[]>(),
  procedureId: integer("procedure_id").notNull(),
  status: text("status").notNull(),
  fee: integer("fee").notNull(),
  insuranceAmount: integer("insurance_amount").notNull(),
  patientAmount: integer("patient_amount").notNull(),
  provider: text("provider").notNull(),
});

export const insertPatientSchema = createInsertSchema(patients);
export const insertProcedureSchema = createInsertSchema(procedures);
export const insertToothSchema = createInsertSchema(teeth);
export const insertTreatmentPlanSchema = createInsertSchema(treatmentPlans);
export const insertTreatmentPlanItemSchema = createInsertSchema(treatmentPlanItems);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export type InsertProcedure = z.infer<typeof insertProcedureSchema>;
export type Procedure = typeof procedures.$inferSelect;

export type InsertTooth = z.infer<typeof insertToothSchema>;
export type Tooth = typeof teeth.$inferSelect;

export type InsertTreatmentPlan = z.infer<typeof insertTreatmentPlanSchema>;
export type TreatmentPlan = typeof treatmentPlans.$inferSelect;

export type InsertTreatmentPlanItem = z.infer<typeof insertTreatmentPlanItemSchema>;
export type TreatmentPlanItem = typeof treatmentPlanItems.$inferSelect;
