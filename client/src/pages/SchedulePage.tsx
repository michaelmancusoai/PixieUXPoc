import React, { useState } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CalendarDays, BookOpen } from "lucide-react";
import ScheduleCalendar from "@/components/ScheduleCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('timeGridWeek');
  
  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCalendarView('dayGridMonth')}>
              Month
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCalendarView('timeGridWeek')}>
              Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCalendarView('timeGridDay')}>
              Day
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="p-0 mt-4">
            <div className="bg-white rounded-md shadow min-h-[600px]">
              <ScheduleCalendar view={calendarView} height={700} />
            </div>
          </TabsContent>
          
          <TabsContent value="today" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">View and manage today's appointments.</p>
                
                {/* Today's appointments list would go here */}
                <div className="mt-4 p-8 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
                  Today's appointments will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="waitlist" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Waitlist Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage the patient waitlist.</p>
                
                {/* Waitlist management UI would go here */}
                <div className="mt-4 p-8 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
                  Waitlist management interface will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  Online Booking Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Review and confirm online appointment requests.</p>
                
                {/* Online booking requests would go here */}
                <div className="mt-4 p-8 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
                  Online booking requests will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </NavigationWrapper>
  );
}