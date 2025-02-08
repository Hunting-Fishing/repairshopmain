
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Edit } from "lucide-react";
import type { InventoryItem } from "../types";

interface InventoryCardProps {
  item: InventoryItem & {
    category?: { name: string } | null;
    supplier?: { name: string } | null;
  };
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onEdit?: (item: InventoryItem) => void;
}

export function InventoryCard({ item, selected = false, onSelect, onEdit }: InventoryCardProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      needs_attention: "bg-orange-500 hover:bg-orange-600",
      active: "bg-blue-500 hover:bg-blue-600",
      processed: "bg-green-500 hover:bg-green-600",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500 hover:bg-gray-600";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      needs_attention: "Waiting for parts",
      active: "In work",
      processed: "Done",
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Card className="hover:shadow-md transition-shadow relative">
      {onSelect && (
        <div className="absolute top-4 right-4 z-10">
          <Checkbox
            checked={selected}
            onCheckedChange={onSelect}
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(item.status)}>
              {getStatusLabel(item.status)}
            </Badge>
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(item)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <CardDescription>SKU: {item.sku || 'N/A'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{item.category?.name || 'Uncategorized'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="font-medium">{item.quantity_in_stock || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unit Cost</p>
              <p className="font-medium">${item.unit_cost?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="font-medium text-green-600">
                ${((item.quantity_in_stock || 0) * (item.unit_cost || 0)).toFixed(2)}
              </p>
            </div>
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
