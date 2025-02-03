import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings2, Bell, BarChart3, Upload, Download, AlertCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function InventorySettings() {
  const { toast } = useToast();
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      toast({
        title: "File selected",
        description: `${file.name} ready for upload`
      });
    }
  };

  const handleBatchUpload = () => {
    if (!csvFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a CSV file first"
      });
      return;
    }
    // Implement batch upload logic here
    toast({
      title: "Upload started",
      description: "Processing your inventory data..."
    });
  };

  const handleBatchDownload = () => {
    // Implement CSV download logic here
    toast({
      title: "Download started",
      description: "Preparing your inventory data..."
    });
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Configure inventory alerts and notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="critical-stock" className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-destructive" />
              Critical Stock Level Alerts
            </Label>
            <Switch id="critical-stock" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="weekly-inventory">Weekly Inventory Summary</Label>
            <Switch id="weekly-inventory" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="price-changes">Price Change Notifications</Label>
            <Switch id="price-changes" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="supplier-updates">Supplier Updates</Label>
            <Switch id="supplier-updates" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Batch Operations</CardTitle>
              <CardDescription>Manage inventory data in bulk</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Upload Inventory Data</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button
                  onClick={handleBatchUpload}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file to update multiple inventory items at once
              </p>
            </div>

            <div className="space-y-2">
              <Label>Download Current Inventory</Label>
              <Button
                onClick={handleBatchDownload}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export to CSV
              </Button>
              <p className="text-sm text-muted-foreground">
                Download your current inventory data as a CSV file
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Inventory Reports</CardTitle>
              <CardDescription>Configure automatic inventory reports</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="low-stock-reports">Low Stock Reports</Label>
            <Switch id="low-stock-reports" />
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
    </div>
  );
}