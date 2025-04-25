import { useLocation, Link, Route, Switch } from "wouter";
import { cn } from "@/lib/utils";
import TeamMembersPage from "./settings/TeamMembersPage";
import {
  Settings,
  Users,
  Building,
  Palette,
  ShieldCheck,
  BarChart3,
  Bell,
  FileText,
} from "lucide-react";

const settingsItems = [
  {
    title: "Team Members",
    href: "/settings/team",
    icon: Users,
    component: TeamMembersPage,
  },
  {
    title: "Practice Info",
    href: "/settings/practice",
    icon: Building,
    component: () => <div className="p-6">Practice info settings (coming soon)</div>,
  },
  {
    title: "Theme",
    href: "/settings/theme",
    icon: Palette,
    component: () => <div className="p-6">Theme settings (coming soon)</div>,
  },
  {
    title: "Permissions",
    href: "/settings/permissions",
    icon: ShieldCheck,
    component: () => <div className="p-6">Permissions settings (coming soon)</div>,
  },
  {
    title: "Analytics",
    href: "/settings/analytics",
    icon: BarChart3,
    component: () => <div className="p-6">Analytics settings (coming soon)</div>,
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
    component: () => <div className="p-6">Notification settings (coming soon)</div>,
  },
  {
    title: "Logs",
    href: "/settings/logs",
    icon: FileText,
    component: () => <div className="p-6">System logs (coming soon)</div>,
  },
];

export default function SettingsPage() {
  const [location] = useLocation();
  
  // If we're at /settings, redirect to /settings/team
  if (location === "/settings") {
    return <Link href="/settings/team"></Link>;
  }

  return (
    <div className="container grid grid-cols-6 gap-6 py-8">
      {/* Sidebar */}
      <aside className="col-span-1 space-y-1">
        <div className="font-semibold flex items-center py-2 mb-4">
          <Settings className="w-4 h-4 mr-2" />
          <span>Settings</span>
        </div>
        <nav className="flex flex-col">
          {settingsItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="col-span-5">
        <Switch>
          {settingsItems.map((item) => (
            <Route key={item.href} path={item.href} component={item.component} />
          ))}
          <Route>
            <div className="p-6 text-center">
              <p>Select a settings category from the sidebar</p>
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  );
}