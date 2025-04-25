import React, { useState } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  XCircle,
  PlusCircle,
  DollarSign,
  Printer,
  Download,
  Eye,
  ChevronRight,
  Calendar,
  X,
  CalendarRange,
  ChevronsUpDown,
  FileText,
  Mail,
  Send,
  RefreshCw,
  PhoneCall,
  MessageSquare,
  BellRing,
  User,
  Phone,
  MapPin,
  AtSign,
  ShieldCheck,
  Activity,
  CalendarClock,
  CircleCheck,
  FileEdit,
  History,
  CreditCard,
  MoreHorizontal,
  PiggyBank,
  UserCircle,
} from "lucide-react";
import { format, addDays, addMonths, isAfter, parseISO, isBefore } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

// Types
type CollectionAccount = {
  id: number;
  patientName: string;
  accountNumber: string;
  lastPaymentDate: string | null;
  totalDue: number;
  agingBucket: "0-30" | "31-60" | "61-90" | "91-120" | "120+";
  lastAction: {
    type: "call" | "email" | "letter" | "none";
    date: string | null;
    result?: string;
    notes?: string;
  };
  nextAction: {
    type: "call" | "email" | "letter" | "none";
    dueDate: string | null;
    notes?: string;
  };
  phone?: string;
  email?: string;
  address?: string;
  insuranceInfo?: string;
  paymentHistory?: {
    date: string;
    amount: number;
    method: string;
  }[];
  notes?: string[];
  status: "New" | "In Progress" | "Scheduled Payment" | "Sent to Agency" | "Hold";
  priority: "Low" | "Medium" | "High";
};

