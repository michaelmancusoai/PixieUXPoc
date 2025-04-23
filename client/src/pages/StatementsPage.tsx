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
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

// Types
type Statement = {
  id: number;
  patientName: string;
  accountNumber: string;
  statementDate: string;
  dueDate: string;
  balance: number;
  previousBalance: number;
  newCharges: number;
  payments: number;
  adjustments: number;
  status: "Sent" | "Draft" | "Overdue" | "Paid";
  isElectronic: boolean;
  lastSentDate?: string;
  deliveryMethod?: "Email" | "Mail" | "Portal";
  emailAddress?: string;
  remindersSent?: number;
};

// Mock data
const mockStatements: Statement[] = [
  {
    id: 1,
    patientName: "Sarah Jonas",
    accountNumber: "ACC-1001",
    statementDate: "2025-04-01",
    dueDate: "2025-04-30",
    balance: 350.75,
    previousBalance: 525.25,
    newCharges: 0.00,
    payments: 175.50,
    adjustments: 0.00,
    status: "Sent",
    isElectronic: true,
    lastSentDate: "2025-04-02",
    deliveryMethod: "Email",
    emailAddress: "sarah.jonas@example.com",
    remindersSent: 0
  },
  {
    id: 2,
    patientName: "Robert Chen",
    accountNumber: "ACC-1002",
    statementDate: "2025-04-01",
    dueDate: "2025-04-30",
    balance: 215.00,
    previousBalance: 250.00,
    newCharges: 0.00,
    payments: 35.00,
    adjustments: 0.00,
    status: "Overdue",
    isElectronic: true,
    lastSentDate: "2025-04-02",
    deliveryMethod: "Email",
    emailAddress: "robert.chen@example.com",
    remindersSent: 1
  },
  {
    id: 3,
    patientName: "David Wilson",
    accountNumber: "ACC-1003",
    statementDate: "2025-04-01",
    dueDate: "2025-04-30",
    balance: 0.00,
    previousBalance: 500.00,
    newCharges: 0.00,
    payments: 500.00,
    adjustments: 0.00,
    status: "Paid",
    isElectronic: false,
    lastSentDate: "2025-04-02",
    deliveryMethod: "Mail",
    remindersSent: 0
  },
  {
    id: 4,
    patientName: "Emily Clark",
    accountNumber: "ACC-1004",
    statementDate: "2025-04-15",
    dueDate: "2025-05-15",
    balance: 275.00,
    previousBalance: 125.00,
    newCharges: 150.00,
    payments: 0.00,
    adjustments: 0.00,
    status: "Draft",
    isElectronic: true,
    deliveryMethod: "Email",
    emailAddress: "emily.clark@example.com"
  },
  {
    id: 5,
    patientName: "Kelly Martinez",
    accountNumber: "ACC-1005",
    statementDate: "2025-04-01",
    dueDate: "2025-04-30",
    balance: 325.75,
    previousBalance: 550.50,
    newCharges: 0.00,
    payments: 225.75,
    adjustments: 0.00,
    status: "Sent",
    isElectronic: true,
    lastSentDate: "2025-04-02",
    deliveryMethod: "Portal",
    remindersSent: 0
  },
  {
    id: 6,
    patientName: "Marcus Lee",
    accountNumber: "ACC-1006",
    statementDate: "2025-04-01",
    dueDate: "2025-04-30",
    balance: 0.00,
    previousBalance: 75.50,
    newCharges: 0.00,
    payments: 75.50,
    adjustments: 0.00,
    status: "Paid",
    isElectronic: false,
    lastSentDate: "2025-04-02",
    deliveryMethod: "Mail",
    remindersSent: 0
  },
  {
    id: 7,
    patientName: "Victoria Kim",
    accountNumber: "ACC-1007",
    statementDate: "2025-04-01",
    dueDate: "2025-04-30",
    balance: 450.00,
    previousBalance: 900.00,
    newCharges: 0.00,
    payments: 450.00,
    adjustments: 0.00,
    status: "Overdue",
    isElectronic: true,
    lastSentDate: "2025-04-02",
    deliveryMethod: "Email",
    emailAddress: "victoria.kim@example.com",
    remindersSent: 2
  },
  {
    id: 8,
    patientName: "Thomas Wright",
    accountNumber: "ACC-1008",
    statementDate: "2025-04-15",
    dueDate: "2025-05-15",
    balance: 425.00,
    previousBalance: 350.00,
    newCharges: 75.00,
    payments: 0.00,
    adjustments: 0.00,
    status: "Draft",
    isElectronic: true,
    deliveryMethod: "Email",
    emailAddress: "thomas.wright@example.com"
  },
  {
    id: 9,
    patientName: "Serena Johnson",
    accountNumber: "ACC-1009",
    statementDate: "2025-04-01",
    dueDate: "2025-04-30",
    balance: 350.00,
    previousBalance: 700.00,
    newCharges: 0.00,
    payments: 350.00,
    adjustments: 0.00,
    status: "Sent",
    isElectronic: false,
    lastSentDate: "2025-04-02",
    deliveryMethod: "Mail",
    remindersSent: 0
  },
  {
    id: 10,
    patientName: "Alex Rodriguez",
    accountNumber: "ACC-1010",
    statementDate: "2025-04-01",
    dueDate: "2025-04-30",
    balance: 0.00,
    previousBalance: 125.00,
    newCharges: 0.00,
    payments: 125.00,
    adjustments: 0.00,
    status: "Paid",
    isElectronic: true,
    lastSentDate: "2025-04-02",
    deliveryMethod: "Email",
    emailAddress: "alex.rodriguez@example.com",
    remindersSent: 0
  }
];

