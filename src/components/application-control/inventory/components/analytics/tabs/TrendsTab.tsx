
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryChart } from "../InventoryChart";
import type { CategoryStats } from "../../../types";

interface TrendsTabProps {
  categoryStats: CategoryStats[];
}

export function TrendsTab({ categoryStats }: TrendsTabProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Stock Level Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <InventoryChart 
            data={categoryStats} 
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
            data={categoryStats} 
            type="pie"
          />
        </CardContent>
      </Card>
    </div>
  );
}
