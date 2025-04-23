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
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F5F7FA]">
        <div className="mx-auto w-full max-w-[90%] 2xl:max-w-[85%]">
          {/* Render page content */}
          {children}
        </div>
      </div>
    </div>
  );
}
