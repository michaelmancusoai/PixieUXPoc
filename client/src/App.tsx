import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/schedule" component={Home} />
      <Route path="/schedule/:subpage" component={Home} />
      <Route path="/patients" component={Home} />
      <Route path="/patients/:subpage" component={Home} />
      <Route path="/billing" component={Home} />
      <Route path="/billing/:subpage" component={Home} />
      <Route path="/reports" component={Home} />
      <Route path="/reports/:subpage" component={Home} />
      <Route path="/settings" component={Home} />
      <Route path="/settings/:subpage" component={Home} />
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
