import { Switch, Route, RouteComponentProps } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CompletedMedicalHistory from "@/features/dental/components/CompletedMedicalHistory";

// Wrapper component to handle RouteComponentProps
const MedicalHistoryPageWrapper = (props: RouteComponentProps) => {
  return <CompletedMedicalHistory />;
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/medical-history" component={MedicalHistoryPageWrapper} />
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
