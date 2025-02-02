import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { InventoryItem } from "../types";

interface InventoryCardProps {
  item: InventoryItem & {
    category?: { name: string } | null;
    supplier?: { name: string } | null;
  };
}

export function InventoryCard({ item }: InventoryCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          {item.quantity_in_stock === 0 ? (
            <Badge variant="destructive">Out of Stock</Badge>
          ) : item.quantity_in_stock <= (item.reorder_point || 5) ? (
            <Badge variant="secondary">Low Stock</Badge>
          ) : null}
        </div>
        <CardDescription>SKU: {item.sku || 'N/A'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Quantity</span>
            <span className="font-medium">{item.quantity_in_stock || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Category</span>
            <span>{item.category?.name || 'Uncategorized'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Supplier</span>
            <span>{item.supplier?.name || 'No supplier'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Unit Cost</span>
            <span className="font-medium">${item.unit_cost?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <span className="font-medium text-green-600">
              ${((item.quantity_in_stock || 0) * (item.unit_cost || 0)).toFixed(2)}
            </span>
          </div>
          {item.quantity_in_stock <= (item.reorder_point || 5) && (
            <div className="mt-4 p-2 bg-yellow-50 text-yellow-800 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Reorder needed</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}