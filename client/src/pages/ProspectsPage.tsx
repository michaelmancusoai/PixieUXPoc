import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Calendar,
  Clock, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Trash,
  User,
  UserCheck,
  UserX,
  FileText,
  ClipboardList,
  DollarSign,
  X,
  Check,
  Plus,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Zap
} from "lucide-react";
import JSConfetti from 'js-confetti';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToContainerDragging } from '@dnd-kit/modifiers';

// Mock data and types
type ProspectStage = "new" | "contacted" | "scheduled" | "planSent" | "converted" | "lost";

type Prospect = {
  id: number;
  name: string;
  stage: ProspectStage;
  source: string;
  phone: string;
  email: string;
  value: number;
  procedureInterest: string;
  createdAt: string;
  lastContactedAt?: string;
  contactAttempts: number;
  appointmentDate?: string;
  provider?: string;
  planSentDate?: string;
  conversionDate?: string;
  lostReason?: string;
  contactLog: ContactLogEntry[];
};

type ContactLogEntry = {
  id: number;
  type: "call" | "sms" | "email";
  timestamp: string;
  message?: string;
  direction: "inbound" | "outbound";
  duration?: string;
};

// Filters
type ProspectFilters = {
  sources: string[];
  procedures: string[];
  valueRange: [number, number];
  waitTime: "all" | "lessThan15" | "15to60" | "moreThan60";
  showArchived: boolean;
};

