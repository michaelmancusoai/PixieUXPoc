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
  Calendar,
  Phone,
  Mail,
  User,
  RefreshCcw
} from "lucide-react";

// Types
type Recall = {
  id: number;
  patientName: string;
  dueDate: string;
  lastContact: string | null;
  lastVisit: string;
  nextVisit: number;
  provider: string;
  recallType: string;
  phone: string;
  email: string;
  recallStatus: "Due" | "Overdue" | "Scheduled" | "Confirmed" | "In Progress";
  notes?: string;
};

// Mocked data with Harry Potter characters
const mockRecalls: Recall[] = [
  // Overdue Recalls
  {
    id: 1,
    patientName: "Nymphadora Tonks",
    dueDate: "04/01/2025",
    lastContact: "04/13/2025",
    lastVisit: "10/01/2024",
    nextVisit: 0,
    provider: "Dr. Picard",
    recallType: "6-month hygiene",
    phone: "555-123-4567",
    email: "tonks@ministry.wiz",
    recallStatus: "Overdue",
    notes: "Patient prefers morning appointments. Has expressed interest in teeth whitening."
  },
  {
    id: 2,
    patientName: "Remus Lupin",
    dueDate: "04/05/2025",
    lastContact: "04/12/2025",
    lastVisit: "04/05/2024",
    nextVisit: 0,
    provider: "Dr. Janeway",
    recallType: "Annual exam",
    phone: "555-234-5678",
    email: "lupin@hogwarts.edu",
    recallStatus: "Overdue",
    notes: "Schedule appointments around the full moon. Patient has history of periodontal disease."
  },
  {
    id: 3,
    patientName: "Alastor Moody",
    dueDate: "04/09/2025",
    lastContact: "04/10/2025",
    lastVisit: "01/09/2025",
    nextVisit: 0,
    provider: "Dr. Sisko",
    recallType: "3-month perio",
    phone: "555-345-6789",
    email: "moody@auror.wiz",
    recallStatus: "Overdue",
    notes: "Patient is very anxious about dental visits. Consider sedation options."
  },
  
  // Due Recalls
  {
    id: 4,
    patientName: "Sirius Black",
    dueDate: "04/25/2025",
    lastContact: null,
    lastVisit: "10/25/2024",
    nextVisit: 0,
    provider: "Dr. Sisko",
    recallType: "6-month check-up",
    phone: "555-456-7890",
    email: "padfoot@black.wiz",
    recallStatus: "Due",
    notes: "Patient often reschedules. Likes to be the last appointment of the day."
  },
  {
    id: 5,
    patientName: "Molly Weasley",
    dueDate: "04/27/2025",
    lastContact: "04/15/2025",
    lastVisit: "01/27/2025",
    nextVisit: 0,
    provider: "Dr. Picard",
    recallType: "3-month perio",
    phone: "555-567-8901",
    email: "molly@burrow.wiz",
    recallStatus: "Due",
    notes: "Patient likes to schedule appointments for multiple family members on the same day."
  },
  {
    id: 6,
    patientName: "Argus Filch",
    dueDate: "05/01/2025",
    lastContact: null,
    lastVisit: "05/01/2024",
    nextVisit: 0,
    provider: "Dr. Archer",
    recallType: "Annual comprehensive",
    phone: "555-678-9012",
    email: "filch@hogwarts.edu",
    recallStatus: "Due",
    notes: "Patient complains about dental sensitivity and has very poor oral hygiene. Will require extensive patient education."
  },
  
  // Scheduled Recalls
  {
    id: 7,
    patientName: "Minerva McGonagall",
    dueDate: "05/05/2025",
    lastContact: "04/07/2025",
    lastVisit: "11/05/2024",
    nextVisit: 21,
    provider: "Dr. Janeway",
    recallType: "6-month check-up",
    phone: "555-789-0123",
    email: "mcgonagall@hogwarts.edu",
    recallStatus: "Scheduled",
    notes: "Very punctual patient with excellent oral hygiene. Prefers afternoon appointments."
  },
  {
    id: 8,
    patientName: "Rubeus Hagrid",
    dueDate: "05/07/2025",
    lastContact: "04/07/2025",
    lastVisit: "11/07/2024",
    nextVisit: 14,
    provider: "Dr. Picard",
    recallType: "6-month hygiene",
    phone: "555-890-1234",
    email: "hagrid@hogwarts.edu",
    recallStatus: "Scheduled",
    notes: "Patient requires special extra-large chair accommodation. Schedule him as last patient of the day."
  },
  {
    id: 9,
    patientName: "Arthur Weasley",
    dueDate: "05/07/2025",
    lastContact: "04/08/2025",
    lastVisit: "11/07/2024",
    nextVisit: 7,
    provider: "Dr. Picard",
    recallType: "6-month check-up",
    phone: "555-901-2345",
    email: "arthur@ministry.wiz",
    recallStatus: "Confirmed",
    notes: "Fascinated by dental instruments and equipment. Asks lots of questions about how they work."
  },
  
  // In Progress Recalls
  {
    id: 10,
    patientName: "Bellatrix Lestrange",
    dueDate: "04/07/2025",
    lastContact: "04/15/2025",
    lastVisit: "10/07/2024",
    nextVisit: 0,
    provider: "Dr. Janeway",
    recallType: "6-month check-up",
    phone: "555-012-3456",
    email: "bella@darkarts.wiz",
    recallStatus: "In Progress",
    notes: "Difficult patient. Insists on special treatment and can be disruptive."
  },
  {
    id: 11,
    patientName: "Dolores Umbridge",
    dueDate: "04/07/2025",
    lastContact: "04/09/2025",
    lastVisit: "10/07/2024",
    nextVisit: 0,
    provider: "Dr. Archer",
    recallType: "6-month hygiene",
    phone: "555-123-7890",
    email: "dolores@ministry.wiz",
    recallStatus: "In Progress",
    notes: "Patient frequently complains and has filed multiple grievances. Handle with extreme care."
  }
];

