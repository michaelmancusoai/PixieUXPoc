import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format, parseISO } from "date-fns";
import { 
  Calendar, MessageSquare, Stethoscope, FileText, 
  DollarSign, Phone, Gavel, Eye, Edit, Plus, Clock,
  ChevronRight, ChevronDown, X, Search, Check, Clock8,
  CreditCard, AlertCircle, Info
} from "lucide-react";

type ActivityFilter = "all" | "clinical" | "financial" | "communications" | "admin";
type ActivityTab = "activities" | "notes" | "messages" | "calls" | "tasks" | "appointments";

type ActivityItem = {
  id: string;
  type: "appointment" | "message" | "clinical" | "claim" | "payment" | "voicemail" | "admin" | "task" | "note";
  title: string;
  date: string; // ISO date string
  formattedDate?: string; // Display date
  time?: string; // Display time
  user: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
  status?: "upcoming" | "completed" | "pending" | "overdue" | "cancelled";
  expandedContent?: React.ReactNode;
  actionable?: boolean;
};

// Helper function to group activities by month
const groupActivitiesByMonth = (activities: ActivityItem[]) => {
  const grouped: Record<string, ActivityItem[]> = {};
  
  // Get current date to mark upcoming activities
  const now = new Date();
  const upcoming: ActivityItem[] = [];
  
  activities.forEach(activity => {
    const date = parseISO(activity.date);
    
    // Handle upcoming activities (future dates)
    if (date > now) {
      upcoming.push({
        ...activity,
        formattedDate: format(date, "MMM d, yyyy"),
        time: format(date, "h:mm a")
      });
      return;
    }
    
    const monthYear = format(date, "MMMM yyyy");
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    
    grouped[monthYear].push({
      ...activity,
      formattedDate: format(date, "MMM d, yyyy"),
      time: format(date, "h:mm a")
    });
  });
  
  // Sort upcoming activities by date (ascending)
  upcoming.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  
  // Create ordered result with Upcoming first, then most recent months
  const result: Record<string, ActivityItem[]> = {};
  
  // Add upcoming activities to the top
  if (upcoming.length > 0) {
    result["Upcoming"] = upcoming;
  }
  
  // Sort months in reverse chronological order (newest to oldest)
  const sortedMonths = Object.keys(grouped).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Add sorted months to result
  sortedMonths.forEach(month => {
    result[month] = grouped[month];
  });
  
  return result;
};

