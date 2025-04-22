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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/schedule" component={Home} />
      <Route path="/schedule/:subpage" component={Home} />
      <Route path="/patients" component={PatientProfilePage} />
      <Route path="/patients/profile" component={PatientProfilePage} />
      <Route path="/patients/:subpage" component={Home} />
      <Route path="/billing" component={Home} />
      <Route path="/billing/:subpage" component={Home} />
      <Route path="/reports" component={Home} />
      <Route path="/reports/:subpage" component={Home} />
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
