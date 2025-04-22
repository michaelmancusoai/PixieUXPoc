import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, AlertCircle, ArrowUpRight, BarChart3, Calendar, Clock, FileText, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MissionControlPage() {
  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mission Control</h1>
            <p className="text-muted-foreground">Practice performance metrics and operational overview</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button>
              <AlertCircle className="mr-2 h-4 w-4" />
              Action Items
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">87%</CardTitle>
              <CardDescription>Chair Utilization</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Progress value={87} className="h-2" />
                <div className="text-xs text-green-600 font-medium flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+3.2% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">92%</CardTitle>
              <CardDescription>Appointment Confirmation</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Progress value={92} className="h-2" />
                <div className="text-xs text-muted-foreground">8 pending confirmations</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">5.3%</CardTitle>
              <CardDescription>No-Show Rate</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Progress value={5.3} className="h-2" />
                <div className="text-xs text-green-600 font-medium flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
                  <span>-1.8% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">94%</CardTitle>
              <CardDescription>Patient Satisfaction</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Progress value={94} className="h-2" />
                <div className="text-xs text-green-600 font-medium flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+1.5% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Critical Action Items
              </CardTitle>
              <CardDescription>Time-sensitive tasks requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start justify-between p-3 bg-red-50 rounded-md">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Insurance Verification Required</p>
                      <p className="text-sm text-muted-foreground">5 patients scheduled tomorrow need verification</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>
                </div>
                
                <div className="flex items-start justify-between p-3 bg-amber-50 rounded-md">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Lab Case Delayed</p>
                      <p className="text-sm text-muted-foreground">Crown for patient #PT-0024 delayed by lab</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Action Needed</Badge>
                </div>
                
                <div className="flex items-start justify-between p-3 bg-amber-50 rounded-md">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Unscheduled Treatment Plans</p>
                      <p className="text-sm text-muted-foreground">12 patients with accepted but unscheduled treatment</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Follow Up</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Key Performance Indicators
              </CardTitle>
              <CardDescription>Monthly practice metrics overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Production Goal</p>
                    <p className="text-sm font-medium">$118,500 / $125,000</p>
                  </div>
                  <Progress value={95} className="h-2" />
                  <p className="text-xs text-muted-foreground">95% of monthly goal achieved</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">New Patient Goal</p>
                    <p className="text-sm font-medium">28 / 30</p>
                  </div>
                  <Progress value={93} className="h-2" />
                  <p className="text-xs text-muted-foreground">93% of monthly goal achieved</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Hygiene Reappointment</p>
                    <p className="text-sm font-medium">82%</p>
                  </div>
                  <Progress value={82} className="h-2" />
                  <p className="text-xs text-muted-foreground">2% below target of 84%</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Treatment Plan Acceptance</p>
                    <p className="text-sm font-medium">76%</p>
                  </div>
                  <Progress value={76} className="h-2" />
                  <p className="text-xs text-green-600 font-medium">4% above target of 72%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">Staff Meeting</p>
                  <p className="text-xs text-muted-foreground mt-1">Tomorrow, 8:00 AM</p>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">Equipment Maintenance</p>
                  <p className="text-xs text-muted-foreground mt-1">April 25, 2025</p>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">CE Workshop: Implant Techniques</p>
                  <p className="text-xs text-muted-foreground mt-1">April 30, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Schedule Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Dr. Julie Carter</p>
                    <p className="text-xs text-muted-foreground">Next available: Tomorrow, 2:30 PM</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">4 slots</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Dr. Michael Smith</p>
                    <p className="text-xs text-muted-foreground">Next available: Today, 4:00 PM</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">1 slot</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Hygiene</p>
                    <p className="text-xs text-muted-foreground">Next available: April 24, 9:00 AM</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Fully Booked</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Dr. Carter</p>
                    <p className="text-xs font-medium">$42,850</p>
                  </div>
                  <Progress value={92} className="h-1.5" />
                  <p className="text-xs text-green-600">114% of goal</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Dr. Smith</p>
                    <p className="text-xs font-medium">$38,600</p>
                  </div>
                  <Progress value={85} className="h-1.5" />
                  <p className="text-xs text-green-600">103% of goal</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Hygiene Team</p>
                    <p className="text-xs font-medium">$37,050</p>
                  </div>
                  <Progress value={78} className="h-1.5" />
                  <p className="text-xs text-amber-600">98% of goal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NavigationWrapper>
  );
}