import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle, X, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DailyHuddlePage() {
  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Daily Huddle</h1>
            <p className="text-muted-foreground">Team coordination and daily planning</p>
          </div>
          <Button className="w-full md:w-auto">
            <PlayCircle className="mr-2 h-4 w-4" />
            Start Huddle Meeting
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Dr. Carter's Schedule</p>
                      <p className="text-sm text-muted-foreground">8 appointments</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Dr. Smith's Schedule</p>
                      <p className="text-sm text-muted-foreground">6 appointments</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">1 Late</Badge>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Hygiene Team</p>
                      <p className="text-sm text-muted-foreground">12 appointments</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Team Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>JC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Dr. Julie Carter</p>
                      <p className="text-xs text-muted-foreground">Dentist</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Dr. Michael Smith</p>
                      <p className="text-xs text-muted-foreground">Dentist</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Lisa Rodriguez</p>
                      <p className="text-xs text-muted-foreground">Hygienist</p>
                    </div>
                  </div>
                  <X className="h-5 w-5 text-red-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>KJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Kevin Johnson</p>
                      <p className="text-xs text-muted-foreground">Dental Assistant</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Amanda Miller</p>
                      <p className="text-xs text-muted-foreground">Front Desk</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Patient Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">Sandra Thompson (9:30 AM)</p>
                  <p className="text-xs text-muted-foreground mt-1">Anxious about root canal. Please provide extra reassurance.</p>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">Robert Garcia (11:15 AM)</p>
                  <p className="text-xs text-muted-foreground mt-1">Follow-up for crown placement. Temporary has been comfortable.</p>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">Emily Chen (2:00 PM)</p>
                  <p className="text-xs text-muted-foreground mt-1">New patient, first comprehensive exam. Referred by Dr. Wilson.</p>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">Mark Johnson (3:45 PM)</p>
                  <p className="text-xs text-muted-foreground mt-1">Insurance verification pending. Please confirm before treatment.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NavigationWrapper>
  );
}