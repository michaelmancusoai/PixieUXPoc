import { db } from './db';
import { appointments, patients, users, operatories, AppointmentStatus } from '@shared/schema';
import { format, startOfDay, addDays, addMinutes } from 'date-fns';

async function seedSimpleAppointments() {
  console.log('🌱 Seeding simple appointment data...');
  
  // Clear existing appointments for clean data
  await db.delete(appointments);
  
  // Get existing data
  const existingOperatories = await db.select().from(operatories);
  const existingPatients = await db.select().from(patients);
  const existingUsers = await db.select().from(users);
  
  // If required data is missing, exit
  if (existingPatients.length === 0 || existingOperatories.length === 0 || existingUsers.length === 0) {
    console.log('❌ Missing required data! Please seed patients, operatories, and users first.');
    return;
  }
  
  // Filter users that are providers
  const providers = existingUsers.filter(user => user.role === 'provider');
  
  if (providers.length === 0) {
    console.log('❌ No users with provider role found! Using regular users instead.');
  }
  
  // Use providers or fallback to regular users
  const usersAsProviders = providers.length > 0 ? providers : existingUsers.slice(0, 3);
  
  // List of procedures
  const procedures = [
    { name: 'Regular cleaning', duration: 30 },
    { name: 'Deep cleaning', duration: 60 },
    { name: 'Cavity filling', duration: 45 },
    { name: 'Root canal', duration: 90 },
    { name: 'Crown prep', duration: 60 },
    { name: 'Extraction', duration: 45 }
  ];
  
  // Status options
  const allStatuses = [
    AppointmentStatus.SCHEDULED,
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.CHECKED_IN,
    AppointmentStatus.SEATED,
    AppointmentStatus.PRE_CLINICAL,
    AppointmentStatus.DOCTOR_READY,
    AppointmentStatus.IN_CHAIR,
    AppointmentStatus.WRAP_UP,
    AppointmentStatus.READY_CHECKOUT,
    AppointmentStatus.COMPLETED
  ];
  
  // Create appointments for today and the next 3 days
  const appointmentData = [];
  const today = new Date();
  
  // For each day
  for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
    const currentDate = addDays(today, dayOffset);
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    // For each provider
    for (const provider of usersAsProviders) {
      // Assign 1 or 2 operatories to this provider
      const operatoryCount = Math.min(2, existingOperatories.length);
      const providerOperatories = existingOperatories.slice(0, operatoryCount);
      
      // For each operatory
      for (const operatory of providerOperatories) {
        // Create appointments for this day (8am to 5pm)
        let startTime = new Date(currentDate);
        startTime.setHours(8, 0, 0, 0);
        
        // Create up to 8 appointments per day per operatory
        for (let slot = 0; slot < 8; slot++) {
          // Occasionally skip a slot (20% chance)
          if (Math.random() > 0.2) {
            // Choose a random procedure
            const procedure = procedures[Math.floor(Math.random() * procedures.length)];
            
            // Choose a random patient
            const patient = existingPatients[Math.floor(Math.random() * existingPatients.length)];
            
            // Calculate end time
            const endTime = addMinutes(startTime, procedure.duration);
            
            // Choose a random status
            const status = allStatuses[Math.floor(Math.random() * allStatuses.length)];
            
            // Create appointment
            appointmentData.push({
              patientId: patient.id,
              providerId: provider.id,
              operatoryId: operatory.id,
              date: format(startTime, 'yyyy-MM-dd'), // Convert to string format expected by the database
              startTime,
              endTime,
              appointmentType: procedure.name,
              procedure: `${procedure.name}`,
              status,
              duration: procedure.duration,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          
          // Move to next time slot (60-minute increment)
          startTime = addMinutes(startTime, 60);
        }
      }
    }
  }
  
  // Insert all appointments
  if (appointmentData.length > 0) {
    await db.insert(appointments).values(appointmentData);
    console.log(`✅ Created ${appointmentData.length} appointments across multiple days`);
  } else {
    console.log('❌ No appointment data was generated');
  }
}

// Run the seed function
seedSimpleAppointments().catch(console.error);