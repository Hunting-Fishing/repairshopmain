import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupplierAnalyticsOverview } from "../supplier-analytics/SupplierAnalyticsOverview";
import { useSupplierAnalytics } from "../hooks/useSupplierAnalytics";
import type { InventorySupplier } from "../../../types";
import { BarChart3, TrendingUp, Clock } from "lucide-react";

interface SupplierReportsProps {
  supplier: InventorySupplier;
}

export function SupplierReports({ supplier }: SupplierReportsProps) {
  const { analytics, isLoading } = useSupplierAnalytics(supplier.id);

  if (isLoading || !analytics) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierAnalyticsOverview analytics={analytics} />
        </CardContent>
      </Card>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance Metrics
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Historical Trends
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Delivery Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {/* Performance metrics content */}
              <div className="text-sm text-muted-foreground">
                Detailed performance metrics will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {/* Historical trends content */}
              <div className="text-sm text-muted-foreground">
                Historical trend analysis will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {/* Delivery analysis content */}
              <div className="text-sm text-muted-foreground">
                Delivery performance analysis will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}