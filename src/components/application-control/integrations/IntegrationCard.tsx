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
      const { data: integrationData } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", title)
        .single();

      if (!integrationData?.id) return null;

      const { data: connection } = await supabase
        .from("integration_connections")
        .select("*")
        .eq("integration_id", integrationData.id)
        .single();

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