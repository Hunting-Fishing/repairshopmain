
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/dashboard/components/LoadingScreen";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { StatsProvider } from "@/contexts/StatsContext";
import { toast } from "sonner";

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

        if (error) throw error;
        
        if (!data) {
          navigate('/auth');
          return null;
        }

        return data;
      } catch (error: any) {
        toast.error('Failed to load profile');
        throw error;
      }
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    throw error; // This will be caught by our ErrorBoundary
  }

  return (
    <ErrorBoundary type="default">
      <Suspense fallback={<LoadingScreen />}>
        <StatsProvider>
          <main className="min-h-screen">
            <DashboardLayout />
          </main>
        </StatsProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
