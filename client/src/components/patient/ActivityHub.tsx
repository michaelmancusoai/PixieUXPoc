import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { 
  Plus, FileText, MessageCircle, Banknote, 
  Calendar, CheckCircle, Clock, Info, Search
} from "lucide-react";
import { 
  usePatientAppointments, 
  usePatientNotes, 
  usePatientMessages, 
  usePatientPayments,
  usePatientActivityLog
} from "@/hooks/usePatientDetails";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityHubProps {
  patientId: number;
}

export default function ActivityHub({ patientId }: ActivityHubProps) {
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch data for different activity types
  const { data: activityLog, isLoading: isLoadingActivity } = usePatientActivityLog(patientId);
  const { data: appointments, isLoading: isLoadingAppointments } = usePatientAppointments(patientId);
  const { data: notes, isLoading: isLoadingNotes } = usePatientNotes(patientId);
  const { data: messages, isLoading: isLoadingMessages } = usePatientMessages(patientId);
  const { data: payments, isLoading: isLoadingPayments } = usePatientPayments(patientId);
  
  // Filter activity items based on the active tab
  const getFilteredItems = () => {
    if (activeTab === "all" && activityLog) return activityLog;
    if (activeTab === "appointments" && appointments) return appointments.map(formatAppointmentActivity);
    if (activeTab === "notes" && notes) return notes.map(formatNoteActivity);
    if (activeTab === "messages" && messages) return messages.map(formatMessageActivity);
    if (activeTab === "financial" && payments) return payments.map(formatPaymentActivity);
    return [];
  };
  
  const isLoading = 
    isLoadingActivity || 
    isLoadingAppointments || 
    isLoadingNotes || 
    isLoadingMessages || 
    isLoadingPayments;

  return (
    <Card className="h-full">
      <CardHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Activity Hub</CardTitle>
            <CardDescription>Track patient interactions and history</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Search className="h-3 w-3 mr-1" />
              Search
            </Button>
            <Button size="sm" className="text-xs h-8">
              <Plus className="h-3 w-3 mr-1" />
              Add Activity
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mt-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 h-8">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs">Appointments</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
            <TabsTrigger value="financial" className="text-xs">Financial</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] px-4">
          {isLoading ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ActivityItems items={getFilteredItems()} />
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ActivityItems({ items = [] }: { items: any[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground px-4 py-6">
        <Info className="h-12 w-12 mb-2 opacity-20" />
        <p className="text-center">No activity found for this criteria.</p>
        <p className="text-center text-sm">Try selecting a different filter or add a new activity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4 pb-6">
      {items.map((item, index) => (
        <ActivityItem key={index} item={item} />
      ))}
    </div>
  );
}

function ActivityItem({ item }: { item: any }) {
  const getIcon = () => {
    switch (item.type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'note':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'payment':
        return <Banknote className="h-4 w-4 text-amber-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-sky-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const relativeTime = item.timestamp ? 
    formatDistanceToNow(new Date(item.timestamp), { addSuffix: true }) :
    "";

  return (
    <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
      <Avatar className="h-9 w-9 rounded-full">
        <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center">
          {getIcon()}
        </div>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{item.title}</h4>
          <span className="text-xs text-gray-500">{relativeTime}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        {item.details && (
          <p className="text-xs text-gray-500 mt-1">{item.details}</p>
        )}
      </div>
    </div>
  );
}

// Helper functions to format different types of activities
function formatAppointmentActivity(appointment: any) {
  const date = new Date(appointment.startTime);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return {
    type: 'appointment',
    title: `${appointment.appointmentType} Appointment`,
    description: `Scheduled for ${formattedDate} at ${formattedTime}`,
    details: appointment.notes,
    timestamp: appointment.createdAt || appointment.updatedAt,
    status: appointment.status
  };
}

function formatNoteActivity(note: any) {
  return {
    type: 'note',
    title: `Patient Note: ${note.noteType || 'General'}`,
    description: note.content,
    timestamp: note.createdAt || note.updatedAt,
    status: note.status
  };
}

function formatMessageActivity(message: any) {
  return {
    type: 'message',
    title: `Message: ${message.messageType || 'General'}`,
    description: message.content,
    timestamp: message.sentAt || message.createdAt,
    status: message.isRead ? 'Read' : 'Unread'
  };
}

function formatPaymentActivity(payment: any) {
  return {
    type: 'payment',
    title: `Payment: $${payment.amount}`,
    description: `${payment.paymentMethod} payment received`,
    details: payment.description,
    timestamp: payment.paymentDate || payment.createdAt,
    status: 'Completed'
  };
}