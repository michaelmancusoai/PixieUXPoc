import { pgTable, text, serial, integer, boolean, timestamp, json, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const accountStageEnum = pgEnum("account_stage", [
  "invited",
  "pending",
  "active",
  "suspended",
  "deactivated"
]);

export const userRoleEnum = pgEnum("user_role", [
  "dentist",
  "dental_hygienist",
  "dental_assistant",
  "practice_manager",
  "front_office",
  "billing_coordinator",
  "lab_technician",
  "it_administrator",
]);

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  prefix: text("prefix"), // Dr., Prof., etc.
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
  // Role and permissions
  roles: json("roles").$type<string[]>().default(['front_office']).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  npi: text("npi"), // National Provider Identifier
  specialty: text("specialty"),
  
  // Account status
  accountStage: accountStageEnum("account_stage").default("pending").notNull(),
  lastLoginAt: timestamp("last_login_at"),
  
  // Other details
  languages: json("languages").$type<string[]>().default(['en']),
  primaryLocation: text("primary_location"),
  profileImageUrl: text("profile_image_url"),
  qualifications: json("qualifications").$type<{
    code: string;
    issuer: string;
    period: {
      start: string;
      end?: string;
    }
  }[]>(),
  
  // Metadata and settings
  settings: json("settings").$type<Record<string, any>>(),
  metadata: json("metadata").$type<Record<string, any>>(),
});

// Locations table
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Many-to-many relationship for users and locations
export const userLocations = pgTable("user_locations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  locationId: integer("location_id").references(() => locations.id, { onDelete: "cascade" }).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
});

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true
}).extend({
  confirmPassword: z.string().min(6)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

// Re-export existing schemas
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  chartNumber: text("chart_number").notNull().unique(),
  email: text("email"),
  phone: text("phone"),
  dob: text("dob"),
  address: text("address"),
  insuranceProvider: text("insurance_provider"),
  insurancePolicyNumber: text("insurance_policy_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

// ---- Additional existing tables would go here ----