// Mock data
const mockCollectionAccounts: CollectionAccount[] = [
  {
    id: 1,
    patientName: "James Wilson",
    accountNumber: "ACC-2001",
    lastPaymentDate: "2025-01-15",
    totalDue: 750.25,
    agingBucket: "91-120",
    lastAction: {
      type: "call",
      date: "2025-04-10",
      result: "Left voicemail"
    },
    nextAction: {
      type: "call",
      dueDate: "2025-04-24",
      notes: "Follow up on payment plan options"
    },
    phone: "(555) 123-4567",
    email: "james.wilson@example.com",
    status: "In Progress",
    priority: "High"
  },
  {
    id: 2,
    patientName: "Emma Garcia",
    accountNumber: "ACC-2002",
    lastPaymentDate: "2025-02-03",
    totalDue: 320.50,
    agingBucket: "61-90",
    lastAction: {
      type: "email",
      date: "2025-04-05",
      result: "No response"
    },
    nextAction: {
      type: "call",
      dueDate: "2025-04-25",
      notes: "Discuss payment options"
    },
    phone: "(555) 987-6543",
    email: "emma.garcia@example.com",
    status: "New",
    priority: "Medium"
  },
  {
    id: 3,
    patientName: "Robert Brown",
    accountNumber: "ACC-2003",
    lastPaymentDate: null,
    totalDue: 1250.75,
    agingBucket: "120+",
    lastAction: {
      type: "letter",
      date: "2025-03-25",
      result: "No response",
      notes: "Sent formal letter with payment options and financial assistance information."
    },
    nextAction: {
      type: "email",
      dueDate: "2025-04-30",
      notes: "Final notice before agency"
    },
    phone: "(555) 456-7890",
    email: "robert.brown@example.com",
    address: "123 Main St, Apt 4B, Anytown, CA 90210",
    insuranceInfo: "Delta Dental - Policy #DD98765 - Coverage 80/20",
    paymentHistory: [
      { date: "2024-09-15", amount: 250.00, method: "Credit Card" },
      { date: "2024-07-20", amount: 125.50, method: "Check" }
    ],
    notes: [
      "2025-03-01: Patient mentioned financial hardship due to recent job loss.",
      "2025-02-15: Requested itemized statement of all procedures.",
      "2025-01-10: Disputed charge for x-rays, claiming insurance should have covered."
    ],
    status: "In Progress",
    priority: "High"
  },
  {
    id: 4,
    patientName: "Sophia Martinez",
    accountNumber: "ACC-2004",
    lastPaymentDate: "2025-03-10",
    totalDue: 175.40,
    agingBucket: "31-60",
    lastAction: {
      type: "call",
      date: "2025-04-12",
      result: "Promised to pay next week"
    },
    nextAction: {
      type: "call",
      dueDate: "2025-04-26",
      notes: "Verify payment received"
    },
    phone: "(555) 789-0123",
    email: "sophia.martinez@example.com",
    status: "Scheduled Payment",
    priority: "Low"
  },
  {
    id: 5,
    patientName: "William Johnson",
    accountNumber: "ACC-2005",
    lastPaymentDate: "2024-12-05",
    totalDue: 2100.00,
    agingBucket: "120+",
    lastAction: {
      type: "call",
      date: "2025-04-08",
      result: "Discussed payment plan",
      notes: "Patient agreed to a 12-month payment plan at $175/month. First payment due May 1st."
    },
    nextAction: {
      type: "email",
      dueDate: "2025-04-25",
      notes: "Send payment plan details and agreement for electronic signature."
    },
    phone: "(555) 234-5678",
    email: "william.johnson@example.com",
    address: "456 Oak Avenue, Unit 7C, Metropolis, NY 10001",
    insuranceInfo: "Cigna Dental - Policy #CD112233 - Coverage 70/30 - Annual Max $1,500 (Reached)",
    paymentHistory: [
      { date: "2024-12-05", amount: 300.00, method: "Check" },
      { date: "2024-10-12", amount: 500.00, method: "Bank Transfer" },
      { date: "2024-08-30", amount: 200.00, method: "Credit Card" }
    ],
    notes: [
      "2025-04-08: Patient open to payment plan and requested digital copy of all invoices.",
      "2025-03-22: Called to discuss balance, patient experiencing temporary financial setback, but committed to paying balance.",
      "2025-02-15: Reviewed insurance coverage with patient, explained annual maximum reached.",
      "2025-01-20: Patient asked about financing options."
    ],
    status: "In Progress",
    priority: "High"
  },
  {
    id: 6,
    patientName: "Olivia Lee",
    accountNumber: "ACC-2006",
    lastPaymentDate: "2025-02-20",
    totalDue: 560.30,
    agingBucket: "61-90",
    lastAction: {
      type: "email",
      date: "2025-04-15",
      result: "Responded, needs financial assistance info"
    },
    nextAction: {
      type: "email",
      dueDate: "2025-04-22",
      notes: "Send financial assistance application"
    },
    phone: "(555) 345-6789",
    email: "olivia.lee@example.com",
    status: "Hold",
    priority: "Medium"
  },
  {
    id: 7,
    patientName: "Daniel Clark",
    accountNumber: "ACC-2007",
    lastPaymentDate: null,
    totalDue: 950.80,
    agingBucket: "91-120",
    lastAction: {
      type: "letter",
      date: "2025-03-30",
      result: "Mail returned undeliverable"
    },
    nextAction: {
      type: "call",
      dueDate: "2025-04-23",
      notes: "Verify contact information"
    },
    phone: "(555) 876-5432",
    email: "daniel.clark@example.com",
    status: "Sent to Agency",
    priority: "High"
  },
  {
    id: 8,
    patientName: "Isabella Rodriguez",
    accountNumber: "ACC-2008",
    lastPaymentDate: "2025-03-25",
    totalDue: 215.75,
    agingBucket: "0-30",
    lastAction: {
      type: "none",
      date: null
    },
    nextAction: {
      type: "email",
      dueDate: "2025-04-28",
      notes: "Send payment reminder"
    },
    phone: "(555) 654-3210",
    email: "isabella.rodriguez@example.com",
    status: "New",
    priority: "Low"
  },
  {
    id: 9,
    patientName: "Michael Taylor",
    accountNumber: "ACC-2009",
    lastPaymentDate: "2025-01-30",
    totalDue: 825.40,
    agingBucket: "91-120",
    lastAction: {
      type: "call",
      date: "2025-04-05",
      result: "Requested hardship consideration"
    },
    nextAction: {
      type: "call",
      dueDate: "2025-04-25",
      notes: "Review hardship application status"
    },
    phone: "(555) 321-0987",
    email: "michael.taylor@example.com",
    status: "Hold",
    priority: "Medium"
  },
  {
    id: 10,
    patientName: "Charlotte Lewis",
    accountNumber: "ACC-2010",
    lastPaymentDate: "2024-11-15",
    totalDue: 1750.60,
    agingBucket: "120+",
    lastAction: {
      type: "letter",
      date: "2025-04-01",
      result: "Final notice sent"
    },
    nextAction: {
      type: "call",
      dueDate: "2025-04-22",
      notes: "Final attempt before agency referral"
    },
    phone: "(555) 432-1098",
    email: "charlotte.lewis@example.com",
    status: "In Progress",
    priority: "High"
  }
];

// Filter options
const accountStatusOptions = [
  "All Statuses",
  "New",
  "In Progress",
  "Scheduled Payment",
  "Sent to Agency",
  "Hold"
];

