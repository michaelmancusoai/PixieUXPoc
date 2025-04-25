import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PixelStyles } from "@/features/dashboard/components/RetroGame";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DashboardPage from "@/pages/DashboardPage";
import TodayPage from "@/pages/dashboard/TodayPage";
import DailyHuddlePage from "@/pages/dashboard/DailyHuddlePage";
import MissionControlPage from "@/pages/dashboard/MissionControlPage";
import LeaderboardPage from "@/pages/dashboard/LeaderboardPage";
import PlanetPixiePage from "@/pages/dashboard/PlanetPixiePage";
import SchedulingPage from "@/pages/SchedulingPage";
import CapacityPage from "@/pages/CapacityPage";
import RecallsPage from "@/pages/RecallsPage";
import WaitlistPage from "@/pages/WaitlistPage";
import PatientsPage from "@/pages/PatientsPage";
import SmartSegmentsPage from "@/pages/SmartSegmentsPage";
import ProspectsPage from "@/pages/ProspectsPage";
import DataGapsPage from "@/pages/DataGapsPage";
import BillingPage from "@/pages/BillingPage";
import ClaimsPage from "@/pages/ClaimsPage";
import PaymentsPage from "@/pages/PaymentsPage";
import StatementsPage from "@/pages/StatementsPage";
import CollectionsPage from "@/pages/CollectionsPage";
import FeeSchedulesPage from "@/pages/FeeSchedulesPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import PatientProfilePage from "@/pages/PatientProfilePage";
import ThemeSettingsPage from "@/pages/settings/ThemeSettingsPage";
import ToothChartPage from "@/features/dental/ToothChartPageFixed";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/dashboard/today" component={TodayPage} />
      <Route path="/dashboard/daily-huddle" component={DailyHuddlePage} />
      <Route path="/dashboard/mission-control" component={MissionControlPage} />
      <Route path="/dashboard/leaderboard" component={LeaderboardPage} />
      <Route path="/dashboard/planet-pixie" component={PlanetPixiePage} />
      <Route path="/schedule" component={SchedulingPage} />
      <Route path="/scheduling" component={SchedulingPage} />
      <Route path="/schedule/capacity" component={CapacityPage} />
      <Route path="/schedule/recalls" component={RecallsPage} />
      <Route path="/schedule/waitlist" component={WaitlistPage} />
      <Route path="/schedule/:subpage" component={SchedulingPage} />
      <Route path="/patients" component={PatientsPage} />
      <Route path="/patients/profile/:id" component={PatientProfilePage} />
      <Route path="/patients/segments" component={SmartSegmentsPage} />
      <Route path="/patients/prospects" component={ProspectsPage} />
      <Route path="/patients/data-gaps" component={DataGapsPage} />
      <Route path="/patients/:subpage" component={PatientsPage} />
      <Route path="/billing" component={BillingPage} />
      <Route path="/billing/claims" component={ClaimsPage} />
      <Route path="/claims" component={ClaimsPage} />
      <Route path="/billing/payments" component={PaymentsPage} />
      <Route path="/payments" component={PaymentsPage} />
      <Route path="/billing/statements" component={StatementsPage} />
      <Route path="/statements" component={StatementsPage} />
      <Route path="/billing/collections" component={CollectionsPage} />
      <Route path="/collections" component={CollectionsPage} />
      <Route path="/billing/fee-schedules" component={FeeSchedulesPage} />
      <Route path="/fee-schedules" component={FeeSchedulesPage} />
      <Route path="/billing/:subpage" component={BillingPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/reports/:subpage" component={ReportsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/settings/theme" component={ThemeSettingsPage} />
      <Route path="/settings/:subpage" component={SettingsPage} />
      <Route path="/patients/chart/:id" component={ToothChartPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <PixelStyles />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
