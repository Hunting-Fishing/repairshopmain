import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, TrendingUp, Package, DollarSign } from "lucide-react";

interface CategoryStats {
  name: string;
  totalItems: number;
  totalValue: number;
  lowStock: number;
}

interface AnalyticsData {
  categoryStats: CategoryStats[];
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
}

interface InventoryItemWithCategory {
  id: string;
  name: string;
  quantity_in_stock: number | null;
  unit_cost: number | null;
  reorder_point: number | null;
  category: {
    name: string | null;
  } | null;
}

export function InventoryAnalytics() {
  const { data: analyticsData } = useQuery<AnalyticsData>({
    queryKey: ['inventory-analytics'],
    queryFn: async () => {
      const { data: items, error } = await supabase
        .from('inventory_items')
        .select(`
          id,
          name,
          quantity_in_stock,
          unit_cost,
          reorder_point,
          category:category_id(name)
        `)
        .throwOnError();

      if (!items) return null;

      const categoryData: Record<string, CategoryStats> = (items as InventoryItemWithCategory[]).reduce((acc, item) => {
        const category = item.category?.name || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = {
            name: category,
            totalItems: 0,
            totalValue: 0,
            lowStock: 0
          };
        }
        acc[category].totalItems++;
        acc[category].totalValue += (item.quantity_in_stock || 0) * (item.unit_cost || 0);
        if (item.quantity_in_stock <= (item.reorder_point || 5)) {
          acc[category].lowStock++;
        }
        return acc;
      }, {} as Record<string, CategoryStats>);

      return {
        categoryStats: Object.values(categoryData),
        totalItems: items.length,
        totalValue: items.reduce((sum, item) => 
          sum + (item.quantity_in_stock || 0) * (item.unit_cost || 0), 0
        ),
        lowStockItems: items.filter(item => 
          item.quantity_in_stock <= (item.reorder_point || 5)
        ).length,
        outOfStockItems: items.filter(item => 
          item.quantity_in_stock === 0
        ).length
      };
    }
  });

  if (!analyticsData) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{analyticsData.lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{analyticsData.outOfStockItems}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory by Category</CardTitle>
          <CardDescription>Distribution of items and value across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
                <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="totalItems" fill="#8884d8" name="Total Items" />
                <Bar yAxisId="right" dataKey="lowStock" fill="#82ca9d" name="Low Stock" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}