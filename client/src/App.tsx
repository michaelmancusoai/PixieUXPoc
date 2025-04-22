import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DashboardPage from "@/pages/DashboardPage";
import SettingsPage from "@/pages/SettingsPage";
import PatientProfilePage from "@/pages/PatientProfilePage";
import PatientListPage from "@/pages/PatientListPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/schedule" component={DashboardPage} />
      <Route path="/schedule/:subpage" component={DashboardPage} />
      <Route path="/patients" component={PatientListPage} />
      <Route path="/patients/:id" component={PatientProfilePage} />
      <Route path="/billing" component={DashboardPage} />
      <Route path="/billing/:subpage" component={DashboardPage} />
      <Route path="/reports" component={DashboardPage} />
      <Route path="/reports/:subpage" component={DashboardPage} />
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
