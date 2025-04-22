import React from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import Header, { PatientCard } from "@/components/patient/Header";
import SnapshotCards from "@/components/patient/SnapshotCards";
import ActivityHub from "@/components/patient/ActivityHub";
import RelatedRecords from "@/components/patient/RelatedRecords";

export default function PatientProfilePage() {
  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column A: Snapshot Cards */}
            <section className="col-span-1 lg:col-span-3 flex flex-col gap-6">
              <h2 className="sr-only">Patient Snapshot</h2>
              <PatientCard />
              <SnapshotCards />
            </section>
            
            {/* Column B: Activity Hub */}
            <section className="col-span-1 lg:col-span-6">
              <ActivityHub />
            </section>
            
            {/* Column C: Related Records */}
            <section className="col-span-1 lg:col-span-3">
              <RelatedRecords />
            </section>
          </div>
        </main>
      </div>
    </NavigationWrapper>
  );
}