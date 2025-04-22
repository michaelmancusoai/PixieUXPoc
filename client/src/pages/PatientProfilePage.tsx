import React from "react";
import { useParams, useLocation } from "wouter";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import Header, { PatientCard } from "@/components/patient/Header";
import SnapshotCards from "@/components/patient/SnapshotCards";
import ActivityHub from "@/components/patient/ActivityHub";
import RelatedRecords from "@/components/patient/RelatedRecords";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { ThreeColumnLayout } from "@/components/layout";
import { usePatientDetails } from "@/hooks/patient";

/**
 * PatientProfilePage - Shows detailed view of a patient with three-column layout
 */
export default function PatientProfilePage() {
  const [location, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const patientId = params.id ? parseInt(params.id) : 0;
  
  // Query for patient data
  const { data: patient, isLoading, error } = usePatientDetails(patientId);
  
  // Handle missing patient
  if (!patientId || error) {
    return (
      <NavigationWrapper>
        <PageLayout>
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The patient you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate("/patients")}>Return to Patients</Button>
          </div>
        </PageLayout>
      </NavigationWrapper>
    );
  }
  
  return (
    <NavigationWrapper>
      <PageLayout header={<Header />}>
        <ThreeColumnLayout
          leftColumn={
            <div className="flex flex-col gap-6">
              <h2 className="sr-only">Patient Snapshot</h2>
              <PatientCard />
              <SnapshotCards />
            </div>
          }
          centerColumn={<ActivityHub />}
          rightColumn={<RelatedRecords />}
        />
      </PageLayout>
    </NavigationWrapper>
  );
}