// Generate mock data
const mockProspects: Prospect[] = [
  {
    id: 1,
    name: "Mia Smith",
    stage: "new",
    source: "Web Form",
    phone: "555-123-4567",
    email: "mia.smith@example.com",
    value: 3200,
    procedureInterest: "Crown",
    createdAt: new Date(new Date().getTime() - 18 * 60000).toISOString(), // 18 minutes ago
    contactAttempts: 0,
    contactLog: [
      {
        id: 1,
        type: "email",
        timestamp: new Date(new Date().getTime() - 18 * 60000).toISOString(),
        message: "Inquiry about crown procedure",
        direction: "inbound"
      }
    ]
  },
  {
    id: 2,
    name: "Alex Johnson",
    stage: "new",
    source: "Phone Call",
    phone: "555-987-6543",
    email: "alex.johnson@example.com",
    value: 2500,
    procedureInterest: "Implant",
    createdAt: new Date(new Date().getTime() - 42 * 60000).toISOString(), // 42 minutes ago
    contactAttempts: 0,
    contactLog: [
      {
        id: 1,
        type: "call",
        timestamp: new Date(new Date().getTime() - 42 * 60000).toISOString(),
        message: "Called about implant options",
        direction: "inbound",
        duration: "3:45"
      }
    ]
  },
  {
    id: 3,
    name: "Sarah Williams",
    stage: "contacted",
    source: "Referral",
    phone: "555-456-7890",
    email: "sarah.williams@example.com",
    value: 4200,
    procedureInterest: "Orthodontics",
    createdAt: new Date(new Date().getTime() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    lastContactedAt: new Date(new Date().getTime() - 12 * 60000).toISOString(), // 12 minutes ago
    contactAttempts: 1,
    contactLog: [
      {
        id: 1,
        type: "email",
        timestamp: new Date(new Date().getTime() - 2 * 60 * 60000).toISOString(),
        message: "Referred by Dr. Lee for orthodontic work",
        direction: "inbound"
      },
      {
        id: 2,
        type: "call",
        timestamp: new Date(new Date().getTime() - 12 * 60000).toISOString(),
        message: "Left voicemail about available consult times",
        direction: "outbound",
        duration: "1:15"
      }
    ]
  },
  {
    id: 4,
    name: "James Brown",
    stage: "contacted",
    source: "Social Media",
    phone: "555-234-5678",
    email: "james.brown@example.com",
    value: 1800,
    procedureInterest: "Cosmetic",
    createdAt: new Date(new Date().getTime() - 6 * 60 * 60000).toISOString(), // 6 hours ago
    lastContactedAt: new Date(new Date().getTime() - 95 * 60000).toISOString(), // 95 minutes ago
    contactAttempts: 2,
    contactLog: [
      {
        id: 1,
        type: "email",
        timestamp: new Date(new Date().getTime() - 6 * 60 * 60000).toISOString(),
        message: "Inquiry about teeth whitening from Instagram ad",
        direction: "inbound"
      },
      {
        id: 2,
        type: "sms",
        timestamp: new Date(new Date().getTime() - 5 * 60 * 60000).toISOString(),
        message: "Hi James, thanks for your interest in our cosmetic services. When would be a good time to talk?",
        direction: "outbound"
      },
      {
        id: 3,
        type: "call",
        timestamp: new Date(new Date().getTime() - 95 * 60000).toISOString(),
        message: "Discussed whitening options, will schedule later",
        direction: "outbound",
        duration: "4:20"
      }
    ]
  },
  {
    id: 5,
    name: "Emma Davis",
    stage: "scheduled",
    source: "Web Form",
    phone: "555-345-6789",
    email: "emma.davis@example.com",
    value: 3500,
    procedureInterest: "Implant",
    createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
    lastContactedAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60000).toISOString(), // 1 day ago
    contactAttempts: 3,
    appointmentDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60000).toISOString(), // 5 days from now
    provider: "Dr. Anderson",
    contactLog: [
      {
        id: 1,
        type: "email",
        timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60000).toISOString(),
        message: "Interested in implant options",
        direction: "inbound"
      },
      {
        id: 2,
        type: "call",
        timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60000 + 30 * 60000).toISOString(),
        message: "Discussed implant options and costs",
        direction: "outbound",
        duration: "8:45"
      },
      {
        id: 3,
        type: "sms",
        timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60000).toISOString(),
        message: "Confirmed consultation appointment with Dr. Anderson",
        direction: "outbound"
      }
    ]
  },
  {
    id: 6,
    name: "Michael Wilson",
    stage: "planSent",
    source: "Referral",
    phone: "555-876-5432",
    email: "michael.wilson@example.com",
    value: 5800,
    procedureInterest: "Full Mouth Rehab",
    createdAt: new Date(new Date().getTime() - 14 * 24 * 60 * 60000).toISOString(), // 14 days ago
    lastContactedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60000).toISOString(), // 3 days ago
    contactAttempts: 4,
    appointmentDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60000).toISOString(), // 7 days ago
    provider: "Dr. Mitchell",
    planSentDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60000).toISOString(), // 3 days ago
    contactLog: [
      {
        id: 1,
        type: "call",
        timestamp: new Date(new Date().getTime() - 14 * 24 * 60 * 60000).toISOString(),
        message: "Initial inquiry from Dr. Lee's referral",
        direction: "inbound",
        duration: "5:30"
      },
      {
        id: 2,
        type: "email",
        timestamp: new Date(new Date().getTime() - 13 * 24 * 60 * 60000).toISOString(),
        message: "Sent welcome information and consultation options",
        direction: "outbound"
      },
      {
        id: 3,
        type: "call",
        timestamp: new Date(new Date().getTime() - 10 * 24 * 60 * 60000).toISOString(),
        message: "Scheduled consultation with Dr. Mitchell",
        direction: "outbound",
        duration: "3:15"
      },
      {
        id: 4,
        type: "email",
        timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60000).toISOString(),
        message: "Sent comprehensive treatment plan for full mouth rehabilitation",
        direction: "outbound"
      }
    ]
  },
  {
    id: 7,
    name: "Olivia Taylor",
    stage: "converted",
    source: "Web Form",
    phone: "555-567-8901",
    email: "olivia.taylor@example.com",
    value: 1850,
    procedureInterest: "Cosmetic",
    createdAt: new Date(new Date().getTime() - 30 * 24 * 60 * 60000).toISOString(), // 30 days ago
    lastContactedAt: new Date(new Date().getTime() - 15 * 24 * 60 * 60000).toISOString(), // 15 days ago
    contactAttempts: 3,
    appointmentDate: new Date(new Date().getTime() - 20 * 24 * 60 * 60000).toISOString(), // 20 days ago
    provider: "Dr. Phillips",
    planSentDate: new Date(new Date().getTime() - 19 * 24 * 60 * 60000).toISOString(), // 19 days ago
    conversionDate: new Date(new Date().getTime() - 15 * 24 * 60 * 60000).toISOString(), // 15 days ago
    contactLog: [
      {
        id: 1,
        type: "email",
        timestamp: new Date(new Date().getTime() - 30 * 24 * 60 * 60000).toISOString(),
        message: "Requested information about veneers",
        direction: "inbound"
      },
      {
        id: 2,
        type: "call",
        timestamp: new Date(new Date().getTime() - 29 * 24 * 60 * 60000).toISOString(),
        message: "Discussed veneer options and scheduled consultation",
        direction: "outbound",
        duration: "6:45"
      },
      {
        id: 3,
        type: "email",
        timestamp: new Date(new Date().getTime() - 19 * 24 * 60 * 60000).toISOString(),
        message: "Sent treatment plan for veneers with pricing",
        direction: "outbound"
      },
      {
        id: 4,
        type: "call",
        timestamp: new Date(new Date().getTime() - 15 * 24 * 60 * 60000).toISOString(),
        message: "Treatment plan accepted, scheduled first appointment",
        direction: "outbound",
        duration: "4:10"
      }
    ]
  },
  {
    id: 8,
    name: "Daniel Moore",
    stage: "lost",
    source: "Phone Call",
    phone: "555-678-9012",
    email: "daniel.moore@example.com",
    value: 4500,
    procedureInterest: "Orthodontics",
    createdAt: new Date(new Date().getTime() - 21 * 24 * 60 * 60000).toISOString(), // 21 days ago
    lastContactedAt: new Date(new Date().getTime() - 14 * 24 * 60 * 60000).toISOString(), // 14 days ago
    contactAttempts: 3,
    appointmentDate: new Date(new Date().getTime() - 16 * 24 * 60 * 60000).toISOString(), // 16 days ago
    provider: "Dr. Thompson",
    planSentDate: new Date(new Date().getTime() - 15 * 24 * 60 * 60000).toISOString(), // 15 days ago
    lostReason: "Price",
    contactLog: [
      {
        id: 1,
        type: "call",
        timestamp: new Date(new Date().getTime() - 21 * 24 * 60 * 60000).toISOString(),
        message: "Initial inquiry about orthodontic options",
        direction: "inbound",
        duration: "7:20"
      },
      {
        id: 2,
        type: "email",
        timestamp: new Date(new Date().getTime() - 20 * 24 * 60 * 60000).toISOString(),
        message: "Sent information about clear aligners",
        direction: "outbound"
      },
      {
        id: 3,
        type: "call",
        timestamp: new Date(new Date().getTime() - 18 * 24 * 60 * 60000).toISOString(),
        message: "Scheduled consultation with Dr. Thompson",
        direction: "outbound",
        duration: "3:50"
      },
      {
        id: 4,
        type: "email",
        timestamp: new Date(new Date().getTime() - 15 * 24 * 60 * 60000).toISOString(),
        message: "Sent treatment plan and financing options",
        direction: "outbound"
      },
      {
        id: 5,
        type: "call",
        timestamp: new Date(new Date().getTime() - 14 * 24 * 60 * 60000).toISOString(),
        message: "Client declined treatment due to cost concerns",
        direction: "outbound",
        duration: "5:15"
      }
    ]
  },
  {
    id: 9,
    name: "Sophia Clark",
    stage: "new",
    source: "Social Media",
    phone: "555-789-0123",
    email: "sophia.clark@example.com",
    value: 1200,
    procedureInterest: "Hygiene",
    createdAt: new Date(new Date().getTime() - 10 * 60000).toISOString(), // 10 minutes ago
    contactAttempts: 0,
    contactLog: [
      {
        id: 1,
        type: "email",
        timestamp: new Date(new Date().getTime() - 10 * 60000).toISOString(),
        message: "Inquiry about comprehensive cleaning services from Facebook ad",
        direction: "inbound"
      }
    ]
  },
  {
    id: 10,
    name: "William Thomas",
    stage: "new",
    source: "Ad Campaign",
    phone: "555-890-1234",
    email: "william.thomas@example.com",
    value: 2800,
    procedureInterest: "General",
    createdAt: new Date(new Date().getTime() - 5 * 60000).toISOString(), // 5 minutes ago
    contactAttempts: 0,
    contactLog: [
      {
        id: 1,
        type: "email",
        timestamp: new Date(new Date().getTime() - 5 * 60000).toISOString(),
        message: "New patient inquiry from Google Ads campaign",
        direction: "inbound"
      }
    ]
  }
];

// Source and procedure option lists
const sourceOptions = ["All Sources", "Web Form", "Phone Call", "Referral", "Social Media", "Ad Campaign"];
const procedureOptions = ["All Procedures", "Implant", "Orthodontics", "Cosmetic", "Crown", "General", "Hygiene", "Full Mouth Rehab"];
const lostReasonOptions = ["Price", "Timing", "No response", "Booked elsewhere", "Other"];
const providerOptions = ["Dr. Anderson", "Dr. Mitchell", "Dr. Phillips", "Dr. Thompson", "Dr. Martinez", "Dr. Campbell"];

