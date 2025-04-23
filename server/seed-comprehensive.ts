import { db } from './db';
import { 
  providers, 
  operatories, 
  appointments,
  patients,
  AppointmentStatus
} from '@shared/schema';
import { eq } from 'drizzle-orm';
import { addMinutes, format, parseISO, startOfDay, addDays } from 'date-fns';

// Seed script for comprehensive scheduling data
async function seedComprehensiveSchedulingData() {
  console.log('🌱 Seeding comprehensive scheduling data...');
  
  // Clear existing appointments for clean data
  await db.delete(appointments);
  
  // Get existing data
  const existingProviders = await db.select().from(providers);
  const existingOperatories = await db.select().from(operatories);
  const existingPatients = await db.select().from(patients);
  
  // If no patients/providers/operatories exist, warn and exit
  if (existingPatients.length === 0 || existingProviders.length === 0 || existingOperatories.length === 0) {
    console.log('❌ Missing required data! Please seed patients, providers, and operatories first.');
    return;
  }
  
  // Procedure types with associated durations
  const procedureTypes = [
    { name: 'Regular cleaning', duration: 30 },
    { name: 'Deep cleaning', duration: 60 },
    { name: 'Cavity filling', duration: 45 },
    { name: 'Crown prep', duration: 60 },
    { name: 'Crown delivery', duration: 30 },
    { name: 'Root canal', duration: 90 },
    { name: 'Extraction', duration: 45 },
    { name: 'Wisdom tooth removal', duration: 60 },
    { name: 'Comprehensive exam', duration: 30 },
    { name: 'Emergency visit', duration: 30 },
    { name: 'Consultation', duration: 30 },
    { name: 'Orthodontic adjustment', duration: 20 },
    { name: 'Fluoride treatment', duration: 15 },
    { name: 'Cosmetic consultation', duration: 45 },
  ];
  
  // Create a function to format time properly
  const formatTimeString = (date: Date): string => {
    return format(date, 'HH:mm:ss');
  };
  
  // Generate appointments for today and the next 7 days
  const today = new Date();
  const appointmentData = [];
  
  // For each day, create a full schedule
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = addDays(today, dayOffset);
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    // For each provider
    for (const provider of existingProviders) {
      // For each operatory (assign each provider to 1-2 operatories per day)
      const operatoryCount = provider.name.includes('Hygienist') ? 1 : 2;
      const providerOperatories = existingOperatories
        .slice(0, operatoryCount)
        .sort(() => Math.random() - 0.5); // Shuffle
      
      for (const operatory of providerOperatories) {
        // Create appointments throughout the day: 8am-6pm
        const dayStart = startOfDay(currentDate);
        dayStart.setHours(8, 0, 0, 0); // 8am start
        
        let currentTime = new Date(dayStart);
        const endTime = new Date(dayStart);
        endTime.setHours(18, 0, 0, 0); // 6pm end
        
        while (currentTime < endTime) {
          // Occasionally skip a slot to create gaps (20% chance)
          if (Math.random() > 0.2) {
            // Select a random procedure
            const procedure = procedureTypes[Math.floor(Math.random() * procedureTypes.length)];
            // Select a random patient
            const patient = existingPatients[Math.floor(Math.random() * existingPatients.length)];
            
            // Calculate end time based on procedure duration
            const appointmentEndTime = new Date(currentTime);
            appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + procedure.duration);
            
            // Determine a realistic status based on the current time and appointment time
            let status = AppointmentStatus.SCHEDULED;
            
            // Set statuses based on current real time vs appointment time
            const now = new Date();
            
            if (currentTime < now) {
              // Past appointments have progressed status
              const randomVal = Math.random();
              if (randomVal < 0.1) status = AppointmentStatus.CANCELLED; // 10% cancelled
              else if (randomVal < 0.15) status = AppointmentStatus.NO_SHOW; // 5% no-show
              else if (randomVal < 0.2) status = AppointmentStatus.LATE; // 5% late
              else status = AppointmentStatus.COMPLETED; // 80% completed
            } else if (currentTime.getTime() - now.getTime() < 60 * 60 * 1000) {
              // Next hour appointments are in various active states
              const statuses = [
                AppointmentStatus.CHECKED_IN,
                AppointmentStatus.SEATED,
                AppointmentStatus.PRE_CLINICAL,
                AppointmentStatus.DOCTOR_READY,
                AppointmentStatus.IN_CHAIR,
                AppointmentStatus.WRAP_UP,
                AppointmentStatus.READY_CHECKOUT
              ];
              status = statuses[Math.floor(Math.random() * statuses.length)];
            } else if (currentTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
              // Today's upcoming appointments are mostly confirmed
              status = Math.random() > 0.3 ? AppointmentStatus.CONFIRMED : AppointmentStatus.SCHEDULED;
            }
            
            // Status-specific timestamps
            const timestamps: any = {};
            
            if ([
              AppointmentStatus.CHECKED_IN,
              AppointmentStatus.SEATED,
              AppointmentStatus.PRE_CLINICAL,
              AppointmentStatus.DOCTOR_READY,
              AppointmentStatus.IN_CHAIR,
              AppointmentStatus.WRAP_UP,
              AppointmentStatus.READY_CHECKOUT,
              AppointmentStatus.COMPLETED
            ].includes(status)) {
              timestamps.arrivedAt = new Date(currentTime.getTime() - 15 * 60 * 1000); // 15 min before
            }
            
            if ([
              AppointmentStatus.SEATED,
              AppointmentStatus.PRE_CLINICAL,
              AppointmentStatus.DOCTOR_READY,
              AppointmentStatus.IN_CHAIR,
              AppointmentStatus.WRAP_UP,
              AppointmentStatus.READY_CHECKOUT,
              AppointmentStatus.COMPLETED
            ].includes(status)) {
              timestamps.seatedAt = new Date(currentTime.getTime() - 10 * 60 * 1000); // 10 min before
            }
            
            if ([
              AppointmentStatus.IN_CHAIR,
              AppointmentStatus.WRAP_UP,
              AppointmentStatus.READY_CHECKOUT,
              AppointmentStatus.COMPLETED
            ].includes(status)) {
              timestamps.chairStartedAt = new Date(currentTime.getTime() - 5 * 60 * 1000); // 5 min before
            }
            
            if (status === AppointmentStatus.COMPLETED) {
              timestamps.completedAt = new Date(appointmentEndTime.getTime() - 5 * 60 * 1000); // 5 min before end
            }
            
            // Add a CDT code for some procedures
            const hasCdtCode = Math.random() > 0.6;
            const cdtCode = hasCdtCode ? `D${Math.floor(1000 + Math.random() * 9000)}` : null;
            
            // Convert any Date objects in timestamps to strings
            const stringTimestamps: any = {};
            for (const [key, value] of Object.entries(timestamps)) {
              if (value instanceof Date) {
                stringTimestamps[key] = value.toISOString();
              } else {
                stringTimestamps[key] = value;
              }
            }
            
            appointmentData.push({
              patientId: patient.id,
              providerId: provider.id,
              operatoryId: operatory.id,
              appointmentType: procedure.name,
              procedure: `${procedure.name} ${procedure.name.includes('canal') ? 'on upper left incisor' : 
                          procedure.name.includes('filling') ? 'on lower molar' :
                          procedure.name.includes('crown') ? 'for tooth #18' : ''}`,
              date: formattedDate,
              startTime: formatTimeString(currentTime),
              endTime: formatTimeString(appointmentEndTime),
              status,
              duration: procedure.duration,
              notes: `Sample ${procedure.name} appointment`,
              cdtCode,
              ...stringTimestamps,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
          
          // Move to next appointment slot (30-minute increments)
          currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
      }
    }
  }
  
  // Insert all appointments in batches to avoid hitting DB limits
  const batchSize = 100;
  for (let i = 0; i < appointmentData.length; i += batchSize) {
    const batch = appointmentData.slice(i, i + batchSize);
    await db.insert(appointments).values(batch);
  }
  
  console.log(`✅ Created ${appointmentData.length} comprehensive appointments across multiple days.`);
  console.log('✅ Comprehensive scheduling data seeding complete!');
}

// Execute the seed function
seedComprehensiveSchedulingData().catch(console.error);