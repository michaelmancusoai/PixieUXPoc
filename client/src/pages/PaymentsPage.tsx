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
  CreditCard,
  Plus,
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
} from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

// Types
type Payment = {
  id: number;
  patientName: string;
  date: string;
  amount: number;
  paymentMethod: "Credit Card" | "Cash" | "Check" | "Other";
  cardType?: "Visa" | "Mastercard" | "Amex" | "Discover";
  lastFour?: string;
  checkNumber?: string;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  paymentFor: "Treatment" | "Consultation" | "Products" | "Insurance";
  description: string;
  paymentProcessor?: "Stripe" | "Square" | "PayPal" | "Manual";
  transactionId?: string;
};

// Mock data
const mockPayments: Payment[] = [
  {
    id: 1,
    patientName: "Sarah Jonas",
    date: "2025-04-22",
    amount: 175.50,
    paymentMethod: "Credit Card",
    cardType: "Visa",
    lastFour: "4242",
    status: "Completed",
    paymentFor: "Treatment",
    description: "Invisalign - Monthly Payment",
    paymentProcessor: "Stripe",
    transactionId: "txn_1Oi4sSKj38fKBUGy9ixB1Qrs"
  },
  {
    id: 2,
    patientName: "Robert Chen",
    date: "2025-04-21",
    amount: 35.00,
    paymentMethod: "Cash",
    status: "Completed",
    paymentFor: "Products",
    description: "Dental hygiene products"
  },
  {
    id: 3,
    patientName: "David Wilson",
    date: "2025-04-20",
    amount: 500.00,
    paymentMethod: "Credit Card",
    cardType: "Mastercard",
    lastFour: "5678",
    status: "Completed",
    paymentFor: "Treatment",
    description: "Crown procedure - Partial payment",
    paymentProcessor: "Square",
    transactionId: "sqr_52fKBR8sjso29xB1Qrs"
  },
  {
    id: 4,
    patientName: "Emily Clark",
    date: "2025-04-20",
    amount: 150.00,
    paymentMethod: "Check",
    checkNumber: "3857",
    status: "Pending",
    paymentFor: "Consultation",
    description: "Initial consultation"
  },
  {
    id: 5,
    patientName: "Kelly Martinez",
    date: "2025-04-19",
    amount: 225.75,
    paymentMethod: "Credit Card",
    cardType: "Amex",
    lastFour: "7890",
    status: "Failed",
    paymentFor: "Treatment",
    description: "Periodontal scaling",
    paymentProcessor: "Stripe",
    transactionId: "txn_2Oj5tTLk49gLCVHz0jyC2Rst"
  },
  {
    id: 6,
    patientName: "Marcus Lee",
    date: "2025-04-18",
    amount: 75.50,
    paymentMethod: "Credit Card",
    cardType: "Visa",
    lastFour: "1234",
    status: "Refunded",
    paymentFor: "Products",
    description: "Electric toothbrush - returned",
    paymentProcessor: "PayPal",
    transactionId: "ppl_39fLCV0jyHz2RstC"
  },
  {
    id: 7,
    patientName: "Victoria Kim",
    date: "2025-04-18",
    amount: 450.00,
    paymentMethod: "Credit Card",
    cardType: "Visa",
    lastFour: "9876",
    status: "Completed",
    paymentFor: "Treatment",
    description: "Root canal treatment",
    paymentProcessor: "Stripe",
    transactionId: "txn_3Pi6uUMk40hMDWIz1kyD3Suv"
  },
  {
    id: 8,
    patientName: "Thomas Wright",
    date: "2025-04-17",
    amount: 75.00,
    paymentMethod: "Cash",
    status: "Completed",
    paymentFor: "Consultation",
    description: "Follow-up consultation"
  },
  {
    id: 9,
    patientName: "Serena Johnson",
    date: "2025-04-17",
    amount: 350.00,
    paymentMethod: "Check",
    checkNumber: "4920",
    status: "Completed",
    paymentFor: "Treatment",
    description: "Dental implant - Partial payment"
  },
  {
    id: 10,
    patientName: "Alex Rodriguez",
    date: "2025-04-16",
    amount: 125.00,
    paymentMethod: "Credit Card",
    cardType: "Discover",
    lastFour: "5432",
    status: "Completed",
    paymentFor: "Treatment",
    description: "Dental cleaning",
    paymentProcessor: "Square",
    transactionId: "sqr_64gMCS9tju40zC2Stu"
  }
];

