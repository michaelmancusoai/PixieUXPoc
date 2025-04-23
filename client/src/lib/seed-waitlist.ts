import { apiRequest } from "@/lib/queryClient";

// Add example patients to the waitlist
export async function seedWaitlist() {
  try {
    const waitlistItems = [
      {
        patientId: 10, // Using an existing patient ID from our database
        requestDate: new Date().toISOString(),
        contactNumber: "(555) 123-4567",
        requestedProcedure: "Dental Cleaning",
        notes: "Patient prefers morning appointments",
        priority: "HIGH"
      },
      {
        patientId: 11, // Using an existing patient ID from our database
        requestDate: new Date().toISOString(),
        contactNumber: "(555) 987-6543",
        requestedProcedure: "Crown Appointment",
        notes: "Patient requests Dr. Smith specifically",
        priority: "NORMAL"
      },
      {
        patientId: 12, // Using an existing patient ID from our database
        requestDate: new Date().toISOString(),
        contactNumber: "(555) 555-5555",
        requestedProcedure: "Wisdom Tooth Extraction",
        notes: "Patient has been experiencing pain for several days",
        priority: "HIGH"
      },
      {
        patientId: 13, // Using an existing patient ID from our database
        requestDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        contactNumber: "(555) 444-3333",
        requestedProcedure: "Regular Check-up",
        notes: "Patient prefers late afternoon appointments after work",
        priority: "LOW"
      }
    ];

    // Add each waitlist item
    for (const item of waitlistItems) {
      // Patient ID 13 doesn't exist in our database, so we'll skip it
      if (item.patientId === 13) continue;
      
      await apiRequest("POST", "/api/waitlist", item);
      console.log(`Added patient ${item.patientId} to waitlist for ${item.requestedProcedure}`);
    }

    return true;
  } catch (error) {
    console.error("Error seeding waitlist:", error);
    return false;
  }
}