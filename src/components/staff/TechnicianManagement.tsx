
import { Tabs } from "@/components/ui/tabs";
import { TechnicianFormWrapper } from "./TechnicianFormWrapper";
import TechnicianTabs from "./TechnicianTabs";
import { UseFormReturn } from "react-hook-form";
import { TechnicianSettingsFormValues } from "./types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function TechnicianManagement() {
  const { isLoading, error } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load staff management. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="roles" className="w-full">
        <TechnicianFormWrapper>
          {(form: UseFormReturn<TechnicianSettingsFormValues>) => (
            <TechnicianTabs />
          )}
        </TechnicianFormWrapper>
      </Tabs>
    </div>
  );
}
