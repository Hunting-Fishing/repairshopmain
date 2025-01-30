import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon, ExternalLink, Info, AlertCircle, Database, Shield, FileWarning, Wrench } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NhtsaVinDialog } from "./NhtsaVinDialog";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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

    const apis = [
      {
        name: "VIN Decoder API",
        status: "active",
        icon: Database,
        endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/",
        description: "Decode VINs to get detailed vehicle specifications",
        documentation: "https://vpic.nhtsa.dot.gov/api/Home/Index/1",
        features: [
          "Vehicle make, model, and year",
          "Engine specifications",
          "Vehicle type and body class",
          "Safety features",
          "Manufacturing details"
        ]
      },
      {
        name: "Recall Database API",
        status: "coming_soon",
        icon: Shield,
        endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/recalls/",
        description: "Access vehicle recall information and safety notices",
        features: [
          "Active safety recalls",
          "Recall descriptions and remedies",
          "Affected components",
          "Manufacturer communications"
        ]
      },
      {
        name: "Safety Ratings API",
        status: "coming_soon",
        icon: FileWarning,
        endpoint: "https://vpic.nhtsa.dot.gov/api/SafetyRatings/",
        description: "Get NHTSA crash test ratings and safety evaluations",
        features: [
          "Overall vehicle safety ratings",
          "Crash test results",
          "Safety feature evaluations",
          "Side impact assessments"
        ]
      },
      {
        name: "Technical Service Bulletins API",
        status: "coming_soon",
        icon: Wrench,
        endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/tsbs/",
        description: "Access manufacturer service bulletins and technical notices",
        features: [
          "Service bulletins",
          "Technical notifications",
          "Repair procedures",
          "Known issues and fixes"
        ]
      }
    ];

    return (
      <div className="space-y-6 border rounded-lg p-6 bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">NHTSA API Integration Status</h3>
          <Badge variant={connectionData ? "default" : "secondary"}>
            {connectionData ? "Connected" : "Not Connected"}
          </Badge>
        </div>
        
        <div className="divide-y">
          {apis.map((api) => (
            <div key={api.name} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <api.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      {api.name}
                      <Badge variant={api.status === 'active' ? "default" : "secondary"}>
                        {api.status === 'active' ? 'Active' : 'Coming Soon'}
                      </Badge>
                    </h4>
                  </div>
                  
                  {api.status === 'active' && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Endpoint:</p>
                      <code className="bg-muted px-2 py-1 rounded text-xs">{api.endpoint}</code>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground">{api.description}</p>
                  
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {api.features.map((feature, index) => (
                      <div key={index} className="text-sm flex items-center gap-2">
                        <span className="text-xs">•</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Currently integrated with VIN Decoder API. Additional NHTSA APIs will be added in future updates.
            For technical documentation and API specifications, visit the NHTSA API documentation portal.
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-[600px]">
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