// Filter options
const paymentMethods = [
  "All",
  "Credit Card",
  "Cash",
  "Check",
  "Other"
];

const paymentStatuses = [
  "All",
  "Completed",
  "Pending",
  "Failed",
  "Refunded"
];

const paymentTypes = [
  "All",
  "Treatment",
  "Consultation",
  "Products",
  "Insurance"
];

export default function PaymentsPage() {
  // State
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filters, setFilters] = useState({
    paymentMethod: "All",
    paymentStatus: "All",
    paymentType: "All",
  });

  // Get filtered payments
  const getFilteredPayments = () => {
    let filtered = [...mockPayments];

    // Apply tab filters
    if (selectedTab === "completed") {
      filtered = filtered.filter(payment => payment.status === "Completed");
    } else if (selectedTab === "pending") {
      filtered = filtered.filter(payment => payment.status === "Pending");
    } else if (selectedTab === "failed") {
      filtered = filtered.filter(payment => payment.status === "Failed");
    } else if (selectedTab === "refunded") {
      filtered = filtered.filter(payment => payment.status === "Refunded");
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.patientName.toLowerCase().includes(query) ||
        payment.description.toLowerCase().includes(query) ||
        (payment.paymentProcessor && payment.paymentProcessor.toLowerCase().includes(query))
      );
    }

    // Apply date range filter
    if (dateRange?.from) {
      const from = dateRange.from;
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= from;
      });
    }

    if (dateRange?.to) {
      const to = dateRange.to;
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date);
        const endOfDay = new Date(new Date(to).setHours(23, 59, 59, 999));
        return paymentDate <= endOfDay;
      });
    }

    // Apply dropdown filters
    if (filters.paymentMethod !== "All") {
      filtered = filtered.filter(payment => payment.paymentMethod === filters.paymentMethod);
    }
    
    if (filters.paymentStatus !== "All") {
      filtered = filtered.filter(payment => payment.status === filters.paymentStatus);
    }
    
    if (filters.paymentType !== "All") {
      filtered = filtered.filter(payment => payment.paymentFor === filters.paymentType);
    }

    return filtered;
  };

  const filteredPayments = getFilteredPayments();

  // Calculate totals
  const calculateTotals = () => {
    const total = filteredPayments.reduce((sum, payment) => {
      if (payment.status === "Completed") {
        return sum + payment.amount;
      }
      return sum;
    }, 0);

    const totalPending = filteredPayments.filter(p => p.status === "Pending")
      .reduce((sum, payment) => sum + payment.amount, 0);

    return { total, totalPending };
  };

  const { total, totalPending } = calculateTotals();

  // Handle row checkbox click
  const handleRowSelect = (id: number) => {
    setSelectedPayments(prev => {
      if (prev.includes(id)) {
        return prev.filter(paymentId => paymentId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map(payment => payment.id));
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

  // Render payment status badge
  const renderStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "Pending":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "Failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "Refunded":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Refunded
          </Badge>
        );
    }
  };

  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-muted">
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Payments Management</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Total Received</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 mr-3 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">${total.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Current selection</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="py-4 px-5 border-b">
                <CardTitle className="text-base font-medium">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent className="py-6 px-5">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 mr-3 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Awaiting processing</div>
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
                    New Payment
                  </Button>
                  <Button variant="outline" className="h-9">
                    <Download className="h-4 w-4 mr-1" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Payment Records</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-9"
                    disabled={selectedPayments.length === 0}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print Selected
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <Plus className="h-4 w-4 mr-1" />
                    Record Payment
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
                <div className="border-b px-6 py-3">
                  <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                    <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      All Payments {renderTabBadge(mockPayments.length)}
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Completed {renderTabBadge(mockPayments.filter(p => p.status === "Completed").length)}
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Pending {renderTabBadge(mockPayments.filter(p => p.status === "Pending").length)}
                    </TabsTrigger>
                    <TabsTrigger value="failed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Failed {renderTabBadge(mockPayments.filter(p => p.status === "Failed").length)}
                    </TabsTrigger>
                    <TabsTrigger value="refunded" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Refunded {renderTabBadge(mockPayments.filter(p => p.status === "Refunded").length)}
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Filter bar */}
                <div className="flex flex-wrap justify-between items-center px-6 py-4 bg-card border-b">
                  <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                    {/* Payment Method Filter */}
                    <Select
                      value={filters.paymentMethod}
                      onValueChange={(value) => setFilters({ ...filters, paymentMethod: value })}
                    >
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Payment Status Filter */}
                    <Select
                      value={filters.paymentStatus}
                      onValueChange={(value) => setFilters({ ...filters, paymentStatus: value })}
                    >
                      <SelectTrigger className="w-[160px] h-9">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Payment Type Filter */}
                    <Select
                      value={filters.paymentType}
                      onValueChange={(value) => setFilters({ ...filters, paymentType: value })}
                    >
                      <SelectTrigger className="w-[160px] h-9">
                        <SelectValue placeholder="Payment Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                            <span>Pick a date range</span>
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
                      placeholder="Search patient or payment"
                      className="pl-9 pr-4 h-9 w-full md:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filter chips */}
                {(filters.paymentMethod !== "All" || filters.paymentStatus !== "All" || filters.paymentType !== "All" || dateRange?.from) && (
                  <div className="flex items-center gap-2 px-6 py-2 bg-card border-b text-sm">
                    <span className="text-muted-foreground">Filtered results: {filteredPayments.length}</span>
                    
                    {filters.paymentMethod !== "All" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.paymentMethod} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, paymentMethod: "All" })} />
                      </Badge>
                    )}
                    
                    {filters.paymentStatus !== "All" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.paymentStatus} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, paymentStatus: "All" })} />
                      </Badge>
                    )}
                    
                    {filters.paymentType !== "All" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.paymentType} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, paymentType: "All" })} />
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
                        paymentMethod: "All",
                        paymentStatus: "All",
                        paymentType: "All"
                      });
                      setDateRange(undefined);
                    }}>
                      Clear all
                    </Button>
                  </div>
                )}

                {/* Selected payments count */}
                {selectedPayments.length > 0 && (
                  <div className="px-6 py-2 bg-card border-b text-sm">
                    <span>{selectedPayments.length} out of {filteredPayments.length} selected</span>
                  </div>
                )}

                {/* Payments table */}
                <div className="w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox 
                            checked={filteredPayments.length > 0 && selectedPayments.length === filteredPayments.length} 
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all payments"
                          />
                        </TableHead>
                        <TableHead className="w-[110px]">Date</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Payment For</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                            No payment records found with the current filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <React.Fragment key={payment.id}>
                            <TableRow 
                              className={selectedPayments.includes(payment.id) ? "bg-muted/50" : ""}
                            >
                            <TableCell>
                              <Checkbox 
                                checked={selectedPayments.includes(payment.id)} 
                                onCheckedChange={() => handleRowSelect(payment.id)}
                                aria-label={`Select payment for ${payment.patientName}`}
                              />
                            </TableCell>
                            <TableCell>
                              {format(new Date(payment.date), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell className="font-medium">{payment.patientName}</TableCell>
                            <TableCell>{payment.paymentFor}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {payment.paymentMethod === "Credit Card" && (
                                  <>
                                    <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                                    <span>{payment.cardType} •••• {payment.lastFour}</span>
                                  </>
                                )}
                                {payment.paymentMethod === "Cash" && (
                                  <>
                                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                    <span>Cash</span>
                                  </>
                                )}
                                {payment.paymentMethod === "Check" && (
                                  <>
                                    <div className="h-4 w-4 mr-2 flex items-center justify-center text-amber-500">
                                      <span className="text-xs font-bold">CH</span>
                                    </div>
                                    <span>Check #{payment.checkNumber}</span>
                                  </>
                                )}
                                {payment.paymentMethod === "Other" && (
                                  <span>Other</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${payment.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {renderStatusBadge(payment.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View payment details</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Printer className="h-4 w-4" />
                                  <span className="sr-only">Print receipt</span>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 ml-1"
                                  onClick={(e) => toggleRowExpand(payment.id, e)}
                                >
                                  {expandedRows.includes(payment.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Expand details</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          
                          {expandedRows.includes(payment.id) && (
                            <TableRow className="bg-muted/30 border-t-0">
                              <TableCell colSpan={8} className="p-0">
                                <div className="p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    {/* Payment Information */}
                                    <Card className="shadow-sm">
                                      <CardHeader className="py-3 px-4 border-b">
                                        <CardTitle className="text-sm font-medium">Payment Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="py-3 px-4 text-sm">
                                        <div className="space-y-2">
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-muted-foreground">Date:</div>
                                            <div className="col-span-2">{format(new Date(payment.date), "MMM d, yyyy")}</div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-muted-foreground">Amount:</div>
                                            <div className="col-span-2 font-medium">${payment.amount.toFixed(2)}</div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-muted-foreground">Status:</div>
                                            <div className="col-span-2">{renderStatusBadge(payment.status)}</div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-muted-foreground">Description:</div>
                                            <div className="col-span-2">{payment.description}</div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-muted-foreground">Category:</div>
                                            <div className="col-span-2">{payment.paymentFor}</div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    {/* Payment Method Details */}
                                    <Card className="shadow-sm">
                                      <CardHeader className="py-3 px-4 border-b">
                                        <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
                                      </CardHeader>
                                      <CardContent className="py-3 px-4 text-sm">
                                        <div className="space-y-2">
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-muted-foreground">Method:</div>
                                            <div className="col-span-2">{payment.paymentMethod}</div>
                                          </div>
                                          
                                          {payment.paymentMethod === "Credit Card" && (
                                            <>
                                              <div className="grid grid-cols-3 gap-1">
                                                <div className="text-muted-foreground">Card Type:</div>
                                                <div className="col-span-2">{payment.cardType}</div>
                                              </div>
                                              {payment.lastFour && (
                                                <div className="grid grid-cols-3 gap-1">
                                                  <div className="text-muted-foreground">Last 4 Digits:</div>
                                                  <div className="col-span-2">•••• {payment.lastFour}</div>
                                                </div>
                                              )}
                                            </>
                                          )}
                                          
                                          {payment.paymentMethod === "Check" && payment.checkNumber && (
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Check Number:</div>
                                              <div className="col-span-2">{payment.checkNumber}</div>
                                            </div>
                                          )}
                                          
                                          {payment.paymentProcessor && (
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Processor:</div>
                                              <div className="col-span-2">{payment.paymentProcessor}</div>
                                            </div>
                                          )}
                                          
                                          {payment.transactionId && (
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-muted-foreground">Transaction ID:</div>
                                              <div className="col-span-2 text-xs text-muted-foreground font-mono">
                                                {payment.transactionId}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    {/* Patient Information */}
                                    <Card className="shadow-sm">
                                      <CardHeader className="py-3 px-4 border-b">
                                        <CardTitle className="text-sm font-medium">Patient Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="py-3 px-4 text-sm">
                                        <div className="space-y-2">
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-muted-foreground">Patient:</div>
                                            <div className="col-span-2">{payment.patientName}</div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-muted-foreground">Chart Number:</div>
                                            <div className="col-span-2">PT-{(1000 + payment.id).toString().slice(1)}</div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                  
                                  {/* Action buttons */}
                                  <div className="flex justify-end space-x-2 mt-4">
                                    <Button variant="outline" size="sm">
                                      <Printer className="h-4 w-4 mr-2" />
                                      Print Receipt
                                    </Button>
                                    <Button variant="default" size="sm">
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Full Details
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