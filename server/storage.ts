import { and, desc, eq, like, or } from "drizzle-orm";
import { 
  users, type User, type InsertUser,
  locations, type Location, type InsertLocation,
  userLocations,
  patients, type Patient, type InsertPatient,
  accountStageEnum
} from "@shared/schema";
import { db, pool } from "./db";
import * as crypto from "crypto";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

// Helper functions
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${hash}.${salt}`;
}

async function verifyPassword(suppliedPassword: string, storedPassword: string): Promise<boolean> {
  const [hash, salt] = storedPassword.split(".");
  const suppliedHash = crypto.pbkdf2Sync(suppliedPassword, salt, 1000, 64, "sha512").toString("hex");
  return hash === suppliedHash;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  changeUserAccountStage(id: number, stage: string): Promise<User | undefined>;
  listUsers(limit?: number, offset?: number): Promise<User[]>;
  searchUsers(query: string): Promise<User[]>;
  setUserAdmin(id: number, isAdmin: boolean): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Location methods
  createLocation(location: InsertLocation): Promise<Location>;
  getLocation(id: number): Promise<Location | undefined>;
  listLocations(): Promise<Location[]>;
  updateLocation(id: number, data: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: number): Promise<boolean>;
  assignUserToLocation(userId: number, locationId: number, isPrimary?: boolean): Promise<boolean>;
  removeUserFromLocation(userId: number, locationId: number): Promise<boolean>;
  getUserLocations(userId: number): Promise<Location[]>;
  
  // Patient methods
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByChartNumber(chartNumber: string): Promise<Patient | undefined>;
  listPatients(limit?: number, offset?: number): Promise<Patient[]>;
  searchPatients(query: string): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined>;
  
  // Session store
  sessionStore: any; // Using any to avoid express-session type issues
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    // Use the pool directly from the imported db module
    this.sessionStore = new PostgresSessionStore({
      pool: pool,
      createTableIfMissing: true
    });
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    // Hash password before storing
    const hashedPassword = await hashPassword(userData.password);
    
    // Remove confirmPassword as it's not part of the table schema
    const { confirmPassword, ...userDataWithoutConfirm } = userData;
    
    const [user] = await db
      .insert(users)
      .values({
        ...userDataWithoutConfirm,
        password: hashedPassword,
        // Set the first user as admin
        isAdmin: await this.isFirstUser()
      })
      .returning();
    
    return user;
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    // Don't directly update password through this method for security
    // Use a separate method for password change with verification
    const { password, confirmPassword, ...updateData } = data;
    
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }
  
  async changeUserAccountStage(id: number, stage: string): Promise<User | undefined> {
    if (!Object.values(accountStageEnum.enumValues).includes(stage)) {
      throw new Error(`Invalid account stage: ${stage}`);
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({
        accountStage: stage as any,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }
  
  async listUsers(limit = 20, offset = 0): Promise<User[]> {
    const usersList = await db
      .select()
      .from(users)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.createdAt));
    
    return usersList;
  }
  
  async searchUsers(query: string): Promise<User[]> {
    const searchResults = await db
      .select()
      .from(users)
      .where(
        or(
          like(users.username, `%${query}%`),
          like(users.email, `%${query}%`),
          like(users.firstName || '', `%${query}%`),
          like(users.lastName || '', `%${query}%`)
        )
      )
      .limit(50);
    
    return searchResults;
  }
  
  async setUserAdmin(id: number, isAdmin: boolean): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        isAdmin,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    
    return result.length > 0;
  }
  
  // Location methods
  async createLocation(locationData: InsertLocation): Promise<Location> {
    const [location] = await db
      .insert(locations)
      .values(locationData)
      .returning();
    
    return location;
  }
  
  async getLocation(id: number): Promise<Location | undefined> {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id));
    
    return location;
  }
  
  async listLocations(): Promise<Location[]> {
    return db.select().from(locations);
  }
  
  async updateLocation(id: number, data: Partial<InsertLocation>): Promise<Location | undefined> {
    const [updatedLocation] = await db
      .update(locations)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(locations.id, id))
      .returning();
    
    return updatedLocation;
  }
  
  async deleteLocation(id: number): Promise<boolean> {
    const result = await db
      .delete(locations)
      .where(eq(locations.id, id))
      .returning();
    
    return result.length > 0;
  }
  
  async assignUserToLocation(userId: number, locationId: number, isPrimary = false): Promise<boolean> {
    // If marked as primary, clear any existing primary locations
    if (isPrimary) {
      await db
        .update(userLocations)
        .set({ isPrimary: false })
        .where(and(
          eq(userLocations.userId, userId),
          eq(userLocations.isPrimary, true)
        ));
    }
    
    // Check if relationship already exists
    const [existing] = await db
      .select()
      .from(userLocations)
      .where(and(
        eq(userLocations.userId, userId),
        eq(userLocations.locationId, locationId)
      ));
    
    if (existing) {
      // Update existing relationship if isPrimary changed
      if (existing.isPrimary !== isPrimary) {
        await db
          .update(userLocations)
          .set({ isPrimary })
          .where(eq(userLocations.id, existing.id));
      }
    } else {
      // Create new relationship
      await db
        .insert(userLocations)
        .values({
          userId,
          locationId,
          isPrimary
        });
    }
    
    return true;
  }
  
  async removeUserFromLocation(userId: number, locationId: number): Promise<boolean> {
    const result = await db
      .delete(userLocations)
      .where(and(
        eq(userLocations.userId, userId),
        eq(userLocations.locationId, locationId)
      ))
      .returning();
    
    return result.length > 0;
  }
  
  async getUserLocations(userId: number): Promise<Location[]> {
    const userLocationRecords = await db
      .select()
      .from(userLocations)
      .where(eq(userLocations.userId, userId))
      .innerJoin(locations, eq(userLocations.locationId, locations.id));
    
    return userLocationRecords.map(record => record.locations);
  }
  
  // Patient methods from original implementation
  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }
  
  async getPatientByChartNumber(chartNumber: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.chartNumber, chartNumber));
    return patient;
  }
  
  async listPatients(limit = 20, offset = 0): Promise<Patient[]> {
    const patientsList = await db
      .select()
      .from(patients)
      .limit(limit)
      .offset(offset);
    
    return patientsList;
  }
  
  async searchPatients(query: string): Promise<Patient[]> {
    const searchResults = await db
      .select()
      .from(patients)
      .where(
        or(
          like(patients.name, `%${query}%`),
          like(patients.chartNumber, `%${query}%`),
          like(patients.email || '', `%${query}%`),
          like(patients.phone || '', `%${query}%`)
        )
      )
      .limit(50);
    
    return searchResults;
  }
  
  async createPatient(patientData: InsertPatient): Promise<Patient> {
    const [patient] = await db
      .insert(patients)
      .values(patientData)
      .returning();
    
    return patient;
  }
  
  async updatePatient(id: number, patientData: Partial<InsertPatient>): Promise<Patient | undefined> {
    const [updatedPatient] = await db
      .update(patients)
      .set({
        ...patientData,
        updatedAt: new Date()
      })
      .where(eq(patients.id, id))
      .returning();
    
    return updatedPatient;
  }
  
  // Helper methods
  private async isFirstUser(): Promise<boolean> {
    const usersCount = await db.select().from(users);
    return usersCount.length === 0;
  }
}

export const storage = new DatabaseStorage();