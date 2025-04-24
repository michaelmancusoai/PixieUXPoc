import { 
  users, type User, type InsertUser,
  patients, type Patient, type InsertPatient,
  procedures, type Procedure, type InsertProcedure,
  teeth, type Tooth, type InsertTooth,
  treatmentPlans, type TreatmentPlan, type InsertTreatmentPlan,
  treatmentPlanItems, type TreatmentPlanItem, type InsertTreatmentPlanItem
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patient methods
  getPatient(id: number): Promise<Patient | undefined>;
  getAllPatients(): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  
  // Procedure methods
  getProcedure(id: number): Promise<Procedure | undefined>;
  getAllProcedures(): Promise<Procedure[]>;
  createProcedure(procedure: InsertProcedure): Promise<Procedure>;
  
  // Tooth methods
  getTooth(id: number): Promise<Tooth | undefined>;
  getTeethByPatient(patientId: number): Promise<Tooth[]>;
  createTooth(tooth: InsertTooth): Promise<Tooth>;
  updateTooth(id: number, tooth: Partial<InsertTooth>): Promise<Tooth | undefined>;
  
  // Treatment Plan methods
  getTreatmentPlan(id: number): Promise<TreatmentPlan | undefined>;
  getTreatmentPlansByPatient(patientId: number): Promise<TreatmentPlan[]>;
  createTreatmentPlan(plan: InsertTreatmentPlan): Promise<TreatmentPlan>;
  
  // Treatment Plan Item methods
  getTreatmentPlanItem(id: number): Promise<TreatmentPlanItem | undefined>;
  getTreatmentPlanItems(planId: number): Promise<TreatmentPlanItem[]>;
  createTreatmentPlanItem(item: InsertTreatmentPlanItem): Promise<TreatmentPlanItem>;
  updateTreatmentPlanItem(id: number, item: Partial<InsertTreatmentPlanItem>): Promise<TreatmentPlanItem | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private procedures: Map<number, Procedure>;
  private teeth: Map<number, Tooth>;
  private treatmentPlans: Map<number, TreatmentPlan>;
  private treatmentPlanItems: Map<number, TreatmentPlanItem>;
  
  private currentUserId: number;
  private currentPatientId: number;
  private currentProcedureId: number;
  private currentToothId: number;
  private currentTreatmentPlanId: number;
  private currentTreatmentPlanItemId: number;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.procedures = new Map();
    this.teeth = new Map();
    this.treatmentPlans = new Map();
    this.treatmentPlanItems = new Map();
    
    this.currentUserId = 1;
    this.currentPatientId = 1;
    this.currentProcedureId = 1;
    this.currentToothId = 1;
    this.currentTreatmentPlanId = 1;
    this.currentTreatmentPlanItemId = 1;
    
    // Initialize with some sample data
    this.initializeData();
  }
  
  private initializeData() {
    // Add some sample procedures
    const procedures: InsertProcedure[] = [
      {
        code: 'D2391',
        description: 'Composite, 1 Surface',
        longDescription: 'Posterior composite',
        fee: 210,
        category: 'Restorative',
        isFavorite: true,
      },
      {
        code: 'D2740',
        description: 'Porcelain Crown',
        longDescription: 'Porcelain/ceramic substrate',
        fee: 1250,
        category: 'Restorative',
        isFavorite: true,
      },
      {
        code: 'D7140',
        description: 'Extraction, Erupted Tooth',
        longDescription: 'Simple extraction',
        fee: 185,
        category: 'Surgery',
        isFavorite: true,
      },
      {
        code: 'D4341',
        description: 'Periodontal Scaling',
        longDescription: 'Per quadrant',
        fee: 240,
        category: 'Perio',
        isFavorite: true,
      },
      {
        code: 'D0220',
        description: 'X-Ray',
        longDescription: 'Intraoral - periapical first radiographic image',
        fee: 30,
        category: 'Imaging',
        isFavorite: true,
      },
      {
        code: 'D2160',
        description: 'Amalgam, 3 Surfaces',
        longDescription: 'Three surface amalgam restoration',
        fee: 240,
        category: 'Restorative',
        isFavorite: false,
      }
    ];
    
    procedures.forEach(procedure => {
      this.createProcedure(procedure);
    });
    
    // Add a sample patient
    this.createPatient({
      name: 'Sarah Johnson',
      age: 42,
      lastVisit: '03/15/2023',
      insuranceName: 'Delta Dental Premier',
      insuranceDetails: 'Annual Max: $1,500 • Used: $350',
      alerts: ['Penicillin Allergy'],
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Patient methods
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }
  
  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }
  
  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.currentPatientId++;
    const patient: Patient = { ...insertPatient, id };
    this.patients.set(id, patient);
    return patient;
  }
  
  // Procedure methods
  async getProcedure(id: number): Promise<Procedure | undefined> {
    return this.procedures.get(id);
  }
  
  async getAllProcedures(): Promise<Procedure[]> {
    return Array.from(this.procedures.values());
  }
  
  async createProcedure(insertProcedure: InsertProcedure): Promise<Procedure> {
    const id = this.currentProcedureId++;
    const procedure: Procedure = { ...insertProcedure, id };
    this.procedures.set(id, procedure);
    return procedure;
  }
  
  // Tooth methods
  async getTooth(id: number): Promise<Tooth | undefined> {
    return this.teeth.get(id);
  }
  
  async getTeethByPatient(patientId: number): Promise<Tooth[]> {
    return Array.from(this.teeth.values()).filter(
      (tooth) => tooth.patientId === patientId,
    );
  }
  
  async createTooth(insertTooth: InsertTooth): Promise<Tooth> {
    const id = this.currentToothId++;
    const tooth: Tooth = { ...insertTooth, id };
    this.teeth.set(id, tooth);
    return tooth;
  }
  
  async updateTooth(id: number, toothUpdate: Partial<InsertTooth>): Promise<Tooth | undefined> {
    const tooth = this.teeth.get(id);
    if (!tooth) return undefined;
    
    const updatedTooth = { ...tooth, ...toothUpdate };
    this.teeth.set(id, updatedTooth);
    return updatedTooth;
  }
  
  // Treatment Plan methods
  async getTreatmentPlan(id: number): Promise<TreatmentPlan | undefined> {
    return this.treatmentPlans.get(id);
  }
  
  async getTreatmentPlansByPatient(patientId: number): Promise<TreatmentPlan[]> {
    return Array.from(this.treatmentPlans.values()).filter(
      (plan) => plan.patientId === patientId,
    );
  }
  
  async createTreatmentPlan(insertPlan: InsertTreatmentPlan): Promise<TreatmentPlan> {
    const id = this.currentTreatmentPlanId++;
    const plan: TreatmentPlan = { ...insertPlan, id };
    this.treatmentPlans.set(id, plan);
    return plan;
  }
  
  // Treatment Plan Item methods
  async getTreatmentPlanItem(id: number): Promise<TreatmentPlanItem | undefined> {
    return this.treatmentPlanItems.get(id);
  }
  
  async getTreatmentPlanItems(planId: number): Promise<TreatmentPlanItem[]> {
    return Array.from(this.treatmentPlanItems.values()).filter(
      (item) => item.planId === planId,
    );
  }
  
  async createTreatmentPlanItem(insertItem: InsertTreatmentPlanItem): Promise<TreatmentPlanItem> {
    const id = this.currentTreatmentPlanItemId++;
    const item: TreatmentPlanItem = { ...insertItem, id };
    this.treatmentPlanItems.set(id, item);
    return item;
  }
  
  async updateTreatmentPlanItem(id: number, itemUpdate: Partial<InsertTreatmentPlanItem>): Promise<TreatmentPlanItem | undefined> {
    const item = this.treatmentPlanItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...itemUpdate };
    this.treatmentPlanItems.set(id, updatedItem);
    return updatedItem;
  }
}

export const storage = new MemStorage();
