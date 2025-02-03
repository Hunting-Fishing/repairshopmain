import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function InventorySettings() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Reports</CardTitle>
          <CardDescription>Configure automatic inventory reports and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
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
          <CardTitle>Default Values</CardTitle>
          <CardDescription>Set default values for inventory items</CardDescription>
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
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure who receives inventory notifications</CardDescription>
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