
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InventoryItem } from "../types";
import { logInventoryProblems } from "./utils/inventoryAnalytics";

interface UseInventoryQueryProps {
  searchQuery: string;
  filters: {
    lowStock?: boolean;
    outOfStock?: boolean;
    needsReorder?: boolean;
  };
  currentPage: number;
  itemsPerPage: number;
  sortField: 'name' | 'quantity_in_stock' | 'unit_cost';
  sortOrder: 'asc' | 'desc';
}

export function useInventoryQuery({
  searchQuery,
  filters,
  currentPage,
  itemsPerPage,
  sortField,
  sortOrder,
}: UseInventoryQueryProps) {
  return useQuery({
    queryKey: ['inventory-items', searchQuery, filters, currentPage, sortField, sortOrder],
    queryFn: async () => {
      const query = supabase
        .from('inventory_items')
        .select(`
          *,
          category:category_id(name),
          supplier:supplier_id(name)
        `)
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (searchQuery) {
        query.ilike('name', `%${searchQuery}%`);
      }

      if (filters.lowStock) query.lt('quantity_in_stock', 10);
      if (filters.outOfStock) query.eq('quantity_in_stock', 0);
      if (filters.needsReorder) query.lt('quantity_in_stock', 'reorder_point');

      const start = (currentPage - 1) * itemsPerPage;
      query.range(start, start + itemsPerPage - 1);

      const { data, error, count } = await query.throwOnError();
      
      if (error) throw error;
      if (data) logInventoryProblems(data);
      
      return { items: data, total: count || 0 };
    }
  });
}