const priorityOptions = [
  "All Priorities",
  "High",
  "Medium",
  "Low"
];

const agingBucketOptions = [
  "All Ages",
  "0-30",
  "31-60",
  "61-90",
  "91-120",
  "120+"
];

const actionTypeOptions = [
  "All Actions",
  "call",
  "email",
  "letter",
  "none"
];

export default function CollectionsPage() {
  // State
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showInsights, setShowInsights] = useState(false);
  const [filters, setFilters] = useState({
    status: "All Statuses",
    priority: "All Priorities",
    agingBucket: "All Ages",
    nextActionType: "All Actions",
  });

  // Get filtered collection accounts
  const getFilteredAccounts = () => {
    let filtered = [...mockCollectionAccounts];

    // Apply tab filters
    if (selectedTab === "high") {
      filtered = filtered.filter(account => account.priority === "High");
    } else if (selectedTab === "overdue") {
      filtered = filtered.filter(account => {
        // Overdue actions are those with a next action due date in the past
        if (!account.nextAction.dueDate) return false;
        return isBefore(parseISO(account.nextAction.dueDate), new Date());
      });
    } else if (selectedTab === "today") {
      filtered = filtered.filter(account => {
        // Today's actions are those with a next action due date today
        if (!account.nextAction.dueDate) return false;
        const actionDate = parseISO(account.nextAction.dueDate);
        const today = new Date();
        return (
          actionDate.getDate() === today.getDate() &&
          actionDate.getMonth() === today.getMonth() &&
          actionDate.getFullYear() === today.getFullYear()
        );
      });
    } else if (selectedTab === "agency") {
      filtered = filtered.filter(account => account.status === "Sent to Agency");
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(account =>
        account.patientName.toLowerCase().includes(query) ||
        account.accountNumber.toLowerCase().includes(query) ||
        (account.email && account.email.toLowerCase().includes(query)) ||
        (account.phone && account.phone.toLowerCase().includes(query))
      );
    }

    // Apply date range filter (next action due date)
    if (dateRange?.from) {
      const from = dateRange.from;
      filtered = filtered.filter(account => {
        if (!account.nextAction.dueDate) return false;
        const actionDate = parseISO(account.nextAction.dueDate);
        return actionDate >= from;
      });
    }

    if (dateRange?.to) {
      const to = dateRange.to;
      filtered = filtered.filter(account => {
        if (!account.nextAction.dueDate) return false;
        const actionDate = parseISO(account.nextAction.dueDate);
        const endOfDay = new Date(new Date(to).setHours(23, 59, 59, 999));
        return actionDate <= endOfDay;
      });
    }

    // Apply dropdown filters
    if (filters.status !== "All Statuses") {
      filtered = filtered.filter(account => account.status === filters.status);
    }
    
    if (filters.priority !== "All Priorities") {
      filtered = filtered.filter(account => account.priority === filters.priority);
    }
    
    if (filters.agingBucket !== "All Ages") {
      filtered = filtered.filter(account => account.agingBucket === filters.agingBucket);
    }
    
    if (filters.nextActionType !== "All Actions") {
      filtered = filtered.filter(account => account.nextAction.type === filters.nextActionType);
    }

    return filtered;
  };

  const filteredAccounts = getFilteredAccounts();

  // Calculate action-oriented metrics for behavioral KPIs
  const calculateRecoveryMetrics = () => {
    const today = new Date();
    
    // 1. No Next Action - accounts without any scheduled next action or with "none" as next action type
    const noNextAction = filteredAccounts.filter(account => 
      !account.nextAction.dueDate || account.nextAction.type === "none"
    );
    const noNextActionCount = noNextAction.length;
    const noNextActionValue = noNextAction.reduce((sum, account) => sum + account.totalDue, 0);
    
    // 2. Ripest 30-day Window - accounts with payments due in next 30 days
    const nextMonthDate = addDays(today, 30);
    const ripestWindow = filteredAccounts.filter(account => {
      if (!account.nextAction.dueDate) return false;
      const dueDate = parseISO(account.nextAction.dueDate);
      return isAfter(dueDate, today) && isBefore(dueDate, nextMonthDate);
    });
    const ripestWindowValue = ripestWindow.reduce((sum, account) => sum + account.totalDue, 0);
    
    // 3. Broken Promises - payment plans that slipped yesterday
    const yesterday = addDays(today, -1);
    const brokenPromises = filteredAccounts.filter(account => {
      if (!account.nextAction.dueDate) return false;
      if (account.status !== "Scheduled Payment") return false;
      
      const dueDate = parseISO(account.nextAction.dueDate);
      return (
        dueDate.getDate() === yesterday.getDate() &&
        dueDate.getMonth() === yesterday.getMonth() &&
        dueDate.getFullYear() === yesterday.getFullYear()
      );
    });
    const brokenPromisesCount = brokenPromises.length;
    
    // 4. At-Risk Plans - payment plans with next installment due in 3 days
    const threeDaysFromNow = addDays(today, 3);
    const atRiskPlans = filteredAccounts.filter(account => {
      if (!account.nextAction.dueDate) return false;
      if (account.status !== "Scheduled Payment") return false;
      
      const dueDate = parseISO(account.nextAction.dueDate);
      return (
        dueDate.getDate() === threeDaysFromNow.getDate() &&
        dueDate.getMonth() === threeDaysFromNow.getMonth() &&
        dueDate.getFullYear() === threeDaysFromNow.getFullYear()
      );
    });
    const atRiskPlansValue = atRiskPlans.reduce((sum, account) => sum + account.totalDue, 0);
    
    // 5. Escalate or Settle - accounts > 120 days & <$200
    const escalateOrSettle = filteredAccounts.filter(account => 
      account.agingBucket === "120+" && account.totalDue < 200
    );
    const escalateOrSettleCount = escalateOrSettle.length;
    
    // These are the legacy metrics we're keeping for compatibility
    const totalDue = filteredAccounts.reduce((sum, account) => sum + account.totalDue, 0);
    const overDueActions = filteredAccounts.filter(account => {
      if (!account.nextAction.dueDate) return false;
      return isBefore(parseISO(account.nextAction.dueDate), new Date());
    }).length;
    const todaysActions = filteredAccounts.filter(account => {
      if (!account.nextAction.dueDate) return false;
      const actionDate = parseISO(account.nextAction.dueDate);
      return (
        actionDate.getDate() === today.getDate() &&
        actionDate.getMonth() === today.getMonth() &&
        actionDate.getFullYear() === today.getFullYear()
      );
    }).length;

    return { 
      totalDue, 
      overDueActions, 
      todaysActions,
      noNextAction,
      noNextActionCount,
      noNextActionValue,
      ripestWindow,
      ripestWindowValue,
      brokenPromises,
      brokenPromisesCount,
      atRiskPlans,
      atRiskPlansValue,
      escalateOrSettle,
      escalateOrSettleCount
    };
  };

  const { 
    totalDue, 
    overDueActions, 
    todaysActions,
    noNextActionCount,
    noNextActionValue,
    ripestWindowValue,
    brokenPromisesCount,
    atRiskPlansValue,
    escalateOrSettleCount
  } = calculateRecoveryMetrics();

  // Handle row checkbox click
  const handleRowSelect = (id: number) => {
    setSelectedAccounts(prev => {
      if (prev.includes(id)) {
        return prev.filter(accountId => accountId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedAccounts.length === filteredAccounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(filteredAccounts.map(account => account.id));
    }
  };
  
  // Toggle expand/collapse row
  const toggleRowExpand = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Render count badge for tabs
  const renderTabBadge = (count: number) => (
    <Badge variant="outline" className="ml-2 bg-muted text-muted-foreground">
      {count}
    </Badge>
  );

  // Render priority badge
  const renderPriorityBadge = (priority: CollectionAccount["priority"]) => {
    switch (priority) {
      case "High":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case "Medium":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        );
      case "Low":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Low
          </Badge>
        );
    }
  };

  // Render status badge
  const renderStatusBadge = (status: CollectionAccount["status"]) => {
    switch (status) {
      case "New":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            New
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            In Progress
          </Badge>
        );
      case "Scheduled Payment":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Scheduled Payment
          </Badge>
        );
      case "Sent to Agency":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            Sent to Agency
          </Badge>
        );
      case "Hold":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            Hold
          </Badge>
        );
    }
  };

  // Render action type icon
  const renderActionTypeIcon = (type: CollectionAccount["lastAction"]["type"]) => {
    switch (type) {
      case "call":
        return <PhoneCall className="h-4 w-4 text-blue-500" />;
      case "email":
        return <Mail className="h-4 w-4 text-amber-500" />;
      case "letter":
        return <FileText className="h-4 w-4 text-purple-500" />;
      case "none":
      default:
        return null;
    }
  };

  // Format date with "None" fallback
  const formatDateOrNone = (dateString: string | null) => {
    return dateString ? format(parseISO(dateString), "MMM d, yyyy") : "None";
  };

  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-muted">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Collections Management</h1>
            
            {/* Quick Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9">
                  Quick Actions <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <Send className="h-4 w-4 mr-2" />
                  Send Final Notice
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <PiggyBank className="h-4 w-4 mr-2" />
                  Create Payment Plan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Action-Oriented KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* No Next Action Card */}
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">No Next Action</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${noNextActionCount > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                    <XCircle className={`h-6 w-6 ${noNextActionCount > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold flex items-center">
                      ${noNextActionValue.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {noNextActionCount > 0 ? 
                        `${noNextActionCount} accts - abandoned` : 
                        'All accounts have next steps'}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                    disabled={noNextActionCount === 0}>
                    <FileEdit className="h-4 w-4 mr-2" />
                    Create Tasks
                  </Button>
                  {noNextActionCount > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground text-center">
                      These accounts are silent — give them a voice
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Ripest 30-day Window Card */}
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Ripest 30-day Window</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold flex items-center">
                      ${ripestWindowValue.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      possible with scheduled calls
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div className="h-full bg-green-500 rounded-full"  
                         style={{ width: `${Math.min((ripestWindowValue / 5000) * 100, 100)}%` }}>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">$0</span>
                    <span className="text-muted-foreground">$2.5k</span>
                    <span className="text-muted-foreground">$5k</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Call List (auto-sort)
                  </Button>
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="ghost"
                      size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      Send payment portal link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Two-card row with smaller metrics */}
            <div className="grid grid-cols-1 gap-6">
              {/* Broken Promises Card */}
              <Card className="shadow-sm">
                <CardHeader className="py-3 px-5 border-b">
                  <CardTitle className="text-base font-medium">Broken Promises Today</CardTitle>
                </CardHeader>
                <CardContent className="py-4 px-5">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${brokenPromisesCount > 0 ? 'bg-amber-100' : 'bg-gray-100'}`}>
                      <AlertCircle className={`h-6 w-6 ${brokenPromisesCount > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {brokenPromisesCount} plan{brokenPromisesCount !== 1 && 's'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {brokenPromisesCount > 0 ? 'slipped yesterday' : 'All plans on track'}
                      </div>
                    </div>
                  </div>
                  {brokenPromisesCount > 0 && (
                    <div className="mt-3 flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Retry cards
                      </Button>
                      <Button variant="ghost" size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* At-Risk Plans Card */}
              <Card className="shadow-sm">
                <CardHeader className="py-3 px-5 border-b">
                  <CardTitle className="text-base font-medium">Payment-Plan At-Risk</CardTitle>
                </CardHeader>
                <CardContent className="py-4 px-5">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Clock className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        ${atRiskPlansValue.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        due in 3 days
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Pre-emptive reminder SMS
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Second row with Escalate or Settle card */}
          <div className="mb-6">
            <Card className="shadow-sm max-w-md">
              <CardHeader className="py-3 px-5 border-b">
                <CardTitle className="text-base font-medium">Escalate or Settle</CardTitle>
              </CardHeader>
              <CardContent className="py-4 px-5">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${escalateOrSettleCount > 0 ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    <RefreshCw className={`h-6 w-6 ${escalateOrSettleCount > 0 ? 'text-purple-500' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {escalateOrSettleCount} acct{escalateOrSettleCount !== 1 && 's'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {escalateOrSettleCount > 0 ? 
                        '>120 days, <$200 each' : 
                        'No small, aged accounts'}
                    </div>
                  </div>
                </div>
                {escalateOrSettleCount > 0 && (
                  <div className="mt-3 flex">
                    <Button variant="default" size="sm" className="flex-1">
                      <MoreHorizontal className="h-4 w-4 mr-1" />
                      Write-off vs. Agency
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center">
                  <CardTitle>Collection Accounts</CardTitle>
                  <div className="ml-4 flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">
                      Show Insights
                    </span>
                    <Switch 
                      id="show-insights" 
                      className="data-[state=checked]:bg-blue-500" 
                      checked={showInsights}
                      onCheckedChange={setShowInsights}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  <Button variant="outline" size="sm" className="h-9">
                    <Activity className="h-4 w-4 mr-1" />
                    Collection Report
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-9"
                    disabled={selectedAccounts.length === 0}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contact Selected
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9"
                    disabled={selectedAccounts.length === 0}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print Selected
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {/* Insights Panel - Toggled by the switch */}
            {showInsights && (
              <div className="p-6 border-b bg-blue-50/50">
                <div className="mb-4">
                  <h3 className="text-md font-medium mb-2">Collection Insights</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    13 accounts representing $9,640 have had no contact in the last 30 days. This constitutes 62% of your outstanding collections.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-md border shadow-sm">
                      <h4 className="text-sm font-medium mb-1">Success Rate by Contact Method</h4>
                      <div className="flex justify-between items-end">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">Phone calls</span>
                            <span className="text-xs font-medium">68%</span>
                          </div>
                          <div className="h-2 w-40 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                        </div>
                        <Phone className="h-5 w-5 text-green-500 ml-2" />
                      </div>
                      <div className="flex justify-between items-end mt-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">Email</span>
                            <span className="text-xs font-medium">42%</span>
                          </div>
                          <div className="h-2 w-40 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
                          </div>
                        </div>
                        <Mail className="h-5 w-5 text-blue-500 ml-2" />
                      </div>
                      <div className="flex justify-between items-end mt-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">Letters</span>
                            <span className="text-xs font-medium">21%</span>
                          </div>
                          <div className="h-2 w-40 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '21%' }}></div>
                          </div>
                        </div>
                        <FileText className="h-5 w-5 text-amber-500 ml-2" />
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md border shadow-sm">
                      <h4 className="text-sm font-medium mb-1">Payment Plans Performance</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold">82%</div>
                          <div className="text-xs text-muted-foreground">adherence rate</div>
                        </div>
                        <div className="h-16 w-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div className="flex justify-between mb-1">
                          <span>Active plans:</span>
                          <span className="font-medium">14</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly collected:</span>
                          <span className="font-medium">$2,350</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md border shadow-sm">
                      <h4 className="text-sm font-medium mb-1">Recommended Actions</h4>
                      <ul className="text-xs space-y-2">
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                            <PhoneCall className="h-3 w-3 text-red-500" />
                          </div>
                          <div>
                            <span className="font-medium block">Call accounts {'>'} 90 days</span>
                            <span className="text-muted-foreground">7 accounts, $5,120 total</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-2 mt-0.5">
                            <Mail className="h-3 w-3 text-amber-500" />
                          </div>
                          <div>
                            <span className="font-medium block">Email payment reminders</span>
                            <span className="text-muted-foreground">12 accounts due this week</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                            <PiggyBank className="h-3 w-3 text-blue-500" />
                          </div>
                          <div>
                            <span className="font-medium block">Offer payment plans</span>
                            <span className="text-muted-foreground">5 accounts {'>'} $800</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
                <div className="border-b px-6 py-3">
                  <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                    <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      All Accounts {renderTabBadge(mockCollectionAccounts.length)}
                    </TabsTrigger>
                    <TabsTrigger value="high" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      High Priority {renderTabBadge(mockCollectionAccounts.filter(account => account.priority === "High").length)}
                    </TabsTrigger>
                    <TabsTrigger value="today" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Due Today {renderTabBadge(todaysActions)}
                    </TabsTrigger>
                    <TabsTrigger value="overdue" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Overdue {renderTabBadge(overDueActions)}
                    </TabsTrigger>
                    <TabsTrigger value="agency" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Agency {renderTabBadge(mockCollectionAccounts.filter(account => account.status === "Sent to Agency").length)}
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Filter bar */}
                <div className="flex flex-wrap justify-between items-center px-6 py-4 bg-card border-b">
                  <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                    {/* Status Filter */}
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters({ ...filters, status: value })}
                    >
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Priority Filter */}
                    <Select
                      value={filters.priority}
                      onValueChange={(value) => setFilters({ ...filters, priority: value })}
                    >
                      <SelectTrigger className="w-[160px] h-9">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Aging Filter */}
                    <Select
                      value={filters.agingBucket}
                      onValueChange={(value) => setFilters({ ...filters, agingBucket: value })}
                    >
                      <SelectTrigger className="w-[130px] h-9">
                        <SelectValue placeholder="Aging" />
                      </SelectTrigger>
                      <SelectContent>
                        {agingBucketOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Next Action Type Filter */}
                    <Select
                      value={filters.nextActionType}
                      onValueChange={(value) => setFilters({ ...filters, nextActionType: value })}
                    >
                      <SelectTrigger className="w-[160px] h-9">
                        <SelectValue placeholder="Next Action" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option === "call" ? "Call" :
                              option === "email" ? "Email" :
                              option === "letter" ? "Letter" :
                              option === "none" ? "None" :
                              option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Due Date Range Picker */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[240px] h-9 justify-start text-left font-normal"
                        >
                          <CalendarRange className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange?.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Action due date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patient or account"
                      className="pl-9 pr-4 h-9 w-full md:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filter chips */}
                {(filters.status !== "All Statuses" || 
                  filters.priority !== "All Priorities" || 
                  filters.agingBucket !== "All Ages" || 
                  filters.nextActionType !== "All Actions" ||
                  dateRange?.from) && (
                  <div className="flex items-center gap-2 px-6 py-2 bg-card border-b text-sm">
                    <span className="text-muted-foreground">Filtered results: {filteredAccounts.length}</span>
                    
                    {filters.status !== "All Statuses" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.status} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, status: "All Statuses" })} />
                      </Badge>
                    )}
                    
                    {filters.priority !== "All Priorities" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.priority} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, priority: "All Priorities" })} />
                      </Badge>
                    )}
                    
                    {filters.agingBucket !== "All Ages" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.agingBucket} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, agingBucket: "All Ages" })} />
                      </Badge>
                    )}
                    
                    {filters.nextActionType !== "All Actions" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.nextActionType === "call" ? "Call" :
                         filters.nextActionType === "email" ? "Email" :
                         filters.nextActionType === "letter" ? "Letter" :
                         filters.nextActionType === "none" ? "None" :
                         filters.nextActionType} 
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, nextActionType: "All Actions" })} />
                      </Badge>
                    )}
                    
                    {dateRange?.from && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {format(dateRange.from, "MMM d, yyyy")} 
                        {dateRange?.to && <> - {format(dateRange.to, "MMM d, yyyy")}</>}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDateRange(undefined);
                          }} 
                        />
                      </Badge>
                    )}
                    
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => {
                      setFilters({
                        status: "All Statuses",
                        priority: "All Priorities",
                        agingBucket: "All Ages",
                        nextActionType: "All Actions"
                      });
                      setDateRange(undefined);
                    }}>
                      Clear all
                    </Button>
                  </div>
                )}

                {/* Selected accounts count */}
                {selectedAccounts.length > 0 && (
                  <div className="px-6 py-2 bg-card border-b text-sm">
                    <span>{selectedAccounts.length} out of {filteredAccounts.length} selected</span>
                  </div>
                )}

                {/* Collections table */}
                <div className="w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox 
                            checked={filteredAccounts.length > 0 && selectedAccounts.length === filteredAccounts.length} 
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all accounts"
                          />
                        </TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Aging</TableHead>
                        <TableHead className="text-right">Amount Due</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Action</TableHead>
                        <TableHead>Next Action</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAccounts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                            No collection accounts found with the current filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAccounts.map((account) => (
                          <React.Fragment key={account.id}>
                            <TableRow 
                              className={`${selectedAccounts.includes(account.id) ? "bg-muted/50" : ""} ${expandedRows.includes(account.id) ? "border-b-0" : ""}`}
                            >
                              <TableCell>
                                <Checkbox 
                                  checked={selectedAccounts.includes(account.id)} 
                                  onCheckedChange={() => handleRowSelect(account.id)}
                                  aria-label={`Select account for ${account.patientName}`}
                                />
                              </TableCell>
                              <TableCell>
                                {account.accountNumber}
                              </TableCell>
                              <TableCell className="font-medium">{account.patientName}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  account.agingBucket === "0-30" ? "outline" :
                                  account.agingBucket === "31-60" ? "outline" :
                                  account.agingBucket === "61-90" ? "outline" :
                                  account.agingBucket === "91-120" ? "outline" :
                                  "outline"
                                } className={
                                  account.agingBucket === "0-30" ? "bg-green-50 text-green-600 border-green-200" :
                                  account.agingBucket === "31-60" ? "bg-blue-50 text-blue-600 border-blue-200" :
                                  account.agingBucket === "61-90" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                  account.agingBucket === "91-120" ? "bg-orange-50 text-orange-600 border-orange-200" :
                                  "bg-red-50 text-red-600 border-red-200"
                                }>
                                  {account.agingBucket}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${account.totalDue.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {renderPriorityBadge(account.priority)}
                              </TableCell>
                              <TableCell>
                                {renderStatusBadge(account.status)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {account.lastAction.date ? (
                                    <>
                                      {renderActionTypeIcon(account.lastAction.type)}
                                      <span className="ml-2 whitespace-nowrap">{formatDateOrNone(account.lastAction.date)}</span>
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">None</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {account.nextAction.dueDate ? (
                                    <>
                                      {renderActionTypeIcon(account.nextAction.type)}
                                      <span className={`ml-2 whitespace-nowrap ${
                                        isBefore(parseISO(account.nextAction.dueDate), new Date()) 
                                          ? "text-red-600 font-medium" 
                                          : ""
                                      }`}>
                                        {formatDateOrNone(account.nextAction.dueDate)}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">None</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-1">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <PhoneCall className="h-4 w-4" />
                                    <span className="sr-only">Call patient</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Mail className="h-4 w-4" />
                                    <span className="sr-only">Email patient</span>
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 ml-2"
                                    onClick={(e) => toggleRowExpand(account.id, e)}
                                  >
                                    {expandedRows.includes(account.id) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">Expand details</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            
                            {/* Expanded details row */}
                            {expandedRows.includes(account.id) && (
                              <TableRow className="bg-muted/30 border-t-0">
                                <TableCell colSpan={10} className="p-0">
                                  <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                      {/* Contact Information */}
                                      <Card className="shadow-sm">
                                        <CardHeader className="py-3 px-4 border-b">
                                          <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-3 px-4 text-sm">
                                          <div className="space-y-2">
                                            <div className="flex items-center">
                                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                              <div>{account.patientName}</div>
                                            </div>
                                            {account.phone && (
                                              <div className="flex items-center">
                                                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <div>{account.phone}</div>
                                              </div>
                                            )}
                                            {account.email && (
                                              <div className="flex items-center">
                                                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <div>{account.email}</div>
                                              </div>
                                            )}
                                            {account.address && (
                                              <div className="flex items-start">
                                                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                                                <div>{account.address}</div>
                                              </div>
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                      
                                      {/* Insurance Information */}
                                      <Card className="shadow-sm">
                                        <CardHeader className="py-3 px-4 border-b">
                                          <CardTitle className="text-sm font-medium">Insurance Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-3 px-4 text-sm">
                                          {account.insuranceInfo ? (
                                            <div className="flex items-start">
                                              <ShieldCheck className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                                              <div>{account.insuranceInfo}</div>
                                            </div>
                                          ) : (
                                            <div className="text-muted-foreground italic">No insurance information available</div>
                                          )}
                                        </CardContent>
                                      </Card>
                                      
                                      {/* Last Action Details */}
                                      <Card className="shadow-sm">
                                        <CardHeader className="py-3 px-4 border-b">
                                          <CardTitle className="text-sm font-medium">Last Action Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-3 px-4 text-sm">
                                          {account.lastAction.date ? (
                                            <div className="space-y-2">
                                              <div className="flex items-center">
                                                <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <div>{formatDateOrNone(account.lastAction.date)}</div>
                                              </div>
                                              <div className="flex items-center">
                                                <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <div>
                                                  {account.lastAction.type === "call" ? "Phone Call" :
                                                   account.lastAction.type === "email" ? "Email" :
                                                   account.lastAction.type === "letter" ? "Letter" : "None"}
                                                </div>
                                              </div>
                                              {account.lastAction.result && (
                                                <div className="flex items-start">
                                                  <CircleCheck className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                                                  <div>{account.lastAction.result}</div>
                                                </div>
                                              )}
                                              {account.lastAction.notes && (
                                                <div className="flex items-start">
                                                  <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                                                  <div>{account.lastAction.notes}</div>
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="text-muted-foreground italic">No previous actions recorded</div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </div>
                                    
                                    {/* Payment History */}
                                    {account.paymentHistory && account.paymentHistory.length > 0 && (
                                      <Card className="shadow-sm mb-4">
                                        <CardHeader className="py-3 px-4 border-b">
                                          <CardTitle className="text-sm font-medium">Payment History</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Method</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {account.paymentHistory.map((payment, idx) => (
                                                <TableRow key={idx}>
                                                  <TableCell>{format(parseISO(payment.date), "MMM d, yyyy")}</TableCell>
                                                  <TableCell>{payment.method}</TableCell>
                                                  <TableCell className="text-right font-medium">${payment.amount.toFixed(2)}</TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </CardContent>
                                      </Card>
                                    )}
                                    
                                    {/* Notes */}
                                    {account.notes && account.notes.length > 0 && (
                                      <Card className="shadow-sm mb-4">
                                        <CardHeader className="py-3 px-4 border-b">
                                          <CardTitle className="text-sm font-medium">Account Notes</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-3 px-4">
                                          <div className="space-y-3">
                                            {account.notes.map((note, idx) => (
                                              <div key={idx} className="pb-3 border-b last:border-0 last:pb-0">
                                                <p>{note}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    
                                    {/* Action buttons */}
                                    <div className="flex justify-end space-x-2 mt-4">
                                      <Button variant="outline" size="sm">
                                        <FileEdit className="h-4 w-4 mr-2" />
                                        Add Note
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Payment Plan
                                      </Button>
                                      <Button variant="default" size="sm">
                                        <PhoneCall className="h-4 w-4 mr-2" />
                                        Contact Patient
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </NavigationWrapper>
  );
}