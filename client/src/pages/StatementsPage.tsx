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
  "All",
  "Sent",
  "Draft",
  "Overdue",
  "Paid"
];

const deliveryMethods = [
  "All",
  "Email",
  "Mail",
  "Portal"
];

export default function StatementsPage() {
  // State
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedStatements, setSelectedStatements] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filters, setFilters] = useState({
    status: "All",
    deliveryMethod: "All",
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
    if (filters.status !== "All") {
      filtered = filtered.filter(statement => statement.status === filters.status);
    }
    
    if (filters.deliveryMethod !== "All") {
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
                <CardTitle className="text-base font-medium">Outstanding Balance</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 mr-3 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">${totalOutstanding.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Current selection</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Overdue Amount</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 mr-3 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold">${totalOverdue.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Requires immediate action</div>
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
                    New Statement
                  </Button>
                  {draftCount > 0 && (
                    <Button variant="outline" className="h-9">
                      <Send className="h-4 w-4 mr-1" />
                      Send {draftCount} Draft{draftCount > 1 ? 's' : ''}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Statement Records</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-9"
                    disabled={selectedStatements.length === 0}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send Selected
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Generate Statements
                  </Button>
                </div>
              </div>
            </CardHeader>

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
                {(filters.status !== "All" || filters.deliveryMethod !== "All" || dateRange?.from) && (
                  <div className="flex items-center gap-2 px-6 py-2 bg-card border-b text-sm">
                    <span className="text-muted-foreground">Filtered results: {filteredStatements.length}</span>
                    
                    {filters.status !== "All" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.status} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, status: "All" })} />
                      </Badge>
                    )}
                    
                    {filters.deliveryMethod !== "All" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.deliveryMethod} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, deliveryMethod: "All" })} />
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
                        status: "All",
                        deliveryMethod: "All"
                      });
                      setDateRange(undefined);
                    }}>
                      Clear all
                    </Button>
                  </div>
                )}

                {/* Selected statements count */}
                {selectedStatements.length > 0 && (
                  <div className="px-6 py-2 bg-card border-b text-sm">
                    <span>{selectedStatements.length} out of {filteredStatements.length} selected</span>
                  </div>
                )}

                {/* Statements table */}
                <div className="w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox 
                            checked={filteredStatements.length > 0 && selectedStatements.length === filteredStatements.length} 
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all statements"
                          />
                        </TableHead>
                        <TableHead className="w-[110px]">Date</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Delivery</TableHead>
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
                          <TableRow 
                            key={statement.id}
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
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                <a href="#" onClick={(e) => {
                                  e.preventDefault();
                                  // View statement details
                                }}>
                                  <span className="sr-only">View statement details</span>
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Printer className="h-4 w-4" />
                                <span className="sr-only">Print statement</span>
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