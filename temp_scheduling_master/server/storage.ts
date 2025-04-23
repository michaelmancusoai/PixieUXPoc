import { 
  users, type User, type InsertUser,
  providers, type Provider, type InsertProvider,
  operatories, type Operatory, type InsertOperatory,
  patients, type Patient, type InsertPatient,
  appointments, type Appointment, type InsertAppointment, AppointmentStatus,
  waitlist, type Waitlist, type InsertWaitlist,
  AppointmentWithDetails, WaitlistWithPatient
} from "@shared/schema";
import { addDays, format, parse, parseISO, isSameDay } from "date-fns";

// Extend the storage interface with scheduling-specific methods
export interface IStorage {
  // Original user methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Provider methods
  getProviders(): Promise<Provider[]>;
  getProvider(id: number): Promise<Provider | undefined>;
  createProvider(provider: InsertProvider): Promise<Provider>;

  // Operatory methods
  getOperatories(): Promise<Operatory[]>;
  getOperatory(id: number): Promise<Operatory | undefined>;
  createOperatory(operatory: InsertOperatory): Promise<Operatory>;

  // Patient methods
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;

  // Appointment methods
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment | undefined>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;

  // Waitlist methods
  getWaitlist(): Promise<WaitlistWithPatient[]>;
  addToWaitlist(waitlistEntry: InsertWaitlist): Promise<Waitlist>;

