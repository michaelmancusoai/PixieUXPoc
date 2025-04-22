import { Bell, HelpCircle, Search, Settings } from "lucide-react";
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

interface HeaderProps {
  currentNavStyle: number;
  onChangeNavStyle: (style: number) => void;
}

export function Header({ currentNavStyle, onChangeNavStyle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-border py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded bg-primary flex items-center justify-center text-white font-bold text-xl">
          PD
        </div>
        <h1 className="text-lg md:text-xl font-semibold ml-3 text-gray-800">
          Pixie Dental
        </h1>
      </div>

      {/* Search on larger screens */}
      <div className="hidden md:flex items-center px-3 py-2 rounded-md bg-gray-50 border border-gray-200 w-80 mx-4">
        <Search className="h-4 w-4 text-gray-500 mr-2" />
        <Input
          type="text"
          placeholder="Search patients, appointments..."
          className="border-0 bg-transparent p-0 focus-visible:ring-0 shadow-none focus-visible:ring-offset-0"
        />
      </div>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="hidden md:flex items-center mr-2"
              size="sm"
            >
              <Settings className="h-4 w-4 text-gray-600 mr-2" />
              <span>Navigation Style</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select Navigation</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={currentNavStyle === 1 ? "bg-primary/5" : ""}
              onClick={() => onChangeNavStyle(1)}
            >
              Horizontal Navigation
            </DropdownMenuItem>
            <DropdownMenuItem
              className={currentNavStyle === 2 ? "bg-primary/5" : ""}
              onClick={() => onChangeNavStyle(2)}
            >
              Vertical Sidebar
            </DropdownMenuItem>
            <DropdownMenuItem
              className={currentNavStyle === 3 ? "bg-primary/5" : ""}
              onClick={() => onChangeNavStyle(3)}
            >
              Combined Navigation
            </DropdownMenuItem>
            <DropdownMenuItem
              className={currentNavStyle === 4 ? "bg-primary/5" : ""}
              onClick={() => onChangeNavStyle(4)}
            >
              Tab-based Navigation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="ml-1 rounded-full"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5 text-gray-600" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 rounded-full"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
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
  );
}
