import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Bell,
  CalendarClock,
  CheckCircle,
  Clipboard,
  Clock,
  ClipboardCheck,
  CreditCard,
  FileClock,
  Package,
  Paperclip,
  Search,
  Star,
  ThumbsUp,
  Timer,
  User,
  Users,
  X,
  Zap,
  Calendar,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Phone,
  MessageSquare,
  Mail,
  BellRing,
  FileWarning,
  FileCheck2,
  AlertTriangle,
  Brush,
  FilePlus2,
  Sun,
  Stethoscope,
  ReceiptText,
  Plus
} from "lucide-react";

// Activity card for the dashboard
interface ActivityProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  time: string;
  category: 'appointment' | 'patient' | 'communication' | 'clinical' | 'billing';
  status?: string;
}

const ActivityCard: React.FC<ActivityProps> = ({ icon, title, description, time, category, status }) => {
  // Different styling based on category
  const getCategoryStyle = () => {
    switch(category) {
      case 'appointment':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'patient':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'communication':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'clinical':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'billing':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };
  
  return (
    <Card className={`mb-3 overflow-hidden border ${getCategoryStyle()}`}>
      <CardContent className="p-3">
        <div className="flex">
          <div className="mr-3 mt-0.5">
            {icon}
          </div>
          <div className="flex-1">
            <div className="font-medium">{title}</div>
            {description && <div className="text-sm opacity-90 mt-0.5">{description}</div>}
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs opacity-70">{time}</div>
              {status && (
                <Badge variant="outline" className="text-xs">
                  {status}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Provider schedule card
interface ProviderScheduleProps {
  provider: {
    id: number;
    name: string;
    avatar?: string;
    role: string;
    initials: string;
    color: string;
    schedule: {
      totalAppointments: number;
      completedAppointments: number;
      productionTarget: number;
      currentProduction: number;
      nextAppointment?: {
        time: string;
        patient: string;
        procedure: string;
      };
    };
  };
}

const ProviderScheduleCard: React.FC<ProviderScheduleProps> = ({ provider }) => {
  const completionPercentage = Math.round((provider.schedule.completedAppointments / provider.schedule.totalAppointments) * 100);
  const productionPercentage = Math.round((provider.schedule.currentProduction / provider.schedule.productionTarget) * 100);
  
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Avatar className="h-10 w-10 mr-3">
            {provider.avatar ? (
              <AvatarImage src={provider.avatar} alt={provider.name} />
            ) : (
              <AvatarFallback style={{ backgroundColor: provider.color }}>{provider.initials}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="font-medium">{provider.name}</div>
            <div className="text-sm text-muted-foreground">{provider.role}</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Appointments</span>
              <span className="font-medium">{provider.schedule.completedAppointments}/{provider.schedule.totalAppointments}</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Production</span>
              <span className="font-medium">${provider.schedule.currentProduction.toLocaleString()} <span className="text-muted-foreground">/ ${provider.schedule.productionTarget.toLocaleString()}</span></span>
            </div>
            <Progress value={productionPercentage} className="h-2" />
          </div>
          
          {provider.schedule.nextAppointment && (
            <div className="pt-2">
              <div className="text-sm font-medium">Next Patient</div>
              <div className="p-2 bg-muted/30 rounded-md mt-1">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{provider.schedule.nextAppointment.patient}</div>
                  <div className="text-sm">{provider.schedule.nextAppointment.time}</div>
                </div>
                <div className="text-xs text-muted-foreground">{provider.schedule.nextAppointment.procedure}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Check-in status card
interface PatientStatusProps {
  patient: {
    id: number;
    name: string;
    status: 'checked-in' | 'seated' | 'with-doctor' | 'completed' | 'pending';
    appointmentTime: string;
    provider: string;
    procedure: string;
    waitTime?: number;
  };
}

const PatientStatusCard: React.FC<PatientStatusProps> = ({ patient }) => {
  // Get status details
  const getStatusInfo = () => {
    switch(patient.status) {
      case 'checked-in':
        return {
          icon: <ClipboardCheck className="h-4 w-4 text-blue-500" />,
          label: 'Checked In',
          details: patient.waitTime ? `Waiting for ${patient.waitTime} min` : 'In waiting room'
        };
      case 'seated':
        return {
          icon: <Stethoscope className="h-4 w-4 text-purple-500" />,
          label: 'Seated',
          details: 'Waiting for provider'
        };
      case 'with-doctor':
        return {
          icon: <Stethoscope className="h-4 w-4 text-emerald-500" />,
          label: 'With Provider',
          details: `With ${patient.provider}`
        };
      case 'completed':
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
          label: 'Completed',
          details: 'Ready for checkout'
        };
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4 text-amber-500" />,
          label: 'Not Arrived',
          details: `Due at ${patient.appointmentTime}`
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4 text-gray-500" />,
          label: 'Unknown',
          details: ''
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{patient.name}</div>
            <div className="text-xs text-muted-foreground">{patient.procedure}</div>
            <div className="flex items-center mt-1.5 text-xs">
              {statusInfo.icon}
              <span className="ml-1 font-medium">{statusInfo.label}</span>
              <span className="mx-1.5 text-gray-300">•</span>
              <span className="text-muted-foreground">{statusInfo.details}</span>
            </div>
          </div>
          <div className="text-sm">{patient.appointmentTime}</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Todo item component
interface TodoItemProps {
  title: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  onToggle: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ title, dueDate, priority, completed, onToggle }) => {
  const getPriorityColor = () => {
    switch(priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };
  
  return (
    <div className={`flex items-start p-2 rounded-md mb-1 ${completed ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}`}>
      <button
        className={`flex-shrink-0 h-5 w-5 rounded-full border mr-2 ${
          completed ? 'bg-blue-500 border-blue-500 text-white flex items-center justify-center' : 'border-gray-300'
        } transition-colors`}
        onClick={onToggle}
      >
        {completed && <CheckCircle className="h-4 w-4" />}
      </button>
      <div className={`flex-1 ${completed ? 'line-through text-gray-500' : ''}`}>
        <div className="font-medium">{title}</div>
        {dueDate && (
          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
            <Clock className="h-3 w-3 mr-1" />
            {dueDate}
            <div className={`ml-2 w-2 h-2 rounded-full ${getPriorityColor()}`}></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Quick action button
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, onClick, color }) => {
  return (
    <Button 
      variant="outline" 
      className="flex flex-col h-auto py-3 px-2 items-center justify-center border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      onClick={onClick}
    >
      <div className={`mb-1 ${color}`}>{icon}</div>
      <span className="text-xs font-normal">{label}</span>
    </Button>
  );
};

export default function TodayPage() {
  // State for todos
  const [todos, setTodos] = useState([
    { id: 1, title: 'Review treatment plans', dueDate: 'Today, 2:00 PM', priority: 'high' as const, completed: false },
    { id: 2, title: 'Call lab about crown', dueDate: 'Today, 4:00 PM', priority: 'medium' as const, completed: false },
    { id: 3, title: 'Follow up with referrals', dueDate: 'Today, 5:00 PM', priority: 'low' as const, completed: false },
    { id: 4, title: 'Order new supplies', dueDate: 'Tomorrow', priority: 'medium' as const, completed: true },
  ]);
  
  // Mock activity data
  const activities = [
    { id: 1, icon: <User className="h-4 w-4" />, title: 'John Smith checked in', time: '9:15 AM', category: 'patient' as const },
    { id: 2, icon: <FileCheck2 className="h-4 w-4" />, title: 'Completed Exam & Clean', description: 'Dr. Wilson - Emily Johnson', time: '9:45 AM', category: 'clinical' as const, status: 'Completed' },
    { id: 3, icon: <ReceiptText className="h-4 w-4" />, title: 'Payment received', description: '$125.00 - Credit Card', time: '10:00 AM', category: 'billing' as const },
    { id: 4, icon: <Stethoscope className="h-4 w-4" />, title: 'Emily Johnson seated', description: 'Operatory 3', time: '10:15 AM', category: 'appointment' as const },
    { id: 5, icon: <Phone className="h-4 w-4" />, title: 'Call with Richard Davis', description: 'Scheduled appointment for next week', time: '10:30 AM', category: 'communication' as const },
    { id: 6, icon: <FilePlus2 className="h-4 w-4" />, title: 'New treatment plan created', description: 'Sarah Wilson - Implant and Crown', time: '11:00 AM', category: 'clinical' as const },
    { id: 7, icon: <Bell className="h-4 w-4" />, title: 'Appointment confirmation sent', description: 'Tomorrow - Michael Brown', time: '11:30 AM', category: 'appointment' as const }
  ];
  
  // Mock provider data
  const providers = [
    {
      id: 1,
      name: 'Dr. Wilson',
      role: 'Dentist',
      initials: 'JW',
      color: '#8b5cf6', // violet-500
      schedule: {
        totalAppointments: 8,
        completedAppointments: 3,
        productionTarget: 5000,
        currentProduction: 1850,
        nextAppointment: {
          time: '12:30 PM',
          patient: 'Davis, Sarah',
          procedure: 'Crown Prep'
        }
      }
    },
    {
      id: 2,
      name: 'Dr. Miller',
      role: 'Dentist',
      initials: 'RM',
      color: '#10b981', // emerald-500
      schedule: {
        totalAppointments: 6,
        completedAppointments: 2,
        productionTarget: 4500,
        currentProduction: 1200,
        nextAppointment: {
          time: '1:45 PM',
          patient: 'Thompson, Robert',
          procedure: 'Root Canal'
        }
      }
    },
    {
      id: 3,
      name: 'Maria Garcia',
      role: 'Hygienist',
      initials: 'MG',
      color: '#3b82f6', // blue-500
      schedule: {
        totalAppointments: 10,
        completedAppointments: 4,
        productionTarget: 2000,
        currentProduction: 960,
        nextAppointment: {
          time: '12:00 PM',
          patient: 'White, Jennifer',
          procedure: 'Cleaning'
        }
      }
    }
  ];
  
  // Mock patient status data
  const patientStatuses = [
    { id: 1, name: 'Johnson, Emily', status: 'with-doctor' as const, appointmentTime: '9:30 AM', provider: 'Dr. Wilson', procedure: 'Filling', waitTime: 0 },
    { id: 2, name: 'Smith, John', status: 'seated' as const, appointmentTime: '10:00 AM', provider: 'Dr. Miller', procedure: 'Crown Prep', waitTime: 5 },
    { id: 3, name: 'Williams, David', status: 'checked-in' as const, appointmentTime: '10:30 AM', provider: 'Maria Garcia', procedure: 'Cleaning', waitTime: 10 },
    { id: 4, name: 'Davis, Sarah', status: 'pending' as const, appointmentTime: '12:30 PM', provider: 'Dr. Wilson', procedure: 'Crown Prep' },
    { id: 5, name: 'Thompson, Robert', status: 'pending' as const, appointmentTime: '1:45 PM', provider: 'Dr. Miller', procedure: 'Root Canal' },
    { id: 6, name: 'White, Jennifer', status: 'pending' as const, appointmentTime: '12:00 PM', provider: 'Maria Garcia', procedure: 'Cleaning' }
  ];
  
  // Toggle todo completion
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  // Dashboard stats
  const dashboardStats = {
    appointmentsToday: 12,
    appointmentsCompleted: 4,
    openChairs: 2,
    productionToday: 3450,
    productionTarget: 8500,
    collectionsToday: 2850,
    patientCheckIns: 7,
    missedAppointments: 0
  };
  
  return (
    <NavigationWrapper>
      <div className="container mx-auto p-4 pb-8">
        {/* Header with date and stats */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Sun className="h-6 w-6 text-amber-500 mr-2" />
            <h1 className="text-2xl font-bold">Today's Overview</h1>
            <span className="ml-4 text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-muted-foreground text-sm mb-1">Appointments</div>
                  <div className="flex items-center justify-center">
                    <span className="text-2xl font-bold">{dashboardStats.appointmentsCompleted}</span>
                    <span className="text-muted-foreground mx-1">/</span>
                    <span className="text-lg">{dashboardStats.appointmentsToday}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-muted-foreground text-sm mb-1">Production</div>
                  <div className="text-2xl font-bold">${dashboardStats.productionToday.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Target: ${dashboardStats.productionTarget.toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-muted-foreground text-sm mb-1">Collections</div>
                  <div className="text-2xl font-bold">${dashboardStats.collectionsToday.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((dashboardStats.collectionsToday / dashboardStats.productionToday) * 100)}% of production
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-muted-foreground text-sm mb-1">Check-Ins</div>
                  <div className="text-2xl font-bold">{dashboardStats.patientCheckIns}</div>
                  <div className="text-xs text-emerald-500">
                    {dashboardStats.missedAppointments === 0 ? "No missed appointments" : `${dashboardStats.missedAppointments} missed`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Main dashboard grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="col-span-3">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                <QuickAction 
                  icon={<User className="h-4 w-4" />} 
                  label="Patient Check-in" 
                  onClick={() => {}}
                  color="text-blue-500"
                />
                <QuickAction 
                  icon={<Phone className="h-4 w-4" />} 
                  label="Make Call" 
                  onClick={() => {}}
                  color="text-purple-500"
                />
                <QuickAction 
                  icon={<CalendarClock className="h-4 w-4" />} 
                  label="Schedule" 
                  onClick={() => {}}
                  color="text-amber-500"
                />
                <QuickAction 
                  icon={<MessageSquare className="h-4 w-4" />} 
                  label="Message" 
                  onClick={() => {}}
                  color="text-emerald-500"
                />
                <QuickAction 
                  icon={<Mail className="h-4 w-4" />} 
                  label="Email" 
                  onClick={() => {}}
                  color="text-red-500"
                />
                <QuickAction 
                  icon={<Plus className="h-4 w-4" />} 
                  label="New Patient" 
                  onClick={() => {}}
                  color="text-gray-500"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">My Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  {todos.filter(todo => !todo.completed).map(todo => (
                    <TodoItem 
                      key={todo.id}
                      title={todo.title}
                      dueDate={todo.dueDate}
                      priority={todo.priority}
                      completed={todo.completed}
                      onToggle={() => toggleTodo(todo.id)}
                    />
                  ))}
                </div>
                
                {todos.some(todo => todo.completed) && (
                  <React.Fragment>
                    <Separator className="my-3" />
                    <div className="text-xs font-medium text-muted-foreground mb-2">Completed</div>
                    {todos.filter(todo => todo.completed).map(todo => (
                      <TodoItem 
                        key={todo.id}
                        title={todo.title}
                        dueDate={todo.dueDate}
                        priority={todo.priority}
                        completed={todo.completed}
                        onToggle={() => toggleTodo(todo.id)}
                      />
                    ))}
                  </React.Fragment>
                )}
                
                <Button variant="ghost" size="sm" className="w-full mt-3 text-muted-foreground">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add New Task
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="col-span-6">
            <Tabs defaultValue="activity" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Patients</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Today's Activity</CardTitle>
                    <CardDescription>Real-time practice activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[450px] pr-4">
                      {activities.map(activity => (
                        <ActivityCard 
                          key={activity.id}
                          icon={activity.icon}
                          title={activity.title}
                          description={activity.description}
                          time={activity.time}
                          category={activity.category}
                          status={activity.status}
                        />
                      ))}
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Button variant="outline" size="sm" className="ml-auto">
                      View All Activity
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Upcoming Patients</CardTitle>
                    <CardDescription>Patient arrival status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[450px] pr-4">
                      {patientStatuses.map(patient => (
                        <PatientStatusCard key={patient.id} patient={patient} />
                      ))}
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Button variant="outline" size="sm" className="ml-auto">
                      View Full Schedule
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Operatory Status</CardTitle>
                <CardDescription>Current chair utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 text-blue-700 border border-blue-100 rounded-md p-3 text-center">
                    <div className="font-medium">Room 1</div>
                    <div className="text-sm opacity-70">In Use (Dr. Wilson)</div>
                    <Badge className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-200">Johnson, E</Badge>
                  </div>
                  
                  <div className="bg-purple-50 text-purple-700 border border-purple-100 rounded-md p-3 text-center">
                    <div className="font-medium">Room 2</div>
                    <div className="text-sm opacity-70">In Use (Dr. Miller)</div>
                    <Badge className="mt-1 bg-purple-100 text-purple-700 hover:bg-purple-200">Smith, J</Badge>
                  </div>
                  
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md p-3 text-center">
                    <div className="font-medium">Room 3</div>
                    <div className="text-sm opacity-70">In Use (Maria G.)</div>
                    <Badge className="mt-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Williams, D</Badge>
                  </div>
                  
                  <div className="bg-gray-50 text-gray-700 border border-gray-100 rounded-md p-3 text-center">
                    <div className="font-medium">Room 4</div>
                    <div className="text-sm opacity-70">Available</div>
                    <Button variant="outline" size="sm" className="mt-1 h-6 text-xs border-gray-300">Assign</Button>
                  </div>
                  
                  <div className="bg-gray-50 text-gray-700 border border-gray-100 rounded-md p-3 text-center">
                    <div className="font-medium">Room 5</div>
                    <div className="text-sm opacity-70">Available</div>
                    <Button variant="outline" size="sm" className="mt-1 h-6 text-xs border-gray-300">Assign</Button>
                  </div>
                  
                  <div className="bg-amber-50 text-amber-700 border border-amber-100 rounded-md p-3 text-center">
                    <div className="font-medium">Room 6</div>
                    <div className="text-sm opacity-70">Needs Cleanup</div>
                    <Button variant="outline" size="sm" className="mt-1 h-6 text-xs border-amber-300 text-amber-700">Mark Ready</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right sidebar */}
          <div className="col-span-3">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Provider Schedules</CardTitle>
              </CardHeader>
              <CardContent className="px-2 py-0">
                {providers.map(provider => (
                  <ProviderScheduleCard key={provider.id} provider={provider} />
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Important Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <div className="flex items-start">
                      <FileWarning className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <div className="font-medium text-amber-700">Lab Case Due Today</div>
                        <p className="text-sm text-amber-600 mt-0.5">Crown for Johnson, Emily needs confirmation</p>
                        <Button variant="outline" size="sm" className="mt-2 h-7 text-xs border-amber-300 text-amber-700">
                          Review Case
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <div className="font-medium text-red-700">Insurance Verification Pending</div>
                        <p className="text-sm text-red-600 mt-0.5">3 upcoming patients need verification</p>
                        <Button variant="outline" size="sm" className="mt-2 h-7 text-xs border-red-300 text-red-700">
                          Verify Now
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <div className="flex items-start">
                      <BellRing className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-700">Appointment Reminders</div>
                        <p className="text-sm text-blue-600 mt-0.5">5 patients need confirmation for tomorrow</p>
                        <Button variant="outline" size="sm" className="mt-2 h-7 text-xs border-blue-300 text-blue-700">
                          Send Reminders
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}