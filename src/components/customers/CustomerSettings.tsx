import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BarChart3, History, Layout, UserPlus, Settings2, Eye } from "lucide-react";
import { useState } from "react";
import { LoyaltyTab } from "./loyalty/LoyaltyTab";
import { LayoutSettings } from "./settings/LayoutSettings";
import { DisplaySettings } from "./settings/DisplaySettings";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function CustomerSettings() {
  // Layout settings state
  const [viewMode, setViewMode] = useState("grid");
  const [columnsCount, setColumnsCount] = useState("3");
  const [showDetails, setShowDetails] = useState(true);
  const [cardSize, setCardSize] = useState("normal");
  const [sortOrder, setSortOrder] = useState("name");

  // Display settings state
  const [theme, setTheme] = useState("system");
  const [showAvatars, setShowAvatars] = useState(true);
  const [showStatus, setShowStatus] = useState(true);
  const [density, setDensity] = useState("comfortable");

  return (
    <Tabs defaultValue="layout" className="space-y-4">
      <TabsList>
        <TabsTrigger value="layout">
          <Layout className="h-4 w-4 mr-2" />
          Layout
        </TabsTrigger>
        <TabsTrigger value="display">
          <Eye className="h-4 w-4 mr-2" />
          Display
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
        <LayoutSettings
          viewMode={viewMode}
          setViewMode={setViewMode}
          columnsCount={columnsCount}
          setColumnsCount={setColumnsCount}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          cardSize={cardSize}
          setCardSize={setCardSize}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </TabsContent>

      <TabsContent value="display">
        <DisplaySettings
          theme={theme}
          setTheme={setTheme}
          showAvatars={showAvatars}
          setShowAvatars={setShowAvatars}
          showStatus={showStatus}
          setShowStatus={setShowStatus}
          density={density}
          setDensity={setDensity}
        />
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