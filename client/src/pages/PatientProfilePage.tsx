import React from "react";
import { useParams, useLocation } from "wouter";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import Header, { PatientCard } from "@/components/patient/Header";
import SnapshotCards from "@/components/patient/SnapshotCards";
import ActivityHub from "@/components/patient/ActivityHub";
import RelatedRecords from "@/components/patient/RelatedRecords";
import { usePatient } from "@/hooks/usePatients";
import { 
  usePatientMedicalAlerts, 
  usePatientAppointments, 
  usePatientRecalls,
  usePatientClaims
} from "@/hooks/usePatientDetails";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientProfilePage() {
  const [location, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const patientId = params.id ? parseInt(params.id) : 0;
  
  // Fetch patient data
  const { 
    data: patient, 
    isLoading: isLoadingPatient,
    error: patientError
  } = usePatient(patientId);
  
  // Fetch related data
  const { data: medicalAlerts } = usePatientMedicalAlerts(patientId);
  const { data: appointments } = usePatientAppointments(patientId);
  const { data: recalls } = usePatientRecalls(patientId);
  const { data: claims } = usePatientClaims(patientId);
  
  // Handle invalid patient ID
  if (patientError) {
    return (
      <NavigationWrapper>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
          <p className="text-muted-foreground mb-6">The patient you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate("/patients")}>Return to Patients</Button>
        </div>
      </NavigationWrapper>
    );
  }
  
  // Loading state
  if (isLoadingPatient) {
    return (
      <NavigationWrapper>
        <div className="min-h-screen bg-background">
          <Header />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Column A: Loading Skeleton */}
              <section className="col-span-1 lg:col-span-3 flex flex-col gap-6">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <Skeleton className="h-[300px] w-full rounded-lg" />
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </section>
              
              {/* Column B: Loading Skeleton */}
              <section className="col-span-1 lg:col-span-6">
                <Skeleton className="h-[600px] w-full rounded-lg" />
              </section>
              
              {/* Column C: Loading Skeleton */}
              <section className="col-span-1 lg:col-span-3">
                <Skeleton className="h-[600px] w-full rounded-lg" />
              </section>
            </div>
          </main>
        </div>
      </NavigationWrapper>
    );
  }
  
  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column A: Snapshot Cards */}
            <section className="col-span-1 lg:col-span-3 flex flex-col gap-6">
              <h2 className="sr-only">Patient Snapshot</h2>
              <PatientCard 
                patient={patient}
                medicalAlerts={medicalAlerts}
              />
              <SnapshotCards 
                appointments={appointments} 
                recalls={recalls}
                claims={claims}
              />
            </section>
            
            {/* Column B: Activity Hub */}
            <section className="col-span-1 lg:col-span-6">
              <ActivityHub patientId={patientId} />
            </section>
            
            {/* Column C: Related Records */}
            <section className="col-span-1 lg:col-span-3">
              <RelatedRecords patientId={patientId} />
            </section>
          </div>
        </main>
      </div>
    </NavigationWrapper>
  );
}