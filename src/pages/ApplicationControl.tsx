import { Settings2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopList } from "@/components/shops/ShopList";
import { OverviewTab } from "@/components/application-control/OverviewTab";
import { IntegrationsTab } from "@/components/application-control/IntegrationsTab";
import { InventoryTab } from "@/components/application-control/inventory/InventoryTab";

export default function ApplicationControl() {
  return (
    <div className="space-y-4">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Application Control
              </CardTitle>
              <CardDescription className="text-lg">
                Manage your application settings and configurations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Card className="mt-6">
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="inline-flex h-10 items-center justify-center space-x-2 rounded-md bg-muted p-1">
              <TabsTrigger 
                value="overview"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="shops"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
              >
                Shops
              </TabsTrigger>
              <TabsTrigger 
                value="inventory"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
              >
                Inventory
              </TabsTrigger>
              <TabsTrigger 
                value="integrations"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
              >
                Integrations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-4">
              <OverviewTab />
            </TabsContent>
            
            <TabsContent value="shops" className="mt-6 space-y-4">
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

            <TabsContent value="inventory" className="mt-6 space-y-4">
              <InventoryTab />
            </TabsContent>

            <TabsContent value="integrations" className="mt-6 space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
}