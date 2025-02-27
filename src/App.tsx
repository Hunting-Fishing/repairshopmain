
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
import ApplicationControl from "@/pages/ApplicationControl";
import ShopSettings from "@/pages/ShopSettings";
import { Loader2, Users, BarChart2 } from "lucide-react";
import { useIsMobile } from "./hooks/use-mobile";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { StaffList } from "@/components/staff/StaffList";
import Calendar from "@/pages/Calendar"; // Make sure this import is properly added

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const isMobile = useIsMobile();
  
  useEffect(() => {
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
                      <Route 
                        path="/inventory" 
                        element={
                          <ProtectedRoute>
                            <Inventory />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/vehicles" 
                        element={
                          <ProtectedRoute>
                            <Vehicles />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/shop-items" 
                        element={
                          <ProtectedRoute>
                            <ShopItems />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/alerts" 
                        element={
                          <ProtectedRoute>
                            <SystemAlerts />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/job-templates" 
                        element={
                          <ProtectedRoute>
                            <JobTemplates />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/application-control/*" 
                        element={
                          <ProtectedRoute>
                            <ApplicationControl />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/settings" 
                        element={
                          <ProtectedRoute>
                            <ShopSettings />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/calendar" 
                        element={
                          <ProtectedRoute>
                            <Calendar />
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
                        path="/reports" 
                        element={
                          <ProtectedRoute>
                            <ReportsPage />
                          </ProtectedRoute>
                        } 
                      />
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

function ReportsPage() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BarChart2 className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                <p className="text-muted-foreground">
                  View and generate business reports
                </p>
              </div>
            </div>
          </div>
          
          <PlaceholderPage title="Reports" />
        </div>
      </div>
    </div>
  );
}

export default App;
