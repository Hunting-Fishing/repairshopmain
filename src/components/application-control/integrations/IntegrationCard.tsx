
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { IntegrationDialog } from "./IntegrationDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IntegrationHeader } from "./cards/IntegrationHeader";
import { ApiList } from "./cards/ApiList";
import { IntegrationResources } from "./cards/IntegrationResources";
import { IntegrationCardProps } from "./types";

export const IntegrationCard = ({ 
  title, 
  description, 
  icon: Icon, 
  status,
  websiteUrl,
  documentationUrl,
  apis,
  onConnect 
}: IntegrationCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: connectionData } = useQuery({
    queryKey: ["integration-connection", title],
    queryFn: async () => {
      // Get integration ID first
      const { data: integrationData } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", title)
        .maybeSingle();

      if (!integrationData?.id) return null;

      // Then get the connection status
      const { data: connection } = await supabase
        .from("integration_connections")
        .select("*")
        .eq("integration_id", integrationData.id)
        .maybeSingle();

      // For Amazon Associates, also check settings table
      if (title === "Amazon Associates" && connection?.status === "connected") {
        const { data: amazonSettings } = await supabase
          .from("amazon_associates_settings")
          .select("tracking_enabled")
          .single();

        return {
          ...connection,
          status: amazonSettings?.tracking_enabled ? "connected" : "not_connected"
        };
      }

      return connection;
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <IntegrationHeader 
            title={title}
            Icon={Icon}
            status={connectionData?.status || status}
            onManage={() => setIsDialogOpen(true)}
          />
        </CardHeader>
        <CardContent>
          <ApiList apis={apis} status={connectionData?.status || status} />
          <IntegrationResources websiteUrl={websiteUrl} documentationUrl={documentationUrl} />
        </CardContent>
      </Card>

      <IntegrationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        integration={{ 
          title, 
          description, 
          icon: Icon, 
          status: connectionData?.status || status,
          websiteUrl,
          documentationUrl,
          apis,
          onConnect
        }}
      />
    </>
  );
};
