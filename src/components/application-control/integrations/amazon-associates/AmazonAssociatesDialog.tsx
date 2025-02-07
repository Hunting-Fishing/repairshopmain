
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAmazonAssociates } from "@/hooks/integrations/useAmazonAssociates";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmazonProductSearch } from "./AmazonProductSearch";

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Amazon Associates Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API Settings</TabsTrigger>
            <TabsTrigger value="search">Product Search</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
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
              <Label>Partner Tag</Label>
              <Input
                value={settings?.partner_tag || ''}
                onChange={(e) => updateSettings.mutate({ partner_tag: e.target.value })}
                placeholder="Enter your Partner Tag"
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
                  {Object.keys(settings?.marketplace_endpoints || {}).map((market) => (
                    <SelectItem key={market} value={market}>
                      {market}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <div className="space-y-2">
              <Label>API Region</Label>
              <Input
                value={settings?.api_region}
                onChange={(e) => updateSettings.mutate({ api_region: e.target.value })}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label>Partner Type</Label>
              <Input
                value={settings?.partner_type}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label>API Version</Label>
              <Input
                value={settings?.api_version}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label>Request Quota</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Hourly: {settings?.request_quota.used_hourly}/{settings?.request_quota.hourly}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Daily: {settings?.request_quota.used_daily}/{settings?.request_quota.daily}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <AmazonProductSearch />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
