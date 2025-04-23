import React from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CalendarDays, BookOpen } from "lucide-react";

export default function SchedulePage() {
  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View and manage today's appointments.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-primary" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Weekly and monthly calendar view.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Waitlist Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage the patient waitlist.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Online Booking Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Review and confirm online appointment requests.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </NavigationWrapper>
  );
}