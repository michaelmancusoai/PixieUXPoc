import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@shared/schema";

export function AuthButtons() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return (
      <Button variant="ghost" disabled>
        <span className="animate-pulse">Loading...</span>
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {user.profileImageUrl ? (
                <AvatarImage src={user.profileImageUrl} alt={user.username} />
              ) : (
                <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <span className="hidden md:inline">{user.username}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href="/api/logout" className="cursor-pointer">
              Logout
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild>
      <a href="/api/login">Login</a>
    </Button>
  );
}