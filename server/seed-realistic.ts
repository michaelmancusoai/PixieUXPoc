import { db } from './db';
import { 
  appointments,
  patients,
  users,
  operatories,
  AppointmentStatus 
} from '@shared/schema';
import { addMinutes, format, startOfDay, addDays, parseISO } from 'date-fns';

// Seed script for realistic scheduling data with no double-booking
async function seedRealisticSchedulingData() {
  console.log('🌱 Seeding realistic scheduling data with no double-booking...');
  
  // Clear existing appointments for clean data
  await db.delete(appointments);
  
  // Get existing data
  const existingOperatories = await db.select().from(operatories);
  const existingPatients = await db.select().from(patients);
  const existingUsers = await db.select().from(users);
  
  // If no patients/operatories exist, warn and exit
  if (existingPatients.length === 0 || existingOperatories.length === 0) {
    console.log('❌ Missing required data! Please seed patients and operatories first.');
    return;
  }
  
  // If no users exist, warn and exit
  if (existingUsers.length === 0) {
    console.log('❌ Missing users data! Please seed users first.');
    return;
  }
  
  // Filter users that are providers or use a subset of users as providers
  const providers = existingUsers.filter(user => user.role === 'provider');
  const usersAsProviders = providers.length > 0 ? providers : existingUsers.slice(0, Math.min(3, existingUsers.length));
  
  // Ensure we have provider data to work with
  if (usersAsProviders.length === 0) {
    console.log('❌ No providers found and couldn\'t use existing users.');
    return;
  }
  
  // Procedure types with associated durations in minutes
  const procedureTypes = [
    { name: 'Regular cleaning', duration: 30 },
    { name: 'Deep cleaning', duration: 60 },
    { name: 'Cavity filling', duration: 45 },
    { name: 'Crown prep', duration: 60 },
    { name: 'Root canal', duration: 90 },
    { name: 'Extraction', duration: 45 },
    { name: 'Wisdom tooth extraction', duration: 75 },
    { name: 'Comprehensive exam', duration: 45 },
    { name: 'Emergency visit', duration: 30 },
    { name: 'Consultation', duration: 30 }
  ];
  
  // Business hours configuration (8:00 AM - 6:00 PM)
  const businessHours = {
    startHour: 8, // 8:00 AM
    startMinute: 0,
    endHour: 18, // 6:00 PM
    endMinute: 0,
    lunchStartHour: 12, // 12:00 PM
    lunchStartMinute: 0,
    lunchDuration: 60 // 60 minutes
  };
  
  // Generate appointments for today and the next 7 days
  const today = new Date();
  const appointmentData = [];
  
  // Track which slots are already booked for each provider and operatory
  // Format: {date: {providerId: {hour-minute: true}}}
  const bookedSlots = {};
  
  // For each day, create a realistic schedule
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = addDays(today, dayOffset);
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    // Initialize booking tracker for this day
    if (!bookedSlots[formattedDate]) {
      bookedSlots[formattedDate] = {};
      
      for (const provider of usersAsProviders) {
        bookedSlots[formattedDate][provider.id] = {};
      }
      
      for (const operatory of existingOperatories) {
        if (!bookedSlots[formattedDate][`op-${operatory.id}`]) {
          bookedSlots[formattedDate][`op-${operatory.id}`] = {};
        }
      }
    }
    
    // Calculate number of appointments per provider per day
    // Typical dental practice: hygienists see 8-10 patients per day, dentists 8-12
    const appointmentsPerProvider = {};
    
    for (const provider of usersAsProviders) {
      // Determine target number - higher on busier days (middle of week)
      const dayOfWeek = (today.getDay() + dayOffset) % 7;
      const isDentist = provider.role === 'dentist' || provider.id % 2 === 0; // Simulate role difference
      
      // Busier in middle of week (Tues, Wed, Thurs)
      const busyDayModifier = (dayOfWeek >= 2 && dayOfWeek <= 4) ? 1 : 0;
      
      // Dentists see more patients than hygienists typically
      const basePatients = isDentist ? 8 : 7;
      
      // Set target with some randomness
      appointmentsPerProvider[provider.id] = basePatients + busyDayModifier + Math.floor(Math.random() * 3);
    }
    
    // For each provider
    for (const provider of usersAsProviders) {
      // Create the provider's schedule for this day
      const dayStart = startOfDay(currentDate);
      
      dayStart.setHours(businessHours.startHour, businessHours.startMinute, 0, 0);
      
      // Calculate lunch time
      const lunchStart = new Date(dayStart);
      lunchStart.setHours(businessHours.lunchStartHour, businessHours.lunchStartMinute, 0, 0);
      const lunchEnd = addMinutes(lunchStart, businessHours.lunchDuration);
      
      // Calculate day end
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(businessHours.endHour, businessHours.endMinute, 0, 0);
      
      // Try to schedule the target number of appointments for this provider
      let appointmentsScheduled = 0;
      let maxAttempts = 50; // Prevent infinite loops
      
      while (appointmentsScheduled < appointmentsPerProvider[provider.id] && maxAttempts > 0) {
        maxAttempts--;
        
        // Rather than fully random, use a more structured approach to distribute throughout the day
        // Divide the day into 5 equal segments to distribute appointments evenly across the full 8am-6pm range
        let segment;
        if (appointmentsScheduled % 5 === 0) {
            // Early morning: 8:00am - 10:00am
            segment = { startHour: 8, endHour: 10 };
        } else if (appointmentsScheduled % 5 === 1) {
            // Late morning: 10:00am - 12:00pm
            segment = { startHour: 10, endHour: 12 };
        } else if (appointmentsScheduled % 5 === 2) {
            // Early afternoon: 1:00pm - 3:00pm (after lunch)
            segment = { startHour: 13, endHour: 15 };
        } else if (appointmentsScheduled % 5 === 3) {
            // Mid afternoon: 3:00pm - 4:30pm
            segment = { startHour: 15, endHour: 16.5 };
        } else {
            // Late afternoon: 4:30pm - 6:00pm
            segment = { startHour: 16.5, endHour: 18 };
        }
        
        // Choose a start time within the selected segment
        const hourSpan = segment.endHour - segment.startHour;
        const startHourDecimal = segment.startHour + (Math.random() * hourSpan);
        const startHour = Math.floor(startHourDecimal);
        const startMinute = Math.floor((startHourDecimal - startHour) * 60);
        // Round to nearest 5 minutes
        const roundedStartMinute = Math.round(startMinute / 5) * 5;
        
        const potentialStartTime = new Date(dayStart);
        potentialStartTime.setHours(startHour, roundedStartMinute, 0, 0);
        
        // Skip if in lunch time
        if (potentialStartTime >= lunchStart && potentialStartTime < lunchEnd) {
          continue;
        }
        
        // Skip if outside business hours
        if (potentialStartTime < dayStart || potentialStartTime >= dayEnd) {
          continue;
        }
        
        // Choose a random procedure
        const procedure = procedureTypes[Math.floor(Math.random() * procedureTypes.length)];
        const potentialEndTime = addMinutes(potentialStartTime, procedure.duration);
        
        // Skip if appointment would extend past business hours or into lunch
        if (potentialEndTime > dayEnd || (potentialStartTime < lunchStart && potentialEndTime > lunchStart)) {
          continue;
        }
        
        // Check for time slot availability for this provider
        let timeSlotAvailable = true;
        const slotKey = `${startHour}-${startMinute}`;
        
        // Check provider availability for the duration of the appointment
        let currentSlotCheck = new Date(potentialStartTime);
        while (currentSlotCheck < potentialEndTime) {
          const checkHour = currentSlotCheck.getHours();
          const checkMinute = currentSlotCheck.getMinutes();
          const checkSlotKey = `${checkHour}-${checkMinute}`;
          
          if (bookedSlots[formattedDate][provider.id][checkSlotKey]) {
            timeSlotAvailable = false;
            break;
          }
          
          // Check next 5-minute interval
          currentSlotCheck = addMinutes(currentSlotCheck, 5);
        }
        
        if (!timeSlotAvailable) {
          continue;
        }
        
        // Find an available operatory
        let selectedOperatory = null;
        
        for (const operatory of existingOperatories) {
          let operatoryAvailable = true;
          
          // Check operatory availability for the duration of the appointment
          currentSlotCheck = new Date(potentialStartTime);
          while (currentSlotCheck < potentialEndTime) {
            const checkHour = currentSlotCheck.getHours();
            const checkMinute = currentSlotCheck.getMinutes();
            const checkSlotKey = `${checkHour}-${checkMinute}`;
            
            if (bookedSlots[formattedDate][`op-${operatory.id}`][checkSlotKey]) {
              operatoryAvailable = false;
              break;
            }
            
            // Check next 5-minute interval
            currentSlotCheck = addMinutes(currentSlotCheck, 5);
          }
          
          if (operatoryAvailable) {
            selectedOperatory = operatory;
            break;
          }
        }
        
        if (!selectedOperatory) {
          continue; // No operatory available for this time slot
        }
        
        // If we got here, we can schedule the appointment
        // Mark all 5-minute intervals as booked for both provider and operatory
        currentSlotCheck = new Date(potentialStartTime);
        while (currentSlotCheck < potentialEndTime) {
          const checkHour = currentSlotCheck.getHours();
          const checkMinute = currentSlotCheck.getMinutes();
          const checkSlotKey = `${checkHour}-${checkMinute}`;
          
          bookedSlots[formattedDate][provider.id][checkSlotKey] = true;
          bookedSlots[formattedDate][`op-${selectedOperatory.id}`][checkSlotKey] = true;
          
          // Check next 5-minute interval
          currentSlotCheck = addMinutes(currentSlotCheck, 5);
        }
        
        // Select a random patient
        const patient = existingPatients[Math.floor(Math.random() * existingPatients.length)];
        
        // Determine a realistic status based on the current time vs appointment time
        let status = AppointmentStatus.SCHEDULED;
        
        // Set statuses based on current real time vs appointment time
        const now = new Date();
        
        if (potentialStartTime < now) {
          // Past appointments have progressed status
          const randomVal = Math.random();
          if (randomVal < 0.08) status = AppointmentStatus.CANCELLED; // 8% cancelled
          else if (randomVal < 0.12) status = AppointmentStatus.NO_SHOW; // 4% no-show
          else if (randomVal < 0.15) status = AppointmentStatus.LATE; // 3% late
          else status = AppointmentStatus.COMPLETED; // 85% completed
        } else if (potentialStartTime.getTime() - now.getTime() < 60 * 60 * 1000) {
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
        } else if (potentialStartTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
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
          timestamps.arrivedAt = new Date(potentialStartTime.getTime() - 15 * 60 * 1000); // 15 min before
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
          timestamps.seatedAt = new Date(potentialStartTime.getTime() - 10 * 60 * 1000); // 10 min before
        }
        
        if ([
          AppointmentStatus.IN_CHAIR,
          AppointmentStatus.WRAP_UP,
          AppointmentStatus.READY_CHECKOUT,
          AppointmentStatus.COMPLETED
        ].includes(status)) {
          timestamps.chairStartedAt = new Date(potentialStartTime.getTime() - 5 * 60 * 1000); // 5 min before
        }
        
        if (status === AppointmentStatus.COMPLETED) {
          timestamps.completedAt = new Date(potentialEndTime.getTime() - 5 * 60 * 1000); // 5 min before end
        }
        
        // Add notes with varying probability
        let notes = null;
        if (Math.random() < 0.4) {
          const noteTemplates = [
            `Patient requested ${procedure.name === 'Regular cleaning' ? 'extra fluoride treatment' : 'explanation of procedure'}`,
            `Follow up on ${procedure.name.toLowerCase()} in 6 months`,
            `Patient mentioned sensitivity in upper right quadrant`,
            `Discuss home care routine`,
            `Check healing at next visit`,
            `Review treatment plan options`,
            `Verify insurance coverage for procedure`,
            `Patient prefers morning appointments`
          ];
          notes = noteTemplates[Math.floor(Math.random() * noteTemplates.length)];
        }
        
        // Format times for database storage
        const apptData = {
          patientId: patient.id,
          providerId: provider.id,
          operatoryId: selectedOperatory.id,
          appointmentType: procedure.name,
          procedure: procedure.name,
          date: new Date(formattedDate),
          startTime: potentialStartTime,
          endTime: potentialEndTime,
          status,
          duration: procedure.duration,
          notes,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add timestamp fields if applicable
        for (const [key, value] of Object.entries(timestamps)) {
          if (value instanceof Date) {
            apptData[key] = value;
          }
        }
        
        appointmentData.push(apptData);
        appointmentsScheduled++;
      }
    }
  }
  
  // Insert all appointments in batches
  if (appointmentData.length > 0) {
    const batchSize = 50;
    
    for (let i = 0; i < appointmentData.length; i += batchSize) {
      const batch = appointmentData.slice(i, i + batchSize);
      await db.insert(appointments).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(appointmentData.length / batchSize)}`);
    }
    
    console.log(`✅ Created ${appointmentData.length} realistic appointments with no double-booking`);
  } else {
    console.log('❌ No appointment data was generated');
  }
  
  console.log('✅ Realistic scheduling data seeding complete!');
}

// Execute the seed function
seedRealisticSchedulingData().catch(console.error);