import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DashboardPage from "@/pages/DashboardPage";
import TodayPage from "@/pages/dashboard/TodayPage";
import DailyHuddlePage from "@/pages/dashboard/DailyHuddlePage";
import MissionControlPage from "@/pages/dashboard/MissionControlPage";
import SchedulePage from "@/pages/SchedulePage";
import PatientsPage from "@/pages/PatientsPage";
import BillingPage from "@/pages/BillingPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import PatientProfilePage from "@/pages/PatientProfilePage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/dashboard/today" component={TodayPage} />
      <Route path="/dashboard/daily-huddle" component={DailyHuddlePage} />
      <Route path="/dashboard/mission-control" component={MissionControlPage} />
      <Route path="/schedule" component={SchedulePage} />
      <Route path="/schedule/:subpage" component={SchedulePage} />
      <Route path="/patients" component={PatientsPage} />
      <Route path="/patients/profile/:id" component={PatientProfilePage} />
      <Route path="/patients/:subpage" component={PatientsPage} />
      <Route path="/billing" component={BillingPage} />
      <Route path="/billing/:subpage" component={BillingPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/reports/:subpage" component={ReportsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/settings/:subpage" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
