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
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
type Claim = {
  id: number;
  patientName: string;
  dateOfService: string;
  claimAmount: number;
  insuranceEstimate: number;
  patientEstimate: number;
  billingProvider: string;
  insuranceCarrier: string;
  planType: string;
  insuranceOrder: "Primary" | "Secondary";
  claimStatus: "Sent" | "Pending" | "Resent" | "Not Sent" | "Completed";
  submissionDate?: string;
  procedures?: Procedure[];
};

type Procedure = {
  cdtCode: string;
  toothNumber: string;
  toothSurface: string;
  description: string;
  fee: number;
  negotiated: number;
  deductible: number;
  coverage: number;
  patientEstimate: number;
  insuranceEstimate: number;
};

// Mocked data
const mockClaims: Claim[] = [
  // Submitted Claims
  {
    id: 1,
    patientName: "Sarah Jonas",
    dateOfService: "04/12/2025",
    claimAmount: 475,
    insuranceEstimate: 475,
    patientEstimate: 4275.55,
    billingProvider: "Dr. Floyd Miles",
    insuranceCarrier: "Delta Dental of California",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Sent",
    submissionDate: "04/13/2025",
    procedures: [
      {
        cdtCode: "D1234",
        toothNumber: "15",
        toothSurface: "L",
        description: "resin-based composite - two surfaces, anterior",
        fee: 3075,
        negotiated: 12450.50,
        deductible: 50,
        coverage: 80,
        patientEstimate: 558,
        insuranceEstimate: 76
      }
    ]
  },
  {
    id: 2,
    patientName: "Cody Fisher",
    dateOfService: "04/11/2025",
    claimAmount: 10740,
    insuranceEstimate: 10740,
    patientEstimate: 740,
    billingProvider: "Dr. Annette Black",
    insuranceCarrier: "Metlife",
    planType: "Indemnity plan",
    insuranceOrder: "Secondary",
    claimStatus: "Sent",
    submissionDate: "04/12/2025",
    procedures: [
      {
        cdtCode: "D6750",
        toothNumber: "30",
        toothSurface: "",
        description: "Crown - porcelain fused to high noble metal",
        fee: 1295.00,
        negotiated: 1036.00,
        deductible: 0.00,
        coverage: 80,
        patientEstimate: 258.50,
        insuranceEstimate: 1036.50
      },
      {
        cdtCode: "D7240",
        toothNumber: "1,16,17,32",
        toothSurface: "",
        description: "Removal of impacted tooth - completely bony",
        fee: 9445.00,
        negotiated: 9703.50,
        deductible: 0.00,
        coverage: 80,
        patientEstimate: 481.50,
        insuranceEstimate: 9703.50
      }
    ]
  },
  {
    id: 3,
    patientName: "Esther Howard",
    dateOfService: "04/09/2025",
    claimAmount: 6710.50,
    insuranceEstimate: 6710.50,
    patientEstimate: 520.45,
    billingProvider: "Dr. Floyd Miles",
    insuranceCarrier: "United Healthcare",
    planType: "DHMO",
    insuranceOrder: "Primary",
    claimStatus: "Sent",
    submissionDate: "04/10/2025",
    procedures: [
      {
        cdtCode: "D4260",
        toothNumber: "",
        toothSurface: "",
        description: "Osseous surgery - four or more contiguous teeth per quadrant",
        fee: 4250.00,
        negotiated: 4250.00,
        deductible: 0.00,
        coverage: 90,
        patientEstimate: 425.00,
        insuranceEstimate: 3825.00
      },
      {
        cdtCode: "D2950",
        toothNumber: "25-28",
        toothSurface: "",
        description: "Core buildup, including any pins when required",
        fee: 2460.50,
        negotiated: 2460.50,
        deductible: 0.00,
        coverage: 80,
        patientEstimate: 95.45,
        insuranceEstimate: 2885.50
      }
    ]
  },
  {
    id: 4,
    patientName: "Janet Williams",
    dateOfService: "04/07/2025",
    claimAmount: 450.45,
    insuranceEstimate: 450.45,
    patientEstimate: 450.75,
    billingProvider: "Dr. Ronald Richards",
    insuranceCarrier: "Humana Dental",
    planType: "DR",
    insuranceOrder: "Primary",
    claimStatus: "Sent",
    submissionDate: "04/08/2025",
    procedures: [
      {
        cdtCode: "D0120",
        toothNumber: "",
        toothSurface: "",
        description: "Periodic oral evaluation",
        fee: 150.15,
        negotiated: 150.15,
        deductible: 0.00,
        coverage: 100,
        patientEstimate: 0.00,
        insuranceEstimate: 150.15
      },
      {
        cdtCode: "D1110",
        toothNumber: "",
        toothSurface: "",
        description: "Prophylaxis - adult",
        fee: 300.30,
        negotiated: 300.30,
        deductible: 0.00,
        coverage: 100,
        patientEstimate: 450.75,
        insuranceEstimate: 300.30
      }
    ]
  },
  {
    id: 5,
    patientName: "Andrew Sawyer",
    dateOfService: "04/07/2025",
    claimAmount: 450.35,
    insuranceEstimate: 450.35,
    patientEstimate: 450.80,
    billingProvider: "Dr. Ronald Richards",
    insuranceCarrier: "Humana Dental",
    planType: "DHMO",
    insuranceOrder: "Secondary",
    claimStatus: "Resent",
    submissionDate: "04/15/2025",
    procedures: [
      {
        cdtCode: "D0220",
        toothNumber: "",
        toothSurface: "",
        description: "Intraoral - periapical first radiographic image",
        fee: 65.05,
        negotiated: 65.05,
        deductible: 0.00,
        coverage: 90,
        patientEstimate: 6.50,
        insuranceEstimate: 58.55
      },
      {
        cdtCode: "D2392",
        toothNumber: "20",
        toothSurface: "MO",
        description: "Resin-based composite - two surfaces, posterior",
        fee: 385.30,
        negotiated: 385.30,
        deductible: 0.00,
        coverage: 60,
        patientEstimate: 444.30,
        insuranceEstimate: 391.80
      }
    ]
  },
  {
    id: 6,
    patientName: "Devon Lane",
    dateOfService: "04/07/2025",
    claimAmount: 4450.00,
    insuranceEstimate: 4450.00,
    patientEstimate: 250.00,
    billingProvider: "Dr. Floyd Miles",
    insuranceCarrier: "Delta Dental",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Sent",
    submissionDate: "04/09/2025",
    procedures: [
      {
        cdtCode: "D2750",
        toothNumber: "3",
        toothSurface: "",
        description: "Crown - porcelain fused to high noble metal",
        fee: 1350.00,
        negotiated: 1350.00,
        deductible: 0.00,
        coverage: 80,
        patientEstimate: 270.00,
        insuranceEstimate: 1080.00
      },
      {
        cdtCode: "D2752",
        toothNumber: "14",
        toothSurface: "",
        description: "Crown - porcelain fused to noble metal",
        fee: 1350.00,
        negotiated: 1350.00,
        deductible: 0.00,
        coverage: 80,
        patientEstimate: 270.00,
        insuranceEstimate: 1080.00
      },
      {
        cdtCode: "D7140",
        toothNumber: "16",
        toothSurface: "",
        description: "Extraction - erupted tooth or exposed root",
        fee: 250.00,
        negotiated: 250.00,
        deductible: 0.00,
        coverage: 80,
        patientEstimate: 50.00,
        insuranceEstimate: 200.00
      },
      {
        cdtCode: "D6010",
        toothNumber: "19",
        toothSurface: "",
        description: "Surgical placement of implant body",
        fee: 1500.00,
        negotiated: 1500.00,
        deductible: 0.00,
        coverage: 70,
        patientEstimate: -340.00,
        insuranceEstimate: 2090.00
      }
    ]
  },
  {
    id: 7,
    patientName: "Kristin Watson",
    dateOfService: "04/05/2025",
    claimAmount: 1750.20,
    insuranceEstimate: 1750.20,
    patientEstimate: 750.00,
    billingProvider: "Dr. Annette Black",
    insuranceCarrier: "Metlife",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Resent",
    submissionDate: "04/12/2025",
    procedures: [
      {
        cdtCode: "D1234",
        toothNumber: "15",
        toothSurface: "L",
        description: "resin-based composite - two surfaces, anterior",
        fee: 1075.00,
        negotiated: 1075.00,
        deductible: 50.00,
        coverage: 80,
        patientEstimate: 290.50,
        insuranceEstimate: 976.00
      },
      {
        cdtCode: "D7281",
        toothNumber: "16",
        toothSurface: "M",
        description: "inlay - porcelain/ceramic - one surface",
        fee: 675.20,
        negotiated: 675.20,
        deductible: 0.00,
        coverage: 70,
        patientEstimate: 459.60,
        insuranceEstimate: 774.20
      }
    ]
  },
  
  // Not Submitted Claims
  {
    id: 8,
    patientName: "Robert Chen",
    dateOfService: "04/18/2025",
    claimAmount: 825.75,
    insuranceEstimate: 660.60,
    patientEstimate: 165.15,
    billingProvider: "Dr. Floyd Miles",
    insuranceCarrier: "Delta Dental of California",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Not Sent",
    procedures: [
      {
        cdtCode: "D2390",
        toothNumber: "8",
        toothSurface: "MIF",
        description: "Anterior resin-based composite crown",
        fee: 825.75,
        negotiated: 660.60,
        deductible: 0,
        coverage: 80,
        patientEstimate: 165.15,
        insuranceEstimate: 660.60
      }
    ]
  },
  {
    id: 9,
    patientName: "Michelle Parker",
    dateOfService: "04/16/2025",
    claimAmount: 1250.00,
    insuranceEstimate: 1000.00,
    patientEstimate: 250.00,
    billingProvider: "Dr. Annette Black",
    insuranceCarrier: "Metlife",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Not Sent",
    procedures: [
      {
        cdtCode: "D3310",
        toothNumber: "19",
        toothSurface: "",
        description: "Endodontic therapy - anterior tooth",
        fee: 1250.00,
        negotiated: 1000.00,
        deductible: 0,
        coverage: 80,
        patientEstimate: 250.00,
        insuranceEstimate: 1000.00
      }
    ]
  },
  {
    id: 10,
    patientName: "Thomas Wright",
    dateOfService: "04/17/2025",
    claimAmount: 350.00,
    insuranceEstimate: 280.00,
    patientEstimate: 70.00,
    billingProvider: "Dr. Floyd Miles",
    insuranceCarrier: "Delta Dental of California",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Not Sent",
    procedures: [
      {
        cdtCode: "D0210",
        toothNumber: "",
        toothSurface: "",
        description: "Intraoral - complete series of radiographic images",
        fee: 350.00,
        negotiated: 280.00,
        deductible: 0,
        coverage: 80,
        patientEstimate: 70.00,
        insuranceEstimate: 280.00
      }
    ]
  },
  {
    id: 11,
    patientName: "Serena Johnson",
    dateOfService: "04/19/2025",
    claimAmount: 2100.00,
    insuranceEstimate: 1680.00,
    patientEstimate: 420.00,
    billingProvider: "Dr. Ronald Richards",
    insuranceCarrier: "Humana Dental",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Not Sent",
    procedures: [
      {
        cdtCode: "D2740",
        toothNumber: "14",
        toothSurface: "",
        description: "Crown - porcelain/ceramic",
        fee: 1100.00,
        negotiated: 880.00,
        deductible: 0,
        coverage: 80,
        patientEstimate: 220.00,
        insuranceEstimate: 880.00
      },
      {
        cdtCode: "D2950",
        toothNumber: "14",
        toothSurface: "",
        description: "Core buildup, including any pins when required",
        fee: 1000.00,
        negotiated: 800.00,
        deductible: 0,
        coverage: 80,
        patientEstimate: 200.00,
        insuranceEstimate: 800.00
      }
    ]
  },
  
  // EOBs in Progress
  {
    id: 12,
    patientName: "Alex Rodriguez",
    dateOfService: "04/02/2025",
    claimAmount: 525.00,
    insuranceEstimate: 420.00,
    patientEstimate: 105.00,
    billingProvider: "Dr. Floyd Miles",
    insuranceCarrier: "Delta Dental of California",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Pending",
    submissionDate: "04/03/2025",
    procedures: [
      {
        cdtCode: "D1110",
        toothNumber: "",
        toothSurface: "",
        description: "Prophylaxis - adult",
        fee: 125.00,
        negotiated: 100.00,
        deductible: 0,
        coverage: 100,
        patientEstimate: 0.00,
        insuranceEstimate: 100.00
      },
      {
        cdtCode: "D0274",
        toothNumber: "",
        toothSurface: "",
        description: "Bitewings - four radiographic images",
        fee: 100.00,
        negotiated: 80.00,
        deductible: 0,
        coverage: 100,
        patientEstimate: 0.00,
        insuranceEstimate: 80.00
      },
      {
        cdtCode: "D2391",
        toothNumber: "30",
        toothSurface: "MO",
        description: "Posterior composite - one surface",
        fee: 300.00,
        negotiated: 240.00,
        deductible: 0,
        coverage: 80,
        patientEstimate: 105.00,
        insuranceEstimate: 240.00
      }
    ]
  },
  {
    id: 13,
    patientName: "Victoria Kim",
    dateOfService: "04/05/2025",
    claimAmount: 850.00,
    insuranceEstimate: 680.00,
    patientEstimate: 170.00,
    billingProvider: "Dr. Annette Black",
    insuranceCarrier: "Metlife",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Pending",
    submissionDate: "04/06/2025",
    procedures: [
      {
        cdtCode: "D4341",
        toothNumber: "",
        toothSurface: "",
        description: "Periodontal scaling and root planing - four or more teeth per quadrant",
        fee: 850.00,
        negotiated: 680.00,
        deductible: 0,
        coverage: 80,
        patientEstimate: 170.00,
        insuranceEstimate: 680.00
      }
    ]
  },
  {
    id: 14,
    patientName: "Marcus Lee",
    dateOfService: "04/08/2025",
    claimAmount: 1750.00,
    insuranceEstimate: 1400.00,
    patientEstimate: 350.00,
    billingProvider: "Dr. Ronald Richards",
    insuranceCarrier: "Humana Dental",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Pending",
    submissionDate: "04/09/2025",
    procedures: [
      {
        cdtCode: "D3330",
        toothNumber: "3",
        toothSurface: "",
        description: "Endodontic therapy, molar",
        fee: 1750.00,
        negotiated: 1400.00,
        deductible: 0,
        coverage: 80,
        patientEstimate: 350.00,
        insuranceEstimate: 1400.00
      }
    ]
  },
  
  // Completed Claims
  {
    id: 15,
    patientName: "David Wilson",
    dateOfService: "03/15/2025",
    claimAmount: 2500.75,
    insuranceEstimate: 2000.60,
    patientEstimate: 500.15,
    billingProvider: "Dr. Floyd Miles",
    insuranceCarrier: "Delta Dental of California",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Completed",
    submissionDate: "03/16/2025",
    procedures: [
      {
        cdtCode: "D2740",
        toothNumber: "8",
        toothSurface: "",
        description: "Crown - porcelain/ceramic substrate",
        fee: 1500.50,
        negotiated: 1200.40,
        deductible: 0,
        coverage: 80,
        patientEstimate: 300.10,
        insuranceEstimate: 1200.40
      },
      {
        cdtCode: "D2950",
        toothNumber: "8",
        toothSurface: "",
        description: "Core buildup, including any pins when required",
        fee: 1000.25,
        negotiated: 800.20,
        deductible: 0,
        coverage: 80,
        patientEstimate: 200.05,
        insuranceEstimate: 800.20
      }
    ]
  },
  {
    id: 16,
    patientName: "Emily Clark",
    dateOfService: "03/10/2025",
    claimAmount: 350.25,
    insuranceEstimate: 350.25,
    patientEstimate: 0.00,
    billingProvider: "Dr. Ronald Richards",
    insuranceCarrier: "Humana Dental",
    planType: "PPO",
    insuranceOrder: "Primary",
    claimStatus: "Completed",
    submissionDate: "03/11/2025",
    procedures: [
      {
        cdtCode: "D0120",
        toothNumber: "",
        toothSurface: "",
        description: "Periodic oral evaluation",
        fee: 100.00,
        negotiated: 100.00,
        deductible: 0,
        coverage: 100,
        patientEstimate: 0.00,
        insuranceEstimate: 100.00
      },
      {
        cdtCode: "D0274",
        toothNumber: "",
        toothSurface: "",
        description: "Bitewings - four radiographic images",
        fee: 150.25,
        negotiated: 150.25,
        deductible: 0,
        coverage: 100,
        patientEstimate: 0.00,
        insuranceEstimate: 150.25
      },
      {
        cdtCode: "D1110",
        toothNumber: "",
        toothSurface: "",
        description: "Prophylaxis - adult",
        fee: 100.00,
        negotiated: 100.00,
        deductible: 0,
        coverage: 100,
        patientEstimate: 0.00,
        insuranceEstimate: 100.00
      }
    ]
  }
];

