import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryAnalytics } from "./analytics/useInventoryAnalytics";
import { InventoryChart } from "./analytics/InventoryChart";
import { MetricsCard } from "./analytics/MetricsCard";

export function InventoryAnalytics() {
  const { data, isLoading } = useInventoryAnalytics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-pulse">
          <CardHeader className="h-[100px]" />
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="h-[100px]" />
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="h-[100px]" />
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="h-[100px]" />
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Items"
          value={data.totalItems}
          description="Total inventory items"
        />
        <MetricsCard
          title="Total Value"
          value={`$${data.totalValue.toFixed(2)}`}
          description="Total inventory value"
        />
        <MetricsCard
          title="Low Stock Items"
          value={data.lowStockItems}
          description="Items below reorder point"
        />
        <MetricsCard
          title="Out of Stock"
          value={data.outOfStockItems}
          description="Items with zero quantity"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryChart data={data.categoryStats} />
        </CardContent>
      </Card>
    </div>
  );
}