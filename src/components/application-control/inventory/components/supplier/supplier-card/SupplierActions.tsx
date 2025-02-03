import { Package, Truck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InventorySupplier } from "../../../types";

interface SupplierActionsProps {
  supplier: InventorySupplier;
}

export function SupplierActions({ supplier }: SupplierActionsProps) {
  return (
    <div className="pt-4 border-t space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="w-full">
          <Package className="h-4 w-4 mr-2" />
          Products
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          <Truck className="h-4 w-4 mr-2" />
          Orders
        </Button>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <ShoppingCart className="h-4 w-4" />
          <span>Products: 0</span>
        </div>
        <div className="flex items-center gap-1">
          <Package className="h-4 w-4" />
          <span>In Stock: 0</span>
        </div>
      </div>

      {supplier.notes && (
        <div className="pt-3 text-sm text-muted-foreground border-t">
          {supplier.notes}
        </div>
      )}
    </div>
  );
}