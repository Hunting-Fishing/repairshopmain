import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings2, Bell, BarChart3, Package } from "lucide-react";

export function InventorySettings() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Inventory Reports</CardTitle>
              <CardDescription>Configure automatic inventory reports and notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="low-stock-alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              Low Stock Alerts
            </Label>
            <Switch id="low-stock-alerts" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="weekly-reports">Weekly Reports</Label>
            <Switch id="weekly-reports" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="monthly-reports">Monthly Reports</Label>
            <Switch id="monthly-reports" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Default Values</CardTitle>
              <CardDescription>Set default values for inventory items</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="reorder-point">Default Reorder Point</Label>
            <Input type="number" id="reorder-point" placeholder="10" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reorder-quantity">Default Reorder Quantity</Label>
            <Input type="number" id="reorder-quantity" placeholder="20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure who receives inventory notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notify-managers">Notify Managers</Label>
            <Switch id="notify-managers" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notify-staff">Notify Staff</Label>
            <Switch id="notify-staff" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}