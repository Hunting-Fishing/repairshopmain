
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { StatsProvider } from "@/contexts/StatsContext";
import { DashboardContextProvider } from "@/contexts/DashboardContext";
import { ErrorBoundaryWrapper } from "@/components/layout/ErrorBoundaryWrapper";
import Auth from "@/pages/Auth";
import CustomerPortal from "@/pages/CustomerPortal";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/CustomerDetail";
import CustomerManagement from "@/pages/CustomerManagement";
import WorkOrders from "@/pages/WorkOrders";
import Index from "@/pages/Index";
import Inventory from "@/pages/Inventory";
import Vehicles from "@/pages/Vehicles";
import ShopItems from "@/pages/ShopItems";
import SystemAlerts from "@/pages/SystemAlerts";
import JobTemplates from "@/pages/JobTemplates";
import { Loader2, Users } from "lucide-react";
import { useIsMobile } from "./hooks/use-mobile";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { StaffList } from "@/components/staff/StaffList";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Add a class to the body when on mobile
    if (isMobile) {
      document.body.classList.add('is-mobile-device');
    } else {
      document.body.classList.remove('is-mobile-device');
    }
  }, [isMobile]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Placeholder component for routes that are not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  useEffect(() => {
    toast({
      title: "Under Development",
      description: `The ${title} page is still being built.`
    });
  }, [title]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-muted-foreground mb-8">This page is under development</p>
      <div className="p-6 border rounded-lg bg-background max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <p className="mb-4">
          The {title.toLowerCase()} functionality is still being built. Check back soon for updates!
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundaryWrapper>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider userId={undefined}>
            <StatsProvider>
              <DashboardContextProvider>
                <SidebarProvider>
                  <Router>
                    <Routes>
                      <Route path="/auth" element={<Auth />} />
                      
                      {/* Protected Routes */}
                      <Route 
                        path="/" 
                        element={
                          <ProtectedRoute>
                            <Index />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/customer-portal" 
                        element={
                          <ProtectedRoute>
                            <CustomerPortal />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/customers" 
                        element={
                          <ProtectedRoute>
                            <Customers />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/customers/:id" 
                        element={
                          <ProtectedRoute>
                            <CustomerDetail />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/customer-management" 
                        element={
                          <ProtectedRoute>
                            <CustomerManagement />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/work-orders" 
                        element={
                          <ProtectedRoute>
                            <WorkOrders />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Inventory route - using the actual component */}
                      <Route 
                        path="/inventory" 
                        element={
                          <ProtectedRoute>
                            <Inventory />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Vehicles route - using the actual component */}
                      <Route 
                        path="/vehicles" 
                        element={
                          <ProtectedRoute>
                            <Vehicles />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Shop Items route - using the actual component */}
                      <Route 
                        path="/shop-items" 
                        element={
                          <ProtectedRoute>
                            <ShopItems />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* System Alerts route - using the actual component */}
                      <Route 
                        path="/alerts" 
                        element={
                          <ProtectedRoute>
                            <SystemAlerts />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Job Templates route - using the actual component */}
                      <Route 
                        path="/job-templates" 
                        element={
                          <ProtectedRoute>
                            <JobTemplates />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Add routes for other non-working sidebar items */}
                      <Route 
                        path="/calendar" 
                        element={
                          <ProtectedRoute>
                            <PlaceholderPage title="Calendar" />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/staff" 
                        element={
                          <ProtectedRoute>
                            <StaffPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/application-control/*" 
                        element={
                          <ProtectedRoute>
                            <PlaceholderPage title="Settings" />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Catch-all route for unmatched paths */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <Toaster />
                  </Router>
                </SidebarProvider>
              </DashboardContextProvider>
            </StatsProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundaryWrapper>
  );
}

// Create a new Staff page component
function StaffPage() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                <p className="text-muted-foreground">
                  Manage staff members and roles
                </p>
              </div>
            </div>
          </div>
          
          <StaffList />
        </div>
      </div>
    </div>
  );
}

export default App;
