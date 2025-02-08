
import { Package, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsCard } from "../MetricsCard";
import { InventoryChart } from "../InventoryChart";
import type { CategoryStats } from "../../../types";

interface OverviewTabProps {
  analyticsData: {
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    categoryStats: CategoryStats[];
  };
  monthlyTrends: Array<{ name: string; value: number }>;
}

export function OverviewTab({ analyticsData, monthlyTrends }: OverviewTabProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}
