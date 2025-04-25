import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger, 
  SheetClose,
  SheetFooter 
} from "@/components/ui/sheet";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
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
  ChevronDown, 
  ChevronRight, 
  ChevronUp,
  Calendar,
  Filter,
  Search,
  Pencil, 
  Mail, 
  Camera, 
  Merge,
  X, 
  Check, 
  AlertCircle, 
  FileText, 
  Phone, 
  Info, 
  User as UserIcon,
  FilePlus,
  Printer,
  MessageSquare,
  Send,
  RefreshCw,
  Save,
  ClipboardCheck as ClipboardList,
  Zap,
} from "lucide-react";
import JSConfetti from 'js-confetti';

// Data types and mock data
type GapCategory = "insurance" | "demographics" | "clinical" | "consent" | "compliance" | "duplicate";
type GapSeverity = "claims-blocking" | "safety" | "contact" | "minor";
type GapStatus = "open" | "requested" | "fixed" | "ignored";

interface DataGap {
  id: number;
  patientId: number;
  patientName: string;
  patientMRN: string;
  category: GapCategory;
  detail: string;
  createdAt: string;
  severity: GapSeverity;
  nextAppointment?: string;
  status: GapStatus;
  value?: string;
  fixActions: ("edit" | "request" | "capture" | "merge")[];
}

interface Patient {
  id: number;
  name: string;
  mrn: string;
  dob?: string;
  phone?: string;
  email?: string;
  upcomingAppointment?: string;
  insuranceInfo?: {
    provider?: string;
    policyNumber?: string;
    expirationDate?: string;
    subscriberDob?: string;
  };
  clinicalInfo?: {
    allergies?: string[];
    medications?: string[];
    height?: string;
    weight?: string;
  };
  consentInfo?: {
    hipaaSignedAt?: string;
    financialPolicySignedAt?: string;
    photoIdUploaded?: boolean;
  };
  complianceInfo?: {
    privacyAcknowledged?: boolean;
    contactPreference?: string;
  };
  potentialDuplicateIds?: number[];
}

// Generate mock data
const generateMockPatients = (): Patient[] => {
  return [
    {
      id: 1,
      name: "John Smith",
      mrn: "MRN00123",
      dob: "1985-06-15",
      phone: "555-123-4567",
      email: "john.smith@example.com",
      upcomingAppointment: "2025-05-02T10:30:00",
      insuranceInfo: {
        provider: "Blue Cross",
        policyNumber: "BC12345678",
        expirationDate: "2026-01-01",
        subscriberDob: "1985-06-15"
      },
      clinicalInfo: {
        allergies: ["Penicillin", "Peanuts"],
        medications: ["Lisinopril", "Metformin"],
        height: "180 cm",
        weight: "82 kg"
      },
      consentInfo: {
        hipaaSignedAt: "2024-01-15T09:45:00",
        financialPolicySignedAt: "2024-01-15T09:50:00",
        photoIdUploaded: true
      },
      complianceInfo: {
        privacyAcknowledged: true,
        contactPreference: "Email"
      }
    },
    {
      id: 2,
      name: "Emily Johnson",
      mrn: "MRN00124",
      dob: "1992-03-22",
      phone: "555-987-6543",
      email: "emily.johnson@example.com",
      upcomingAppointment: "2025-05-05T14:00:00",
      insuranceInfo: {
        provider: "Aetna",
        policyNumber: "", // Missing policy number
        expirationDate: "2025-12-31",
        subscriberDob: "1992-03-22"
      },
      clinicalInfo: {
        allergies: [], // Missing allergies
        medications: ["Atorvastatin"],
        height: "165 cm",
        weight: "60 kg"
      },
      consentInfo: {
        hipaaSignedAt: "2024-02-10T11:30:00",
        financialPolicySignedAt: "2024-02-10T11:35:00",
        photoIdUploaded: true
      },
      complianceInfo: {
        privacyAcknowledged: true,
        contactPreference: "Phone"
      }
    },
    {
      id: 3,
      name: "Michael Davis",
      mrn: "MRN00125",
      dob: "1978-11-08",
      phone: "555-555-5555", // Invalid phone
      email: "michael.davis@example.com",
      upcomingAppointment: "2025-05-08T09:15:00",
      insuranceInfo: {
        provider: "UnitedHealth",
        policyNumber: "UH98765432",
        expirationDate: "2025-01-15", // Expired insurance
        subscriberDob: "1978-11-08"
      },
      clinicalInfo: {
        allergies: ["Sulfa"],
        medications: ["Atenolol", "Simvastatin"],
        height: "175 cm",
        weight: "78 kg"
      },
      consentInfo: {
        hipaaSignedAt: "2023-06-20T10:15:00", // Expired consent
        financialPolicySignedAt: "2023-06-20T10:20:00", // Expired
        photoIdUploaded: true
      },
      complianceInfo: {
        privacyAcknowledged: false, // Missing acknowledgment
        contactPreference: "Email"
      }
    },
    {
      id: 4,
      name: "Sarah Wilson",
      mrn: "MRN00126",
      dob: "1990-07-14",
      phone: "555-456-7890",
      email: "sarah.wilson@invalidmail", // Invalid email
      insuranceInfo: {
        provider: "Cigna",
        policyNumber: "CG87654321",
        expirationDate: "2025-10-31",
        subscriberDob: "" // Missing subscriber DOB
      },
      clinicalInfo: {
        allergies: [], // Missing allergies
        medications: [], // Missing medications
        height: "",
        weight: ""
      },
      consentInfo: {
        hipaaSignedAt: "2024-03-05T13:45:00",
        financialPolicySignedAt: "2024-03-05T13:50:00",
        photoIdUploaded: false // Missing photo ID
      },
      complianceInfo: {
        privacyAcknowledged: true,
        contactPreference: "" // Missing preference
      }
    },
    {
      id: 5,
      name: "Alex Brown",
      mrn: "MRN00127",
      // Missing DOB
      phone: "555-234-5678",
      email: "alex.brown@example.com",
      upcomingAppointment: "2025-05-12T15:30:00",
      insuranceInfo: {
        provider: "Humana",
        policyNumber: "HU54321678",
        expirationDate: "2026-03-31",
        subscriberDob: "1988-09-25"
      },
      consentInfo: {
        hipaaSignedAt: "", // Missing HIPAA
        financialPolicySignedAt: "2024-01-20T10:15:00",
        photoIdUploaded: true
      },
      complianceInfo: {
        privacyAcknowledged: true,
        contactPreference: "SMS"
      }
    },
    {
      id: 6,
      name: "Jessica Taylor",
      mrn: "MRN00128",
      dob: "1982-05-30",
      phone: "555-876-5432",
      email: "jessica.taylor@example.com",
      upcomingAppointment: "2025-05-15T11:00:00",
      clinicalInfo: {
        allergies: ["Latex"],
        medications: ["Metoprolol"],
        height: "170 cm",
        weight: "65 kg"
      },
      consentInfo: {
        hipaaSignedAt: "2024-02-25T09:30:00",
        financialPolicySignedAt: "2024-02-25T09:35:00",
        photoIdUploaded: true
      },
      complianceInfo: {
        privacyAcknowledged: true,
        contactPreference: "Email"
      },
      potentialDuplicateIds: [7] // Potential duplicate
    },
    {
      id: 7,
      name: "Jessica T. Taylor",
      mrn: "MRN00129",
      dob: "1982-05-30",
      phone: "555-876-5432",
      email: "j.taylor@example.com",
      upcomingAppointment: "2025-05-20T13:45:00",
      insuranceInfo: {
        provider: "Cigna",
        policyNumber: "CG12398765",
        expirationDate: "2025-08-31",
        subscriberDob: "1982-05-30"
      },
      clinicalInfo: {
        allergies: ["Latex"],
        medications: ["Metoprolol"],
        height: "170 cm",
        weight: "65 kg"
      },
      consentInfo: {
        hipaaSignedAt: "2024-01-15T14:20:00",
        financialPolicySignedAt: "2024-01-15T14:25:00",
        photoIdUploaded: true
      },
      complianceInfo: {
        privacyAcknowledged: true,
        contactPreference: "Email"
      },
      potentialDuplicateIds: [6] // Potential duplicate
    },
    {
      id: 8,
      name: "Robert Clark",
      mrn: "MRN00130",
      dob: "1975-12-03",
      phone: "555-345-6789",
      email: "robert.clark@example.com",
      upcomingAppointment: "2025-05-18T10:15:00",
      insuranceInfo: {
        provider: "Kaiser",
        policyNumber: "KP76543210",
        expirationDate: "2026-02-28",
        subscriberDob: "1975-12-03"
      },
      clinicalInfo: {
        allergies: ["None"],
        medications: ["None"],
        height: "188 cm",
        weight: "90 kg"
      },
      consentInfo: {
        hipaaSignedAt: "2023-11-10T08:45:00", // Expired
        financialPolicySignedAt: "2023-11-10T08:50:00", // Expired
        photoIdUploaded: true
      },
      complianceInfo: {
        privacyAcknowledged: true,
        contactPreference: "Phone"
      }
    },
    {
      id: 9,
      name: "David Greene",
      mrn: "MRN00131",
      dob: "1995-08-17",
      phone: "555-654-3210",
      email: "david@example.com",
      insuranceInfo: {
        provider: "", // Missing insurance provider
        policyNumber: "",
        expirationDate: "",
        subscriberDob: ""
      },
      clinicalInfo: {
        allergies: [], // Missing allergies
        medications: [], // Missing meds
        height: "182 cm",
        weight: "75 kg"
      },
      consentInfo: {
        hipaaSignedAt: "2024-03-18T15:30:00",
        financialPolicySignedAt: "2024-03-18T15:35:00",
        photoIdUploaded: false // Missing photo ID
      },
      complianceInfo: {
        privacyAcknowledged: true,
        contactPreference: "SMS"
      }
    },
    {
      id: 10,
      name: "Olivia Martinez",
      mrn: "MRN00132",
      dob: "1989-02-14",
      phone: "555-789-0123",
      email: "bounced@example.com", // Bounced email
      upcomingAppointment: "2025-05-25T14:30:00",
      insuranceInfo: {
        provider: "Anthem",
        policyNumber: "AN24680135",
        expirationDate: "2026-04-30",
        subscriberDob: "1989-02-14"
      },
      clinicalInfo: {
        allergies: ["Ibuprofen"],
        medications: ["Levothyroxine"],
        height: "163 cm",
        weight: "58 kg"
      },
      consentInfo: {
        hipaaSignedAt: "2024-01-30T11:15:00",
        financialPolicySignedAt: "2024-01-30T11:20:00",
        photoIdUploaded: true
      },
      complianceInfo: {
        privacyAcknowledged: true,
        contactPreference: "Email" // Should be changed
      }
    }
  ];
};

