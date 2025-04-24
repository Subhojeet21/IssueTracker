
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Issues from "@/pages/issues";
import IssueDetail from "@/pages/issue-detail";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import Register from "@/pages/register";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { FilterProvider } from "@/hooks/use-filter";
import AppLayout from "@/components/layout/AppLayout";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/issues/:id">
        {(params) => (
          <ProtectedRoute>
            <AppLayout>
              <IssueDetail id={Number(params.id)} />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/issues">
        <ProtectedRoute>
          <AppLayout>
            <Issues />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/analytics">
        <ProtectedRoute>
          <AppLayout>
            <Analytics />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <AppLayout>
            <Settings />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/">
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
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
