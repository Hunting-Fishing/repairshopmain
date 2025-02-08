
import { AlertTriangle, TrendingUp, Package, DollarSign, BarChart3 } from "lucide-react";
import { MetricsCard } from "./MetricsCard";
import { InventoryChart } from "./InventoryChart";
import { useInventoryAnalytics } from "./useInventoryAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function InventoryAnalytics() {
  const { data: analyticsData, isLoading } = useInventoryAnalytics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <MetricsCard
            key={i}
            title="Loading..."
            value="..."
          />
        ))}
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricsCard
            title="Total Items"
            value={analyticsData.totalItems}
            icon={Package}
            trend={{ 
              value: 12, 
              isPositive: true,
              timeFrame: "last month"
            }}
          />
          <MetricsCard
            title="Total Value"
            value={`$${analyticsData.totalValue.toFixed(2)}`}
            icon={DollarSign}
            trend={{ 
              value: 8, 
              isPositive: true,
              timeFrame: "last month"
            }}
          />
          <MetricsCard
            title="Low Stock Items"
            value={analyticsData.lowStockItems}
            icon={AlertTriangle}
            className="text-yellow-500"
            trend={{ 
              value: 5, 
              isPositive: false,
              timeFrame: "last month"
            }}
          />
          <MetricsCard
            title="Out of Stock"
            value={analyticsData.outOfStockItems}
            icon={TrendingUp}
            className="text-red-500"
            trend={{ 
              value: 3, 
              isPositive: false,
              timeFrame: "last month"
            }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Value by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryChart data={analyticsData.categoryStats} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="trends">
        <Card>
          <CardHeader>
            <CardTitle>Stock Level Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <InventoryChart 
              data={analyticsData.categoryStats} 
              type="line"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="categories">
        <div className="grid gap-4 md:grid-cols-2">
          {analyticsData.categoryStats.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Total Items</dt>
                    <dd className="text-sm font-medium">{category.totalItems}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Total Value</dt>
                    <dd className="text-sm font-medium">${category.totalValue.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Low Stock Items</dt>
                    <dd className="text-sm font-medium">{category.lowStock}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
