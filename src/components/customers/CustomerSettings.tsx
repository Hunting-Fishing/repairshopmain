import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BarChart3, History, Layout, UserPlus, Columns2, Rows3, Grid2X2 } from "lucide-react";
import { LoyaltyTab } from "./loyalty/LoyaltyTab";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export function CustomerSettings() {
  const [viewMode, setViewMode] = useState("grid");
  const [showDetails, setShowDetails] = useState(true);
  const [columnsCount, setColumnsCount] = useState("3");

  return (
    <Tabs defaultValue="layout" className="space-y-4">
      <TabsList>
        <TabsTrigger value="layout">
          <Layout className="h-4 w-4 mr-2" />
          Layout
        </TabsTrigger>
        <TabsTrigger value="loyalty">
          <Award className="h-4 w-4 mr-2" />
          Loyalty Program
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

      <TabsContent value="layout">
        <Card>
          <CardHeader>
            <CardTitle>Layout Settings</CardTitle>
            <CardDescription>
              Customize how customer information is displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">View Mode</h3>
                <RadioGroup
                  value={viewMode}
                  onValueChange={setViewMode}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="grid" id="grid" />
                    <Label htmlFor="grid" className="flex items-center gap-1">
                      <Grid2X2 className="h-4 w-4" /> Grid
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="columns" id="columns" />
                    <Label htmlFor="columns" className="flex items-center gap-1">
                      <Columns2 className="h-4 w-4" /> Columns
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rows" id="rows" />
                    <Label htmlFor="rows" className="flex items-center gap-1">
                      <Rows3 className="h-4 w-4" /> Rows
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Grid Columns</h3>
                <RadioGroup
                  value={columnsCount}
                  onValueChange={setColumnsCount}
                  className="flex gap-4"
                >
                  {["2", "3", "4"].map((count) => (
                    <div key={count} className="flex items-center space-x-2">
                      <RadioGroupItem value={count} id={`col-${count}`} />
                      <Label htmlFor={`col-${count}`}>{count} Columns</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-details">Show Details</Label>
                  <p className="text-sm text-muted-foreground">
                    Display additional customer information in cards
                  </p>
                </div>
                <Switch
                  id="show-details"
                  checked={showDetails}
                  onCheckedChange={setShowDetails}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="loyalty">
        <LoyaltyTab />
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