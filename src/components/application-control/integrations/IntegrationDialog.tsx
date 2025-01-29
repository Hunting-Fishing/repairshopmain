import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface IntegrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    title: string;
    description: string;
    icon: LucideIcon;
    status: "connected" | "not_connected";
  };
}

export const IntegrationDialog = ({ isOpen, onClose, integration }: IntegrationDialogProps) => {
  const { toast } = useToast();

  const { data: connectionData } = useQuery({
    queryKey: ["integration-connection", integration.title],
    queryFn: async () => {
      const { data: integrationData } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", integration.title)
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

  const handleConnect = async () => {
    try {
      // Here we would typically initiate the OAuth flow or API key input
      toast({
        title: "Connection initiated",
        description: "Please complete the authentication process.",
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "There was an error connecting to the service.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <integration.icon className="h-6 w-6" />
            {integration.title}
          </DialogTitle>
          <DialogDescription>{integration.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Connection Status</h3>
              <p className={`text-sm ${connectionData ? 'text-green-500' : 'text-gray-500'}`}>
                {connectionData ? 'Connected' : 'Not Connected'}
              </p>
            </div>

            {connectionData && (
              <div>
                <h3 className="font-medium mb-2">Last Synced</h3>
                <p className="text-sm text-gray-500">
                  {connectionData.last_sync_at 
                    ? new Date(connectionData.last_sync_at).toLocaleString()
                    : 'Never'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleConnect}>
            {connectionData ? 'Reconnect' : 'Connect'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};