// Helper functions
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} d ago`;
  
  return date.toLocaleDateString();
}

function formatResponseTime(createdAt: string, lastContactedAt?: string): number {
  if (!lastContactedAt) return 0;
  
  const created = new Date(createdAt);
  const contacted = new Date(lastContactedAt);
  return Math.round((contacted.getTime() - created.getTime()) / 60000); // minutes
}

function formatDateDisplay(dateString: string): string {
  return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getWaitTimeInMinutes(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.round((now.getTime() - created.getTime()) / 60000); // minutes
}

function filterProspects(prospects: Prospect[], filters: ProspectFilters): Prospect[] {
  return prospects.filter(prospect => {
    // Filter by source
    if (filters.sources.length > 0 && !filters.sources.includes("All Sources") && !filters.sources.includes(prospect.source)) {
      return false;
    }
    
    // Filter by procedure
    if (filters.procedures.length > 0 && !filters.procedures.includes("All Procedures") && !filters.procedures.includes(prospect.procedureInterest)) {
      return false;
    }
    
    // Filter by value range
    if (prospect.value < filters.valueRange[0] || prospect.value > filters.valueRange[1]) {
      return false;
    }
    
    // Filter by wait time (only for new prospects)
    if (prospect.stage === "new" && filters.waitTime !== "all") {
      const waitMinutes = getWaitTimeInMinutes(prospect.createdAt);
      if (filters.waitTime === "lessThan15" && waitMinutes >= 15) return false;
      if (filters.waitTime === "15to60" && (waitMinutes < 15 || waitMinutes > 60)) return false;
      if (filters.waitTime === "moreThan60" && waitMinutes <= 60) return false;
    }
    
    return true;
  });
}

// ProspectCard component for individual prospect card
const ProspectCard = ({ 
  prospect, 
  onClick, 
  isSelected = false,
  isDragging = false 
}: { 
  prospect: Prospect; 
  onClick: () => void;
  isSelected?: boolean;
  isDragging?: boolean;
}) => {
  const waitTimeInMinutes = getWaitTimeInMinutes(prospect.createdAt);
  const needsAttention = prospect.stage === "new" && waitTimeInMinutes > 30;
  
  return (
    <div 
      className={`
        p-3 mb-2 bg-white border rounded-md shadow-sm cursor-pointer
        ${isSelected ? 'border-primary' : needsAttention ? 'border-amber-400 border-2 border-dashed' : 'border-gray-200'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        hover:shadow-md transition-all
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
            {prospect.name.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-medium">{prospect.name}</span>
          {prospect.value > 0 && (
            <span className="text-sm text-muted-foreground ml-1">
              • ${prospect.value.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <Phone className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
          <Mail className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {prospect.stage === "new" && (
            <>
              <span className="font-medium text-gray-700">New Inquiry</span>
              <span>•</span>
              <span>{prospect.source}</span>
              <span className={`ml-1 ${waitTimeInMinutes > 30 ? 'text-amber-500 font-medium animate-pulse' : ''}`}>
                {waitTimeInMinutes} min
              </span>
            </>
          )}
          
          {prospect.stage === "contacted" && (
            <>
              <span>{prospect.contactAttempts} attempt{prospect.contactAttempts !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span className={`${
                formatTimeAgo(prospect.lastContactedAt || '').includes('h') ? 'text-amber-500 font-medium' : ''
              }`}>
                {formatTimeAgo(prospect.lastContactedAt || '')}
              </span>
            </>
          )}
          
          {prospect.stage === "scheduled" && (
            <>
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDateDisplay(prospect.appointmentDate || '')}</span>
              <span>•</span>
              <span>{prospect.provider}</span>
            </>
          )}
          
          {prospect.stage === "planSent" && (
            <>
              <FileText className="h-3 w-3 mr-1" />
              <span>${prospect.value}</span>
              <span>•</span>
              <span>Sent {formatDateDisplay(prospect.planSentDate || '')}</span>
            </>
          )}
          
          {prospect.stage === "converted" && (
            <>
              <Check className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-600 font-medium">${prospect.value} accepted</span>
            </>
          )}
          
          {prospect.stage === "lost" && (
            <>
              <X className="h-3 w-3 mr-1 text-red-500" />
              <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[10px]">
                {prospect.lostReason}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Main ProspectsPage component
export default function ProspectsPage() {
  // State variables
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFilterRail, setShowFilterRail] = useState(true);
  const [selectedProspects, setSelectedProspects] = useState<number[]>([]);
  const [draggedProspect, setDraggedProspect] = useState<Prospect | null>(null);
  const [isLostReasonModalOpen, setIsLostReasonModalOpen] = useState(false);
  const [lostReason, setLostReason] = useState<string>(""); 
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  
  // Filter states
  const [filters, setFilters] = useState<ProspectFilters>({
    sources: [],
    procedures: [],
    valueRange: [0, 10000],
    waitTime: "all",
    showArchived: false
  });
  
  // Toast for notifications
  const { toast } = useToast();
  
  // Initialize data
  useEffect(() => {
    setProspects(mockProspects);
  }, []);
  
  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  
  // Open prospect drawer
  const handleProspectClick = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsDrawerOpen(true);
  };
  
  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedProspect = prospects.find(p => p.id === active.id);
    if (draggedProspect) {
      setDraggedProspect(draggedProspect);
    }
  };
  
  // Handle drag end - update prospect stage
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const prospectId = Number(active.id);
      const newStage = over.id as ProspectStage;
      
      // If dropping to "lost" stage, show the lost reason modal
      if (newStage === "lost") {
        setSelectedProspect(prospects.find(p => p.id === prospectId) || null);
        setIsLostReasonModalOpen(true);
      } else {
        updateProspectStage(prospectId, newStage);
      }
    }
    
    setDraggedProspect(null);
  };
  
  // Update prospect stage
  const updateProspectStage = (id: number, stage: ProspectStage) => {
    const updatedProspects = prospects.map(p => {
      if (p.id === id) {
        // Set appropriate dates/info based on the new stage
        let updatedProspect: Prospect = { ...p, stage };
        
        // If moving to "contacted" stage for the first time
        if (stage === "contacted" && p.stage === "new") {
          updatedProspect.lastContactedAt = new Date().toISOString();
          updatedProspect.contactAttempts = p.contactAttempts + 1;
          
          // Add a contact log entry
          updatedProspect.contactLog = [
            ...p.contactLog,
            {
              id: p.contactLog.length + 1,
              type: "call",
              timestamp: new Date().toISOString(),
              message: "Initial outbound contact attempt",
              direction: "outbound",
              duration: "1:00"
            }
          ];
          
          // Show success toast
          toast({
            title: "Contact Recorded",
            description: `${p.name} has been moved to the Contacted stage.`
          });
        }
        
        // Set conversion date for converted prospects
        if (stage === "converted" && p.stage !== "converted") {
          updatedProspect.conversionDate = new Date().toISOString();
          
          // Trigger confetti for conversion
          const jsConfetti = new JSConfetti();
          jsConfetti.addConfetti({
            emojis: ['✅', '💰', '🎉'],
            confettiNumber: 30,
          });
          
          // Show success toast
          toast({
            title: "Prospect Converted!",
            description: `${p.name} has been successfully converted! $${p.value} added to production.`
          });
        }
        
        return updatedProspect;
      }
      return p;
    });
    
    setProspects(updatedProspects);
    
    // Update the selected prospect if it's the one being modified
    if (selectedProspect && selectedProspect.id === id) {
      const updatedProspect = updatedProspects.find(p => p.id === id);
      if (updatedProspect) {
        setSelectedProspect(updatedProspect);
      }
    }
  };
  
  // Handle lost reason submission
  const handleLostReasonSubmit = () => {
    if (selectedProspect && lostReason) {
      const updatedProspects = prospects.map(p => {
        if (p.id === selectedProspect.id) {
          return {
            ...p,
            stage: "lost" as ProspectStage,
            lostReason
          };
        }
        return p;
      });
      
      setProspects(updatedProspects);
      
      // Update the selected prospect
      setSelectedProspect({
        ...selectedProspect,
        stage: "lost",
        lostReason
      });
      
      setIsLostReasonModalOpen(false);
      setLostReason("");
      
      // Show toast
      toast({
        title: "Prospect Marked as Lost",
        description: `${selectedProspect.name} has been marked as lost due to ${lostReason}.`
      });
    }
  };
  
  // Toggle selection of a prospect for bulk actions
  const toggleProspectSelection = (id: number) => {
    setSelectedProspects(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id) 
        : [...prev, id]
    );
  };
  
  // Apply filters
  const filteredProspects = filterProspects(prospects, filters);
  
  // Group prospects by stage
  const prospectsByStage = {
    new: filteredProspects.filter(p => p.stage === "new"),
    contacted: filteredProspects.filter(p => p.stage === "contacted"),
    scheduled: filteredProspects.filter(p => p.stage === "scheduled"),
    planSent: filteredProspects.filter(p => p.stage === "planSent"),
    converted: filteredProspects.filter(p => p.stage === "converted"),
    lost: filteredProspects.filter(p => p.stage === "lost"),
  };
  
  // Calculate metrics
  const calculateMetrics = () => {
    // Count uncontacted leads < 1 hour old
    const uncontactedLeads = prospects.filter(p => 
      p.stage === "new" && 
      getWaitTimeInMinutes(p.createdAt) < 60
    );
    
    // Calculate average wait time for new leads
    const waitTimes = uncontactedLeads.map(p => getWaitTimeInMinutes(p.createdAt));
    const avgWaitTime = waitTimes.length > 0 
      ? Math.round(waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length) 
      : 0;
    
    // Calculate conversion rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentProspects = prospects.filter(p => 
      new Date(p.createdAt) >= thirtyDaysAgo
    );
    
    const convertedProspects = recentProspects.filter(p => p.stage === "converted");
    const conversionRate = recentProspects.length > 0 
      ? Math.round((convertedProspects.length / recentProspects.length) * 100) 
      : 0;
    
    // Calculate average response time
    const responseTimeMinutes = prospects
      .filter(p => p.lastContactedAt)
      .map(p => formatResponseTime(p.createdAt, p.lastContactedAt));
    
    const avgResponseTime = responseTimeMinutes.length > 0 
      ? Math.round(responseTimeMinutes.reduce((sum, time) => sum + time, 0) / responseTimeMinutes.length) 
      : 0;
    
    return {
      uncontactedCount: uncontactedLeads.length,
      avgWaitMinutes: avgWaitTime,
      conversionRate,
      avgResponseMinutes: avgResponseTime
    };
  };
  
  const { uncontactedCount, avgWaitMinutes, conversionRate, avgResponseMinutes } = calculateMetrics();
  
  // Calculate pipeline values
  const calculatePipelineValues = (stage: ProspectStage) => {
    const stageProspects = prospectsByStage[stage];
    const total = stageProspects.reduce((sum, p) => sum + p.value, 0);
    return total;
  };
  
  // Bulk actions
  const handleBulkSMS = () => {
    setIsSMSModalOpen(true);
  };
  
  const handleBulkSMSSend = () => {
    // In a real app, this would send SMS to selected prospects
    toast({
      title: "SMS Sent",
      description: `Bulk SMS sent to ${selectedProspects.length} prospects.`
    });
    
    setIsSMSModalOpen(false);
    setSelectedProspects([]);
  };
  
  const handleBulkAssignProvider = () => {
    setIsProviderModalOpen(true);
  };
  
  const handleProviderAssign = () => {
    // In a real app, this would assign the provider to selected prospects
    const updated = prospects.map(p => {
      if (selectedProspects.includes(p.id)) {
        return { ...p, provider: selectedProvider };
      }
      return p;
    });
    
    setProspects(updated);
    
    toast({
      title: "Provider Assigned",
      description: `${selectedProvider} assigned to ${selectedProspects.length} prospects.`
    });
    
    setIsProviderModalOpen(false);
    setSelectedProspects([]);
    setSelectedProvider("");
  };
  
  const handleBulkArchive = () => {
    // In a real app, this would archive the selected prospects
    const updatedProspects = prospects.filter(p => !selectedProspects.includes(p.id));
    setProspects(updatedProspects);
    
    toast({
      title: "Prospects Archived",
      description: `${selectedProspects.length} prospects have been archived.`
    });
    
    setSelectedProspects([]);
  };
  
  // Send SMS template
  const sendSMSTemplate = (prospect: Prospect) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
    
    const firstName = prospect.name.split(' ')[0];
    
    // Add SMS to contact log
    const updatedProspects = prospects.map(p => {
      if (p.id === prospect.id) {
        const newContactLog = [
          ...p.contactLog,
          {
            id: p.contactLog.length + 1,
            type: "sms",
            timestamp: new Date().toISOString(),
            message: `Hi ${firstName}, we have a consult slot ${formattedDate}. Text YES to claim!`,
            direction: "outbound"
          }
        ];
        
        return {
          ...p,
          contactLog: newContactLog,
          lastContactedAt: new Date().toISOString(),
          contactAttempts: p.contactAttempts + 1
        };
      }
      return p;
    });
    
    setProspects(updatedProspects);
    
    if (selectedProspect && selectedProspect.id === prospect.id) {
      const updatedProspect = updatedProspects.find(p => p.id === prospect.id);
      if (updatedProspect) {
        setSelectedProspect(updatedProspect);
      }
    }
    
    toast({
      title: "SMS Sent",
      description: `Quick SMS template sent to ${firstName}.`
    });
  };
  
  // Schedule appointment
  const scheduleAppointment = (prospect: Prospect) => {
    // Calculate a future date for the appointment
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 5); // 5 days in the future
    
    // Update the prospect
    const updatedProspects = prospects.map(p => {
      if (p.id === prospect.id) {
        return {
          ...p,
          stage: "scheduled",
          appointmentDate: appointmentDate.toISOString(),
          provider: "Dr. Anderson", // Default provider
          lastContactedAt: new Date().toISOString(),
          contactLog: [
            ...p.contactLog,
            {
              id: p.contactLog.length + 1,
              type: "call",
              timestamp: new Date().toISOString(),
              message: "Scheduled consultation appointment with Dr. Anderson",
              direction: "outbound",
              duration: "3:15"
            }
          ]
        };
      }
      return p;
    });
    
    setProspects(updatedProspects);
    
    // Update the selected prospect if it's the one being modified
    if (selectedProspect && selectedProspect.id === prospect.id) {
      const updatedProspect = updatedProspects.find(p => p.id === prospect.id);
      if (updatedProspect) {
        setSelectedProspect(updatedProspect);
      }
    }
    
    toast({
      title: "Appointment Scheduled",
      description: `Consultation scheduled for ${prospect.name} with Dr. Anderson.`
    });
  };
  
  // Send treatment plan
  const sendTreatmentPlan = (prospect: Prospect) => {
    // Update the prospect
    const updatedProspects = prospects.map(p => {
      if (p.id === prospect.id) {
        return {
          ...p,
          stage: "planSent",
          planSentDate: new Date().toISOString(),
          lastContactedAt: new Date().toISOString(),
          contactLog: [
            ...p.contactLog,
            {
              id: p.contactLog.length + 1,
              type: "email",
              timestamp: new Date().toISOString(),
              message: `Sent treatment plan for ${p.procedureInterest} with pricing options`,
              direction: "outbound"
            }
          ]
        };
      }
      return p;
    });
    
    setProspects(updatedProspects);
    
    // Update the selected prospect if it's the one being modified
    if (selectedProspect && selectedProspect.id === prospect.id) {
      const updatedProspect = updatedProspects.find(p => p.id === prospect.id);
      if (updatedProspect) {
        setSelectedProspect(updatedProspect);
      }
    }
    
    toast({
      title: "Treatment Plan Sent",
      description: `Treatment plan has been sent to ${prospect.name}.`
    });
  };
  
  // Mark as converted
  const markAsConverted = (prospect: Prospect) => {
    updateProspectStage(prospect.id, "converted");
  };
  
  // Toggle filter rail
  const toggleFilterRail = () => {
    setShowFilterRail(!showFilterRail);
  };
  
  // Update filters
  const toggleSourceFilter = (source: string) => {
    setFilters(prev => {
      const newSources = prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source];
      
      return {
        ...prev,
        sources: newSources
      };
    });
  };
  
  const toggleProcedureFilter = (procedure: string) => {
    setFilters(prev => {
      const newProcedures = prev.procedures.includes(procedure)
        ? prev.procedures.filter(p => p !== procedure)
        : [...prev.procedures, procedure];
      
      return {
        ...prev,
        procedures: newProcedures
      };
    });
  };
  
  const handleValueRangeChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      valueRange: [values[0], values[1]]
    }));
  };
  
  const setWaitTimeFilter = (waitTime: "all" | "lessThan15" | "15to60" | "moreThan60") => {
    setFilters(prev => ({
      ...prev,
      waitTime
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      sources: [],
      procedures: [],
      valueRange: [0, 10000],
      waitTime: "all",
      showArchived: false
    });
  };
  
  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Prospects Pipeline</h1>
            
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" onClick={toggleFilterRail}>
                <Filter className="h-4 w-4 mr-2" />
                {showFilterRail ? "Hide Filters" : "Show Filters"}
                {filters.sources.length > 0 || filters.procedures.length > 0 || filters.waitTime !== "all" ? (
                  <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">
                    {(filters.sources.length > 0 ? 1 : 0) + 
                     (filters.procedures.length > 0 ? 1 : 0) + 
                     (filters.waitTime !== "all" ? 1 : 0)}
                  </Badge>
                ) : null}
              </Button>
              
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Prospect
              </Button>
            </div>
          </div>
          
          {/* Hero KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Uncontacted Leads Card */}
            <Card className={`shadow-sm border-t-4 ${
              uncontactedCount >= 6 ? 'border-t-red-400' : 
              uncontactedCount >= 3 ? 'border-t-amber-400' : 
              'border-t-gray-200'
            } flex flex-col`}>
              <CardHeader className={`py-3 px-5 border-b ${
                uncontactedCount >= 6 ? 'bg-red-50/50' : 
                uncontactedCount >= 3 ? 'bg-amber-50/50' : 
                'bg-gray-50'
              }`}>
                <CardTitle className="text-base font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-slate-600" />
                  Uncontacted {'<'} 1 h
                </CardTitle>
              </CardHeader>
              <CardContent className="py-5 px-5 flex-1 flex flex-col">
                {uncontactedCount > 0 ? (
                  <div>
                    <div className={`text-2xl font-bold flex items-center justify-between mb-1 ${
                      uncontactedCount >= 6 ? 'text-red-600' : 
                      uncontactedCount >= 3 ? 'text-amber-600' : 
                      'text-gray-700'
                    }`}>
                      <span>{uncontactedCount} leads waiting</span>
                      <ChevronRight className={`h-5 w-5 ${
                        uncontactedCount >= 6 ? 'text-red-500' : 
                        uncontactedCount >= 3 ? 'text-amber-500' : 
                        'text-gray-400'
                      }`} />
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      avg {avgWaitMinutes} min waiting
                    </div>
                    
                    <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          uncontactedCount >= 6 ? 'bg-red-500' : 
                          uncontactedCount >= 3 ? 'bg-amber-500' : 
                          'bg-gray-400'
                        }`}
                        style={{ width: `${Math.min((uncontactedCount / 10) * 100, 100)}%` }}>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 mb-4 text-sm">
                    <Check className="h-4 w-4 mr-1" />
                    <span>All new inquiries answered—pipeline humming.</span>
                  </div>
                )}
                
                <div className="mt-auto">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                    disabled={uncontactedCount === 0}
                  >
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Conversion Rate Card */}
            <Card className={`shadow-sm border-t-4 ${
              conversionRate >= 50 ? 'border-t-emerald-400' : 'border-t-gray-200'
            } flex flex-col`}>
              <CardHeader className={`py-3 px-5 border-b ${
                conversionRate >= 50 ? 'bg-emerald-50/50' : 'bg-gray-50'
              }`}>
                <CardTitle className="text-base font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-slate-600" />
                  Conversion Rate (30 d)
                </CardTitle>
              </CardHeader>
              <CardContent className="py-5 px-5 flex-1 flex flex-col">
                <div>
                  <div className={`text-2xl font-bold flex items-center justify-between mb-1 ${
                    conversionRate >= 50 ? 'text-emerald-600' : 'text-gray-700'
                  }`}>
                    <span>{conversionRate}% booked to consult</span>
                    <ChevronRight className={`h-5 w-5 ${
                      conversionRate >= 50 ? 'text-emerald-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Goal: 50% conversion rate
                  </div>
                  
                  <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        conversionRate >= 50 ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min(conversionRate, 100)}%` }}>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    View Lost Reasons
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Response Time Card */}
            <Card className={`shadow-sm border-t-4 ${
              avgResponseMinutes > 60 ? 'border-t-red-400' : 
              avgResponseMinutes > 15 ? 'border-t-amber-400' : 
              'border-t-emerald-400'
            } flex flex-col`}>
              <CardHeader className={`py-3 px-5 border-b ${
                avgResponseMinutes > 60 ? 'bg-red-50/50' : 
                avgResponseMinutes > 15 ? 'bg-amber-50/50' : 
                'bg-emerald-50/50'
              }`}>
                <CardTitle className="text-base font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-slate-600" />
                  Avg. Response Time
                </CardTitle>
              </CardHeader>
              <CardContent className="py-5 px-5 flex-1 flex flex-col">
                <div>
                  <div className={`text-2xl font-bold flex items-center justify-between mb-1 ${
                    avgResponseMinutes > 60 ? 'text-red-600' : 
                    avgResponseMinutes > 15 ? 'text-amber-600' : 
                    'text-emerald-600'
                  }`}>
                    <span>{avgResponseMinutes} min</span>
                    <ChevronRight className={`h-5 w-5 ${
                      avgResponseMinutes > 60 ? 'text-red-500' : 
                      avgResponseMinutes > 15 ? 'text-amber-500' : 
                      'text-emerald-500'
                    }`} />
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Goal: 15 min response time
                  </div>
                  
                  <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        avgResponseMinutes > 60 ? 'bg-red-500' : 
                        avgResponseMinutes > 15 ? 'bg-amber-500' : 
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min((avgResponseMinutes / 120) * 100, 100)}%` }}>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                  >
                    Auto-SMS Offers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex">
            {/* Filter Rail */}
            {showFilterRail && (
              <div className="w-60 bg-white p-4 rounded-l-lg border-r border-y shadow-sm mr-4 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters} disabled={filters.sources.length === 0 && filters.procedures.length === 0 && filters.waitTime === "all"}>
                    Clear
                  </Button>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Source</h4>
                  <div className="space-y-2">
                    {sourceOptions.map(source => (
                      <div key={source} className="flex items-center">
                        <Checkbox 
                          id={`source-${source}`} 
                          checked={filters.sources.includes(source)}
                          onCheckedChange={() => toggleSourceFilter(source)}
                          className="mr-2"
                        />
                        <label htmlFor={`source-${source}`} className="text-sm">{source}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Procedure</h4>
                  <div className="space-y-2">
                    {procedureOptions.map(procedure => (
                      <div key={procedure} className="flex items-center">
                        <Checkbox 
                          id={`procedure-${procedure}`} 
                          checked={filters.procedures.includes(procedure)}
                          onCheckedChange={() => toggleProcedureFilter(procedure)}
                          className="mr-2"
                        />
                        <label htmlFor={`procedure-${procedure}`} className="text-sm">{procedure}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Value Range</h4>
                  <div className="px-1">
                    <Slider 
                      value={[filters.valueRange[0], filters.valueRange[1]]}
                      min={0}
                      max={10000}
                      step={500}
                      onValueChange={handleValueRangeChange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${filters.valueRange[0]}</span>
                      <span>${filters.valueRange[1]}+</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Uncontacted Time</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="wait-all" 
                        name="waitTime" 
                        value="all"
                        checked={filters.waitTime === "all"}
                        onChange={() => setWaitTimeFilter("all")}
                        className="mr-2"
                      />
                      <label htmlFor="wait-all" className="text-sm">All times</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="wait-lt15" 
                        name="waitTime" 
                        value="lessThan15"
                        checked={filters.waitTime === "lessThan15"}
                        onChange={() => setWaitTimeFilter("lessThan15")}
                        className="mr-2"
                      />
                      <label htmlFor="wait-lt15" className="text-sm">{'<'} 15 min</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="wait-15to60" 
                        name="waitTime" 
                        value="15to60"
                        checked={filters.waitTime === "15to60"}
                        onChange={() => setWaitTimeFilter("15to60")}
                        className="mr-2"
                      />
                      <label htmlFor="wait-15to60" className="text-sm">15-60 min</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="wait-gt60" 
                        name="waitTime" 
                        value="moreThan60"
                        checked={filters.waitTime === "moreThan60"}
                        onChange={() => setWaitTimeFilter("moreThan60")}
                        className="mr-2"
                      />
                      <label htmlFor="wait-gt60" className="text-sm">{'>'} 1 hour</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Kanban Pipeline Board */}
            <div className="flex-1 bg-white rounded-lg shadow-sm">
              <DndContext 
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="flex h-full">
                  {/* New Inquiry Column */}
                  <div 
                    id="new" 
                    className="flex-1 min-w-64 border-r p-3 h-full"
                  >
                    <div className="flex justify-between items-center mb-3 px-1 sticky top-0 bg-white pb-2 border-b">
                      <div>
                        <h3 className="font-medium">New Inquiry</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{prospectsByStage.new.length} leads</span>
                          {calculatePipelineValues("new") > 0 && (
                            <>
                              <span className="mx-1">•</span>
                              <span>${calculatePipelineValues("new").toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {prospectsByStage.new.length > 5 && (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                          5+ WIP
                        </Badge>
                      )}
                    </div>
                    
                    {prospectsByStage.new.length > 0 ? (
                      <div>
                        {prospectsByStage.new.map(prospect => (
                          <div key={prospect.id} className="mb-2">
                            <div 
                              className="flex items-center"
                              onClick={() => toggleProspectSelection(prospect.id)}
                            >
                              <Checkbox 
                                checked={selectedProspects.includes(prospect.id)}
                                onCheckedChange={() => toggleProspectSelection(prospect.id)}
                                className="mr-2"
                              />
                              <div className="flex-1">
                                <ProspectCard 
                                  prospect={prospect} 
                                  onClick={() => handleProspectClick(prospect)}
                                  isSelected={selectedProspects.includes(prospect.id)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No leads here — victory!
                      </div>
                    )}
                  </div>
                  
                  {/* Contacted Column */}
                  <div 
                    id="contacted" 
                    className="flex-1 min-w-64 border-r p-3 h-full"
                  >
                    <div className="flex justify-between items-center mb-3 px-1 sticky top-0 bg-white pb-2 border-b">
                      <div>
                        <h3 className="font-medium">Contacted</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{prospectsByStage.contacted.length} leads</span>
                          {calculatePipelineValues("contacted") > 0 && (
                            <>
                              <span className="mx-1">•</span>
                              <span>${calculatePipelineValues("contacted").toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {prospectsByStage.contacted.length > 10 && (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                          Risk of stagnation—clear 3 today
                        </Badge>
                      )}
                    </div>
                    
                    {prospectsByStage.contacted.length > 0 ? (
                      <div>
                        {prospectsByStage.contacted.map(prospect => (
                          <div key={prospect.id} className="mb-2">
                            <div 
                              className="flex items-center"
                              onClick={() => toggleProspectSelection(prospect.id)}
                            >
                              <Checkbox 
                                checked={selectedProspects.includes(prospect.id)}
                                onCheckedChange={() => toggleProspectSelection(prospect.id)}
                                className="mr-2"
                              />
                              <div className="flex-1">
                                <ProspectCard 
                                  prospect={prospect} 
                                  onClick={() => handleProspectClick(prospect)}
                                  isSelected={selectedProspects.includes(prospect.id)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No leads here — victory!
                      </div>
                    )}
                  </div>
                  
                  {/* Scheduled Column */}
                  <div 
                    id="scheduled" 
                    className="flex-1 min-w-64 border-r p-3 h-full"
                  >
                    <div className="flex justify-between items-center mb-3 px-1 sticky top-0 bg-white pb-2 border-b">
                      <div>
                        <h3 className="font-medium">Consult Scheduled</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{prospectsByStage.scheduled.length} leads</span>
                          {calculatePipelineValues("scheduled") > 0 && (
                            <>
                              <span className="mx-1">•</span>
                              <span>${calculatePipelineValues("scheduled").toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {prospectsByStage.scheduled.length > 0 ? (
                      <div>
                        {prospectsByStage.scheduled.map(prospect => (
                          <div key={prospect.id} className="mb-2">
                            <div 
                              className="flex items-center"
                              onClick={() => toggleProspectSelection(prospect.id)}
                            >
                              <Checkbox 
                                checked={selectedProspects.includes(prospect.id)}
                                onCheckedChange={() => toggleProspectSelection(prospect.id)}
                                className="mr-2"
                              />
                              <div className="flex-1">
                                <ProspectCard 
                                  prospect={prospect} 
                                  onClick={() => handleProspectClick(prospect)}
                                  isSelected={selectedProspects.includes(prospect.id)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No leads here — victory!
                      </div>
                    )}
                  </div>
                  
                  {/* Plan Sent Column */}
                  <div 
                    id="planSent" 
                    className="flex-1 min-w-64 border-r p-3 h-full"
                  >
                    <div className="flex justify-between items-center mb-3 px-1 sticky top-0 bg-white pb-2 border-b">
                      <div>
                        <h3 className="font-medium">Plan Sent</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{prospectsByStage.planSent.length} leads</span>
                          {calculatePipelineValues("planSent") > 0 && (
                            <>
                              <span className="mx-1">•</span>
                              <span>${calculatePipelineValues("planSent").toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {prospectsByStage.planSent.length > 0 ? (
                      <div>
                        {prospectsByStage.planSent.map(prospect => (
                          <div key={prospect.id} className="mb-2">
                            <div 
                              className="flex items-center"
                              onClick={() => toggleProspectSelection(prospect.id)}
                            >
                              <Checkbox 
                                checked={selectedProspects.includes(prospect.id)}
                                onCheckedChange={() => toggleProspectSelection(prospect.id)}
                                className="mr-2"
                              />
                              <div className="flex-1">
                                <ProspectCard 
                                  prospect={prospect} 
                                  onClick={() => handleProspectClick(prospect)}
                                  isSelected={selectedProspects.includes(prospect.id)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No leads here — victory!
                      </div>
                    )}
                  </div>
                  
                  {/* Converted/Lost Column */}
                  <div 
                    id="converted" 
                    className="flex-1 min-w-64 p-3 h-full"
                  >
                    <div className="flex justify-between items-center mb-3 px-1 sticky top-0 bg-white pb-2 border-b">
                      <div>
                        <h3 className="font-medium">Converted / Lost</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>
                            {prospectsByStage.converted.length + prospectsByStage.lost.length} leads
                          </span>
                          {calculatePipelineValues("converted") > 0 && (
                            <>
                              <span className="mx-1">•</span>
                              <span>${calculatePipelineValues("converted").toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {prospectsByStage.converted.length > 0 || prospectsByStage.lost.length > 0 ? (
                      <div>
                        {prospectsByStage.converted.map(prospect => (
                          <div key={prospect.id} className="mb-2">
                            <div 
                              className="flex items-center"
                              onClick={() => toggleProspectSelection(prospect.id)}
                            >
                              <Checkbox 
                                checked={selectedProspects.includes(prospect.id)}
                                onCheckedChange={() => toggleProspectSelection(prospect.id)}
                                className="mr-2"
                              />
                              <div className="flex-1">
                                <ProspectCard 
                                  prospect={prospect} 
                                  onClick={() => handleProspectClick(prospect)}
                                  isSelected={selectedProspects.includes(prospect.id)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {prospectsByStage.lost.map(prospect => (
                          <div key={prospect.id} className="mb-2">
                            <div 
                              className="flex items-center"
                              onClick={() => toggleProspectSelection(prospect.id)}
                            >
                              <Checkbox 
                                checked={selectedProspects.includes(prospect.id)}
                                onCheckedChange={() => toggleProspectSelection(prospect.id)}
                                className="mr-2"
                              />
                              <div className="flex-1">
                                <ProspectCard 
                                  prospect={prospect} 
                                  onClick={() => handleProspectClick(prospect)}
                                  isSelected={selectedProspects.includes(prospect.id)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Closing the deal — waiting for conversions
                      </div>
                    )}
                  </div>
                </div>
              </DndContext>
            </div>
          </div>
        </div>
        
        {/* Bulk Action Bar (Fixed at bottom) */}
        {selectedProspects.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 z-40">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <span className="font-medium">{selectedProspects.length} prospects selected</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkSMS}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS Offer
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleBulkAssignProvider}>
                  <User className="h-4 w-4 mr-2" />
                  Assign to Provider
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleBulkArchive}>
                  <Trash className="h-4 w-4 mr-2" />
                  Archive Lost
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Prospect Details Drawer */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent className="w-[400px] sm:max-w-[400px] p-0">
            {selectedProspect && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold mr-2">
                        {selectedProspect.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <h3 className="text-lg font-medium">{selectedProspect.name}</h3>
                    </div>
                    
                    <div className="text-xs px-2 py-1 rounded-full bg-muted">
                      {selectedProspect.stage === "new" && "New Inquiry"}
                      {selectedProspect.stage === "contacted" && "Contacted"}
                      {selectedProspect.stage === "scheduled" && "Consult Scheduled"}
                      {selectedProspect.stage === "planSent" && "Plan Sent"}
                      {selectedProspect.stage === "converted" && "Converted"}
                      {selectedProspect.stage === "lost" && "Lost"}
                    </div>
                  </div>
                  
                  <div className="text-muted-foreground text-sm mb-3">
                    <div className="flex items-center gap-4">
                      <span>Source: {selectedProspect.source}</span>
                      <span>${selectedProspect.value}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-1">
                    <Button size="sm" variant="ghost" className="flex-1 h-8">
                      <Phone className="h-3.5 w-3.5 mr-1.5" />
                      Call
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1 h-8" onClick={() => sendSMSTemplate(selectedProspect)}>
                      <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                      SMS
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1 h-8">
                      <Mail className="h-3.5 w-3.5 mr-1.5" />
                      Email
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Lead Details</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <div>{selectedProspect.phone}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <div className="truncate">{selectedProspect.email}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Procedure:</span>
                        <div>{selectedProspect.procedureInterest}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Value:</span>
                        <div>${selectedProspect.value}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <div>{formatTimeAgo(selectedProspect.createdAt)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div className="capitalize">{selectedProspect.stage}</div>
                      </div>
                      
                      {selectedProspect.appointmentDate && (
                        <div>
                          <span className="text-muted-foreground">Appointment:</span>
                          <div>{new Date(selectedProspect.appointmentDate).toLocaleDateString()}</div>
                        </div>
                      )}
                      
                      {selectedProspect.provider && (
                        <div>
                          <span className="text-muted-foreground">Provider:</span>
                          <div>{selectedProspect.provider}</div>
                        </div>
                      )}
                      
                      {selectedProspect.lostReason && (
                        <div>
                          <span className="text-muted-foreground">Lost Reason:</span>
                          <div>{selectedProspect.lostReason}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Contact Log</h4>
                    <div className="space-y-3">
                      {selectedProspect.contactLog.map((entry, idx) => (
                        <div key={idx} className="text-sm border-l-2 pl-3 pb-2 relative">
                          <div className={`absolute w-2 h-2 rounded-full -left-[5px] top-1 ${
                            entry.direction === "inbound" ? "bg-blue-500" : "bg-emerald-500"
                          }`}></div>
                          
                          <div className="flex justify-between items-start">
                            <div className="font-medium flex items-center">
                              {entry.type === "call" && <Phone className="h-3 w-3 mr-1" />}
                              {entry.type === "sms" && <MessageSquare className="h-3 w-3 mr-1" />}
                              {entry.type === "email" && <Mail className="h-3 w-3 mr-1" />}
                              <span className="capitalize">{entry.type}</span>
                              <span className="mx-1">•</span>
                              <span className={entry.direction === "inbound" ? "text-blue-600" : "text-emerald-600"}>
                                {entry.direction === "inbound" ? "Received" : "Sent"}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimeAgo(entry.timestamp)}
                            </div>
                          </div>
                          
                          <div className="mt-1 text-muted-foreground">
                            {entry.message}
                          </div>
                          
                          {entry.duration && (
                            <div className="text-xs mt-1">
                              Duration: {entry.duration}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t mt-auto">
                  <div className="flex justify-between gap-2 mb-2">
                    {selectedProspect.stage === "new" && (
                      <Button className="flex-1" onClick={() => updateProspectStage(selectedProspect.id, "contacted")}>
                        Mark Contacted
                      </Button>
                    )}
                    
                    {(selectedProspect.stage === "new" || selectedProspect.stage === "contacted") && (
                      <Button className="flex-1" onClick={() => scheduleAppointment(selectedProspect)}>
                        Book Consult
                      </Button>
                    )}
                    
                    {selectedProspect.stage === "scheduled" && (
                      <Button className="flex-1" onClick={() => sendTreatmentPlan(selectedProspect)}>
                        Send Plan
                      </Button>
                    )}
                    
                    {selectedProspect.stage === "planSent" && (
                      <Button className="flex-1" onClick={() => markAsConverted(selectedProspect)}>
                        Mark Converted
                      </Button>
                    )}
                  </div>
                  
                  {selectedProspect.stage !== "lost" && selectedProspect.stage !== "converted" && (
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setIsLostReasonModalOpen(true)}
                    >
                      Mark as Lost
                    </Button>
                  )}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
        
        {/* Lost Reason Modal */}
        <Dialog open={isLostReasonModalOpen} onOpenChange={setIsLostReasonModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark as Lost</DialogTitle>
              <DialogDescription>
                Please select a reason why this prospect was lost.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <Select value={lostReason} onValueChange={setLostReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {lostReasonOptions.map(reason => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLostReasonModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleLostReasonSubmit} disabled={!lostReason}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* SMS Template Modal */}
        <Dialog open={isSMSModalOpen} onOpenChange={setIsSMSModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send SMS Template</DialogTitle>
              <DialogDescription>
                Send a quick SMS template to {selectedProspects.length} prospects.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <Select defaultValue="template1">
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template1">Consultation Offer</SelectItem>
                  <SelectItem value="template2">Follow Up</SelectItem>
                  <SelectItem value="template3">Discount Offer</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Preview:</p>
                <p>Hi {'{first}'}, we have a consult slot {'{date time}'}. Text YES to claim!</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSMSModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkSMSSend}>
                Send to {selectedProspects.length} prospects
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Provider Assignment Modal */}
        <Dialog open={isProviderModalOpen} onOpenChange={setIsProviderModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Provider</DialogTitle>
              <DialogDescription>
                Assign a provider to {selectedProspects.length} prospects.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providerOptions.map(provider => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProviderModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleProviderAssign} disabled={!selectedProvider}>
                Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </NavigationWrapper>
  );
}