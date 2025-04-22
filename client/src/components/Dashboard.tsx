import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  Clock, 
  Bell, 
  MessageSquare, 
  CheckSquare 
} from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value="12"
          description="3 pending check-ins"
          icon={<Calendar className="h-5 w-5" />}
          trend="up"
          trendValue="2"
        />
        <StatCard
          title="Patient Recalls"
          value="24"
          description="Due this week"
          icon={<Users className="h-5 w-5" />}
          trend="down"
          trendValue="5"
        />
        <StatCard
          title="Today's Revenue"
          value="$1,284"
          description="From 8 transactions"
          icon={<DollarSign className="h-5 w-5" />}
          trend="up"
          trendValue="15%"
        />
        <StatCard
          title="Treatment Acceptance"
          value="76%"
          description="Last 30 days"
          icon={<BarChart3 className="h-5 w-5" />}
          trend="up"
          trendValue="4%"
        />
      </div>

      {/* Activity & Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
            <CardDescription>April 22, 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <AppointmentItem key={index} {...appointment} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Tasks & Notifications</CardTitle>
            <CardDescription>6 tasks pending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <TaskItem key={index} {...task} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <CardDescription>System and staff activity from today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Mock Data
const appointments = [
  {
    time: "9:00 AM",
    patientName: "Michael Chen",
    type: "Cleaning & Check-up",
    status: "Checked In",
    duration: "60 min"
  },
  {
    time: "10:30 AM",
    patientName: "Sarah Johnson",
    type: "Crown Preparation",
    status: "Scheduled",
    duration: "90 min"
  },
  {
    time: "1:00 PM",
    patientName: "Robert Garcia",
    type: "Invisalign Consultation",
    status: "Scheduled",
    duration: "45 min"
  },
  {
    time: "2:30 PM",
    patientName: "Jessica Kim",
    type: "Root Canal",
    status: "Scheduled",
    duration: "120 min"
  }
];

const tasks = [
  {
    title: "Review lab results",
    type: "Clinical",
    dueTime: "Today",
    priority: "High"
  },
  {
    title: "Submit insurance claim",
    type: "Billing",
    dueTime: "Today",
    priority: "Medium"
  },
  {
    title: "Call patients for confirmations",
    type: "Admin",
    dueTime: "12:00 PM",
    priority: "Medium"
  },
  {
    title: "Order supplies",
    type: "Inventory",
    dueTime: "Tomorrow",
    priority: "Low"
  }
];

const activities = [
  {
    action: "Appointment confirmed",
    user: "System",
    time: "11:42 AM",
    description: "Michael Chen confirmed their appointment via SMS"
  },
  {
    action: "Insurance verification",
    user: "Jane (Admin)",
    time: "10:15 AM",
    description: "Verified coverage for Jessica Kim's root canal procedure"
  },
  {
    action: "Lab order submitted",
    user: "Dr. Patel",
    time: "9:30 AM",
    description: "Sent crown specs to Prime Dental Lab"
  },
  {
    action: "Patient checked in",
    user: "Reception",
    time: "8:55 AM",
    description: "Michael Chen arrived for their appointment"
  }
];

// Component for stat cards
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

function StatCard({ title, value, description, icon, trend, trendValue }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
        </div>
        <div className={`flex items-center mt-4 text-xs ${
          trend === "up" ? "text-green-500" : 
          trend === "down" ? "text-red-500" : 
          "text-gray-500"
        }`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue} from yesterday
        </div>
      </CardContent>
    </Card>
  );
}

// Component for appointment items
interface AppointmentItemProps {
  time: string;
  patientName: string;
  type: string;
  status: string;
  duration: string;
}

function AppointmentItem({ time, patientName, type, status, duration }: AppointmentItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <Clock className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{patientName}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{time}</span>
            <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">{duration}</span>
          </div>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
      </div>
      <div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === "Checked In" ? "bg-green-100 text-green-800" : 
          "bg-blue-100 text-blue-800"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}

// Component for task items
interface TaskItemProps {
  title: string;
  type: string;
  dueTime: string;
  priority: string;
}

function TaskItem({ title, type, dueTime, priority }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <CheckSquare className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{type}</span>
            <span className={`text-xs rounded-full px-2 py-0.5 ${
              priority === "High" ? "bg-red-100 text-red-800" : 
              priority === "Medium" ? "bg-yellow-100 text-yellow-800" : 
              "bg-green-100 text-green-800"
            }`}>
              {priority}
            </span>
          </div>
        </div>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">{dueTime}</span>
      </div>
    </div>
  );
}

// Component for activity items
interface ActivityItemProps {
  action: string;
  user: string;
  time: string;
  description: string;
}

function ActivityItem({ action, user, time, description }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
      <div className="bg-primary/10 p-2 rounded-full mt-1">
        <Bell className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-medium">{action}</p>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-primary">{user}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}