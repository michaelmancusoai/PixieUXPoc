import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, MessageSquare, Stethoscope, FileText, 
  DollarSign, Phone, Gavel, Eye, Edit, Plus
} from "lucide-react";

type ActivityFilter = "all" | "clinical" | "financial" | "communications" | "admin";

type ActivityItem = {
  id: string;
  type: "appointment" | "message" | "clinical" | "claim" | "payment" | "voicemail" | "admin";
  title: string;
  date: string;
  user: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
};

// Sample activity items
const activityItems: ActivityItem[] = [
  {
    id: "1",
    type: "appointment",
    title: "Upcoming · Prophylaxis (45 min)",
    date: "Jun 15, 2025 · 10:30 AM",
    user: "Dr. Johnson",
    description: "Regular cleaning appointment scheduled",
    icon: <Calendar className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "2",
    type: "message",
    title: "Sent Message · Appointment Confirmation",
    date: "May 05, 2025 · 2:14 PM",
    user: "Jenny Wilson",
    description: "Confirmed upcoming appointment for June 15",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "3",
    type: "clinical",
    title: "Completed · Annual Check-up",
    date: "Apr 02, 2025 · 9:00 AM",
    user: "Dr. Johnson",
    description: "No significant issues found. Regular cleaning performed.",
    icon: <Stethoscope className="h-5 w-5" />,
    color: "bg-emerald-100 text-emerald-600", 
  },
  {
    id: "4",
    type: "claim",
    title: "Insurance Claim · Submitted",
    date: "Apr 02, 2025 · 11:32 AM",
    user: "System",
    description: "Claim #1234567 submitted to Blue Cross Blue Shield",
    icon: <FileText className="h-5 w-5" />,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "5",
    type: "payment",
    title: "Payment · Processed",
    date: "Apr 10, 2025 · 3:45 PM",
    user: "System",
    description: "Payment of $75.00 processed via credit card",
    icon: <DollarSign className="h-5 w-5" />,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "6",
    type: "clinical",
    title: "Completed · Follow-up",
    date: "Feb 15, 2025 · 2:30 PM",
    user: "Dr. Martinez",
    description: "Follow-up to previous treatment. Healing well.",
    icon: <Stethoscope className="h-5 w-5" />,
    color: "bg-emerald-100 text-emerald-600",
  }
];

export default function ActivityHub() {
  const [filter, setFilter] = useState<ActivityFilter>("all");
  
  const filteredActivities = activityItems.filter(item => {
    if (filter === "all") return true;
    if (filter === "clinical") return ["clinical"].includes(item.type);
    if (filter === "financial") return ["payment", "claim"].includes(item.type);
    if (filter === "communications") return ["message", "voicemail"].includes(item.type);
    if (filter === "admin") return ["admin", "appointment"].includes(item.type);
    return true;
  });
  
  return (
    <Card className="h-full">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Activity & Timeline</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </Button>
      </CardHeader>
      
      <CardContent className="px-4 py-0 pb-4">
        {/* Filter options */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <FilterButton 
            active={filter === "all"} 
            onClick={() => setFilter("all")}
            label="All"
          />
          <FilterButton 
            active={filter === "clinical"} 
            onClick={() => setFilter("clinical")}
            label="Clinical"
          />
          <FilterButton 
            active={filter === "financial"} 
            onClick={() => setFilter("financial")}
            label="Financial"
          />
          <FilterButton 
            active={filter === "communications"} 
            onClick={() => setFilter("communications")}
            label="Communications"
          />
          <FilterButton 
            active={filter === "admin"} 
            onClick={() => setFilter("admin")}
            label="Admin"
          />
        </div>
        
        {/* Activity items */}
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FilterButton({ 
  active, 
  onClick, 
  label 
}: { 
  active: boolean; 
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
        active 
          ? "bg-primary text-primary-foreground font-medium" 
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
    >
      {label}
    </button>
  );
}

function ActivityCard({ activity }: { activity: ActivityItem }) {
  return (
    <div className="flex gap-3 pb-4">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.color} flex items-center justify-center`}>
        {activity.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 -mt-1 -mr-2">
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-1">{activity.date} · {activity.user}</p>
        
        {activity.description && (
          <p className="text-sm text-gray-700">{activity.description}</p>
        )}
      </div>
    </div>
  );
}