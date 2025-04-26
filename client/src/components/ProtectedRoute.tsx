import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Instead of redirecting to login directly on the client,
    // we redirect to the server's login endpoint which will
    // handle the OpenID Connect flow
    window.location.href = "/api/login";
    return null;
  }

  return <>{children}</>;
}