  // Scheduling-specific query methods
  getUtilizationByDate(date: string): Promise<{ percentage: number, availableMinutes: number, bookedMinutes: number }>;
  getGapsByDate(date: string): Promise<Array<{ date: string, startTime: string, duration: number, operatoryId: number }>>;
  getArrivedPatients(date: string): Promise<any[]>;
  getPendingCheckout(date: string): Promise<any[]>;
  getDocsNeeded(date: string): Promise<any[]>;
  getBenefitsVerification(): Promise<any[]>;
  getInventoryAlerts(): Promise<any[]>;
  getProcedures(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private providers: Map<number, Provider>;
  private operatories: Map<number, Operatory>;
  private patients: Map<number, Patient>;
  private appointments: Map<number, Appointment>;
  private waitlistEntries: Map<number, Waitlist>;
  private procedures: any[];
  private inventoryItems: any[];

  // Track IDs for each entity
  private userId: number;
  private providerId: number;
  private operatoryId: number;
  private patientId: number;
  private appointmentId: number;
  private waitlistId: number;

  constructor() {
    // Initialize storage maps
    this.users = new Map();
    this.providers = new Map();
    this.operatories = new Map();
    this.patients = new Map();
    this.appointments = new Map();
    this.waitlistEntries = new Map();
    this.procedures = [];
    this.inventoryItems = [];

    // Initialize IDs
    this.userId = 1;
    this.providerId = 1;
    this.operatoryId = 1;
    this.patientId = 1;
    this.appointmentId = 1;
    this.waitlistId = 1;

    // Create sample data for the application
    this.initializeSampleData();
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
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Provider methods
  async getProviders(): Promise<Provider[]> {
    return Array.from(this.providers.values());
  }

  async getProvider(id: number): Promise<Provider | undefined> {
    return this.providers.get(id);
  }

  async createProvider(insertProvider: InsertProvider): Promise<Provider> {
    const id = this.providerId++;
    const provider: Provider = { ...insertProvider, id };
    this.providers.set(id, provider);
    return provider;
  }

  // Operatory methods
  async getOperatories(): Promise<Operatory[]> {
    return Array.from(this.operatories.values());
  }

  async getOperatory(id: number): Promise<Operatory | undefined> {
    return this.operatories.get(id);
  }

  async createOperatory(insertOperatory: InsertOperatory): Promise<Operatory> {
    const id = this.operatoryId++;
    const operatory: Operatory = { ...insertOperatory, id };
    this.operatories.set(id, operatory);
    return operatory;
  }

  // Patient methods
  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.patientId++;
    const patient: Patient = { ...insertPatient, id };
    this.patients.set(id, patient);
    return patient;
  }

  // Appointment methods
  async getAllAppointments(): Promise<Appointment[]> {
    const allAppointments = Array.from(this.appointments.values());
    
    // Populate procedure names for any appointments with CDT codes
    for (const apt of allAppointments) {
      if (!apt.procedure && apt.cdtCode) {
        const matchingProcedure = this.procedures.find(p => p.code === apt.cdtCode);
        if (matchingProcedure) {
          apt.procedure = matchingProcedure.description;
        }
      }
    }
    
    return allAppointments;
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const appointments = Array.from(this.appointments.values()).filter(appointment => {
      // Handle both string and Date objects for appointment.date
      const appointmentDate = appointment.date instanceof Date 
        ? format(appointment.date, 'yyyy-MM-dd')
        : format(new Date(appointment.date), 'yyyy-MM-dd');
      
      return appointmentDate === date;
    });
    
    // Populate procedure names for any appointments with CDT codes
    for (const apt of appointments) {
      if (!apt.procedure && apt.cdtCode) {
        const matchingProcedure = this.procedures.find(p => p.code === apt.cdtCode);
        if (matchingProcedure) {
          apt.procedure = matchingProcedure.description;
        }
      }
    }
    
    return appointments;
  }

  async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return Array.from(this.appointments.values()).filter(appointment => {
      // Handle both string and Date objects for appointment.date
      const appointmentDate = appointment.date instanceof Date 
        ? appointment.date
        : new Date(appointment.date);
      
      return appointmentDate >= start && appointmentDate <= end;
    });
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentId++;
    const appointment: Appointment = { ...insertAppointment, id };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;

    const updatedAppointment = { ...appointment, ...updates };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;

    // Update timestamp based on the new status
    const now = new Date();
    let updates: Partial<Appointment> = { status };

    switch (status) {
      case AppointmentStatus.CONFIRMED:
        updates.confirmedAt = now;
        break;
      case AppointmentStatus.CHECKED_IN:
        updates.arrivedAt = now;
        break;
      case AppointmentStatus.IN_CHAIR:
        updates.chairStartedAt = now;
        break;
      case AppointmentStatus.COMPLETED:
        updates.completedAt = now;
        break;
    }

    const updatedAppointment = { ...appointment, ...updates };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  // Waitlist methods
  async getWaitlist(): Promise<WaitlistWithPatient[]> {
    return Promise.all(
      Array.from(this.waitlistEntries.values()).map(async entry => {
        const patient = await this.getPatient(entry.patientId);
        if (!patient) throw new Error(`Patient not found for waitlist entry: ${entry.id}`);
        return { ...entry, patient };
      })
    );
  }

  async addToWaitlist(insertWaitlist: InsertWaitlist): Promise<Waitlist> {
    const id = this.waitlistId++;
    const waitlistEntry: Waitlist = { ...insertWaitlist, id };
    this.waitlistEntries.set(id, waitlistEntry);
    return waitlistEntry;
  }

  // Scheduling-specific query methods
  async getUtilizationByDate(date: string): Promise<{ percentage: number, availableMinutes: number, bookedMinutes: number }> {
    const appointments = await this.getAppointmentsByDate(date);
    const operatories = await this.getOperatories();
    
    // Calculate total available minutes (operatories × hours open)
    const hoursOpen = 10; // 8am to 6pm
    const availableMinutes = operatories.length * hoursOpen * 60;
    
    // Calculate booked minutes from appointments
    const bookedMinutes = appointments.reduce((sum, appointment) => sum + appointment.duration, 0);
    
    // Calculate utilization percentage
    const percentage = Math.round((bookedMinutes / availableMinutes) * 100);
    
    return { percentage, availableMinutes, bookedMinutes };
  }

  async getGapsByDate(date: string): Promise<Array<{ date: string, startTime: string, duration: number, operatoryId: number }>> {
    // For simplicity, we'll identify gaps of at least 20 minutes for the next 3 days
    const today = new Date(date);
    const gaps = [];
    
    // Check gaps for today and the next 2 days (3 days total)
    for (let i = 0; i < 3; i++) {
      const currentDate = addDays(today, i);
      const currentDateStr = format(currentDate, 'yyyy-MM-dd');
      const operatories = await this.getOperatories();
      
      for (const operatory of operatories) {
        // Get appointments for this operatory on this date
        const appointments = (await this.getAppointmentsByDate(currentDateStr))
          .filter(apt => apt.operatoryId === operatory.id)
          .sort((a, b) => {
            const aTime = a.startTime.toString();
            const bTime = b.startTime.toString();
            return aTime.localeCompare(bTime);
          });
        
        // Business hours from 8:00 to 18:00 (6pm)
        let currentTime = { hour: 8, minute: 0 };
        
        for (const appointment of appointments) {
          const [aptHour, aptMinute] = appointment.startTime.toString().split(':').map(Number);
          
          // Calculate the gap between current time and appointment start
          const currentTotalMins = currentTime.hour * 60 + currentTime.minute;
          const aptTotalMins = aptHour * 60 + aptMinute;
          const gapDuration = aptTotalMins - currentTotalMins;
          
          // If gap is at least 20 minutes, record it
          if (gapDuration >= 20) {
            gaps.push({
              date: currentDateStr,
              startTime: `${currentTime.hour.toString().padStart(2, '0')}:${currentTime.minute.toString().padStart(2, '0')}:00`,
              duration: gapDuration,
              operatoryId: operatory.id
            });
          }
          
          // Move current time to after this appointment
          const newTotalMins = aptTotalMins + appointment.duration;
          currentTime = {
            hour: Math.floor(newTotalMins / 60),
            minute: newTotalMins % 60
          };
        }
        
        // Check for gap between last appointment and end of day (6pm)
        const endOfDayMins = 18 * 60; // 6pm in minutes
        const currentTotalMins = currentTime.hour * 60 + currentTime.minute;
        const finalGapDuration = endOfDayMins - currentTotalMins;
        
        if (finalGapDuration >= 20) {
          gaps.push({
            date: currentDateStr,
            startTime: `${currentTime.hour.toString().padStart(2, '0')}:${currentTime.minute.toString().padStart(2, '0')}:00`,
            duration: finalGapDuration,
            operatoryId: operatory.id
          });
        }
      }
    }
    
    // Return only the first few gaps for UI clarity (limited to 5)
    return gaps.slice(0, 5);
  }

  async getArrivedPatients(date: string): Promise<any[]> {
    const appointments = await this.getAppointmentsByDate(date);
    const arrivedAppointments = appointments.filter(
      apt => apt.status === AppointmentStatus.CHECKED_IN || apt.status === AppointmentStatus.IN_CHAIR
    );
    
    return Promise.all(
      arrivedAppointments.map(async apt => {
        const patient = await this.getPatient(apt.patientId);
        const provider = apt.providerId ? await this.getProvider(apt.providerId) : undefined;
        
        if (!patient) throw new Error(`Patient not found for appointment: ${apt.id}`);
        
        // Get procedure friendly name
        let procedureName = apt.procedure;
        if (!procedureName && apt.cdtCode) {
          const matchingProcedure = this.procedures.find(p => p.code === apt.cdtCode);
          if (matchingProcedure) {
            procedureName = matchingProcedure.description;
          }
        }
        
        return {
          id: apt.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          avatarInitials: patient.avatarInitials,
          balanceDue: patient.balanceDue,
          procedure: procedureName || apt.cdtCode,
          provider: provider?.name || "Unassigned",
          arrivedAt: apt.arrivedAt,
          status: apt.status
        };
      })
    );
  }

  async getPendingCheckout(date: string): Promise<any[]> {
    const appointments = await this.getAppointmentsByDate(date);
    const completedAppointments = appointments.filter(
      apt => apt.status === AppointmentStatus.COMPLETED
    );
    
    // First, group appointments by patient ID
    const patientAppointments = new Map<number, Appointment[]>();
    
    // Group appointments by patient
    completedAppointments.forEach(apt => {
      if (!patientAppointments.has(apt.patientId)) {
        patientAppointments.set(apt.patientId, []);
      }
      patientAppointments.get(apt.patientId)?.push(apt);
    });
    
    // For each patient, take only their most recent completed appointment
    const uniqueAppointments: Appointment[] = [];
    patientAppointments.forEach(appointments => {
      // Sort appointments by completion time (newest first)
      const sortedAppointments = [...appointments].sort((a, b) => {
        const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return timeB - timeA; // Descending order (newest first)
      });
      
      // Add the most recent appointment for each patient
      if (sortedAppointments.length > 0) {
        uniqueAppointments.push(sortedAppointments[0]);
      }
    });
    
    return Promise.all(
      uniqueAppointments.map(async apt => {
        const patient = await this.getPatient(apt.patientId);
        const provider = apt.providerId ? await this.getProvider(apt.providerId) : undefined;
        
        if (!patient) throw new Error(`Patient not found for appointment: ${apt.id}`);
        
        return {
          id: apt.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          avatarInitials: patient.avatarInitials,
          completedAt: apt.completedAt,
          balanceDue: patient.balanceDue || 0
        };
      })
    );
  }

  async getDocsNeeded(date: string): Promise<any[]> {
    // Generate some sample documents needed for today's patients
    const appointments = await this.getAppointmentsByDate(date);
    const docTypes = ["Consent for Extraction", "HIPAA Update", "Treatment Plan Acceptance", "Medical History Update"];
    
    return appointments.slice(0, 3).map((apt, index) => ({
      id: index + 1,
      patientId: apt.patientId,
      patientName: `${this.patients.get(apt.patientId)?.firstName} ${this.patients.get(apt.patientId)?.lastName}`,
      documentType: docTypes[index % docTypes.length],
      urgent: index === 0
    }));
  }

  async getBenefitsVerification(): Promise<any[]> {
    // Get upcoming appointments that need insurance verification
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const upcomingAppointments = Array.from(this.appointments.values())
      .filter(apt => {
        const aptDate = new Date(apt.date);
        // Only include appointments from today and tomorrow
        return (isSameDay(aptDate, today) || isSameDay(aptDate, tomorrow)) && !apt.isVerified;
      })
      .slice(0, 4);
    
    return Promise.all(
      upcomingAppointments.map(async (apt, index) => {
        const patient = await this.getPatient(apt.patientId);
        if (!patient) throw new Error(`Patient not found for appointment: ${apt.id}`);
        
        return {
          id: apt.id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          appointmentDate: format(new Date(apt.date), 'yyyy-MM-dd'),
          appointmentTime: apt.startTime,
          insuranceProvider: patient.insuranceProvider || "No insurance on file",
          status: index === 1 ? "FAILED" : "PENDING"
        };
      })
    );
  }

  async getInventoryAlerts(): Promise<any[]> {
    // Return inventory items that are close to reorder point
    return this.inventoryItems.filter(item => item.remaining <= item.reorderPoint);
  }

  async getProcedures(): Promise<any[]> {
    return this.procedures;
  }

  // Initialize sample data for the application
  private initializeSampleData() {
    // Create providers
    const providerData: InsertProvider[] = [
      { name: "Dr. Nguyen", role: "DENTIST", color: "#4285F4" },
      { name: "Dr. Johnson", role: "DENTIST", color: "#EA4335" },
      { name: "RDH Maria", role: "HYGIENIST", color: "#FBBC05" },
      { name: "RDH Robert", role: "HYGIENIST", color: "#34A853" }
    ];
    
    providerData.forEach(provider => {
      const created = { ...provider, id: this.providerId++ };
      this.providers.set(created.id, created);
    });
    
    // Create operatories
    const operatoryData: InsertOperatory[] = [
      { name: "Op 1", color: "#C2E0FF" },
      { name: "Op 2", color: "#FFD6D6" },
      { name: "Op 3", color: "#FFF1C2" },
      { name: "Op 4", color: "#D6EEDA" }
    ];
    
    operatoryData.forEach(operatory => {
      const created = { ...operatory, id: this.operatoryId++ };
      this.operatories.set(created.id, created);
    });
    
    // Create patients
    const patientData: InsertPatient[] = [
      { firstName: "John", lastName: "Johnson", avatarInitials: "JJ", insuranceProvider: "Delta Dental", balanceDue: 0 },
      { firstName: "Maria", lastName: "Garcia", avatarInitials: "MG", insuranceProvider: "Cigna", balanceDue: 4500 },
      { firstName: "David", lastName: "Lee", avatarInitials: "DL", insuranceProvider: "Aetna", balanceDue: 0 },
      { firstName: "Sarah", lastName: "Martinez", avatarInitials: "SM", insuranceProvider: "MetLife", balanceDue: 2000 },
      { firstName: "Robert", lastName: "Wilson", avatarInitials: "RW", insuranceProvider: "Delta Dental", balanceDue: 0 },
      { firstName: "Jennifer", lastName: "Taylor", avatarInitials: "JT", insuranceProvider: "Guardian", balanceDue: 0 },
      { firstName: "Michael", lastName: "Brown", avatarInitials: "MB", insuranceProvider: "MetLife", balanceDue: 25000 },
      { firstName: "Lisa", lastName: "Thomas", avatarInitials: "LT", insuranceProvider: "Aetna", balanceDue: 0 },
      { firstName: "James", lastName: "Brown", avatarInitials: "JB", insuranceProvider: "Delta Dental", balanceDue: 0 },
      { firstName: "Jessica", lastName: "Garcia", avatarInitials: "JG", insuranceProvider: "Cigna", balanceDue: 0 },
      { firstName: "William", lastName: "Jackson", avatarInitials: "WJ", insuranceProvider: "Guardian", balanceDue: 3000 },
      { firstName: "Linda", lastName: "Lewis", avatarInitials: "LL", insuranceProvider: "Delta Dental", balanceDue: 0 },
      { firstName: "Richard", lastName: "Walker", avatarInitials: "RW", insuranceProvider: "Cigna", balanceDue: 0 },
      { firstName: "Elizabeth", lastName: "Rodriguez", avatarInitials: "ER", insuranceProvider: "MetLife", balanceDue: 0 },
      { firstName: "Michael", lastName: "Walker", avatarInitials: "MW", insuranceProvider: "Delta Dental", balanceDue: 0 },
      { firstName: "Emma", lastName: "Lewis", avatarInitials: "EL", insuranceProvider: "Cigna", balanceDue: 0 },
      { firstName: "Daniel", lastName: "Chen", avatarInitials: "DC", insuranceProvider: "Aetna", balanceDue: 0 }
    ];
    
    patientData.forEach(patient => {
      const created = { ...patient, id: this.patientId++ };
      this.patients.set(created.id, created);
    });
    
    // Create appointments for today (April 23, 2025)
    const today = new Date(2025, 3, 23); // April 23, 2025
    const formattedToday = format(today, 'yyyy-MM-dd');
    
    const appointmentData: Partial<Appointment>[] = [
      // Op 1 Appointments
      { 
        patientId: 1, providerId: 1, operatoryId: 1, 
        date: formattedToday, startTime: "09:00:00", duration: 70, 
        cdtCode: "D2750", status: AppointmentStatus.CONFIRMED,
        confirmedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 12)
      },
      { 
        patientId: 4, providerId: 1, operatoryId: 1, 
        date: formattedToday, startTime: "11:00:00", duration: 60, 
        cdtCode: "D1110", status: AppointmentStatus.CHECKED_IN,
        confirmedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 14, 30),
        arrivedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 42)
      },
      { 
        patientId: 5, providerId: 1, operatoryId: 1, 
        date: formattedToday, startTime: "13:00:00", duration: 45, 
        cdtCode: "D0120", status: AppointmentStatus.SCHEDULED
      },
      { 
        patientId: 7, providerId: 1, operatoryId: 1, 
        date: formattedToday, startTime: "15:00:00", duration: 60, 
        cdtCode: "D2393", status: AppointmentStatus.COMPLETED,
        confirmedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 12, 15),
        arrivedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 45),
        chairStartedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 5),
        completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 45)
      },
      
      // Op 2 Appointments
      { 
        patientId: 6, providerId: 2, operatoryId: 2, 
        date: formattedToday, startTime: "08:30:00", duration: 60, 
        cdtCode: "D2393", status: AppointmentStatus.SCHEDULED
      },
      { 
        patientId: 2, providerId: 2, operatoryId: 2, 
        date: formattedToday, startTime: "10:00:00", duration: 90, 
        cdtCode: "D2950", status: AppointmentStatus.IN_CHAIR,
        confirmedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 9, 20),
        arrivedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 42),
        chairStartedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 5)
      },
      { 
        patientId: 16, providerId: 2, operatoryId: 2, 
        date: formattedToday, startTime: "13:00:00", duration: 45, 
        cdtCode: "D0274", status: AppointmentStatus.NO_SHOW,
        confirmedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 15, 45)
      },
      
      // Op 3 Appointments
      { 
        patientId: 8, providerId: 3, operatoryId: 3, 
        date: formattedToday, startTime: "08:00:00", duration: 120, 
        cdtCode: "D2790", status: AppointmentStatus.CONFIRMED,
        confirmedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 10, 30)
      },
      { 
        patientId: 14, providerId: 3, operatoryId: 3, 
        date: formattedToday, startTime: "11:30:00", duration: 45, 
        cdtCode: "D0120", status: AppointmentStatus.SCHEDULED
      },
      { 
        patientId: 12, providerId: 3, operatoryId: 3, 
        date: formattedToday, startTime: "14:30:00", duration: 60, 
        cdtCode: "D1110", status: AppointmentStatus.SCHEDULED
      },
      
      // Op 4 Appointments
      { 
        patientId: 11, providerId: 4, operatoryId: 4, 
        date: formattedToday, startTime: "09:30:00", duration: 90, 
        cdtCode: "D2330", status: AppointmentStatus.SCHEDULED
      },
      { 
        patientId: 3, providerId: 4, operatoryId: 4, 
        date: formattedToday, startTime: "12:00:00", duration: 75, 
        cdtCode: "D4341", status: AppointmentStatus.CHECKED_IN,
        confirmedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 11, 15),
        arrivedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 23)
      },
      { 
        patientId: 13, providerId: 4, operatoryId: 4, 
        date: formattedToday, startTime: "14:00:00", duration: 60, 
        cdtCode: "D0274", status: AppointmentStatus.CONFIRMED,
        confirmedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 14, 40)
      },
      
      // Michael Brown appointment - completed and pending checkout
      { 
        patientId: 7, providerId: 3, operatoryId: 3, 
        date: formattedToday, startTime: "16:00:00", duration: 90, 
        cdtCode: "D2750", procedure: "Crown - Porcelain Fused to Metal", status: AppointmentStatus.COMPLETED,
        confirmedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 14, 40),
        arrivedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 40),
        chairStartedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 10),
        completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 20)
      },
    ];
    
    appointmentData.forEach(appointment => {
      const created = { ...appointment, id: this.appointmentId++ } as Appointment;
      this.appointments.set(created.id, created);
    });
    
    // Create waitlist entries
    const waitlistData: InsertWaitlist[] = [
      { 
        patientId: 1, 
        requestedProcedure: "Crown #30", 
        propensityScore: 95, 
        requestDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
        notes: "Wants to be seen as soon as possible" 
      },
      { 
        patientId: 4, 
        requestedProcedure: "Hygiene", 
        propensityScore: 82, 
        requestDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
        notes: "Flexible schedule, afternoons preferred" 
      },
      { 
        patientId: 5, 
        requestedProcedure: "Exam", 
        propensityScore: 74, 
        requestDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
        notes: "Available Monday-Wednesday" 
      }
    ];
    
    waitlistData.forEach(entry => {
      const created = { ...entry, id: this.waitlistId++ };
      this.waitlistEntries.set(created.id, created);
    });
    
    // Create inventory items
    this.inventoryItems = [
      { id: 1, name: "Composite A2", remaining: 2, reorderPoint: 5, daysUntilReorder: 1 },
      { id: 2, name: "Prophy Paste", remaining: 3, reorderPoint: 5, daysUntilReorder: 2 },
      { id: 3, name: "Disposable Bibs", remaining: 15, reorderPoint: 20, daysUntilReorder: 5 },
      { id: 4, name: "Nitrile Gloves M", remaining: 30, reorderPoint: 50, daysUntilReorder: 7 }
    ];
    
    // Create procedures (CDT codes)
    this.procedures = [
      { code: "D0120", description: "Periodic Oral Evaluation" },
      { code: "D0150", description: "Comprehensive Oral Evaluation" },
      { code: "D0220", description: "Intraoral - Periapical First Film" },
      { code: "D0274", description: "Bitewings - Four Films" },
      { code: "D1110", description: "Prophylaxis - Adult" },
      { code: "D1120", description: "Prophylaxis - Child" },
      { code: "D2140", description: "Amalgam - One Surface" },
      { code: "D2330", description: "Resin-Based Composite - One Surface, Anterior" },
      { code: "D2393", description: "Resin-Based Composite - Three Surfaces, Posterior" },
      { code: "D2750", description: "Crown - Porcelain Fused to High Noble Metal" },
      { code: "D2790", description: "Crown - Full Cast High Noble Metal" },
      { code: "D2950", description: "Core Buildup, Including any Pins" },
      { code: "D3310", description: "Root Canal - Anterior" },
      { code: "D4341", description: "Periodontal Scaling and Root Planing - Four or More Teeth Per Quadrant" },
      { code: "D7140", description: "Extraction, Erupted Tooth or Exposed Root" }
    ];
  }
}

export const storage = new MemStorage();
