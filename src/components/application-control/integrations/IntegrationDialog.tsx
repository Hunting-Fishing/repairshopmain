import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon, ExternalLink, Info, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NhtsaVinDialog } from "./NhtsaVinDialog";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IntegrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    title: string;
    description: string;
    icon: LucideIcon;
    status: "connected" | "not_connected";
    websiteUrl?: string;
    documentationUrl?: string;
  };
}

export const IntegrationDialog = ({ isOpen, onClose, integration }: IntegrationDialogProps) => {
  const { toast } = useToast();
  const [showNhtsaDialog, setShowNhtsaDialog] = useState(false);

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
    if (integration.title === "NHTSA Database") {
      setShowNhtsaDialog(true);
      return;
    }

    try {
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

  const renderNhtsaApiDetails = () => {
    if (integration.title !== "NHTSA Database") return null;

    return (
      <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
        <h3 className="font-medium">Available NHTSA APIs</h3>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium flex items-center gap-2">
              <span className="text-green-600">✓</span> VIN Decoder API
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              Endpoint: https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/
              <br />
              Purpose: Decode VINs to get detailed vehicle specifications
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium flex items-center gap-2">
              <span className="text-yellow-600">○</span> Recall Database API (Coming Soon)
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              Access vehicle recall information and safety notices
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium flex items-center gap-2">
              <span className="text-yellow-600">○</span> Safety Ratings API (Coming Soon)
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              Get NHTSA crash test ratings and safety evaluations
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium flex items-center gap-2">
              <span className="text-yellow-600">○</span> Technical Service Bulletins API (Coming Soon)
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              Access manufacturer service bulletins and technical notices
            </p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Currently integrated with VIN Decoder API. Additional NHTSA APIs will be added in future updates.
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  return (
    <>
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

              {renderNhtsaApiDetails()}

              {(integration.websiteUrl || integration.documentationUrl) && (
                <div className="space-y-2">
                  <h3 className="font-medium">Resources</h3>
                  <div className="flex gap-2">
                    {integration.websiteUrl && (
                      <Button variant="outline" size="sm" onClick={() => window.open(integration.websiteUrl, '_blank')} className="gap-1.5">
                        <ExternalLink className="h-4 w-4" />
                        Visit Website
                      </Button>
                    )}
                    {integration.documentationUrl && (
                      <Button variant="outline" size="sm" onClick={() => window.open(integration.documentationUrl, '_blank')} className="gap-1.5">
                        <Info className="h-4 w-4" />
                        Documentation
                      </Button>
                    )}
                  </div>
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

      <NhtsaVinDialog 
        isOpen={showNhtsaDialog} 
        onClose={() => {
          setShowNhtsaDialog(false);
          onClose();
        }} 
      />
    </>
  );
};