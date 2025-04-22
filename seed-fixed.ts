import { db } from './server/db';
import { 
  patients, 
  appointments, 
  medicalAlerts, 
  recalls, 
  documents, 
  notes,
  insuranceClaims,
  treatments,
  payments,
  messages,
  activityLog,
  users
} from './shared/schema';
import { pool } from './server/db';

async function seed() {
  console.log('Seeding database...');
  
  // Clear existing data
  await db.delete(activityLog);
  await db.delete(messages);
  await db.delete(payments);
  await db.delete(insuranceClaims);
  await db.delete(treatments);
  await db.delete(recalls);
  await db.delete(documents);
  await db.delete(notes);
  await db.delete(medicalAlerts);
  await db.delete(appointments);
  await db.delete(patients);
  await db.delete(users);
  
  console.log('Creating users...');
  // Create users
  const [drsmith] = await db.insert(users).values([
    { 
      username: 'drsmith', 
      password: 'password'
    }
  ]).returning();
  
  console.log('Creating patients...');
  // Create patients
  const [john, emily, michael] = await db.insert(patients).values([
    {
      chartNumber: 'PT-0001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-04-15',
      gender: 'male',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      createdBy: drsmith.id
    },
    {
      chartNumber: 'PT-0002',
      firstName: 'Emily',
      lastName: 'Johnson',
      dateOfBirth: '1992-08-22',
      gender: 'female',
      email: 'emily.johnson@example.com',
      phone: '(555) 987-6543',
      address: '456 Park Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94108',
      createdBy: drsmith.id
    },
    {
      chartNumber: 'PT-0003',
      firstName: 'Michael',
      lastName: 'Williams',
      dateOfBirth: '1978-11-30',
      gender: 'male',
      email: 'michael.williams@example.com',
      phone: '(555) 456-7890',
      address: '789 Oak St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94109',
      createdBy: drsmith.id
    }
  ]).returning();
  
  console.log('Creating medical alerts...');
  // Create medical alerts
  await db.insert(medicalAlerts).values([
    {
      patientId: john.id,
      type: 'Allergy',
      description: 'Penicillin',
      severity: 'high',
      active: true
    },
    {
      patientId: emily.id,
      type: 'Medical',
      description: 'Asthma',
      severity: 'medium',
      active: true
    },
    {
      patientId: michael.id,
      type: 'Allergy',
      description: 'Latex',
      severity: 'high',
      active: true
    }
  ]);
  
  console.log('Creating appointments...');
  // Create appointments (both past and future)
  const now = new Date();
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(now.getDate() - 3);
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  
  await db.insert(appointments).values([
    {
      patientId: john.id,
      providerId: drsmith.id,
      startTime: threeDaysAgo,
      endTime: new Date(threeDaysAgo.getTime() + 30 * 60000), // 30 min
      appointmentType: 'Checkup',
      status: 'completed',
      notes: 'Regular checkup, everything normal.'
    },
    {
      patientId: emily.id,
      providerId: drsmith.id,
      startTime: yesterday,
      endTime: new Date(yesterday.getTime() + 60 * 60000), // 60 min
      appointmentType: 'Cleaning',
      status: 'completed',
      notes: 'Routine cleaning, recommended flossing more frequently.'
    },
    {
      patientId: john.id,
      providerId: drsmith.id,
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 45 * 60000), // 45 min
      appointmentType: 'Filling',
      status: 'scheduled',
      notes: 'Filling for cavity on lower right molar.'
    },
    {
      patientId: michael.id,
      providerId: drsmith.id,
      startTime: nextWeek,
      endTime: new Date(nextWeek.getTime() + 60 * 60000), // 60 min
      appointmentType: 'Root Canal',
      status: 'scheduled',
      notes: 'Root canal on upper left incisor.'
    }
  ]);
  
  console.log('Creating documents...');
  // Create documents
  await db.insert(documents).values([
    {
      patientId: john.id,
      title: 'X-Ray Results',
      documentType: 'image',
      filePath: '/documents/john_doe_xray.jpg',
      uploadedBy: drsmith.id,
      uploadedAt: new Date(threeDaysAgo.getTime()),
      description: 'X-ray of lower right molar showing cavity.'
    },
    {
      patientId: emily.id,
      title: 'Insurance Information',
      documentType: 'pdf',
      filePath: '/documents/emily_insurance.pdf',
      uploadedBy: drsmith.id,
      uploadedAt: new Date(yesterday.getTime()),
      description: 'Updated insurance policy documents'
    },
    {
      patientId: michael.id,
      title: 'Treatment Plan',
      documentType: 'pdf',
      filePath: '/documents/michael_treatment.pdf',
      uploadedBy: drsmith.id,
      uploadedAt: new Date(yesterday.getTime()),
      description: 'Root canal procedure details and post-op care.'
    }
  ]);
  
  console.log('Creating notes...');
  // Create notes
  await db.insert(notes).values([
    {
      patientId: john.id,
      noteType: 'Clinical',
      content: 'Patient reports sensitivity to cold in lower right quadrant. Visual examination shows potential cavity in tooth #30.',
      authorId: drsmith.id,
      status: 'active'
    },
    {
      patientId: emily.id,
      noteType: 'Administrative',
      content: 'Updated insurance information received. Coverage now includes orthodontic procedures.',
      authorId: drsmith.id,
      status: 'active'
    },
    {
      patientId: michael.id,
      noteType: 'Clinical',
      content: 'Patient reports severe pain in upper left quadrant. X-rays indicate need for root canal on tooth #9.',
      authorId: drsmith.id,
      status: 'active'
    }
  ]);
  
  console.log('Creating payments...');
  // Create payments
  await db.insert(payments).values([
    {
      patientId: john.id,
      amount: '150.00',
      paymentMethod: 'Credit Card',
      paymentDate: threeDaysAgo,
      reference: 'PAY-1234',
      createdBy: drsmith.id,
      description: 'Payment for checkup visit'
    },
    {
      patientId: emily.id,
      amount: '200.00',
      paymentMethod: 'Insurance',
      paymentDate: yesterday,
      reference: 'INS-5678',
      createdBy: drsmith.id,
      description: 'Insurance payment for cleaning'
    },
    {
      patientId: michael.id,
      amount: '50.00',
      paymentMethod: 'Debit Card',
      paymentDate: yesterday,
      reference: 'PAY-9101',
      createdBy: drsmith.id,
      description: 'Co-pay for consultation'
    }
  ]);
  
  console.log('Creating insurance claims...');
  // Create insurance claims
  await db.insert(insuranceClaims).values([
    {
      patientId: john.id,
      claimNumber: 'CL-001-2025',
      dateOfService: threeDaysAgo,
      amount: '300.00',
      status: 'paid',
      submittedDate: threeDaysAgo,
      paidAmount: '270.00',
      description: 'Checkup visit and x-rays'
    },
    {
      patientId: emily.id,
      claimNumber: 'CL-002-2025',
      dateOfService: yesterday,
      amount: '250.00',
      status: 'submitted',
      submittedDate: yesterday,
      description: 'Cleaning and fluoride treatment'
    },
    {
      patientId: michael.id,
      claimNumber: 'CL-003-2025',
      dateOfService: yesterday,
      amount: '800.00',
      status: 'pending',
      description: 'Root canal consultation and x-rays'
    }
  ]);
  
  console.log('Creating recalls...');
  // Create recalls
  const sixMonthsLater = new Date(now);
  sixMonthsLater.setMonth(now.getMonth() + 6);
  
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(now.getFullYear() + 1);
  
  await db.insert(recalls).values([
    {
      patientId: john.id,
      type: 'Checkup',
      dueDate: sixMonthsLater,
      status: 'scheduled',
      notes: 'Regular 6-month checkup'
    },
    {
      patientId: emily.id,
      type: 'Cleaning',
      dueDate: sixMonthsLater,
      status: 'scheduled',
      notes: 'Regular 6-month cleaning'
    },
    {
      patientId: michael.id,
      type: 'X-Ray',
      dueDate: oneYearLater,
      status: 'scheduled',
      notes: 'Annual X-rays'
    }
  ]);
  
  console.log('Creating treatments...');
  // Create treatments
  await db.insert(treatments).values([
    {
      patientId: john.id,
      treatmentDate: threeDaysAgo,
      procedure: 'X-Ray',
      toothNumber: null,
      fee: '100.00',
      providerId: drsmith.id,
      status: 'completed',
      notes: 'Full mouth X-rays for routine examination'
    },
    {
      patientId: emily.id,
      treatmentDate: yesterday,
      procedure: 'Cleaning',
      toothNumber: null,
      fee: '150.00',
      providerId: drsmith.id,
      status: 'completed',
      notes: 'Standard cleaning and polish'
    },
    {
      patientId: john.id,
      treatmentDate: tomorrow,
      procedure: 'Filling',
      toothNumber: 30,
      fee: '250.00',
      providerId: drsmith.id,
      status: 'scheduled',
      notes: 'Composite filling for cavity'
    },
    {
      patientId: michael.id,
      treatmentDate: nextWeek,
      procedure: 'Root Canal',
      toothNumber: 9,
      fee: '1000.00',
      providerId: drsmith.id,
      status: 'scheduled',
      notes: 'Root canal therapy due to severe decay'
    }
  ]);
  
  console.log('Creating messages...');
  // Create messages
  await db.insert(messages).values([
    {
      patientId: john.id,
      content: 'Hi John, this is a reminder about your filling appointment tomorrow. Please arrive 15 minutes early.',
      senderId: drsmith.id,
      sentAt: now,
      isRead: false,
      messageType: 'reminder'
    },
    {
      patientId: emily.id,
      content: 'Hello Emily, thank you for coming in yesterday. Don\'t forget to follow the post-cleaning instructions provided.',
      senderId: drsmith.id,
      sentAt: yesterday,
      isRead: true,
      messageType: 'follow-up'
    },
    {
      patientId: michael.id,
      content: 'Michael, we\'ve scheduled your root canal procedure for next week. Please review the preparation instructions.',
      senderId: drsmith.id,
      sentAt: yesterday,
      isRead: true,
      messageType: 'appointment'
    }
  ]);
  
  console.log('Creating activity logs...');
  // Create activity logs
  await db.insert(activityLog).values([
    {
      patientId: john.id,
      userId: drsmith.id,
      actionType: 'appointment',
      description: 'Scheduled filling appointment',
      metadata: { appointmentId: 3 }
    },
    {
      patientId: emily.id,
      userId: drsmith.id,
      actionType: 'payment',
      description: 'Received payment for cleaning',
      metadata: { paymentId: 2 }
    },
    {
      patientId: michael.id,
      userId: drsmith.id,
      actionType: 'note',
      description: 'Added clinical note about root canal',
      metadata: { noteId: 3 }
    },
    {
      patientId: john.id,
      userId: drsmith.id,
      actionType: 'treatment',
      description: 'Completed X-ray examination',
      metadata: { treatmentId: 1 }
    },
    {
      patientId: emily.id,
      userId: drsmith.id,
      actionType: 'document',
      description: 'Uploaded insurance information',
      metadata: { documentId: 2 }
    }
  ]);
  
  console.log('Database seeded successfully!');
}

seed()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    console.log('Done.');
  });