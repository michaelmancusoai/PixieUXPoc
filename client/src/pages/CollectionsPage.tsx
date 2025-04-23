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
  };
  nextAction: {
    type: "call" | "email" | "letter" | "none";
    dueDate: string | null;
    notes?: string;
  };
  phone?: string;
  email?: string;
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
      result: "No response"
    },
    nextAction: {
      type: "email",
      dueDate: "2025-04-30",
      notes: "Final notice before agency"
    },
    phone: "(555) 456-7890",
    email: "robert.brown@example.com",
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
      result: "Discussed payment plan"
    },
    nextAction: {
      type: "email",
      dueDate: "2025-04-25",
      notes: "Send payment plan details"
    },
    phone: "(555) 234-5678",
    email: "william.johnson@example.com",
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Total Outstanding</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 mr-3 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">${totalDue.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Current selection</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Action Items</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <BellRing className="h-8 w-8 mr-3 text-amber-500" />
                  <div>
                    <div className="flex flex-col">
                      <div className="text-lg font-medium">{todaysActions} due today</div>
                      <div className="text-md text-red-500 font-medium">{overDueActions} overdue</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center justify-between">
                  <Button className="h-9">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    New Collection
                  </Button>
                  <Button variant="outline" className="h-9">
                    <PhoneCall className="h-4 w-4 mr-1" />
                    Call List
                  </Button>
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
                  <Button variant="outline" size="sm" className="h-9">
                    <Download className="h-4 w-4 mr-1" />
                    Export
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
                          <TableRow 
                            key={account.id}
                            className={selectedAccounts.includes(account.id) ? "bg-muted/50" : ""}
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
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <PhoneCall className="h-4 w-4" />
                                <span className="sr-only">Call patient</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Button>
                            </TableCell>
                          </TableRow>
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