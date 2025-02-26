
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Suspense, useCallback, memo } from "react";
import { LoadingScreen } from "@/components/dashboard/components/LoadingScreen";
import { ErrorBoundaryWrapper } from "@/components/layout/ErrorBoundaryWrapper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardContextProvider } from "@/contexts/DashboardContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { StatsProvider } from "@/contexts/StatsContext";
import { Session } from "@supabase/supabase-js";

interface DemoButtonsProps {
  session: Session | null;
}

const DemoButtons = memo(function DemoButtons({ session }: DemoButtonsProps) {
  const handleGenerateDemoData = useCallback(async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session?.user?.id)
        .single();
      
      if (!profile?.organization_id) throw new Error('Organization not found');
      
      const { error } = await supabase.rpc('generate_demo_work_orders', {
        org_id: profile.organization_id,
        count: 5
      });
      
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Demo work orders generated successfully'
      });
    } catch (error: any) {
      console.error('Error generating demo data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate demo data',
        variant: 'destructive'
      });
    }
  }, [session]);

  const handleCleanupDemoData = useCallback(async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session?.user?.id)
        .single();
      
      if (!profile?.organization_id) throw new Error('Organization not found');
      
      const { error } = await supabase.rpc('cleanup_demo_data', {
        org_id: profile.organization_id
      });
      
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Demo data cleaned up successfully'
      });
    } catch (error: any) {
      console.error('Error cleaning up demo data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to clean up demo data',
        variant: 'destructive'
      });
    }
  }, [session]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <Button 
        variant="outline"
        onClick={handleGenerateDemoData}
      >
        Generate Demo Data
      </Button>
      <Button 
        variant="outline"
        onClick={handleCleanupDemoData}
      >
        Clean Up Demo Data
      </Button>
    </div>
  );
});

export default function Index() {
  const navigate = useNavigate();
  const { session } = useAuth();
  
  if (!session) {
    navigate('/auth');
    return null;
  }

  return (
    <ErrorBoundaryWrapper>
      <StatsProvider>
        <Suspense fallback={<LoadingScreen />}>
          <DashboardContextProvider>
            <main className="min-h-screen">
              <DemoButtons session={session} />
              <DashboardLayout />
            </main>
          </DashboardContextProvider>
        </Suspense>
      </StatsProvider>
    </ErrorBoundaryWrapper>
  );
}
