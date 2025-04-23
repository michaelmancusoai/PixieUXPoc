import { db } from './db';
import { providers, operatories, appointments, patients } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { addMinutes, format, setHours, setMinutes, startOfHour, subDays } from 'date-fns';

// Seed script for scheduling related data
async function seedSchedulingData() {
  console.log('🌱 Seeding scheduling data...');
  
  // Check if we have any providers and operatories
  const existingProviders = await db.select().from(providers);
  const existingOperatories = await db.select().from(operatories);
  const existingPatients = await db.select().from(patients);
  
  // If no patients exist, warn and exit
  if (existingPatients.length === 0) {
    console.log('❌ No patients found! Please seed patients first before scheduling appointments.');
    return;
  }
  
  // Seed providers if they don't exist
  if (existingProviders.length === 0) {
    console.log('🧑‍⚕️ Creating providers...');
    await db.insert(providers).values([
      {
        firstName: 'Jennifer',
        lastName: 'Smith',
        role: 'DENTIST',
        title: 'DDS',
        email: 'jsmith@pixiedental.com',
        phone: '555-123-4567',
        color: '#4f46e5',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        role: 'DENTIST',
        title: 'DMD',
        email: 'mjohnson@pixiedental.com',
        phone: '555-234-5678',
        color: '#10b981',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Sarah',
        lastName: 'Williams',
        role: 'HYGIENIST',
        title: 'RDH',
        email: 'swilliams@pixiedental.com',
        phone: '555-345-6789',
        color: '#f59e0b',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  } else {
    console.log(`✅ Found ${existingProviders.length} providers. Skipping provider creation.`);
  }
  
  // Seed operatories if they don't exist
  if (existingOperatories.length === 0) {
    console.log('🪑 Creating operatories...');
    await db.insert(operatories).values([
      {
        name: 'Room 1',
        description: 'General dentistry',
        location: 'Main Floor',
        color: '#2563eb',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Room 2',
        description: 'Hygiene',
        location: 'Main Floor',
        color: '#059669',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Room 3',
        description: 'Orthodontics',
        location: 'Main Floor',
        color: '#9333ea',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Room 4',
        description: 'Oral Surgery',
        location: 'Second Floor',
        color: '#d97706',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Room 5',
        description: 'Pediatric',
        location: 'Second Floor',
        color: '#dc2626',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  } else {
    console.log(`✅ Found ${existingOperatories.length} operatories. Skipping operatory creation.`);
  }
  
  // Refresh our lists of providers and operatories
  const allProviders = await db.select().from(providers);
  const allOperatories = await db.select().from(operatories);
  const allPatients = await db.select().from(patients);
  
  // Check if we have any appointments
  const existingAppointments = await db.select().from(appointments);
  
  // Seed appointments if they don't exist
  if (existingAppointments.length === 0) {
    console.log('📅 Creating sample appointments...');
    
    // Create appointments for today and tomorrow
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointmentData = [];
    
    // Function to create appointment times
    const createAppointment = (
      date: Date,
      startHour: number,
      startMinute: number,
      durationMinutes: number,
      patientId: number,
      providerId: number,
      operatoryId: number,
      status: string,
      title: string
    ) => {
      const startTime = new Date(date);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + durationMinutes);
      
      return {
        patientId,
        providerId,
        operatoryId,
        title,
        description: `Sample appointment for ${title}`,
        date: format(date, 'yyyy-MM-dd'),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    };
    
    // Create some sample appointments for today
    for (let i = 0; i < 5; i++) {
      // Randomly select patients, providers, and operatories
      const patient = allPatients[Math.floor(Math.random() * allPatients.length)];
      const provider = allProviders[Math.floor(Math.random() * allProviders.length)];
      const operatory = allOperatories[Math.floor(Math.random() * allOperatories.length)];
      
      // Morning appointments
      appointmentData.push(
        createAppointment(
          today,
          9 + i, // 9am to 2pm
          Math.random() > 0.5 ? 0 : 30, // Either on the hour or half past
          Math.random() > 0.7 ? 60 : 30, // Mostly 30 min, some 60 min
          patient.id,
          provider.id,
          operatory.id,
          Math.random() > 0.5 ? 'SCHEDULED' : 'CONFIRMED',
          Math.random() > 0.5 ? 'Regular Checkup' : 'Teeth Cleaning'
        )
      );
      
      // Afternoon appointments
      if (i < 3) { // Fewer appointments in the afternoon
        appointmentData.push(
          createAppointment(
            today,
            13 + i, // 1pm to 3pm
            Math.random() > 0.5 ? 0 : 30, // Either on the hour or half past
            Math.random() > 0.7 ? 60 : 30, // Mostly 30 min, some 60 min
            patient.id,
            provider.id,
            operatory.id,
            Math.random() > 0.5 ? 'SCHEDULED' : 'CONFIRMED',
            Math.random() > 0.7 ? 'Filling' : 'X-Ray'
          )
        );
      }
      
      // Tomorrow's appointments
      appointmentData.push(
        createAppointment(
          tomorrow,
          9 + i, // 9am to 2pm
          Math.random() > 0.5 ? 0 : 30, // Either on the hour or half past
          Math.random() > 0.7 ? 60 : 30, // Mostly 30 min, some 60 min
          patient.id,
          provider.id,
          operatory.id,
          'SCHEDULED',
          Math.random() > 0.6 ? 'Initial Consultation' : 'Follow-up'
        )
      );
    }
    
    // Insert the appointments
    await db.insert(appointments).values(appointmentData);
    console.log(`✅ Created ${appointmentData.length} sample appointments.`);
  } else {
    console.log(`✅ Found ${existingAppointments.length} appointments. Skipping appointment creation.`);
  }
  
  console.log('✅ Scheduling data seeding complete!');
}

// Execute the seed function
seedSchedulingData().catch(console.error);