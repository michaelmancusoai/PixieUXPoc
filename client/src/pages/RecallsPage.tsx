import React, { useState, Fragment } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  XCircle,
  Send,
  FileText,
  ArrowUpDown,
  Plus,
  Trash2,
  CreditCard,
  Printer,
  Download,
  X,
  Banknote,
  BadgePercent,
  ArrowUpRight,
  ScrollText,
  Zap,
  FileCheck,
  BarChart3,
  Phone,
  Mail,
  Calendar,
  Bell,
  RefreshCcw,
  User
} from "lucide-react";
import { format, addDays, isAfter, isBefore, isToday } from "date-fns";

// Types
type Recall = {
  id: number;
  patientName: string;
  recallType: string;
  dueDate: Date;
  lastVisit: string;
  phone: string;
  email: string;
  isOverdue: boolean;
  lastAttempt: string | null;
  provider: string;
  birthdate: string;
  insuranceCarrier: string;
  planType: string;
  lastAppointment: {
    date: string;
    type: string;
    provider: string;
  } | null;
  upcomingAppointment: {
    date: string;
    type: string;
    provider: string;
  } | null;
  balanceInfo: {
    totalBalance: number;
    insurance: number;
    patient: number;
  };
  notes: string;
  recallStatus: "Due" | "Overdue" | "Scheduled" | "In Progress" | "Confirmed";
};

