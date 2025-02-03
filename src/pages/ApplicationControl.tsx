import { Settings2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopList } from "@/components/shops/ShopList";
import { OverviewTab } from "@/components/application-control/OverviewTab";
import { IntegrationsTab } from "@/components/application-control/IntegrationsTab";
import { InventoryTab } from "@/components/application-control/inventory/InventoryTab";

export default function ApplicationControl() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Settings2 className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Control</h1>
          <p className="text-muted-foreground">
            Manage your application settings and configurations
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shops">Shops</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        
        <TabsContent value="shops">
          <Card>
            <CardHeader>
              <CardTitle>Shop Management</CardTitle>
              <CardDescription>View and manage all registered shops</CardDescription>
            </CardHeader>
            <CardContent>
              <ShopList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryTab />
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect and manage third-party services</CardDescription>
            </CardHeader>
            <CardContent>
              <IntegrationsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}