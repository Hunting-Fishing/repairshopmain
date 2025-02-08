
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryChart } from "../InventoryChart";
import type { CategoryStats } from "../../../types";

interface CategoriesTabProps {
  categoryStats: CategoryStats[];
}

export function CategoriesTab({ categoryStats }: CategoriesTabProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categoryStats.map((category) => (
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
  );
}
