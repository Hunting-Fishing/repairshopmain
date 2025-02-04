import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSupplierAutomation } from "../hooks/useSupplierAutomation";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";
import type { SupplierAutomationSettings } from "../../../types";

interface SupplierAutomationProps {
  supplierId: string;
}

export function SupplierAutomation({ supplierId }: SupplierAutomationProps) {
  const { settings, isLoading, updateSettings } = useSupplierAutomation(supplierId);
  const [localSettings, setLocalSettings] = useState<SupplierAutomationSettings | null>(settings);

  const handleSave = () => {
    if (localSettings) {
      updateSettings.mutate(localSettings, {
        onSuccess: () => {
          toast.success("Automation settings updated successfully");
        },
        onError: () => {
          toast.error("Failed to update automation settings");
        }
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Automation Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reorderThreshold">Reorder Threshold</Label>
              <Input
                id="reorderThreshold"
                type="number"
                value={localSettings?.reorder_threshold || 0}
                onChange={(e) =>
                  setLocalSettings(prev => ({
                    ...prev!,
                    reorder_threshold: parseInt(e.target.value)
                  }))
                }
              />
            </div>
            
            <div>
              <Label htmlFor="minStockThreshold">Minimum Stock Threshold</Label>
              <Input
                id="minStockThreshold"
                type="number"
                value={localSettings?.min_stock_threshold || 0}
                onChange={(e) =>
                  setLocalSettings(prev => ({
                    ...prev!,
                    min_stock_threshold: parseInt(e.target.value)
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentReminder">Payment Reminder (days)</Label>
              <Input
                id="paymentReminder"
                type="number"
                value={localSettings?.payment_reminder_days || 7}
                onChange={(e) =>
                  setLocalSettings(prev => ({
                    ...prev!,
                    payment_reminder_days: parseInt(e.target.value)
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="contractReminder">Contract Reminder (days)</Label>
              <Input
                id="contractReminder"
                type="number"
                value={localSettings?.contract_reminder_days || 30}
                onChange={(e) =>
                  setLocalSettings(prev => ({
                    ...prev!,
                    contract_reminder_days: parseInt(e.target.value)
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoReorder">Auto Reorder</Label>
              <Switch
                id="autoReorder"
                checked={localSettings?.auto_reorder || false}
                onCheckedChange={(checked) =>
                  setLocalSettings(prev => ({
                    ...prev!,
                    auto_reorder: checked
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoPayment">Auto Payment</Label>
              <Switch
                id="autoPayment"
                checked={localSettings?.auto_payment || false}
                onCheckedChange={(checked) =>
                  setLocalSettings(prev => ({
                    ...prev!,
                    auto_payment: checked
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <Switch
                id="emailNotifications"
                checked={localSettings?.notification_preferences?.email || false}
                onCheckedChange={(checked) =>
                  setLocalSettings(prev => ({
                    ...prev!,
                    notification_preferences: {
                      ...prev!.notification_preferences,
                      email: checked
                    }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="inAppNotifications">In-App Notifications</Label>
              <Switch
                id="inAppNotifications"
                checked={localSettings?.notification_preferences?.in_app || false}
                onCheckedChange={(checked) =>
                  setLocalSettings(prev => ({
                    ...prev!,
                    notification_preferences: {
                      ...prev!.notification_preferences,
                      in_app: checked
                    }
                  }))
                }
              />
            </div>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleSave}
          disabled={updateSettings.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}