// Filter options
const statementStatuses = [
  "All Statuses",
  "Sent",
  "Draft",
  "Overdue",
  "Paid"
];

const deliveryMethods = [
  "All Methods",
  "Email",
  "Mail",
  "Portal"
];

export default function StatementsPage() {
  // State
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedStatements, setSelectedStatements] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showInsights, setShowInsights] = useState(false);
  const [filters, setFilters] = useState({
    status: "All Statuses",
    deliveryMethod: "All Methods",
  });

  // Get filtered statements
  const getFilteredStatements = () => {
    let filtered = [...mockStatements];

    // Apply tab filters
    if (selectedTab === "sent") {
      filtered = filtered.filter(statement => statement.status === "Sent");
    } else if (selectedTab === "draft") {
      filtered = filtered.filter(statement => statement.status === "Draft");
    } else if (selectedTab === "overdue") {
      filtered = filtered.filter(statement => statement.status === "Overdue");
    } else if (selectedTab === "paid") {
      filtered = filtered.filter(statement => statement.status === "Paid");
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(statement =>
        statement.patientName.toLowerCase().includes(query) ||
        statement.accountNumber.toLowerCase().includes(query) ||
        (statement.emailAddress && statement.emailAddress.toLowerCase().includes(query))
      );
    }

    // Apply date range filter (statement date)
    if (dateRange?.from) {
      const from = dateRange.from;
      filtered = filtered.filter(statement => {
        const statementDate = new Date(statement.statementDate);
        return statementDate >= from;
      });
    }

    if (dateRange?.to) {
      const to = dateRange.to;
      filtered = filtered.filter(statement => {
        const statementDate = new Date(statement.statementDate);
        const endOfDay = new Date(new Date(to).setHours(23, 59, 59, 999));
        return statementDate <= endOfDay;
      });
    }

    // Apply dropdown filters
    if (filters.status !== "All Statuses") {
      filtered = filtered.filter(statement => statement.status === filters.status);
    }
    
    if (filters.deliveryMethod !== "All Methods") {
      filtered = filtered.filter(statement => statement.deliveryMethod === filters.deliveryMethod);
    }

    return filtered;
  };

  const filteredStatements = getFilteredStatements();

  // Calculate totals
  const calculateTotals = () => {
    const totalOutstanding = filteredStatements.reduce((sum, statement) => {
      if (statement.status !== "Paid") {
        return sum + statement.balance;
      }
      return sum;
    }, 0);

    const totalOverdue = filteredStatements.filter(s => s.status === "Overdue")
      .reduce((sum, statement) => sum + statement.balance, 0);

    const draftCount = filteredStatements.filter(s => s.status === "Draft").length;

    return { totalOutstanding, totalOverdue, draftCount };
  };

  const { totalOutstanding, totalOverdue, draftCount } = calculateTotals();

  // Handle row checkbox click
  const handleRowSelect = (id: number) => {
    setSelectedStatements(prev => {
      if (prev.includes(id)) {
        return prev.filter(statementId => statementId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedStatements.length === filteredStatements.length) {
      setSelectedStatements([]);
    } else {
      setSelectedStatements(filteredStatements.map(statement => statement.id));
    }
  };
  
  // Toggle row expansion
  const toggleRowExpand = (id: number, e: React.MouseEvent) => {
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

  // Render statement status badge
  const renderStatusBadge = (status: Statement["status"]) => {
    switch (status) {
      case "Sent":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case "Draft":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "Overdue":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      case "Paid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <DollarSign className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
    }
  };

  // Render delivery method icon
  const renderDeliveryMethodIcon = (method?: Statement["deliveryMethod"]) => {
    switch (method) {
      case "Email":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "Mail":
        return <FileText className="h-4 w-4 text-amber-500" />;
      case "Portal":
        return <Globe className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-muted">
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Statements Management</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Current Statements</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 mr-3 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">${totalOutstanding.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      {filteredStatements.filter(s => s.status !== "Paid").length} active statements
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{filteredStatements.filter(s => s.status === "Draft").length}</div>
                    <div className="text-xs text-muted-foreground">Drafts</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{filteredStatements.filter(s => s.status === "Sent").length}</div>
                    <div className="text-xs text-muted-foreground">Sent</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-red-500">{filteredStatements.filter(s => s.status === "Overdue").length}</div>
                    <div className="text-xs text-muted-foreground">Overdue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Statement Activity</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 mr-3 text-amber-500" />
                  <div>
                    <div className="text-2xl font-bold">${totalOverdue.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Overdue amount</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">7 days</div>
                    <div className="text-xs text-muted-foreground">Avg time to pay</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">68%</div>
                    <div className="text-xs text-muted-foreground">E-statement adoption</div>
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
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="h-9 w-full">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      New Statement
                    </Button>
                    <Button variant="outline" className="h-9 w-full">
                      <Send className="h-4 w-4 mr-1" />
                      Send Reminders
                    </Button>
                    <Button variant="outline" className="h-9 w-full">
                      <Download className="h-4 w-4 mr-1" />
                      Export Report
                    </Button>
                    {draftCount > 0 && (
                      <Button variant="outline" className="h-9 w-full">
                        <Send className="h-4 w-4 mr-1" />
                        Send {draftCount} Draft{draftCount > 1 ? 's' : ''}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center">
                  <CardTitle>Statement Records</CardTitle>
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
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-9"
                    disabled={selectedStatements.length === 0}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send Selected
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9"
                    disabled={selectedStatements.length === 0}
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
                  <h3 className="text-md font-medium mb-2">Statement Insights</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    There are {filteredStatements.filter(s => s.status === "Overdue").length} overdue statements totaling ${totalOverdue.toFixed(2)}. E-statements have a 42% higher timely payment rate.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-md border shadow-sm">
                      <h4 className="text-sm font-medium mb-1">Payment Rate by Delivery Method</h4>
                      <div className="flex justify-between items-end">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">Email</span>
                            <span className="text-xs font-medium">76%</span>
                          </div>
                          <div className="h-2 w-40 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '76%' }}></div>
                          </div>
                        </div>
                        <Mail className="h-5 w-5 text-blue-500 ml-2" />
                      </div>
                      <div className="flex justify-between items-end mt-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">Portal</span>
                            <span className="text-xs font-medium">65%</span>
                          </div>
                          <div className="h-2 w-40 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        <Globe className="h-5 w-5 text-purple-500 ml-2" />
                      </div>
                      <div className="flex justify-between items-end mt-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">Mail</span>
                            <span className="text-xs font-medium">34%</span>
                          </div>
                          <div className="h-2 w-40 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '34%' }}></div>
                          </div>
                        </div>
                        <FileText className="h-5 w-5 text-amber-500 ml-2" />
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md border shadow-sm">
                      <h4 className="text-sm font-medium mb-1">Statement Metrics</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded-md">
                          <div className="text-xs text-muted-foreground">Avg. Time to Pay</div>
                          <div className="text-xl font-bold text-blue-600">12 days</div>
                          <div className="text-xs text-blue-600">from receipt</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-md">
                          <div className="text-xs text-muted-foreground">Collection Rate</div>
                          <div className="text-xl font-bold text-green-600">94%</div>
                          <div className="text-xs text-green-600">within 60 days</div>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-md">
                          <div className="text-xs text-muted-foreground">Avg. Statement</div>
                          <div className="text-xl font-bold text-amber-600">$285</div>
                          <div className="text-xs text-amber-600">per invoice</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-md">
                          <div className="text-xs text-muted-foreground">E-Statement</div>
                          <div className="text-xl font-bold text-purple-600">68%</div>
                          <div className="text-xs text-purple-600">adoption rate</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-md border shadow-sm">
                      <h4 className="text-sm font-medium mb-1">Recommended Actions</h4>
                      <ul className="text-xs space-y-2">
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
                            <AlertCircle className="h-3 w-3 text-red-500" />
                          </div>
                          <div>
                            <span className="font-medium block">Send reminder to overdue accounts</span>
                            <span className="text-muted-foreground">{filteredStatements.filter(s => s.status === "Overdue").length} accounts, ${totalOverdue.toFixed(2)} total</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                            <Mail className="h-3 w-3 text-blue-500" />
                          </div>
                          <div>
                            <span className="font-medium block">Switch to e-statements</span>
                            <span className="text-muted-foreground">32% of patients still use paper</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                            <DollarSign className="h-3 w-3 text-green-500" />
                          </div>
                          <div>
                            <span className="font-medium block">Offer payment options</span>
                            <span className="text-muted-foreground">For balances over $400</span>
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
                      All Statements {renderTabBadge(mockStatements.length)}
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Sent {renderTabBadge(mockStatements.filter(s => s.status === "Sent").length)}
                    </TabsTrigger>
                    <TabsTrigger value="draft" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Draft {renderTabBadge(mockStatements.filter(s => s.status === "Draft").length)}
                    </TabsTrigger>
                    <TabsTrigger value="overdue" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Overdue {renderTabBadge(mockStatements.filter(s => s.status === "Overdue").length)}
                    </TabsTrigger>
                    <TabsTrigger value="paid" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Paid {renderTabBadge(mockStatements.filter(s => s.status === "Paid").length)}
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Filter bar */}
                <div className="flex flex-wrap justify-between items-center px-6 py-4 bg-card border-b">
                  <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                    {/* Statement Status Filter */}
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters({ ...filters, status: value })}
                    >
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statementStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Delivery Method Filter */}
                    <Select
                      value={filters.deliveryMethod}
                      onValueChange={(value) => setFilters({ ...filters, deliveryMethod: value })}
                    >
                      <SelectTrigger className="w-[160px] h-9">
                        <SelectValue placeholder="Delivery Method" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Date Range Picker */}
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
                            <span>Statement date range</span>
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
                {(filters.status !== "All Statuses" || filters.deliveryMethod !== "All Methods" || dateRange?.from) && (
                  <div className="flex items-center gap-2 px-6 py-2 bg-card border-b text-sm">
                    <span className="text-muted-foreground">Filtered results: {filteredStatements.length}</span>
                    
                    {filters.status !== "All Statuses" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Status: {filters.status} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, status: "All Statuses" })} />
                      </Badge>
                    )}
                    
                    {filters.deliveryMethod !== "All Methods" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Method: {filters.deliveryMethod} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, deliveryMethod: "All Methods" })} />
                      </Badge>
                    )}
                    
                    {dateRange?.from && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Date: {format(dateRange.from, "MMM d")} {dateRange.to && `- ${format(dateRange.to, "MMM d")}`}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setDateRange(undefined)} />
                      </Badge>
                    )}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedStatements.length === filteredStatements.length && filteredStatements.length > 0}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all statements"
                            className={filteredStatements.length === 0 ? "invisible" : ""}
                          />
                        </TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStatements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                            No statement records found with the current filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStatements.map((statement) => (
                          <React.Fragment key={statement.id}>
                            <TableRow 
                              className={selectedStatements.includes(statement.id) ? "bg-muted/50" : ""}
                            >
                              <TableCell>
                                <Checkbox 
                                  checked={selectedStatements.includes(statement.id)} 
                                  onCheckedChange={() => handleRowSelect(statement.id)}
                                  aria-label={`Select statement for ${statement.patientName}`}
                                />
                              </TableCell>
                              <TableCell>
                                {format(new Date(statement.statementDate), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                {statement.accountNumber}
                              </TableCell>
                              <TableCell className="font-medium">{statement.patientName}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {renderDeliveryMethodIcon(statement.deliveryMethod)}
                                  <span className="ml-2">{statement.deliveryMethod}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${statement.balance.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {renderStatusBadge(statement.status)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-1">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Printer className="h-4 w-4" />
                                    <span className="sr-only">Print statement</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View statement details</span>
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 ml-2"
                                    onClick={(e) => toggleRowExpand(statement.id, e)}
                                  >
                                    {expandedRows.includes(statement.id) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">Expand details</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            
                            {expandedRows.includes(statement.id) && (
                              <TableRow className="bg-muted/30 border-t-0">
                                <TableCell colSpan={8} className="p-0">
                                  <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                      {/* Basic Information */}
                                      <Card className="shadow-sm">
                                        <CardHeader className="py-3 px-4 border-b">
                                          <CardTitle className="text-sm font-medium">Statement Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-3 px-4 text-sm">
                                          <div className="space-y-2">
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Account:</div>
                                              <div className="col-span-2">{statement.accountNumber}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Date:</div>
                                              <div className="col-span-2">{format(new Date(statement.statementDate), "MMM d, yyyy")}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Due Date:</div>
                                              <div className="col-span-2">{format(new Date(statement.dueDate), "MMM d, yyyy")}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Status:</div>
                                              <div className="col-span-2">{renderStatusBadge(statement.status)}</div>
                                            </div>
                                            {statement.lastSentDate && (
                                              <div className="grid grid-cols-3 gap-1">
                                                <div className="text-muted-foreground">Last Sent:</div>
                                                <div className="col-span-2">{format(new Date(statement.lastSentDate), "MMM d, yyyy")}</div>
                                              </div>
                                            )}
                                            {statement.remindersSent !== undefined && (
                                              <div className="grid grid-cols-3 gap-1">
                                                <div className="text-muted-foreground">Reminders:</div>
                                                <div className="col-span-2">{statement.remindersSent}</div>
                                              </div>
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                      
                                      {/* Financial Summary */}
                                      <Card className="shadow-sm">
                                        <CardHeader className="py-3 px-4 border-b">
                                          <CardTitle className="text-sm font-medium">Financial Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-3 px-4 text-sm">
                                          <div className="space-y-2">
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Previous Balance:</div>
                                              <div className="col-span-2">${statement.previousBalance.toFixed(2)}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">New Charges:</div>
                                              <div className="col-span-2">${statement.newCharges.toFixed(2)}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Payments:</div>
                                              <div className="col-span-2">${statement.payments.toFixed(2)}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Adjustments:</div>
                                              <div className="col-span-2">${statement.adjustments.toFixed(2)}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1 pt-2 border-t font-medium">
                                              <div className="text-muted-foreground">Current Balance:</div>
                                              <div className="col-span-2">${statement.balance.toFixed(2)}</div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                      
                                      {/* Delivery Information */}
                                      <Card className="shadow-sm">
                                        <CardHeader className="py-3 px-4 border-b">
                                          <CardTitle className="text-sm font-medium">Delivery Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="py-3 px-4 text-sm">
                                          <div className="space-y-2">
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Patient:</div>
                                              <div className="col-span-2">{statement.patientName}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Method:</div>
                                              <div className="col-span-2 flex items-center">
                                                {renderDeliveryMethodIcon(statement.deliveryMethod)}
                                                <span className="ml-2">{statement.deliveryMethod}</span>
                                              </div>
                                            </div>
                                            {statement.emailAddress && (
                                              <div className="grid grid-cols-3 gap-1">
                                                <div className="text-muted-foreground">Email:</div>
                                                <div className="col-span-2">{statement.emailAddress}</div>
                                              </div>
                                            )}
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Electronic:</div>
                                              <div className="col-span-2">{statement.isElectronic ? "Yes" : "No"}</div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                    
                                    {/* Action buttons */}
                                    <div className="flex justify-end space-x-2 mt-4">
                                      <Button variant="outline" size="sm">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Resend Statement
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print Statement
                                      </Button>
                                      <Button variant="default" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Full Statement
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