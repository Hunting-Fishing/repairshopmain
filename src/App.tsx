
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
import { Loader2 } from "lucide-react";

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

export default App;
