import React, { useState } from "react";
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
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
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
} from "lucide-react";

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
  claimStatus: "Sent" | "Pending" | "Resent" | "Not Sent";
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
  }
];

// Filter options
const insuranceCarriers = [
  "All",
  "Delta Dental of California",
  "Metlife",
  "United Healthcare",
  "Humana Dental",
  "Delta Dental",
];

const providers = [
  "All",
  "Dr. Floyd Miles",
  "Dr. Annette Black",
  "Dr. Ronald Richards",
];

const statuses = [
  "All",
  "Sent",
  "Pending",
  "Resent",
  "Not Sent",
];

export default function ClaimsPage() {
  // State
  const [selectedTab, setSelectedTab] = useState("not-submitted");
  const [selectedClaims, setSelectedClaims] = useState<number[]>([]);
  const [expandedClaimId, setExpandedClaimId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    insuranceCarrier: "All",
    provider: "All",
    insuranceOrder: "All",
    claimStatus: "All",
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
    if (filters.insuranceCarrier !== "All") {
      filtered = filtered.filter(claim => claim.insuranceCarrier === filters.insuranceCarrier);
    }
    if (filters.provider !== "All") {
      filtered = filtered.filter(claim => claim.billingProvider === filters.provider);
    }
    if (filters.insuranceOrder !== "All") {
      filtered = filtered.filter(claim => claim.insuranceOrder === filters.insuranceOrder);
    }
    if (filters.claimStatus !== "All") {
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
  const toggleExpandClaim = (id: number) => {
    setExpandedClaimId(expandedClaimId === id ? null : id);
  };

  // Render count badge for tabs
  const renderTabBadge = (count: number) => (
    <Badge variant="outline" className="ml-2 bg-muted text-muted-foreground">
      {count}
    </Badge>
  );

  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-muted">
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Claims Management</h1>

          <Card className="shadow-sm">
            <CardHeader className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Insurance Claims</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-9"
                    disabled={selectedClaims.length === 0}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Submit Selected
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <Plus className="h-4 w-4 mr-1" />
                    New Claim
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs defaultValue="not-submitted" className="w-full" onValueChange={setSelectedTab}>
                <div className="border-b px-6 py-3">
                  <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                    <TabsTrigger value="not-submitted" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Not Submitted {renderTabBadge(40)}
                    </TabsTrigger>
                    <TabsTrigger value="submitted" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Submitted {renderTabBadge(150)}
                    </TabsTrigger>
                    <TabsTrigger value="in-progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      EOBs in Progress {renderTabBadge(3)}
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Completed {renderTabBadge(1200)}
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
                        <SelectItem value="All">All</SelectItem>
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
                {(filters.insuranceCarrier !== "All" || filters.provider !== "All") && (
                  <div className="flex items-center gap-2 px-6 py-2 bg-card border-b text-sm">
                    <span className="text-muted-foreground">Filtered results: {filteredClaims.length}</span>
                    
                    {filters.insuranceCarrier !== "All" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.insuranceCarrier} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, insuranceCarrier: "All" })} />
                      </Badge>
                    )}
                    
                    {filters.provider !== "All" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {filters.provider} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, provider: "All" })} />
                      </Badge>
                    )}
                    
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setFilters({
                      insuranceCarrier: "All",
                      provider: "All",
                      insuranceOrder: "All",
                      claimStatus: "All"
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
                                    insuranceCarrier: "All",
                                    provider: "All",
                                    insuranceOrder: "All",
                                    claimStatus: "All"
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
                          {filteredClaims.map((claim) => (
                            <React.Fragment key={claim.id}>
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
                                <TableCell>
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleExpandClaim(claim.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronDown 
                                      className={`h-4 w-4 transition-transform duration-200 ${expandedClaimId === claim.id ? "transform rotate-180" : ""}`} 
                                    />
                                  </Button>
                                </TableCell>
                              </TableRow>

                              {/* Expanded claim details */}
                              {expandedClaimId === claim.id && claim.procedures && (
                                <TableRow className="bg-gray-50">
                                  <TableCell colSpan={12} className="p-0">
                                    <div className="p-0">
                                      <table className="w-full border-collapse">
                                        <thead>
                                          <tr className="border-y bg-gray-100">
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
                                          {claim.procedures.map((procedure, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
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
                                          <tr className="bg-gray-50">
                                            <td colSpan={3} className="py-2 px-3 text-sm font-semibold border-r">Total</td>
                                            <td className="py-2 px-3 text-sm font-semibold border-r text-right">
                                              ${claim.procedures.reduce((sum, p) => sum + p.fee, 0).toFixed(2)}
                                            </td>
                                            <td className="py-2 px-3 text-sm font-semibold border-r text-right">
                                              ${claim.procedures.reduce((sum, p) => sum + p.negotiated, 0).toFixed(2)}
                                            </td>
                                            <td className="py-2 px-3 text-sm font-semibold border-r text-right">
                                              ${claim.procedures.reduce((sum, p) => sum + p.deductible, 0).toFixed(2)}
                                            </td>
                                            <td className="py-2 px-3 text-sm font-semibold border-r text-right">-</td>
                                            <td className="py-2 px-3 text-sm font-semibold border-r text-right">
                                              ${claim.procedures.reduce((sum, p) => sum + p.patientEstimate, 0).toFixed(2)}
                                            </td>
                                            <td className="py-2 px-3 text-sm font-semibold text-right">
                                              ${claim.procedures.reduce((sum, p) => sum + p.insuranceEstimate, 0).toFixed(2)}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))}
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