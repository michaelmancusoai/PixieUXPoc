// Time Constants
export const MINS_IN_HOUR = 60;
export const HOURS_IN_DAY = 24;
export const TIME_SLOT = 5; // 5-minute intervals
export const BUSINESS_START_HOUR = 8; // 8:00 AM
export const BUSINESS_END_HOUR = 18; // 6:00 PM

// Appointment Status Colors
export const STATUS_COLORS = {
  SCHEDULED: {
    bg: "bg-blue-500 bg-opacity-60",
    text: "text-white",
    border: ""
  },
  CONFIRMED: {
    bg: "bg-blue-600",
    text: "text-white",
    border: ""
  },
  CHECKED_IN: {
    bg: "bg-green-500 bg-opacity-80",
    text: "text-white",
    border: ""
  },
  IN_CHAIR: {
    bg: "bg-green-700",
    text: "text-white",
    border: ""
  },
  COMPLETED: {
    bg: "bg-white",
    text: "text-gray-700",
    border: "border border-gray-400"
  },
  NO_SHOW: {
    bg: "bg-white",
    text: "text-red-700",
    border: "border-2 border-dashed border-red-500"
  }
};

// CDT Code Categories
export const CDT_CATEGORIES = {
  DIAGNOSTIC: "D0",
  PREVENTIVE: "D1",
  RESTORATIVE: "D2",
  ENDODONTICS: "D3",
  PERIODONTICS: "D4",
  PROSTHODONTICS: "D5",
  IMPLANTS: "D6",
  ORAL_SURGERY: "D7",
  ORTHODONTICS: "D8"
};

// Scheduling specific enums
export const AppointmentStatus = {
  SCHEDULED: "scheduled",
  CONFIRMED: "confirmed",
  CHECKED_IN: "checked_in",
  SEATED: "seated",
  PRE_CLINICAL: "pre_clinical", 
  DOCTOR_READY: "doctor_ready",
  IN_CHAIR: "in_chair",
  WRAP_UP: "wrap_up",
  READY_CHECKOUT: "ready_checkout",
  COMPLETED: "completed",
  LATE: "late",
  NO_SHOW: "no_show",
  CANCELLED: "cancelled",
} as const;

export type AppointmentStatusType = keyof typeof AppointmentStatus;

export const ProviderRole = {
  DENTIST: "DENTIST",
  HYGIENIST: "HYGIENIST",
  ASSISTANT: "ASSISTANT",
} as const;

export type ProviderRoleType = keyof typeof ProviderRole;

export const ViewMode = {
  DAY: "DAY",
  WEEK: "WEEK",
  OPERATORY: "OPERATORY",
  PROVIDER: "PROVIDER",
} as const;

export type ViewModeType = keyof typeof ViewMode;