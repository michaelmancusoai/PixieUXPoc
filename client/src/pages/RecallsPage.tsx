import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
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
  Mail,
  Clock,
  ChevronDown,
  ChevronRight,
  FileText,
  ArrowUpDown, 
  X, 
  Sliders, 
  Plus,
  ClipboardList,
  Info,
  Zap,
  User
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  // Additional patient info for expanded row
  birthdate?: string;
  insuranceCarrier?: string;
  planType?: string;
  lastAppointment?: {
    date: string;
    type: string;
    provider: string;
  };
  upcomingAppointment?: {
    date: string;
    type: string;
    provider: string;
  } | null;
  balanceInfo?: {
    totalBalance: number;
    insurance: number;
    patient: number;
  };
}

// Patient Row Component
const PatientRow = ({ 
  patient, 
  isExpanded, 
  onToggleExpand,
  formatDueDate
}: { 
  patient: RecallPatient; 
  isExpanded: boolean; 
  onToggleExpand: (id: number) => void;
  formatDueDate: (date: Date) => string;
}) => {
  return (
    <TableRow 
      className={patient.isOverdue ? 'bg-red-50' : isToday(patient.dueDate) ? 'bg-amber-50' : ''}
    >
      <TableCell className="font-medium">{patient.name}</TableCell>
      <TableCell>{patient.recallType}</TableCell>
      <TableCell>
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
      </TableCell>
      <TableCell>{patient.provider}</TableCell>
      <TableCell>
        <div className="flex flex-col text-sm">
          <div className="flex items-center text-xs">
            <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
            <span>{patient.phone}</span>
          </div>
          <div className="flex items-center text-xs mt-1">
            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="truncate max-w-[120px]">{patient.email}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        {patient.lastAttempt || 'Not contacted'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end space-x-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Phone className="h-3.5 w-3.5 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MessageCircle className="h-3.5 w-3.5 text-green-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Calendar className="h-3.5 w-3.5 text-purple-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => onToggleExpand(patient.id)}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

// Expanded Details Row Component
const ExpandedDetailsRow = ({ patient }: { patient: RecallPatient }) => {
  return (
    <TableRow className="bg-muted/30 border-t-0">
      <TableCell colSpan={7} className="p-0">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Patient Info */}
            <div className="bg-white rounded-md border p-3">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <User className="h-4 w-4 mr-1 text-blue-500" />
                Patient Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span>{patient.birthdate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance:</span>
                  <span>{patient.insuranceCarrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Type:</span>
                  <span>{patient.planType}</span>
                </div>
                {patient.balanceInfo && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance:</span>
                    <span className={patient.balanceInfo.totalBalance > 0 ? 'text-red-600 font-medium' : ''}>
                      ${patient.balanceInfo.totalBalance.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Appointment History */}
            <div className="bg-white rounded-md border p-3">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                Appointment History
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground block">Last Visit:</span>
                  <div className="flex justify-between mt-1">
                    <span className="font-medium">{patient.lastAppointment?.date}</span>
                    <span>{patient.lastAppointment?.type}</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-muted-foreground block">Upcoming:</span>
                  {patient.upcomingAppointment ? (
                    <div className="flex justify-between mt-1">
                      <span className="font-medium">{patient.upcomingAppointment.date}</span>
                      <span>{patient.upcomingAppointment.type}</span>
                    </div>
                  ) : (
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        No appointment scheduled
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Notes & Quick Actions */}
            <div className="bg-white rounded-md border p-3">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <ClipboardList className="h-4 w-4 mr-1 text-green-500" />
                Notes & Quick Actions
              </h4>
              <div className="text-sm mb-3">
                <p className="text-gray-600 text-xs italic">{patient.notes}</p>
              </div>
              <div className="flex space-x-2 mt-2">
                <Button size="sm" className="text-xs h-7 flex-1 gap-1">
                  <Calendar className="h-3 w-3" /> 
                  Schedule
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7 flex-1 gap-1">
                  <Mail className="h-3 w-3" />
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function RecallsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  
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

  // Toggle expanded row
  const toggleExpandRow = (id: number) => {
    setExpandedRowId(expandedRowId === id ? null : id);
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
      provider: 'Dr. Picard',
      birthdate: '05/15/1973',
      insuranceCarrier: 'Hogwarts Health Plan',
      planType: 'PPO',
      lastAppointment: {
        date: '10/25/2024',
        type: 'Comprehensive Exam',
        provider: 'Dr. Picard'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 325.50,
        insurance: 225.50,
        patient: 100.00
      },
      notes: 'Patient prefers morning appointments. Has expressed interest in teeth whitening.'
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
      provider: 'Dr. Janeway',
      birthdate: '03/10/1960',
      insuranceCarrier: 'Hogwarts Health Plan',
      planType: 'Faculty',
      lastAppointment: {
        date: '04/25/2024',
        type: 'Annual Exam',
        provider: 'Dr. Janeway'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 0,
        insurance: 0,
        patient: 0
      },
      notes: 'Schedule appointments around the full moon. Patient has history of periodontal disease.'
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
      provider: 'Dr. Sisko',
      birthdate: '11/03/1959',
      insuranceCarrier: 'Order of Phoenix Health',
      planType: 'DHMO',
      lastAppointment: {
        date: '01/25/2025',
        type: 'Periodontal Therapy',
        provider: 'Dr. Sisko'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 745.00,
        insurance: 645.00,
        patient: 100.00
      },
      notes: 'Patient is very anxious about dental visits. Consider sedation options.'
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
      provider: 'Dr. Janeway',
      birthdate: '09/21/1951',
      insuranceCarrier: 'Death Eater Dental Group',
      planType: 'Premium',
      lastAppointment: {
        date: '11/25/2024',
        type: 'Restorative',
        provider: 'Dr. Janeway'
      },
      upcomingAppointment: {
        date: '04/26/2025',
        type: 'Check-up',
        provider: 'Dr. Janeway'
      },
      balanceInfo: {
        totalBalance: 0,
        insurance: 0,
        patient: 0
      },
      notes: 'Difficult patient. Insists on special treatment and can be disruptive.'
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
      provider: 'Dr. Picard',
      birthdate: '12/06/1928',
      insuranceCarrier: 'Hogwarts Health Plan',
      planType: 'Staff',
      lastAppointment: {
        date: '05/25/2024',
        type: 'Annual Exam',
        provider: 'Dr. Picard'
      },
      upcomingAppointment: {
        date: '04/28/2025',
        type: 'Comprehensive Exam',
        provider: 'Dr. Picard'
      },
      balanceInfo: {
        totalBalance: 125.00,
        insurance: 25.00,
        patient: 100.00
      },
      notes: 'Patient requires special extra-large chair accommodation. Schedule him as last patient of the day.'
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
      provider: 'Dr. Archer',
      birthdate: '08/26/1945',
      insuranceCarrier: 'Ministry of Magic Benefit Plan',
      planType: 'Executive',
      lastAppointment: {
        date: '10/25/2024',
        type: 'Check-up',
        provider: 'Dr. Archer'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 0,
        insurance: 0,
        patient: 0
      },
      notes: 'Patient frequently complains and has filed multiple grievances. Handle with extreme care.'
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
      provider: 'Dr. Sisko',
      birthdate: '10/30/1949',
      insuranceCarrier: 'Weasley Family Plan',
      planType: 'Family',
      lastAppointment: {
        date: '01/25/2025',
        type: 'Periodontal Maintenance',
        provider: 'Dr. Sisko'
      },
      upcomingAppointment: {
        date: '05/02/2025',
        type: 'Periodontal Maintenance',
        provider: 'Dr. Sisko'
      },
      balanceInfo: {
        totalBalance: 350.00,
        insurance: 280.00,
        patient: 70.00
      },
      notes: 'Patient likes to schedule appointments for multiple family members on the same day.'
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
      provider: 'Dr. Picard',
      birthdate: '02/06/1950',
      insuranceCarrier: 'Ministry of Magic Benefit Plan',
      planType: 'Standard',
      lastAppointment: {
        date: '10/25/2024',
        type: 'Check-up',
        provider: 'Dr. Picard'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 125.00,
        insurance: 75.00,
        patient: 50.00
      },
      notes: 'Fascinated by dental instruments and equipment. Asks lots of questions about how they work.'
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
      provider: 'Dr. Janeway',
      birthdate: '04/20/1946',
      insuranceCarrier: 'Hogwarts Health Plan',
      planType: 'Staff',
      lastAppointment: {
        date: '06/25/2024',
        type: 'Restorative',
        provider: 'Dr. Janeway'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 0,
        insurance: 0,
        patient: 0
      },
      notes: 'Patient often brings his cat to appointments. Please note: cat is not allowed in treatment rooms.'
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
      provider: 'Dr. Archer',
      birthdate: '04/28/1920',
      insuranceCarrier: 'Hogwarts Health Plan',
      planType: 'Faculty',
      lastAppointment: {
        date: '11/25/2024',
        type: 'Check-up',
        provider: 'Dr. Archer'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 275.00,
        insurance: 195.00,
        patient: 80.00
      },
      notes: 'Patient has a sweet tooth that has led to multiple caries. Has been advised to reduce sugar intake.'
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
      provider: 'Dr. Picard',
      birthdate: '03/09/1957',
      insuranceCarrier: 'Hogwarts Health Plan',
      planType: 'Faculty',
      lastAppointment: {
        date: '12/25/2024',
        type: 'Hygiene',
        provider: 'Dr. Picard'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 0,
        insurance: 0,
        patient: 0
      },
      notes: 'Patient claims to predict treatment outcomes. Very anxious during appointments.'
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
      provider: 'Dr. Sisko',
      birthdate: '01/26/1964',
      insuranceCarrier: 'Celebrity Smile Plan',
      planType: 'Premium',
      lastAppointment: {
        date: '07/25/2024',
        type: 'Cosmetic Consultation',
        provider: 'Dr. Sisko'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 1250.00,
        insurance: 750.00,
        patient: 500.00
      },
      notes: 'Patient is very concerned about aesthetics. Interested in cosmetic procedures and whitening.'
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
      provider: 'Dr. Janeway',
      birthdate: '05/15/1939',
      insuranceCarrier: 'Hogwarts Health Plan',
      planType: 'Faculty',
      lastAppointment: {
        date: '03/25/2025',
        type: 'Periodontal Maintenance',
        provider: 'Dr. Janeway'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 125.00,
        insurance: 100.00,
        patient: 25.00
      },
      notes: 'Patient has excellent home care. Continues to improve periodontal condition.'
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
      provider: 'Dr. Archer',
      birthdate: '10/17/1935',
      insuranceCarrier: 'Hogwarts Health Plan',
      planType: 'Faculty',
      lastAppointment: {
        date: '02/25/2025',
        type: 'Restorative',
        provider: 'Dr. Archer'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 0,
        insurance: 0,
        patient: 0
      },
      notes: 'Patient requires booster seat accommodation. Very cooperative during treatment.'
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
      provider: 'Dr. Picard',
      birthdate: '06/05/1980',
      insuranceCarrier: 'Malfoy Elite Health',
      planType: 'Premium',
      lastAppointment: {
        date: '10/25/2024',
        type: 'Check-up',
        provider: 'Dr. Picard'
      },
      upcomingAppointment: null,
      balanceInfo: {
        totalBalance: 0,
        insurance: 0,
        patient: 0
      },
      notes: 'Patient can be difficult. Father often calls to check on treatment. Patient interested in cosmetic options.'
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
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Recall Management</h1>
          <p className="text-muted-foreground mt-1">Manage and track patient recalls</p>
        </div>
        
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className={overdueCount > 0 ? "border-red-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Bell className={`h-4 w-4 mr-2 ${overdueCount > 0 ? "text-red-500" : "text-gray-400"}`} />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overdueCount > 0 ? "text-red-600" : ""}`}>
              {overdueCount}
            </div>
            <p className="text-xs text-muted-foreground">patients need attention</p>
          </CardContent>
        </Card>
        
        <Card className={todayCount > 0 ? "border-amber-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Calendar className={`h-4 w-4 mr-2 ${todayCount > 0 ? "text-amber-500" : "text-gray-400"}`} />
              Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${todayCount > 0 ? "text-amber-600" : ""}`}>
              {todayCount}
            </div>
            <p className="text-xs text-muted-foreground">recalls due today</p>
          </CardContent>
        </Card>
        
        <Card className={upcomingCount > 0 ? "border-blue-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Calendar className={`h-4 w-4 mr-2 ${upcomingCount > 0 ? "text-blue-500" : "text-gray-400"}`} />
              Next 30 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${upcomingCount > 0 ? "text-blue-600" : ""}`}>
              {upcomingCount}
            </div>
            <p className="text-xs text-muted-foreground">upcoming recalls</p>
          </CardContent>
        </Card>
        
        <Card className={futureCount > 0 ? "border-purple-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Calendar className={`h-4 w-4 mr-2 ${futureCount > 0 ? "text-purple-500" : "text-gray-400"}`} />
              Future
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${futureCount > 0 ? "text-purple-600" : ""}`}>
              {futureCount}
            </div>
            <p className="text-xs text-muted-foreground">future recalls</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter and Search Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients, recall types, or providers..."
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
                <Button variant="outline" className="h-10 gap-1 w-[160px]">
                  <ArrowUpDown className="h-3.5 w-3.5" />
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
        </CardContent>
      </Card>
      
      {/* View Tabs */}
      <Tabs defaultValue="list" className="w-full">
        <div className="flex justify-end mb-4">
          <TabsList className="grid w-[240px] grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Recall List */}
        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Recall Type</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecalls.length > 0 ? (
                      <>
                        {filteredRecalls.map(patient => (
                          <PatientRow 
                            key={`patient-${patient.id}`}
                            patient={patient} 
                            isExpanded={expandedRowId === patient.id}
                            onToggleExpand={toggleExpandRow}
                            formatDueDate={formatDueDate}
                          />
                        ))}
                        
                        {expandedRowId !== null && filteredRecalls.some(p => p.id === expandedRowId) && (
                          <ExpandedDetailsRow patient={filteredRecalls.find(p => p.id === expandedRowId)!} />
                        )}
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-32">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <FileText className="h-8 w-8 mb-2" />
                            <p>No recalls match your filter criteria</p>
                            {searchTerm && (
                              <Button 
                                variant="link" 
                                className="mt-2"
                                onClick={() => {
                                  setSearchTerm("");
                                  setFilterValue("all");
                                }}
                              >
                                Clear filters
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
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Calendar className="h-10 w-10 mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Calendar View Coming Soon</h3>
                <p className="text-sm text-center max-w-md">
                  We're working on a visual calendar view to help you better manage your recall schedule. Stay tuned for updates!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}