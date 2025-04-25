import {
  Activity,
  ActivitySquare,
  AreaChart,
  BarChart3,
  BookOpen,
  Building,
  Calendar,
  Calendar as CalendarIcon,
  CalendarDays,
  Clipboard,
  Clock,
  Cog,
  CreditCard,
  FileBarChart,
  FileEdit,
  FileText,
  LayoutDashboard,
  LineChart,
  LockKeyhole,
  MessageSquare,
  Package,
  PieChart,
  Receipt,
  RefreshCcw,
  Settings,
  Shield,
  Trophy,
  User,
  UserCog,
  Users,
  Wallet
} from "lucide-react";

/**
 * Navigation Item Interface
 * Represents an individual navigation item (sub-navigation)
 * 
 * @property title - Display text for the navigation item
 * @property href - The URL path for the navigation item
 * @property icon - The icon component to display (from lucide-react)
 */
export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  directPath?: string; // Additional path used for direct mapping
}

/**
 * Navigation Section Interface
 * Represents a main navigation section, which can contain sub-items
 * 
 * @property title - Display text for the navigation section
 * @property href - The URL path for the navigation section
 * @property icon - The icon component to display (from lucide-react)
 * @property items - Array of sub-navigation items
 * @property showSubNav - Whether to show sub-navigation items (defaults to true if not specified)
 */
export interface NavSection {
  title: string;
  href: string;
  icon: React.ElementType;
  items: NavItem[];
  showSubNav?: boolean;
}

/**
 * Main Navigation Data
 * Defines the application's navigation structure including all sections and their sub-items
 */
export const navigationData: NavSection[] = [
  // Dashboard with sub-navigation
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    items: [
      {
        title: "Today",
        href: "/dashboard/today",
        icon: CalendarDays,
      },
      {
        title: "Daily Huddle",
        href: "/dashboard/daily-huddle",
        icon: Users,
      },
      {
        title: "Mission Control",
        href: "/dashboard/mission-control",
        icon: Activity,
      },
      {
        title: "Leaderboard",
        href: "/dashboard/leaderboard",
        icon: Trophy,
      },
    ],
  },
  // Schedule section with appointments and calendar management
  {
    title: "Schedule",
    href: "/schedule",
    icon: Calendar,
    items: [
      {
        title: "Calendar",
        href: "/schedule/calendar",
        icon: CalendarDays,
      },
      {
        title: "Capacity",
        href: "/schedule/capacity",
        icon: BarChart3,
      },
      {
        title: "Recalls",
        href: "/schedule/recalls",
        icon: RefreshCcw,
      },
      {
        title: "Waitlist",
        href: "/schedule/waitlist",
        icon: Clock,
      },
      {
        title: "Online Requests",
        href: "/schedule/online-booking",
        icon: BookOpen,
      },
    ],
  },
  // Patients section with patient management features
  // showSubNav is false since this navigation would be contextual
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
    showSubNav: false,
    items: [
      {
        title: "Patient Profile",
        href: "/patients/profile",
        icon: User,
      },
      {
        title: "Overview",
        href: "/patients/overview",
        icon: Activity,
      },
      {
        title: "Chart",
        href: "/patients/chart",
        icon: FileText,
      },
      {
        title: "Treatment Plans",
        href: "/patients/treatment-plans",
        icon: Clipboard,
      },
      {
        title: "Clinical Notes",
        href: "/patients/clinical-notes",
        icon: FileEdit,
      },
      {
        title: "Imaging",
        href: "/patients/imaging",
        icon: FileBarChart,
      },
      {
        title: "Lab Cases",
        href: "/patients/lab-cases",
        icon: Package,
      },
      {
        title: "Billing",
        href: "/patients/billing",
        icon: Receipt,
      },
      {
        title: "Ledger",
        href: "/patients/ledger",
        icon: Wallet,
      },
      {
        title: "Claims",
        href: "/patients/claims",
        icon: FileText,
      },
      {
        title: "Profile",
        href: "/patients/basic-profile",
        icon: UserCog,
      },
      {
        title: "Profile & Details",
        href: "/patients/profile-details",
        icon: UserCog,
      },
      {
        title: "Forms & Documents",
        href: "/patients/forms-documents",
        icon: FileText,
      },
      {
        title: "Communications",
        href: "/patients/communications",
        icon: MessageSquare,
      },
    ],
  },
  // Billing section with financial management
  {
    title: "Billing",
    href: "/billing",
    icon: Receipt,
    items: [
      {
        title: "Claims",
        href: "/billing/claims",
        icon: FileText,
        directPath: "/claims", // Direct route mapping
      },
      {
        title: "Payments",
        href: "/billing/payments",
        icon: CreditCard,
        directPath: "/payments", // Direct route mapping
      },
      {
        title: "Statements",
        href: "/billing/statements",
        icon: FileText,
        directPath: "/statements", // Direct route mapping
      },
      {
        title: "Collections",
        href: "/billing/collections",
        icon: Wallet,
        directPath: "/collections", // Direct route mapping
      },
      {
        title: "Fee Schedules",
        href: "/billing/fee-schedules",
        icon: FileText,
      },
    ],
  },
  // Reports section with analytics and reporting
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    items: [
      {
        title: "Financial Report",
        href: "/reports/financial",
        icon: LineChart,
      },
      {
        title: "Clinical Reports",
        href: "/reports/clinical",
        icon: Activity,
      },
      {
        title: "Operational Reports",
        href: "/reports/operational",
        icon: AreaChart,
      },
      {
        title: "Patient Reports",
        href: "/reports/patient",
        icon: Users,
      },
      {
        title: "Inventory Reports",
        href: "/reports/inventory",
        icon: Package,
      },
      {
        title: "Custom Reports",
        href: "/reports/custom",
        icon: PieChart,
      },
    ],
  },
];

// Default active section and sub-section for initial rendering
export const activeSection = navigationData[1]; // Schedule section 
export const activeSubSection = activeSection.items[0]; // Calendar
