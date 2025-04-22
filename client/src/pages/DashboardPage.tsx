import { useEffect } from "react";
import { useLocation } from "wouter";
import { NavigationWrapper } from "@/components/NavigationWrapper";

export default function DashboardPage() {
  // Redirect to the Today page when viewing the dashboard root
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation("/dashboard/today");
  }, [setLocation]);
  
  return (
    <NavigationWrapper>
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Redirecting to Dashboard...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    </NavigationWrapper>
  );
}