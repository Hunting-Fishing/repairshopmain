import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useIntegrationStatus(integrationName: string) {
  return useQuery({
    queryKey: ["integration-status", integrationName],
    queryFn: async () => {
      const { data: integration } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", integrationName)
        .single();

      if (!integration) return "not_connected";

      const { data: connection } = await supabase
        .from("integration_connections")
        .select("status")
        .eq("integration_id", integration.id)
        .single();

      return connection?.status === "connected" ? "connected" : "not_connected";
    },
    initialData: "not_connected" as "connected" | "not_connected",
  });
}