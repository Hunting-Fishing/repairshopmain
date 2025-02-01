import { useQuery } from "@tanstack/react-query";
import { Package, AlertTriangle, RefreshCcw, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function InventoryOverview() {
  const { data: stats } = useQuery({
    queryKey: ['inventory-stats'],
    queryFn: async () => {
      const { data: items, error } = await supabase
        .from('inventory_items')
        .select('quantity_in_stock, reorder_point, unit_cost')
        .throwOnError();

      if (!items) return { total: 0, lowStock: 0, reorderNeeded: 0, totalValue: 0 };

      const totalValue = items.reduce((sum, item) => {
        return sum + (item.quantity_in_stock * (item.unit_cost || 0));
      }, 0);

      return {
        total: items.length,
        lowStock: items.filter(item => item.quantity_in_stock <= item.reorder_point).length,
        reorderNeeded: items.filter(item => item.quantity_in_stock === 0).length,
        totalValue: totalValue
      };
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Overview
        </CardTitle>
        <CardDescription>Current inventory status and alerts</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Total Items</span>
            <span className="text-2xl font-bold">{stats?.total || 0}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Low Stock</span>
            <span className="text-2xl font-bold text-yellow-600">{stats?.lowStock || 0}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Reorder Needed</span>
            <span className="text-2xl font-bold text-red-600">{stats?.reorderNeeded || 0}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <span className="text-2xl font-bold text-green-600">
              ${stats?.totalValue.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}