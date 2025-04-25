import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Filter, 
  Search, 
  PlusCircle, 
  ChevronRight, 
  ChevronDown, 
  Calendar,
  MessageSquare,
  Download,
  Users,
  Calendar as CalendarIcon,
  FileText,
  Layers,
  ListFilter,
  RefreshCcw,
  AlertCircle,
  Wallet,
  Mail,
  X,
  Check,
  LayoutGrid,
  Plus,
  Save,
  Edit,
  Copy,
  Trash2
} from "lucide-react";
import JSConfetti from 'js-confetti';

// Mock data for segments
type Segment = {
  id: number;
  title: string;
  count: number;
  value: number;
  nextAction: string;
  filters: string[];
  status: "mint" | "amber" | "coral" | "grey"; // Mint = healthy, Amber = needs attention, Coral = urgent
  pinned: boolean;
  lastUpdated: string;
  description?: string;
};

// Interface for the basic segment metadata
interface SegmentMetadata {
  title: string;
  description?: string;
  filters: string[];
  nextAction: string;
  pinned: boolean;
}

const mockSegments: Segment[] = [
  {
    id: 1,
    title: "Recall Due — This Week",
    count: 26,
    value: 7280,
    nextAction: "Book Hygiene",
    filters: ["NextVisit is null", "RecallDue <= 7 days"],
    status: "coral",
    pinned: true,
    lastUpdated: "2025-04-24"
  },
  {
    id: 2,
    title: "High Balance >$300",
    count: 14,
    value: 4960,
    nextAction: "Collect",
    filters: ["Balance >= 300", "StatementStatus = Sent"],
    status: "amber",
    pinned: true,
    lastUpdated: "2025-04-24"
  },
  {
    id: 3,
    title: "FSA Expiring 45d",
    count: 8,
    value: 3200,
    nextAction: "Offer Booking",
    filters: ["Insurance.FSAExpire <= 45d"],
    status: "mint",
    pinned: false,
    lastUpdated: "2025-04-23"
  },
  {
    id: 4,
    title: "Allergy Patients",
    count: 12,
    value: 0,
    nextAction: "Flag Chart",
    filters: ["Allergy != null"],
    status: "mint",
    pinned: false,
    lastUpdated: "2025-04-22"
  },
  {
    id: 5,
    title: "Dormant 12–24 m",
    count: 31,
    value: 9300,
    nextAction: "Reactivate",
    filters: ["LastVisit between 12 and 24 months"],
    status: "amber",
    pinned: false,
    lastUpdated: "2025-04-22",
    description: "Patients who haven't visited in 12-24 months but aren't yet considered inactive"
  },
  {
    id: 6,
    title: "Data Gaps - Missing DOB",
    count: 9,
    value: 0,
    nextAction: "Fix Info",
    filters: ["DateOfBirth is null", "Status = 'Active'"],
    status: "amber",
    pinned: false,
    lastUpdated: "2025-04-24"
  }
];

// Filter categories and fields
const filterCategories = [
  { 
    name: "Demographics", 
    fields: ["Age", "DateOfBirth", "Gender", "ZipCode", "Distance"] 
  },
  { 
    name: "Visit History", 
    fields: ["LastVisit", "NextVisit", "RecallDue", "AppointmentCount", "VisitFrequency"] 
  },
  { 
    name: "Financial", 
    fields: ["Balance", "StatementStatus", "InsuranceStatus", "PaymentHistory", "LifetimeValue"] 
  },
  { 
    name: "Medical", 
    fields: ["Allergy", "MedicalAlert", "Procedure", "Diagnosis", "MedicationList"] 
  },
  { 
    name: "Insurance", 
    fields: ["InsuranceType", "InsuranceProvider", "FSAExpire", "AnnualMaximum", "RemainingBenefits"] 
  }
];

// Pre-defined actions for segments
const segmentActions = [
  "Book Hygiene",
  "Collect",
  "Offer Booking",
  "Flag Chart",
  "Reactivate",
  "Fix Info",
  "Send Recall",
  "Push Gap SMS",
  "None"
];

