import React from "react";
import { useParams, useLocation } from "wouter";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import Header, { PatientCard } from "@/components/patient/Header";
import SnapshotCards from "@/components/patient/SnapshotCards";
import ActivityHub from "@/components/patient/ActivityHub";
import RelatedRecords from "@/components/patient/RelatedRecords";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function PatientProfilePage() {
  const [location, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const patientId = params.id ? parseInt(params.id) : 0;
  
  // For now, we'll use a loading placeholder before rendering the exact PatientDetail layout
  if (!patientId) {
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
  
  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="w-full px-2 sm:px-3 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-5">
            {/* Column A: Snapshot Cards */}
            <section className="col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col gap-4">
              <h2 className="sr-only">Patient Snapshot</h2>
              <PatientCard />
              <SnapshotCards />
            </section>
            
            {/* Column B: Activity Hub */}
            <section className="col-span-1 lg:col-span-7 xl:col-span-7">
              <ActivityHub />
            </section>
            
            {/* Column C: Related Records */}
            <section className="col-span-1 lg:col-span-3 xl:col-span-3">
              <RelatedRecords />
            </section>
          </div>
        </main>
      </div>
    </NavigationWrapper>
  );
}