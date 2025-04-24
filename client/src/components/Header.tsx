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
      <header className="bg-primary text-white py-2 px-4 flex items-center justify-between primary-header">
        {/* Logo and Brand Name */}
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center">
              <div className="h-14 w-24 relative overflow-visible flex items-center justify-center" style={{ marginLeft: '-15px' }}>
                <img 
                  src={logoImage} 
                  alt="Pixie Dental Logo" 
                  className="h-22 w-28 object-contain absolute left-0 top-1/2 transform -translate-y-1/2" 
                  style={{ marginTop: '-2px' }}
                />
              </div>
              <h1 className="text-lg md:text-xl font-bold ml-3 text-white my-auto">
                Pixie Dental
              </h1>
            </div>
          </Link>
        </div>

        {/* Search on larger screens */}
        <div className="hidden md:flex items-center px-3 py-1 rounded-md bg-primary-dark/20 border border-white/20 w-80 mx-4 shadow-inner">
          <Search className="h-3.5 w-3.5 text-white/70 mr-2" />
          <Input
            type="text"
            placeholder="Search patients, appointments..."
            className="h-7 border-0 bg-transparent text-white/90 text-sm p-0 focus-visible:ring-0 shadow-none focus-visible:ring-offset-0"
          />
          <div className="flex items-center ml-2 px-1.5 py-0.5 text-xs rounded bg-white/10 text-white/70">
            <span className="font-mono">⌘ K</span>
          </div>
        </div>

        {/* Action buttons and user menu */}
        <div className="flex items-center">
          {/* Gamepad Button */}
          <Link href="/dashboard/planet-pixie">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-primary-dark/30 hover:text-white h-7 w-7"
              aria-label="Planet Pixie Game"
            >
              <Gamepad className="h-4 w-4" />
            </Button>
          </Link>

          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 rounded-full text-white hover:bg-primary-dark/30 hover:text-white h-7 w-7"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {/* Help Button */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 rounded-full text-white hover:bg-primary-dark/30 hover:text-white h-7 w-7"
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Settings Button */}
          <Link href="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 rounded-full text-white hover:bg-primary-dark/30 hover:text-white h-7 w-7"
              aria-label="Settings"
            >
              <Cog className="h-4 w-4" />
            </Button>
          </Link>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 rounded-full text-white hover:bg-primary-dark/30 hover:text-white h-8 w-8 p-0"
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
        <nav className="flex h-10 overflow-x-auto">
          {navigationData.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "nav-link flex items-center px-5 py-2 text-gray-700 hover:bg-gray-100 border-b-2 border-transparent whitespace-nowrap transition-colors",
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
        <div className="secondary-nav bg-gray-50 border-b border-neutral-border flex py-1 px-2 overflow-x-auto">
          {currentSection.items.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              onClick={() => setActiveSubNav(subItem.href)}
              className={cn(
                "secondary-nav-link flex items-center px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap transition-colors",
                activeSubNav === subItem.href && "active bg-white shadow-sm"
              )}
            >
              <subItem.icon className="h-3.5 w-3.5 mr-1.5" />
              <span>{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
