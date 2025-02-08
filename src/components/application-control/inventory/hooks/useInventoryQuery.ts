
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  return useQuery({
    queryKey: ['inventory-items', searchQuery, filters, currentPage, sortField, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from('inventory_items')
        .select(`
          *,
          category:category_id(name),
          supplier:supplier_id(name)
        `)
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (filters.lowStock) {
        query = query.lt('quantity_in_stock', 10);
      }
      if (filters.outOfStock) {
        query = query.eq('quantity_in_stock', 0);
      }
      if (filters.needsReorder) {
        query = query.lt('quantity_in_stock', 'reorder_point');
      }

      const start = (currentPage - 1) * itemsPerPage;
      query = query.range(start, start + itemsPerPage - 1);

      const { data, error, count } = await query.throwOnError();
      
      if (error) throw error;

      // Log inventory problems
      if (data) {
        const problems = data.reduce((issues, item) => {
          if (item.quantity_in_stock === 0) {
            issues.outOfStock.push(item.name);
          } else if (item.quantity_in_stock < (item.reorder_point || 10)) {
            issues.lowStock.push(item.name);
          }
          if (!item.supplier_id) {
            issues.noSupplier.push(item.name);
          }
          if (item.unit_cost === null || item.unit_cost === 0) {
            issues.noCost.push(item.name);
          }
          return issues;
        }, {
          outOfStock: [] as string[],
          lowStock: [] as string[],
          noSupplier: [] as string[],
          noCost: [] as string[]
        });

        console.log('Inventory Analysis:', {
          total: data.length,
          problems,
          totalValue: data.reduce((sum, item) => 
            sum + ((item.quantity_in_stock || 0) * (item.unit_cost || 0)), 0
          ),
        });
      }
      
      return { items: data, total: count || 0 };
    }
  });
}
