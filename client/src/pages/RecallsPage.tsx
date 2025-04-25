import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Search, 
  Calendar, 
  Phone, 
  MessageCircle, 
  Filter, 
  ArrowDownUp, 
  X, 
  Sliders, 
  Plus
} from 'lucide-react';
import { format, addDays, isAfter, isBefore, isToday, addMonths } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Interface for recall patient
interface RecallPatient {
  id: number;
  name: string;
  recallType: string;
  dueDate: Date;
  lastVisit: string;
  phone?: string;
  email?: string;
  isOverdue?: boolean;
  lastAttempt?: string | null;
  notes?: string;
  provider: string;
}

export default function RecallsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  
  // Formatting helpers
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
    
    return format(date, 'MMM d, yyyy');
  };
  
  // Harry Potter character recall list
  const today = new Date();
  const recallPatients: RecallPatient[] = [
    { 
      id: 101, 
      name: 'Nymphadora Tonks', 
      recallType: '6-month hygiene', 
      dueDate: addDays(today, -14), 
      lastVisit: '6 months ago',
      phone: '555-123-4567',
      email: 'tonks@ministry.wiz',
      isOverdue: true,
      lastAttempt: '3 days ago',
      provider: 'Dr. Picard'
    },
    { 
      id: 102, 
      name: 'Remus Lupin', 
      recallType: 'Annual exam',
      dueDate: addDays(today, -7), 
      lastVisit: '1 year ago',
      phone: '555-234-5678',
      email: 'lupin@hogwarts.edu',
      isOverdue: true,
      lastAttempt: '1 week ago',
      provider: 'Dr. Janeway'
    },
    { 
      id: 103, 
      name: 'Sirius Black', 
      recallType: '3-month perio', 
      dueDate: today, 
      lastVisit: '3 months ago',
      phone: '555-345-6789',
      email: 'padfoot@black.wiz',
      isOverdue: false,
      lastAttempt: null,
      provider: 'Dr. Sisko'
    },
    { 
      id: 104, 
      name: 'Bellatrix Lestrange', 
      recallType: '6-month check-up', 
      dueDate: addDays(today, 1), 
      lastVisit: '5 months ago',
      phone: '555-456-7890',
      email: 'bella@darkarts.wiz',
      isOverdue: false,
      provider: 'Dr. Janeway'
    },
    { 
      id: 105, 
      name: 'Rubeus Hagrid', 
      recallType: 'Annual comprehensive', 
      dueDate: addDays(today, 3), 
      lastVisit: '11 months ago',
      phone: '555-567-8901',
      email: 'hagrid@hogwarts.edu',
      isOverdue: false,
      provider: 'Dr. Picard'
    },
    { 
      id: 106, 
      name: 'Dolores Umbridge', 
      recallType: '6-month check-up', 
      dueDate: addDays(today, 5), 
      lastVisit: '6 months ago',
      phone: '555-678-9012',
      email: 'dolores@ministry.wiz',
      isOverdue: false,
      provider: 'Dr. Archer'
    },
    { 
      id: 107, 
      name: 'Molly Weasley', 
      recallType: '3-month perio', 
      dueDate: addDays(today, 7), 
      lastVisit: '3 months ago',
      phone: '555-789-0123',
      email: 'molly@burrow.wiz',
      isOverdue: false,
      provider: 'Dr. Sisko'
    },
    { 
      id: 108, 
      name: 'Arthur Weasley', 
      recallType: '6-month check-up', 
      dueDate: addDays(today, 14), 
      lastVisit: '6 months ago',
      phone: '555-890-1234',
      email: 'arthur@ministry.wiz',
      isOverdue: false,
      provider: 'Dr. Picard'
    },
    { 
      id: 109, 
      name: 'Argus Filch', 
      recallType: 'Annual comprehensive', 
      dueDate: addDays(today, 21), 
      lastVisit: '10 months ago',
      phone: '555-901-2345',
      email: 'filch@hogwarts.edu',
      isOverdue: false,
      provider: 'Dr. Janeway'
    },
    { 
      id: 110, 
      name: 'Horace Slughorn', 
      recallType: '6-month check-up', 
      dueDate: addDays(today, 30), 
      lastVisit: '5 months ago',
      phone: '555-012-3456',
      email: 'slughorn@hogwarts.edu',
      isOverdue: false,
      provider: 'Dr. Archer'
    },
    { 
      id: 111, 
      name: 'Sybill Trelawney', 
      recallType: '6-month hygiene', 
      dueDate: addMonths(today, 2), 
      lastVisit: '4 months ago',
      phone: '555-123-4567',
      email: 'trelawney@divination.wiz',
      isOverdue: false,
      provider: 'Dr. Picard'
    },
    { 
      id: 112, 
      name: 'Gilderoy Lockhart', 
      recallType: 'Annual comprehensive', 
      dueDate: addMonths(today, 3), 
      lastVisit: '9 months ago',
      phone: '555-234-5678',
      email: 'lockhart@bestseller.wiz',
      isOverdue: false,
      provider: 'Dr. Sisko'
    },
    { 
      id: 113, 
      name: 'Pomona Sprout', 
      recallType: '3-month perio', 
      dueDate: addMonths(today, 2), 
      lastVisit: '1 month ago',
      phone: '555-345-6789',
      email: 'sprout@herbology.wiz',
      isOverdue: false,
      provider: 'Dr. Janeway'
    },
    { 
      id: 114, 
      name: 'Filius Flitwick', 
      recallType: '6-month check-up', 
      dueDate: addMonths(today, 4), 
      lastVisit: '2 months ago',
      phone: '555-456-7890',
      email: 'flitwick@charms.wiz',
      isOverdue: false,
      provider: 'Dr. Archer'
    },
    { 
      id: 115, 
      name: 'Draco Malfoy', 
      recallType: 'Annual comprehensive', 
      dueDate: addMonths(today, 6), 
      lastVisit: '6 months ago',
      phone: '555-567-8901',
      email: 'draco@slytherin.wiz',
      isOverdue: false,
      provider: 'Dr. Picard'
    },
  ];
  
  // Apply filters
  let filteredRecalls = [...recallPatients];
  
  // Search filter
  if (searchTerm) {
    filteredRecalls = filteredRecalls.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      patient.recallType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Status filter
  if (filterValue === 'overdue') {
    filteredRecalls = filteredRecalls.filter(patient => patient.isOverdue);
  } else if (filterValue === 'today') {
    filteredRecalls = filteredRecalls.filter(patient => isToday(patient.dueDate));
  } else if (filterValue === 'upcoming') {
    filteredRecalls = filteredRecalls.filter(patient => 
      isAfter(patient.dueDate, today) && 
      isBefore(patient.dueDate, addDays(today, 30))
    );
  } else if (filterValue === 'future') {
    filteredRecalls = filteredRecalls.filter(patient => 
      isAfter(patient.dueDate, addDays(today, 30))
    );
  }
  
  // Sort
  filteredRecalls.sort((a, b) => {
    if (sortBy === 'dueDate') {
      return a.dueDate.getTime() - b.dueDate.getTime();
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'type') {
      return a.recallType.localeCompare(b.recallType);
    }
    return 0;
  });
  
  // Calculate summary counts
  const overdueCount = recallPatients.filter(p => p.isOverdue).length;
  const todayCount = recallPatients.filter(p => isToday(p.dueDate)).length;
  const upcomingCount = recallPatients.filter(p => 
    isAfter(p.dueDate, today) && 
    isBefore(p.dueDate, addDays(today, 30))
  ).length;
  const futureCount = recallPatients.filter(p => 
    isAfter(p.dueDate, addDays(today, 30))
  ).length;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Recall Management</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 gap-1">
            <Sliders className="h-4 w-4" />
            <span>Manage</span>
          </Button>
          <Button className="h-9 gap-1">
            <Plus className="h-4 w-4" />
            <span>New Recall</span>
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className={overdueCount > 0 ? "bg-red-50 border-red-200" : ""}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Overdue</div>
              <div className={`text-2xl font-bold ${overdueCount > 0 ? "text-red-600" : ""}`}>
                {overdueCount}
              </div>
            </div>
            <div className={`p-2 rounded-full ${overdueCount > 0 ? "bg-red-100" : "bg-gray-100"}`}>
              <Bell className={`h-5 w-5 ${overdueCount > 0 ? "text-red-500" : "text-gray-500"}`} />
            </div>
          </CardContent>
        </Card>
        
        <Card className={todayCount > 0 ? "bg-amber-50 border-amber-200" : ""}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Due Today</div>
              <div className={`text-2xl font-bold ${todayCount > 0 ? "text-amber-600" : ""}`}>
                {todayCount}
              </div>
            </div>
            <div className={`p-2 rounded-full ${todayCount > 0 ? "bg-amber-100" : "bg-gray-100"}`}>
              <Calendar className={`h-5 w-5 ${todayCount > 0 ? "text-amber-500" : "text-gray-500"}`} />
            </div>
          </CardContent>
        </Card>
        
        <Card className={upcomingCount > 0 ? "bg-blue-50 border-blue-200" : ""}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Next 30 Days</div>
              <div className={`text-2xl font-bold ${upcomingCount > 0 ? "text-blue-600" : ""}`}>
                {upcomingCount}
              </div>
            </div>
            <div className={`p-2 rounded-full ${upcomingCount > 0 ? "bg-blue-100" : "bg-gray-100"}`}>
              <Calendar className={`h-5 w-5 ${upcomingCount > 0 ? "text-blue-500" : "text-gray-500"}`} />
            </div>
          </CardContent>
        </Card>
        
        <Card className={futureCount > 0 ? "bg-purple-50 border-purple-200" : ""}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Future</div>
              <div className={`text-2xl font-bold ${futureCount > 0 ? "text-purple-600" : ""}`}>
                {futureCount}
              </div>
            </div>
            <div className={`p-2 rounded-full ${futureCount > 0 ? "bg-purple-100" : "bg-gray-100"}`}>
              <Calendar className={`h-5 w-5 ${futureCount > 0 ? "text-purple-500" : "text-gray-500"}`} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter and Search Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recalls..."
              className="pl-10 h-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger className="w-[180px] h-10">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Recalls</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="today">Due Today</SelectItem>
              <SelectItem value="upcoming">Next 30 Days</SelectItem>
              <SelectItem value="future">Future</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-1 w-[160px]">
                <ArrowDownUp className="h-3.5 w-3.5" />
                <span>{sortBy === 'dueDate' ? 'Due Date' : sortBy === 'name' ? 'Patient Name' : 'Recall Type'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('dueDate')}>
                Due Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Patient Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('type')}>
                Recall Type
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs defaultValue="list" className="w-[240px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Recall List */}
      <TabsContent value="list" className="mt-0">
        <Card>
          <CardContent className="p-0">
            <div className="border-b bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 grid grid-cols-12 gap-2">
              <div className="col-span-3">Patient</div>
              <div className="col-span-2">Recall Type</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-2">Provider</div>
              <div className="col-span-2">Last Contact</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            
            <div className="divide-y max-h-[calc(100vh-340px)] overflow-y-auto">
              {filteredRecalls.length > 0 ? (
                filteredRecalls.map(patient => (
                  <div 
                    key={patient.id} 
                    className={`grid grid-cols-12 gap-2 px-4 py-3 text-sm ${
                      patient.isOverdue ? 'bg-red-50' : isToday(patient.dueDate) ? 'bg-amber-50' : ''
                    }`}
                  >
                    <div className="col-span-3 flex items-center">
                      <div className="font-medium">{patient.name}</div>
                    </div>
                    <div className="col-span-2 text-gray-600">
                      {patient.recallType}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${patient.isOverdue 
                              ? 'bg-red-100 text-red-600 border-red-200' 
                              : isToday(patient.dueDate) 
                                ? 'bg-amber-100 text-amber-600 border-amber-200' 
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }
                          `}
                        >
                          {formatDueDate(patient.dueDate)}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-span-2 text-gray-600">
                      {patient.provider}
                    </div>
                    <div className="col-span-2 text-gray-600">
                      {patient.lastAttempt || 'Not contacted'}
                    </div>
                    <div className="col-span-1 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Phone className="h-3.5 w-3.5 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Calendar className="h-3.5 w-3.5 text-purple-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  {searchTerm ? (
                    <p>No recalls found matching your search criteria</p>
                  ) : (
                    <p>No recalls found in this category</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="calendar" className="mt-0">
        <Card className="p-6">
          <div className="text-center p-12 text-gray-500">
            Calendar view is not implemented yet
          </div>
        </Card>
      </TabsContent>
    </div>
  );
}