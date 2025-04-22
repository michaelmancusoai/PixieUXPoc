import {
  Calendar,
  Clock,
  CalendarDays,
  BookOpen,
  Users,
  Receipt,
  BarChart3,
  Settings,
  FileText,
  CreditCard,
  FileBarChart,
  LineChart,
  AreaChart,
  PieChart,
  Activity,
  Cog,
  Shield,
  Calendar as CalendarIcon,
  UserCog,
  Wallet,
  MessageSquare,
  Package,
  Building,
  RefreshCcw,
  LockKeyhole,
  User,
  FileEdit,
  Clipboard
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export interface NavSection {
  title: string;
  href: string;
  icon: React.ElementType;
  items: NavItem[];
}

export const navigationData: NavSection[] = [
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
        title: "Appointment Book View",
        href: "/schedule/appointment-book",
        icon: Calendar,
      },
      {
        title: "Find Appointment",
        href: "/schedule/find-appointment",
        icon: CalendarIcon,
      },
      {
        title: "Waitlist",
        href: "/schedule/waitlist",
        icon: Clock,
      },
      {
        title: "Online Booking Requests",
        href: "/schedule/online-booking",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
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
  {
    title: "Billing",
    href: "/billing",
    icon: Receipt,
    items: [
      {
        title: "Claims",
        href: "/billing/claims",
        icon: FileText,
      },
      {
        title: "Payments",
        href: "/billing/payments",
        icon: CreditCard,
      },
      {
        title: "Statements",
        href: "/billing/statements",
        icon: FileText,
      },
      {
        title: "Collections",
        href: "/billing/collections",
        icon: Wallet,
      },
      {
        title: "Fee Schedules",
        href: "/billing/fee-schedules",
        icon: FileText,
      },
    ],
  },
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
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    items: [
      {
        title: "Practice Profile",
        href: "/settings/practice-profile",
        icon: Building,
      },
      {
        title: "Team & Security",
        href: "/settings/team-security",
        icon: Shield,
      },
      {
        title: "Scheduling",
        href: "/settings/scheduling",
        icon: Calendar,
      },
      {
        title: "Clinical",
        href: "/settings/clinical",
        icon: Activity,
      },
      {
        title: "Billing & Payments",
        href: "/settings/billing-payments",
        icon: Receipt,
      },
      {
        title: "Communications",
        href: "/settings/communications",
        icon: MessageSquare,
      },
      {
        title: "Inventory",
        href: "/settings/inventory",
        icon: Package,
      },
      {
        title: "Practice Finances",
        href: "/settings/practice-finances",
        icon: Wallet,
      },
      {
        title: "AI Automation Agents",
        href: "/settings/ai-automation",
        icon: RefreshCcw,
      },
      {
        title: "Integrations",
        href: "/settings/integrations",
        icon: Cog,
      },
      {
        title: "Subscription",
        href: "/settings/subscription",
        icon: CreditCard,
      },
      {
        title: "Data & Logs",
        href: "/settings/data-logs",
        icon: FileBarChart,
      },
      {
        title: "Referral Management",
        href: "/settings/referral-management",
        icon: Users,
      },
    ],
  },
];

export const activeSection = navigationData[0]; // Schedule
export const activeSubSection = activeSection.items[0]; // Calendar