// Filter options
const insuranceCarriers = [
  "All Carriers",
  "Delta Dental of California",
  "Metlife",
  "United Healthcare",
  "Humana Dental",
  "Delta Dental",
];

const providers = [
  "All Providers",
  "Dr. Floyd Miles",
  "Dr. Annette Black",
  "Dr. Ronald Richards",
];

const statuses = [
  "All Statuses",
  "Sent",
  "Pending",
  "Resent",
  "Not Sent",
  "Completed",
];

export default function ClaimsPage() {
  // State
  const [selectedTab, setSelectedTab] = useState("not-submitted");
  const [selectedClaims, setSelectedClaims] = useState<number[]>([]);
  const [expandedClaimId, setExpandedClaimId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInsights, setShowInsights] = useState(false);
  const [filters, setFilters] = useState({
    insuranceCarrier: "All Carriers",
    provider: "All Providers",
    insuranceOrder: "All Orders",
    claimStatus: "All Statuses",
  });

  // Get filtered claims
  const getFilteredClaims = () => {
    let filtered = [...mockClaims];

    // Apply tab filters
    if (selectedTab === "not-submitted") {
      filtered = filtered.filter(claim => claim.claimStatus === "Not Sent");
    } else if (selectedTab === "submitted") {
      filtered = filtered.filter(claim => claim.claimStatus === "Sent" || claim.claimStatus === "Resent");
    } else if (selectedTab === "in-progress") {
      filtered = filtered.filter(claim => claim.claimStatus === "Pending");
    } else if (selectedTab === "completed") {
      // For completed tab, we'll show all claims but prioritize those that are not in other tabs
      // This allows us to see procedures in all claims when in the completed tab
      filtered = [...mockClaims]; // Show all claims in completed tab
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(claim =>
        claim.patientName.toLowerCase().includes(query) ||
        claim.billingProvider.toLowerCase().includes(query) ||
        claim.insuranceCarrier.toLowerCase().includes(query)
      );
    }

    // Apply dropdown filters
    if (filters.insuranceCarrier !== "All Carriers") {
      filtered = filtered.filter(claim => claim.insuranceCarrier === filters.insuranceCarrier);
    }
    if (filters.provider !== "All Providers") {
      filtered = filtered.filter(claim => claim.billingProvider === filters.provider);
    }
    if (filters.insuranceOrder !== "All Orders") {
      filtered = filtered.filter(claim => claim.insuranceOrder === filters.insuranceOrder);
    }
    if (filters.claimStatus !== "All Statuses") {
      filtered = filtered.filter(claim => claim.claimStatus === filters.claimStatus);
    }

    return filtered;
  };

  const filteredClaims = getFilteredClaims();

  // Handle row checkbox click
  const handleRowSelect = (id: number) => {
    setSelectedClaims(prev => {
      if (prev.includes(id)) {
        return prev.filter(claimId => claimId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedClaims.length === filteredClaims.length) {
      setSelectedClaims([]);
    } else {
      setSelectedClaims(filteredClaims.map(claim => claim.id));
    }
  };

  // Toggle expanded row for claim details
  const toggleExpandClaim = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedClaimId(expandedClaimId === id ? null : id);
  };

  // Render count badge for tabs
  const renderTabBadge = (count: number) => (
    <Badge variant="outline" className="ml-2 bg-muted text-muted-foreground">
      {count}
    </Badge>
  );

  // Calculate metrics and total values for KPIs and insights
  const calculateMetrics = () => {
    const totalPending = filteredClaims
      .filter(claim => claim.claimStatus === "Pending")
      .reduce((sum, claim) => sum + claim.claimAmount, 0);
    
    const totalNotSent = filteredClaims
      .filter(claim => claim.claimStatus === "Not Sent")
      .reduce((sum, claim) => sum + claim.claimAmount, 0);
    
    const totalInsuranceEstimate = filteredClaims
      .reduce((sum, claim) => sum + claim.insuranceEstimate, 0);
      
    const totalPatientEstimate = filteredClaims
      .reduce((sum, claim) => sum + claim.patientEstimate, 0);
      
    // Calculate claim counts by status
    const notSentCount = filteredClaims.filter(claim => claim.claimStatus === "Not Sent").length;
    const sentCount = filteredClaims.filter(claim => claim.claimStatus === "Sent").length;
    const resentCount = filteredClaims.filter(claim => claim.claimStatus === "Resent").length;
    const pendingCount = filteredClaims.filter(claim => claim.claimStatus === "Pending").length;
    const completedCount = filteredClaims.filter(claim => claim.claimStatus === "Completed").length;
    
    // Filter claims by status for the value stream view
    const notSentClaims = filteredClaims.filter(claim => claim.claimStatus === "Not Sent");
    const submittedClaims = filteredClaims.filter(claim => claim.claimStatus === "Sent" || claim.claimStatus === "Resent");
    const pendingClaims = filteredClaims.filter(claim => claim.claimStatus === "Pending");
    const completedClaims = filteredClaims.filter(claim => claim.claimStatus === "Completed");
    
    // Calculate carrier statistics
    const carrierStats = filteredClaims.reduce((acc, claim) => {
      const carrier = claim.insuranceCarrier;
      if (!acc[carrier]) {
        acc[carrier] = {
          count: 0,
          totalAmount: 0,
          totalInsuranceEstimate: 0
        };
      }
      acc[carrier].count += 1;
      acc[carrier].totalAmount += claim.claimAmount;
      acc[carrier].totalInsuranceEstimate += claim.insuranceEstimate;
      return acc;
    }, {} as Record<string, { count: number; totalAmount: number; totalInsuranceEstimate: number; }>);
    
    // Find top carriers by claim value
    const topCarriers = Object.entries(carrierStats)
      .sort(([, a], [, b]) => b.totalAmount - a.totalAmount)
      .slice(0, 3)
      .map(([name, stats]) => ({
        name,
        claimCount: stats.count,
        totalAmount: stats.totalAmount,
        percentOfTotal: (stats.totalAmount / filteredClaims.reduce((sum, claim) => sum + claim.claimAmount, 0)) * 100
      }));
      
    // Calculate primary vs secondary claim stats
    const primaryClaims = filteredClaims.filter(claim => claim.insuranceOrder === "Primary");
    const secondaryClaims = filteredClaims.filter(claim => claim.insuranceOrder === "Secondary");
    
    const primaryTotal = primaryClaims.reduce((sum, claim) => sum + claim.claimAmount, 0);
    const secondaryTotal = secondaryClaims.reduce((sum, claim) => sum + claim.claimAmount, 0);
    
    const primaryInsuranceEstimate = primaryClaims.reduce((sum, claim) => sum + claim.insuranceEstimate, 0);
    const secondaryInsuranceEstimate = secondaryClaims.reduce((sum, claim) => sum + claim.insuranceEstimate, 0);
    
    // Calculate aging for claims
    // Will be based on submissionDate if available
    const today = new Date();
    
    // Set realistic aging bucket values for demonstration
    const agingBuckets = {
      under30: 143250.75,
      days30to60: 57430.22,
      days60to90: 24689.50,
      over90: 18327.30
    };
    
    // This original code would be used in production to calculate real values
    /*
    filteredClaims.forEach(claim => {
      if (claim.submissionDate) {
        const submissionDate = new Date(claim.submissionDate);
        const daysSinceSubmission = Math.floor((today.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceSubmission < 30) {
          agingBuckets.under30 += claim.claimAmount;
        } else if (daysSinceSubmission < 60) {
          agingBuckets.days30to60 += claim.claimAmount;
        } else if (daysSinceSubmission < 90) {
          agingBuckets.days60to90 += claim.claimAmount;
        } else {
          agingBuckets.over90 += claim.claimAmount;
        }
      }
    });
    */
    
    // Calculate total claim amount and average claim value
    const totalClaimAmount = filteredClaims.reduce((sum, claim) => sum + claim.claimAmount, 0);
    const avgClaimValue = totalClaimAmount / (filteredClaims.length || 1);
    
    return { 
      totalPending, 
      totalNotSent, 
      totalInsuranceEstimate,
      totalPatientEstimate,
      notSentCount,
      sentCount,
      resentCount,
      pendingCount,
      completedCount,
      topCarriers,
      primaryTotal,
      secondaryTotal,
      primaryInsuranceEstimate,
      secondaryInsuranceEstimate,
      agingBuckets,
      totalClaimAmount,
      avgClaimValue,
      notSentClaims,
      submittedClaims,
      pendingClaims,
      completedClaims,
      primaryClaims,
      secondaryClaims
    };
  };

  const { 
    totalPending, 
    totalNotSent, 
    totalInsuranceEstimate,
    totalPatientEstimate,
    notSentCount,
    sentCount,
    resentCount,
    pendingCount,
    completedCount,
    topCarriers,
    primaryTotal,
    secondaryTotal,
    primaryInsuranceEstimate,
    secondaryInsuranceEstimate,
    agingBuckets,
    totalClaimAmount,
    avgClaimValue,
    notSentClaims,
    submittedClaims,
    pendingClaims,
    completedClaims,
    primaryClaims,
    secondaryClaims
  } = calculateMetrics();

  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-muted">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Claims Management</h1>
            
            {/* Quick Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9">
                  Quick Actions <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Claims
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Batch EOBs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Claims
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Action-Oriented KPI Cards - Primary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Unsent Claims Card */}
            <Card className="shadow-sm border-t-4 border-t-destructive/30 flex flex-col">
              <CardHeader className="py-3 px-5 border-b bg-destructive/5">
                <CardTitle className="text-base font-medium">Unsent Claims</CardTitle>
              </CardHeader>
              <CardContent className="py-5 px-5 flex-1 flex flex-col">
                <div>
                  <div className="text-2xl font-bold flex items-center justify-between mb-1">
                    <span>7 claims · $4,860</span>
                    <ChevronRight className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Dollars literally waiting on your desk
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full">
                    Send Claims
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Payer Rejections Card */}
            <Card className="shadow-sm border-t-4 border-t-amber-200 flex flex-col">
              <CardHeader className="py-3 px-5 border-b bg-amber-50/50">
                <CardTitle className="text-base font-medium">Payer Rejections</CardTitle>
              </CardHeader>
              <CardContent className="py-5 px-5 flex-1 flex flex-col">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-2xl font-bold">
                      3 claims rejected · $1,120
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">Fix now to avoid 30-day rebill delay.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Payer said no — let's turn it into yes
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full">
                    Correct & Resubmit
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Aging > 14 Days Card */}
            <Card className="shadow-sm border-t-4 border-t-orange-200 flex flex-col">
              <CardHeader className="py-3 px-5 border-b bg-muted/50">
                <CardTitle className="text-base font-medium">Aging &gt; 14 Days</CardTitle>
              </CardHeader>
              <CardContent className="py-5 px-5 flex-1 flex flex-col">
                <div>
                  <div className="text-2xl font-bold flex items-center justify-between mb-1">
                    $2,275 in limbo (9 claims)
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    No response from payer → follow-up call
                  </div>
                  
                  <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4">
                    <div className="h-full bg-gradient-to-r from-amber-300 to-red-500 rounded-full transition-all duration-1000" 
                         style={{ width: `70%` }}>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full">
                    Work Follow-ups
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Support Rail (secondary row) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Missing Attachments Card */}
            <Card className="shadow-sm border-t-2 border-t-muted flex flex-col">
              <CardHeader className="py-2 px-5 border-b bg-muted/20">
                <CardTitle className="text-sm font-medium">Missing Attachments</CardTitle>
              </CardHeader>
              <CardContent className="py-4 px-5 flex-1 flex flex-col">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-xl font-bold mb-1">
                      4 claims
                    </div>
                    <div className="text-xs text-muted-foreground">
                      X-rays or photos requested
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="h-8"
                    >
                      Attach Docs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Underpaid Alerts Card */}
            <Card className="shadow-sm border-t-2 border-t-muted flex flex-col">
              <CardHeader className="py-2 px-5 border-b bg-muted/20">
                <CardTitle className="text-sm font-medium">Underpaid Alerts</CardTitle>
              </CardHeader>
              <CardContent className="py-4 px-5 flex-1 flex flex-col">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-xl font-bold mb-1">
                      6 EOBs
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Payment &lt; 95% of contract fee
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="h-8"
                    >
                      Review EOB
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Coordination of Benefits Card */}
            <Card className="shadow-sm border-t-2 border-t-muted flex flex-col">
              <CardHeader className="py-2 px-5 border-b bg-muted/20">
                <CardTitle className="text-sm font-medium">Coordination of Benefits</CardTitle>
              </CardHeader>
              <CardContent className="py-4 px-5 flex-1 flex flex-col">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-xl font-bold mb-1">
                      3 claims
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Awaiting COB documentation
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="h-8"
                    >
                      Request Secondary Info
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center">
                  <CardTitle>Insurance Claims</CardTitle>
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
                    disabled={selectedClaims.length === 0}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Submit Selected
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9"
                    disabled={selectedClaims.length === 0}
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
                  <div className="flex items-center mb-3">
                    <div className="mr-2 text-lg font-medium">Claims Process Analysis</div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-300">
                      Insights
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium mb-3">Claims Lifecycle and Aging</h4>
                      <div className="bg-white p-4 rounded-md border shadow-sm">
                        {/* Claims Status Flow */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium mb-3">Claims Status Flow</h4>
                          <div className="bg-muted/20 p-4 rounded-lg border">
                            <div className="mb-4 flex items-center">
                              <div className="flex-1 h-2 bg-gray-200 relative">
                                {/* Status flow dots and connecting line */}
                                <div className="absolute top-0 left-0 right-0 h-2">
                                  <div className="bg-gradient-to-r from-gray-300 via-blue-400 to-green-400 h-full rounded-full"></div>
                                </div>
                                <div className="h-5 w-5 rounded-full absolute -top-1.5 left-0 bg-gray-100 border-2 border-gray-400 z-10"></div>
                                <div className="h-5 w-5 rounded-full absolute -top-1.5 left-1/3 bg-blue-100 border-2 border-blue-400 z-10"></div>
                                <div className="h-5 w-5 rounded-full absolute -top-1.5 left-2/3 bg-amber-100 border-2 border-amber-400 z-10"></div>
                                <div className="h-5 w-5 rounded-full absolute -top-1.5 right-0 bg-green-100 border-2 border-green-400 z-10"></div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-3">
                              {/* Not Sent */}
                              <div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="text-xs font-medium text-center text-gray-700 mb-1">Not Submitted</div>
                                <div className="text-sm font-bold text-gray-800 mb-1">14</div>
                                <div className="text-xs text-gray-600 mb-1">$4,325</div>
                                <div className="flex space-x-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>Avg: 2d</span>
                                </div>
                              </div>
                              
                              {/* Sent */}
                              <div className="flex flex-col items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <div className="text-xs font-medium text-center text-blue-700 mb-1">Submitted</div>
                                <div className="text-sm font-bold text-blue-800 mb-1">167</div>
                                <div className="text-xs text-blue-600 mb-1">$52,180</div>
                                <div className="flex space-x-1 text-xs text-blue-500">
                                  <Clock className="h-3 w-3" />
                                  <span>Avg: 1d</span>
                                </div>
                              </div>
                              
                              {/* Pending */}
                              <div className="flex flex-col items-center bg-amber-50 p-3 rounded-lg border border-amber-100">
                                <div className="text-xs font-medium text-center text-amber-700 mb-1">EOBs in Progress</div>
                                <div className="text-sm font-bold text-amber-800 mb-1">19</div>
                                <div className="text-xs text-amber-600 mb-1">$6,845</div>
                                <div className="flex space-x-1 text-xs text-amber-500">
                                  <Clock className="h-3 w-3" />
                                  <span>Avg: 14d</span>
                                </div>
                              </div>
                              
                              {/* Completed */}
                              <div className="flex flex-col items-center bg-green-50 p-3 rounded-lg border border-green-100">
                                <div className="text-xs font-medium text-center text-green-700 mb-1">Completed</div>
                                <div className="text-sm font-bold text-green-800 mb-1">7,986</div>
                                <div className="text-xs text-green-600 mb-1">$2,476,325</div>
                                <div className="flex space-x-1 text-xs text-green-500">
                                  <Clock className="h-3 w-3" />
                                  <span>Avg: 22d</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Aging Distribution - Moved from main view to insights panel */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium mb-3">Claims Aging Breakdown</h4>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            {/* 0-30 Days Card */}
                            <div className="bg-white p-3 rounded-lg border shadow-sm">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-xs font-medium">0-30 Days</div>
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                              </div>
                              <div className="text-xl font-bold text-green-600">
                                ${agingBuckets.under30.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                              </div>
                              <div className="text-xs text-green-700 mt-1">
                                {agingBuckets.under30 > 0 ? ((agingBuckets.under30 / (agingBuckets.under30 + agingBuckets.days30to60 + agingBuckets.days60to90 + agingBuckets.over90)) * 100).toFixed(0) : 0}% of total
                              </div>
                            </div>
                            
                            {/* 30-60 Days Card */}
                            <div className="bg-white p-3 rounded-lg border shadow-sm">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-xs font-medium">30-60 Days</div>
                                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                              </div>
                              <div className="text-xl font-bold text-blue-600">
                                ${agingBuckets.days30to60.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                              </div>
                              <div className="text-xs text-blue-700 mt-1">
                                {agingBuckets.days30to60 > 0 ? ((agingBuckets.days30to60 / (agingBuckets.under30 + agingBuckets.days30to60 + agingBuckets.days60to90 + agingBuckets.over90)) * 100).toFixed(0) : 0}% of total
                              </div>
                            </div>
                            
                            {/* 60-90 Days Card */}
                            <div className="bg-white p-3 rounded-lg border shadow-sm">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-xs font-medium">60-90 Days</div>
                                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                              </div>
                              <div className="text-xl font-bold text-amber-600">
                                ${agingBuckets.days60to90.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                              </div>
                              <div className="text-xs text-amber-700 mt-1">
                                {agingBuckets.days60to90 > 0 ? ((agingBuckets.days60to90 / (agingBuckets.under30 + agingBuckets.days30to60 + agingBuckets.days60to90 + agingBuckets.over90)) * 100).toFixed(0) : 0}% of total
                              </div>
                            </div>
                            
                            {/* 90+ Days Card */}
                            <div className="bg-white p-3 rounded-lg border shadow-sm">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-xs font-medium">90+ Days</div>
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                              </div>
                              <div className="text-xl font-bold text-red-600">
                                ${agingBuckets.over90.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                              </div>
                              <div className="text-xs text-red-700 mt-1">
                                {agingBuckets.over90 > 0 ? ((agingBuckets.over90 / (agingBuckets.under30 + agingBuckets.days30to60 + agingBuckets.days60to90 + agingBuckets.over90)) * 100).toFixed(0) : 0}% of total
                              </div>
                            </div>
                          </div>
                          
                          {/* Distribution visualization */}
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <div className="text-xs font-medium mb-3">Aging Distribution</div>
                            <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
                              {/* Calculate percentages */}
                              {(() => {
                                const total = agingBuckets.under30 + agingBuckets.days30to60 + agingBuckets.days60to90 + agingBuckets.over90;
                                const under30Pct = (agingBuckets.under30 / total) * 100;
                                const days30to60Pct = (agingBuckets.days30to60 / total) * 100;
                                const days60to90Pct = (agingBuckets.days60to90 / total) * 100;
                                const over90Pct = (agingBuckets.over90 / total) * 100;
                                
                                return (
                                  <>
                                    <div className="bg-green-500 h-full" style={{ width: `${under30Pct}%` }}></div>
                                    <div className="bg-blue-500 h-full" style={{ width: `${days30to60Pct}%` }}></div>
                                    <div className="bg-amber-500 h-full" style={{ width: `${days60to90Pct}%` }}></div>
                                    <div className="bg-red-500 h-full" style={{ width: `${over90Pct}%` }}></div>
                                  </>
                                );
                              })()}
                            </div>
                            
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                              <div>0 Days</div>
                              <div>30 Days</div>
                              <div>60 Days</div>
                              <div>90+ Days</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Process Recommendations</h4>
                      <div className="bg-white p-4 rounded-md border shadow-sm h-64 overflow-y-auto">
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-2 mt-0.5">
                              <ArrowUpRight className="h-3 w-3" />
                            </div>
                            <div>
                              <p className="text-xs font-medium">Reduce adjudication lag time</p>
                              <p className="text-xs text-muted-foreground">Follow up on claims pending over 10 days</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2 mt-0.5">
                              <Zap className="h-3 w-3" />
                            </div>
                            <div>
                              <p className="text-xs font-medium">Automate claim creation</p>
                              <p className="text-xs text-muted-foreground">Enable auto-generation from completed encounters</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2 mt-0.5">
                              <FileCheck className="h-3 w-3" />
                            </div>
                            <div>
                              <p className="text-xs font-medium">Implement pre-submission checks</p>
                              <p className="text-xs text-muted-foreground">Validate claims for common rejection reasons</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2 mt-0.5">
                              <BarChart3 className="h-3 w-3" />
                            </div>
                            <div>
                              <p className="text-xs font-medium">Review carrier performance</p>
                              <p className="text-xs text-muted-foreground">Analyze adjudication times by insurance carrier</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="p-0">
              <Tabs defaultValue="not-submitted" className="w-full" onValueChange={setSelectedTab}>
                <div className="border-b px-6 py-3">
                  <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                    <TabsTrigger value="not-submitted" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Not Submitted {renderTabBadge(14)}
                    </TabsTrigger>
                    <TabsTrigger value="submitted" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Submitted {renderTabBadge(167)}
                    </TabsTrigger>
                    <TabsTrigger value="in-progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      EOBs in Progress {renderTabBadge(19)}
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Completed {renderTabBadge(7986)}
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Filter bar */}
                <div className="flex flex-wrap justify-between items-center px-6 py-4 bg-card border-b">
                  <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                    <Select
                      value={filters.insuranceCarrier}
                      onValueChange={(value) => setFilters({ ...filters, insuranceCarrier: value })}
                    >
                      <SelectTrigger className="w-[200px] h-9">
                        <SelectValue placeholder="Insurance Carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        {insuranceCarriers.map((carrier) => (
                          <SelectItem key={carrier} value={carrier}>
                            {carrier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={filters.provider}
                      onValueChange={(value) => setFilters({ ...filters, provider: value })}
                    >
                      <SelectTrigger className="w-[200px] h-9">
                        <SelectValue placeholder="Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={filters.insuranceOrder}
                      onValueChange={(value) => setFilters({ ...filters, insuranceOrder: value })}
                    >
                      <SelectTrigger className="w-[200px] h-9">
                        <SelectValue placeholder="Insurance Order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Orders">All Orders</SelectItem>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filters.claimStatus}
                      onValueChange={(value) => setFilters({ ...filters, claimStatus: value })}
                    >
                      <SelectTrigger className="w-[200px] h-9">
                        <SelectValue placeholder="Claim Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patient name"
                      className="pl-9 pr-4 h-9 w-full md:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filter chips */}
                {(filters.insuranceCarrier !== "All Carriers" || filters.provider !== "All Providers" || filters.claimStatus !== "All Statuses" || filters.insuranceOrder !== "All Orders") && (
                  <div className="flex items-center gap-2 px-6 py-2 bg-card border-b text-sm">
                    <span className="text-muted-foreground">Filtered results: {filteredClaims.length}</span>
                    
                    {filters.insuranceCarrier !== "All Carriers" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.insuranceCarrier} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, insuranceCarrier: "All Carriers" })} />
                      </Badge>
                    )}
                    
                    {filters.provider !== "All Providers" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.provider} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, provider: "All Providers" })} />
                      </Badge>
                    )}

                    {filters.claimStatus !== "All Statuses" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.claimStatus} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, claimStatus: "All Statuses" })} />
                      </Badge>
                    )}

                    {filters.insuranceOrder !== "All Orders" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.insuranceOrder} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, insuranceOrder: "All Orders" })} />
                      </Badge>
                    )}
                    
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setFilters({
                      insuranceCarrier: "All Carriers",
                      provider: "All Providers",
                      insuranceOrder: "All Orders",
                      claimStatus: "All Statuses"
                    })}>
                      Clear all
                    </Button>
                  </div>
                )}

                {/* Selected claims count */}
                {selectedClaims.length > 0 && (
                  <div className="px-6 py-2 bg-card border-b text-sm">
                    <span>{selectedClaims.length} out of {filteredClaims.length} selected</span>
                  </div>
                )}

                {/* Claims table */}
                <div className="w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox 
                            checked={filteredClaims.length > 0 && selectedClaims.length === filteredClaims.length} 
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all claims"
                          />
                        </TableHead>
                        <TableHead className="w-[130px]">Date of Service</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead className="text-right">Claim Amt</TableHead>
                        <TableHead className="text-right">Ins Est</TableHead>
                        <TableHead className="text-right">Pt Est</TableHead>
                        <TableHead>Billing Provider</TableHead>
                        <TableHead>Insurance Carrier</TableHead>
                        <TableHead>Plan Type</TableHead>
                        <TableHead>Ins Order</TableHead>
                        <TableHead>Claim Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClaims.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={12} className="text-center h-32">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <FileText className="h-8 w-8 mb-2" />
                              <p>No claims match your filter criteria</p>
                              <Button 
                                variant="link" 
                                className="mt-2"
                                onClick={() => {
                                  setSearchQuery("");
                                  setFilters({
                                    insuranceCarrier: "All Carriers",
                                    provider: "All Providers",
                                    insuranceOrder: "All Orders",
                                    claimStatus: "All Statuses"
                                  });
                                }}
                              >
                                Clear all filters
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <>
                          {filteredClaims.map((claim: Claim) => {
                            return (
                              <React.Fragment key={`claim-row-${claim.id}`}>
                                <TableRow 
                                  className={selectedClaims.includes(claim.id) ? "bg-muted/50" : ""}
                                >
                                  <TableCell>
                                    <Checkbox 
                                      checked={selectedClaims.includes(claim.id)} 
                                      onCheckedChange={() => handleRowSelect(claim.id)}
                                      aria-label={`Select claim for ${claim.patientName}`}
                                    />
                                  </TableCell>
                                  <TableCell>{claim.dateOfService}</TableCell>
                                  <TableCell className="font-medium">{claim.patientName}</TableCell>
                                  <TableCell className="text-right">${claim.claimAmount.toFixed(2)}</TableCell>
                                  <TableCell className="text-right">${claim.insuranceEstimate.toFixed(2)}</TableCell>
                                  <TableCell className="text-right">${claim.patientEstimate.toFixed(2)}</TableCell>
                                  <TableCell>{claim.billingProvider}</TableCell>
                                  <TableCell>{claim.insuranceCarrier}</TableCell>
                                  <TableCell>{claim.planType}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={claim.insuranceOrder === "Primary" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-700 border-gray-200"}>
                                      {claim.insuranceOrder}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge 
                                      className={`
                                        ${claim.claimStatus === "Sent" ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}
                                        ${claim.claimStatus === "Resent" ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : ""}
                                        ${claim.claimStatus === "Pending" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : ""}
                                        ${claim.claimStatus === "Not Sent" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : ""}
                                      `}
                                    >
                                      {claim.claimStatus}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end">
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => toggleExpandClaim(claim.id, e)}
                                      >
                                        {expandedClaimId === claim.id ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Expand details</span>
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                                
                                {/* Conditionally render the expanded details */}
                                {expandedClaimId === claim.id && claim.procedures && (
                                  <TableRow key={`claim-details-${claim.id}`} className="bg-muted/30 border-t-0">
                                    <TableCell colSpan={12} className="p-0">
                                      <div className="p-4">
                                        <div className="mb-4">
                                          <h4 className="text-sm font-semibold mb-2">Procedure Details</h4>
                                          <table className="w-full border-collapse">
                                            <thead>
                                              <tr className="border-y bg-muted">
                                                <th className="py-2 px-3 text-xs font-semibold text-left border-r w-[100px]">CDT Code</th>
                                                <th className="py-2 px-3 text-xs font-semibold text-left border-r w-[80px]">Tth/ Surf</th>
                                                <th className="py-2 px-3 text-xs font-semibold text-left border-r">Description</th>
                                                <th className="py-2 px-3 text-xs font-semibold text-right border-r">Fees</th>
                                                <th className="py-2 px-3 text-xs font-semibold text-right border-r">Negotiated</th>
                                                <th className="py-2 px-3 text-xs font-semibold text-right border-r">Deductible</th>
                                                <th className="py-2 px-3 text-xs font-semibold text-right border-r">Coverage</th>
                                                <th className="py-2 px-3 text-xs font-semibold text-right border-r">Pt Est</th>
                                                <th className="py-2 px-3 text-xs font-semibold text-right">Ins Est</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {claim.procedures.map((procedure: Procedure, index: number) => (
                                                <tr key={index} className="border-b hover:bg-muted/20">
                                                  <td className="py-2 px-3 text-sm border-r">{procedure.cdtCode}</td>
                                                  <td className="py-2 px-3 text-sm border-r">
                                                    {procedure.toothNumber}{procedure.toothSurface ? '/' + procedure.toothSurface : ''}
                                                  </td>
                                                  <td className="py-2 px-3 text-sm border-r">{procedure.description}</td>
                                                  <td className="py-2 px-3 text-sm border-r text-right">${procedure.fee.toFixed(2)}</td>
                                                  <td className="py-2 px-3 text-sm border-r text-right">${procedure.negotiated.toFixed(2)}</td>
                                                  <td className="py-2 px-3 text-sm border-r text-right">${procedure.deductible.toFixed(2)}</td>
                                                  <td className="py-2 px-3 text-sm border-r text-right">{procedure.coverage}%</td>
                                                  <td className="py-2 px-3 text-sm border-r text-right">${procedure.patientEstimate.toFixed(2)}</td>
                                                  <td className="py-2 px-3 text-sm text-right">${procedure.insuranceEstimate.toFixed(2)}</td>
                                                </tr>
                                              ))}
                                              <tr className="bg-muted/40">
                                                <td colSpan={3} className="py-2 px-3 text-sm font-semibold border-r">Total</td>
                                                <td className="py-2 px-3 text-sm font-semibold border-r text-right">
                                                  ${claim.procedures.reduce((sum: number, p: Procedure) => sum + p.fee, 0).toFixed(2)}
                                                </td>
                                                <td className="py-2 px-3 text-sm font-semibold border-r text-right">
                                                  ${claim.procedures.reduce((sum: number, p: Procedure) => sum + p.negotiated, 0).toFixed(2)}
                                                </td>
                                                <td className="py-2 px-3 text-sm font-semibold border-r text-right">
                                                  ${claim.procedures.reduce((sum: number, p: Procedure) => sum + p.deductible, 0).toFixed(2)}
                                                </td>
                                                <td className="py-2 px-3 text-sm font-semibold border-r text-right">-</td>
                                                <td className="py-2 px-3 text-sm font-semibold border-r text-right">
                                                  ${claim.procedures.reduce((sum: number, p: Procedure) => sum + p.patientEstimate, 0).toFixed(2)}
                                                </td>
                                                <td className="py-2 px-3 text-sm font-semibold text-right">
                                                  ${claim.procedures.reduce((sum: number, p: Procedure) => sum + p.insuranceEstimate, 0).toFixed(2)}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                        
                                        {/* Action buttons */}
                                        <div className="flex justify-end space-x-2 mt-4">
                                          <Button variant="outline" size="sm">
                                            <Printer className="h-4 w-4 mr-2" />
                                            Print Claim
                                          </Button>
                                          <Button variant="default" size="sm">
                                            <Send className="h-4 w-4 mr-2" />
                                            Submit Claim
                                          </Button>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </>
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