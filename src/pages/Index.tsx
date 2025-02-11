
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/dashboard/components/LoadingScreen";
import { ErrorBoundaryWrapper } from "@/components/layout/ErrorBoundaryWrapper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardContextProvider } from "@/contexts/DashboardContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StatsProvider } from "@/contexts/StatsContext";

export default function Index() {
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const handleGenerateDemoData = async () => {
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
      toast.success('Demo work orders generated successfully');
    } catch (error: any) {
      console.error('Error generating demo data:', error);
      toast.error(error.message || 'Failed to generate demo data');
    }
  };

  const handleCleanupDemoData = async () => {
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
      toast.success('Demo data cleaned up successfully');
    } catch (error: any) {
      console.error('Error cleaning up demo data:', error);
      toast.error(error.message || 'Failed to clean up demo data');
    }
  };

  if (!session) {
    navigate('/auth');
    return null;
  }

  return (
    <ErrorBoundaryWrapper>
      <Suspense fallback={<LoadingScreen />}>
        <StatsProvider>
          <DashboardContextProvider>
            <main className="min-h-screen">
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
              <DashboardLayout />
            </main>
          </DashboardContextProvider>
        </StatsProvider>
      </Suspense>
    </ErrorBoundaryWrapper>
  );
}
