
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { RootLayout } from "./components/layout/RootLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GlobalErrorBoundary } from "@/components/shared/errors/GlobalErrorBoundary";
import { NavigationLoading } from "@/components/ui/navigation-loading";
import AppRoutes from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <TooltipProvider>
                <SidebarProvider>
                  <NavigationLoading />
                  <div className="min-h-screen flex w-full">
                    <RootLayout>
                      <AppRoutes />
                    </RootLayout>
                  </div>
                  <Toaster />
                  <Sonner />
                </SidebarProvider>
              </TooltipProvider>
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
