import { useState } from "react";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import {
  BadgeInfo,
  Calendar,
  Clock,
  FileText,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Stethoscope,
  Pill,
  Heart,
  Activity,
  CreditCard,
  Edit,
  MessagesSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { NavigationWrapper } from "@/components/NavigationWrapper";

// Demo patient data
const patientData = {
  id: 12345,
  name: "Jane Smith",
  dob: "05/12/1985",
  gender: "Female",
  email: "jane.smith@example.com",
  phone: "(555) 123-4567",
  address: "123 Main Street, Anytown, CA 94501",
  insurance: "Blue Cross Blue Shield",
  policyNumber: "BCBS12345678",
  nextAppointment: "June 15, 2025 at 10:30 AM",
  lastVisit: "April 2, 2025",
  alerts: [
    { type: "Allergy", description: "Penicillin - Severe reaction" },
    { type: "Medical", description: "Asthma - Uses inhaler as needed" }
  ],
  medicalHistory: [
    { condition: "Asthma", diagnosedYear: 2010, status: "Active" },
    { condition: "Hypertension", diagnosedYear: 2018, status: "Controlled" }
  ],
  medications: [
    { name: "Albuterol", dosage: "90mcg", frequency: "As needed", prescribed: "Jan 15, 2025" },
    { name: "Lisinopril", dosage: "10mg", frequency: "Daily", prescribed: "Feb 20, 2025" }
  ],
  appointments: [
    { date: "April 2, 2025", time: "9:00 AM", provider: "Dr. Johnson", reason: "Annual Check-up", status: "Complete" },
    { date: "Feb 15, 2025", time: "2:30 PM", provider: "Dr. Martinez", reason: "Follow-up", status: "Complete" },
    { date: "June 15, 2025", time: "10:30 AM", provider: "Dr. Johnson", reason: "Cleaning", status: "Scheduled" }
  ],
  billingHistory: [
    { date: "April 2, 2025", description: "Annual Check-up", amount: 150.00, status: "Paid", insuranceCoverage: 120.00 },
    { date: "Feb 15, 2025", description: "Follow-up Visit", amount: 95.00, status: "Paid", insuranceCoverage: 75.00 }
  ],
  treatmentProgress: 65, // Percentage complete
  treatmentPlan: "Comprehensive Dental Care Plan including regular cleanings, cavity treatment, and orthodontic evaluation."
};

export default function PatientProfilePage() {
  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Patient summary card */}
          <Card className="md:w-1/3">
            <CardHeader className="pb-2">
              <CardTitle>Patient Profile</CardTitle>
              <CardDescription>Patient ID: {patientData.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{patientData.name}</h3>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <BadgeInfo className="h-4 w-4" />
                  <span>{patientData.dob} ({new Date().getFullYear() - new Date(patientData.dob.split('/')[2]).getFullYear()} yrs) • {patientData.gender}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{patientData.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{patientData.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{patientData.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CreditCard className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Insurance</p>
                    <p className="text-sm text-muted-foreground">{patientData.insurance}</p>
                    <p className="text-xs text-muted-foreground">Policy #: {patientData.policyNumber}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Patient Info
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <MessagesSquare className="h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Next Appointment */}
          <div className="md:w-2/3 space-y-6">
            {/* Upcoming Appointment Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Next Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{patientData.nextAppointment}</p>
                    <p className="text-sm text-muted-foreground">Last visit: {patientData.lastVisit}</p>
                  </div>
                  <div>
                    <Button>Reschedule</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Medical Alerts Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Medical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientData.alerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-2 pb-2 border-b last:border-0">
                      <Badge variant={alert.type === "Allergy" ? "destructive" : "default"} className="mt-1">
                        {alert.type}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{alert.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Treatment Progress Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Treatment Progress
                  </span>
                  <span className="text-base text-muted-foreground">{patientData.treatmentProgress}%</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={patientData.treatmentProgress} className="h-2 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {patientData.treatmentPlan}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="medical">
              <TabsList className="w-full bg-muted/50 p-0 h-auto">
                <TabsTrigger value="medical" className="flex gap-1 py-3 rounded-none data-[state=active]:bg-background">
                  <Stethoscope className="h-4 w-4" />
                  <span>Medical History</span>
                </TabsTrigger>
                <TabsTrigger value="medications" className="flex gap-1 py-3 rounded-none data-[state=active]:bg-background">
                  <Pill className="h-4 w-4" />
                  <span>Medications</span>
                </TabsTrigger>
                <TabsTrigger value="appointments" className="flex gap-1 py-3 rounded-none data-[state=active]:bg-background">
                  <Clock className="h-4 w-4" />
                  <span>Appointments</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex gap-1 py-3 rounded-none data-[state=active]:bg-background">
                  <CreditCard className="h-4 w-4" />
                  <span>Billing</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex gap-1 py-3 rounded-none data-[state=active]:bg-background">
                  <FileText className="h-4 w-4" />
                  <span>Documents</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="p-4">
                <TabsContent value="medical" className="m-0">
                  <h3 className="text-lg font-semibold mb-4">Medical History</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Condition</TableHead>
                        <TableHead>Diagnosed</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientData.medicalHistory.map((condition, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{condition.condition}</TableCell>
                          <TableCell>{condition.diagnosedYear}</TableCell>
                          <TableCell>
                            <Badge variant={condition.status === "Active" ? "outline" : "secondary"}>
                              {condition.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 text-primary">
                              View Notes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="medications" className="m-0">
                  <h3 className="text-lg font-semibold mb-4">Current Medications</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Prescribed</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientData.medications.map((medication, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{medication.name}</TableCell>
                          <TableCell>{medication.dosage}</TableCell>
                          <TableCell>{medication.frequency}</TableCell>
                          <TableCell>{medication.prescribed}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 text-primary">
                              Refill
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="appointments" className="m-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Appointment History</h3>
                    <Button>Schedule New</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientData.appointments.map((appointment, index) => (
                        <TableRow key={index}>
                          <TableCell>{appointment.date}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>{appointment.provider}</TableCell>
                          <TableCell>{appointment.reason}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={appointment.status === "Complete" ? "outline" : 
                                appointment.status === "Scheduled" ? "secondary" : "default"}
                            >
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 text-primary">
                              {appointment.status === "Complete" ? "View Notes" : "Reschedule"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="billing" className="m-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Billing History</h3>
                    <Button>Payment Options</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Insurance Coverage</TableHead>
                        <TableHead>Patient Responsibility</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientData.billingHistory.map((bill, index) => {
                        const patientResponsibility = bill.amount - bill.insuranceCoverage;
                        return (
                          <TableRow key={index}>
                            <TableCell>{bill.date}</TableCell>
                            <TableCell>{bill.description}</TableCell>
                            <TableCell>${bill.amount.toFixed(2)}</TableCell>
                            <TableCell>${bill.insuranceCoverage.toFixed(2)}</TableCell>
                            <TableCell>${patientResponsibility.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={bill.status === "Paid" ? "outline" : "destructive"}>
                                {bill.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="documents" className="m-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Patient Documents</h3>
                    <Button>Upload Document</Button>
                  </div>
                  <div className="p-12 border rounded-md border-dashed text-center bg-muted/50">
                    <p className="text-muted-foreground">No documents uploaded yet</p>
                    <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </NavigationWrapper>
  );
}