// Create data gaps based on patient data
const generateDataGaps = (patients: Patient[]): DataGap[] => {
  const now = new Date();
  const gaps: DataGap[] = [];
  let gapId = 1;
  
  patients.forEach(patient => {
    // Check for missing insurance info
    if (!patient.insuranceInfo || !patient.insuranceInfo.provider) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "insurance",
        detail: "Missing insurance provider",
        createdAt: new Date(now.getTime() - 14 * 86400000).toISOString(), // 14 days ago
        severity: "claims-blocking",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["edit", "request"]
      });
    }
    
    if (patient.insuranceInfo && !patient.insuranceInfo.policyNumber) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "insurance",
        detail: "Missing policy number",
        createdAt: new Date(now.getTime() - 10 * 86400000).toISOString(), // 10 days ago
        severity: "claims-blocking",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["edit", "request", "capture"]
      });
    }
    
    if (patient.insuranceInfo && patient.insuranceInfo.expirationDate) {
      const expDate = new Date(patient.insuranceInfo.expirationDate);
      if (expDate < now) {
        gaps.push({
          id: gapId++,
          patientId: patient.id,
          patientName: patient.name,
          patientMRN: patient.mrn,
          category: "insurance",
          detail: "Expired insurance card",
          createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(), // 5 days ago
          severity: "claims-blocking",
          nextAppointment: patient.upcomingAppointment,
          status: "open",
          fixActions: ["capture", "request"]
        });
      }
    }
    
    if (patient.insuranceInfo && !patient.insuranceInfo.subscriberDob) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "insurance",
        detail: "Missing subscriber DOB",
        createdAt: new Date(now.getTime() - 21 * 86400000).toISOString(), // 21 days ago
        severity: "claims-blocking",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["edit", "request"]
      });
    }
    
    // Check for demographics issues
    if (!patient.dob) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "demographics",
        detail: "Missing date of birth",
        createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(), // 7 days ago
        severity: "minor",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["edit", "request"]
      });
    }
    
    if (patient.phone === "555-555-5555") {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "demographics",
        detail: "Invalid phone number",
        createdAt: new Date(now.getTime() - 30 * 86400000).toISOString(), // 30 days ago
        severity: "contact",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["edit", "request"]
      });
    }
    
    if (patient.email && (patient.email.includes("invalid") || patient.email.includes("bounced"))) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "demographics",
        detail: "Invalid/bounced email",
        createdAt: new Date(now.getTime() - 45 * 86400000).toISOString(), // 45 days ago
        severity: "contact",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["edit", "request"]
      });
    }
    
    // Check for clinical info
    if (!patient.clinicalInfo || !patient.clinicalInfo.allergies || patient.clinicalInfo.allergies.length === 0) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "clinical",
        detail: "Missing allergy list",
        createdAt: new Date(now.getTime() - 60 * 86400000).toISOString(), // 60 days ago
        severity: "safety",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["edit"]
      });
    }
    
    if (!patient.clinicalInfo || !patient.clinicalInfo.medications || patient.clinicalInfo.medications.length === 0) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "clinical",
        detail: "Missing medication list",
        createdAt: new Date(now.getTime() - 90 * 86400000).toISOString(), // 90 days ago
        severity: "safety",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["edit"]
      });
    }
    
    // Check for consent docs
    if (!patient.consentInfo || !patient.consentInfo.hipaaSignedAt) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "consent",
        detail: "Unsigned HIPAA form",
        createdAt: new Date(now.getTime() - 15 * 86400000).toISOString(), // 15 days ago
        severity: "minor",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["request"]
      });
    }
    
    if (patient.consentInfo && patient.consentInfo.hipaaSignedAt) {
      const hipaaDate = new Date(patient.consentInfo.hipaaSignedAt);
      if ((now.getTime() - hipaaDate.getTime()) > 365 * 86400000) { // More than a year old
        gaps.push({
          id: gapId++,
          patientId: patient.id,
          patientName: patient.name,
          patientMRN: patient.mrn,
          category: "consent",
          detail: "Expired HIPAA consent",
          createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(), // 5 days ago
          severity: "minor",
          nextAppointment: patient.upcomingAppointment,
          status: "open",
          fixActions: ["request"]
        });
      }
    }
    
    if (!patient.consentInfo || !patient.consentInfo.photoIdUploaded) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "consent",
        detail: "Missing photo ID",
        createdAt: new Date(now.getTime() - 20 * 86400000).toISOString(), // 20 days ago
        severity: "minor",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["capture"]
      });
    }
    
    // Check for compliance info
    if (!patient.complianceInfo || !patient.complianceInfo.privacyAcknowledged) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "compliance",
        detail: "Missing privacy acknowledgment",
        createdAt: new Date(now.getTime() - 25 * 86400000).toISOString(), // 25 days ago
        severity: "minor",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["edit"]
      });
    }
    
    if (!patient.complianceInfo || !patient.complianceInfo.contactPreference) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "compliance",
        detail: "Missing contact preference",
        createdAt: new Date(now.getTime() - 35 * 86400000).toISOString(), // 35 days ago
        severity: "contact",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["edit"]
      });
    }
    
    // Check for potential duplicates
    if (patient.potentialDuplicateIds && patient.potentialDuplicateIds.length > 0) {
      gaps.push({
        id: gapId++,
        patientId: patient.id,
        patientName: patient.name,
        patientMRN: patient.mrn,
        category: "duplicate",
        detail: "Potential duplicate record",
        createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(), // 3 days ago
        severity: "minor",
        nextAppointment: patient.upcomingAppointment,
        status: "open",
        fixActions: ["merge"]
      });
    }
  });
  
  return gaps;
};

// Helper functions
const getCategoryLabel = (category: GapCategory): string => {
  switch (category) {
    case "insurance": return "Insurance";
    case "demographics": return "Demographics";
    case "clinical": return "Clinical";
    case "consent": return "Consent & Docs";
    case "compliance": return "Compliance";
    case "duplicate": return "Duplicate MRN";
  }
};

