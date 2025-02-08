
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryChart } from "../InventoryChart";
import type { CategoryStats } from "../../../types";

interface PerformanceTabProps {
  monthlyTrends: Array<{ name: string; value: number }>;
  categoryStats: CategoryStats[];
}

export function PerformanceTab({ monthlyTrends, categoryStats }: PerformanceTabProps) {
  return (
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
            data={categoryStats}
            type="bar"
          />
        </CardContent>
      </Card>
    </div>
  );
}
