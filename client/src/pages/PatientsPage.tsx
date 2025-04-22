import React from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

// Mock patient data
const patients = [
  {
    id: 1,
    name: "Sarah Johnson",
    chartNumber: "PT-0001",
    lastVisit: "Apr 15, 2025",
    nextVisit: "Jun 10, 2025",
    balance: "$834.00"
  },
  {
    id: 2,
    name: "Michael Chen",
    chartNumber: "PT-0002",
    lastVisit: "Mar 22, 2025",
    nextVisit: "Jul 05, 2025",
    balance: "$0.00"
  },
  {
    id: 3,
    name: "Emma Garcia", 
    chartNumber: "PT-0003",
    lastVisit: "Apr 01, 2025",
    nextVisit: "Oct 12, 2025",
    balance: "$356.00"
  },
  {
    id: 4,
    name: "James Wilson",
    chartNumber: "PT-0004",
    lastVisit: "Feb 14, 2025",
    nextVisit: "Aug 20, 2025",
    balance: "$1,250.00"
  }
];

export default function PatientsPage() {
  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Patient Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between pb-4 space-x-2">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Chart #</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Next Visit</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.chartNumber}</TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>{patient.nextVisit}</TableCell>
                      <TableCell>
                        {parseFloat(patient.balance.replace('$', '').replace(',', '')) > 0 ? (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                            {patient.balance}
                          </Badge>
                        ) : (
                          <span className="text-green-600">{patient.balance}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/patients/profile/${patient.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </NavigationWrapper>
  );
}