import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Login from "@/pages/admin/login";
import Dashboard from "@/pages/admin/dashboard";
import ContentManager from "@/pages/admin/content-manager";
import { apiRequest } from "./lib/queryClient";

function Router() {
  const { user, setUser } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    // Record page visit
    const recordVisit = async () => {
      try {
        // Determine source from referrer
        let source = 'direct';
        const referrer = document.referrer;
        
        if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yandex')) {
          source = 'search';
        } else if (referrer.includes('facebook') || referrer.includes('instagram') || referrer.includes('twitter')) {
          source = 'social';
        } else if (referrer && !referrer.includes(window.location.hostname)) {
          source = 'other';
        }
        
        await apiRequest('POST', '/api/visits', { 
          page: location,
          source
        });
      } catch (error) {
        console.error('Failed to record visit:', error);
      }
    };
    
    recordVisit();
  }, [location]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiRequest("GET", "/api/auth/session");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        // Not authenticated
        setUser(null);
      }
    };
    
    checkAuth();
  }, [setUser]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin/login">
        {() => (user ? <Dashboard /> : <Login />)}
      </Route>
      <Route path="/admin/dashboard">
        {() => (user && user.isAdmin ? <Dashboard /> : <Login />)}
      </Route>
      <Route path="/admin/content">
        {() => (user && user.isAdmin ? <ContentManager /> : <Login />)}
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
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
