import { Bell, Cog, HelpCircle, Search, LayoutDashboard, Calendar, Users, Receipt, BarChart3, Gamepad, X, User, FileText } from "lucide-react";
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
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoImage from "@assets/Screenshot_2025-04-24_at_6.58.45_PM-removebg-preview.png";

/**
 * Combined Header Component
 * 
 * Includes both the top bar (logo, search, user actions) and primary navigation
 */
export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);
  
  const {
    navigationData,
    activeNav,
    activeSubNav,
    currentSection,
    hasSubNav,
    handleNavClick,
    setActiveSubNav
  } = useNavigation();
  
  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchOpen]);
  
  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/CTRL + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      
      // ESC to close search
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <>
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

          {/* Search on larger screens - HubSpot inspired */}
          <div 
            className="hidden md:flex items-center px-3 py-1.5 rounded-md bg-primary-dark/30 border border-white/20 w-80 mx-4 shadow-inner cursor-pointer group hover:bg-primary-dark/40 transition-colors"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4 text-white/80 mr-2" />
            <div className="flex-1 text-white/80 text-sm">Search Pixie Dental</div>
            <div className="flex items-center ml-1 px-1.5 py-0.5 text-xs rounded bg-white/10 text-white/70">
              <span className="font-mono">K</span>
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

      {/* HubSpot-style Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/25 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div 
            ref={searchModalRef}
            className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Header */}
            <div className="flex items-center px-4 py-3 border-b">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <Input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patients, appointments, treatments..."
                className="flex-1 border-0 focus-visible:ring-0 text-lg p-0"
              />
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)} className="ml-2">
                <X className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
            
            {/* Search Category Tabs */}
            <div className="border-b">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
                <TabsList className="gap-2 h-auto p-1 bg-transparent">
                  <TabsTrigger 
                    value="all"
                    className="rounded px-3 py-1.5 text-sm data-[state=active]:bg-gray-100 data-[state=active]:shadow-none"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="patients"
                    className="rounded px-3 py-1.5 text-sm data-[state=active]:bg-gray-100 data-[state=active]:shadow-none"
                  >
                    Patients
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appointments"
                    className="rounded px-3 py-1.5 text-sm data-[state=active]:bg-gray-100 data-[state=active]:shadow-none"
                  >
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="treatments"
                    className="rounded px-3 py-1.5 text-sm data-[state=active]:bg-gray-100 data-[state=active]:shadow-none"
                  >
                    Treatments
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Search Results Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 h-[450px]">
              <div className="md:col-span-2 border-r overflow-y-auto">
                {searchQuery ? (
                  <div className="divide-y">
                    {/* Patients Section */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Patients</h3>
                      <div className="space-y-3">
                        <div className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                          <Avatar className="h-10 w-10 bg-primary/20 text-primary mr-3">
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">John Doe</div>
                            <div className="text-sm text-gray-500">john.doe@example.com</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Appointments Section */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Appointments</h3>
                      <div className="space-y-3">
                        <div className="flex items-start p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Calendar className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <div className="font-medium">Cleaning - John Doe</div>
                            <div className="text-sm text-gray-500">Today at 2:30 PM</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Treatments Section */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Treatments</h3>
                      <div className="space-y-3">
                        <div className="flex items-start p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Root Canal - D2140</div>
                            <div className="text-sm text-gray-500">Last performed 3 days ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Start typing to search...
                  </div>
                )}
              </div>
              
              {/* Preview Panel */}
              <div className="hidden md:block overflow-y-auto p-4">
                {searchQuery ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Select a result to see a preview
                  </div>
                ) : null}
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t p-3 flex items-center justify-between bg-gray-50 text-sm">
              <div className="text-gray-500">
                {searchQuery ? (
                  <span>See all results for "<strong>{searchQuery}</strong>"</span>
                ) : null}
              </div>
              <div className="text-gray-400">Press ENTER</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
