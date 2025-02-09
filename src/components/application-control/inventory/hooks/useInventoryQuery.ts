
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useInventoryFilters } from "./query/useInventoryFilters";
import { useInventorySort } from "./query/useInventorySort";
import { logInventoryProblems } from "./utils/inventoryAnalytics";
import type { InventoryItem } from "../types";

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
  const { buildQuery } = useInventoryFilters({ searchQuery, filters });

  return useQuery({
    queryKey: ['inventory-items', searchQuery, filters, currentPage, sortField, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from('inventory_items')
        .select(`
          *,
          category:category_id(name),
          supplier:supplier_id(name)
        `);

      query = buildQuery(query);
      query = useInventorySort(query, sortField, sortOrder);

      const start = (currentPage - 1) * itemsPerPage;
      query = query.range(start, start + itemsPerPage - 1);

      const { data, error, count } = await query.throwOnError();
      
      if (error) throw error;
      if (data) logInventoryProblems(data);
      
      return { items: data, total: count || 0 };
    }
  });
}