// Mocked Harry Potter characters recall data
const mockRecalls: Recall[] = [
  { 
    id: 101, 
    patientName: 'Nymphadora Tonks', 
    recallType: '6-month hygiene', 
    dueDate: addDays(new Date(), -14), 
    lastVisit: '6 months ago',
    phone: '555-123-4567',
    email: 'tonks@ministry.wiz',
    isOverdue: true,
    lastAttempt: '3 days ago',
    provider: 'Dr. Picard',
    birthdate: '05/15/1973',
    insuranceCarrier: 'Hogwarts Health Plan',
    planType: 'PPO',
    lastAppointment: {
      date: '10/25/2024',
      type: 'Comprehensive Exam',
      provider: 'Dr. Picard'
    },
    upcomingAppointment: null,
    balanceInfo: {
      totalBalance: 325.50,
      insurance: 225.50,
      patient: 100.00
    },
    notes: 'Patient prefers morning appointments. Has expressed interest in teeth whitening.',
    recallStatus: "Overdue"
  },
  { 
    id: 102, 
    patientName: 'Remus Lupin', 
    recallType: 'Annual exam',
    dueDate: addDays(new Date(), -7), 
    lastVisit: '1 year ago',
    phone: '555-234-5678',
    email: 'lupin@hogwarts.edu',
    isOverdue: true,
    lastAttempt: '1 week ago',
    provider: 'Dr. Janeway',
    birthdate: '03/10/1960',
    insuranceCarrier: 'Hogwarts Health Plan',
    planType: 'Faculty',
    lastAppointment: {
      date: '04/25/2024',
      type: 'Annual Exam',
      provider: 'Dr. Janeway'
    },
    upcomingAppointment: null,
    balanceInfo: {
      totalBalance: 0,
      insurance: 0,
      patient: 0
    },
    notes: 'Schedule appointments around the full moon. Patient has history of periodontal disease.',
    recallStatus: "Overdue"
  },
  { 
    id: 103, 
    patientName: 'Sirius Black', 
    recallType: '3-month perio', 
    dueDate: new Date(), 
    lastVisit: '3 months ago',
    phone: '555-345-6789',
    email: 'padfoot@black.wiz',
    isOverdue: false,
    lastAttempt: null,
    provider: 'Dr. Sisko',
    birthdate: '11/03/1959',
    insuranceCarrier: 'Order of Phoenix Health',
    planType: 'DHMO',
    lastAppointment: {
      date: '01/25/2025',
      type: 'Periodontal Therapy',
      provider: 'Dr. Sisko'
    },
    upcomingAppointment: null,
    balanceInfo: {
      totalBalance: 745.00,
      insurance: 645.00,
      patient: 100.00
    },
    notes: 'Patient is very anxious about dental visits. Consider sedation options.',
    recallStatus: "Due"
  },
  { 
    id: 104, 
    patientName: 'Bellatrix Lestrange', 
    recallType: '6-month check-up', 
    dueDate: addDays(new Date(), 1), 
    lastVisit: '5 months ago',
    phone: '555-456-7890',
    email: 'bella@darkarts.wiz',
    isOverdue: false,
    lastAttempt: null,
    provider: 'Dr. Janeway',
    birthdate: '09/21/1951',
    insuranceCarrier: 'Death Eater Dental Group',
    planType: 'Premium',
    lastAppointment: {
      date: '11/25/2024',
      type: 'Restorative',
      provider: 'Dr. Janeway'
    },
    upcomingAppointment: {
      date: '04/26/2025',
      type: 'Check-up',
      provider: 'Dr. Janeway'
    },
    balanceInfo: {
      totalBalance: 0,
      insurance: 0,
      patient: 0
    },
    notes: 'Difficult patient. Insists on special treatment and can be disruptive.',
    recallStatus: "Scheduled"
  },
  { 
    id: 105, 
    patientName: 'Rubeus Hagrid', 
    recallType: 'Annual comprehensive', 
    dueDate: addDays(new Date(), 3), 
    lastVisit: '11 months ago',
    phone: '555-567-8901',
    email: 'hagrid@hogwarts.edu',
    isOverdue: false,
    lastAttempt: null,
    provider: 'Dr. Picard',
    birthdate: '12/06/1928',
    insuranceCarrier: 'Hogwarts Health Plan',
    planType: 'Staff',
    lastAppointment: {
      date: '05/25/2024',
      type: 'Annual Exam',
      provider: 'Dr. Picard'
    },
    upcomingAppointment: {
      date: '04/28/2025',
      type: 'Comprehensive Exam',
      provider: 'Dr. Picard'
    },
    balanceInfo: {
      totalBalance: 125.00,
      insurance: 25.00,
      patient: 100.00
    },
    notes: 'Patient requires special extra-large chair accommodation. Schedule him as last patient of the day.',
    recallStatus: "Scheduled"
  },
  { 
    id: 106, 
    patientName: 'Dolores Umbridge', 
    recallType: '6-month check-up', 
    dueDate: addDays(new Date(), 5), 
    lastVisit: '6 months ago',
    phone: '555-678-9012',
    email: 'dolores@ministry.wiz',
    isOverdue: false,
    lastAttempt: '1 day ago',
    provider: 'Dr. Archer',
    birthdate: '08/26/1945',
    insuranceCarrier: 'Ministry of Magic Benefit Plan',
    planType: 'Executive',
    lastAppointment: {
      date: '10/25/2024',
      type: 'Check-up',
      provider: 'Dr. Archer'
    },
    upcomingAppointment: null,
    balanceInfo: {
      totalBalance: 0,
      insurance: 0,
      patient: 0
    },
    notes: 'Patient frequently complains and has filed multiple grievances. Handle with extreme care.',
    recallStatus: "In Progress"
  },
  { 
    id: 107, 
    patientName: 'Molly Weasley', 
    recallType: '3-month perio', 
    dueDate: addDays(new Date(), 7), 
    lastVisit: '3 months ago',
    phone: '555-789-0123',
    email: 'molly@burrow.wiz',
    isOverdue: false,
    lastAttempt: null,
    provider: 'Dr. Sisko',
    birthdate: '10/30/1949',
    insuranceCarrier: 'Weasley Family Plan',
    planType: 'Family',
    lastAppointment: {
      date: '01/25/2025',
      type: 'Periodontal Maintenance',
      provider: 'Dr. Sisko'
    },
    upcomingAppointment: {
      date: '05/02/2025',
      type: 'Periodontal Maintenance',
      provider: 'Dr. Sisko'
    },
    balanceInfo: {
      totalBalance: 350.00,
      insurance: 280.00,
      patient: 70.00
    },
    notes: 'Patient likes to schedule appointments for multiple family members on the same day.',
    recallStatus: "Due"
  },
  { 
    id: 108, 
    patientName: 'Arthur Weasley', 
    recallType: '6-month check-up', 
    dueDate: addDays(new Date(), 14), 
    lastVisit: '6 months ago',
    phone: '555-890-1234',
    email: 'arthur@ministry.wiz',
    isOverdue: false,
    lastAttempt: '1 week ago',
    provider: 'Dr. Picard',
    birthdate: '02/06/1950',
    insuranceCarrier: 'Ministry of Magic Benefit Plan',
    planType: 'Standard',
    lastAppointment: {
      date: '10/25/2024',
      type: 'Check-up',
      provider: 'Dr. Picard'
    },
    upcomingAppointment: null,
    balanceInfo: {
      totalBalance: 125.00,
      insurance: 75.00,
      patient: 50.00
    },
    notes: 'Fascinated by dental instruments and equipment. Asks lots of questions about how they work.',
    recallStatus: "Confirmed"
  },
  { 
    id: 109, 
    patientName: 'Argus Filch', 
    recallType: 'Annual comprehensive', 
    dueDate: addDays(new Date(), 21), 
    lastVisit: '10 months ago',
    phone: '555-901-2345',
    email: 'filch@hogwarts.edu',
    isOverdue: false,
    lastAttempt: null,
    provider: 'Dr. Sisko',
    birthdate: '04/20/1946',
    insuranceCarrier: 'Hogwarts Health Plan',
    planType: 'Staff',
    lastAppointment: {
      date: '06/25/2024',
      type: 'Annual Exam',
      provider: 'Dr. Sisko'
    },
    upcomingAppointment: null,
    balanceInfo: {
      totalBalance: 0,
      insurance: 0,
      patient: 0
    },
    notes: 'Patient complains about dental sensitivity and has very poor oral hygiene. Will require extensive patient education.',
    recallStatus: "Due"
  },
  { 
    id: 110, 
    patientName: 'Minerva McGonagall', 
    recallType: '6-month check-up', 
    dueDate: addDays(new Date(), 28), 
    lastVisit: '5 months ago',
    phone: '555-012-3456',
    email: 'mcgonagall@hogwarts.edu',
    isOverdue: false,
    lastAttempt: null,
    provider: 'Dr. Janeway',
    birthdate: '10/04/1935',
    insuranceCarrier: 'Hogwarts Health Plan',
    planType: 'Faculty Premium',
    lastAppointment: {
      date: '11/25/2024',
      type: 'Check-up',
      provider: 'Dr. Janeway'
    },
    upcomingAppointment: {
      date: '05/22/2025',
      type: '6-month Check-up',
      provider: 'Dr. Janeway'
    },
    balanceInfo: {
      totalBalance: 0,
      insurance: 0,
      patient: 0
    },
    notes: 'Very punctual patient with excellent oral hygiene. Prefers afternoon appointments.',
    recallStatus: "Scheduled"
  }
];

