import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BarChart3, History, Layout, UserPlus } from "lucide-react";

export function CustomerSettings() {
  return (
    <Tabs defaultValue="loyalty" className="space-y-4">
      <TabsList>
        <TabsTrigger value="loyalty">
          <Award className="h-4 w-4 mr-2" />
          Loyalty Program
        </TabsTrigger>
        <TabsTrigger value="layout">
          <Layout className="h-4 w-4 mr-2" />
          Layout
        </TabsTrigger>
        <TabsTrigger value="history">
          <History className="h-4 w-4 mr-2" />
          History
        </TabsTrigger>
        <TabsTrigger value="reports">
          <BarChart3 className="h-4 w-4 mr-2" />
          Reports
        </TabsTrigger>
        <TabsTrigger value="referrals">
          <UserPlus className="h-4 w-4 mr-2" />
          Referrals
        </TabsTrigger>
      </TabsList>

      <TabsContent value="loyalty">
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program Settings</CardTitle>
            <CardDescription>
              Configure your customer loyalty program settings and rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Tier System</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <h4 className="font-medium">Bronze</h4>
                  <p className="text-sm text-muted-foreground">0-1000 points</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium">Silver</h4>
                  <p className="text-sm text-muted-foreground">1001-5000 points</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium">Gold</h4>
                  <p className="text-sm text-muted-foreground">5001+ points</p>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Point System</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-medium">Earning Points</h4>
                  <p className="text-sm text-muted-foreground">$1 spent = 1 point</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium">Redeeming Points</h4>
                  <p className="text-sm text-muted-foreground">100 points = $5 off</p>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="layout">
        <Card>
          <CardHeader>
            <CardTitle>Layout Settings</CardTitle>
            <CardDescription>
              Customize how customer information is displayed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Layout settings coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Customer History</CardTitle>
            <CardDescription>
              View customer interaction history and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customer history tracking coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reports</CardTitle>
            <CardDescription>
              Generate and view customer analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customer reporting features coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="referrals">
        <Card>
          <CardHeader>
            <CardTitle>Customer Referrals</CardTitle>
            <CardDescription>
              Track and manage customer referral programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Referral tracking system coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
