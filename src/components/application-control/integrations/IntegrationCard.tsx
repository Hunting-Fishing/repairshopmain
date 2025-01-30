import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { IntegrationDialog } from "./IntegrationDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IntegrationHeader } from "./cards/IntegrationHeader";
import { ApiList } from "./cards/ApiList";
import { IntegrationResources } from "./cards/IntegrationResources";

interface ApiEndpoint {
  name: string;
  status: "active" | "coming_soon";
  endpoint?: string;
  description: string;
}

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "connected" | "not_connected";
  onConnect: () => void;
  websiteUrl?: string;
  documentationUrl?: string;
  apis?: ApiEndpoint[];
}

export const IntegrationCard = ({ 
  title, 
  description, 
  icon: Icon, 
  status, 
  websiteUrl, 
  documentationUrl, 
  apis 
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

  const connectionStatus = connectionData?.status || status;

  return (
    <>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="p-2 bg-secondary rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <IntegrationHeader 
              title={title}
              Icon={Icon}
              status={connectionStatus}
              onManage={() => setIsDialogOpen(true)}
            />
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ApiList apis={apis} status={connectionStatus} />
          {connectionData?.last_sync_at && (
            <div className="text-sm text-muted-foreground">
              Last synced: {new Date(connectionData.last_sync_at).toLocaleString()}
            </div>
          )}
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
          status: connectionStatus,
          websiteUrl,
          documentationUrl,
          apis
        }}
      />
    </>
  );
};