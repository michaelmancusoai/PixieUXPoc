import { useState, ReactNode } from "react";
import { Header } from "./Header";
import { HorizontalNavigation } from "./HorizontalNavigation";
import { VerticalNavigation } from "./VerticalNavigation";
import { CombinedNavigation } from "./CombinedNavigation";
import { TabNavigation } from "./TabNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "./Calendar";
import { useLocation } from "wouter";

/**
 * Navigation style types
 */
export enum NavStyle {
  Horizontal = 1,
  Vertical = 2,
  Combined = 3,
  Tabs = 4
}

/**
 * Navigation demo options for style switcher
 */
const NAV_STYLES = [
  { id: NavStyle.Horizontal, label: "Horizontal Navigation" },
  { id: NavStyle.Vertical, label: "Vertical Sidebar" },
  { id: NavStyle.Combined, label: "Combined Navigation" },
  { id: NavStyle.Tabs, label: "Tab-based Navigation" },
];

interface NavigationWrapperProps {
  children?: ReactNode;
}

/**
 * NavigationWrapper Component
 * 
 * Main container that manages navigation styles and layouts.
 * Handles the rendering of different navigation components based on the selected style.
 */
export function NavigationWrapper({ children }: NavigationWrapperProps) {
  const [navStyle, setNavStyle] = useState<NavStyle>(NavStyle.Horizontal);
  const [location] = useLocation();

  /**
   * Renders the appropriate navigation component based on current style
   */
  const renderNavigation = () => {
    switch (navStyle) {
      case NavStyle.Horizontal:
        return <HorizontalNavigation />;
      case NavStyle.Vertical:
        return <VerticalNavigation />;
      case NavStyle.Combined:
        return <CombinedNavigation />;
      case NavStyle.Tabs:
        return <TabNavigation />;
      default:
        return <HorizontalNavigation />;
    }
  };

  // Determine layout adjustments based on navigation style
  const isVerticalOrCombined = navStyle === NavStyle.Vertical || navStyle === NavStyle.Combined;
  
  // Determine the current page for conditional rendering
  const isHomePage = location === "/";

  return (
    <div className="flex flex-col h-screen">
      {/* App Header with navigation style selector */}
      <Header currentNavStyle={navStyle} onChangeNavStyle={setNavStyle} />

      {/* Main content area with navigation */}
      <div className={isVerticalOrCombined ? "flex flex-1 overflow-hidden" : "flex-1"}>
        {/* Navigation container */}
        <div className={isVerticalOrCombined ? "" : "w-full"}>
          {renderNavigation()}
        </div>

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
                    <h2 className="text-xl font-semibold mb-4">Navigation Variations</h2>
                    <p className="mb-4 text-gray-600">
                      Click on the buttons below to toggle between different navigation styles:
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      {NAV_STYLES.map((style) => (
                        <Button
                          key={style.id}
                          variant={navStyle === style.id ? "default" : "outline"}
                          onClick={() => setNavStyle(style.id)}
                        >
                          {style.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Calendar />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
