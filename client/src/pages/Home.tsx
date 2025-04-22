import { NavigationWrapper } from "@/components/NavigationWrapper";
import { usePatients } from "@/hooks/usePatients";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Search, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: patients, isLoading } = usePatients();

  // Filter patients based on search query
  const filteredPatients = searchQuery.length > 0 && patients
    ? patients.filter(patient => 
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.chartNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : patients;

  return (
    <NavigationWrapper>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Patients</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients by name or chart number..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Patient Directory</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredPatients && filteredPatients.length > 0 ? (
              <div className="space-y-2">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="border p-4 rounded-md hover:bg-gray-50 transition-colors flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <UserRound className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{patient.firstName} {patient.lastName}</h3>
                        <div className="text-sm text-muted-foreground flex gap-3">
                          <span>{patient.chartNumber}</span>
                          <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/patients/profile/${patient.id}`}>
                      <Button variant="ghost" size="sm">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No patients found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </NavigationWrapper>
  );
}
