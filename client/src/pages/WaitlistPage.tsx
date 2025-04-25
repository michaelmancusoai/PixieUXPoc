import React, { useState, useMemo, FC } from "react";
import { format, differenceInHours, differenceInDays } from "date-fns";
import { 
  AlertCircle,
  Calendar,
  CheckCircle, 
  ChevronDown, 
  ChevronRight,
  Clock,
  Filter,
  MessageSquare,
  MoreHorizontal,
  Phone,
  PlusCircle,
  RefreshCw,
  Search,
  Send,
  User,
  X
} from "lucide-react";
import { NavigationWrapper } from "@/components/NavigationWrapper";

// UI Components
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// Define types for our Waitlist data
interface WaitlistPatient {
  id: number;
  patientName: string;
  avatar?: string;
  productionValue: number;
  contactAge: string; // "2h" or "1d" format
  contactDate: string; // ISO date for sorting
  desiredWindow: "ASAP" | "This Week" | "Next Week" | "Flexible";
  requestedProvider: string | "Any";
  procedures: string[];
  fitScore: number;
  status: "Uncontacted" | "Offered" | "Booked";
  phone?: string;
  email?: string;
  source: "Waitlist" | "Web/Portal" | "Phone";
  notes?: string;
}

// Detailed patient info component
const WaitlistPatientDetails: FC<{ patient: WaitlistPatient }> = ({ patient }) => (
  <TableRow className="bg-muted/30 border-t-0">
    <TableCell colSpan={9} className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Patient Information */}
        <Card className="shadow-sm">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-sm font-medium">Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="py-3 px-4 space-y-2">
            <div className="grid grid-cols-2 gap-x-4 text-sm">
              <div className="text-muted-foreground">Name:</div>
              <div className="font-medium">{patient.patientName}</div>
              
              <div className="text-muted-foreground">Phone:</div>
              <div>{patient.phone || 'Not provided'}</div>
              
              <div className="text-muted-foreground">Email:</div>
              <div>{patient.email || 'Not provided'}</div>
              
              <div className="text-muted-foreground">Production Value:</div>
              <div className="font-medium text-blue-600">${patient.productionValue}</div>
            </div>
          </CardContent>
          <CardFooter className="py-2 px-4 border-t flex justify-end">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <User className="h-3.5 w-3.5 mr-1" /> 
              View Profile
            </Button>
          </CardFooter>
        </Card>
        
        {/* Request Details */}
        <Card className="shadow-sm">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-sm font-medium">Request Details</CardTitle>
          </CardHeader>
          <CardContent className="py-3 px-4 space-y-2">
            <div className="grid grid-cols-2 gap-x-4 text-sm">
              <div className="text-muted-foreground">Desired Window:</div>
              <div>
                <Badge variant="outline" className={
                  patient.desiredWindow === "ASAP" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                  patient.desiredWindow === "This Week" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                  patient.desiredWindow === "Next Week" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                  "bg-gray-100 text-gray-700 hover:bg-gray-100"
                }>
                  {patient.desiredWindow}
                </Badge>
              </div>
              
              <div className="text-muted-foreground">Requested Provider:</div>
              <div>{patient.requestedProvider}</div>
              
              <div className="text-muted-foreground">Source:</div>
              <div>{patient.source}</div>
              
              <div className="text-muted-foreground">Procedures:</div>
              <div className="flex flex-wrap gap-1">
                {patient.procedures.map(procedure => (
                  <Badge key={procedure} variant="outline" className="bg-gray-100 text-xs">
                    {procedure}
                  </Badge>
                ))}
              </div>
              
              <div className="text-muted-foreground">Contact Age:</div>
              <div className={
                patient.contactAge.includes('d') && parseInt(patient.contactAge) > 0 ? 
                "text-red-600 font-medium" : ""
              }>
                {patient.contactAge}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Scheduling Options */}
        <Card className="shadow-sm">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-sm font-medium">Scheduling Options</CardTitle>
          </CardHeader>
          <CardContent className="py-3 px-4">
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Fit Score</span>
                <Badge className={
                  patient.fitScore >= 80 ? "bg-green-100 text-green-700" :
                  patient.fitScore >= 60 ? "bg-amber-100 text-amber-700" :
                  "bg-gray-100 text-gray-700"
                }>
                  {patient.fitScore}%
                </Badge>
              </div>
              <Progress value={patient.fitScore} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {patient.fitScore >= 80 ? "Perfect match for today's schedule" :
                 patient.fitScore >= 60 ? "Good match available" :
                 "Limited matching gaps"}
              </div>
            </div>
            
            {patient.fitScore >= 60 && (
              <div className="space-y-2 mt-4">
                <div className="text-sm font-medium">Available Slots:</div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-green-600" />
                    Today, 2:30 PM (60 min)
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-amber-600" />
                    Tomorrow, 10:00 AM (45 min)
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="py-2 px-4 border-t flex justify-end gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <MessageSquare className="h-3.5 w-3.5 mr-1" /> 
              Offer Slots
            </Button>
            <Button size="sm" className="h-8 text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1" /> 
              Book Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </TableCell>
  </TableRow>
);

export default function WaitlistPage() {
  // State management
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [demandSourceFilter, setDemandSourceFilter] = useState("all");
  const [procedureTypeFilter, setProcedureTypeFilter] = useState("all");
  const [desiredWindowFilter, setDesiredWindowFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [productionValueFilter, setProductionValueFilter] = useState([0, 2000]);
  const { toast } = useToast();
  
  // Mock data for waitlist - in a real app this would come from API
  const mockWaitlist: WaitlistPatient[] = [
    {
      id: 1,
      patientName: "Emma Thompson",
      productionValue: 580,
      contactAge: "2h",
      contactDate: "2025-04-25T10:23:45",
      desiredWindow: "ASAP",
      requestedProvider: "Dr. Smith",
      procedures: ["Crown"],
      fitScore: 95,
      status: "Uncontacted",
      phone: "555-123-4567",
      email: "emma.t@example.com",
      source: "Waitlist"
    },
    {
      id: 2,
      patientName: "James Wilson",
      productionValue: 350,
      contactAge: "5h",
      contactDate: "2025-04-25T07:15:22",
      desiredWindow: "This Week",
      requestedProvider: "Any",
      procedures: ["Hygiene"],
      fitScore: 87,
      status: "Uncontacted",
      phone: "555-234-5678",
      email: "jwilson@example.com",
      source: "Web/Portal"
    },
    {
      id: 3,
      patientName: "Sophia Garcia",
      productionValue: 1250,
      contactAge: "1d",
      contactDate: "2025-04-24T12:45:12",
      desiredWindow: "ASAP",
      requestedProvider: "Dr. Johnson",
      procedures: ["Implant", "Crown"],
      fitScore: 76,
      status: "Offered",
      phone: "555-345-6789",
      email: "s.garcia@example.com",
      source: "Waitlist"
    },
    {
      id: 4,
      patientName: "Noah Martinez",
      productionValue: 420,
      contactAge: "3h",
      contactDate: "2025-04-25T09:10:05",
      desiredWindow: "Next Week",
      requestedProvider: "Dr. Smith",
      procedures: ["Hygiene", "X-ray"],
      fitScore: 65,
      status: "Uncontacted",
      phone: "555-456-7890",
      email: "noah.m@example.com",
      source: "Phone"
    },
    {
      id: 5,
      patientName: "Olivia Brown",
      productionValue: 950,
      contactAge: "1d",
      contactDate: "2025-04-24T13:33:42",
      desiredWindow: "ASAP",
      requestedProvider: "Dr. Johnson",
      procedures: ["Root Canal", "Crown"],
      fitScore: 92,
      status: "Uncontacted",
      phone: "555-567-8901",
      email: "obrown@example.com",
      source: "Waitlist"
    },
    {
      id: 6,
      patientName: "Liam Taylor",
      productionValue: 280,
      contactAge: "6h",
      contactDate: "2025-04-25T06:22:38",
      desiredWindow: "This Week",
      requestedProvider: "Any",
      procedures: ["Consultation", "X-ray"],
      fitScore: 81,
      status: "Uncontacted",
      phone: "555-678-9012",
      email: "ltaylor@example.com",
      source: "Web/Portal"
    },
    {
      id: 7,
      patientName: "Charlotte Lee",
      productionValue: 1680,
      contactAge: "2d",
      contactDate: "2025-04-23T11:55:18",
      desiredWindow: "Next Week",
      requestedProvider: "Dr. Martinez",
      procedures: ["Implant", "Crown", "Bone Graft"],
      fitScore: 55,
      status: "Offered",
      phone: "555-789-0123",
      email: "c.lee@example.com",
      source: "Waitlist"
    },
    {
      id: 8,
      patientName: "Lucas Anderson",
      productionValue: 280,
      contactAge: "4h",
      contactDate: "2025-04-25T08:15:33",
      desiredWindow: "This Week",
      requestedProvider: "Dr. Smith",
      procedures: ["Hygiene"],
      fitScore: 89,
      status: "Uncontacted",
      phone: "555-890-1234",
      email: "landerson@example.com",
      source: "Phone"
    },
    {
      id: 9,
      patientName: "Mia Jackson",
      productionValue: 780,
      contactAge: "2h",
      contactDate: "2025-04-25T10:35:25",
      desiredWindow: "ASAP",
      requestedProvider: "Dr. Martinez",
      procedures: ["Bridge", "Crowns"],
      fitScore: 94,
      status: "Uncontacted",
      phone: "555-901-2345",
      email: "mjackson@example.com",
      source: "Waitlist"
    },
    {
      id: 10,
      patientName: "Ethan Davis",
      productionValue: 360,
      contactAge: "5h",
      contactDate: "2025-04-25T07:20:11",
      desiredWindow: "Flexible",
      requestedProvider: "Any",
      procedures: ["Consultation", "Orthodontic"],
      fitScore: 72,
      status: "Uncontacted",
      phone: "555-012-3456",
      email: "edavis@example.com",
      source: "Web/Portal"
    }
  ];

  // Computed metrics for KPI cards
  const getStats = () => {
    const highValueASAP = mockWaitlist.filter(pat => 
      pat.productionValue > 250 && 
      pat.desiredWindow === "ASAP" && 
      pat.status === "Uncontacted"
    );
    
    const unansweredWebRequests = mockWaitlist.filter(pat => 
      pat.source === "Web/Portal" && 
      pat.status === "Uncontacted"
    );
    
    // Calculate potential production value
    const highValueASAPTotal = highValueASAP.reduce((sum, pat) => sum + pat.productionValue, 0);
    
    return {
      highValueASAPCount: highValueASAP.length,
      highValueASAPTotal,
      unansweredWebRequestsCount: unansweredWebRequests.length,
      oldestWebRequest: unansweredWebRequests.length > 0 ? 
        Math.min(...unansweredWebRequests.map(pat => parseInt(pat.contactAge))) : 0,
      schedulingGapsCount: 2, // Mocked for this example
      schedulingGapsMinutes: 70 // Mocked for this example
    };
  };
  
  const stats = getStats();

  // Apply filters to waitlist data
  const filteredWaitlist = useMemo(() => {
    let filtered = [...mockWaitlist];
    
    // Apply demand source filter
    if (demandSourceFilter !== "all") {
      filtered = filtered.filter(pat => pat.source === demandSourceFilter);
    }
    
    // Apply procedure type filter
    if (procedureTypeFilter !== "all") {
      filtered = filtered.filter(pat => pat.procedures.includes(procedureTypeFilter));
    }
    
    // Apply desired window filter
    if (desiredWindowFilter !== "all") {
      filtered = filtered.filter(pat => pat.desiredWindow === desiredWindowFilter);
    }
    
    // Apply provider filter
    if (providerFilter !== "all") {
      filtered = filtered.filter(pat => 
        pat.requestedProvider === providerFilter || pat.requestedProvider === "Any"
      );
    }
    
    // Apply production value filter
    filtered = filtered.filter(pat => 
      pat.productionValue >= productionValueFilter[0] && 
      pat.productionValue <= productionValueFilter[1]
    );
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pat => 
        pat.patientName.toLowerCase().includes(query) || 
        pat.procedures.some(proc => proc.toLowerCase().includes(query))
      );
    }
    
    // Sort by fit score (descending) as default sort
    return filtered.sort((a, b) => b.fitScore - a.fitScore);
  }, [
    mockWaitlist, 
    demandSourceFilter, 
    procedureTypeFilter, 
    desiredWindowFilter, 
    providerFilter, 
    productionValueFilter,
    searchQuery
  ]);

  // Handle patient selection
  const handlePatientSelect = (id: number) => {
    setSelectedPatients(prev => {
      if (prev.includes(id)) {
        return prev.filter(patId => patId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedPatients.length === filteredWaitlist.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(filteredWaitlist.map(pat => pat.id));
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
  
  // Show bulk actions container when patients are selected
  const toggleBulkActions = (selected: number[]) => {
    setShowBulkActions(selected.length > 0);
  };
  
  // Watch for changes in selected patients
  useMemo(() => {
    toggleBulkActions(selectedPatients);
  }, [selectedPatients]);
  
  // Action handlers
  const handleOfferSlots = (patientIds: number[]) => {
    toast({
      title: "Offering slots",
      description: `Sending slot offers to ${patientIds.length} patients`,
    });
  };
  
  const handleBookNow = (patientId: number) => {
    toast({
      title: "Opening scheduler",
      description: "Booking appointment for selected patient",
    });
  };
  
  const handleSendSms = (patientIds: number[]) => {
    toast({
      title: "SMS messages queued",
      description: `Sending SMS to ${patientIds.length} patients`,
    });
  };
  
  const handleArchive = (patientIds: number[]) => {
    toast({
      title: "Patients archived",
      description: `${patientIds.length} patients have been archived`,
    });
  };

  return (
    <NavigationWrapper>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Waitlist & Online Requests</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" className="h-9">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add to Waitlist
            </Button>
          </div>
        </div>
        
        {/* Hero KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* ASAP High Value Card */}
          <Card className="border-t-4 border-mint-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">ASAP, High Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">${stats.highValueASAPTotal}</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.highValueASAPCount} patients (Prod &gt; $250, want next 48h)
                  </p>
                </div>
                <Button 
                  variant={stats.highValueASAPCount > 0 ? "default" : "outline"} 
                  size="sm"
                  disabled={stats.highValueASAPCount === 0}
                  onClick={() => {
                    // Auto select high value ASAP patients
                    const highValueIds = mockWaitlist
                      .filter(p => p.productionValue > 250 && p.desiredWindow === "ASAP")
                      .map(p => p.id);
                    setSelectedPatients(highValueIds);
                  }}
                >
                  Fill First
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Web Requests Card */}
          <Card className={`border-t-4 ${stats.oldestWebRequest >= 2 ? "border-amber-500" : "border-gray-300"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Web Requests Unanswered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{stats.unansweredWebRequestsCount} requests</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.unansweredWebRequestsCount > 0 ? 
                      `(oldest ${stats.oldestWebRequest}h)` : 
                      "All requests handled"
                    }
                  </p>
                </div>
                <Button 
                  variant={stats.unansweredWebRequestsCount > 0 ? "default" : "outline"} 
                  size="sm" 
                  disabled={stats.unansweredWebRequestsCount === 0}
                >
                  Respond Now
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Schedule Gaps Card */}
          <Card className="border-t-4 border-coral-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Schedule Gap &gt; 30 min Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{stats.schedulingGapsCount} gaps</p>
                  <p className="text-sm text-muted-foreground">{stats.schedulingGapsMinutes} min</p>
                </div>
                <Button variant="default" size="sm">
                  Match Patients
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-12 gap-4">
          {/* Filter Rail (Left Sidebar) */}
          <div className="col-span-12 md:col-span-3">
            <Card className="sticky top-4">
              <CardHeader className="py-3 px-4 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">Filters</CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => {
                    setDemandSourceFilter("all");
                    setProcedureTypeFilter("all");
                    setDesiredWindowFilter("all");
                    setProviderFilter("all");
                    setProductionValueFilter([0, 2000]);
                  }}>
                    <Filter className="h-3.5 w-3.5 mr-1" /> Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="multiple" defaultValue={["demand-source", "procedure-type", "desired-window", "provider"]}>
                  <AccordionItem value="demand-source">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-muted/40">
                      Demand Source
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="source-waitlist" 
                            checked={demandSourceFilter === "all" || demandSourceFilter === "Waitlist"}
                            onCheckedChange={() => setDemandSourceFilter(
                              demandSourceFilter === "Waitlist" ? "all" : "Waitlist"
                            )}
                          />
                          <label htmlFor="source-waitlist" className="text-sm">Waitlist</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="source-web" 
                            checked={demandSourceFilter === "all" || demandSourceFilter === "Web/Portal"}
                            onCheckedChange={() => setDemandSourceFilter(
                              demandSourceFilter === "Web/Portal" ? "all" : "Web/Portal"
                            )}
                          />
                          <label htmlFor="source-web" className="text-sm">Web/Portal</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="source-phone" 
                            checked={demandSourceFilter === "all" || demandSourceFilter === "Phone"}
                            onCheckedChange={() => setDemandSourceFilter(
                              demandSourceFilter === "Phone" ? "all" : "Phone"
                            )}
                          />
                          <label htmlFor="source-phone" className="text-sm">Phone messages</label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="procedure-type">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-muted/40">
                      Procedure Type
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="procedure-crown" 
                            checked={procedureTypeFilter === "all" || procedureTypeFilter === "Crown"}
                            onCheckedChange={() => setProcedureTypeFilter(
                              procedureTypeFilter === "Crown" ? "all" : "Crown"
                            )}
                          />
                          <label htmlFor="procedure-crown" className="text-sm">Crown</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="procedure-implant" 
                            checked={procedureTypeFilter === "all" || procedureTypeFilter === "Implant"}
                            onCheckedChange={() => setProcedureTypeFilter(
                              procedureTypeFilter === "Implant" ? "all" : "Implant"
                            )}
                          />
                          <label htmlFor="procedure-implant" className="text-sm">Implant</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="procedure-hygiene" 
                            checked={procedureTypeFilter === "all" || procedureTypeFilter === "Hygiene"}
                            onCheckedChange={() => setProcedureTypeFilter(
                              procedureTypeFilter === "Hygiene" ? "all" : "Hygiene"
                            )}
                          />
                          <label htmlFor="procedure-hygiene" className="text-sm">Hygiene</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="procedure-ortho" 
                            checked={procedureTypeFilter === "all" || procedureTypeFilter === "Orthodontic"}
                            onCheckedChange={() => setProcedureTypeFilter(
                              procedureTypeFilter === "Orthodontic" ? "all" : "Orthodontic"
                            )}
                          />
                          <label htmlFor="procedure-ortho" className="text-sm">Ortho consult</label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="desired-window">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-muted/40">
                      Desired Window
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="window-asap" 
                            checked={desiredWindowFilter === "all" || desiredWindowFilter === "ASAP"}
                            onCheckedChange={() => setDesiredWindowFilter(
                              desiredWindowFilter === "ASAP" ? "all" : "ASAP"
                            )}
                          />
                          <label htmlFor="window-asap" className="text-sm">ASAP &lt; 48h</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="window-this-week" 
                            checked={desiredWindowFilter === "all" || desiredWindowFilter === "This Week"}
                            onCheckedChange={() => setDesiredWindowFilter(
                              desiredWindowFilter === "This Week" ? "all" : "This Week"
                            )}
                          />
                          <label htmlFor="window-this-week" className="text-sm">This week</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="window-next-week" 
                            checked={desiredWindowFilter === "all" || desiredWindowFilter === "Next Week"}
                            onCheckedChange={() => setDesiredWindowFilter(
                              desiredWindowFilter === "Next Week" ? "all" : "Next Week"
                            )}
                          />
                          <label htmlFor="window-next-week" className="text-sm">Next week</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="window-flexible" 
                            checked={desiredWindowFilter === "all" || desiredWindowFilter === "Flexible"}
                            onCheckedChange={() => setDesiredWindowFilter(
                              desiredWindowFilter === "Flexible" ? "all" : "Flexible"
                            )}
                          />
                          <label htmlFor="window-flexible" className="text-sm">Flexible</label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="provider">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-muted/40">
                      Provider Requested
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="provider-any" 
                            checked={providerFilter === "all" || providerFilter === "Any"}
                            onCheckedChange={() => setProviderFilter(
                              providerFilter === "Any" ? "all" : "Any"
                            )}
                          />
                          <label htmlFor="provider-any" className="text-sm">Any</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="provider-smith" 
                            checked={providerFilter === "all" || providerFilter === "Dr. Smith"}
                            onCheckedChange={() => setProviderFilter(
                              providerFilter === "Dr. Smith" ? "all" : "Dr. Smith"
                            )}
                          />
                          <label htmlFor="provider-smith" className="text-sm">Dr. Smith</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="provider-johnson" 
                            checked={providerFilter === "all" || providerFilter === "Dr. Johnson"}
                            onCheckedChange={() => setProviderFilter(
                              providerFilter === "Dr. Johnson" ? "all" : "Dr. Johnson"
                            )}
                          />
                          <label htmlFor="provider-johnson" className="text-sm">Dr. Johnson</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="provider-martinez" 
                            checked={providerFilter === "all" || providerFilter === "Dr. Martinez"}
                            onCheckedChange={() => setProviderFilter(
                              providerFilter === "Dr. Martinez" ? "all" : "Dr. Martinez"
                            )}
                          />
                          <label htmlFor="provider-martinez" className="text-sm">Dr. Martinez</label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="production-value">
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-muted/40">
                      Est. Production
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">${productionValueFilter[0]}</span>
                          <span className="text-sm">${productionValueFilter[1]}</span>
                        </div>
                        <Slider
                          value={productionValueFilter}
                          min={0}
                          max={2000}
                          step={50}
                          onValueChange={setProductionValueFilter}
                          className="w-full"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
          
          {/* Waitlist Table */}
          <div className="col-span-12 md:col-span-9">
            <Card>
              <CardHeader className="py-4 px-6 border-b flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients or procedures..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {filteredWaitlist.length > 0 ? (
                    <span className="text-sm text-muted-foreground">
                      {filteredWaitlist.length} patients
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No matching patients
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {filteredWaitlist.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">
                            <Checkbox 
                              checked={selectedPatients.length > 0 && selectedPatients.length === filteredWaitlist.length} 
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Prod $</TableHead>
                          <TableHead>Contact Age</TableHead>
                          <TableHead>Desired Window</TableHead>
                          <TableHead>Requested Provider</TableHead>
                          <TableHead>Fit Score</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      
                      <TableBody>
                        {filteredWaitlist.map((patient) => (
                          <React.Fragment key={patient.id}>
                            <TableRow 
                              className={
                                selectedPatients.includes(patient.id) ? "bg-muted/50" : ""
                              }
                              onClick={() => handlePatientSelect(patient.id)}
                            >
                              <TableCell>
                                <Checkbox 
                                  checked={selectedPatients.includes(patient.id)} 
                                  onCheckedChange={() => handlePatientSelect(patient.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                    {patient.patientName.charAt(0)}
                                  </div>
                                  <div className="font-medium">{patient.patientName}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                  ${patient.productionValue}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className={
                                  patient.contactAge.includes('d') && parseInt(patient.contactAge) > 0 ? 
                                  "text-red-600 font-medium" : ""
                                }>
                                  {patient.contactAge}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  patient.desiredWindow === "ASAP" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                                  patient.desiredWindow === "This Week" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                  patient.desiredWindow === "Next Week" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                                  "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                }>
                                  {patient.desiredWindow}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {patient.requestedProvider}
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge className={
                                        patient.fitScore >= 80 ? "bg-green-100 text-green-700" :
                                        patient.fitScore >= 60 ? "bg-amber-100 text-amber-700" :
                                        "bg-gray-100 text-gray-700"
                                      }>
                                        {patient.fitScore}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">
                                        {patient.fitScore >= 80 ? "Perfect match available" :
                                        patient.fitScore >= 60 ? "Good matching slots" :
                                        "Limited matching options"}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  patient.status === "Uncontacted" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                                  patient.status === "Offered" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                                  "bg-green-100 text-green-700 hover:bg-green-100"
                                }>
                                  {patient.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end items-center space-x-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                          <Calendar className="h-3.5 w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Book Now</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                          <MessageSquare className="h-3.5 w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Offer Slots</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                          <Phone className="h-3.5 w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Call Patient</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="icon" 
                                          className="h-7 w-7 ml-1"
                                          onClick={(e) => toggleRowExpand(patient.id, e)}
                                        >
                                          {expandedRows.includes(patient.id) ? (
                                            <ChevronDown className="h-3.5 w-3.5" />
                                          ) : (
                                            <ChevronRight className="h-3.5 w-3.5" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">
                                          {expandedRows.includes(patient.id) ? "Collapse details" : "Expand details"}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableCell>
                            </TableRow>
                            
                            {expandedRows.includes(patient.id) && (
                              <WaitlistPatientDetails patient={patient} />
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <div className="mb-4 p-4 rounded-full bg-muted">
                      <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No patients found</h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-4">
                      No patients match your current filter criteria. Try adjusting your filters or add a new patient to the waitlist.
                    </p>
                    <Button size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add to Waitlist
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-4 px-6 z-50">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="font-medium mr-3">{selectedPatients.length} patients selected</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedPatients([])}
                >
                  Clear
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-9"
                  onClick={() => handleOfferSlots(selectedPatients)}
                  disabled={selectedPatients.length === 0}
                >
                  <Calendar className="h-3.5 w-3.5 mr-2" />
                  Offer Slots
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-9"
                  onClick={() => handleBookNow(selectedPatients[0])}
                  disabled={selectedPatients.length !== 1}
                >
                  <Calendar className="h-3.5 w-3.5 mr-2" />
                  Book Now
                  {selectedPatients.length > 1 && (
                    <span className="ml-1 text-xs text-muted-foreground">(Select one patient)</span>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-9"
                  onClick={() => handleSendSms(selectedPatients)}
                  disabled={selectedPatients.length === 0}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-2" />
                  Send Waitlist SMS
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-9"
                      disabled={selectedPatients.length === 0}
                    >
                      <X className="h-3.5 w-3.5 mr-2" />
                      Archive
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Archive Waitlist Entries</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        You're archiving {selectedPatients.length} patient{selectedPatients.length !== 1 ? 's' : ''} from the waitlist. 
                        Please select a reason:
                      </p>
                      <Select defaultValue="declined">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="declined">Declined</SelectItem>
                          <SelectItem value="unable-to-reach">Unable to reach</SelectItem>
                          <SelectItem value="booked-elsewhere">Booked elsewhere</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter className="flex justify-end space-x-2">
                      <DialogClose asChild>
                        <Button variant="outline" size="sm">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button 
                          size="sm"
                          onClick={() => handleArchive(selectedPatients)}
                        >
                          Confirm
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      )}
    </NavigationWrapper>
  );
}