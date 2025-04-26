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
    const userInitial = user.username ? user.username[0]?.toUpperCase() : '?';
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 text-white">
            <Avatar className="h-8 w-8 border-2 border-white">
              {user.profileImageUrl ? (
                <AvatarImage src={user.profileImageUrl} alt={user.username || 'User'} />
              ) : (
                <AvatarFallback>{userInitial}</AvatarFallback>
              )}
            </Avatar>
            {user.username && (
              <span className="hidden md:inline">{user.username}</span>
            )}
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