export default function SmartSegmentsPage() {
  // State
  const [selectedSegments, setSelectedSegments] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingSegment, setEditingSegment] = useState<SegmentMetadata | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  
  // Sorting and filtering state
  const [sortBy, setSortBy] = useState<"status" | "title" | "count" | "value">("status");
  const [filterStatus, setFilterStatus] = useState<"all" | "mint" | "amber" | "coral" | "grey">("all");
  
  // New segment form state
  const [formData, setFormData] = useState<SegmentMetadata>({
    title: "",
    description: "",
    filters: [],
    nextAction: "None",
    pinned: false
  });
  
  // Current filter being added
  const [currentFilter, setCurrentFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(filterCategories[0].name);
  const [selectedField, setSelectedField] = useState(filterCategories[0].fields[0]);
  const [operator, setOperator] = useState("equals");
  const [filterValue, setFilterValue] = useState("");
  
  // Live preview state
  const [previewCount, setPreviewCount] = useState(0);
  const [previewValue, setPreviewValue] = useState(0);
  
  const { toast } = useToast();
  
  // Initialize data
  useEffect(() => {
    setSegments(mockSegments);
  }, []);
  
  // Update preview count and value whenever formData.filters changes
  useEffect(() => {
    // In a real app, this would make an API call to get the count based on the filters
    // For now, generate a random number
    if (formData.filters.length === 0) {
      setPreviewCount(0);
      setPreviewValue(0);
    } else {
      const randomCount = Math.floor(Math.random() * 50) + 1;
      setPreviewCount(randomCount);
      setPreviewValue(randomCount * 300); // Assuming average value of $300 per patient
    }
  }, [formData.filters]);
  
  // Toggle drawer
  const toggleDrawer = () => {
    if (showDrawer) {
      // Reset form when closing
      setFormData({
        title: "",
        description: "",
        filters: [],
        nextAction: "None",
        pinned: false
      });
      setEditingSegment(null);
    }
    setShowDrawer(!showDrawer);
  };
  
  // Edit segment
  const handleEditSegment = (segment: Segment) => {
    setFormData({
      title: segment.title,
      description: segment.description || "",
      filters: segment.filters,
      nextAction: segment.nextAction,
      pinned: segment.pinned
    });
    setEditingSegment({
      title: segment.title,
      description: segment.description || "",
      filters: segment.filters,
      nextAction: segment.nextAction,
      pinned: segment.pinned
    });
    setShowDrawer(true);
  };
  
  // Add a new filter condition
  const addFilter = () => {
    if (!filterValue.trim()) return;
    
    const filterString = `${selectedField} ${operator} ${filterValue}`;
    setFormData({
      ...formData,
      filters: [...formData.filters, filterString]
    });
    
    // Reset the inputs
    setFilterValue("");
  };
  
  // Remove a filter
  const removeFilter = (index: number) => {
    const newFilters = [...formData.filters];
    newFilters.splice(index, 1);
    setFormData({
      ...formData,
      filters: newFilters
    });
  };
  
  // Save a new segment
  const saveSegment = () => {
    if (!formData.title.trim() || formData.filters.length === 0) {
      toast({
        title: "Error",
        description: "Title and at least one filter are required",
        variant: "destructive"
      });
      return;
    }
    
    // Create new segment or update existing one
    const isEdit = !!editingSegment;
    
    if (isEdit) {
      const updatedSegments = segments.map(seg => 
        seg.title === editingSegment.title 
          ? { 
              ...seg, 
              title: formData.title, 
              filters: formData.filters, 
              nextAction: formData.nextAction, 
              pinned: formData.pinned,
              description: formData.description,
              lastUpdated: new Date().toISOString().split('T')[0]
            } 
          : seg
      );
      setSegments(updatedSegments);
      
      toast({
        title: "Segment Updated",
        description: `"${formData.title}" has been updated`,
      });
    } else {
      // Add new segment
      const newSegment: Segment = {
        id: segments.length + 1,
        title: formData.title,
        count: previewCount,
        value: previewValue,
        nextAction: formData.nextAction,
        filters: formData.filters,
        status: "grey", // New segments start as grey until refreshed
        pinned: formData.pinned,
        lastUpdated: new Date().toISOString().split('T')[0],
        description: formData.description
      };
      
      setSegments([...segments, newSegment]);
      
      toast({
        title: "Segment Created",
        description: `"${formData.title}" will be available after refresh`,
      });
      
      // Wait 2 seconds and update the status to simulate refresh
      setTimeout(() => {
        setSegments(prev => 
          prev.map(seg => 
            seg.id === newSegment.id 
              ? { ...seg, status: "mint", count: previewCount, value: previewValue } 
              : seg
          )
        );
        
        toast({
          title: "Segment Refreshed",
          description: `"${formData.title}" is now live with ${previewCount} patients`,
        });
      }, 2000);
    }
    
    // Reset form and close drawer
    setFormData({
      title: "",
      description: "",
      filters: [],
      nextAction: "None",
      pinned: false
    });
    setEditingSegment(null);
    setShowDrawer(false);
  };
  
  // Toggle pin status
  const togglePin = (id: number) => {
    const updatedSegments = segments.map(segment => 
      segment.id === id ? { ...segment, pinned: !segment.pinned } : segment
    );
    setSegments(updatedSegments);
    
    const segment = segments.find(s => s.id === id);
    if (segment) {
      toast({
        title: segment.pinned ? "Unpinned" : "Pinned to Directory",
        description: segment.pinned 
          ? `"${segment.title}" removed from Directory chips` 
          : `"${segment.title}" added to Directory chips`
      });
    }
  };
  
  // Archive segments
  const archiveSegments = () => {
    if (selectedSegments.length === 0) return;
    
    const segmentNames = selectedSegments.map(id => 
      segments.find(s => s.id === id)?.title
    ).join(", ");
    
    setSegments(segments.filter(segment => !selectedSegments.includes(segment.id)));
    
    toast({
      title: "Segments Archived",
      description: `${selectedSegments.length} segments have been archived. You can restore them anytime.`,
      action: (
        <Button variant="outline" size="sm" onClick={() => {
          // This would restore the segments in a real app
          toast({
            title: "Segments Restored",
            description: "The segments have been restored to your gallery."
          });
        }}>
          Undo
        </Button>
      )
    });
    
    setSelectedSegments([]);
    setShowBulkActions(false);
  };
  
  // Bulk actions
  const handleSelectSegment = (id: number) => {
    setSelectedSegments(prev => {
      const newSelected = prev.includes(id)
        ? prev.filter(segId => segId !== id)
        : [...prev, id];
      
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };
  
  const handleBulkSMS = () => {
    toast({
      title: "SMS Campaign Started",
      description: `Preparing messages for ${selectedSegments.length} segments (${selectedSegments.length * 12} patients)`
    });
    setSelectedSegments([]);
    setShowBulkActions(false);
  };
  
  const handleBulkEmail = () => {
    toast({
      title: "Email Campaign Started",
      description: `Preparing emails for ${selectedSegments.length} segments (${selectedSegments.length * 12} patients)`
    });
    setSelectedSegments([]);
    setShowBulkActions(false);
  };
  
  const handleBulkExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${selectedSegments.length} segments to CSV`
    });
    setSelectedSegments([]);
    setShowBulkActions(false);
  };
  
  // Calculate metrics for KPI cards
  const calculateMetrics = () => {
    const recallDueThisWeek = segments.find(s => s.title === "Recall Due — This Week");
    const highBalance = segments.find(s => s.title === "High Balance >$300");
    const dataGaps = segments.find(s => s.title === "Data Gaps - Missing DOB");
    
    return {
      recallDueCount: recallDueThisWeek?.count || 0,
      recallDueValue: recallDueThisWeek?.value || 0,
      highBalanceCount: highBalance?.count || 0,
      highBalanceValue: highBalance?.value || 0,
      dataGapsCount: dataGaps?.count || 0
    };
  };
  
  const { 
    recallDueCount, 
    recallDueValue, 
    highBalanceCount, 
    highBalanceValue, 
    dataGapsCount 
  } = calculateMetrics();
  
  // Handle segment status change (to trigger confetti)
  const handleStatusChange = (segment: Segment, newStatus: "mint" | "amber" | "coral" | "grey") => {
    // Only show confetti when improving from amber to mint
    if (segment.status === "amber" && newStatus === "mint") {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: ['✅'],
        confettiNumber: 30,
      });
      
      toast({
        title: "Segment Improved!",
        description: `"${segment.title}" now has healthy metrics. Great job!`
      });
    }
    
    // Update the segment status
    setSegments(prev => 
      prev.map(s => s.id === segment.id ? { ...s, status: newStatus } : s)
    );
  };
  
  // Get filtered and sorted segments
  const getFilteredSegments = () => {
    let filtered = [...segments];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(segment => 
        segment.title.toLowerCase().includes(query) || 
        segment.filters.some(f => f.toLowerCase().includes(query)) ||
        (segment.description && segment.description.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(segment => segment.status === filterStatus);
    }
    
    // Apply sort
    if (sortBy === "status") {
      // Sort by status priority: coral > amber > mint > grey
      filtered.sort((a, b) => {
        const statusPriority = { coral: 0, amber: 1, mint: 2, grey: 3 };
        return statusPriority[a.status] - statusPriority[b.status];
      });
    } else if (sortBy === "count") {
      filtered.sort((a, b) => b.count - a.count);
    } else if (sortBy === "value") {
      filtered.sort((a, b) => b.value - a.value);
    } else {
      // Sort alphabetically by title
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return filtered;
  };
  
  const filteredSegments = getFilteredSegments();
  
  return (
    <NavigationWrapper>
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Smart Segments</h1>
          <Button onClick={toggleDrawer} size="sm" className="h-9">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Segment
          </Button>
        </div>
        
        {/* Hero KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Recall Due Card */}
          <Card className="shadow-sm border-t-4 border-t-amber-400 flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-amber-50/30">
              <CardTitle className="text-base font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-slate-600" />
                Recall Due (Next 7d)
              </CardTitle>
            </CardHeader>
            <CardContent className="py-5 px-5 flex-1 flex flex-col">
              <div>
                <div className="text-2xl font-bold flex items-center justify-between mb-1">
                  <span className={recallDueCount >= 30 ? "text-coral-600" : recallDueCount >= 20 ? "text-amber-600" : "text-emerald-600"}>
                    {recallDueCount} patients
                  </span>
                  <ChevronRight className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  ${recallDueValue} production at risk
                </div>
                
                {recallDueCount > 0 ? (
                  <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        recallDueCount >= 30 ? "bg-coral-500" : 
                        recallDueCount >= 20 ? "bg-amber-500" : 
                        "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min((recallDueCount / 40) * 100, 100)}%` }}>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 mb-2 text-sm">
                    <Check className="h-4 w-4 mr-1" />
                    <span>All clear—nothing leaking.</span>
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <Button 
                  variant="default"
                  size="sm"
                  className="w-full"
                  disabled={recallDueCount === 0}
                >
                  Book Hygiene
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* High Balance Card */}
          <Card className="shadow-sm border-t-4 border-t-coral-400 flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-coral-50/30">
              <CardTitle className="text-base font-medium flex items-center">
                <Wallet className="h-4 w-4 mr-2 text-slate-600" />
                High Balance {'>'} $300
              </CardTitle>
            </CardHeader>
            <CardContent className="py-5 px-5 flex-1 flex flex-col">
              <div>
                <div className="text-2xl font-bold flex items-center justify-between mb-1">
                  <span className={highBalanceCount >= 20 ? "text-coral-600" : highBalanceCount >= 10 ? "text-amber-600" : "text-emerald-600"}>
                    {highBalanceCount} patients
                  </span>
                  <ChevronRight className="h-5 w-5 text-coral-500" />
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  ${highBalanceValue} unpaid
                </div>
                
                {highBalanceCount > 0 ? (
                  <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        highBalanceCount >= 20 ? "bg-coral-500" : 
                        highBalanceCount >= 10 ? "bg-amber-500" : 
                        "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min((highBalanceCount / 30) * 100, 100)}%` }}>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 mb-2 text-sm">
                    <Check className="h-4 w-4 mr-1" />
                    <span>All clear—nothing leaking.</span>
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <Button 
                  variant="default"
                  size="sm"
                  className="w-full"
                  disabled={highBalanceCount === 0}
                >
                  Collect Now
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Data Gaps Card */}
          <Card className="shadow-sm border-t-4 border-t-blue-400 flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-blue-50/30">
              <CardTitle className="text-base font-medium flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-slate-600" />
                Data Gaps
              </CardTitle>
            </CardHeader>
            <CardContent className="py-5 px-5 flex-1 flex flex-col">
              <div>
                <div className="text-2xl font-bold flex items-center justify-between mb-1">
                  <span className={dataGapsCount >= 10 ? "text-coral-600" : dataGapsCount >= 5 ? "text-amber-600" : "text-emerald-600"}>
                    {dataGapsCount} charts
                  </span>
                  <ChevronRight className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  Missing DOB / Insurance info
                </div>
                
                {dataGapsCount > 0 ? (
                  <div className="h-2 w-full bg-gray-100 rounded-full cursor-pointer mb-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        dataGapsCount >= 10 ? "bg-coral-500" : 
                        dataGapsCount >= 5 ? "bg-amber-500" : 
                        "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min((dataGapsCount / 15) * 100, 100)}%` }}>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 mb-2 text-sm">
                    <Check className="h-4 w-4 mr-1" />
                    <span>All clear—nothing leaking.</span>
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <Button 
                  variant="default"
                  size="sm"
                  className="w-full"
                  disabled={dataGapsCount === 0}
                >
                  Fix Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-12 gap-4">
          {/* Segment Gallery (9/12 columns) */}
          <div className="col-span-12 md:col-span-9">
            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search segments..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select 
                  value={sortBy} 
                  onValueChange={(value) => setSortBy(value as any)}
                >
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Sort by Priority</SelectItem>
                    <SelectItem value="title">Sort by Name</SelectItem>
                    <SelectItem value="count">Sort by Patient Count</SelectItem>
                    <SelectItem value="value">Sort by Value</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={filterStatus} 
                  onValueChange={(value) => setFilterStatus(value as any)}
                >
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="coral">Urgent</SelectItem>
                    <SelectItem value="amber">Needs Attention</SelectItem>
                    <SelectItem value="mint">Healthy</SelectItem>
                    <SelectItem value="grey">Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Segments Grid */}
            {filteredSegments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredSegments.map((segment) => (
                  <Card 
                    key={segment.id} 
                    className={`relative border-t-4 ${
                      segment.status === "mint" ? "border-t-emerald-400" :
                      segment.status === "amber" ? "border-t-amber-400" :
                      segment.status === "coral" ? "border-t-coral-400" :
                      "border-t-gray-300"
                    } hover:shadow-md transition-shadow duration-200`}
                  >
                    <CardHeader className="py-3 px-4 border-b">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-medium">
                          <div className="flex items-center">
                            {segment.title}
                            {segment.pinned && (
                              <div className="ml-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </CardTitle>
                        <Checkbox 
                          className="h-4 w-4"
                          checked={selectedSegments.includes(segment.id)}
                          onCheckedChange={() => handleSelectSegment(segment.id)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="py-3 px-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold">
                          {segment.count} Patients 
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {segment.value > 0 ? `$${segment.value}` : "—"}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        Next Action: {segment.nextAction}
                      </div>
                    </CardContent>
                    <CardFooter className="py-2 px-4 border-t bg-muted/30 flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleEditSegment(segment)}>
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Quick SMS
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-muted/10 rounded-lg p-10 text-center">
                <Layers className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">No segments found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? "No segments match your search criteria." 
                    : "No segments yet. Create one to unlock targeted actions."}
                </p>
                <Button onClick={toggleDrawer}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Segment
                </Button>
              </div>
            )}
          </div>
          
          {/* Segment Builder / Edit Drawer (3/12 columns) */}
          <div className="col-span-12 md:col-span-3">
            <Card className={`sticky top-4 transition-all duration-300 ${showDrawer ? "opacity-100" : "opacity-60 hover:opacity-90"}`}>
              <CardHeader className="py-3 px-4 border-b flex flex-row justify-between items-center">
                <CardTitle className="text-base font-medium">
                  {editingSegment ? "Edit Segment" : "Create Segment"}
                </CardTitle>
                {showDrawer && (
                  <Button variant="ghost" size="icon" onClick={toggleDrawer} className="h-7 w-7">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              
              {showDrawer ? (
                <CardContent className="py-4 px-4">
                  <div className="space-y-4">
                    {/* Segment Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Segment Name</label>
                      <Input 
                        placeholder="e.g., Recall Due This Week" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    
                    {/* Segment Description */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                      <Input 
                        placeholder="What defines this patient group?" 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    
                    {/* Filter Section */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Filter Rules</label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2"
                          onClick={() => setFilterExpanded(!filterExpanded)}
                        >
                          {filterExpanded ? "Collapse" : "Expand"}
                        </Button>
                      </div>
                      
                      {filterExpanded && (
                        <div className="space-y-3 bg-muted/20 p-3 rounded-md mb-3">
                          {/* Selected Filters */}
                          {formData.filters.length > 0 && (
                            <div className="space-y-2 mb-3">
                              {formData.filters.map((filter, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-md text-sm">
                                  <span>{filter}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => removeFilter(idx)}
                                    className="h-6 w-6"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Filter Builder */}
                          <div className="space-y-2">
                            <Select 
                              value={selectedCategory} 
                              onValueChange={setSelectedCategory}
                            >
                              <SelectTrigger className="w-full h-8 text-sm">
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                {filterCategories.map(category => (
                                  <SelectItem key={category.name} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Select 
                              value={selectedField} 
                              onValueChange={setSelectedField}
                            >
                              <SelectTrigger className="w-full h-8 text-sm">
                                <SelectValue placeholder="Field" />
                              </SelectTrigger>
                              <SelectContent>
                                {filterCategories
                                  .find(c => c.name === selectedCategory)?.fields
                                  .map(field => (
                                    <SelectItem key={field} value={field}>
                                      {field}
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                            
                            <Select 
                              value={operator} 
                              onValueChange={setOperator}
                            >
                              <SelectTrigger className="w-full h-8 text-sm">
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">equals</SelectItem>
                                <SelectItem value="not equals">not equals</SelectItem>
                                <SelectItem value="contains">contains</SelectItem>
                                <SelectItem value="is null">is null</SelectItem>
                                <SelectItem value="is not null">is not null</SelectItem>
                                <SelectItem value=">=">greater than or equal</SelectItem>
                                <SelectItem value="<=">less than or equal</SelectItem>
                                <SelectItem value="between">between</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            {operator !== "is null" && operator !== "is not null" && (
                              <Input
                                placeholder="Value"
                                className="h-8 text-sm"
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                              />
                            )}
                            
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="w-full"
                              onClick={addFilter}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Add Rule
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Default Action */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Default Action</label>
                      <Select 
                        value={formData.nextAction} 
                        onValueChange={(value) => setFormData({...formData, nextAction: value})}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          {segmentActions.map(action => (
                            <SelectItem key={action} value={action}>
                              {action}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Pin to Directory */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-sm">Pin to Directory</label>
                        <p className="text-xs text-muted-foreground">Show as filter chip in Patient Directory</p>
                      </div>
                      <Switch 
                        checked={formData.pinned}
                        onCheckedChange={(checked) => setFormData({...formData, pinned: checked})}
                      />
                    </div>
                    
                    {/* Preview Count */}
                    {formData.filters.length > 0 && (
                      <div className="bg-muted/30 p-3 rounded-md text-sm">
                        <div className="font-medium mb-1">List Preview</div>
                        <div className="text-muted-foreground">
                          Would target {previewCount} patients · approx ${previewValue}
                        </div>
                      </div>
                    )}
                    
                    {/* Save Button */}
                    <Button 
                      className="w-full" 
                      onClick={saveSegment}
                      disabled={!formData.title || formData.filters.length === 0}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingSegment ? "Update Segment" : "Save Segment"}
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="py-6 px-4 text-center">
                  <div className="text-muted-foreground mb-4">
                    Click to create a new segment or edit an existing one
                  </div>
                  <Button onClick={toggleDrawer} variant="outline" className="w-full">
                    <ListFilter className="h-4 w-4 mr-2" />
                    Build a Segment
                  </Button>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
        
        {/* Bulk Action Bar */}
        {showBulkActions && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 z-50">
            <div className="container flex justify-between items-center">
              <div className="flex items-center">
                <Checkbox
                  checked={selectedSegments.length > 0}
                  onCheckedChange={() => setSelectedSegments([])}
                  className="mr-3"
                />
                <span className="font-medium">{selectedSegments.length} segments selected</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkSMS}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Campaign
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archive Segments</AlertDialogTitle>
              <AlertDialogDescription>
                This will hide {selectedSegments.length} segments from your gallery.
                You can restore them anytime. Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={archiveSegments}>Archive</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </NavigationWrapper>
  );
}