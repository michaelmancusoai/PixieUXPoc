import { ReactNode } from "react";
import { Header } from "./Header";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "./Calendar";
import { useLocation } from "wouter";

interface NavigationWrapperProps {
  children?: ReactNode;
}

/**
 * NavigationWrapper Component
 * 
 * Main container that manages the application layout.
 * Uses combined header/navigation component.
 */
export function NavigationWrapper({ children }: NavigationWrapperProps) {
  const [location] = useLocation();
  
  // Determine the current page for conditional rendering
  const isHomePage = location === "/";

  return (
    <div className="flex flex-col h-screen">
      {/* Combined App Header with Navigation */}
      <Header />

      {/* Page content area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#F5F7FA]">
        <div className="mx-auto max-w-7xl">
          {/* If we have children (from Dashboard or Settings), show them */}
          {children}
          
          {/* If we're on the Home page, show the default demo content */}
          {isHomePage && (
            <>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Pixie Dental Practice Management</h2>
                  <p className="mb-4 text-gray-600">
                    Welcome to the Pixie Dental practice management system. Use the navigation menu above to access different sections of the application.
                  </p>
                </CardContent>
              </Card>

              <Calendar />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
