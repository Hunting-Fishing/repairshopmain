
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Edit } from "lucide-react";
import type { InventoryItem, InventoryItemStatus } from "../types";
import { getStatusColor, getStatusLabel } from "./utils/statusUtils";

interface InventoryCardProps {
  item: InventoryItem & {
    category?: { name: string } | null;
    supplier?: { name: string } | null;
  };
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onEdit?: (item: InventoryItem) => void;
}

export function InventoryCard({ 
  item, 
  selected = false, 
  onSelect, 
  onEdit 
}: InventoryCardProps) {
  const needsReorder = item.quantity_in_stock <= (item.reorder_point || 5);
  
  return (
    <Card className="hover:shadow-md transition-shadow relative">
      {onSelect && (
        <div className="absolute top-4 right-4 z-10">
          <Checkbox checked={selected} onCheckedChange={onSelect} />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(item.status as InventoryItemStatus)}>
              {getStatusLabel(item.status as InventoryItemStatus)}
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
      </CardHeader>
      <CardContent>
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
        
        {needsReorder && (
          <div className="mt-4 p-2 bg-yellow-50 text-yellow-800 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Reorder needed</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
