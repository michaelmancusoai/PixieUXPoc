import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [_, setLocation] = useLocation();
  
  // Redirect to the Today screen
  useEffect(() => {
    setLocation("/dashboard/today");
  }, [setLocation]);
  
  return null;
}
