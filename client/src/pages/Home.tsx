import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import heroImage from "@assets/659c38845d872a189b2d1292_Hero-Section - Insurance.avif";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [_, navigate] = useLocation();
  
  // If user is already authenticated, redirect to the dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard/today");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-primary to-primary-dark items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <img 
                src={heroImage}
                alt="Logo" 
                className="h-20 w-auto rounded-md object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pixie Dental</h2>
            <p className="text-gray-600 mb-8">Modern Practice Management Software</p>
            
            <Button size="lg" asChild className="w-full">
              <a href="/api/login">Log in with Replit</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}
