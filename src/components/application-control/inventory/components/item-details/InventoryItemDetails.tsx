
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, AlertTriangle, TrendingUp, History } from "lucide-react";
import type { InventoryItemWithCategory } from "../../types";
import { formatCurrency } from "@/lib/utils";

interface InventoryItemDetailsProps {
  item: InventoryItemWithCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryItemDetails({
  item,
  open,
  onOpenChange,
}: InventoryItemDetailsProps) {
  if (!item) return null;

  const totalValue = (item.quantity_in_stock || 0) * (item.unit_cost || 0);
  const isLowStock = (item.quantity_in_stock || 0) <= (item.reorder_point || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              {item.name}
            </DialogTitle>
            <Badge variant={isLowStock ? "destructive" : "secondary"}>
              {item.quantity_in_stock} in stock
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stock">Stock Details</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">SKU</span>
                      <span>{item.sku || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span>{item.category?.name || "Uncategorized"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Location</span>
                      <span>{item.location || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Barcode</span>
                      <span>{item.barcode || "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="outline">{item.status || "active"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Condition</span>
                      <span className="capitalize">{item.condition || "new"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Manufacturer</span>
                      <span>{item.manufacturer || "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {item.description && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Stock</span>
                      <span className="text-2xl font-bold">{item.quantity_in_stock}</span>
                    </div>
                    {isLowStock && (
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Low stock alert</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reorder Point</span>
                      <span>{item.reorder_point || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Reorder Quantity
                      </span>
                      <span>{item.reorder_quantity || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Unit Cost</span>
                      <span className="font-medium">
                        {formatCurrency(item.unit_cost || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Selling Price
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.selling_price || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Value</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(totalValue)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
