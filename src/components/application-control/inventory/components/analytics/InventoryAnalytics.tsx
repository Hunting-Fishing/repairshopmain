
import { AlertTriangle, TrendingUp, Package, DollarSign, BarChart3, Activity, Clock, ShoppingCart } from "lucide-react";
import { MetricsCard } from "./MetricsCard";
import { InventoryChart } from "./InventoryChart";
import { useInventoryAnalytics } from "./useInventoryAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function InventoryAnalytics() {
  const { data: analyticsData, isLoading } = useInventoryAnalytics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[160px] w-full" />
        ))}
      </div>
    );
  }

  if (!analyticsData) return null;

  const monthlyTrends = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1398 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 3908 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 3800 },
  ];

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="trends" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Trends
        </TabsTrigger>
        <TabsTrigger value="categories" className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Categories
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Performance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Value by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryChart data={analyticsData.categoryStats} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryChart 
                data={monthlyTrends}
                type="line"
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="trends" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
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
          <Card>
            <CardHeader>
              <CardTitle>Value Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <InventoryChart 
                data={analyticsData.categoryStats} 
                type="pie"
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="categories" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="h-[100px] mt-4">
                    <InventoryChart 
                      data={[{ name: category.name, value: category.totalValue }]} 
                      type="bar"
                    />
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Turnover Rate</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <InventoryChart 
                data={monthlyTrends}
                type="line"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Stock Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <InventoryChart 
                data={analyticsData.categoryStats}
                type="bar"
              />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
