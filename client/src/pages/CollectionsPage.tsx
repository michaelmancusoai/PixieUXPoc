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

  // Calculate totals
  const calculateTotals = () => {
    const totalDue = filteredAccounts.reduce((sum, account) => sum + account.totalDue, 0);
    const overDueActions = filteredAccounts.filter(account => {
      if (!account.nextAction.dueDate) return false;
      return isBefore(parseISO(account.nextAction.dueDate), new Date());
    }).length;
    const todaysActions = filteredAccounts.filter(account => {
      if (!account.nextAction.dueDate) return false;
      const actionDate = parseISO(account.nextAction.dueDate);
      const today = new Date();
      return (
        actionDate.getDate() === today.getDate() &&
        actionDate.getMonth() === today.getMonth() &&
        actionDate.getFullYear() === today.getFullYear()
      );
    }).length;

    return { totalDue, overDueActions, todaysActions };
  };

  const { totalDue, overDueActions, todaysActions } = calculateTotals();

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
          <h1 className="text-2xl font-bold mb-6">Collections Management</h1>

          {/* KPI Cards - based on specification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Accounts in Collections</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <PiggyBank className="h-8 w-8 mr-3 text-red-500" />
                  <div>
                    <div className="flex flex-col">
                      <div className="text-2xl font-bold">
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 mr-2">
                          {mockCollectionAccounts.filter(a => a.agingBucket === "91-120" || a.agingBucket === "120+").length}
                        </Badge>
                        <span className="text-red-500">${totalDue.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Balances {'>'}  90 days
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Collected This Month</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 mr-3 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold flex items-center">
                      $1,250.00
                      <span className="text-green-500 flex items-center ml-2 text-sm">
                        <ChevronDown className="h-4 w-4 rotate-180" />
                        8.5%
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">vs. last month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ultimate action or option</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button className="h-9 flex-1">
                      <Send className="h-4 w-4 mr-1" />
                      Send Final Notice
                    </Button>
                    <Button variant="outline" className="h-9 flex-1">
                      <PiggyBank className="h-4 w-4 mr-1" />
                      Create Payment Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Collection Accounts</CardTitle>
                <div className="flex space-x-2">
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