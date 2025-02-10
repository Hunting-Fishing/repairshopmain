
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/dashboard/components/LoadingScreen";
import { ErrorBoundaryWrapper } from "@/components/layout/ErrorBoundaryWrapper";
import { useNavigate } from "react-router-dom";
import { DashboardStateProvider } from "@/contexts/DashboardStateContext";
import { StatsProvider } from "@/contexts/StatsContext";
import { useAuth } from "@/contexts/AuthContext";
import { AppStateProvider } from "@/contexts/AppStateContext";

export default function Index() {
  const navigate = useNavigate();
  const { session } = useAuth();
  
  // If not authenticated, redirect to auth page
  if (!session) {
    navigate('/auth');
    return null;
  }

  return (
    <ErrorBoundaryWrapper>
      <Suspense fallback={<LoadingScreen />}>
        <StatsProvider>
          <AppStateProvider>
            <DashboardStateProvider>
              <main className="min-h-screen">
                <DashboardLayout />
              </main>
            </DashboardStateProvider>
          </AppStateProvider>
        </StatsProvider>
      </Suspense>
    </ErrorBoundaryWrapper>
  );
}

