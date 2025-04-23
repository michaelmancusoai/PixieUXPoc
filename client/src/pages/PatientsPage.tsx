import React, { useState, useEffect, useRef } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Columns,
  ChevronDown,
  UserPlus,
  X,
  AlertTriangle,
  Keyboard,
  Calendar,
  CreditCard,
  Send,
  Phone,
  MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Get initials from name
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

// Generate avatar color based on name
const getAvatarColor = (name) => {
  if (!name) return '#1976d2';
  const colors = ['#1976d2', '#388e3c', '#d32f2f', '#f57c00', '#7b1fa2'];
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

// Mock patient data
const generatePatients = () => {
  const basePatients = [
    {
      id: 1,
      firstName: "Mia",
      lastName: "Smith",
      dob: "1982-01-12",
      chartNumber: "A1001",
      lastVisit: "2024-12-26",
      nextVisit: "2025-05-26",
      balance: 0,
      plan: "Delta PPO",
      tags: []
    },
    {
      id: 2,
      firstName: "Emma",
      lastName: "Smith",
      dob: "1960-12-16",
      chartNumber: "A1002",
      lastVisit: "2024-06-18",
      nextVisit: "2024-09-18",
      balance: 74,
      plan: "Blue Cross",
      tags: []
    },
    {
      id: 3,
      firstName: "Michael",
      lastName: "Garcia",
      dob: "1967-09-07",
      chartNumber: "A1003",
      lastVisit: "2025-04-15",
      nextVisit: null,
      balance: 0, 
      plan: "Delta PPO",
      tags: ["VIP"]
    },
    {
      id: 4,
      firstName: "John",
      lastName: "Garcia",
      dob: "2005-12-01",
      chartNumber: "A1004",
      lastVisit: "2024-08-10",
      nextVisit: "2024-09-10",
      balance: 31,
      plan: "Aetna",
      tags: []
    },
    {
      id: 5,
      firstName: "John",
      lastName: "Miller",
      dob: "2013-01-18",
      chartNumber: "A1005",
      lastVisit: "2024-06-04",
      nextVisit: null,
      balance: 629,
      plan: "Blue Cross",
      tags: ["Allergy"]
    },
    {
      id: 6,
      firstName: "Michael",
      lastName: "Davis",
      dob: "1973-10-08",
      chartNumber: "A1006",
      lastVisit: "2024-11-26",
      nextVisit: "2025-01-26",
      balance: 919,
      plan: "Cigna",
      tags: ["Allergy"]
    },
    {
      id: 7,
      firstName: "William",
      lastName: "Johnson",
      dob: "1986-08-23",
      chartNumber: "A1007",
      lastVisit: "2025-02-13",
      nextVisit: "2025-05-13",
      balance: 0,
      plan: "Cigna",
      tags: []
    },
    {
      id: 8,
      firstName: "Robert",
      lastName: "Johnson",
      dob: "1998-01-27",
      chartNumber: "A1008",
      lastVisit: "2024-08-20",
      nextVisit: "2024-10-20",
      balance: 542,
      plan: "United",
      tags: []
    },
    {
      id: 9,
      firstName: "Ava",
      lastName: "Rodriguez",
      dob: "1997-10-16",
      chartNumber: "A1009",
      lastVisit: "2024-07-15",
      nextVisit: "2024-12-15",
      balance: 0,
      plan: "Blue Cross",
      tags: ["Allergy"]
    },
    {
      id: 10,
      firstName: "Olivia",
      lastName: "Rodriguez",
      dob: "2010-07-27",
      chartNumber: "A1010",
      lastVisit: "2024-10-06",
      nextVisit: "2025-01-06",
      balance: 865,
      plan: "Cigna",
      tags: ["FSA expiring"]
    }
  ];

  // Add calculated fields and return
  return basePatients.map(patient => {
    // Calculate age
    const today = new Date();
    const birthDate = new Date(patient.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Check for recall due status
    const isRecallDue = !patient.nextVisit && !patient.tags.includes("Recall due");
    const tags = isRecallDue ? [...patient.tags, "Recall due"] : patient.tags;

    return {
      ...patient,
      fullName: `${patient.firstName} ${patient.lastName}`,
      age,
      tags
    };
  });
};

// Predefined saved segments
const defaultSegments = [
  { id: 1, name: "Recall Due", filters: { recallDue: true } },
  { id: 2, name: "VIP Patients", filters: { tags: ["VIP"] } },
  { id: 3, name: "High Balance", filters: { balance: [200, 10000] } }
];

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [savedSegments, setSavedSegments] = useState(defaultSegments);
  const [activeSegment, setActiveSegment] = useState(null);
  
  // Filters
  const [balanceFilter, setBalanceFilter] = useState([0, 10000]);
  const [recallDueFilter, setRecallDueFilter] = useState(false);
  const [planFilter, setPlanFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);
  
  // Column visibility
  const [columnVisibility, setColumnVisibility] = useState({
    name: true,
    dob: true,
    lastVisit: true,
    nextVisit: true,
    balance: true,
    plan: true,
    tags: true
  });

  const columnButtonRef = useRef(null);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setPatients(generatePatients());
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F toggles filter drawer (without modifiers)
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement.tagName !== 'INPUT') {
        setFilterDrawerOpen(prev => !prev);
        e.preventDefault();
      }
      
      // Ctrl+K or Cmd+K focuses search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        document.getElementById('patient-search')?.focus();
        e.preventDefault();
      }
      
      // Escape closes any open modal/drawer
      if (e.key === 'Escape') {
        setFilterDrawerOpen(false);
        setColumnMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Apply segment
  const applySegment = (segment) => {
    if (!segment) {
      resetFilters();
      setActiveSegment(null);
      return;
    }
    
    const { filters } = segment;
    
    // Apply the filters from the segment
    if (filters.balance) setBalanceFilter(filters.balance);
    if (filters.recallDue !== undefined) setRecallDueFilter(filters.recallDue);
    if (filters.plans) setPlanFilter(filters.plans);
    if (filters.tags) setTagFilter(filters.tags);
    
    setActiveSegment(segment.id);
  };
  
  // Reset filters
  const resetFilters = () => {
    setBalanceFilter([0, 10000]);
    setRecallDueFilter(false);
    setPlanFilter([]);
    setTagFilter([]);
  };
  
  // Navigate to patient profile
  const navigateToPatient = (id) => {
    window.location.href = `/patients/profile/${id}`;
  };
  
  // Handle call patient action
  const handleCallPatient = (e, patient) => {
    e.stopPropagation(); // Prevent row click navigation
    alert(`Calling ${patient.fullName}...`);
  };
  
  // Handle message patient action
  const handleMessagePatient = (e, patient) => {
    e.stopPropagation(); // Prevent row click navigation
    alert(`Opening message draft for ${patient.fullName}...`);
  };
  
  // Filter patients based on all criteria
  const filteredPatients = patients.filter(patient => {
    // Search filter (case insensitive)
    const searchMatch = 
      searchTerm === '' || 
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.chartNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Balance filter
    const balanceMatch = 
      patient.balance >= balanceFilter[0] && patient.balance <= balanceFilter[1];
    
    // Recall due filter
    const recallMatch = 
      !recallDueFilter || 
      patient.tags.includes("Recall due");
    
    // Plan filter
    const planMatch = 
      planFilter.length === 0 || 
      planFilter.includes(patient.plan);
    
    // Tag filter
    const tagMatch = 
      tagFilter.length === 0 || 
      tagFilter.some(tag => patient.tags.includes(tag));
    
    return searchMatch && balanceMatch && recallMatch && planMatch && tagMatch;
  });

  // All plans and tags for filter
  const allPlans = ["Delta PPO", "Cigna", "Blue Cross", "Aetna", "United"];
  const allTags = ["VIP", "Allergy", "Recall due", "FSA expiring"];

  return (
    <NavigationWrapper>
      <div className="flex flex-col">
        {/* Header with title, segments and actions */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Patients</h1>
              
              {/* Saved Segments */}
              {savedSegments.length > 0 && (
                <div className="flex items-center ml-4 space-x-2">
                  {savedSegments.map(segment => (
                    <div 
                      key={segment.id}
                      onClick={() => applySegment(segment)}
                      className={`px-3 py-1 text-xs rounded-full cursor-pointer ${
                        activeSegment === segment.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {segment.name}
                    </div>
                  ))}
                  
                  {activeSegment && (
                    <button
                      onClick={() => applySegment(null)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      className={`p-2 h-8 w-8 ${filterDrawerOpen ? 'bg-blue-100 text-blue-600 border-blue-300' : ''}`}
                      onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className="text-xs">Filter (F)</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Button 
                        ref={columnButtonRef}
                        variant="outline"
                        size="sm"
                        className={`p-2 h-8 w-8 ${columnMenuOpen ? 'bg-blue-100 text-blue-600 border-blue-300' : ''}`}
                        onClick={() => setColumnMenuOpen(!columnMenuOpen)}
                      >
                        <Columns className="h-4 w-4" />
                      </Button>
                      
                      {/* Column Visibility Menu */}
                      {columnMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white border border-gray-200 z-20">
                          <div className="py-2 px-2">
                            <div className="text-sm font-medium text-gray-700 mb-2 px-2">
                              Toggle Columns
                            </div>
                            <Separator className="my-1" />
                            <div className="space-y-1 mt-2">
                              <label className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-gray-100">
                                <Checkbox 
                                  checked={columnVisibility.name} 
                                  onCheckedChange={(checked) => 
                                    setColumnVisibility(prev => ({...prev, name: !!checked}))
                                  }
                                  disabled
                                />
                                <span className="text-sm">Name</span>
                              </label>
                              <label className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-gray-100">
                                <Checkbox 
                                  checked={columnVisibility.dob} 
                                  onCheckedChange={(checked) => 
                                    setColumnVisibility(prev => ({...prev, dob: !!checked}))
                                  }
                                />
                                <span className="text-sm">DOB / Age</span>
                              </label>
                              <label className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-gray-100">
                                <Checkbox 
                                  checked={columnVisibility.lastVisit} 
                                  onCheckedChange={(checked) => 
                                    setColumnVisibility(prev => ({...prev, lastVisit: !!checked}))
                                  }
                                />
                                <span className="text-sm">Last Visit</span>
                              </label>
                              <label className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-gray-100">
                                <Checkbox 
                                  checked={columnVisibility.nextVisit} 
                                  onCheckedChange={(checked) => 
                                    setColumnVisibility(prev => ({...prev, nextVisit: !!checked}))
                                  }
                                />
                                <span className="text-sm">Next Visit</span>
                              </label>
                              <label className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-gray-100">
                                <Checkbox 
                                  checked={columnVisibility.balance} 
                                  onCheckedChange={(checked) => 
                                    setColumnVisibility(prev => ({...prev, balance: !!checked}))
                                  }
                                />
                                <span className="text-sm">Balance</span>
                              </label>
                              <label className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-gray-100">
                                <Checkbox 
                                  checked={columnVisibility.plan} 
                                  onCheckedChange={(checked) => 
                                    setColumnVisibility(prev => ({...prev, plan: !!checked}))
                                  }
                                />
                                <span className="text-sm">Insurance Plan</span>
                              </label>
                              <label className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-gray-100">
                                <Checkbox 
                                  checked={columnVisibility.tags} 
                                  onCheckedChange={(checked) => 
                                    setColumnVisibility(prev => ({...prev, tags: !!checked}))
                                  }
                                />
                                <span className="text-sm">Status Tags</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className="text-xs">Column visibility</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>



              <div className="h-6 mx-1 border-l border-gray-300"></div>

              <Button 
                className="flex items-center gap-1"
                size="sm"
              >
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                New Patient
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="patient-search"
                type="search"
                placeholder="Search by name, chart number..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main content with patient list and optional filter sidebar */}
        <div className="flex px-6 bg-white mt-0 border-b-0 border-t-0 pt-0">
          {/* Patient list table */}
          <div className={`${filterDrawerOpen ? 'flex-1' : 'w-full'}`}>
          
          {/* Filters drawer - positioned on the right side */}
          {filterDrawerOpen && (
            <div className="w-64 border-l border-gray-200 p-4 absolute right-6 top-[157px] bottom-0 bg-white z-10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Filters</h3>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-500" onClick={() => setFilterDrawerOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <Separator className="my-2" />
              
              {/* Balance Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Balance</h4>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1">
                    <Select 
                      value={balanceFilter[0].toString()} 
                      onValueChange={(value) => setBalanceFilter([parseInt(value), balanceFilter[1]])}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 50, 100, 200, 500].map(val => (
                          <SelectItem key={val} value={val.toString()}>${val}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-gray-400">to</div>
                  <div className="flex-1">
                    <Select 
                      value={balanceFilter[1].toString()} 
                      onValueChange={(value) => setBalanceFilter([balanceFilter[0], parseInt(value)])}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Max" />
                      </SelectTrigger>
                      <SelectContent>
                        {[100, 200, 500, 1000, 5000, 10000].map(val => (
                          <SelectItem key={val} value={val.toString()}>${val}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Recall Due Filter */}
              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox 
                    checked={recallDueFilter} 
                    onCheckedChange={setRecallDueFilter}
                  />
                  <span className="text-sm font-medium">Recall Due</span>
                </label>
              </div>
              
              {/* Insurance Plan Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Insurance Plan</h4>
                <div className="space-y-1">
                  {allPlans.map(plan => (
                    <label key={plan} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox 
                        checked={planFilter.includes(plan)} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPlanFilter(prev => [...prev, plan]);
                          } else {
                            setPlanFilter(prev => prev.filter(p => p !== plan));
                          }
                        }}
                      />
                      <span className="text-sm">{plan}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Tags Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Tags</h4>
                <div className="space-y-1">
                  {allTags.map(tag => (
                    <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox 
                        checked={tagFilter.includes(tag)} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTagFilter(prev => [...prev, tag]);
                          } else {
                            setTagFilter(prev => prev.filter(t => t !== tag));
                          }
                        }}
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading patients...</p>
                </div>
              </div>
            ) : (
              <div className="border rounded-md bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Name</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                      {columnVisibility.dob && <TableHead className="w-[95px]">DOB / Age</TableHead>}
                      {columnVisibility.lastVisit && <TableHead className="w-[90px]">Last Visit</TableHead>}
                      {columnVisibility.nextVisit && <TableHead className="w-[90px]">Next Visit</TableHead>}
                      {columnVisibility.balance && <TableHead className="w-[85px]">Balance</TableHead>}
                      {columnVisibility.plan && <TableHead className="w-[160px]">Plan</TableHead>}
                      {columnVisibility.tags && <TableHead className="w-[200px]">Status Tags</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <TableRow 
                          key={patient.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => navigateToPatient(patient.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback style={{ backgroundColor: getAvatarColor(patient.fullName) }}>
                                  {getInitials(patient.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium">{patient.fullName}</div>
                                <div className="text-xs text-gray-500">MRN: {patient.chartNumber}</div>
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center justify-center space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7" 
                                onClick={(e) => handleCallPatient(e, patient)}
                              >
                                <Phone className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7" 
                                onClick={(e) => handleMessagePatient(e, patient)}
                              >
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                              </Button>
                            </div>
                          </TableCell>
                          
                          {columnVisibility.dob && (
                            <TableCell>
                              <div>{formatDate(patient.dob)}</div>
                              <div className="text-xs text-gray-500">{patient.age} years</div>
                            </TableCell>
                          )}
                          
                          {columnVisibility.lastVisit && (
                            <TableCell>{formatDate(patient.lastVisit)}</TableCell>
                          )}
                          
                          {columnVisibility.nextVisit && (
                            <TableCell>
                              {patient.nextVisit ? (
                                formatDate(patient.nextVisit)
                              ) : (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                  Schedule Now
                                </Badge>
                              )}
                            </TableCell>
                          )}
                          
                          {columnVisibility.balance && (
                            <TableCell>
                              {patient.balance > 0 ? (
                                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                                  ${patient.balance.toFixed(2)}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  ${patient.balance.toFixed(2)}
                                </Badge>
                              )}
                            </TableCell>
                          )}
                          
                          {columnVisibility.plan && (
                            <TableCell>{patient.plan}</TableCell>
                          )}
                          
                          {columnVisibility.tags && (
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {patient.tags.map(tag => {
                                  let badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
                                  
                                  if (tag === "Allergy") {
                                    badgeStyle = "bg-red-50 text-red-700 border-red-200";
                                  } else if (tag === "Recall due") {
                                    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
                                  } else if (tag === "FSA expiring") {
                                    badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
                                  }
                                  
                                  return (
                                    <Badge key={tag} variant="outline" className={badgeStyle}>
                                      {tag}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No patients found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}