// Time Constants
export const MINS_IN_HOUR = 60;
export const HOURS_IN_DAY = 24;
export const TIME_SLOT = 8; // 8-pixels per 5-minute interval (increased for better visibility)
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
