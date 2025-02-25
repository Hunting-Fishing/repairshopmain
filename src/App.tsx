
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

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
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/customer-portal" element={<CustomerPortal />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/customers/:id" element={<CustomerDetail />} />
                      <Route path="/customer-management" element={<CustomerManagement />} />
                      <Route path="/work-orders" element={<WorkOrders />} />
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
