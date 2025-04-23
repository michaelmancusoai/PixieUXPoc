import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  HelpCircle,
  Phone,
  Plus,
  ThumbsUp,
  Timer,
  User,
  Users,
  Calendar,
  ArrowRightCircle
} from "lucide-react";

// Daily summary stat card
const StatCard = ({ title, value, icon, change, changeType = "neutral" }) => {
  const getChangeColor = () => {
    if (changeType === "positive") return "text-emerald-600";
    if (changeType === "negative") return "text-red-600";
    return "text-gray-500";
  };
  
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {change && (
              <p className={`text-xs flex items-center mt-1 ${getChangeColor()}`}>
                {changeType === "positive" && "+"}{change}
                {changeType === "positive" && <ArrowRightCircle className="h-3 w-3 ml-1" />}
              </p>
            )}
          </div>
          <div className="bg-gray-100 p-2.5 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Task item component
const TaskItem = ({ task, onComplete }) => {
  return (
    <div className="py-3 flex items-start justify-between border-b last:border-0">
      <div className="flex gap-3">
        <div className={`mt-0.5 w-4 h-4 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
        <div>
          <h4 className="font-medium text-sm">{task.title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
          {task.patient && (
            <div className="flex items-center text-xs text-gray-700 mt-1.5">
              <User className="h-3 w-3 mr-1" />
              {task.patient}
            </div>
          )}
          {task.dueTime && (
            <div className="flex items-center text-xs text-gray-700 mt-0.5">
              <Clock className="h-3 w-3 mr-1" />
              {task.dueTime}
            </div>
          )}
        </div>
      </div>
      <Button size="sm" variant="ghost" className="h-7" onClick={() => onComplete(task.id)}>
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Patient card component
const ArrivedPatientCard = ({ patient }) => {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <h4 className="font-medium">{patient.name}</h4>
            <div className="text-xs text-gray-500 mt-0.5">
              <span>{patient.appointment}</span>
              <span className="mx-1.5">•</span>
              <span>{patient.time}</span>
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-xs">
                {patient.operatory}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {patient.provider}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant={patient.status === 'Checked In' ? 'secondary' : patient.status === 'Seated' ? 'default' : 'outline'} className="mb-1.5">
              {patient.status}
            </Badge>
            <span className="text-xs text-gray-500">{patient.waitTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Unconfirmed appointment card
const UnconfirmedAppointmentCard = ({ appointment, onConfirm }) => {
  return (
    <div className="py-3 border-b last:border-0 flex justify-between items-center">
      <div>
        <h4 className="font-medium text-sm">{appointment.name}</h4>
        <div className="text-xs text-gray-500 mt-0.5">
          <span>{appointment.time}</span>
          <span className="mx-1.5">•</span>
          <span>{appointment.procedure}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <Button size="sm" variant="ghost" className="h-7 px-2.5">
            <Phone className="h-3.5 w-3.5 mr-1" />
            Call
          </Button>
          <Badge variant="outline" className="text-xs">
            {appointment.phoneNumber}
          </Badge>
        </div>
      </div>
      <Button size="sm" onClick={() => onConfirm(appointment.id)}>
        <Check className="h-4 w-4 mr-1" />
        Confirm
      </Button>
    </div>
  );
};

export default function TodayPage() {
  // Mock data for summary stats
  const [stats] = useState({
    appointments: { value: "18", change: "2 from yesterday", changeType: "positive" },
    revenue: { value: "$4,820", change: "15% this week", changeType: "positive" },
    utilization: { value: "78%", change: "5% open slots", changeType: "neutral" },
    recalls: { value: "4", change: "2 confirmed", changeType: "positive" }
  });
  
  // Mock data for tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: "Call lab about crown", description: "Patient: John Smith arriving tomorrow", priority: "high", dueTime: "10:30 AM" },
    { id: 2, title: "Check insurance verification", description: "For Emily Johnson's implant procedure", priority: "medium", patient: "Emily Johnson", dueTime: "Today" },
    { id: 3, title: "Review treatment plan", description: "New case - Michael Brown", priority: "medium", patient: "Michael Brown" },
    { id: 4, title: "Order supplies", description: "Low on composites and impression material", priority: "low" },
    { id: 5, title: "Follow up on unpaid claims", description: "3 outstanding claims from last month", priority: "high" }
  ]);
  
  // Mock data for arrived patients
  const [arrivedPatients] = useState([
    { id: 1, name: "Sarah Williams", appointment: "Root Canal", time: "9:00 AM", operatory: "Op 3", provider: "Dr. Brown", status: "In Treatment", waitTime: "Wait: 4 min" },
    { id: 2, name: "Robert Jones", appointment: "Crown Prep", time: "9:15 AM", operatory: "Op 4", provider: "Dr. Miller", status: "Seated", waitTime: "Wait: 12 min" },
    { id: 3, name: "John Smith", appointment: "Exam & Clean", time: "9:30 AM", operatory: "Op 1", provider: "Dr. Davis", status: "Checked In", waitTime: "Wait: 3 min" },
    { id: 4, name: "Emily Johnson", appointment: "Filling", time: "9:45 AM", operatory: "Op 2", provider: "Dr. Wilson", status: "Checked In", waitTime: "Wait: 0 min" }
  ]);
  
  // Mock data for unconfirmed appointments
  const [unconfirmedAppointments, setUnconfirmedAppointments] = useState([
    { id: 1, name: "David Miller", time: "Tomorrow, 10:00 AM", procedure: "Crown Delivery", phoneNumber: "555-123-4567" },
    { id: 2, name: "Elizabeth Wilson", time: "Tomorrow, 11:30 AM", procedure: "Filling", phoneNumber: "555-234-5678" },
    { id: 3, name: "Jennifer Davis", time: "Thursday, 9:15 AM", procedure: "Exam & X-Rays", phoneNumber: "555-345-6789" }
  ]);
  
  // Handle completing a task
  const handleCompleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  // Handle confirming an appointment
  const handleConfirmAppointment = (appointmentId) => {
    setUnconfirmedAppointments(unconfirmedAppointments.filter(appt => appt.id !== appointmentId));
  };
  
  return (
    <NavigationWrapper>
      <div className="container mx-auto px-4 py-6">
        {/* Page header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{format(new Date(), "EEEE, MMMM d")}</h1>
            <p className="text-muted-foreground">Today's overview</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <FileText className="h-4 w-4" />
              Reports
            </Button>
            <Button className="gap-1">
              <Calendar className="h-4 w-4" />
              Schedule View
            </Button>
          </div>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Today's Appointments" 
            value={stats.appointments.value}
            icon={<Clock className="h-5 w-5 text-blue-600" />}
            change={stats.appointments.change}
            changeType={stats.appointments.changeType}
          />
          <StatCard 
            title="Expected Revenue" 
            value={stats.revenue.value}
            icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
            change={stats.revenue.change}
            changeType={stats.revenue.changeType}
          />
          <StatCard 
            title="Chair Utilization" 
            value={stats.utilization.value}
            icon={<BarChart3 className="h-5 w-5 text-purple-600" />}
            change={stats.utilization.change}
            changeType={stats.utilization.changeType}
          />
          <StatCard 
            title="Recall Appointments" 
            value={stats.recalls.value}
            icon={<Users className="h-5 w-5 text-orange-600" />}
            change={stats.recalls.change}
            changeType={stats.recalls.changeType}
          />
        </div>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks column */}
          <Card className="lg:col-span-1 self-start shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Tasks</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
              <CardDescription>
                {tasks.length} tasks for today
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <TaskItem key={task.id} task={task} onComplete={handleCompleteTask} />
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p>All done for today!</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Middle column - arrived patients */}
          <Card className="lg:col-span-1 self-start shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Arrived Patients</CardTitle>
              <CardDescription>
                {arrivedPatients.length} patients in office
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {arrivedPatients.map(patient => (
                <ArrivedPatientCard key={patient.id} patient={patient} />
              ))}
            </CardContent>
          </Card>
          
          {/* Right column - unconfirmed appointments */}
          <Card className="lg:col-span-1 self-start shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Unconfirmed</CardTitle>
              <CardDescription>
                {unconfirmedAppointments.length} appointments need confirmation
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              {unconfirmedAppointments.length > 0 ? (
                unconfirmedAppointments.map(appointment => (
                  <UnconfirmedAppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    onConfirm={handleConfirmAppointment} 
                  />
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p>All appointments confirmed!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </NavigationWrapper>
  );
}