const getCategoryColor = (category: GapCategory): string => {
  switch (category) {
    case "insurance": return "bg-blue-100 text-blue-800";
    case "demographics": return "bg-amber-100 text-amber-800";
    case "clinical": return "bg-red-100 text-red-800";
    case "consent": return "bg-purple-100 text-purple-800";
    case "compliance": return "bg-gray-100 text-gray-800";
    case "duplicate": return "bg-gray-100 text-gray-800";
  }
};

const getSeverityLabel = (severity: GapSeverity): string => {
  switch (severity) {
    case "claims-blocking": return "Claims-Blocking";
    case "safety": return "Safety";
    case "contact": return "Contact";
    case "minor": return "Minor";
  }
};

const getSeverityColor = (severity: GapSeverity): string => {
  switch (severity) {
    case "claims-blocking": return "text-red-600";
    case "safety": return "text-red-600";
    case "contact": return "text-amber-600";
    case "minor": return "text-gray-600";
  }
};

const getGapAge = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
};

const formatGapAge = (createdAt: string): string => {
  const days = getGapAge(createdAt);
  return `${days} d`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "none";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const getStatusLabel = (status: GapStatus): string => {
  switch (status) {
    case "open": return "Open";
    case "requested": return "Requested";
    case "fixed": return "Fixed";
    case "ignored": return "Ignored";
  }
};

const getStatusColor = (status: GapStatus): string => {
  switch (status) {
    case "open": return "bg-red-100 text-red-800";
    case "requested": return "bg-amber-100 text-amber-800";
    case "fixed": return "bg-green-100 text-green-800";
    case "ignored": return "bg-gray-100 text-gray-800";
  }
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const getPatientById = (patients: Patient[], id: number): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

export default function DataGapsPage() {
  // State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dataGaps, setDataGaps] = useState<DataGap[]>([]);
  const [filteredGaps, setFilteredGaps] = useState<DataGap[]>([]);
  const [selectedGaps, setSelectedGaps] = useState<number[]>([]);
  const [expandedGaps, setExpandedGaps] = useState<number[]>([]);
  const [showFilterRail, setShowFilterRail] = useState(true);
  const [isFixDrawerOpen, setIsFixDrawerOpen] = useState(false);
  const [currentGap, setCurrentGap] = useState<DataGap | null>(null);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [fixValue, setFixValue] = useState("");
  
  // Filters
  const [filters, setFilters] = useState({
    categories: [] as GapCategory[],
    severities: [] as GapSeverity[],
    hasAppointment: false,
    ageOfGap: "all" as "all" | "new" | "medium" | "old",
    searchQuery: ""
  });
  
  const { toast } = useToast();
  
  // Initialize data
  useEffect(() => {
    const mockPatients = generateMockPatients();
    const mockGaps = generateDataGaps(mockPatients);
    setPatients(mockPatients);
    setDataGaps(mockGaps);
    setFilteredGaps(mockGaps);
  }, []);
  
  // Apply filters whenever they change
  useEffect(() => {
    let filtered = [...dataGaps];
    
    // Filter by category
    if (filters.categories.length > 0) {
      filtered = filtered.filter(gap => filters.categories.includes(gap.category));
    }
    
    // Filter by severity
    if (filters.severities.length > 0) {
      filtered = filtered.filter(gap => filters.severities.includes(gap.severity));
    }
    
    // Filter by appointment status
    if (filters.hasAppointment) {
      filtered = filtered.filter(gap => gap.nextAppointment !== undefined);
    }
    
    // Filter by age of gap
    if (filters.ageOfGap === "new") {
      filtered = filtered.filter(gap => getGapAge(gap.createdAt) < 30);
    } else if (filters.ageOfGap === "medium") {
      filtered = filtered.filter(gap => getGapAge(gap.createdAt) >= 30 && getGapAge(gap.createdAt) < 90);
    } else if (filters.ageOfGap === "old") {
      filtered = filtered.filter(gap => getGapAge(gap.createdAt) >= 90);
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(gap =>
        gap.patientName.toLowerCase().includes(query) ||
        gap.patientMRN.toLowerCase().includes(query) ||
        gap.detail.toLowerCase().includes(query)
      );
    }
    
    setFilteredGaps(filtered);
  }, [filters, dataGaps]);
  
  // Open fix drawer
  const openFixDrawer = (gap: DataGap) => {
    setCurrentGap(gap);
    const patient = getPatientById(patients, gap.patientId);
    setCurrentPatient(patient || null);
    setFixValue("");
    setIsFixDrawerOpen(true);
  };
  
  // Toggle filters
  const toggleCategory = (category: GapCategory) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return { ...prev, categories: newCategories };
    });
  };
  
  const toggleSeverity = (severity: GapSeverity) => {
    setFilters(prev => {
      const newSeverities = prev.severities.includes(severity)
        ? prev.severities.filter(s => s !== severity)
        : [...prev.severities, severity];
      
      return { ...prev, severities: newSeverities };
    });
  };
  
  const toggleHasAppointment = () => {
    setFilters(prev => ({ ...prev, hasAppointment: !prev.hasAppointment }));
  };
  
  const setAgeFilter = (ageOfGap: "all" | "new" | "medium" | "old") => {
    setFilters(prev => ({ ...prev, ageOfGap }));
  };
  
  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };
  
  const resetFilters = () => {
    setFilters({
      categories: [],
      severities: [],
      hasAppointment: false,
      ageOfGap: "all",
      searchQuery: ""
    });
  };
  
  // Toggle selected gaps for bulk actions
  const toggleGapSelection = (id: number) => {
    setSelectedGaps(prev => 
      prev.includes(id) 
        ? prev.filter(gapId => gapId !== id) 
        : [...prev, id]
    );
  };

  // Toggle expanded row
  const toggleExpandedRow = (id: number) => {
    setExpandedGaps(prev => 
      prev.includes(id) 
        ? prev.filter(gapId => gapId !== id) 
        : [...prev, id]
    );
  };
  
  const selectAll = () => {
    if (selectedGaps.length === filteredGaps.length) {
      setSelectedGaps([]);
    } else {
      setSelectedGaps(filteredGaps.map(gap => gap.id));
    }
  };
  
  // Fix a gap
  const fixGap = () => {
    if (!currentGap) return;
    
    // Update the gap status
    const updatedGaps = dataGaps.map(gap => {
      if (gap.id === currentGap.id) {
        return { ...gap, status: "fixed" as GapStatus, value: fixValue };
      }
      return gap;
    });
    
    setDataGaps(updatedGaps);
    
    // Show confetti and toast
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ['✅'],
      confettiNumber: 20,
    });
    
    toast({
      title: "Gap Fixed",
      description: `${currentGap.detail} has been fixed for ${currentGap.patientName}`,
    });
    
    setIsFixDrawerOpen(false);
  };
  
  // Request gap fix via email
  const sendEmailRequest = () => {
    if (!currentGap) return;
    
    // Update the gap status
    const updatedGaps = dataGaps.map(gap => {
      if (gap.id === currentGap.id) {
        return { ...gap, status: "requested" as GapStatus };
      }
      return gap;
    });
    
    setDataGaps(updatedGaps);
    
    toast({
      title: "Email Sent",
      description: `Email request sent to ${currentGap.patientName}`,
    });
    
    setIsEmailModalOpen(false);
    setIsFixDrawerOpen(false);
  };
  
  // Request gap fix via SMS
  const sendSMSRequest = () => {
    if (!currentGap) return;
    
    // Update the gap status
    const updatedGaps = dataGaps.map(gap => {
      if (gap.id === currentGap.id) {
        return { ...gap, status: "requested" as GapStatus };
      }
      return gap;
    });
    
    setDataGaps(updatedGaps);
    
    toast({
      title: "SMS Sent",
      description: `SMS request sent to ${currentGap.patientName}`,
    });
    
    setIsSMSModalOpen(false);
    setIsFixDrawerOpen(false);
  };
  
  // Merge duplicate records
  const mergeDuplicates = () => {
    if (!currentGap || !currentPatient) return;
    
    // Find the potential duplicate
    const duplicateId = currentPatient.potentialDuplicateIds?.[0];
    if (!duplicateId) return;
    
    // Update gaps to mark as fixed
    const updatedGaps = dataGaps.map(gap => {
      if (gap.patientId === currentGap.patientId && gap.category === "duplicate") {
        return { ...gap, status: "fixed" as GapStatus };
      }
      if (gap.patientId === duplicateId && gap.category === "duplicate") {
        return { ...gap, status: "fixed" as GapStatus };
      }
      return gap;
    });
    
    setDataGaps(updatedGaps);
    
    toast({
      title: "Records Merged",
      description: "Duplicate patient records have been merged",
    });
    
    setIsMergeModalOpen(false);
    setIsFixDrawerOpen(false);
  };
  
  // Bulk actions
  const sendBulkSMS = () => {
    // Update the gaps statuses
    const updatedGaps = dataGaps.map(gap => {
      if (selectedGaps.includes(gap.id)) {
        return { ...gap, status: "requested" as GapStatus };
      }
      return gap;
    });
    
    setDataGaps(updatedGaps);
    
    toast({
      title: "Bulk SMS Sent",
      description: `${selectedGaps.length} SMS update links sent to patients`,
    });
    
    setSelectedGaps([]);
  };
  
  const sendBulkEmail = () => {
    // Update the gaps statuses
    const updatedGaps = dataGaps.map(gap => {
      if (selectedGaps.includes(gap.id)) {
        return { ...gap, status: "requested" as GapStatus };
      }
      return gap;
    });
    
    setDataGaps(updatedGaps);
    
    toast({
      title: "Bulk Email Sent",
      description: `${selectedGaps.length} email update links sent to patients`,
    });
    
    setSelectedGaps([]);
  };
  
  const printForms = () => {
    toast({
      title: "Forms Printed",
      description: `${selectedGaps.length} forms have been sent to the printer`,
    });
    
    setSelectedGaps([]);
  };
  
  const markResolved = () => {
    // Update the gaps statuses
    const updatedGaps = dataGaps.map(gap => {
      if (selectedGaps.includes(gap.id)) {
        return { ...gap, status: "fixed" as GapStatus };
      }
      return gap;
    });
    
    setDataGaps(updatedGaps);
    
    toast({
      title: "Gaps Resolved",
      description: `${selectedGaps.length} gaps have been marked as resolved`,
    });
    
    setSelectedGaps([]);
  };
  
  // Calculate metrics for KPI cards
  const calculateMetrics = () => {
    // Count claims-blocking gaps
    const claimsBlockingGaps = dataGaps.filter(gap => 
      gap.severity === "claims-blocking" && gap.status === "open"
    );
    
    // Calculate the total value of claims at risk
    // We're estimating $300 per claim-blocking gap for this example
    const claimsAtRiskValue = claimsBlockingGaps.length * 300;
    
    // Count contact-blocking gaps
    const contactBlockingGaps = dataGaps.filter(gap => 
      gap.severity === "contact" && gap.status === "open"
    );
    
    // Count clinical-safety gaps
    const clinicalSafetyGaps = dataGaps.filter(gap => 
      gap.severity === "safety" && gap.status === "open"
    );
    
    return {
      claimsBlockingCount: claimsBlockingGaps.length,
      claimsAtRiskValue,
      contactBlockingCount: contactBlockingGaps.length,
      clinicalSafetyCount: clinicalSafetyGaps.length
    };
  };
  
  const { claimsBlockingCount, claimsAtRiskValue, contactBlockingCount, clinicalSafetyCount } = calculateMetrics();
  
  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Data Gaps</h1>
            
            <div className="flex items-center gap-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowFilterRail(!showFilterRail)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilterRail ? "Hide Filters" : "Show Filters"}
                {(filters.categories.length > 0 || filters.severities.length > 0 || filters.hasAppointment || filters.ageOfGap !== "all") && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.categories.length + 
                     filters.severities.length + 
                     (filters.hasAppointment ? 1 : 0) + 
                     (filters.ageOfGap !== "all" ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* Hero KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Claims-Blocking Gaps Card */}
            <Card className={`shadow-sm border-t-4 ${
              claimsBlockingCount >= 5 ? 'border-t-red-400' : 
              claimsBlockingCount >= 1 ? 'border-t-amber-400' : 
              'border-t-green-400'
            } flex flex-col`}>
              <CardHeader className={`py-3 px-5 border-b ${
                claimsBlockingCount >= 5 ? 'bg-red-50/50' : 
                claimsBlockingCount >= 1 ? 'bg-amber-50/50' : 
                'bg-green-50/50'
              }`}>
                <CardTitle className="text-base font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-slate-600" />
                  Claims-Blocking Gaps
                </CardTitle>
              </CardHeader>
              <CardContent className="py-5 px-5 flex-1 flex flex-col">
                {claimsBlockingCount > 0 ? (
                  <div>
                    <div className={`text-2xl font-bold flex items-center justify-between mb-1 ${
                      claimsBlockingCount >= 5 ? 'text-red-600' : 
                      claimsBlockingCount >= 1 ? 'text-amber-600' : 
                      'text-green-600'
                    }`}>
                      <span>{claimsBlockingCount} patients risk denial</span>
                      <ChevronRight className={`h-5 w-5 ${
                        claimsBlockingCount >= 5 ? 'text-red-500' : 
                        claimsBlockingCount >= 1 ? 'text-amber-500' : 
                        'text-green-500'
                      }`} />
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      ${claimsAtRiskValue.toLocaleString()}
                    </div>
                    
                    <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          claimsBlockingCount >= 5 ? 'bg-red-500' : 
                          claimsBlockingCount >= 1 ? 'bg-amber-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((claimsBlockingCount / 10) * 100, 100)}%` }}>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 mb-4 text-sm">
                    <Check className="h-4 w-4 mr-1" />
                    <span>Data spotless—your auditors salute you.</span>
                  </div>
                )}
                
                <div className="mt-auto">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                    disabled={claimsBlockingCount === 0}
                    onClick={() => {
                      // Set filter to show only claims-blocking gaps
                      setFilters(prev => ({
                        ...prev,
                        severities: ["claims-blocking"],
                        categories: ["insurance"]
                      }));
                    }}
                  >
                    Fix Insurance
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact-Blocking Gaps Card */}
            <Card className={`shadow-sm border-t-4 ${
              contactBlockingCount > 0 ? 'border-t-amber-400' : 'border-t-green-400'
            } flex flex-col`}>
              <CardHeader className={`py-3 px-5 border-b ${
                contactBlockingCount > 0 ? 'bg-amber-50/50' : 'bg-green-50/50'
              }`}>
                <CardTitle className="text-base font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-slate-600" />
                  Contact-Blocking Gaps
                </CardTitle>
              </CardHeader>
              <CardContent className="py-5 px-5 flex-1 flex flex-col">
                {contactBlockingCount > 0 ? (
                  <div>
                    <div className={`text-2xl font-bold flex items-center justify-between mb-1 ${
                      contactBlockingCount > 0 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      <span>{contactBlockingCount} records bad phone/email</span>
                      <ChevronRight className={`h-5 w-5 ${
                        contactBlockingCount > 0 ? 'text-amber-500' : 'text-green-500'
                      }`} />
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Patients may miss critical outreach
                    </div>
                    
                    <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          contactBlockingCount > 0 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((contactBlockingCount / 20) * 100, 100)}%` }}>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 mb-4 text-sm">
                    <Check className="h-4 w-4 mr-1" />
                    <span>Data spotless—your auditors salute you.</span>
                  </div>
                )}
                
                <div className="mt-auto">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                    disabled={contactBlockingCount === 0}
                    onClick={() => {
                      // Set filter to show only contact-blocking gaps
                      setFilters(prev => ({
                        ...prev,
                        severities: ["contact"],
                        categories: ["demographics"]
                      }));
                    }}
                  >
                    Send Update Link
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Clinical-Safety Gaps Card */}
            <Card className="shadow-sm border-t-4 border-t-red-400 flex flex-col">
              <CardHeader className="py-3 px-5 border-b bg-red-50/50">
                <CardTitle className="text-base font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-slate-600" />
                  Clinical-Safety Gaps
                </CardTitle>
              </CardHeader>
              <CardContent className="py-5 px-5 flex-1 flex flex-col">
                {clinicalSafetyCount > 0 ? (
                  <div>
                    <div className="text-2xl font-bold flex items-center justify-between mb-1 text-red-600">
                      <span>{clinicalSafetyCount} charts missing data</span>
                      <ChevronRight className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Allergy/medication information needed
                    </div>
                    
                    <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 bg-red-500"
                        style={{ width: `${Math.min((clinicalSafetyCount / 8) * 100, 100)}%` }}>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 mb-4 text-sm">
                    <Check className="h-4 w-4 mr-1" />
                    <span>Data spotless—your auditors salute you.</span>
                  </div>
                )}
                
                <div className="mt-auto">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                    disabled={clinicalSafetyCount === 0}
                    onClick={() => {
                      // Set filter to show only clinical-safety gaps
                      setFilters(prev => ({
                        ...prev,
                        severities: ["safety"],
                        categories: ["clinical"]
                      }));
                    }}
                  >
                    Update Chart
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
                  <Button variant="ghost" size="sm" onClick={resetFilters} disabled={
                    filters.categories.length === 0 && 
                    filters.severities.length === 0 && 
                    !filters.hasAppointment && 
                    filters.ageOfGap === "all" &&
                    filters.searchQuery === ""
                  }>
                    Clear
                  </Button>
                </div>
                
                <Accordion type="multiple" defaultValue={["gap-type", "severity", "patient-status", "age"]} className="space-y-2">
                  <AccordionItem value="gap-type" className="border rounded-md overflow-hidden">
                    <AccordionTrigger className="px-3 py-2 bg-muted/20 hover:bg-muted/30 transition-colors">
                      Gap Type
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pt-2 pb-1">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox 
                            id="gap-insurance" 
                            checked={filters.categories.includes("insurance")}
                            onCheckedChange={() => toggleCategory("insurance")}
                            className="mr-2"
                          />
                          <label htmlFor="gap-insurance" className="text-sm">Insurance</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="gap-demographics" 
                            checked={filters.categories.includes("demographics")}
                            onCheckedChange={() => toggleCategory("demographics")}
                            className="mr-2"
                          />
                          <label htmlFor="gap-demographics" className="text-sm">Demographics</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="gap-clinical" 
                            checked={filters.categories.includes("clinical")}
                            onCheckedChange={() => toggleCategory("clinical")}
                            className="mr-2"
                          />
                          <label htmlFor="gap-clinical" className="text-sm">Clinical</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="gap-consent" 
                            checked={filters.categories.includes("consent")}
                            onCheckedChange={() => toggleCategory("consent")}
                            className="mr-2"
                          />
                          <label htmlFor="gap-consent" className="text-sm">Consent & Docs</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="gap-compliance" 
                            checked={filters.categories.includes("compliance")}
                            onCheckedChange={() => toggleCategory("compliance")}
                            className="mr-2"
                          />
                          <label htmlFor="gap-compliance" className="text-sm">Compliance</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="gap-duplicate" 
                            checked={filters.categories.includes("duplicate")}
                            onCheckedChange={() => toggleCategory("duplicate")}
                            className="mr-2"
                          />
                          <label htmlFor="gap-duplicate" className="text-sm">Duplicate MRN</label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="severity" className="border rounded-md overflow-hidden">
                    <AccordionTrigger className="px-3 py-2 bg-muted/20 hover:bg-muted/30 transition-colors">
                      Severity
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pt-2 pb-1">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox 
                            id="severity-claims" 
                            checked={filters.severities.includes("claims-blocking")}
                            onCheckedChange={() => toggleSeverity("claims-blocking")}
                            className="mr-2"
                          />
                          <label htmlFor="severity-claims" className="text-sm">Claims-blocking</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="severity-safety" 
                            checked={filters.severities.includes("safety")}
                            onCheckedChange={() => toggleSeverity("safety")}
                            className="mr-2"
                          />
                          <label htmlFor="severity-safety" className="text-sm">Safety</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="severity-contact" 
                            checked={filters.severities.includes("contact")}
                            onCheckedChange={() => toggleSeverity("contact")}
                            className="mr-2"
                          />
                          <label htmlFor="severity-contact" className="text-sm">Contact</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="severity-minor" 
                            checked={filters.severities.includes("minor")}
                            onCheckedChange={() => toggleSeverity("minor")}
                            className="mr-2"
                          />
                          <label htmlFor="severity-minor" className="text-sm">Minor</label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="patient-status" className="border rounded-md overflow-hidden">
                    <AccordionTrigger className="px-3 py-2 bg-muted/20 hover:bg-muted/30 transition-colors">
                      Patient Status
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pt-2 pb-1">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox 
                            id="has-appointment" 
                            checked={filters.hasAppointment}
                            onCheckedChange={toggleHasAppointment}
                            className="mr-2"
                          />
                          <label htmlFor="has-appointment" className="text-sm">Has upcoming appointment</label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="age" className="border rounded-md overflow-hidden">
                    <AccordionTrigger className="px-3 py-2 bg-muted/20 hover:bg-muted/30 transition-colors">
                      Age of Gap
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pt-2 pb-1">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="age-all" 
                            name="age" 
                            checked={filters.ageOfGap === "all"}
                            onChange={() => setAgeFilter("all")}
                            className="mr-2"
                          />
                          <label htmlFor="age-all" className="text-sm">All ages</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="age-new" 
                            name="age" 
                            checked={filters.ageOfGap === "new"}
                            onChange={() => setAgeFilter("new")}
                            className="mr-2"
                          />
                          <label htmlFor="age-new" className="text-sm">New {'<30 d'}</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="age-medium" 
                            name="age" 
                            checked={filters.ageOfGap === "medium"}
                            onChange={() => setAgeFilter("medium")}
                            className="mr-2"
                          />
                          <label htmlFor="age-medium" className="text-sm">30-90 d</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="age-old" 
                            name="age" 
                            checked={filters.ageOfGap === "old"}
                            onChange={() => setAgeFilter("old")}
                            className="mr-2"
                          />
                          <label htmlFor="age-old" className="text-sm">90 d+</label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            
            {/* Data Gaps Table */}
            <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-medium text-lg">Data Gaps ({filteredGaps.length})</h2>
                  
                  <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search gaps..."
                      className="pl-8 h-9"
                      value={filters.searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {filteredGaps.length > 0 ? (
                <div className="overflow-auto max-h-[calc(100vh-350px)]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white">
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox 
                            checked={selectedGaps.length > 0 && selectedGaps.length === filteredGaps.length}
                            onCheckedChange={selectAll}
                            aria-label="Select all"
                          />
                        </TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Gap Type</TableHead>
                        <TableHead className="min-w-[200px]">Detail</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Next Appt</TableHead>
                        <TableHead>Quick Fix</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGaps.map((gap) => {
                        // Check if the gap is "old"
                        const isOld = getGapAge(gap.createdAt) >= 90;
                        const isExpanded = expandedGaps.includes(gap.id);
                        const patient = getPatientById(patients, gap.patientId);
                        
                        return (
                          <React.Fragment key={gap.id}>
                            <TableRow 
                              className={`${
                                isOld && gap.status === "open" ? "animate-pulse-once" : ""
                              } ${isExpanded ? "bg-muted/20" : ""}`}
                            >
                              <TableCell>
                                <Checkbox 
                                  checked={selectedGaps.includes(gap.id)}
                                  onCheckedChange={() => toggleGapSelection(gap.id)}
                                  aria-label={`Select ${gap.patientName}`}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarFallback>{getInitials(gap.patientName)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{gap.patientName}</div>
                                    <div className="text-xs text-muted-foreground">{gap.patientMRN}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={getCategoryColor(gap.category)}>
                                  {getCategoryLabel(gap.category)}
                                </Badge>
                              </TableCell>
                              <TableCell className={getSeverityColor(gap.severity)}>
                                {gap.detail}
                              </TableCell>
                              <TableCell className={isOld ? "text-red-600 font-medium" : ""}>
                                {formatGapAge(gap.createdAt)}
                              </TableCell>
                              <TableCell>
                                {formatDate(gap.nextAppointment)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {gap.fixActions.includes("edit") && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7"
                                      onClick={() => openFixDrawer(gap)}
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                  {gap.fixActions.includes("request") && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7"
                                      onClick={() => openFixDrawer(gap)}
                                    >
                                      <Mail className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                  {gap.fixActions.includes("capture") && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7"
                                      onClick={() => openFixDrawer(gap)}
                                    >
                                      <Camera className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                  {gap.fixActions.includes("merge") && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7"
                                      onClick={() => openFixDrawer(gap)}
                                    >
                                      <Merge className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-between">
                                  <Badge className={getStatusColor(gap.status)}>
                                    {getStatusLabel(gap.status)}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 ml-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleExpandedRow(gap.id);
                                    }}
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            
                            {/* Expanded Row */}
                            {isExpanded && patient && (
                              <TableRow className="bg-muted/10 border-t-0">
                                <TableCell colSpan={8} className="p-0">
                                  <div className="p-4">
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                      {/* Patient Info Card */}
                                      <Card className="col-span-3 md:col-span-1 shadow-sm">
                                        <CardHeader className="py-3 px-4 border-b">
                                          <CardTitle className="text-sm font-medium flex items-center">
                                            <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                            Patient Details
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 text-sm space-y-3">
                                          <div>
                                            <div className="text-muted-foreground mb-1">Date of Birth</div>
                                            <div className={!patient.dob ? "text-red-500 font-medium" : ""}>
                                              {patient.dob || 'Missing'}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-muted-foreground mb-1">Phone</div>
                                            <div className={patient.phone === "555-555-5555" ? "text-red-500 font-medium" : ""}>
                                              {patient.phone || 'Missing'}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-muted-foreground mb-1">Email</div>
                                            <div className={patient.email && (patient.email.includes("invalid") || patient.email.includes("bounced")) ? "text-red-500 font-medium" : ""}>
                                              {patient.email || 'Missing'}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-muted-foreground mb-1">Next Appointment</div>
                                            <div>{patient.upcomingAppointment ? formatDate(patient.upcomingAppointment) : 'None'}</div>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      {/* Gap-specific Details Card */}
                                      <Card className="col-span-3 md:col-span-2 shadow-sm">
                                        <CardHeader className="py-3 px-4 border-b">
                                          <CardTitle className="text-sm font-medium flex items-center">
                                            {gap.category === "insurance" && (
                                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                            )}
                                            {gap.category === "clinical" && (
                                              <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                                            )}
                                            {gap.category === "consent" && (
                                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                            )}
                                            {gap.category === "compliance" && (
                                              <ClipboardList className="h-4 w-4 mr-2 text-muted-foreground" />
                                            )}
                                            {gap.category === "demographics" && (
                                              <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                            )}
                                            {gap.category === "duplicate" && (
                                              <Merge className="h-4 w-4 mr-2 text-muted-foreground" />
                                            )}
                                            {getCategoryLabel(gap.category)} Details
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 text-sm">
                                          {/* Insurance Details */}
                                          {gap.category === "insurance" && patient.insuranceInfo && (
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                              <div>
                                                <div className="text-muted-foreground mb-1">Provider</div>
                                                <div className={!patient.insuranceInfo.provider ? "text-red-500 font-medium" : ""}>
                                                  {patient.insuranceInfo.provider || 'Missing'}
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-muted-foreground mb-1">Policy Number</div>
                                                <div className={!patient.insuranceInfo.policyNumber ? "text-red-500 font-medium" : ""}>
                                                  {patient.insuranceInfo.policyNumber || 'Missing'}
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-muted-foreground mb-1">Expiration Date</div>
                                                <div className={patient.insuranceInfo.expirationDate && new Date(patient.insuranceInfo.expirationDate) < new Date() ? "text-red-500 font-medium" : ""}>
                                                  {patient.insuranceInfo.expirationDate ? formatDate(patient.insuranceInfo.expirationDate) : 'Missing'}
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-muted-foreground mb-1">Subscriber DOB</div>
                                                <div className={!patient.insuranceInfo.subscriberDob ? "text-red-500 font-medium" : ""}>
                                                  {patient.insuranceInfo.subscriberDob || 'Missing'}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          
                                          {/* Clinical Details */}
                                          {gap.category === "clinical" && patient.clinicalInfo && (
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                              <div>
                                                <div className="text-muted-foreground mb-1">Allergies</div>
                                                <div className={(!patient.clinicalInfo.allergies || patient.clinicalInfo.allergies.length === 0) ? "text-red-500 font-medium" : ""}>
                                                  {patient.clinicalInfo.allergies && patient.clinicalInfo.allergies.length > 0 
                                                    ? patient.clinicalInfo.allergies.join(", ") 
                                                    : 'Missing'}
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-muted-foreground mb-1">Medications</div>
                                                <div className={(!patient.clinicalInfo.medications || patient.clinicalInfo.medications.length === 0) ? "text-red-500 font-medium" : ""}>
                                                  {patient.clinicalInfo.medications && patient.clinicalInfo.medications.length > 0 
                                                    ? patient.clinicalInfo.medications.join(", ") 
                                                    : 'Missing'}
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-muted-foreground mb-1">Height</div>
                                                <div>{patient.clinicalInfo.height || 'Not recorded'}</div>
                                              </div>
                                              <div>
                                                <div className="text-muted-foreground mb-1">Weight</div>
                                                <div>{patient.clinicalInfo.weight || 'Not recorded'}</div>
                                              </div>
                                            </div>
                                          )}
                                          
                                          {/* Consent Documents */}
                                          {gap.category === "consent" && patient.consentInfo && (
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                              <div>
                                                <div className="text-muted-foreground mb-1">HIPAA Signed</div>
                                                <div className={!patient.consentInfo.hipaaSignedAt ? "text-red-500 font-medium" : ""}>
                                                  {patient.consentInfo.hipaaSignedAt ? formatDate(patient.consentInfo.hipaaSignedAt) : 'Missing'}
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-muted-foreground mb-1">Financial Policy</div>
                                                <div className={!patient.consentInfo.financialPolicySignedAt ? "text-red-500 font-medium" : ""}>
                                                  {patient.consentInfo.financialPolicySignedAt ? formatDate(patient.consentInfo.financialPolicySignedAt) : 'Missing'}
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-muted-foreground mb-1">Photo ID</div>
                                                <div className={!patient.consentInfo.photoIdUploaded ? "text-red-500 font-medium" : "text-green-600"}>
                                                  {patient.consentInfo.photoIdUploaded ? 'Uploaded' : 'Missing'}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          
                                          {/* Compliance Information */}
                                          {gap.category === "compliance" && patient.complianceInfo && (
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                              <div>
                                                <div className="text-muted-foreground mb-1">Privacy Acknowledged</div>
                                                <div className={patient.complianceInfo.privacyAcknowledged === false ? "text-red-500 font-medium" : "text-green-600"}>
                                                  {patient.complianceInfo.privacyAcknowledged ? 'Yes' : 'No'}
                                                </div>
                                              </div>
                                              <div>
                                                <div className="text-muted-foreground mb-1">Contact Preference</div>
                                                <div className={!patient.complianceInfo.contactPreference ? "text-red-500 font-medium" : ""}>
                                                  {patient.complianceInfo.contactPreference || 'Not specified'}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                          
                                          {/* Duplicate Records */}
                                          {gap.category === "duplicate" && patient.potentialDuplicateIds && (
                                            <div>
                                              <div className="border rounded-md p-3 bg-muted/10 mb-3">
                                                {patient.potentialDuplicateIds.map(dupId => {
                                                  const duplicatePatient = getPatientById(patients, dupId);
                                                  if (!duplicatePatient) return null;
                                                  
                                                  return (
                                                    <div key={dupId} className="flex items-center justify-between mb-2 last:mb-0">
                                                      <div className="flex items-center">
                                                        <Avatar className="h-6 w-6 mr-2">
                                                          <AvatarFallback>{getInitials(duplicatePatient.name)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                          <div className="text-sm font-medium">{duplicatePatient.name}</div>
                                                          <div className="text-xs text-muted-foreground">{duplicatePatient.mrn}</div>
                                                        </div>
                                                      </div>
                                                      <div className="text-sm">
                                                        {duplicatePatient.dob ? 'DOB: ' + formatDate(duplicatePatient.dob) : ''}
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                              <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                className="w-full"
                                                onClick={() => {
                                                  setCurrentGap(gap);
                                                  setCurrentPatient(patient);
                                                  setIsMergeModalOpen(true);
                                                }}
                                              >
                                                <Merge className="h-3.5 w-3.5 mr-1.5" />
                                                Merge Records
                                              </Button>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                      
                                      {/* Quick Actions Card */}
                                      <Card className="col-span-3 md:col-span-1 shadow-sm">
                                        <CardHeader className="py-3 px-4 border-b">
                                          <CardTitle className="text-sm font-medium flex items-center">
                                            <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                                            Quick Actions
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 flex flex-col gap-3">
                                          <Button 
                                            variant="default" 
                                            size="sm"
                                            onClick={() => openFixDrawer(gap)}
                                          >
                                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                                            Fix Gap
                                          </Button>
                                          
                                          {gap.fixActions.includes("request") && patient.email && !patient.email.includes("invalid") && !patient.email.includes("bounced") && (
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => {
                                                setCurrentGap(gap);
                                                setCurrentPatient(patient);
                                                setIsEmailModalOpen(true);
                                              }}
                                            >
                                              <Mail className="h-3.5 w-3.5 mr-1.5" />
                                              Send Email Request
                                            </Button>
                                          )}
                                          
                                          {gap.fixActions.includes("request") && patient.phone && patient.phone !== "555-555-5555" && (
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => {
                                                setCurrentGap(gap);
                                                setCurrentPatient(patient);
                                                setIsSMSModalOpen(true);
                                              }}
                                            >
                                              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                                              Send SMS Update Link
                                            </Button>
                                          )}
                                          
                                          {gap.status === "open" && (
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => {
                                                const updatedGaps = dataGaps.map(g => {
                                                  if (g.id === gap.id) {
                                                    return { ...g, status: "fixed" as GapStatus };
                                                  }
                                                  return g;
                                                });
                                                setDataGaps(updatedGaps);
                                                toast({
                                                  title: "Gap Resolved",
                                                  description: `${gap.detail} has been marked as fixed.`
                                                });
                                              }}
                                            >
                                              <Check className="h-3.5 w-3.5 mr-1.5" />
                                              Mark as Fixed
                                            </Button>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircleIcon size={48} className="text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-1">All data is complete</h3>
                  <p className="text-muted-foreground max-w-md">
                    Every record is complete—stewardship level: legendary.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bulk Action Bar (Fixed at bottom) */}
        {selectedGaps.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 z-40">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <span className="font-medium">{selectedGaps.length} gaps selected</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={sendBulkSMS}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Bulk SMS Update Link
                </Button>
                
                <Button variant="outline" size="sm" onClick={sendBulkEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Bulk Email Link
                </Button>
                
                <Button variant="outline" size="sm" onClick={printForms}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Forms
                </Button>
                
                <Button variant="outline" size="sm" onClick={markResolved}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark Resolved
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick-Fix Drawer */}
        <Sheet open={isFixDrawerOpen} onOpenChange={setIsFixDrawerOpen}>
          <SheetContent className="w-[400px] sm:max-w-[400px] p-0">
            {currentGap && currentPatient && (
              <div className="h-full flex flex-col">
                <SheetHeader className="p-4 border-b bg-muted/10">
                  <SheetTitle className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{getInitials(currentGap.patientName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-left">{currentGap.patientName}</div>
                        <div className="text-xs text-muted-foreground">{currentGap.patientMRN}</div>
                      </div>
                    </div>
                    
                    <Badge className={getCategoryColor(currentGap.category)}>
                      {getCategoryLabel(currentGap.category)}
                    </Badge>
                  </SheetTitle>
                  
                  <SheetDescription className="text-left">
                    <div className="mt-1">
                      <div className="font-medium">{currentGap.detail}</div>
                      <div className="text-sm text-muted-foreground">
                        {currentGap.severity === "claims-blocking" && "Missing or stale insurance info; claim will deny."}
                        {currentGap.severity === "safety" && "Critical clinical data needed for safe treatment."}
                        {currentGap.severity === "contact" && "Unable to contact patient with current information."}
                        {currentGap.severity === "minor" && "Minor data completion needed for the patient record."}
                      </div>
                    </div>
                  </SheetDescription>
                </SheetHeader>
                
                <div className="p-4 flex-1 overflow-y-auto">
                  {/* Show different fix options based on the gap category */}
                  {(currentGap.category === "insurance" || currentGap.category === "demographics") && (
                    <div>
                      <h4 className="font-medium mb-2">Update Information</h4>
                      <div className="space-y-4">
                        {currentGap.detail.includes("DOB") && (
                          <div className="space-y-2">
                            <label htmlFor="dob-input" className="text-sm">Date of Birth</label>
                            <Input 
                              type="date" 
                              id="dob-input"
                              value={fixValue}
                              onChange={(e) => setFixValue(e.target.value)}
                            />
                          </div>
                        )}
                        
                        {currentGap.detail.includes("phone") && (
                          <div className="space-y-2">
                            <label htmlFor="phone-input" className="text-sm">Phone Number</label>
                            <Input 
                              type="tel" 
                              id="phone-input"
                              placeholder="555-123-4567"
                              value={fixValue}
                              onChange={(e) => setFixValue(e.target.value)}
                            />
                          </div>
                        )}
                        
                        {currentGap.detail.includes("email") && (
                          <div className="space-y-2">
                            <label htmlFor="email-input" className="text-sm">Email Address</label>
                            <Input 
                              type="email" 
                              id="email-input"
                              placeholder="patient@example.com"
                              value={fixValue}
                              onChange={(e) => setFixValue(e.target.value)}
                            />
                          </div>
                        )}
                        
                        {currentGap.detail.includes("policy") && (
                          <div className="space-y-2">
                            <label htmlFor="policy-input" className="text-sm">Policy Number</label>
                            <Input 
                              type="text" 
                              id="policy-input"
                              placeholder="e.g., BC12345678"
                              value={fixValue}
                              onChange={(e) => setFixValue(e.target.value)}
                            />
                          </div>
                        )}
                        
                        {currentGap.detail.includes("insurance provider") && (
                          <div className="space-y-2">
                            <label htmlFor="provider-input" className="text-sm">Insurance Provider</label>
                            <Select 
                              value={fixValue} 
                              onValueChange={setFixValue}
                            >
                              <SelectTrigger id="provider-input">
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Blue Cross">Blue Cross</SelectItem>
                                <SelectItem value="Aetna">Aetna</SelectItem>
                                <SelectItem value="UnitedHealth">UnitedHealth</SelectItem>
                                <SelectItem value="Cigna">Cigna</SelectItem>
                                <SelectItem value="Humana">Humana</SelectItem>
                                <SelectItem value="Kaiser">Kaiser</SelectItem>
                                <SelectItem value="Anthem">Anthem</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {currentGap.detail.includes("card") && (
                          <div className="space-y-2">
                            <label htmlFor="card-upload" className="text-sm">Upload Insurance Card</label>
                            <div className="border-2 border-dashed rounded-md p-6 text-center">
                              <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <div className="text-sm text-muted-foreground mb-2">
                                Click to take a photo or upload an image
                              </div>
                              <Button variant="secondary" size="sm">
                                Capture Image
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {currentGap.category === "clinical" && (
                    <div>
                      <h4 className="font-medium mb-2">Clinical Information</h4>
                      <div className="space-y-4">
                        {currentGap.detail.includes("allergy") && (
                          <div className="space-y-2">
                            <label className="text-sm">Allergies</label>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <Checkbox 
                                  id="no-allergies" 
                                  checked={fixValue === "None"}
                                  onCheckedChange={(checked) => {
                                    if (checked) setFixValue("None");
                                    else setFixValue("");
                                  }}
                                  className="mr-2"
                                />
                                <label htmlFor="no-allergies" className="text-sm">No Known Allergies</label>
                              </div>
                              <div className="flex items-center">
                                <Checkbox 
                                  id="add-allergies" 
                                  checked={fixValue !== "" && fixValue !== "None"}
                                  onCheckedChange={(checked) => {
                                    if (checked) setFixValue("Allergies Added");
                                    else setFixValue("");
                                  }}
                                  className="mr-2"
                                />
                                <label htmlFor="add-allergies" className="text-sm">Add Specific Allergies</label>
                              </div>
                            </div>
                            {fixValue !== "" && fixValue !== "None" && (
                              <Input 
                                placeholder="e.g., Penicillin, Peanuts"
                                className="mt-2"
                              />
                            )}
                          </div>
                        )}
                        
                        {currentGap.detail.includes("medication") && (
                          <div className="space-y-2">
                            <label className="text-sm">Medications</label>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <Checkbox 
                                  id="no-meds" 
                                  checked={fixValue === "None"}
                                  onCheckedChange={(checked) => {
                                    if (checked) setFixValue("None");
                                    else setFixValue("");
                                  }}
                                  className="mr-2"
                                />
                                <label htmlFor="no-meds" className="text-sm">No Current Medications</label>
                              </div>
                              <div className="flex items-center">
                                <Checkbox 
                                  id="add-meds" 
                                  checked={fixValue !== "" && fixValue !== "None"}
                                  onCheckedChange={(checked) => {
                                    if (checked) setFixValue("Medications Added");
                                    else setFixValue("");
                                  }}
                                  className="mr-2"
                                />
                                <label htmlFor="add-meds" className="text-sm">Add Medications</label>
                              </div>
                            </div>
                            {fixValue !== "" && fixValue !== "None" && (
                              <Input 
                                placeholder="e.g., Lisinopril, Metformin"
                                className="mt-2"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {currentGap.category === "consent" && (
                    <div>
                      <h4 className="font-medium mb-2">Consent Documents</h4>
                      <div className="space-y-4">
                        {currentGap.detail.includes("HIPAA") && (
                          <div className="space-y-2">
                            <label className="text-sm">HIPAA Form</label>
                            <Button variant="secondary" className="w-full" onClick={() => setFixValue("Send E-Sign Link")}>
                              <Send className="h-4 w-4 mr-2" />
                              Send E-Sign Link
                            </Button>
                            <div className="flex items-center mt-2">
                              <Checkbox 
                                id="mark-received" 
                                checked={fixValue === "Received"}
                                onCheckedChange={(checked) => {
                                  if (checked) setFixValue("Received");
                                  else setFixValue("");
                                }}
                                className="mr-2"
                              />
                              <label htmlFor="mark-received" className="text-sm">Mark as Received</label>
                            </div>
                          </div>
                        )}
                        
                        {currentGap.detail.includes("financial") && (
                          <div className="space-y-2">
                            <label className="text-sm">Financial Policy</label>
                            <Button variant="secondary" className="w-full" onClick={() => setFixValue("Send E-Sign Link")}>
                              <Send className="h-4 w-4 mr-2" />
                              Send E-Sign Link
                            </Button>
                            <div className="flex items-center mt-2">
                              <Checkbox 
                                id="mark-received-financial" 
                                checked={fixValue === "Received"}
                                onCheckedChange={(checked) => {
                                  if (checked) setFixValue("Received");
                                  else setFixValue("");
                                }}
                                className="mr-2"
                              />
                              <label htmlFor="mark-received-financial" className="text-sm">Mark as Received</label>
                            </div>
                          </div>
                        )}
                        
                        {currentGap.detail.includes("photo ID") && (
                          <div className="space-y-2">
                            <label className="text-sm">Photo ID</label>
                            <div className="border-2 border-dashed rounded-md p-6 text-center">
                              <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <div className="text-sm text-muted-foreground mb-2">
                                Click to take a photo or upload an image
                              </div>
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => setFixValue("Photo ID Captured")}
                              >
                                Capture Image
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {currentGap.category === "compliance" && (
                    <div>
                      <h4 className="font-medium mb-2">Compliance Information</h4>
                      <div className="space-y-4">
                        {currentGap.detail.includes("privacy") && (
                          <div className="space-y-2">
                            <label className="text-sm">Privacy Acknowledgment</label>
                            <div className="flex items-center">
                              <Checkbox 
                                id="privacy-acknowledged" 
                                checked={fixValue === "Acknowledged"}
                                onCheckedChange={(checked) => {
                                  if (checked) setFixValue("Acknowledged");
                                  else setFixValue("");
                                }}
                                className="mr-2"
                              />
                              <label htmlFor="privacy-acknowledged" className="text-sm">Mark as Acknowledged</label>
                            </div>
                          </div>
                        )}
                        
                        {currentGap.detail.includes("contact preference") && (
                          <div className="space-y-2">
                            <label className="text-sm">Contact Preference</label>
                            <Select 
                              value={fixValue} 
                              onValueChange={setFixValue}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select preference" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Email">Email</SelectItem>
                                <SelectItem value="Phone">Phone</SelectItem>
                                <SelectItem value="SMS">SMS</SelectItem>
                                <SelectItem value="Mail">Mail</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {currentGap.category === "duplicate" && (
                    <div>
                      <h4 className="font-medium mb-2">Duplicate Record</h4>
                      <div className="space-y-4">
                        <div className="bg-muted/20 p-3 rounded-md">
                          <div className="font-medium text-sm mb-1">Potential Duplicate:</div>
                          {currentPatient.potentialDuplicateIds?.map(dupId => {
                            const duplicatePatient = getPatientById(patients, dupId);
                            if (!duplicatePatient) return null;
                            
                            return (
                              <div key={dupId} className="flex items-center py-2">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback>{getInitials(duplicatePatient.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{duplicatePatient.name}</div>
                                  <div className="text-xs text-muted-foreground">{duplicatePatient.mrn}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <Button 
                          variant="secondary" 
                          className="w-full"
                          onClick={() => setIsMergeModalOpen(true)}
                        >
                          <Merge className="h-4 w-4 mr-2" />
                          Merge Records
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* One-tap communications section */}
                  {(currentGap.fixActions.includes("request") || currentGap.fixActions.includes("edit")) && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Send Update Request</h4>
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => setIsSMSModalOpen(true)}
                          disabled={!currentPatient.phone || currentPatient.phone === "555-555-5555"}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send SMS Update Link
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => setIsEmailModalOpen(true)}
                          disabled={!currentPatient.email || currentPatient.email.includes("invalid") || currentPatient.email.includes("bounced")}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email Update Link
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <SheetFooter className="p-4 border-t">
                  <Button 
                    className="w-full" 
                    onClick={fixGap}
                    disabled={fixValue === "" && !isMergeModalOpen && !isEmailModalOpen && !isSMSModalOpen}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark Fixed
                  </Button>
                </SheetFooter>
              </div>
            )}
          </SheetContent>
        </Sheet>
        
        {/* Merge Modal */}
        <Dialog open={isMergeModalOpen} onOpenChange={setIsMergeModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Merge</DialogTitle>
              <DialogDescription>
                {currentPatient && currentPatient.potentialDuplicateIds && (
                  <div>
                    Seems {currentPatient.name} and {
                      getPatientById(patients, currentPatient.potentialDuplicateIds[0])?.name
                    } might be the same person. Confirm to merge charts.
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="bg-muted/20 p-3 rounded-md mb-4">
                <h4 className="font-medium text-sm mb-2">Data to be merged:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Personal information (using most recent)</li>
                  <li>Insurance information (using most recent)</li>
                  <li>Clinical history (combining all records)</li>
                  <li>Appointment history (combining all records)</li>
                </ul>
              </div>
              
              <div className="text-sm text-muted-foreground">
                This action will combine both patient records into one and cannot be undone.
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={mergeDuplicates}>
                Merge Records
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Email Modal */}
        <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Email Update Link</DialogTitle>
              <DialogDescription>
                {currentPatient && (
                  <div>
                    Send an email to {currentPatient.name} with a link to update their information.
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email Template</label>
                  <Select defaultValue="template1">
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="template1">Insurance Update Request</SelectItem>
                      <SelectItem value="template2">Demographics Update Request</SelectItem>
                      <SelectItem value="template3">Missing Documents Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Preview</label>
                  <div className="bg-muted p-3 rounded-md mt-1 text-sm">
                    <p>
                      Subject: Please Update Your Information for Your Next Visit
                    </p>
                    <p className="mt-2">
                      Hello {currentPatient?.name?.split(' ')[0]},
                    </p>
                    <p className="mt-2">
                      We noticed some information is missing or out of date in your patient record. 
                      To ensure we can provide you with the best care and properly process your insurance claims, 
                      please click the link below to update your information before your next visit.
                    </p>
                    <p className="mt-2">
                      [Update Information Link]
                    </p>
                    <p className="mt-2">
                      Thank you,<br />
                      Your Dental Team
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={sendEmailRequest}>
                Send Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* SMS Modal */}
        <Dialog open={isSMSModalOpen} onOpenChange={setIsSMSModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send SMS Update Link</DialogTitle>
              <DialogDescription>
                {currentPatient && (
                  <div>
                    Send an SMS to {currentPatient.name} with a link to update their information.
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">SMS Template</label>
                  <Select defaultValue="template1">
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="template1">Insurance Update Request</SelectItem>
                      <SelectItem value="template2">Demographics Update Request</SelectItem>
                      <SelectItem value="template3">Missing Documents Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Preview</label>
                  <div className="bg-muted p-3 rounded-md mt-1 text-sm">
                    <p>
                      Hi {currentPatient?.name?.split(' ')[0]}, Pixie Dental needs a quick insurance update for your {
                        currentPatient?.upcomingAppointment ? formatDate(currentPatient.upcomingAppointment) : "upcoming"
                      } visit—tap here: [link]
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={sendSMSRequest}>
                Send SMS
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </NavigationWrapper>
  );
}

// Custom check circle icon
function CheckCircleIcon({ size = 24, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}