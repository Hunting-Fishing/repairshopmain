import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InventoryItemWithCategory, AnalyticsData, CategoryStats } from "../../types";

export function useInventoryAnalytics() {
  return useQuery<AnalyticsData>({
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

      const typedItems = items as unknown as InventoryItemWithCategory[];

      // Group items by category and calculate stats
      const categoryData: Record<string, CategoryStats> = typedItems.reduce((acc, item) => {
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

      // Calculate total metrics
      const totalValue = typedItems.reduce((sum, item) => 
        sum + (item.quantity_in_stock || 0) * (item.unit_cost || 0), 0
      );

      const lowStockItems = typedItems.filter(item => 
        item.quantity_in_stock <= (item.reorder_point || 5)
      ).length;

      const outOfStockItems = typedItems.filter(item => 
        item.quantity_in_stock === 0
      ).length;

      return {
        categoryStats: Object.values(categoryData),
        totalItems: typedItems.length,
        totalValue,
        lowStockItems,
        outOfStockItems
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}