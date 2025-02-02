import { AlertTriangle, TrendingUp, Package, DollarSign } from "lucide-react";
import { MetricsCard } from "./MetricsCard";
import { InventoryChart } from "./InventoryChart";
import { useInventoryAnalytics } from "./analytics/useInventoryAnalytics";

export function InventoryAnalytics() {
  const { data: analyticsData } = useInventoryAnalytics();

  if (!analyticsData) return null;

  return (
    <div className="space-y-4">
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

      <InventoryChart data={analyticsData.categoryStats} />
    </div>
  );
}