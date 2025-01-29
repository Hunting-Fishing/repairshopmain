import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, ExternalLink, Info } from "lucide-react";
import { useState } from "react";
import { IntegrationDialog } from "./IntegrationDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "connected" | "not_connected";
  onConnect: () => void;
  websiteUrl?: string;
  documentationUrl?: string;
}

export const IntegrationCard = ({ 
  title, 
  description, 
  icon: Icon,
  status, 
  onConnect,
  websiteUrl,
  documentationUrl
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
  const lastSyncDate = connectionData?.last_sync_at 
    ? new Date(connectionData.last_sync_at).toLocaleString()
    : null;

  return (
    <>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="p-2 bg-secondary rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{title}</CardTitle>
              <div className="flex items-center gap-2">
                <span 
                  className={`text-sm px-2 py-1 rounded-full ${
                    connectionStatus === 'connected' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {connectionStatus === 'connected' ? 'Connected' : 'Not Connected'}
                </span>
                <Button 
                  variant={connectionStatus === 'connected' ? 'outline' : 'default'} 
                  onClick={() => setIsDialogOpen(true)}
                >
                  {connectionStatus === 'connected' ? 'Manage' : 'Connect'}
                </Button>
              </div>
            </div>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastSyncDate && (
            <div className="text-sm text-muted-foreground">
              Last synced: {lastSyncDate}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {websiteUrl && (
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1.5"
                onClick={() => window.open(websiteUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </Button>
            )}
            {documentationUrl && (
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1.5"
                onClick={() => window.open(documentationUrl, '_blank')}
              >
                <Info className="w-4 h-4" />
                Documentation
              </Button>
            )}
          </div>
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
          documentationUrl
        }}
      />
    </>
  );
};