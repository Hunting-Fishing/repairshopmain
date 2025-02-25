
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GlobalErrorBoundary } from "@/components/shared/errors/GlobalErrorBoundary";
import { router } from "./routes/routes";

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
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <SidebarProvider>
                <RouterProvider router={router} />
                <Toaster />
                <Sonner />
              </SidebarProvider>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
