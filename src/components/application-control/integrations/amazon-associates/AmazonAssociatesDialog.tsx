
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAmazonAssociates } from "@/hooks/integrations/useAmazonAssociates";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AmazonAssociatesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AmazonAssociatesDialog({ isOpen, onClose }: AmazonAssociatesDialogProps) {
  const { settings, isLoading, updateSettings } = useAmazonAssociates();

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <LoadingSpinner />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Amazon Associates Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Tracking</Label>
              <p className="text-sm text-muted-foreground">Enable affiliate link tracking</p>
            </div>
            <Switch
              checked={settings?.tracking_enabled}
              onCheckedChange={(checked) => 
                updateSettings.mutate({ tracking_enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto-Link</Label>
              <p className="text-sm text-muted-foreground">Automatically convert eligible links</p>
            </div>
            <Switch
              checked={settings?.auto_link_enabled}
              onCheckedChange={(checked) => 
                updateSettings.mutate({ auto_link_enabled: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Default Marketplace</Label>
            <Select
              value={settings?.default_marketplace}
              onValueChange={(value) => 
                updateSettings.mutate({ default_marketplace: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select marketplace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="ES">Spain</SelectItem>
                <SelectItem value="IT">Italy</SelectItem>
                <SelectItem value="JP">Japan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
