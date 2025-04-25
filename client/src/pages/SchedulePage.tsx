import { useState } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CalendarDays, BookOpen, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function SchedulePage() {
  const [_, setLocation] = useLocation();
  
  const handleGoToScheduling = () => {
    setLocation("/scheduling");
  };
  
  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
          <Button onClick={handleGoToScheduling} className="flex items-center gap-2">
            <span>Go to Calendar View</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleGoToScheduling}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View and manage today's appointments.</p>
              <Button variant="link" className="p-0 h-auto mt-2" onClick={handleGoToScheduling}>
                Open Calendar <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleGoToScheduling}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-primary" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Weekly and monthly calendar view.</p>
              <Button variant="link" className="p-0 h-auto mt-2" onClick={handleGoToScheduling}>
                View Calendar <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleGoToScheduling}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Waitlist Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage the patient waitlist.</p>
              <Button variant="link" className="p-0 h-auto mt-2" onClick={handleGoToScheduling}>
                Open Waitlist <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleGoToScheduling}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Online Booking Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Review and confirm online appointment requests.</p>
              <Button variant="link" className="p-0 h-auto mt-2" onClick={handleGoToScheduling}>
                View Requests <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </NavigationWrapper>
  );
}