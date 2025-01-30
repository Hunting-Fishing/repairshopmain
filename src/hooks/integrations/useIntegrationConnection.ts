import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIntegrationConnection = (integrationTitle: string) => {
  return useQuery({
    queryKey: ["integration-connection", integrationTitle],
    queryFn: async () => {
      const { data: integrationData } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", integrationTitle)
        .maybeSingle();

      if (!integrationData?.id) return null;

      const { data: connection } = await supabase
        .from("integration_connections")
        .select("*")
        .eq("integration_id", integrationData.id)
        .maybeSingle();

      return connection;
    },
  });
};