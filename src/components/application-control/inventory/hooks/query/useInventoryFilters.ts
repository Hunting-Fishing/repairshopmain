
import { useState } from "react";
import type { InventoryItem } from "../../types";

interface UseInventoryFiltersProps {
  searchQuery: string;
  filters: {
    lowStock?: boolean;
    outOfStock?: boolean;
    needsReorder?: boolean;
  };
}

export function useInventoryFilters({ searchQuery, filters }: UseInventoryFiltersProps) {
  const buildQuery = (query: any) => {
    if (searchQuery) {
      query.ilike('name', `%${searchQuery}%`);
    }

    if (filters.lowStock) query.lt('quantity_in_stock', 10);
    if (filters.outOfStock) query.eq('quantity_in_stock', 0);
    if (filters.needsReorder) query.lt('quantity_in_stock', 'reorder_point');

    return query;
  };

  return { buildQuery };
}
