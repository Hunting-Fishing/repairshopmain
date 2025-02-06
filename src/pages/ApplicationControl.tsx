
import { Settings2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopList } from "@/components/shops/ShopList";
import { OverviewTab } from "@/components/application-control/OverviewTab";
import { IntegrationsTab } from "@/components/application-control/IntegrationsTab";
import { InventoryTab } from "@/components/application-control/inventory/InventoryTab";
import { CommunicationsTab } from "@/components/application-control/communications/CommunicationsTab";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export default function ApplicationControl() {
  const { data: userProfile } = useQuery({
    queryKey: ['current-user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      return profile;
    }
  });

  // Additional component-level protection
  if (userProfile && !['owner', 'management'].includes(userProfile.role)) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" replace />;
  }

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
      
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="shops">Shops</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
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

            <TabsContent value="communications">
              <CommunicationsTab />
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
        </CardContent>
      </Card>
    </div>
  );
}
