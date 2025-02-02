import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AnalyticsData, CategoryStats } from "../../types";

export function useInventoryAnalytics() {
  return useQuery({
    queryKey: ["inventory-analytics"],
    queryFn: async (): Promise<AnalyticsData> => {
      const { data: items, error: itemsError } = await supabase
        .from("inventory_items")
        .select(`
          id,
          quantity_in_stock,
          unit_cost,
          reorder_point,
          category_id,
          inventory_categories (
            name
          )
        `);

      if (itemsError) throw itemsError;

      // Calculate analytics data
      const categoryStats: { [key: string]: CategoryStats } = {};
      let totalItems = 0;
      let totalValue = 0;
      let lowStockItems = 0;
      let outOfStockItems = 0;

      items.forEach((item) => {
        totalItems++;
        
        const quantity = item.quantity_in_stock || 0;
        const cost = item.unit_cost || 0;
        const value = quantity * cost;
        totalValue += value;

        if (quantity === 0) {
          outOfStockItems++;
        } else if (quantity <= (item.reorder_point || 0)) {
          lowStockItems++;
        }

        // Safely access the category name from the joined data
        const categoryName = item.inventory_categories?.name || "Uncategorized";
        
        if (!categoryStats[categoryName]) {
          categoryStats[categoryName] = {
            name: categoryName,
            totalItems: 0,
            totalValue: 0,
            lowStock: 0
          };
        }

        categoryStats[categoryName].totalItems++;
        categoryStats[categoryName].totalValue += value;
        if (quantity <= (item.reorder_point || 0)) {
          categoryStats[categoryName].lowStock++;
        }
      });

      return {
        categoryStats: Object.values(categoryStats),
        totalItems,
        totalValue,
        lowStockItems,
        outOfStockItems
      };
    }
  });
}