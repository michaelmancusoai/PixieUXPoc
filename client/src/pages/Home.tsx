import { Button } from "@/components/ui/button";
import { Link } from "wouter";
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
  
  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-b from-primary to-primary-dark text-white">
            <div className="container mx-auto px-4 py-16 md:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Modern Dental Practice Management Software
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-white/90">
                    Streamline your dental practice with our comprehensive and intuitive platform. 
                    Designed specifically for dental professionals to improve patient care and 
                    practice efficiency.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                      <a href="/api/login">Get Started</a>
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      <Link href="/dashboard/planet-pixie">Try Demo</Link>
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <img 
                    src={heroImage} 
                    alt="Dental Practice Management" 
                    className="rounded-lg shadow-xl w-full max-w-lg mx-auto"
                  />
                </div>
              </div>
            </div>
            
            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
              <svg 
                viewBox="0 0 1200 120" 
                preserveAspectRatio="none" 
                className="absolute bottom-0 w-full h-full"
                fill="white"
              >
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0c0,0,0,0,0,0v0c0,0,0,0,0,0z"></path>
              </svg>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Your Practice</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
                  <p className="text-gray-600">Optimize your practice schedule with our intelligent booking system that reduces no-shows and maximizes chair time.</p>
                </div>
                
                <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Digital Claims Management</h3>
                  <p className="text-gray-600">Process insurance claims efficiently with automated verification and real-time tracking to improve cash flow.</p>
                </div>
                
                <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Patient Engagement</h3>
                  <p className="text-gray-600">Enhance patient experience with automated reminders, digital forms, and secure communication tools.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Call to Action */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Practice?</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of dental professionals who have streamlined their practice management with our platform.
              </p>
              <Button size="lg" asChild>
                <a href="/api/login">Sign Up Now</a>
              </Button>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Pixie Dental</h3>
                <p className="text-gray-400">Modern dental practice management software designed for efficiency and growth.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Scheduling</li>
                  <li>Billing</li>
                  <li>Patient Management</li>
                  <li>Reports</li>
                  <li>Dental Charting</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Help Center</li>
                  <li>Documentation</li>
                  <li>Blog</li>
                  <li>Webinars</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>support@pixiedental.com</li>
                  <li>1-800-PIXIE-DEN</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
              <p>&copy; {new Date().getFullYear()} Pixie Dental. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  
  return null;
}