// Sample activity items for the enhanced hub
const activityItems: ActivityItem[] = [
  {
    id: "1",
    type: "appointment",
    title: "Prophylaxis (45 min)",
    date: "2025-04-25T09:00:00",
    user: "Operatory 3 · Dr. Nguyen",
    icon: <Calendar className="h-4 w-4" />,
    color: "bg-primary",
    status: "upcoming",
    actionable: true,
    expandedContent: (
      <div className="text-sm bg-gray-50 p-3 rounded mt-2 border">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Due date</div>
            <div className="font-medium">Tomorrow · 9:00 AM</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Reminder</div>
            <div className="font-medium">Yes (SMS + Email)</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-muted-foreground mb-1">Provider</div>
            <div className="font-medium">Dr. Sarah Nguyen</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Operatory</div>
            <div className="font-medium">Room 3</div>
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="default" size="sm" className="h-8">
            <Calendar className="h-4 w-4 mr-1" />
            Reschedule
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    )
  },
  {
    id: "2",
    type: "task",
    title: "Follow up with patient about treatment plan",
    date: "2025-04-24T14:00:00",
    user: "Assigned to Jane Smith",
    icon: <Clock8 className="h-4 w-4" />,
    color: "bg-amber-500",
    status: "overdue",
    actionable: true,
    expandedContent: (
      <div className="text-sm bg-gray-50 p-3 rounded mt-2 border">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Due date</div>
            <div className="font-medium flex items-center">
              <Badge variant="destructive" className="mr-2">Overdue</Badge>
              Apr 24, 2025 · 2:00 PM
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Assigned to</div>
            <div className="font-medium">Jane Smith</div>
          </div>
        </div>
        <div className="mb-2">
          <div className="text-muted-foreground mb-1">Description</div>
          <div>Call patient to discuss the treatment plan options for tooth #30. Patient is considering crown vs extraction with implant.</div>
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="default" size="sm" className="h-8">
            <Check className="h-4 w-4 mr-1" />
            Mark Complete
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Edit className="h-4 w-4 mr-1" />
            Edit Task
          </Button>
        </div>
      </div>
    )
  },
  {
    id: "3",
    type: "clinical",
    title: "D2740 Crown #30 ($1,180)",
    date: "2025-04-13T10:15:00",
    user: "Dr. Nguyen",
    description: "Patient tolerated procedure well; no complications. Final adjustments made for occlusion. Patient given post-op instructions.",
    icon: <Stethoscope className="h-4 w-4" />,
    color: "bg-primary",
    status: "completed",
    expandedContent: (
      <div className="text-sm bg-gray-50 p-3 rounded mt-2 border">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Procedure code</div>
            <div className="font-medium">D2740 - Crown - porcelain/ceramic</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Tooth number</div>
            <div className="font-medium">#30 (Lower right first molar)</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Provider</div>
            <div className="font-medium">Dr. Sarah Nguyen</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Fee</div>
            <div className="font-medium">$1,180.00</div>
          </div>
        </div>
        <div className="mb-2">
          <div className="text-muted-foreground mb-1">Clinical notes</div>
          <div>Patient tolerated procedure well; no complications. Final adjustments made for occlusion. Patient given post-op instructions. Follow-up scheduled in 2 weeks.</div>
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="default" size="sm" className="h-8">
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <FileText className="h-4 w-4 mr-1" />
            Clinical Notes
          </Button>
        </div>
      </div>
    )
  },
  {
    id: "4",
    type: "claim",
    title: "Claim #A927 submitted to Delta Dental",
    date: "2025-04-13T16:30:00",
    user: "Front Office",
    icon: <FileText className="h-4 w-4" />,
    color: "bg-green-500",
    status: "pending",
    expandedContent: (
      <div className="text-sm bg-gray-50 p-3 rounded mt-2 border">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Claim number</div>
            <div className="font-medium">A927</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Insurance</div>
            <div className="font-medium">Delta Dental PPO</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Status</div>
            <div className="font-medium">
              <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Amount</div>
            <div className="font-medium">$1,180.00</div>
          </div>
        </div>
        <div className="mb-2">
          <div className="text-muted-foreground mb-1">Procedures</div>
          <div>D2740 - Crown #30 - $1,180.00</div>
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="default" size="sm" className="h-8">
            <Eye className="h-4 w-4 mr-1" />
            View Claim
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Phone className="h-4 w-4 mr-1" />
            Check Status
          </Button>
        </div>
      </div>
    )
  },
  {
    id: "5",
    type: "payment",
    title: "EOB posted • Patient owes $220",
    date: "2025-04-14T10:00:00",
    user: "System",
    description: "Insurance paid $960 (81.4%). Patient responsibility: $220 (18.6%).",
    icon: <DollarSign className="h-4 w-4" />,
    color: "bg-green-500",
    expandedContent: (
      <div className="text-sm bg-gray-50 p-3 rounded mt-2 border">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Payment type</div>
            <div className="font-medium">Insurance EOB</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Date posted</div>
            <div className="font-medium">Apr 14, 2025</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Total claim</div>
            <div className="font-medium">$1,180.00</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Insurance paid</div>
            <div className="font-medium text-green-600">$960.00</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Patient owes</div>
            <div className="font-medium text-red-600">$220.00</div>
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="default" size="sm" className="h-8">
            <CreditCard className="h-4 w-4 mr-1" />
            Collect Payment
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Eye className="h-4 w-4 mr-1" />
            View EOB
          </Button>
        </div>
      </div>
    )
  },
  {
    id: "6",
    type: "voicemail",
    title: "Voicemail left requesting payment",
    date: "2025-04-15T14:15:00",
    user: "Billing Coordinator",
    description: "Left voicemail regarding outstanding balance of $220 for recent crown procedure. Requested callback to arrange payment.",
    icon: <Phone className="h-4 w-4" />,
    color: "bg-blue-400",
    expandedContent: (
      <div className="text-sm bg-gray-50 p-3 rounded mt-2 border">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Call type</div>
            <div className="font-medium">Outbound (Voicemail)</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Staff member</div>
            <div className="font-medium">Sarah Johnson (Billing)</div>
          </div>
        </div>
        <div className="mb-2">
          <div className="text-muted-foreground mb-1">Call notes</div>
          <div>Left voicemail regarding outstanding balance of $220 for recent crown procedure. Requested callback to arrange payment.</div>
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="default" size="sm" className="h-8">
            <Phone className="h-4 w-4 mr-1" />
            Call Again
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <MessageSquare className="h-4 w-4 mr-1" />
            Send Text
          </Button>
        </div>
      </div>
    )
  },
  {
    id: "7",
    type: "admin",
    title: "HIPAA consent e-signed via portal",
    date: "2025-04-18T09:45:00",
    user: "Patient",
    icon: <Gavel className="h-4 w-4" />,
    color: "bg-purple-500",
    expandedContent: (
      <div className="text-sm bg-gray-50 p-3 rounded mt-2 border">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Document type</div>
            <div className="font-medium">HIPAA Consent Form</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Signed by</div>
            <div className="font-medium">Patient (E-signature)</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Valid until</div>
            <div className="font-medium">Apr 18, 2026</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">IP Address</div>
            <div className="font-medium">192.168.1.45</div>
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="default" size="sm" className="h-8">
            <Eye className="h-4 w-4 mr-1" />
            View Document
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <FileText className="h-4 w-4 mr-1" />
            Download PDF
          </Button>
        </div>
      </div>
    )
  },
  {
    id: "8",
    type: "message",
    title: "Secure Message sent: Post op instructions",
    date: "2025-04-16T14:30:00",
    user: "Dental Assistant",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "bg-blue-400",
    expandedContent: (
      <div className="text-sm bg-gray-50 p-3 rounded mt-2 border">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Message type</div>
            <div className="font-medium">Patient Portal Message</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Sent by</div>
            <div className="font-medium">Lisa Chen (Dental Assistant)</div>
          </div>
        </div>
        <div className="mb-2">
          <div className="text-muted-foreground mb-1">Message content</div>
          <div className="p-2 bg-white border rounded">
            <p>Hello Sarah,</p>
            <p className="mt-1">Here are your post-op instructions for the crown placement:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Avoid sticky or hard foods for 24 hours</li>
              <li>You may experience some sensitivity for a few days</li>
              <li>Continue your normal oral hygiene routine</li>
            </ul>
            <p className="mt-1">Please contact us if you have any questions or concerns.</p>
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="default" size="sm" className="h-8">
            <MessageSquare className="h-4 w-4 mr-1" />
            Reply
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Eye className="h-4 w-4 mr-1" />
            View Thread
          </Button>
        </div>
      </div>
    )
  },
  {
    id: "9",
    type: "note",
    title: "Patient prefers morning appointments",
    date: "2025-03-15T10:30:00",
    user: "Front Office",
    icon: <FileText className="h-4 w-4" />,
    color: "bg-gray-500",
    expandedContent: (
      <div className="text-sm bg-gray-50 p-3 rounded mt-2 border">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div className="text-muted-foreground mb-1">Note type</div>
            <div className="font-medium">Administrative</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Created by</div>
            <div className="font-medium">Rebecca Torres (Front Office)</div>
          </div>
        </div>
        <div className="mb-2">
          <div className="text-muted-foreground mb-1">Note details</div>
          <div className="p-2 bg-white border rounded">
            Patient mentioned they strongly prefer morning appointments due to work schedule. Try to schedule between 8-10am when possible. Also prefers text message reminders over email.
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="default" size="sm" className="h-8">
            <Edit className="h-4 w-4 mr-1" />
            Edit Note
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            Add Follow-up
          </Button>
        </div>
      </div>
    )
  }
];

