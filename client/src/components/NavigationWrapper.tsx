import { ReactNode } from "react";
import { Header } from "./Header";

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

  return (
    <div className="flex flex-col h-screen">
      {/* Combined App Header with Navigation */}
      <Header />

      {/* Page content area */}
      <div className="flex-1 p-3 sm:p-5 bg-[#F5F7FA]">
        <div className="mx-auto w-full max-w-[97%] 2xl:max-w-[98%] h-full">
          {/* Render page content */}
          {children}
        </div>
      </div>
    </div>
  );
}
