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
    date: "Tomorrow, 9:00 AM",
    user: "Operatory 3 · Dr. Nguyen",
    icon: <Calendar className="h-4 w-4" />,
    color: "bg-primary"
  },
  {
    id: "2",
    type: "message",
    title: "Secure Message sent: Post op instructions",
    date: "Apr 16, 2025 · 2:30 PM",
    user: "Dental Assistant",
    description: "Sending follow-up instructions for the crown placement. Patient confirmed receipt through the portal.",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "bg-blue-400"
  },
  {
    id: "3",
    type: "clinical",
    title: "Completed · D2740 Crown #30 ($1,180)",
    date: "Apr 13, 2025 · 10:15 AM",
    user: "Dr. Nguyen",
    description: "Patient tolerated procedure well; no complications. Final adjustments made for occlusion. Patient given post-op instructions.",
    icon: <Stethoscope className="h-4 w-4" />,
    color: "bg-primary"
  },
  {
    id: "4",
    type: "claim",
    title: "Claim #A927 submitted to Delta Dental ($1,180)",
    date: "Apr 13, 2025 · 4:30 PM",
    user: "Front Office",
    icon: <FileText className="h-4 w-4" />,
    color: "bg-green-500"
  },
  {
    id: "5",
    type: "payment",
    title: "EOB posted • Patient owes $220",
    date: "Apr 14, 2025 · 10:00 AM",
    user: "System",
    description: "Insurance paid $960 (81.4%). Patient responsibility: $220 (18.6%).",
    icon: <DollarSign className="h-4 w-4" />,
    color: "bg-green-500"
  },
  {
    id: "6",
    type: "voicemail",
    title: "Voicemail left requesting payment",
    date: "Apr 15, 2025 · 2:15 PM",
    user: "Billing Coordinator",
    description: "Left voicemail regarding outstanding balance of $220 for recent crown procedure. Requested callback to arrange payment.",
    icon: <Phone className="h-4 w-4" />,
    color: "bg-blue-400"
  },
  {
    id: "7",
    type: "admin",
    title: "HIPAA consent e-signed via portal",
    date: "Apr 18, 2025 · 9:45 AM",
    user: "Patient",
    icon: <Gavel className="h-4 w-4" />,
    color: "bg-purple-500"
  }
];

export default function ActivityHub() {
  const [filter, setFilter] = useState<ActivityFilter>("all");
  
  const filteredActivities = filter === "all" 
    ? activityItems 
    : activityItems.filter(item => {
        if (filter === "clinical") return item.type === "clinical";
        if (filter === "financial") return ["claim", "payment"].includes(item.type);
        if (filter === "communications") return ["message", "voicemail"].includes(item.type);
        if (filter === "admin") return item.type === "admin";
        return true;
      });
  
  return (
    <Card>
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Activity Hub</CardTitle>
        
        <div className="flex flex-wrap gap-2">
          <FilterButton 
            active={filter === "all"} 
            onClick={() => setFilter("all")}
          >
            All
          </FilterButton>
          <FilterButton 
            active={filter === "clinical"} 
            onClick={() => setFilter("clinical")}
          >
            Clinical
          </FilterButton>
          <FilterButton 
            active={filter === "financial"} 
            onClick={() => setFilter("financial")}
          >
            Financial
          </FilterButton>
          <FilterButton 
            active={filter === "communications"} 
            onClick={() => setFilter("communications")}
          >
            Communications
          </FilterButton>
          <FilterButton 
            active={filter === "admin"} 
            onClick={() => setFilter("admin")}
          >
            Admin
          </FilterButton>
        </div>
      </CardHeader>
      
      <div className="divide-y max-h-fit">
        {filteredActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
      
      <CardFooter className="px-4 py-3 border-t flex justify-end items-center">
        <div className="text-sm text-muted-foreground">
          Showing {filteredActivities.length} of {activityItems.length} activities
          <Button variant="link" className="ml-2 text-primary p-0 h-auto">
            View All
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function FilterButton({ 
  children, 
  active, 
  onClick 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void; 
}) {
  return (
    <Button 
      variant={active ? "default" : "outline"}
      className={`px-2.5 py-1 h-auto text-sm ${active ? 'bg-primary text-white' : ''}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ActivityCard({ activity }: { activity: ActivityItem }) {
  return (
    <div className="relative p-4 pl-14 hover:bg-gray-50 group">
      <div className={`absolute left-4 top-4 w-6 h-6 rounded flex items-center justify-center ${activity.color} text-white`}>
        {activity.icon}
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{activity.title}</h3>
          <p className="text-sm text-muted-foreground">{activity.date} · {activity.user}</p>
          {activity.description && (
            <p className="text-sm mt-1 text-muted-foreground">{activity.description}</p>
          )}
        </div>
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View details">
            <Eye className="h-4 w-4" />
          </Button>
          {activity.type !== "claim" && activity.type !== "payment" && activity.type !== "admin" && (
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}