
import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { 
  Building2, 
  Settings, 
  Users, 
  Database, 
  MessageSquare, 
  Wrench, 
  Plug,
  FileText, 
  Bell,
  BarChart3,
  Shield
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertsDashboard } from "@/components/application-control/AlertsDashboard";
import { CustomerControl } from "@/components/application-control/CustomerControl";
import { DatabaseTab } from "@/components/application-control/database/DatabaseTab";
import { IntegrationsTab } from "@/components/application-control/IntegrationsTab";
import { CommunicationsTab } from "@/components/application-control/communications/CommunicationsTab";
import { OverviewTab } from "@/components/application-control/OverviewTab";
import { InventoryTab } from "@/components/application-control/inventory/InventoryTab";

export default function ApplicationControl() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Settings className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Application Control</h1>
                <p className="text-muted-foreground">
                  Manage settings, integrations, and system configuration
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="overflow-x-auto">
              <TabsList className="h-auto p-1 flex flex-nowrap min-w-max">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Customer</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Inventory</span>
                </TabsTrigger>
                <TabsTrigger value="database" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Database</span>
                </TabsTrigger>
                <TabsTrigger value="communications" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Communications</span>
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Alerts</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Plug className="h-4 w-4" />
                  <span>Integrations</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="space-y-4">
              <OverviewTab />
            </TabsContent>
            
            <TabsContent value="customer" className="space-y-4">
              <CustomerControl />
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4">
              <InventoryTab />
            </TabsContent>
            
            <TabsContent value="database" className="space-y-4">
              <DatabaseTab />
            </TabsContent>
            
            <TabsContent value="communications" className="space-y-4">
              <CommunicationsTab />
            </TabsContent>
            
            <TabsContent value="alerts" className="space-y-4">
              <AlertsDashboard />
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4">
              <IntegrationsTab />
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <SecurityTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// SecurityTab component for the security settings
function SecurityTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SettingsCard
          title="User Access Control"
          description="Manage user permissions and access levels"
          icon={<Users className="w-5 h-5" />}
          action={() => console.log("User access clicked")}
        />
        
        <SettingsCard
          title="Password Policies"
          description="Configure password requirements and expiration"
          icon={<Shield className="w-5 h-5" />}
          action={() => console.log("Password policies clicked")}
        />
        
        <SettingsCard
          title="Authentication Methods"
          description="Configure MFA and login methods"
          icon={<Building2 className="w-5 h-5" />}
          action={() => console.log("Authentication methods clicked")}
        />
        
        <SettingsCard
          title="Audit Logs"
          description="View system activity and security logs"
          icon={<FileText className="w-5 h-5" />}
          action={() => console.log("Audit logs clicked")}
        />
        
        <SettingsCard
          title="IP Restrictions"
          description="Manage allowed IP addresses and locations"
          icon={<Database className="w-5 h-5" />}
          action={() => console.log("IP restrictions clicked")}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Security Status</CardTitle>
          <CardDescription>Overall system security status and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium">User Access Control</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">Secure</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="font-medium">Password Policies</span>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Warning</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium">Multi-Factor Authentication</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="font-medium">API Key Security</span>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700">Action Required</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

function SettingsCard({ title, description, icon, action }: SettingsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button 
          variant="ghost" 
          className="mt-3 w-full justify-start text-primary"
          onClick={action}
        >
          Configure
        </Button>
      </CardContent>
    </Card>
  );
}

function Badge({
  variant = "default",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline"
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
