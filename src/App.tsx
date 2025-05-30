import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Home from "@/pages/home";
import AdminPage from "@/pages/admin";

import OfficeLocation from "@/pages/office-location";
import PrivacyPolicy from "@/pages/privacy-policy";
import CourseDetails from "@/pages/course-details";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/courses/:courseId" component={CourseDetails} />
          <Route path="/blog" component={Blog} />
          <Route path="/office-location" component={OfficeLocation} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/login" component={Home} />
          <Route path="/admin" component={AdminPage} />

          <Route path="/courses/:courseId" component={CourseDetails} />
          <Route path="/blog" component={Blog} />
          <Route path="/office-location" component={OfficeLocation} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
        </>
      )}
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
