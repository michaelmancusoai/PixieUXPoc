// Patient-related data types and constants

export type PatientAlert = {
  id: number;
  type: "error" | "warning" | "info";
  icon: string;
  label: string;
};

export type PatientData = {
  id: number;
  name: string;
  dob: string;
  gender: string;
  chart: string;
  phone: string;
  email: string;
  address: string;
  insurance: string;
  policyNumber: string;
  alerts: PatientAlert[];
  nextAppointment: {
    date: string;
    time: string;
    provider: string;
    type: string;
    duration: string;
  };
  balance: {
    amount: number;
    lastPayment: string;
  };
  insuranceDetails: {
    provider: string;
    policyNumber: string;
    status: string;
    nextVerification: string;
  };
  recalls: Array<{
    type: string;
    dueDate: string;
  }>;
  medicalAlerts: Array<{
    type: string;
    description: string;
  }>;
};

export type ActivityType = "appointment" | "message" | "clinical" | "claim" | "payment" | "voicemail" | "admin";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  date: string;
  user: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
};

export type ActivityFilter = "all" | "clinical" | "financial" | "communications" | "admin";

export type RecordStatus = "success" | "warning" | "error" | "info" | "secondary";

export type RecordItem = {
  title: string;
  date: string;
  status?: string;
  statusVariant?: RecordStatus;
  description?: string;
};

// Demo patient data
export const patientData: PatientData = {
  id: 12345,
  name: "Sarah Johnson",
  dob: "28 Aug 1986 · 38 yrs",
  gender: "Female",
  chart: "Chart #12345",
  phone: "(555) 123-4567",
  email: "sarah.johnson@example.com",
  address: "123 Main Street, Anytown, CA 94501",
  insurance: "Blue Cross Blue Shield",
  policyNumber: "BCBS12345678",
  alerts: [
    { id: 1, type: "error", icon: "error", label: "Latex Allergy" },
    { id: 2, type: "warning", icon: "attach_money", label: "Outstanding Balance" }
  ],
  nextAppointment: {
    date: "June 15, 2025",
    time: "10:30 AM",
    provider: "Dr. Johnson",
    type: "Cleaning",
    duration: "45 min"
  },
  balance: {
    amount: 325.75,
    lastPayment: "April 10, 2025"
  },
  insuranceDetails: {
    provider: "Blue Cross Blue Shield",
    policyNumber: "BCBS12345678",
    status: "Active",
    nextVerification: "July 2025"
  },
  recalls: [
    { type: "Annual Check-up", dueDate: "Aug 2025" },
    { type: "X-Rays", dueDate: "Dec 2025" }
  ],
  medicalAlerts: [
    { type: "Allergy", description: "Penicillin - Severe reaction" },
    { type: "Medical", description: "Asthma - Uses inhaler as needed" }
  ]
};