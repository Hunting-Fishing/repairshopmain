import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { NhtsaVinDialog } from "./NhtsaVinDialog";
import { NhtsaApiDetails } from "./api-details/NhtsaApiDetails";
import { IntegrationDialogProps } from "./types";
import { IntegrationResources } from "./cards/IntegrationResources";
import { useIntegrationConnection } from "@/hooks/integrations/useIntegrationConnection";
import { AmazonAssociatesDialog } from "./amazon-associates/AmazonAssociatesDialog";

export const IntegrationDialog = ({ isOpen, onClose, integration }: IntegrationDialogProps) => {
  const { toast } = useToast();
  const [showNhtsaDialog, setShowNhtsaDialog] = useState(false);
  const [showAmazonDialog, setShowAmazonDialog] = useState(false);
  const { data: connectionData } = useIntegrationConnection(integration.title);

  const handleConnect = () => {
    if (integration.title === "NHTSA Database") {
      setShowNhtsaDialog(true);
      return;
    }
    if (integration.title === "Amazon Associates") {
      setShowAmazonDialog(true);
      return;
    }
    try {
      integration.onConnect();
      toast({ title: "Connection initiated", description: "Please complete the authentication process." });
    } catch (error) {
      toast({ title: "Connection failed", description: "There was an error connecting to the service.", variant: "destructive" });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <integration.icon className="h-6 w-6" />
              {integration.title}
            </DialogTitle>
          </DialogHeader>
          {integration.title === "NHTSA Database" && <NhtsaApiDetails connectionData={connectionData} />}
          <IntegrationResources websiteUrl={integration.websiteUrl} documentationUrl={integration.documentationUrl} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={handleConnect}>
              {integration.status === 'connected' ? 'Manage' : 'Connect'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <NhtsaVinDialog isOpen={showNhtsaDialog} onClose={() => { setShowNhtsaDialog(false); onClose(); }} />
      <AmazonAssociatesDialog isOpen={showAmazonDialog} onClose={() => { setShowAmazonDialog(false); onClose(); }} />
    </>
  );
};