import { Bell, Cog, HelpCircle, Search, LayoutDashboard, Calendar, Users, Receipt, BarChart3, Gamepad } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/hooks/useNavigation";
import logoImage from "@assets/Screenshot_2025-04-24_at_6.58.45_PM-removebg-preview.png";

/**
 * Combined Header Component
 * 
 * Includes both the top bar (logo, search, user actions) and primary navigation
 */
export function Header() {
  const {
    navigationData,
    activeNav,
    activeSubNav,
    currentSection,
    hasSubNav,
    handleNavClick,
    setActiveSubNav
  } = useNavigation();

  return (
    <div className="flex flex-col combined-header">
      {/* Top Bar */}
      <header className="bg-primary text-white py-3 px-4 flex items-center justify-between primary-header" style={{ backgroundColor: '#507286' }}>
        {/* Logo and Brand Name */}
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center">
              <div className="h-12 w-16 relative overflow-visible" style={{ marginLeft: '-16px' }}>
                <img 
                  src={logoImage} 
                  alt="Pixie Dental Logo" 
                  className="h-16 w-20 object-contain absolute -left-0 bottom-0 min-h-10" 
                  style={{ transform: 'rotate(5deg)' }}
                />
              </div>
              <h1 className="text-lg md:text-xl font-semibold ml-3 text-white">
                Pixie Dental
              </h1>
            </div>
          </Link>
        </div>

        {/* Search on larger screens */}
        <div className="hidden md:flex items-center px-3 py-2 rounded-md bg-primary-dark/30 border border-white/20 w-80 mx-4 shadow-inner">
          <Search className="h-4 w-4 text-white/70 mr-2" />
          <Input
            type="text"
            placeholder="Search patients, appointments..."
            className="border-0 bg-transparent text-white p-0 focus-visible:ring-0 shadow-none focus-visible:ring-offset-0"
          />
        </div>

        {/* Action buttons and user menu */}
        <div className="flex items-center">
          {/* Gamepad Button */}
          <Link href="/dashboard/planet-pixie">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-primary-dark/30 hover:text-white"
              aria-label="Planet Pixie Game"
            >
              <Gamepad className="h-5 w-5" />
            </Button>
          </Link>

          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 rounded-full text-white hover:bg-primary-dark/30 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* Help Button */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 rounded-full text-white hover:bg-primary-dark/30 hover:text-white"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Settings Button */}
          <Link href="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 rounded-full text-white hover:bg-primary-dark/30 hover:text-white"
              aria-label="Settings"
            >
              <Cog className="h-5 w-5" />
            </Button>
          </Link>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 rounded-full text-white hover:bg-primary-dark/30 hover:text-white"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Primary Navigation */}
      <div className="border-b border-neutral-border bg-white w-full shadow-sm">
        <nav className="flex h-12 overflow-x-auto">
          {navigationData.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "nav-link flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 border-b-2 border-transparent whitespace-nowrap transition-colors",
                activeNav === item.href && "active text-primary border-primary"
              )}
            >
              <item.icon className="h-4 w-4 mr-2" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Secondary Navigation - only show if the current section has subnav items */}
      {hasSubNav && (
        <div className="secondary-nav bg-gray-50 border-b border-neutral-border flex p-2 overflow-x-auto">
          {currentSection.items.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              onClick={() => setActiveSubNav(subItem.href)}
              className={cn(
                "secondary-nav-link flex items-center px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap transition-colors",
                activeSubNav === subItem.href && "active bg-white shadow-sm"
              )}
            >
              <subItem.icon className="h-4 w-4 mr-2" />
              <span>{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
