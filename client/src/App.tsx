import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PixelStyles } from "@/features/dashboard/components/RetroGame";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/login-page";
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
import PatientMetricsPage from "@/pages/PatientMetricsPage";
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
import PracticeProfilePage from "@/pages/settings/PracticeProfilePage";
import SchedulingSettingsPage from "@/pages/settings/SchedulingSettingsPage";
import CommunicationsSettingsPage from "@/pages/settings/CommunicationsSettingsPage";
import PracticeFinancesPage from "@/pages/settings/PracticeFinancesPage";
import TeamMembersPage from "@/pages/settings/TeamMembersPage";
import SecuritySettingsPage from "@/pages/settings/SecuritySettingsPage";
import AccessLogsPage from "@/pages/settings/AccessLogsPage";
import UserPermissionsPage from "@/pages/settings/UserPermissionsPage";
import ClinicalTemplatesPage from "@/pages/settings/ClinicalTemplatesPage";
import InventorySettingsPage from "@/pages/settings/InventorySettingsPage";
import AIAutomationPage from "@/pages/settings/AIAutomationPage";
import BillingPaymentsPage from "@/pages/settings/BillingPaymentsPage";
import FeeSchedulesSettingsPage from "@/pages/settings/FeeSchedulesSettingsPage";
import SubscriptionPage from "@/pages/settings/SubscriptionPage";
import ExternalServicesPage from "@/pages/settings/ExternalServicesPage";
import APISettingsPage from "@/pages/settings/APISettingsPage";
import ReferralManagementPage from "@/pages/settings/ReferralManagementPage";
import ToothChartPage from "@/features/dental/ToothChartPageFixed";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/home" component={Home} />
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
      <Route path="/patients/metrics" component={PatientMetricsPage} />
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
      <Route path="/settings/practice-profile" component={PracticeProfilePage} />
      <Route path="/settings/scheduling" component={SchedulingSettingsPage} />
      <Route path="/settings/communications" component={CommunicationsSettingsPage} />
      <Route path="/settings/practice-finances" component={PracticeFinancesPage} />
      <Route path="/settings/team-members" component={TeamMembersPage} />
      <Route path="/settings/security" component={SecuritySettingsPage} />
      <Route path="/settings/access-logs" component={AccessLogsPage} />
      <Route path="/settings/user-permissions" component={UserPermissionsPage} />
      <Route path="/settings/clinical-templates" component={ClinicalTemplatesPage} />
      <Route path="/settings/inventory" component={InventorySettingsPage} />
      <Route path="/settings/ai-automation" component={AIAutomationPage} />
      <Route path="/settings/billing-payments" component={BillingPaymentsPage} />
      <Route path="/settings/fee-schedules-settings" component={FeeSchedulesSettingsPage} />
      <Route path="/settings/subscription" component={SubscriptionPage} />
      <Route path="/settings/external-services" component={ExternalServicesPage} />
      <Route path="/settings/api-settings" component={APISettingsPage} />
      <Route path="/settings/referral-management" component={ReferralManagementPage} />
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