// ExpandedRow component to show recall details
const ExpandedRow = ({ recall }: { recall: Recall }) => {
  return (
    <TableRow className="border-t-0">
      <TableCell colSpan={7} className="p-0">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Patient Info */}
            <div className="bg-white rounded-md border p-3">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <User className="h-4 w-4 mr-1 text-blue-500" />
                Patient Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span>{recall.birthdate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance:</span>
                  <span>{recall.insuranceCarrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Type:</span>
                  <span>{recall.planType}</span>
                </div>
                {recall.balanceInfo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance:</span>
                    <span className={recall.balanceInfo.totalBalance > 0 ? 'text-red-600 font-medium' : ''}>
                      ${recall.balanceInfo.totalBalance.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Appointment History */}
            <div className="bg-white rounded-md border p-3">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                Appointment History
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground block">Last Visit:</span>
                  <div className="flex justify-between mt-1">
                    <span className="font-medium">{recall.lastAppointment?.date}</span>
                    <span>{recall.lastAppointment?.type}</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-muted-foreground block">Upcoming:</span>
                  {recall.upcomingAppointment ? (
                    <div className="flex justify-between mt-1">
                      <span className="font-medium">{recall.upcomingAppointment.date}</span>
                      <span>{recall.upcomingAppointment.type}</span>
                    </div>
                  ) : (
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        No appointment scheduled
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Pixie AI Notes */}
            <div className="bg-white rounded-md border p-3">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <Zap className="h-4 w-4 mr-1 text-purple-500" />
                Pixie AI Notes
              </h4>
              <div className="text-sm">
                <p className="text-gray-600 text-xs italic">{recall.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function RecallsPage() {
  // State
  const [selectedTab, setSelectedTab] = useState("overdue");
  const [selectedRecalls, setSelectedRecalls] = useState<number[]>([]);
  const [expandedRecallId, setExpandedRecallId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInsights, setShowInsights] = useState(false);
  const [filters, setFilters] = useState({
    insuranceCarrier: "All Carriers",
    provider: "All Providers",
    recallType: "All Types",
    recallStatus: "All Statuses",
  });

  // Get filtered recalls
  const getFilteredRecalls = () => {
    let filtered = [...mockRecalls];

    // Apply tab filters
    if (selectedTab === "overdue") {
      filtered = filtered.filter(recall => recall.recallStatus === "Overdue");
    } else if (selectedTab === "due") {
      filtered = filtered.filter(recall => recall.recallStatus === "Due");
    } else if (selectedTab === "scheduled") {
      filtered = filtered.filter(recall => recall.recallStatus === "Scheduled" || recall.recallStatus === "Confirmed");
    } else if (selectedTab === "in-progress") {
      filtered = filtered.filter(recall => recall.recallStatus === "In Progress");
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recall =>
        recall.patientName.toLowerCase().includes(query) ||
        recall.provider.toLowerCase().includes(query) ||
        recall.recallType.toLowerCase().includes(query)
      );
    }

    // Apply dropdown filters
    if (filters.insuranceCarrier !== "All Carriers") {
      filtered = filtered.filter(recall => recall.insuranceCarrier === filters.insuranceCarrier);
    }
    if (filters.provider !== "All Providers") {
      filtered = filtered.filter(recall => recall.provider === filters.provider);
    }
    if (filters.recallType !== "All Types") {
      filtered = filtered.filter(recall => recall.recallType === filters.recallType);
    }
    if (filters.recallStatus !== "All Statuses") {
      filtered = filtered.filter(recall => recall.recallStatus === filters.recallStatus);
    }

    return filtered;
  };

  const filteredRecalls = getFilteredRecalls();

  // Handle row checkbox click
  const handleRowSelect = (id: number) => {
    setSelectedRecalls(prev => {
      if (prev.includes(id)) {
        return prev.filter(recallId => recallId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedRecalls.length === filteredRecalls.length) {
      setSelectedRecalls([]);
    } else {
      setSelectedRecalls(filteredRecalls.map(recall => recall.id));
    }
  };

  // Toggle expanded row for recall details
  const toggleExpandRecall = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedRecallId(expandedRecallId === id ? null : id);
  };

  // Render count badge for tabs
  const renderTabBadge = (count: number) => (
    <Badge variant="outline" className="ml-2 bg-muted text-muted-foreground">
      {count}
    </Badge>
  );

  // Calculate metrics for KPIs and insights
  const calculateMetrics = () => {
    const totalOverdue = mockRecalls.filter(recall => recall.recallStatus === "Overdue").length;
    const totalDue = mockRecalls.filter(recall => recall.recallStatus === "Due").length;
    const totalScheduled = mockRecalls.filter(recall => recall.recallStatus === "Scheduled" || recall.recallStatus === "Confirmed").length;
    const totalInProgress = mockRecalls.filter(recall => recall.recallStatus === "In Progress").length;

    // Calculate aging buckets
    const now = new Date();
    const under7Days = mockRecalls.filter(recall => {
      const daysDiff = Math.ceil((now.getTime() - recall.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff < 7;
    }).length;

    const days7to30 = mockRecalls.filter(recall => {
      const daysDiff = Math.ceil((now.getTime() - recall.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 7 && daysDiff < 30;
    }).length;

    const days30to90 = mockRecalls.filter(recall => {
      const daysDiff = Math.ceil((now.getTime() - recall.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 30 && daysDiff < 90;
    }).length;

    const over90Days = mockRecalls.filter(recall => {
      const daysDiff = Math.ceil((now.getTime() - recall.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 90;
    }).length;

    // Calculate recall types breakdown
    const recallTypeCounts = mockRecalls.reduce((acc, recall) => {
      const type = recall.recallType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get top recall types
    const topRecallTypes = Object.entries(recallTypeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / mockRecalls.length) * 100
      }));

    return {
      totalOverdue,
      totalDue,
      totalScheduled,
      totalInProgress,
      under7Days,
      days7to30,
      days30to90,
      over90Days,
      topRecallTypes
    };
  };

  const metrics = calculateMetrics();

  // Format due date for display
  const formatDueDate = (date: Date): string => {
    if (isToday(date)) {
      return 'Today';
    }
    
    const now = new Date();
    
    if (isAfter(date, now) && isBefore(date, addDays(now, 1))) {
      return 'Tomorrow';
    }
    
    if (isAfter(date, now) && isBefore(date, addDays(now, 7))) {
      return `In ${Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days`;
    }
    
    if (isBefore(date, now)) {
      const daysOverdue = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return `${daysOverdue} days overdue`;
    }
    
    return format(date, 'MMM d, yyyy');
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Overdue":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">
            {status}
          </Badge>
        );
      case "Due":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-600 border-amber-200">
            {status}
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200">
            {status}
          </Badge>
        );
      case "Confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">
            {status}
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-600 border-purple-200">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  return (
    <NavigationWrapper>
      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Recalls Management</h1>
            <p className="text-muted-foreground text-sm">
              Track and manage patient recalls to optimize practice productivity
            </p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button size="sm" className="h-9 gap-1">
              <Plus className="h-4 w-4" />
              <span>Create Recall</span>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{metrics.totalOverdue}</div>
                  <p className="text-xs text-muted-foreground">
                    requires immediate action
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Due Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{metrics.totalDue}</div>
                  <p className="text-xs text-muted-foreground">
                    to schedule in next 30 days
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{metrics.totalScheduled}</div>
                  <p className="text-xs text-muted-foreground">
                    appointments confirmed
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{metrics.totalInProgress}</div>
                  <p className="text-xs text-muted-foreground">
                    under active follow-up
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <RefreshCcw className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recalls List</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show Insights</span>
            <Switch checked={showInsights} onCheckedChange={setShowInsights} />
          </div>
        </div>

        {/* Insights Panel */}
        {showInsights && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Aging Distribution */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Aging Distribution</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">0-7 Days</span>
                      <span className="text-xs font-medium">{metrics.under7Days}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${(metrics.under7Days / mockRecalls.length) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">7-30 Days</span>
                      <span className="text-xs font-medium">{metrics.days7to30}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(metrics.days7to30 / mockRecalls.length) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">30-90 Days</span>
                      <span className="text-xs font-medium">{metrics.days30to90}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${(metrics.days30to90 / mockRecalls.length) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">90+ Days</span>
                      <span className="text-xs font-medium">{metrics.over90Days}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${(metrics.over90Days / mockRecalls.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Top Recall Types */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Top Recall Types</h3>
                  <div className="space-y-3">
                    {metrics.topRecallTypes.map((type, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs truncate max-w-[180px]">{type.name}</span>
                          <span className="text-xs font-medium">{type.count} ({Math.round(type.percentage)}%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-purple-500' : 'bg-green-500'}`}
                            style={{ width: `${type.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Performance Stats */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Performance</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Card className="bg-muted/50">
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground mb-1">Recall Conversion Rate</div>
                        <div className="text-xl font-bold">65%</div>
                        <div className="text-[10px] text-green-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>+3% from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground mb-1">Avg. Follow-up Time</div>
                        <div className="text-xl font-bold">2.3 days</div>
                        <div className="text-[10px] text-red-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>+0.5 from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs and Table */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overdue">
              Overdue {renderTabBadge(metrics.totalOverdue)}
            </TabsTrigger>
            <TabsTrigger value="due">
              Due Soon {renderTabBadge(metrics.totalDue)}
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              Scheduled {renderTabBadge(metrics.totalScheduled)}
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress {renderTabBadge(metrics.totalInProgress)}
            </TabsTrigger>
          </TabsList>

          {/* Tab content - same for all tabs but filtered data */}
          <TabsContent value="overdue" className="mt-0">
            <RecallsTable 
              recalls={filteredRecalls}
              selectedRecalls={selectedRecalls}
              expandedRecallId={expandedRecallId}
              handleRowSelect={handleRowSelect}
              handleSelectAll={handleSelectAll}
              toggleExpandRecall={toggleExpandRecall}
              formatDueDate={formatDueDate}
              renderStatusBadge={renderStatusBadge}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
            />
          </TabsContent>
          <TabsContent value="due" className="mt-0">
            <RecallsTable 
              recalls={filteredRecalls}
              selectedRecalls={selectedRecalls}
              expandedRecallId={expandedRecallId}
              handleRowSelect={handleRowSelect}
              handleSelectAll={handleSelectAll}
              toggleExpandRecall={toggleExpandRecall}
              formatDueDate={formatDueDate}
              renderStatusBadge={renderStatusBadge}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
            />
          </TabsContent>
          <TabsContent value="scheduled" className="mt-0">
            <RecallsTable 
              recalls={filteredRecalls}
              selectedRecalls={selectedRecalls}
              expandedRecallId={expandedRecallId}
              handleRowSelect={handleRowSelect}
              handleSelectAll={handleSelectAll}
              toggleExpandRecall={toggleExpandRecall}
              formatDueDate={formatDueDate}
              renderStatusBadge={renderStatusBadge}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
            />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-0">
            <RecallsTable 
              recalls={filteredRecalls}
              selectedRecalls={selectedRecalls}
              expandedRecallId={expandedRecallId}
              handleRowSelect={handleRowSelect}
              handleSelectAll={handleSelectAll}
              toggleExpandRecall={toggleExpandRecall}
              formatDueDate={formatDueDate}
              renderStatusBadge={renderStatusBadge}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
            />
          </TabsContent>
        </Tabs>
      </div>
    </NavigationWrapper>
  );
}

// Recalls Table Component
function RecallsTable({
  recalls,
  selectedRecalls,
  expandedRecallId,
  handleRowSelect,
  handleSelectAll,
  toggleExpandRecall,
  formatDueDate,
  renderStatusBadge,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters
}: {
  recalls: Recall[];
  selectedRecalls: number[];
  expandedRecallId: number | null;
  handleRowSelect: (id: number) => void;
  handleSelectAll: () => void;
  toggleExpandRecall: (id: number, e?: React.MouseEvent) => void;
  formatDueDate: (date: Date) => string;
  renderStatusBadge: (status: string) => React.ReactNode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    insuranceCarrier: string;
    provider: string;
    recallType: string;
    recallStatus: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    insuranceCarrier: string;
    provider: string;
    recallType: string;
    recallStatus: string;
  }>>;
}) {
  // Get unique values for filters
  const getUniqueValues = (key: keyof Recall) => {
    const values = new Set<string>();
    mockRecalls.forEach(recall => {
      if (typeof recall[key] === 'string') {
        values.add(recall[key] as string);
      }
    });
    return Array.from(values);
  };

  const providers = getUniqueValues('provider');
  const recallTypes = getUniqueValues('recallType');
  const insuranceCarriers = getUniqueValues('insuranceCarrier');
  
  // Check if table has any data
  const hasData = recalls.length > 0;

  return (
    <>
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient name, provider, or recall type..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-full px-2"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Select
          value={filters.provider}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, provider: value }))
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Providers">All Providers</SelectItem>
            {providers.map((provider, i) => (
              <SelectItem key={i} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.recallType}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, recallType: value }))
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Recall Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Types">All Types</SelectItem>
            {recallTypes.map((type, i) => (
              <SelectItem key={i} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.insuranceCarrier}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, insuranceCarrier: value }))
          }
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Insurance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Carriers">All Carriers</SelectItem>
            {insuranceCarriers.map((carrier, i) => (
              <SelectItem key={i} value={carrier}>
                {carrier}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={selectedRecalls.length === 0}>
            <Send className="h-4 w-4 mr-1" />
            Send Reminder
          </Button>
          <Button variant="outline" size="sm" disabled={selectedRecalls.length === 0}>
            <Printer className="h-4 w-4 mr-1" />
            Print List
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={selectedRecalls.length === 0}>
                <span>More Actions</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Selected
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Contacted
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Recall
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-4 w-4" />
          <span>Advanced Filter</span>
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: 40 }}>
                    <Checkbox
                      checked={
                        hasData && selectedRecalls.length === recalls.length
                      }
                      onCheckedChange={handleSelectAll}
                      disabled={!hasData}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Recall Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead style={{ width: 65 }}></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasData ? (
                  <>
                    {recalls.map((recall) => (
                      <Fragment key={recall.id}>
                        <TableRow
                          onClick={() => handleRowSelect(recall.id)}
                          className="cursor-pointer"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedRecalls.includes(recall.id)}
                              onCheckedChange={() => handleRowSelect(recall.id)}
                              aria-label={`Select recall for ${recall.patientName}`}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {recall.patientName}
                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {recall.phone}
                            </div>
                          </TableCell>
                          <TableCell>{recall.recallType}</TableCell>
                          <TableCell>
                            <span className={recall.isOverdue ? "text-red-600 font-medium" : ""}>
                              {formatDueDate(recall.dueDate)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(recall.recallStatus)}
                          </TableCell>
                          <TableCell>{recall.provider}</TableCell>
                          <TableCell>
                            {recall.lastAttempt || "Not contacted"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => toggleExpandRecall(recall.id, e)}
                              className="h-7 w-7"
                            >
                              {expandedRecallId === recall.id ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedRecallId === recall.id && (
                          <ExpandedRow recall={recall} />
                        )}
                      </Fragment>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center">
                        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground text-lg mb-2">
                          No recalls found
                        </p>
                        <p className="text-muted-foreground text-sm max-w-md">
                          {searchQuery
                            ? "Try adjusting your search or filters to find what you're looking for."
                            : "There are no recalls that match your current filter criteria."}
                        </p>
                        {(searchQuery || filters.provider !== "All Providers" || 
                          filters.recallType !== "All Types" || 
                          filters.insuranceCarrier !== "All Carriers") && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                              setSearchQuery("");
                              setFilters({
                                provider: "All Providers",
                                recallType: "All Types",
                                insuranceCarrier: "All Carriers",
                                recallStatus: "All Statuses",
                              });
                            }}
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Pagination or Results Summary */}
      {hasData && (
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <div>Showing {recalls.length} of {mockRecalls.length} recalls</div>
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 mr-2">
              <span className="sr-only">Previous page</span>
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            <div className="flex items-center">
              <span className="text-sm font-medium">Page 1 of 1</span>
            </div>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 ml-2">
              <span className="sr-only">Next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}