export default function EnhancedActivityHub() {
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [activeTab, setActiveTab] = useState<ActivityTab>("activities");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter activities based on current filter and search query
  const filteredActivities = activityItems
    .filter(item => {
      // Apply type filter
      if (filter !== "all") {
        if (filter === "clinical" && item.type !== "clinical") return false;
        if (filter === "financial" && !["claim", "payment"].includes(item.type)) return false;
        if (filter === "communications" && !["message", "voicemail"].includes(item.type)) return false;
        if (filter === "admin" && item.type !== "admin") return false;
      }
      
      // Apply search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.user.toLowerCase().includes(query) ||
          (item.description?.toLowerCase().includes(query) || false)
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Group activities by month for display
  const groupedActivities = groupActivitiesByMonth(filteredActivities);
  
  // Toggle expanded state for an activity
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="px-4 py-3 border-b flex-shrink-0">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Activity Hub</CardTitle>
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Activity
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search activities" 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Tabs defaultValue="activities" className="w-full" onValueChange={(value) => setActiveTab(value as ActivityTab)}>
            <TabsList className="w-full grid grid-cols-6">
              <TabsTrigger value="activities">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="calls">Calls</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="appointments">Appts</TabsTrigger>
            </TabsList>
          </Tabs>
          
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
        </div>
      </CardHeader>
      
      <div className="flex-grow">
        {Object.keys(groupedActivities).length > 0 ? (
          Object.entries(groupedActivities).map(([month, activities]) => (
            <div key={month} className="mb-2">
              <div className="px-4 py-2 bg-gray-50 sticky top-0 z-10 border-y font-medium text-sm text-gray-700">
                {month}
              </div>
              
              <div className="divide-y">
                {activities.map((activity) => (
                  <ActivityCard 
                    key={activity.id} 
                    activity={activity} 
                    isExpanded={!!expandedItems[activity.id]} 
                    toggleExpanded={() => toggleExpanded(activity.id)} 
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Info className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-1">No activities found</h3>
            <p>Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
      
      <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
        <div>
          <Button variant="outline" size="sm" className="h-8">
            Filter Activity (31/31)
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredActivities.length} of {activityItems.length} activities
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
      className={`px-2.5 py-1 h-8 text-sm ${active ? 'bg-primary text-white' : ''}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ActivityCard({ 
  activity, 
  isExpanded, 
  toggleExpanded 
}: { 
  activity: ActivityItem; 
  isExpanded: boolean;
  toggleExpanded: () => void;
}) {
  // Determine badge color based on status
  const getBadgeVariant = (status?: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "overdue": return "bg-red-100 text-red-700 border-red-200";
      case "cancelled": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  
  return (
    <Collapsible open={isExpanded} onOpenChange={toggleExpanded}>
      <div className="relative hover:bg-gray-50 group">
        <div className="p-4 pl-14 cursor-pointer">
          <div className={`absolute left-4 top-4 w-6 h-6 rounded flex items-center justify-center ${activity.color} text-white`}>
            {activity.icon}
          </div>
          
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <h3 className="font-medium truncate mr-2">{activity.title}</h3>
                {activity.status && (
                  <Badge variant="outline" className={getBadgeVariant(activity.status)}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{activity.formattedDate} · {activity.time} · {activity.user}</p>
              {!isExpanded && activity.description && (
                <p className="text-sm mt-1 text-muted-foreground line-clamp-1">{activity.description}</p>
              )}
            </div>
            
            <div className="flex items-center">
              {!isExpanded && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex mr-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View details">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {activity.actionable && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
              
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 shrink-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
        
        <CollapsibleContent>
          {activity.expandedContent}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}