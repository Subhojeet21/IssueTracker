import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Issues from "@/pages/issues";
import IssueDetail from "@/pages/issue-detail";
import Analytics from "@/pages/analytics";
import Login from "@/pages/login";
import Register from "@/pages/register";
import { AuthProvider } from "@/hooks/use-auth";
import { FilterProvider } from "@/hooks/use-filter";
import AppLayout from "@/components/layout/AppLayout";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/issues/:id">
        {(params) => (
          <AppLayout>
            <IssueDetail id={Number(params.id)} />
          </AppLayout>
        )}
      </Route>
      <Route path="/issues">
        <AppLayout>
          <Issues />
        </AppLayout>
      </Route>
      <Route path="/analytics">
        <AppLayout>
          <Analytics />
        </AppLayout>
      </Route>
      <Route path="/">
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <FilterProvider>
            <Router />
          </FilterProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
