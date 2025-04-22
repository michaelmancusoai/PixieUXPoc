import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Import PatientCard component for export
import PatientCardComponent from "./PatientCard";

/**
 * Patient header component with back button and actions
 */
export default function Header() {
  return (
    <header className="bg-white z-10 shadow-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-1">
            <Link href="/patients">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Patients
              </Button>
            </Link>
          </div>
          
          <div>
            <Button variant="outline" className="flex items-center">
              Actions
              <MoreHorizontal className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Export PatientCard for use by other components
export { PatientCardComponent as PatientCard };