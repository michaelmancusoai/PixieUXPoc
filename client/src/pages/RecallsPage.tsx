import { useState, useMemo } from "react";
import { format, isAfter, isBefore, parseISO, addDays, differenceInMonths } from "date-fns";
import {
  Bell,
  CalendarClock,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  FilterX,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import JSConfetti from "js-confetti";
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

// Define types for our Recall data
interface RecallPatient {
  id: number;
  patientName: string;
  dueDate: string;
  procedureType: string;
  lastVisit: string;
  lastProcedure?: string;
  contactAttempts: Array<{
    type: "SMS" | "Email" | "Call";
    date: string;
    status: "Delivered" | "Failed" | "No Answer" | "Voicemail";
  }>;
  benefitsRemaining?: number;
  status: "Unscheduled" | "Scheduled" | "Declined";
  provider?: string;
  contactPreferences?: Array<"SMS" | "Email" | "Call">;
  phone?: string;
  email?: string;
  insuranceExpiryDate?: string;
}

export default function RecallsPage() {
  // State management
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [windowFilter, setWindowFilter] = useState("this-week");
  const [procedureFilter, setProceduretypeFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [contactStatusFilter, setContactStatusFilter] = useState("all");
  const [insuranceFilter, setInsuranceFilter] = useState("all");
  const { toast } = useToast();
  
  // Mock data for recalls - in a real app this would come from API
  const mockRecalls: RecallPatient[] = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      dueDate: "2025-04-26",
      procedureType: "6-month cleaning",
      lastVisit: "2024-10-25",
      lastProcedure: "Cleaning",
      contactAttempts: [
        { type: "SMS", date: "2025-04-20", status: "Delivered" },
        { type: "Email", date: "2025-04-22", status: "Delivered" }
      ],
      benefitsRemaining: 184,
      status: "Unscheduled",
      provider: "Dr. Smith",
      contactPreferences: ["SMS", "Email"],
      phone: "555-123-4567",
      email: "sarah.j@example.com",
      insuranceExpiryDate: "2025-06-07"
    },
    {
      id: 2,
      patientName: "Michael Brown",
      dueDate: "2025-04-27",
      procedureType: "BW X-ray",
      lastVisit: "2023-10-27",
      lastProcedure: "Filling",
      contactAttempts: [
        { type: "SMS", date: "2025-04-20", status: "Delivered" }
      ],
      benefitsRemaining: 350,
      status: "Unscheduled",
      provider: "Dr. Johnson",
      contactPreferences: ["SMS", "Call"],
      phone: "555-234-5678",
      email: "mbrown@example.com"
    },
    {
      id: 3,
      patientName: "Emily Davis",
      dueDate: "2025-04-28",
      procedureType: "6-month cleaning",
      lastVisit: "2024-10-28",
      lastProcedure: "Cleaning",
      contactAttempts: [
        { type: "Call", date: "2025-04-21", status: "No Answer" },
        { type: "SMS", date: "2025-04-22", status: "Delivered" },
        { type: "Email", date: "2025-04-23", status: "Delivered" }
      ],
      benefitsRemaining: 210,
      status: "Unscheduled",
      provider: "Dr. Martinez",
      contactPreferences: ["Call", "Email"],
      phone: "555-345-6789",
      email: "e.davis@example.com",
      insuranceExpiryDate: "2025-05-15"
    },
    {
      id: 4,
      patientName: "David Wilson",
      dueDate: "2025-04-30",
      procedureType: "FMX",
      lastVisit: "2023-04-30",
      lastProcedure: "Root Canal",
      contactAttempts: [
        { type: "Email", date: "2025-04-23", status: "Delivered" }
      ],
      benefitsRemaining: 520,
      status: "Scheduled",
      provider: "Dr. Smith",
      contactPreferences: ["Email"],
      phone: "555-456-7890",
      email: "dwilson@example.com"
    },
    {
      id: 5,
      patientName: "Jennifer Lopez",
      dueDate: "2025-01-15",
      procedureType: "Perio chart",
      lastVisit: "2024-07-15",
      lastProcedure: "Deep Cleaning",
      contactAttempts: [
        { type: "SMS", date: "2025-01-08", status: "Delivered" },
        { type: "Call", date: "2025-01-10", status: "No Answer" },
        { type: "Call", date: "2025-02-05", status: "Voicemail" }
      ],
      benefitsRemaining: 184,
      status: "Unscheduled",
      provider: "Dr. Johnson",
      contactPreferences: ["SMS", "Call"],
      phone: "555-567-8901",
      email: "jlopez@example.com",
      insuranceExpiryDate: "2025-06-07"
    },
    {
      id: 6,
      patientName: "Robert Miller",
      dueDate: "2025-01-05",
      procedureType: "6-month cleaning",
      lastVisit: "2024-07-05",
      lastProcedure: "Cleaning",
      contactAttempts: [
        { type: "SMS", date: "2025-01-02", status: "Delivered" },
        { type: "Email", date: "2025-01-04", status: "Delivered" },
        { type: "Call", date: "2025-01-10", status: "No Answer" },
        { type: "SMS", date: "2025-02-01", status: "Delivered" }
      ],
      benefitsRemaining: 0,
      status: "Unscheduled",
      provider: "Dr. Martinez",
      contactPreferences: ["SMS", "Email", "Call"],
      phone: "555-678-9012",
      email: "rmiller@example.com"
    },
    {
      id: 7,
      patientName: "Jessica Taylor",
      dueDate: "2024-12-18",
      procedureType: "BW X-ray",
      lastVisit: "2023-12-18",
      lastProcedure: "Crown",
      contactAttempts: [
        { type: "Email", date: "2024-12-11", status: "Delivered" },
        { type: "Call", date: "2024-12-15", status: "Voicemail" },
        { type: "SMS", date: "2025-01-05", status: "Delivered" },
        { type: "Call", date: "2025-02-10", status: "No Answer" }
      ],
      benefitsRemaining: 420,
      status: "Declined",
      provider: "Dr. Smith",
      contactPreferences: ["Email", "Call"],
      phone: "555-789-0123",
      email: "jtaylor@example.com"
    },
    {
      id: 8,
      patientName: "Thomas Anderson",
      dueDate: "2025-04-29",
      procedureType: "6-month cleaning",
      lastVisit: "2024-10-29",
      lastProcedure: "Cleaning",
      contactAttempts: [],
      benefitsRemaining: 250,
      status: "Unscheduled",
      provider: "Dr. Johnson",
      contactPreferences: ["Email", "SMS"],
      phone: "555-890-1234",
      email: "tanderson@example.com"
    },
    {
      id: 9,
      patientName: "Lisa Martin",
      dueDate: "2025-01-10",
      procedureType: "FMX",
      lastVisit: "2023-01-10",
      lastProcedure: "Cleaning",
      contactAttempts: [
        { type: "SMS", date: "2025-01-03", status: "Delivered" },
        { type: "Email", date: "2025-01-05", status: "Delivered" },
        { type: "Call", date: "2025-01-08", status: "No Answer" },
        { type: "SMS", date: "2025-02-01", status: "Delivered" },
        { type: "Call", date: "2025-03-05", status: "Voicemail" }
      ],
      benefitsRemaining: 150,
      status: "Unscheduled",
      provider: "Dr. Martinez",
      contactPreferences: ["SMS", "Email", "Call"],
      phone: "555-901-2345",
      email: "lmartin@example.com"
    },
    {
      id: 10,
      patientName: "James Williams",
      dueDate: "2024-12-20",
      procedureType: "Perio chart",
      lastVisit: "2024-06-20",
      lastProcedure: "Deep Cleaning",
      contactAttempts: [
        { type: "Call", date: "2024-12-15", status: "No Answer" },
        { type: "SMS", date: "2024-12-17", status: "Delivered" },
        { type: "Email", date: "2024-12-19", status: "Delivered" },
        { type: "Call", date: "2025-01-10", status: "No Answer" },
        { type: "SMS", date: "2025-02-15", status: "Delivered" }
      ],
      benefitsRemaining: 320,
      status: "Unscheduled",
      provider: "Dr. Smith",
      contactPreferences: ["Call", "SMS"],
      phone: "555-012-3456",
      email: "jwilliams@example.com"
    },
    {
      id: 11,
      patientName: "Patricia Clark",
      dueDate: "2025-05-01",
      procedureType: "6-month cleaning",
      lastVisit: "2024-11-01",
      lastProcedure: "Cleaning",
      contactAttempts: [],
      benefitsRemaining: 280,
      status: "Unscheduled",
      provider: "Dr. Johnson",
      contactPreferences: ["Email"],
      phone: "555-123-4567",
      email: "pclark@example.com"
    },
    {
      id: 12,
      patientName: "Richard Lewis",
      dueDate: "2025-01-25",
      procedureType: "BW X-ray",
      lastVisit: "2023-01-25",
      lastProcedure: "Filling",
      contactAttempts: [
        { type: "Email", date: "2025-01-18", status: "Delivered" },
        { type: "SMS", date: "2025-01-22", status: "Delivered" },
        { type: "Call", date: "2025-02-15", status: "Voicemail" },
        { type: "SMS", date: "2025-03-01", status: "Delivered" }
      ],
      benefitsRemaining: 0,
      status: "Unscheduled",
      provider: "Dr. Martinez",
      contactPreferences: ["Email", "SMS", "Call"],
      phone: "555-234-5678",
      email: "rlewis@example.com"
    }
  ];

  // Calculate dates and helper functions
  const today = new Date();
  const oneWeekLater = addDays(today, 7);
  const twoWeeksLater = addDays(today, 14);
  const thirtyDaysLater = addDays(today, 30);

  // Computed metrics for KPI cards
  const getStats = () => {
    const dueThisWeek = mockRecalls.filter(recall => {
      const dueDate = parseISO(recall.dueDate);
      return isAfter(dueDate, today) && isBefore(dueDate, oneWeekLater) && recall.status === 'Unscheduled';
    });
    
    const overdueMoreThan3Months = mockRecalls.filter(recall => {
      const dueDate = parseISO(recall.dueDate);
      return isBefore(dueDate, today) && differenceInMonths(today, dueDate) >= 3 && recall.status === 'Unscheduled';
    });
    
    const noResponseAfter3Pings = mockRecalls.filter(recall => 
      recall.contactAttempts.length >= 3 && recall.status === 'Unscheduled'
    );

    // Calculate potential production value ($280 average per hygiene appointment)
    const potentialValueThisWeek = dueThisWeek.length * 280;
    const potentialValueNoResponse = noResponseAfter3Pings.length * 240;
    
    return {
      dueThisWeekCount: dueThisWeek.length,
      dueThisWeekValue: potentialValueThisWeek,
      overdueMoreThan3MonthsCount: overdueMoreThan3Months.length,
      noResponseAfter3PingsCount: noResponseAfter3Pings.length,
      noResponseAfter3PingsValue: potentialValueNoResponse,
      allRecallsCount: mockRecalls.filter(r => r.status === 'Unscheduled').length
    };
  };
  
  const stats = getStats();

  // Apply filters to recall data
  const filteredRecalls = useMemo(() => {
    let filtered = [...mockRecalls];
    
    // Apply window filter
    if (windowFilter === 'this-week') {
      filtered = filtered.filter(recall => {
        const dueDate = parseISO(recall.dueDate);
        return isAfter(dueDate, today) && isBefore(dueDate, oneWeekLater);
      });
    } else if (windowFilter === '2-weeks') {
      filtered = filtered.filter(recall => {
        const dueDate = parseISO(recall.dueDate);
        return isAfter(dueDate, today) && isBefore(dueDate, twoWeeksLater);
      });
    } else if (windowFilter === '30-days') {
      filtered = filtered.filter(recall => {
        const dueDate = parseISO(recall.dueDate);
        return isAfter(dueDate, today) && isBefore(dueDate, thirtyDaysLater);
      });
    } else if (windowFilter === 'overdue') {
      filtered = filtered.filter(recall => {
        const dueDate = parseISO(recall.dueDate);
        return isBefore(dueDate, today);
      });
    }
    
    // Apply procedure type filter
    if (procedureFilter !== 'all') {
      filtered = filtered.filter(recall => 
        recall.procedureType.toLowerCase().includes(procedureFilter.toLowerCase())
      );
    }
    
    // Apply provider filter
    if (providerFilter !== 'all') {
      filtered = filtered.filter(recall => 
        recall.provider === providerFilter
      );
    }
    
    // Apply contact status filter
    if (contactStatusFilter === 'no-contact') {
      filtered = filtered.filter(recall => recall.contactAttempts.length === 0);
    } else if (contactStatusFilter === '1-ping') {
      filtered = filtered.filter(recall => recall.contactAttempts.length === 1);
    } else if (contactStatusFilter === '2-plus-pings') {
      filtered = filtered.filter(recall => recall.contactAttempts.length >= 2);
    } else if (contactStatusFilter === 'declined') {
      filtered = filtered.filter(recall => recall.status === 'Declined');
    }
    
    // Apply insurance filter
    if (insuranceFilter === 'has-benefits') {
      filtered = filtered.filter(recall => 
        recall.benefitsRemaining !== undefined && recall.benefitsRemaining > 0
      );
    } else if (insuranceFilter === 'exhausted') {
      filtered = filtered.filter(recall => 
        recall.benefitsRemaining !== undefined && recall.benefitsRemaining === 0
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recall => 
        recall.patientName.toLowerCase().includes(query) || 
        recall.procedureType.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [mockRecalls, windowFilter, procedureFilter, providerFilter, contactStatusFilter, insuranceFilter, searchQuery, today, oneWeekLater, twoWeeksLater, thirtyDaysLater]);

  // Extract unique providers for filter dropdown
  const providersSet = new Set<string>();
  mockRecalls.forEach(recall => {
    if (recall.provider) {
      providersSet.add(recall.provider);
    }
  });
  const providers = Array.from(providersSet);

  // Handle row selection
  const handleRowSelect = (id: number) => {
    setSelectedPatients(prev => {
      if (prev.includes(id)) {
        return prev.filter(patientId => patientId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedPatients.length === filteredRecalls.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(filteredRecalls.map(recall => recall.id));
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

  // Handle SMS send action
  const handleSendSms = (ids: number[]) => {
    // This would call API to send SMS in real implementation
    toast({
      title: "SMS Messages Queued",
      description: `${ids.length} messages will be sent to selected patients.`,
    });
    
    // Clear selection after action
    setSelectedPatients([]);
  };
  
  // Handle Email send action
  const handleSendEmail = (ids: number[]) => {
    // This would call API to send Email in real implementation
    toast({
      title: "Emails Queued",
      description: `${ids.length} emails will be sent to selected patients.`,
    });
    
    // Clear selection after action
    setSelectedPatients([]);
  };
  
  // Handle Add to Waitlist action
  const handleAddToWaitlist = (ids: number[]) => {
    // This would call API to add to waitlist in real implementation
    toast({
      title: "Added to Waitlist",
      description: `${ids.length} patients added to the waitlist.`,
    });
    
    // Clear selection after action
    setSelectedPatients([]);
  };
  
  // Handle Book Appointment action
  const handleBookAppointment = (ids: number[]) => {
    // This would navigate to booking page or open dialog in real implementation
    toast({
      title: "Ready to Book",
      description: `Starting appointment booking for ${ids.length} patients.`,
    });
    
    // Clear selection after action
    setSelectedPatients([]);
  };
  
  // Handle Dismiss Recall action
  const handleDismissRecalls = (ids: number[], reason: string = "Patient request") => {
    // This would call API to update recall status in real implementation
    toast({
      title: "Recalls Dismissed",
      description: `${ids.length} recalls dismissed. Reason: ${reason}`,
    });
    
    // Clear selection after action
    setSelectedPatients([]);
  };
  
  // Handle fill week action
  const handleFillThisWeek = () => {
    const thisWeekIds = mockRecalls
      .filter(recall => {
        const dueDate = parseISO(recall.dueDate);
        return isAfter(dueDate, today) && isBefore(dueDate, oneWeekLater) && recall.status === 'Unscheduled';
      })
      .map(recall => recall.id);
    
    setSelectedPatients(thisWeekIds);
    
    // Automatically set the window filter to match
    setWindowFilter('this-week');
    
    toast({
      title: "Patients Due This Week Selected",
      description: `${thisWeekIds.length} patients selected. Ready for bulk action.`,
    });
  };
  
  // Handle nudge oldest action
  const handleNudgeOldest = () => {
    const oldestOverdueIds = mockRecalls
      .filter(recall => {
        const dueDate = parseISO(recall.dueDate);
        return isBefore(dueDate, today) && differenceInMonths(today, dueDate) >= 3 && recall.status === 'Unscheduled';
      })
      .slice(0, 5) // Just take the first 5 to nudge
      .map(recall => recall.id);
    
    if (oldestOverdueIds.length === 0) {
      toast({
        variant: "destructive",
        title: "No overdue patients",
        description: "There are no patients overdue for more than 3 months.",
      });
      return;
    }
    
    setSelectedPatients(oldestOverdueIds);
    
    toast({
      title: "Oldest Overdue Patients Selected",
      description: `${oldestOverdueIds.length} patients selected. Ready for bulk action.`,
    });
  };

  // Handle Call Queue action
  const handleCallQueue = () => {
    const noResponseIds = mockRecalls
      .filter(recall => 
        recall.contactAttempts.length >= 3 && recall.status === 'Unscheduled'
      )
      .map(recall => recall.id);
    
    if (noResponseIds.length === 0) {
      toast({
        variant: "destructive",
        title: "No patients in call queue",
        description: "There are no patients who haven't responded after 3+ contact attempts.",
      });
      return;
    }
    
    setSelectedPatients(noResponseIds);
    
    toast({
      title: "Call Queue Patients Selected",
      description: `${noResponseIds.length} patients selected. Ready for call action.`,
    });
  };
  
  // Celebrate when overdue count reaches zero
  const triggerConfetti = () => {
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ['🦷', '✨', '🎉'],
      emojiSize: 50,
      confettiNumber: 75,
    });
  };

  return (
    <NavigationWrapper>
      <div className="container mx-auto py-6 max-w-[1400px]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Recalls</h1>
          <p className="text-muted-foreground">Manage patient hygiene and X-ray recalls</p>
        </div>
      
      {/* Hero KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Due This Week Card */}
        <Card className="shadow-sm border-t-4 border-t-mint-400 flex flex-col">
          <CardHeader className="py-3 px-5 border-b bg-mint-50/30">
            <CardTitle className="text-base font-medium flex items-center">
              <CalendarClock className="h-4 w-4 mr-2 text-slate-600" />
              Due This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="py-5 px-5 flex-1 flex flex-col">
            <div>
              <div className="text-2xl font-bold flex items-center justify-between mb-1">
                <span className="text-emerald-600">
                  {stats.dueThisWeekCount} patients
                </span>
                <ChevronRight className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                Due in next 7 days · ${stats.dueThisWeekValue} prod
              </div>
              
              {stats.dueThisWeekCount > 0 && (
                <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4" 
                  onClick={handleFillThisWeek}>
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(stats.dueThisWeekCount / 30) * 100}%` }}>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-auto">
              <Button 
                variant="default"
                size="sm"
                className="w-full"
                onClick={handleFillThisWeek}
              >
                Fill This Week
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Overdue > 3 Months Card */}
        <Card className="shadow-sm border-t-4 border-t-amber-400 flex flex-col">
          <CardHeader className="py-3 px-5 border-b bg-amber-50/30">
            <CardTitle className="text-base font-medium flex items-center">
              <Bell className="h-4 w-4 mr-2 text-slate-600" />
              Overdue {">"}3 mo
            </CardTitle>
          </CardHeader>
          <CardContent className="py-5 px-5 flex-1 flex flex-col">
            <div>
              <div className="text-2xl font-bold flex items-center justify-between mb-1">
                <span className="text-amber-600">
                  {stats.overdueMoreThan3MonthsCount} patients
                </span>
                <ChevronRight className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                Last seen 6-12 mo ago
              </div>
              
              {stats.overdueMoreThan3MonthsCount > 0 && (
                <div className="flex items-center space-x-1 mb-1">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <div className="text-xs text-amber-600 ml-2">
                    High-risk for patient attrition
                  </div>
                </div>
              )}
              
              {stats.overdueMoreThan3MonthsCount === 0 && (
                <div className="flex items-center text-green-600 mb-2 text-sm">
                  <CheckCheck className="h-4 w-4 mr-1" />
                  <span>Wow! All caught up.</span>
                </div>
              )}
            </div>
            
            <div className="mt-auto">
              <Button 
                variant="default"
                size="sm"
                className="w-full"
                onClick={handleNudgeOldest}
                disabled={stats.overdueMoreThan3MonthsCount === 0}
              >
                Nudge Oldest
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* No Response After 3 Pings Card */}
        <Card className="shadow-sm border-t-4 border-t-coral-400 flex flex-col">
          <CardHeader className="py-3 px-5 border-b bg-coral-50/30">
            <CardTitle className="text-base font-medium flex items-center">
              <Phone className="h-4 w-4 mr-2 text-slate-600" />
              No Response After 3 Pings
            </CardTitle>
          </CardHeader>
          <CardContent className="py-5 px-5 flex-1 flex flex-col">
            <div>
              <div className="text-2xl font-bold flex items-center justify-between mb-1">
                <span className="text-coral-600">
                  {stats.noResponseAfter3PingsCount} patients
                </span>
                <ChevronRight className="h-5 w-5 text-coral-500" />
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                ${stats.noResponseAfter3PingsValue} potential production
              </div>
              
              {stats.noResponseAfter3PingsCount > 0 && (
                <div className="text-xs text-coral-700 mb-4">
                  Time for a human touch point - add to the call queue
                </div>
              )}
              
              {stats.noResponseAfter3PingsCount === 0 && (
                <div className="flex items-center text-green-600 mb-2 text-sm">
                  <Check className="h-4 w-4 mr-1" />
                  <span>Great response rate!</span>
                </div>
              )}
            </div>
            
            <div className="mt-auto">
              <Button 
                variant="default"
                size="sm"
                className="w-full"
                onClick={handleCallQueue}
                disabled={stats.noResponseAfter3PingsCount === 0}
              >
                Call Queue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Filter rail - left sidebar */}
        <div className="col-span-12 md:col-span-3">
          <Card className="sticky top-4">
            <CardHeader className="py-3 px-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Filters</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => {
                    setWindowFilter("all");
                    setProceduretypeFilter("all");
                    setProviderFilter("all");
                    setContactStatusFilter("all");
                    setInsuranceFilter("all");
                    setSearchQuery("");
                  }}
                >
                  <FilterX className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 py-0">
              <Accordion type="multiple" defaultValue={["window", "procedure", "contact"]}>
                <AccordionItem value="window" className="border-b">
                  <AccordionTrigger className="py-3 text-sm">Window</AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="space-y-1">
                      <Button 
                        variant={windowFilter === "this-week" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setWindowFilter("this-week")}
                      >
                        This Week
                      </Button>
                      <Button 
                        variant={windowFilter === "2-weeks" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setWindowFilter("2-weeks")}
                      >
                        2 Weeks
                      </Button>
                      <Button 
                        variant={windowFilter === "30-days" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setWindowFilter("30-days")}
                      >
                        30 Days
                      </Button>
                      <Button 
                        variant={windowFilter === "overdue" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setWindowFilter("overdue")}
                      >
                        Overdue
                      </Button>
                      <Button 
                        variant={windowFilter === "all" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8"
                        onClick={() => setWindowFilter("all")}
                      >
                        All Recalls
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="procedure" className="border-b">
                  <AccordionTrigger className="py-3 text-sm">Procedure Type</AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="space-y-1">
                      <Button 
                        variant={procedureFilter === "all" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setProceduretypeFilter("all")}
                      >
                        All Types
                      </Button>
                      <Button 
                        variant={procedureFilter === "cleaning" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setProceduretypeFilter("cleaning")}
                      >
                        Hygiene
                      </Button>
                      <Button 
                        variant={procedureFilter === "x-ray" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setProceduretypeFilter("x-ray")}
                      >
                        BW X-ray
                      </Button>
                      <Button 
                        variant={procedureFilter === "fmx" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setProceduretypeFilter("fmx")}
                      >
                        FMX
                      </Button>
                      <Button 
                        variant={procedureFilter === "perio" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8"
                        onClick={() => setProceduretypeFilter("perio")}
                      >
                        Perio chart
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="provider" className="border-b">
                  <AccordionTrigger className="py-3 text-sm">Provider</AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="space-y-1">
                      <Button 
                        variant={providerFilter === "all" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setProviderFilter("all")}
                      >
                        All Providers
                      </Button>
                      {providers.map((provider) => (
                        <Button 
                          key={provider}
                          variant={providerFilter === provider ? "default" : "outline"} 
                          size="sm"
                          className="w-full justify-start text-sm h-8 mb-1"
                          onClick={() => setProviderFilter(provider as string)}
                        >
                          {provider}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contact" className="border-b">
                  <AccordionTrigger className="py-3 text-sm">Contact Status</AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="space-y-1">
                      <Button 
                        variant={contactStatusFilter === "all" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setContactStatusFilter("all")}
                      >
                        All Statuses
                      </Button>
                      <Button 
                        variant={contactStatusFilter === "no-contact" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setContactStatusFilter("no-contact")}
                      >
                        No contact
                      </Button>
                      <Button 
                        variant={contactStatusFilter === "1-ping" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setContactStatusFilter("1-ping")}
                      >
                        1 ping
                      </Button>
                      <Button 
                        variant={contactStatusFilter === "2-plus-pings" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setContactStatusFilter("2-plus-pings")}
                      >
                        2+ pings
                      </Button>
                      <Button 
                        variant={contactStatusFilter === "declined" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8"
                        onClick={() => setContactStatusFilter("declined")}
                      >
                        Declined
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="insurance" className="border-b">
                  <AccordionTrigger className="py-3 text-sm">Insurance</AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="space-y-1">
                      <Button 
                        variant={insuranceFilter === "all" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setInsuranceFilter("all")}
                      >
                        All Patients
                      </Button>
                      <Button 
                        variant={insuranceFilter === "has-benefits" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8 mb-1"
                        onClick={() => setInsuranceFilter("has-benefits")}
                      >
                        Has benefits left
                      </Button>
                      <Button 
                        variant={insuranceFilter === "exhausted" ? "default" : "outline"} 
                        size="sm"
                        className="w-full justify-start text-sm h-8"
                        onClick={() => setInsuranceFilter("exhausted")}
                      >
                        Exhausted
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
        
        {/* Main recall table */}
        <div className="col-span-12 md:col-span-9">
          <Card>
            <CardHeader className="py-4 px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <h3 className="font-medium text-base">
                    {filteredRecalls.length} {filteredRecalls.length === 1 ? 'Recall' : 'Recalls'} 
                  </h3>
                  {filteredRecalls.length > 0 && windowFilter !== 'all' && (
                    <Badge variant="outline" className="ml-2 bg-slate-50">
                      {windowFilter === 'this-week' ? 'This Week' : 
                       windowFilter === '2-weeks' ? 'Next 2 Weeks' : 
                       windowFilter === '30-days' ? 'Next 30 Days' : 
                       windowFilter === 'overdue' ? 'Overdue' : ''}
                    </Badge>
                  )}
                </div>
                <div className="flex-grow max-w-md">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search patients..."
                      className="pl-9 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredRecalls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <CheckCheck className="h-12 w-12 text-emerald-500 mb-4" />
                  <h3 className="text-lg font-medium mb-1">Every smile is on schedule</h3>
                  <p className="text-muted-foreground mb-4">
                    {windowFilter !== 'all' ? 
                      'Try adjusting your filters to see more recalls' : 
                      'Check back tomorrow for new recalls'}
                  </p>
                  {windowFilter !== 'all' && (
                    <Button variant="outline" onClick={() => setWindowFilter('all')}>
                      View All Recalls
                    </Button>
                  )}
                </div>
              ) : (
                <div className="border-t">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableCell className="w-[30px] py-2 pl-4">
                            <Checkbox 
                              checked={selectedPatients.length === filteredRecalls.length && filteredRecalls.length > 0} 
                              onCheckedChange={handleSelectAll}
                              aria-label="Select all recalls"
                            />
                          </TableCell>
                          <TableCell className="py-2 font-medium">Patient</TableCell>
                          <TableCell className="py-2 font-medium">Due Date</TableCell>
                          <TableCell className="py-2 font-medium">Procedure</TableCell>
                          <TableCell className="py-2 font-medium">Last Visit</TableCell>
                          <TableCell className="py-2 font-medium">Contact Attempts</TableCell>
                          <TableCell className="py-2 font-medium">Benefits</TableCell>
                          <TableCell className="py-2 font-medium">Status</TableCell>
                          <TableCell className="py-2 font-medium w-[100px]">Action</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecalls.map((recall) => (
                          <TableRow 
                            key={recall.id}
                            className={selectedPatients.includes(recall.id) ? "bg-primary/5" : undefined}
                            onClick={() => handleRowSelect(recall.id)}
                          >
                            <TableCell className="py-2 pl-4">
                              <Checkbox 
                                checked={selectedPatients.includes(recall.id)} 
                                onCheckedChange={() => handleRowSelect(recall.id)}
                                aria-label={`Select ${recall.patientName}`}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="flex items-center">
                                <div className="bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                                  <UserRound className="h-4 w-4 text-slate-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{recall.patientName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {recall.provider}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-2">
                              <Badge 
                                variant="outline" 
                                className={`${
                                  isBefore(parseISO(recall.dueDate), today) 
                                    ? "bg-red-50 text-red-700 border-red-200" 
                                    : "bg-slate-50"
                                }`}
                              >
                                {format(parseISO(recall.dueDate), "MMM d, yyyy")}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="flex items-center text-sm">
                                {recall.procedureType.includes("cleaning") ? (
                                  <Stethoscope className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                                ) : recall.procedureType.includes("X-ray") ? (
                                  <Stethoscope className="h-3.5 w-3.5 mr-1.5 text-violet-500" />
                                ) : recall.procedureType.includes("FMX") ? (
                                  <Stethoscope className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                ) : (
                                  <Stethoscope className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                                )}
                                {recall.procedureType}
                              </div>
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="text-sm">
                                {format(parseISO(recall.lastVisit), "MMM d, yyyy")}
                              </div>
                              {recall.lastProcedure && (
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <Stethoscope className="h-3 w-3 mr-1" />
                                  {recall.lastProcedure}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="py-2">
                              {recall.contactAttempts.length > 0 ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center">
                                        {/* Contact attempt icons hidden as requested */}
                                        <Badge variant="secondary" className="ml-1 h-5 text-xs">
                                          {recall.contactAttempts.length}
                                        </Badge>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="space-y-1 text-xs p-1 w-48">
                                        <h4 className="font-medium">Contact History</h4>
                                        {recall.contactAttempts.map((attempt, idx) => (
                                          <div key={idx} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                              {attempt.type === "SMS" && (
                                                <MessageSquare className="h-3 w-3 mr-1 text-blue-500" />
                                              )}
                                              {attempt.type === "Email" && (
                                                <Mail className="h-3 w-3 mr-1 text-amber-500" />
                                              )}
                                              {attempt.type === "Call" && (
                                                <Phone className="h-3 w-3 mr-1 text-green-500" />
                                              )}
                                              <span>{attempt.type}</span>
                                            </div>
                                            <div className="flex items-center">
                                              <span>{format(parseISO(attempt.date), "MMM d")}</span>
                                              {attempt.status === "Delivered" && (
                                                <Check className="h-3 w-3 ml-1 text-green-500" />
                                              )}
                                              {attempt.status === "Failed" && (
                                                <X className="h-3 w-3 ml-1 text-red-500" />
                                              )}
                                              {attempt.status === "No Answer" && (
                                                <X className="h-3 w-3 ml-1 text-amber-500" />
                                              )}
                                              {attempt.status === "Voicemail" && (
                                                <MessageSquare className="h-3 w-3 ml-1 text-blue-500" />
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <Badge variant="outline" className="text-xs bg-slate-50">No contact</Badge>
                              )}
                            </TableCell>
                            <TableCell className="py-2">
                              {recall.benefitsRemaining !== undefined ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="font-medium">
                                        ${recall.benefitsRemaining}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {recall.insuranceExpiryDate && (
                                        <div className="text-xs max-w-xs">
                                          {recall.patientName}'s unused benefits expire in {
                                            differenceInMonths(parseISO(recall.insuranceExpiryDate), today) * 30
                                          } days—${recall.benefitsRemaining} at risk.
                                        </div>
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <span className="text-muted-foreground text-sm">n/a</span>
                              )}
                            </TableCell>
                            <TableCell className="py-2">
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${recall.status === 'Unscheduled' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                                  ${recall.status === 'Scheduled' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                  ${recall.status === 'Declined' ? 'bg-slate-50 text-slate-700 border-slate-200' : ''}
                                `}
                              >
                                {recall.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="flex space-x-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <Phone className="h-3.5 w-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Call patient</p>
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
                                      <p className="text-xs">Send SMS</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <Mail className="h-3.5 w-3.5" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Send email</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
                  onClick={() => handleSendSms(selectedPatients)}
                  disabled={selectedPatients.length > 100}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-2" />
                  Send SMS
                  {selectedPatients.length > 100 && (
                    <span className="ml-1 text-xs text-muted-foreground">(Max 100)</span>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-9"
                  onClick={() => handleSendEmail(selectedPatients)}
                >
                  <Mail className="h-3.5 w-3.5 mr-2" />
                  Send Email
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-9"
                  onClick={() => handleAddToWaitlist(selectedPatients)}
                >
                  <CalendarClock className="h-3.5 w-3.5 mr-2" />
                  Add to Waitlist
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-9"
                  onClick={() => handleBookAppointment(selectedPatients)}
                >
                  <CalendarClock className="h-3.5 w-3.5 mr-2" />
                  Book Appointment
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-9"
                    >
                      <X className="h-3.5 w-3.5 mr-2" />
                      Dismiss Recall
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Dismiss Recalls</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        You're dismissing recalls for {selectedPatients.length} patient{selectedPatients.length !== 1 ? 's' : ''}. 
                        Please select a reason:
                      </p>
                      <Select defaultValue="patient-request">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient-request">Patient request</SelectItem>
                          <SelectItem value="wrong-recall">Wrong recall type</SelectItem>
                          <SelectItem value="moved-away">Patient moved away</SelectItem>
                          <SelectItem value="duplicate">Duplicate recall</SelectItem>
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
                          onClick={() => handleDismissRecalls(selectedPatients)}
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
      </div>
    </NavigationWrapper>
  );
}