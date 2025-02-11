
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { RootLayout } from "./components/layout/RootLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppRoutes from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthContext.Consumer>
            {({ user }) => (
              <ThemeProvider userId={user?.id}>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full">
                    <RootLayout>
                      <AppRoutes />
                    </RootLayout>
                  </div>
                </SidebarProvider>
              </ThemeProvider>
            )}
          </AuthContext.Consumer>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
