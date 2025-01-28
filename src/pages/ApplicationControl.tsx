import { Settings2, Users, Building2, Car, Wrench, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopList } from "@/components/shops/ShopList";

export default function ApplicationControl() {
  const navigate = useNavigate();

  const controlPanels = [
    {
      title: "Shop Management",
      description: "Manage shop details, business hours, and settings",
      icon: Building2,
      action: () => navigate("/shops"),
    },
    {
      title: "Staff Management",
      description: "Manage employees, roles, and permissions",
      icon: Users,
      action: () => navigate("/staff"),
    },
    {
      title: "Vehicle Management",
      description: "Configure vehicle types and service options",
      icon: Car,
      action: () => navigate("/vehicles"),
    },
    {
      title: "Service Management",
      description: "Define service types, pricing, and durations",
      icon: Wrench,
      action: () => navigate("/services"),
    },
    {
      title: "Calendar Settings",
      description: "Configure business hours and scheduling rules",
      icon: Calendar,
      action: () => navigate("/calendar-settings"),
    }
  ];

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
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {controlPanels.map((panel) => (
              <Card key={panel.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <panel.icon className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <CardTitle>{panel.title}</CardTitle>
                    <CardDescription>{panel.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={panel.action}
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Database</span>
                    <span className="text-sm text-green-500">Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">API Services</span>
                    <span className="text-sm text-green-500">Operational</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="text-sm text-green-500">Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
      </Tabs>
    </div>
  );
}