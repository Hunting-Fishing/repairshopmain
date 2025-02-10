
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/dashboard/components/LoadingScreen";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AppStateProvider } from "@/contexts/AppStateContext";
import { toast } from "sonner";
import { ErrorBoundaryWrapper } from "@/components/layout/ErrorBoundaryWrapper";
import { StatsProvider } from "@/contexts/StatsContext";
import { DashboardProvider } from "@/components/dashboard/DashboardProvider";

export default function Index() {
  const navigate = useNavigate();
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          navigate('/auth');
          return null;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          toast.error('Failed to load profile');
          throw error;
        }
        
        if (!data) {
          navigate('/auth');
          return null;
        }

        return data;
      } catch (error: any) {
        console.error('Profile loading error:', error);
        toast.error('Failed to load profile. Please try again.');
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    throw error; // Will be caught by ErrorBoundaryWrapper
  }

  return (
    <ErrorBoundaryWrapper>
      <Suspense fallback={<LoadingScreen />}>
        <StatsProvider>
          <DashboardProvider>
            <AppStateProvider>
              <main className="min-h-screen">
                <DashboardLayout />
              </main>
            </AppStateProvider>
          </DashboardProvider>
        </StatsProvider>
      </Suspense>
    </ErrorBoundaryWrapper>
  );
}