// Expanded Detail Row for Recalls
const ExpandedDetailRow = ({ recall }: { recall: Recall }) => {
  return (
    <TableRow className="bg-muted/30">
      <TableCell colSpan={8} className="p-0">
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Patient Contact Info */}
          <div className="bg-white rounded-md border p-3">
            <h4 className="text-sm font-semibold mb-2 flex items-center">
              <User className="h-4 w-4 mr-1 text-blue-500" />
              Contact Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Phone:</span>
                <span>{recall.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Email:</span>
                <span className="truncate">{recall.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Last Visit:</span>
                <span>{recall.lastVisit}</span>
              </div>
            </div>
          </div>

          {/* Last Contact Details */}
          <div className="bg-white rounded-md border p-3">
            <h4 className="text-sm font-semibold mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-purple-500" />
              Recall Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span>{recall.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Contact:</span>
                <span>{recall.lastContact || "Not contacted"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recall Type:</span>
                <span>{recall.recallType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider:</span>
                <span>{recall.provider}</span>
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

  // Calculate metrics and total values for KPIs and insights
  const calculateMetrics = () => {
    const overdueCount = mockRecalls.filter(recall => recall.recallStatus === "Overdue").length;
    const dueCount = mockRecalls.filter(recall => recall.recallStatus === "Due").length;
    const scheduledCount = mockRecalls.filter(recall => recall.recallStatus === "Scheduled" || recall.recallStatus === "Confirmed").length;
    const inProgressCount = mockRecalls.filter(recall => recall.recallStatus === "In Progress").length;
    
    // Calculate aging buckets
    const under7Days = 5;
    const days7to30 = 4;
    const days30to90 = 2;
    const over90Days = 0;
    
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
    
    // Calculate provider statistics
    const providerStats = mockRecalls.reduce((acc, recall) => {
      const provider = recall.provider;
      if (!acc[provider]) {
        acc[provider] = {
          count: 0,
          overdueCount: 0,
          dueCount: 0
        };
      }
      acc[provider].count += 1;
      
      if (recall.recallStatus === "Overdue") {
        acc[provider].overdueCount += 1;
      } else if (recall.recallStatus === "Due") {
        acc[provider].dueCount += 1;
      }
      
      return acc;
    }, {} as Record<string, { count: number; overdueCount: number; dueCount: number; }>);
    
    // Find top providers by recall count
    const topProviders = Object.entries(providerStats)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3)
      .map(([name, stats]) => ({
        name,
        recallCount: stats.count,
        overdueCount: stats.overdueCount,
        percentOfTotal: (stats.count / mockRecalls.length) * 100
      }));
      
    return {
      overdueCount,
      dueCount,
      scheduledCount,
      inProgressCount,
      under7Days,
      days7to30,
      days30to90,
      over90Days,
      topRecallTypes,
      topProviders
    };
  };

  const metrics = calculateMetrics();

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
                  <div className="text-2xl font-bold">{metrics.overdueCount}</div>
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
                  <div className="text-2xl font-bold">{metrics.dueCount}</div>
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
                  <div className="text-2xl font-bold">{metrics.scheduledCount}</div>
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
                  <div className="text-2xl font-bold">{metrics.inProgressCount}</div>
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
                        style={{ width: `${(metrics.under7Days / 11) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">7-30 Days</span>
                      <span className="text-xs font-medium">{metrics.days7to30}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(metrics.days7to30 / 11) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">30-90 Days</span>
                      <span className="text-xs font-medium">{metrics.days30to90}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${(metrics.days30to90 / 11) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">90+ Days</span>
                      <span className="text-xs font-medium">{metrics.over90Days}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${(metrics.over90Days / 11) * 100}%` }}
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
              Overdue {renderTabBadge(metrics.overdueCount)}
            </TabsTrigger>
            <TabsTrigger value="due">
              Due Soon {renderTabBadge(metrics.dueCount)}
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              Scheduled {renderTabBadge(metrics.scheduledCount)}
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress {renderTabBadge(metrics.inProgressCount)}
            </TabsTrigger>
          </TabsList>

          {/* Tab content - same structure for all tabs but filtered data */}
          <TabsContent value="overdue" className="mt-0">
            <RecallsTable
              recalls={filteredRecalls}
              selectedRecalls={selectedRecalls}
              expandedRecallId={expandedRecallId}
              handleRowSelect={handleRowSelect}
              handleSelectAll={handleSelectAll}
              toggleExpandRecall={toggleExpandRecall}
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
  renderStatusBadge: (status: string) => React.ReactNode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    provider: string;
    recallType: string;
    recallStatus: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
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
                            <span className={recall.recallStatus === "Overdue" ? "text-red-600 font-medium" : ""}>
                              {recall.dueDate}
                            </span>
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(recall.recallStatus)}
                          </TableCell>
                          <TableCell>{recall.provider}</TableCell>
                          <TableCell>
                            {recall.lastContact || "Not contacted"}
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
                          <ExpandedDetailRow recall={recall} />
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
                          filters.recallType !== "All Types") && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                              setSearchQuery("");
                              setFilters({
                                provider: "All Providers",
                                recallType: "All Types",
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